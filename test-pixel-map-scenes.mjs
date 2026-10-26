import assert from 'node:assert/strict';import fs from 'node:fs';
import {createPixelMapScenes,drawPixelMapScene} from './dist/pixel-map-scenes.js';
const manifest=JSON.parse(fs.readFileSync(new URL('./dist/map-assets/manifest.json',import.meta.url))),explorationManifest=JSON.parse(fs.readFileSync(new URL('./dist/map-assets/exploration-manifest.json',import.meta.url)));
assert.deepEqual(manifest.backgrounds.map(x=>x.file),[manifest.image],'world raster declared in the actual release graph');assert.deepEqual(manifest.sprites,{});
let calls=[];const context=new Proxy({}, {get:(_,key)=>(...args)=>calls.push([key,...args]),set:()=>true});const canvas={width:960,height:540,getContext:()=>context};
const images=new Map([...explorationManifest.backgrounds.map(b=>[b.file,{}]),[manifest.image,{}]]);
const original=JSON.stringify(explorationManifest);const scenes=createPixelMapScenes({manifest,explorationManifest,images});
for(const id of ['world',...Array.from({length:10},(_,i)=>'dwarf.a'+String(i+1).padStart(2,'0'))]){assert.equal(await scenes.load(id),true);calls=[];assert.equal(scenes.draw(canvas,id),true);assert.equal(calls.filter(c=>c[0]==='drawImage').length,id==='world'?1:2)}
assert.equal(JSON.stringify(explorationManifest),original);assert.equal(await scenes.load('dwarf.a11'),false);assert.equal(scenes.status('elf.a01').mode,'idle');assert.equal(scenes.status('unknown.a01').mode,'unavailable');scenes.dispose();assert.equal(await scenes.load('world'),false);assert.equal(scenes.status('world').mode,'disposed');
let decoded=0;globalThis.Image=class{naturalWidth=960;naturalHeight=540;async decode(){decoded++;if(decoded<=3)throw Error('test failure')}};
const retry=createPixelMapScenes({manifest});assert.equal(await retry.load('world'),false);assert.equal(retry.status('world').mode,'failed');calls=[];retry.draw(canvas,'world');assert.equal(calls.filter(c=>c[0]==='drawImage').length,0);assert.equal(await retry.load('world'),false);assert.equal(decoded,3);assert.equal(await retry.load('world',{retry:true}),true);assert.equal(decoded,4);
// Async completion must not repaint a detached or replaced area canvas.
let decodes=[];globalThis.Image=class{naturalWidth=480;naturalHeight=270;decode(){return new Promise(resolve=>{decodes.push({src:this.src,resolve})})}};
globalThis.fetch=async()=>({ok:true,json:async()=>explorationManifest});
const {drawAdjacentRegion}=await import('./dist/adjacent-region-map.js');let currentCanvas=canvas;const host={isConnected:true,querySelector:s=>s==='[data-region-canvas]'?currentCanvas:null};
const flush=()=>new Promise(resolve=>setImmediate(resolve));
drawAdjacentRegion(host,{id:'dwarf.a01'});await flush();host.isConnected=false;calls=[];decodes.splice(0).forEach(v=>v.resolve());await flush();assert.equal(calls.filter(c=>c[0]==='drawImage').length,0);
host.isConnected=true;drawAdjacentRegion(host,{id:'dwarf.a02'});await flush();const old=decodes.splice(0);drawAdjacentRegion(host,{id:'dwarf.a03'});await flush();const latest=decodes.splice(0);calls=[];old.forEach(v=>v.resolve());await flush();assert.equal(calls.filter(c=>c[0]==='drawImage').length,0);latest.forEach(v=>v.resolve());await flush();assert.equal(calls.filter(c=>c[0]==='drawImage').length,2);assert(calls.filter(c=>c[0]==='drawImage').every(c=>c[1].src.includes('oath-')));
console.log('PASS maps: world/A01–10, layers, immutable manifest, unsupported/dispose, failed placeholder and explicit retry, detached host and cross-area late-load safety.');
