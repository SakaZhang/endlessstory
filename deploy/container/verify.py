#!/usr/bin/env python3
"""Offline, read-only validation. Does not claim that docker load/run was tested."""
import gzip,hashlib,io,json,pathlib,re,sys,tarfile

sys.dont_write_bytecode=True
from release_identity import release_identity

def sha(data):return hashlib.sha256(data).hexdigest()
def require(value,message):
    if not value:raise ValueError(message)
def blob(archive,descriptor):
    digest=descriptor['digest'];require(re.fullmatch(r'sha256:[a-f0-9]{64}',digest),'invalid descriptor')
    data=archive.extractfile('blobs/sha256/'+digest.split(':')[1]).read()
    require(len(data)==descriptor['size'] and 'sha256:'+sha(data)==digest,'blob size/digest mismatch');return data

def verify(root):
    root=pathlib.Path(root);info=json.loads((root/'PACKAGE-INFO.json').read_text());release=info['release']
    for line in (root/'SHA256SUMS').read_text().splitlines():
        expected,name=line.split('  ',1);p=pathlib.PurePosixPath(name)
        require(not p.is_absolute() and '..' not in p.parts,'unsafe checksum path')
        require(sha((root/name).read_bytes())==expected,'checksum mismatch: '+name)
    site=root/'site';report=json.loads((site/'release-integrity.json').read_text());require(report['release']==release,'release mismatch')
    expected={'release-integrity.json',*report['entries']};pairs=[]
    for row in report['files']:
        name='releases/'+release+'/'+row['path'];expected.add(name);require(sha((site/name).read_bytes())==row['sha256'],'release file mismatch: '+name);pairs.append([row['path'],row['sha256']])
    require(release_identity(report,lambda name:(site/'releases'/release/name).read_bytes())==release,'release identity mismatch')
    actual=set()
    for p in site.rglob('*'):
        require(not p.is_symlink(),'site symlink')
        if p.is_file():
            name=p.relative_to(site).as_posix();actual.add(name)
            if name.endswith('.gz'):
                require(name[:-3] in expected,'untracked gzip');require(gzip.decompress(p.read_bytes())==(site/name[:-3]).read_bytes(),'gzip mismatch')
    require({n for n in actual if not n.endswith('.gz')}==expected,'untracked site file')
    with tarfile.open(root/'changlu-images.tar.gz','r:gz') as archive:
        members=archive.getmembers();names=[m.name for m in members];require(len(names)==len(set(names)),'duplicate archive members')
        for m in members:require(m.isfile() or m.isdir(),'link/special member in image archive')
        layout=json.load(archive.extractfile('oci-layout'));require(layout=={'imageLayoutVersion':'1.0.0'},'OCI layout')
        index=json.load(archive.extractfile('index.json'));docker=json.load(archive.extractfile('manifest.json'));require(len(index['manifests'])==len(docker)==2,'expected two architectures')
        observed={};checked_layers={}
        for descriptor in index['manifests']:
            manifest=json.loads(blob(archive,descriptor));config_bytes=blob(archive,manifest['config']);config=json.loads(config_bytes)
            arch=config['architecture'];require(arch in ('amd64','arm64') and config['os']=='linux','platform mismatch')
            require(arch not in observed,'duplicate architecture');observed[arch]=True
            cfg=config['config'];require(cfg['User']=='65532:65532','not non-root');require(cfg['Entrypoint']==['/game-server'],'entrypoint');require(cfg['Cmd']==['-root','/site','-listen',':8080'],'command');require(cfg['Labels']['game.release']==release,'label release');require(cfg['Labels']['org.opencontainers.image.revision']==info['source_commit'],'source commit provenance');require(cfg['StopSignal']=='SIGTERM','stop signal');require(cfg['Healthcheck']['Test']==['CMD','/game-server','-healthcheck'],'healthcheck')
            require(config['rootfs']['diff_ids']==[x['digest'] for x in manifest['layers']],'uncompressed DiffIDs must equal layer digests')
            image=info['images'][arch];require(image['image_id']=='sha256:'+sha(config_bytes),'image ID');require(image['manifest_digest']==descriptor['digest'],'manifest ID')
            entry=next((x for x in docker if image['tag'] in x['RepoTags']),None);require(entry is not None,'missing Docker tag');require(entry['Config']=='blobs/sha256/'+sha(config_bytes),'Docker config path');require(entry['Layers']==['blobs/sha256/'+x['digest'].split(':')[1] for x in manifest['layers']],'Docker layer order')
            for layer in manifest['layers']:
                if layer['digest'] in checked_layers:continue
                data=blob(archive,layer);checked_layers[layer['digest']]=True
                with tarfile.open(fileobj=io.BytesIO(data),mode='r:') as lt:
                    lnames=set()
                    for m in lt.getmembers():
                        p=pathlib.PurePosixPath(m.name);require(not p.is_absolute() and '..' not in p.parts,'unsafe layer path');require(m.name not in lnames,'duplicate layer path');lnames.add(m.name)
                        require(m.uid==0 and m.gid==0 and not m.mode&0o222,'image layer not read-only');require(m.isfile() or m.isdir(),'layer contains links/special files')
                        require(m.name=='game-server' or p.parts[0] in ('site','licenses'),'unexpected image path: '+m.name)
                        if m.isfile():
                            payload=lt.extractfile(m).read()
                            if m.name=='game-server':require(sha(payload)==image['server_sha256'],'server payload mismatch')
                            else:require(payload==(root/m.name).read_bytes(),'layer/context mismatch: '+m.name)
                    if 'game-server' not in lnames:require({x[5:] for x in lnames if x.startswith('site/') and (site/x[5:]).is_file()}==actual,'missing image static files')
        require(set(observed)=={'amd64','arm64'},'architecture coverage')
    print(json.dumps({'verified':True,'release':release,'architectures':list(observed),'site_files':len(actual),'docker_run_tested':False},ensure_ascii=False))
if __name__=='__main__':verify(sys.argv[1] if len(sys.argv)>1 else pathlib.Path(__file__).resolve().parent)
