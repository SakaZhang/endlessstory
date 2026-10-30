#!/usr/bin/env python3
"""Build deterministic Docker+OCI image archives without a Docker daemon.
Reference layouts and load semantics are documented in FORMAT.md. The image
contains only the validated frozen build, server binary, and license notices.
"""
import argparse, datetime, gzip, hashlib, io, json, os, pathlib, platform, re, shutil, struct, subprocess, sys, tarfile, tempfile

sys.dont_write_bytecode=True
from release_identity import release_identity

HERE = pathlib.Path(__file__).resolve().parent
RELEASE = re.compile(r'[a-f0-9]{64}')
TEXT = {'.html','.js','.mjs','.css','.json','.svg','.txt','.xml','.wasm'}
FORBIDDEN_PARTS = {'.git','.openai','.env','node_modules','qa','__pycache__'}
FORBIDDEN_NAMES = {'art-qa.json','integration.md','canon.md','canonical-source.md'}
PRIVATE_MARKERS = re.compile(rb'/workspace/|/home/[A-Za-z0-9_.-]+/|\.openai/|\.codex/|sk-[A-Za-z0-9]{24,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----')

def digest(data): return hashlib.sha256(data).hexdigest()
def json_bytes(value): return (json.dumps(value, ensure_ascii=False, separators=(',',':'), sort_keys=True)+'\n').encode()
def safe_name(name):
    p=pathlib.PurePosixPath(name)
    return bool(name) and not name.startswith('/') and '\\' not in name and all(x not in ('','..','.') and not x.startswith('.') for x in p.parts)
def public_name(name):
    p=pathlib.PurePosixPath(name)
    return safe_name(name) and not set(p.parts)&FORBIDDEN_PARTS and p.suffix.lower() not in {'.md','.map','.log','.pem','.key'} and p.name.lower() not in FORBIDDEN_NAMES and '-proof.' not in p.name

def regular_tree(root):
    out={}
    for p in sorted(root.rglob('*')):
        rel=p.relative_to(root).as_posix()
        if p.is_symlink(): raise ValueError('symlink rejected: '+rel)
        if p.is_file():
            if not safe_name(rel) and rel!='.dockerignore': raise ValueError('unsafe filename: '+rel)
            out[rel]=p
        elif not p.is_dir(): raise ValueError('non-regular path: '+rel)
    return out

def validate_release(build, expected):
    tree=regular_tree(build)
    report=json.loads((build/'release-integrity.json').read_text())
    release=report.get('release','')
    if not RELEASE.fullmatch(release) or release!=expected: raise ValueError('frozen release hash mismatch')
    if report.get('schema')!=1 or report.get('base')!=f'./releases/{release}/': raise ValueError('unknown integrity schema/base')
    allowed={'release-integrity.json'};pairs=[]
    for row in report['files']:
        name=row['path']
        if not public_name(name): raise ValueError('non-public asset in release: '+name)
        p=f'releases/{release}/{name}'
        if p in allowed: raise ValueError('duplicate manifest path: '+p)
        if p not in tree or digest(tree[p].read_bytes())!=row['sha256']: raise ValueError('asset checksum mismatch: '+name)
        if pathlib.PurePosixPath(name).suffix in TEXT and PRIVATE_MARKERS.search(tree[p].read_bytes()): raise ValueError('private metadata/credential marker in release asset: '+name)
        allowed.add(p);pairs.append([name,row['sha256']])
    if pairs!=sorted(pairs,key=lambda x:x[0]): raise ValueError('release manifest not canonically sorted')
    # Match both legacy files-only and v0.76+ bundled-entry release identity.
    computed=release_identity(report,lambda name:tree[f'releases/{release}/{name}'].read_bytes())
    if computed!=release: raise ValueError('release identity does not match manifest rows')
    if 'index.html' not in report['entries']: raise ValueError('missing root index entry')
    for name in report['entries']:
        if '/' in name or not name.endswith('.html') or not public_name(name): raise ValueError('unsafe root entry')
        allowed.add(name)
        html=tree[name].read_text()
        if f'<base href="./releases/{release}/">' not in html: raise ValueError('root HTML points to another release')
    if set(tree)!=allowed: raise ValueError('unexpected/missing build files: '+repr(sorted(set(tree)^allowed)))
    return report,tree

