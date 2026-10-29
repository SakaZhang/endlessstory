#!/usr/bin/env python3
"""Native amd64/arm64 subprocess HTTP smoke test, not a Docker run test."""
import argparse,gzip,http.client,json,os,pathlib,platform,signal,socket,subprocess,time

def main():
    ap=argparse.ArgumentParser();ap.add_argument('package',type=pathlib.Path);args=ap.parse_args();root=args.package.resolve()
    arch={'x86_64':'amd64','aarch64':'arm64'}.get(platform.machine());assert arch,'unsupported native architecture'
    with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
    binary=root/'binaries'/f'game-server-linux-{arch}'
    proc=subprocess.Popen([str(binary),'-root',str(root/'site'),'-listen',f'127.0.0.1:{port}'],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
    def request(path,method='GET',headers=None):
        c=http.client.HTTPConnection('127.0.0.1',port,timeout=5);c.request(method,path,headers=headers or {});r=c.getresponse();b=r.read();result=(r.status,{k.lower():v for k,v in r.getheaders()},b);c.close();return result
    try:
        deadline=time.monotonic()+15
        while True:
            if proc.poll() is not None:raise RuntimeError(proc.stderr.read())
            try:
                if request('/healthz')[0]==200:break
            except ConnectionError:pass
            if time.monotonic()>deadline:raise TimeoutError('startup')
            time.sleep(.05)
        status,h,body=request('/');assert status==200 and h['cache-control']=='no-cache' and b'<base ' in body
        assert request('/','HEAD')[2]==b''
        status,h,body=request('/release-integrity.json');assert status==200 and h['cache-control']=='no-store';report=json.loads(body)
        script=next((r['path'] for r in report['files'] if r['path']=='index.bundle.js'),next(r['path'] for r in report['files'] if r['path'].endswith('.js')))
        url='/releases/'+report['release']+'/'+script
        s,h,body=request(url);assert s==200 and h['content-type'].startswith('text/javascript') and 'immutable' in h['cache-control']
        s,zhead,zbody=request(url,headers={'Accept-Encoding':'gzip'});assert s==200 and zhead['content-encoding']=='gzip' and zhead['vary']=='Accept-Encoding' and gzip.decompress(zbody)==body
        assert request(url,headers={'Accept-Encoding':'gzip;q=0'})[2]==body
        assert request(url,headers={'If-None-Match':h['etag']})[0]==304
        s,_,partial=request(url,headers={'Range':'bytes=0-15'});assert s==206 and partial==body[:16]
        for url in ['/.git/config','/.openai/config','/../etc/passwd','/%2e%2e/etc/passwd','/releases/','/missing'] :assert request(url)[0]==404,url
        assert request('/','POST')[0]==405
        proc.send_signal(signal.SIGTERM);proc.wait(timeout=12);assert proc.returncode==0
        print(json.dumps({'native_http_passed':True,'architecture':arch,'uid':os.getuid(),'release':report['release'],'graceful_sigterm':True,'docker_run_tested':False}))
    finally:
        if proc.poll() is None:proc.kill();proc.wait()
if __name__=='__main__':main()
