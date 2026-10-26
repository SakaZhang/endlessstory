import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {EXPANSION_PACKS} from './dist/race-packs.js';
import {extendBattleManifest} from './dist/race-art.js';
import {createPixelMapScenes} from './dist/pixel-map-scenes.js';
const {Image}=createRequire(import.meta.url)('@napi-rs/canvas');
const exploration=JSON.parse(fs.readFileSync('dist/map-assets/exploration-manifest.json'));
const battle=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')));
const mapCss=fs.readFileSync('dist/adjacent-region-map.css','utf8');
assert.match(mapCss,/\.adjacentRegion \[data-region-canvas\]\{[^}]*object-fit:cover;object-position:center/,'tall mobile containers crop, never stretch pixels');
for(const [w,h] of [[960,540],[375,450],[336,450]]){const scale=Math.max(w/960,h/540),drawW=960*scale,drawH=540*scale;assert.equal(drawW/drawH,960/540);assert(drawW>=w&&drawH>=h);}
const hashes=new Set(),files=new Set();
for(const pack of EXPANSION_PACKS)for(const area of pack.areas){
 const ids=exploration.areaBackgrounds[area.id];assert.equal(ids.length,1);
 const row=exploration.backgrounds.find(r=>r.id===ids[0]);assert(row);assert.deepEqual(row.size,[480,270]);
 const file=path.resolve('dist/map-assets',row.file),bytes=fs.readFileSync(file);assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.equal(bytes.readUInt32BE(16),480);assert.equal(bytes.readUInt32BE(20),270);
 const hash=createHash('sha256').update(bytes).digest('hex');assert(!hashes.has(hash),area.id+' unique map');hashes.add(hash);files.add(file);
 for(const id of battle.areaBackgrounds[area.id]){const combat=path.resolve('dist/battle-assets',battle.backgrounds.find(r=>r.id===id).file);assert.notEqual(file,combat);assert.notEqual(hash,createHash('sha256').update(fs.readFileSync(combat)).digest('hex'));}
}
assert.equal(files.size,40);
const original=JSON.stringify(exploration),requests=[],imageRequests=[];
globalThis.fetch=async url=>{requests.push(url);return{ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join('dist',url)))}};
globalThis.Image=class extends Image{set src(url){imageRequests.push(url);super.src=fs.readFileSync(path.join('dist',url));}get src(){return super.src}};
const scenes=createPixelMapScenes();assert.equal(imageRequests.length,0);assert.deepEqual(await Promise.all([scenes.load('human.a01'),scenes.load('human.a01')]),[true,true]);assert.equal(imageRequests.length,1,'lazy scene-only load, duplicate requests deduplicated');for(const p of EXPANSION_PACKS)for(const a of p.areas){assert.equal(await scenes.load(a.id),true,a.id);assert.equal(scenes.status(a.id).mode,'ready');}
assert.equal(imageRequests.length,40);assert.deepEqual(requests,['./map-assets/exploration-manifest.json']);assert.equal(JSON.stringify(exploration),original);
// Bad raster dimensions fail closed and explicit retry recovers without battle fallback.
let bad=true;globalThis.Image=class{naturalWidth=480;get naturalHeight(){return bad?240:270}async decode(){}};
const retry=createPixelMapScenes({explorationManifest:exploration});assert.equal(await retry.load('elf.a01'),false);assert.equal(retry.status('elf.a01').mode,'failed');bad=false;assert.equal(await retry.load('elf.a01'),false);assert.equal(await retry.load('elf.a01',{retry:true}),true);
assert(!fs.readFileSync('dist/pixel-map-scenes.js','utf8').includes('extendBattleManifest'));
console.log('PASS all40 dedicated unique480×270maps, no battle aliases/bytes, independent fetch graph, real PNG decode, immutable manifest, dimensions fail/retry.');