def write_file(root,name,data,mode=0o444):
    p=root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data);p.chmod(mode);return p

def tar_info(name,size=0,mode=0o444,directory=False):
    info=tarfile.TarInfo(name);info.size=size;info.mode=mode;info.uid=info.gid=0;info.uname=info.gname='';info.mtime=0
    if directory:info.type=tarfile.DIRTYPE
    return info

def make_tar(path,files,dirs=(),dir_mode=0o555):
    with tarfile.open(path,'w',format=tarfile.PAX_FORMAT) as t:
        all_dirs=set(dirs)
        for name in files:
            all_dirs.update(str(p) for p in pathlib.PurePosixPath(name).parents if str(p)!='.')
        for name in sorted(all_dirs):t.addfile(tar_info(name,mode=dir_mode,directory=True))
        for name,(source,mode) in sorted(files.items()):
            if isinstance(source,bytes): t.addfile(tar_info(name,len(source),mode),io.BytesIO(source))
            else:
                with source.open('rb') as f:t.addfile(tar_info(name,source.stat().st_size,mode),f)

def gzip_file(src,dst):
    with src.open('rb') as r,dst.open('wb') as out,gzip.GzipFile(filename='',mode='wb',fileobj=out,compresslevel=9,mtime=0) as z:shutil.copyfileobj(r,z)

def read_elf(p,arch):
    b=p.read_bytes()
    if b[:4]!=b'\x7fELF' or b[4:6]!=b'\x02\x01':raise ValueError('not ELF64 little-endian: '+str(p))
    if struct.unpack_from('<H',b,18)[0]!={'amd64':62,'arm64':183}[arch]:raise ValueError('wrong binary architecture')
    phoff=struct.unpack_from('<Q',b,32)[0];phsize,phnum=struct.unpack_from('<HH',b,54)
    if any(struct.unpack_from('<I',b,phoff+i*phsize)[0] in (2,3) for i in range(phnum)):raise ValueError('binary has dynamic or interpreter dependency')

def build_binaries(go,stage):
    env={**os.environ,'CGO_ENABLED':'0','GOOS':'linux','GOTOOLCHAIN':'local','GOCACHE':os.environ.get('GOCACHE','/tmp/changlu-container-go-cache')}
    version=subprocess.check_output([go,'version'],env=env,text=True).strip()
    if not re.search(r'go1\.(2[5-9]|[3-9][0-9])\.',version):raise ValueError('Go 1.25+ required; use a supported patched toolchain')
    subprocess.run([go,'test','./...'],cwd=HERE/'server',env=env,check=True)
    binaries={}
    for arch in ['amd64','arm64']:
        target=stage/'binaries'/f'game-server-linux-{arch}';target.parent.mkdir(exist_ok=True)
        subprocess.run([go,'build','-trimpath','-buildvcs=false','-ldflags=-s -w -buildid=','-o',str(target),'.'],cwd=HERE/'server',env={**env,'GOARCH':arch},check=True)
        target.chmod(0o555);read_elf(target,arch);binaries[arch]=target
    return version,binaries

def add_blob(blobs,data):
    if isinstance(data,pathlib.Path):sha=digest(data.read_bytes());size=data.stat().st_size
    else:sha=digest(data);size=len(data)
    blobs[f'blobs/sha256/{sha}']=(data,0o444)
    return {'digest':'sha256:'+sha,'size':size}

