#!/usr/bin/env python3
"""Small-fixture regression for packaging safety and archive reproducibility."""
import hashlib,importlib.util,json,pathlib,sys,tarfile,tempfile,unittest
sys.dont_write_bytecode=True
HERE=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
spec=importlib.util.spec_from_file_location('container_package',HERE/'package.py');p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)

class PackageTests(unittest.TestCase):
 def fixture(self,root,extra=None):
  files={'index.html':b'<head></head>','app.js':b'console.log("fixture")'}
  if extra:files.update(extra)
  rows=[{'path':name,'sha256':p.digest(data)} for name,data in sorted(files.items())]
  release=p.digest(json.dumps([[r['path'],r['sha256']] for r in rows],separators=(',',':')).encode())
  for name,data in files.items():target=root/'releases'/release/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
  (root/'index.html').write_text(f'<head><base href="./releases/{release}/"></head>')
  (root/'release-integrity.json').write_text(json.dumps({'schema':1,'release':release,'base':f'./releases/{release}/','entries':['index.html'],'files':rows}))
  return release
 def test_v077_defaults_and_registry_guidance(self):
  source=(HERE/'package.py').read_text()
  self.assertIn("--version',default='0.77'",source)
  self.assertIn('ARG GAME_VERSION=0.77',(HERE/'Dockerfile').read_text())
  readme=(HERE/'README.zh-CN.md').read_text()
  self.assertIn('# 长路未尽 · v0.77 便携容器',readme)
  self.assertIn('docker pull saka6/endlessstory:v0.77',readme)
  self.assertIn('发布状态：待推送及核验',readme)
  self.assertIn('changlu-weijin:0.77-<release前12位>-amd64',readme)
  self.assertIn('私有镜像仓库只限制',readme)
  self.assertIn('不为运行后的游戏提供登录鉴权',readme)
  self.assertNotIn('本包 v0.76',readme)
  self.assertIn("tagbase=f'changlu-weijin:{args.version}-{args.release[:12]}'",source)
  self.assertIn('pull_policy: never',(HERE/'compose.yaml').read_text())
  self.assertIn('docker load --input changlu-images.tar.gz',(HERE/'start.sh').read_text())
 def test_valid_release_and_frozen_hash(self):
  with tempfile.TemporaryDirectory() as td:
   root=pathlib.Path(td);h=self.fixture(root);report,files=p.validate_release(root,h);self.assertEqual(report['release'],h);self.assertEqual(len(files),4)
   with self.assertRaisesRegex(ValueError,'hash mismatch'):p.validate_release(root,'f'*64)
   (root/'releases'/h/'app.js').write_bytes(b'mutated')
   with self.assertRaisesRegex(ValueError,'checksum mismatch'):p.validate_release(root,h)
 def test_bundled_entry_identity(self):
  with tempfile.TemporaryDirectory() as td:
   root=pathlib.Path(td)
   original=b'<head><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="more.css"></head><script type="module" src="app.js"></script>'
   files={'index.html':original,'app.js':b'original','style.css':b'a{}','more.css':b'b{}','index.bundle.js':b'bundle','index.bundle.css':b'a{}b{}'}
   rows=[{'path':k,'sha256':p.digest(v)} for k,v in sorted(files.items())]
   html=b'<head><link rel="stylesheet" href="index.bundle.css"></head><script type="module" src="index.bundle.js"></script>'
   h=p.digest(json.dumps({'files':[[r['path'],r['sha256']] for r in rows],'entries':[['index.html',p.digest(html)]]},separators=(',',':')).encode())
   report={'schema':1,'release':h,'base':f'./releases/{h}/','entries':['index.html'],'files':rows,'optimization':{'kind':'esbuild-esm-css','entries':[{'path':'index.html','script':'index.bundle.js','stylesheet':'index.bundle.css'}]}}
   for k,v in files.items():target=root/'releases'/h/k;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(v)
   (root/'index.html').write_bytes(html.replace(b'<head>',f'<head><base href="./releases/{h}/">'.encode()))
   (root/'release-integrity.json').write_text(json.dumps(report))
   self.assertEqual(p.validate_release(root,h)[0]['release'],h)
   report['optimization']['entries'][0]['script']='wrong.bundle.js';(root/'release-integrity.json').write_text(json.dumps(report))
   with self.assertRaisesRegex(ValueError,'bundle identity'):p.validate_release(root,h)
 def test_no_extra_or_symlink(self):
  with tempfile.TemporaryDirectory() as td:
   root=pathlib.Path(td);h=self.fixture(root);(root/'extra.json').write_text('{}')
   with self.assertRaisesRegex(ValueError,'unexpected'):p.validate_release(root,h)
   (root/'extra.json').unlink();(root/'secret').symlink_to('/etc/passwd')
   with self.assertRaisesRegex(ValueError,'symlink'):p.validate_release(root,h)
 def test_no_private_qa_or_hidden_paths(self):
  for name in ['.env','.git/config','.openai/config','qa/test.png','races/goblin/art-qa.json','races/elf/canonical-source.md','native-proof.png','token.pem']:
   with self.subTest(name=name),tempfile.TemporaryDirectory() as td:
    root=pathlib.Path(td);h=self.fixture(root,{name:b'not public'})
    with self.assertRaises(ValueError):p.validate_release(root,h)
  for name in ['../escape','/absolute','nested/../escape','nested\\escape']:
   self.assertFalse(p.public_name(name),name)
 def test_reject_private_metadata_content(self):
  with tempfile.TemporaryDirectory() as td:
   root=pathlib.Path(td);h=self.fixture(root,{'generation.json':b'{"sourcePath":"/workspace/private/source.png"}'})
   with self.assertRaisesRegex(ValueError,'private metadata'):p.validate_release(root,h)
 def test_deterministic_read_only_tar(self):
  with tempfile.TemporaryDirectory() as td:
   root=pathlib.Path(td);files={'site/index.html':(b'hi',0o444),'game-server':(b'ELFfixture',0o555)}
   p.make_tar(root/'a.tar',files);p.make_tar(root/'b.tar',files);self.assertEqual((root/'a.tar').read_bytes(),(root/'b.tar').read_bytes())
   p.gzip_file(root/'a.tar',root/'a.gz');p.gzip_file(root/'b.tar',root/'b.gz');self.assertEqual((root/'a.gz').read_bytes(),(root/'b.gz').read_bytes())
   with tarfile.open(root/'a.tar') as t:
    for m in t.getmembers():self.assertFalse(m.mode&0o222);self.assertEqual(m.uid,0);self.assertEqual(m.mtime,0)
if __name__=='__main__':unittest.main()
