import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm,cp} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {gzipSync} from 'node:zlib';
import {buildRelease,readTree} from './build-release.mjs';
const temp=await mkdtemp(join(tmpdir(),'rpg-bundles-'));
try{
 const source=join(temp,'dist');await cp('dist',source,{recursive:true});const output=join(temp,'build'),report=await buildRelease({source,output});
 const root=join(output,'releases',report.release),rows=await readTree(source),files=new Map(rows.map(row=>[row.path,row]));
 for(const entry of report.optimization.entries){
  const html=await readFile(join(output,entry.path),'utf8'),script=await readFile(join(root,entry.script),'utf8'),css=await readFile(join(root,entry.stylesheet),'utf8');
  assert.equal((html.match(/<script\b/g)??[]).length,1);assert.equal((html.match(/rel="stylesheet"/g)??[]).length,1);
  assert(script.length);assert(css.length);assert(!/\bimport\s*(?:[({"']|[\w$]+\s+from)/.test(script),'no runtime JS dependency waterfall');
  const original=files.get(entry.path).bytes.toString(),sourceStyles=[...original.matchAll(/<link\b[^>]*href="([^"]+\.css)"/g)].map(m=>m[1].replace(/^\.\//,''));
  assert.deepEqual(entry.sourceStyles,sourceStyles,'exact source CSS cascade order');
  for(const input of entry.inputs){const text=files.get(input).bytes.toString();assert(!/import\.meta|\bimport\s*\(/.test(text),'review relative/dynamic module identity before bundling '+input);}
  for(const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g)){const path=(match[1]??match[2]??match[3]).trim();if(!/^(?:data:|https?:|\/\/|#)/.test(path)){assert(!path.startsWith('/'),'asset path remains subpath portable');const url=new URL(path,'https://example.test/subpath/releases/'+report.release+'/');assert(url.pathname.startsWith('/subpath/releases/'+report.release+'/'),'CSS URL stays immutable');assert(files.has(decodeURIComponent(url.pathname.split('/'+report.release+'/')[1])),'CSS asset exists '+path);}}
  for(const input of entry.inputs)assert.equal(await readFile(join(root,input),'utf8'),files.get(input).bytes.toString(),'source bytes unchanged');
  const sourceBytes=entry.inputs.reduce((n,path)=>n+files.get(path).bytes.length,0),sourceGzip=entry.inputs.reduce((n,path)=>n+gzipSync(files.get(path).bytes).length,0);
  console.log(`${entry.path}: JS ${entry.inputs.length}→1 requests, ${sourceBytes}→${Buffer.byteLength(script)} bytes raw, ${sourceGzip}→${gzipSync(script).length} bytes gzip; CSS ${sourceStyles.length}→1 requests.`);
 }
 // Execute the production minified bundle against the same actual-App flow
 // used by the source regression suite: no mocked substitute entry/engine.
 const fixture=await readFile('ui-tests.cjs','utf8'),needle="await import('./dist/app.js');";assert(fixture.includes(needle));
 const bundle=pathToFileURL(join(root,report.optimization.entries.find(row=>row.path==='index.html').script)).href;
 const result=execFileSync(process.execPath,['-e',fixture.replace(needle,`await import(${JSON.stringify(bundle)});`)],{cwd:resolve('.'),encoding:'utf8',maxBuffer:8*1024*1024});
 console.log(result.trim());
 const originalApp=await readFile(join(source,'app.js'),'utf8');
 await writeFile(join(source,'app.js'),originalApp+'\nconsole.log(import.meta.url);\n');
 await assert.rejects(()=>buildRelease({source,output}),/Review module-relative import.meta/,'future module-relative URLs cannot silently change origin');
 await writeFile(join(source,'app.js'),originalApp+'\nvoid import("https://external.invalid/required.js");\n');
 await assert.rejects(()=>buildRelease({source,output}),/Unresolved runtime module dependency/,'no external JS dependency becomes mandatory for standalone hosting');
 await writeFile(join(source,'app.js'),originalApp);
 console.log('PASS bundled entries: deterministic relative CSS URLs/order; no runtime import waterfall or import.meta identity hazard; all original source/art retained; actual minified App world/region/combat/inventory/forge/merchant/journal/codex flow. Synthetic DOM/native canvas, not browser timings.');
}finally{await rm(temp,{recursive:true,force:true});}
