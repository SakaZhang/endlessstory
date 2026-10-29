import {build} from 'esbuild';
import {resolve} from 'node:path';
// Production entry optimization only. Every source/module/art file is retained
// byte-for-byte for audit, recovery and the unbundled namespaced HTML entries.
export async function bundleReleaseEntries(source,rows){
 const files=new Map(rows.map(row=>[row.path,row])),generated=[],entries=[];
 for(const row of rows.filter(row=>!row.path.includes('/')&&row.path.endsWith('.html'))){
  const original=row.bytes.toString(),styles=[...original.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/gi)],scripts=[...original.matchAll(/<script\b[^>]*\btype=["']module["'][^>]*>\s*<\/script>/gi)];
  const local=(tag,attribute)=>{const path=tag.match(new RegExp('\\b'+attribute+'=["\']([^"\']+)["\']','i'))?.[1];if(!path||/^(?:[a-z]+:|\/|#)/i.test(path)||path.includes('?')||path.includes('#'))throw Error('Unreviewed release entry reference: '+tag);const normalized=path.replace(/^\.\//,'');if(!files.has(normalized))throw Error('Missing entry dependency: '+normalized);return normalized;};
  if(scripts.length!==1)throw Error('Expected one module entry: '+row.path);
  const name=row.path.replace(/\.html$/,''),jsPath=`${name}.bundle.js`,cssPath=`${name}.bundle.css`,scriptPath=local(scripts[0][0],'src'),cssPaths=styles.map(match=>local(match[0],'href'));
  for(const path of [jsPath,cssPath])if(files.has(path))throw Error('Bundle output collides with source: '+path);
  const common={absWorkingDir:source,bundle:true,write:false,minify:true,target:['es2022'],charset:'utf8',legalComments:'none',metafile:true,logLevel:'silent'};
  const js=await build({...common,entryPoints:[scriptPath],format:'esm',outfile:resolve(source,jsPath)});
  for(const input of Object.keys(js.metafile.inputs)){const text=files.get(input)?.bytes.toString();if(text===undefined)throw Error('Bundler input outside reviewed source: '+input);if(/import\.meta/.test(text))throw Error('Review module-relative import.meta before entry bundling: '+input);}
  if(Object.values(js.metafile.outputs).some(output=>output.imports.length))throw Error('Unresolved runtime module dependency in bundled entry: '+row.path);
  // CSS is concatenated in exactly the original <link> cascade order. All
  // current styles live at the release root, as do outputs, so url() keeps
  // the same meaning. Images stay external, immutable and demand-loaded.
  for(const path of cssPaths)if(path.includes('/'))throw Error('Nested CSS requires explicit URL rebasing: '+path);
  const css=await build({...common,stdin:{contents:cssPaths.map(path=>`@import ${JSON.stringify('./'+path)};`).join('\n'),resolveDir:source,loader:'css',sourcefile:'release-styles.css'},external:['*.png','*.svg','*.webp','*.jpg','*.gif','*.woff','*.woff2'],outfile:resolve(source,cssPath)});
  generated.push({path:jsPath,bytes:Buffer.from(js.outputFiles[0].contents)},{path:cssPath,bytes:Buffer.from(css.outputFiles[0].contents)});
  let html=original.replace(scripts[0][0],`<script type="module" src="${jsPath}"></script>`),first=true;
  for(const style of styles){html=html.replace(style[0],first?`<link rel="stylesheet" href="${cssPath}">`:'');first=false;}
  entries.push({path:row.path,html,script:jsPath,stylesheet:cssPath,sourceScript:scriptPath,sourceStyles:cssPaths,inputs:Object.keys(js.metafile.inputs).sort(),inputBytes:Object.values(js.metafile.inputs).reduce((n,r)=>n+r.bytes,0),scriptBytes:js.outputFiles[0].contents.length,styleBytes:css.outputFiles[0].contents.length});
 }
 return {generated,entries};
}
