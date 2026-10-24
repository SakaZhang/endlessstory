import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {releaseAssetRows} from './release-asset-policy.mjs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {buildRelease,readTree,rootHtml} from './build-release.mjs';
const digest=b=>createHash('sha256').update(b).digest('hex');
const temp=await mkdtemp(join(tmpdir(),'rpg-release-test-'));
const root='https://same-origin.example/game/';
const external=x=>/^(?:data:|blob:|https?:|\/\/|#)/i.test(x);
function deps(text,ext){
 if(ext==='html')return [...text.matchAll(/<(?:script|link|img)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/gi)].map(m=>m[1]);
 if(ext==='css')return [...text.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g)].map(m=>(m[1]??m[2]??m[3]).trim());
 if(ext==='js')return [...text.matchAll(/(?:^|[;\n])\s*(?:import|export)\s+(?:[^;\n]*?\bfrom\s*)?['"]([^'"]+)['"]/gm)].map(m=>m[1]);
 return [];
}
async function probe(output,report){
 const release=new URL(report.base,root),urls=new Set(),edges=[];
 const files=new Map(report.files.map(f=>[f.path,f]));
 const emittedRoot=join(output,'releases',report.release);
 const {EXPANSION_PACKS}=await import(pathToFileURL(join(emittedRoot,'race-packs.js')));
 const {extendBattleManifest}=await import(pathToFileURL(join(emittedRoot,'race-art.js')));
 async function visit(url,from){
  assert.equal(url.origin,new URL(root).origin);assert.ok(url.href.startsWith(release.href),'resource escaped namespace: '+url.href);
  edges.push({from,to:url.href});if(urls.has(url.href))return;urls.add(url.href);
  const path=decodeURIComponent(url.pathname.slice(release.pathname.length));assert.ok(files.has(path),'missing dependency '+path);
  const bytes=await readFile(join(output,'releases',report.release,path));assert.equal(digest(bytes),files.get(path).sha256);
  const text=bytes.toString(),ext=path.split('.').pop();
  for(const dep of deps(text,ext).filter(x=>!external(x)))await visit(new URL(dep,url),url.href);
  if(ext==='js'&&text.includes("fetch(assetRoot+'manifest.json')")){
   const assetRoot=text.match(/assetRoot\s*=\s*['"]([^'"]+)['"]/);assert.ok(assetRoot,'unreviewed dynamic assetRoot');
   const manifestUrl=new URL(assetRoot[1]+'manifest.json',release);
   await visit(manifestUrl,url.href);
   const manifest=extendBattleManifest(JSON.parse(await readFile(join(output,'releases',report.release,manifestUrl.pathname.slice(release.pathname.length)),'utf8')));
   const imageRows=[...manifest.backgrounds,...Object.values(manifest.campBackgrounds??{}),...Object.values(manifest.sprites).flatMap(s=>s.frames)];assert.ok(imageRows.length>0);
   for(const image of imageRows)await visit(new URL(assetRoot[1]+image.file,release),manifestUrl.href);
  }
 }
 for(const entry of report.entries){
  const html=await readFile(join(output,entry),'utf8');assert.equal((html.match(/<base\b/g)||[]).length,1);
  const base=new URL(html.match(/<base href="([^"]+)"/)[1],new URL(entry,root));assert.equal(base.href,release.href);
  for(const d of deps(html,'html').filter(x=>!external(x)))await visit(new URL(d,base),new URL(entry,root).href);
 }
 // Registered icon/camp/sprite paths are dynamic runtime edges, not ESM imports.
 async function artEdges(value,from){if(typeof value==='string'&&/\.(?:png|svg|webp)$/.test(value))await visit(new URL(value.replace(/^\.\.\//,''),release),from);else if(value&&typeof value==='object')for(const child of Object.values(value))await artEdges(child,from);}
 for(const pack of EXPANSION_PACKS)await artEdges(pack.art,new URL('races/'+pack.id+'/art.js',release).href);
 const {DWARF_EXPANDED_SKILLS}=await import(pathToFileURL(join(emittedRoot,'dwarf-skill-expansion.js')));
 await artEdges(DWARF_EXPANDED_SKILLS,new URL('dwarf-skill-expansion.js',release).href);
 // Package intentionally retains provenance JSON and unused source art. Keep those
 // as explicit inventory roots, separate from the verified runtime dependency graph.
 const runtimeUrls=new Set(urls);
 const auxiliary=report.files.filter(f=>!f.path.endsWith('.html')&&!urls.has(new URL(f.path,release).href));
 for(const f of auxiliary){assert.match(f.path,/^(?:races\/(?:human|elf|goblin|ashen)\/.*\.(?:png|json|md)|dwarf-tree-migration\.js)$/,'unclassified unreachable emitted asset '+f.path);await visit(new URL(f.path,release),'packaged auxiliary inventory');}
 assert.equal([...urls].filter(u=>new URL(u).pathname.endsWith('/engine.js')).length,1,'single engine URL in both entry graphs');
 assert.deepEqual([...new Set([...urls].map(u=>new URL(u).pathname.slice(release.pathname.length)))].sort(),report.files.filter(f=>!f.path.endsWith('.html')).map(f=>f.path).sort(),'complete actual non-HTML file graph');
 assert.ok([...urls].some(u=>u.endsWith('/engine.js')));assert.ok([...urls].some(u=>u.endsWith('/style.css')));assert.ok([...urls].some(u=>u.endsWith('/manifest.json')));assert.ok([...urls].some(u=>/\.png$/.test(u)));
 // Every copied file, not merely reachable assets, has its original bytes.
 for(const f of report.files)assert.equal(digest(await readFile(join(output,'releases',report.release,f.path))),f.sha256);
 return {urls:[...urls].sort(),runtimeUrls:[...runtimeUrls].sort(),auxiliary:auxiliary.map(f=>f.path),edges};
}
try{
 const source=join(temp,'dist'),output=join(temp,'build');await cp('dist',source,{recursive:true});
 const before=(await readTree(source)).map(f=>[f.path,f.sha256]);
 const a=await buildRelease({source,output});const graphA=await probe(output,a);const again=await buildRelease({source,output});assert.equal(again.release,a.release);
 assert.deepEqual((await readTree(source)).map(f=>[f.path,f.sha256]),before,'build mutated source');
 const legacyHtml=execFileSync('git',['show','649b3bfcb3f72edc452729eb8a421f87c0206e72:dist/index.html'],{encoding:'utf8'});
 const legacyScript=legacyHtml.match(/<script[^>]*src="([^"]+)"/)[1];assert.equal(legacyScript,'app.js?v=0.35');
 // Cache populated from actual checked-in legacy root and actual previous graph, not mocked module constants.
 const oldCache=new Map(before.map(([path,sha])=>[new URL(path,root).href,sha]));oldCache.set(new URL(legacyScript,root).href,'legacy entry cache');
 for(const url of graphA.urls)oldCache.set(url,'previous release cached bytes');
 for(const path of ['style.css','engine.js','battle-assets/manifest.json',before.find(([p])=>p.endsWith('.png'))[0]]){
  const original=await readFile(join(source,path));await writeFile(join(source,path),Buffer.concat([original,Buffer.from(path.endsWith('.js')||path.endsWith('.css')?'\n/* cache mutation probe */\n':' ')]));
  const changed=await buildRelease({source,output});assert.notEqual(changed.release,a.release,'file failed to affect namespace '+path);
  // Manifest whitespace valid; PNG trailing whitespace allowed as byte-level cache test only.
  const graph=await probe(output,changed);for(const url of graph.urls)assert.ok(!oldCache.has(url),'old cache satisfied new resource '+url);
  await writeFile(join(source,path),original);
 }
 // Negative references must fail traversal even when build hashes are internally valid.
 for(const [file,mutate] of [
  ['style.css',text=>text+'\n.broken{background:url(./missing-cache-probe.png)}'],
  ['races/human/art.js',text=>{assert.match(text,/races\/human\/[^"']+\.png/);return text.replace(/races\/human\/[^"']+\.png/,'races/human/missing-registered-art.png');}]
 ]){const original=await readFile(join(source,file),'utf8');await writeFile(join(source,file),mutate(original));const broken=await buildRelease({source,output});await assert.rejects(()=>probe(output,broken),/missing dependency/);await writeFile(join(source,file),original);}
 const anchorSource='<html><head></head><body><a href="battle-preview.html?scenario=poison#x">preview</a><a href="#help">help</a><a href="https://other.example/">outside</a></body></html>';
 const anchor=rootHtml(anchorSource,'index.html',a.release);const base=new URL(a.base,root);
 const links=[...anchor.matchAll(/<a href="([^"]+)"/g)].map(m=>new URL(m[1],base).href);
 assert.deepEqual(links,[root+'battle-preview.html?scenario=poison#x',root+'index.html#help','https://other.example/']);
 assert.throws(()=>rootHtml('<head><base href="/"></head>','index.html',a.release),/Existing base/);
 const storage=await readFile(join(source,'storage.js'),'utf8');assert.match(storage,/SAVE_KEY='ashencrown-v3'/);
 assert.equal(new URL(a.base,root).origin,new URL(root).origin);assert.ok(!legacyHtml.includes('serviceWorker.register'));
 // Exercise the real CLI and official packager in an isolated copy of the current source.
 // Parallel independent gates must never remove one another's shared build/build.tmp.
 const actualRoot=join(temp,'actual-checkout'),actualOutput=join(actualRoot,'build');
 await mkdir(join(actualRoot,'.openai'),{recursive:true});
 await cp('dist',join(actualRoot,'dist'),{recursive:true});
 await cp('build-release.mjs',join(actualRoot,'build-release.mjs'));
 await cp('release-asset-policy.mjs',join(actualRoot,'release-asset-policy.mjs'));
 await cp('.openai/hosting.json',join(actualRoot,'.openai/hosting.json'));
 execFileSync(process.execPath,['build-release.mjs'],{cwd:actualRoot,encoding:'utf8'});
 const actual=JSON.parse(await readFile(join(actualOutput,'release-integrity.json'),'utf8'));
 assert.deepEqual(actual.files.map(f=>[f.path,f.sha256]),releaseAssetRows(await readTree(source)).map(f=>[f.path,f.sha256]),'isolated CLI source differs from current source snapshot');
 const graph=await probe(actualOutput,actual);
 const helper=process.env.SITES_PREPARE_HELPER??'/home/agent/.codex/plugins/cache/openai-curated-remote/sites/1.1.1/skills/sites/scripts/prepare-site-build.cjs';
 let packageCheck='not run: Sites helper unavailable';
 if(existsSync(helper)){
  const packed=join(temp,'packaged-dist');
  assert.equal(execFileSync(process.execPath,[helper,actualRoot,packed],{encoding:'utf8'}).trim(),'static');
  const packedConfig=JSON.parse(await readFile(join(packed,'.openai/hosting.json'),'utf8'));
  const sourceConfig=JSON.parse(await readFile('.openai/hosting.json','utf8'));
  assert.equal(sourceConfig.static.directory,'build');assert.equal(packedConfig.static.directory,'dist');assert.equal(packedConfig.project_id,sourceConfig.project_id);
  for(const f of await readTree(actualOutput))assert.equal(digest(await readFile(join(packed,f.path))),f.sha256,'packaged byte drift '+f.path);
  packageCheck='actual Sites prepare helper PASS: build copied byte-identically and hosting.static.directory normalized to dist';
 }

 await writeFile(join(actualOutput,'dependency-probe.json'),JSON.stringify({release:actual.release,legacyEntry:legacyScript,packageCheck,kind:'Actual emitted HTML/ESM/CSS and dynamic manifest/image URL graph; filesystem + URL/cache model, not browser cache inspection',...graph},null,2)+'\n');
 console.log(packageCheck);
 console.log(`PASS release cache: ${actual.files.length} files hash-verified; ${graph.urls.length} resource URLs / ${graph.edges.length} dependency edges; old legacy and prior release cache misses; 4 mutation classes; roots/navigation/origin/save key preserved.`);
}finally{await rm(temp,{recursive:true,force:true});}