def image_archive(stage,binaries,version,release,tagbase,source_commit):
    temp=stage/'work';temp.mkdir();common=temp/'site.tar'
    common_files={f'site/{name}':(p,0o444) for name,p in regular_tree(stage/'site').items()}
    common_files.update({f'licenses/{name}':(p,0o444) for name,p in regular_tree(stage/'licenses').items()})
    make_tar(common,common_files)
    blobs={};common_desc=add_blob(blobs,common);common_desc['mediaType']='application/vnd.oci.image.layer.v1.tar'
    docker_manifest=[];index=[];metadata={}
    for arch,binary in binaries.items():
        layer=temp/f'server-{arch}.tar';make_tar(layer,{'game-server':(binary,0o555)})
        server_desc=add_blob(blobs,layer);server_desc['mediaType']='application/vnd.oci.image.layer.v1.tar'
        tag=f'{tagbase}-{arch}'
        config={'created':'1970-01-01T00:00:00Z','architecture':arch,'os':'linux','config':{
            'User':'65532:65532','ExposedPorts':{'8080/tcp':{}},'Env':['GOMEMLIMIT=192MiB','GOMAXPROCS=2'],
            'Entrypoint':['/game-server'],'Cmd':['-root','/site','-listen',':8080'],'WorkingDir':'/','StopSignal':'SIGTERM',
            'Healthcheck':{'Test':['CMD','/game-server','-healthcheck'],'Interval':30000000000,'Timeout':5000000000,'StartPeriod':10000000000,'Retries':3},
            'Labels':{'org.opencontainers.image.title':'长路未尽','org.opencontainers.image.version':version,'game.release':release,'org.opencontainers.image.revision':source_commit}},
            'rootfs':{'type':'layers','diff_ids':[common_desc['digest'],server_desc['digest']]},
            'history':[{'created':'1970-01-01T00:00:00Z','created_by':'COPY frozen release and license notices'}, {'created':'1970-01-01T00:00:00Z','created_by':'COPY static Go server'}]}
        config_desc=add_blob(blobs,json_bytes(config));config_desc['mediaType']='application/vnd.oci.image.config.v1+json'
        manifest={'schemaVersion':2,'mediaType':'application/vnd.oci.image.manifest.v1+json','config':config_desc,'layers':[common_desc,server_desc]}
        desc=add_blob(blobs,json_bytes(manifest));desc.update({'mediaType':manifest['mediaType'],'platform':{'architecture':arch,'os':'linux'},'annotations':{'org.opencontainers.image.ref.name':tag.split(':',1)[1],'io.containerd.image.name':'docker.io/library/'+tag}});index.append(desc)
        docker_manifest.append({'Config':'blobs/sha256/'+config_desc['digest'].split(':')[1],'RepoTags':[tag],'Layers':['blobs/sha256/'+d['digest'].split(':')[1] for d in [common_desc,server_desc]]})
        metadata[arch]={'tag':tag,'image_id':config_desc['digest'],'manifest_digest':desc['digest'],'server_sha256':digest(binary.read_bytes())}
    blobs['manifest.json']=(json_bytes(docker_manifest),0o444)
    blobs['index.json']=(json_bytes({'schemaVersion':2,'mediaType':'application/vnd.oci.image.index.v1+json','manifests':index}),0o444)
    blobs['oci-layout']=(json_bytes({'imageLayoutVersion':'1.0.0'}),0o444)
    raw=temp/'images.tar';make_tar(raw,blobs);gzip_file(raw,stage/'changlu-images.tar.gz')
    shutil.rmtree(temp);return metadata

def checksums(root,exclude=('SHA256SUMS',)):
    return ''.join(f'{digest(p.read_bytes())}  {name}\n' for name,p in regular_tree(root).items() if name not in exclude)

