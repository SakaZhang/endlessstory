import {bundleReleaseEntries} from './release-entry-bundles.mjs';
import {releaseAssetRows} from './release-asset-policy.mjs';
import {createHash} from 'node:crypto';
import {readdir,readFile,mkdir,writeFile,rm,rename} from 'node:fs/promises';
import {resolve,relative,dirname,join} from 'node:path';
import {pathToFileURL} from 'node:url';
const sha=b=>createHash('sha256').update(b).digest('hex');
export async function readTree(root,at=''){
 const rows=[];
 for(const e of (await readdir(join(root,at),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
  const path=at?at+'/'+e.name:e.name;
  if(e.isSymbolicLink())throw Error('Symlink disallowed: '+path);
  if(e.isDirectory())rows.push(...await readTree(root,path));
  else if(e.isFile()){const bytes=await readFile(join(root,path));rows.push({path,bytes,sha256:sha(bytes)});}
 }
 return rows.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
}
export function rootHtml(source,entry,hash){
 if(/<base\b/i.test(source))throw Error('Existing base must be reviewed: '+entry);
 if(!/<head\b[^>]*>/i.test(source))throw Error('Missing head: '+entry);
 // Root page URLs remain stable. Local navigation must not inherit asset namespace.
 source=source.replace(/<a\b[^>]*>/gi,tag=>tag.replace(/\bhref=(['"])(.*?)\1/i,(attr,q,url)=>{
  if(/^(?:[a-z][a-z\d+.-]*:|\/\/|\/)/i.test(url))return attr;
  const target=new URL(url,new URL(entry,'https://release.invalid/'));
  return `href=${q}../../${target.pathname.slice(1)}${target.search}${target.hash}${q}`;
 }));
 return source.replace(/<head\b[^>]*>/i,head=>head+`<base href="./releases/${hash}/">`);
}
export async function buildRelease({source='dist',output='build'}={}){
 source=resolve(source);output=resolve(output);
 if(source===output||!relative(source,output).startsWith('..')||!relative(output,source).startsWith('..'))throw Error('Source/output must be separate sibling trees');
 const sourceRows=await readTree(source),sourceFiles=releaseAssetRows(sourceRows);
 const bundles=await bundleReleaseEntries(source,sourceFiles);
 const rows=[...sourceFiles,...bundles.generated.map(row=>({...row,sha256:sha(row.bytes)}))].sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
 const hash=sha(Buffer.from(JSON.stringify({files:rows.map(({path,sha256})=>[path,sha256]),entries:bundles.entries.map(({path,html})=>[path,sha(Buffer.from(html))])})));
 const stage=output+'.tmp';await rm(stage,{recursive:true,force:true});await mkdir(stage,{recursive:true});
 for(const row of rows){const target=join(stage,'releases',hash,row.path);await mkdir(dirname(target),{recursive:true});await writeFile(target,row.bytes);}
 const entries=rows.filter(r=>!r.path.includes('/')&&r.path.endsWith('.html'));
 if(!entries.some(e=>e.path==='index.html'))throw Error('Missing root index');
 for(const e of entries)await writeFile(join(stage,e.path),rootHtml(bundles.entries.find(row=>row.path===e.path).html,e.path,hash));
 const report={schema:1,release:hash,base:`./releases/${hash}/`,entries:entries.map(e=>e.path),files:rows.map(({path,sha256})=>({path,sha256})),optimization:{kind:'esbuild-esm-css',entries:bundles.entries.map(({html,...entry})=>entry),generated:bundles.generated.map(row=>row.path)},excludedQa:sourceRows.filter(row=>!sourceFiles.includes(row)).map(({path,sha256,bytes})=>({path,sha256,bytes:bytes.length}))};
 await writeFile(join(stage,'release-integrity.json'),JSON.stringify(report,null,2)+'\n');
 // Refuse a mixed snapshot if another worker edited input while this build ran.
 const current=await readTree(source);if(JSON.stringify(current.map(r=>[r.path,r.sha256]))!==JSON.stringify(sourceRows.map(r=>[r.path,r.sha256])))throw Error('dist changed during build; retry after edits finish');
 await rm(output,{recursive:true,force:true});await rename(stage,output);return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const result=await buildRelease();console.log(JSON.stringify({release:result.release,files:result.files.length,output:'build'}));}
