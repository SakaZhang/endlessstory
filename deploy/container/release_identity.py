"""Content identity for legacy and esbuild-entry v0.76 release manifests.
Matches build-release.mjs/release-entry-bundles.mjs without Node or esbuild.
Only deterministic HTML reference replacement is reproduced, never game bundling.
"""
import hashlib,json,re

def sha(data):return hashlib.sha256(data).hexdigest()
def release_identity(report,read_asset):
    pairs=[[r['path'],r['sha256']] for r in report['files']]
    optimization=report.get('optimization')
    if not optimization:
        payload=pairs
    else:
        if optimization.get('kind')!='esbuild-esm-css':raise ValueError('unknown release identity algorithm')
        entries=optimization['entries']
        if [x['path'] for x in entries]!=report['entries']:raise ValueError('entry ordering mismatch')
        entry_hashes=[]
        for entry in entries:
            name=entry['path']
            if '/' in name or not name.endswith('.html'):raise ValueError('unsafe optimized entry')
            js=name[:-5]+'.bundle.js';css=name[:-5]+'.bundle.css'
            if entry['script']!=js or entry['stylesheet']!=css:raise ValueError('bundle identity mismatch')
            original=read_asset(name).decode('utf-8')
            styles=re.findall(r'<link\b[^>]*\brel=["\']stylesheet["\'][^>]*>',original,re.I)
            scripts=re.findall(r'<script\b[^>]*\btype=["\']module["\'][^>]*>\s*</script>',original,re.I)
            if len(scripts)!=1:raise ValueError('expected one original module entry')
            html=original.replace(scripts[0],f'<script type="module" src="{js}"></script>',1)
            for i,style in enumerate(styles):html=html.replace(style,f'<link rel="stylesheet" href="{css}">' if i==0 else '',1)
            entry_hashes.append([name,sha(html.encode('utf-8'))])
        payload={'files':pairs,'entries':entry_hashes}
    return sha(json.dumps(payload,ensure_ascii=False,separators=(',',':')).encode('utf-8'))