def package(args):
    build=pathlib.Path(args.build).resolve();out=pathlib.Path(args.output).resolve()
    if out==build or build in out.parents or out in build.parents:raise ValueError('build/output must be separate trees')
    if out.exists():raise ValueError('output exists; choose a new empty output path')
    if not re.fullmatch(r'(?:[a-f0-9]{40}|[a-f0-9]{64})',args.source_commit):raise ValueError('full verified source commit required')
    report,tree=validate_release(build,args.release)
    out.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='changlu-package-',dir=out.parent) as td:
        stage=pathlib.Path(td)/'changlu-portable';stage.mkdir()
        compressed=0;before=after=0
        for name,p in tree.items():
            data=p.read_bytes();write_file(stage/'site',name,data)
            if p.suffix.lower() in TEXT and len(data)>=256:
                zipped=gzip.compress(data,compresslevel=9,mtime=0)
                if len(zipped)+32<len(data):write_file(stage/'site',name+'.gz',zipped);compressed+=1;before+=len(data);after+=len(zipped)
        for name,p in regular_tree(HERE/'licenses').items():write_file(stage/'licenses',name,p.read_bytes())
        for name in ['Dockerfile','.dockerignore','compose.yaml','start.sh','rebuild-server.sh','README.zh-CN.md','FORMAT.md','verify.py','package.py','package_test.py','release_identity.py','smoke.py']:
            write_file(stage,name,(HERE/name).read_bytes(),0o555 if name.endswith('.sh') else 0o444)
        for name,p in regular_tree(HERE/'server').items():write_file(stage/'server',name,p.read_bytes())
        compiler,binaries=build_binaries(args.go,stage)
        subprocess.run(['python3',str(stage/'smoke.py'),str(stage)],check=True)
        tagbase=f'changlu-weijin:{args.version}-{args.release[:12]}'
        image_meta=image_archive(stage,binaries,args.version,args.release,tagbase,args.source_commit)
        write_file(stage,'IMAGE_TAG_BASE',(tagbase+'\n').encode())
        metadata={'schema':1,'game_version':args.version,'release':args.release,'source_commit':args.source_commit,'compiler':compiler,'images':image_meta,'source_files':len(tree),'gzip':{'files':compressed,'raw_bytes':before,'gzip_bytes':after},'verification':{'docker_load_run_tested':False,'native_http':{'passed':True,'architecture':platform.machine(),'uid':os.getuid(),'graceful_sigterm':True},'arm64_runtime_tested':platform.machine()=='aarch64','notes':'Native HTTP smoke, release hashes, archive digests and both ELF architectures verified; Docker load/run still needs target-host verification.'}}
        write_file(stage,'PACKAGE-INFO.json',json.dumps(metadata,ensure_ascii=False,indent=2).encode()+b'\n')
        # Verify original input did not change while packaging.
        validate_release(build,args.release)
        if {n:digest(p.read_bytes()) for n,p in regular_tree(build).items()}!={n:digest((stage/'site'/n).read_bytes()) for n in tree}:raise ValueError('build changed during packaging')
        write_file(stage,'SHA256SUMS',checksums(stage).encode())
        subprocess.run(['python3',str(stage/'verify.py'),str(stage)],check=True)
        out.mkdir();shutil.copytree(stage,out/'changlu-portable')
        raw=pathlib.Path(td)/'portable.tar'
        files={f'changlu-portable/{name}':(p,0o755 if name.endswith('.sh') or name.startswith('binaries/') else 0o644) for name,p in regular_tree(stage).items()}
        # The package .dockerignore is intentionally included, despite not being a game asset.
        make_tar(raw,files,dir_mode=0o755);bundle=out/f'changlu-v{args.version}-{args.release[:12]}-portable.tar.gz';gzip_file(raw,bundle)
        (out/'SHA256SUMS').write_text(f'{digest(bundle.read_bytes())}  {bundle.name}\n')
        print(json.dumps({'bundle':str(bundle),'bytes':bundle.stat().st_size,**metadata},ensure_ascii=False,indent=2))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--build',required=True);p.add_argument('--release',required=True);p.add_argument('--source-commit',required=True);p.add_argument('--output',required=True);p.add_argument('--version',default='0.81.1');p.add_argument('--go',default='go');package(p.parse_args())
