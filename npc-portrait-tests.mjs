import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {RACIAL_NPCS} from './dist/racial-npc-event-content.js';
import {NPC_PORTRAIT_REGISTRY} from './dist/npc-portrait-registry.js';
import {renderNpcPortrait,bindNpcPortraitErrors} from './dist/npc-portraits.js';
const {loadImage,createCanvas}=createRequire(import.meta.url)('@napi-rs/canvas');
const manifest=JSON.parse(fs.readFileSync('npc-portrait-source-manifest.json','utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex'),hashes=new Set();let bytes=0;
assert.equal(manifest.entries.length,30);assert.equal(Object.keys(NPC_PORTRAIT_REGISTRY).length,30);
for(const n of RACIAL_NPCS){
 const d=NPC_PORTRAIT_REGISTRY[n.id],m=manifest.entries.find(x=>x.id===n.id);assert(d&&m);assert.equal(m.name,n.name);assert.equal(m.race,n.race);assert.equal(m.runtime.path,'dist/'+d.file);
 const png=fs.readFileSync(m.runtime.path);bytes+=png.length;assert.equal(sha(png),m.runtime.sha256);hashes.add(sha(png));const image=await loadImage(png);assert.equal(image.width,96);assert.equal(image.height,96);
 const source=fs.readFileSync(m.source.path);assert.equal(sha(source),m.source.sha256);assert(m.prompt.includes('pixel'));assert.equal(m.method,'builtin image_gen');
 const canvas=createCanvas(96,96),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,96,96).data,colors=new Set();let visible=0;for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]>200)visible++;colors.add([pixels[i],pixels[i+1],pixels[i+2]].join(','));}assert(visible>96*96*.95,'opaque dark-teal portrait background');assert(colors.size>30,'actual art, not blank/glyph');
 const html=renderNpcPortrait(n.id);assert(html.includes('loading="lazy"'));assert(html.includes('decoding="async"'));assert(html.includes(`src="${d.file}"`));assert(html.includes(n.name));assert(!html.includes('<svg'));
}
assert.equal(hashes.size,30,'all thirty images independently distinct');assert(bytes<1024*1024,'all runtime cast under 1MiB');assert.equal(renderNpcPortrait('not-a-person'),'');assert.equal(renderNpcPortrait('__proto__'),'');
// Recoverable portrait wiring uses the same bounded handler as all v066 images.
const original={setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout};let timers=[],writes=[],listeners={},classes=new Set(),attrs={},message={hidden:true};
globalThis.setTimeout=(fn,delay)=>{timers.push({fn,delay});return timers.length;};globalThis.clearTimeout=()=>{};
const wrapper={classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k),contains:k=>classes.has(k)},querySelector:q=>q==='.npcPortraitError'?message:img,setAttribute:(k,v)=>attrs[k]=v,removeAttribute:k=>delete attrs[k]};
const img={dataset:{npcPortraitImage:'true'},alt:'朵菈 · 矿灯修理工',complete:false,naturalWidth:0,isConnected:true,matches:q=>q==='.npcPortraitImage',closest:()=>wrapper,getAttribute:()=> 'npc-portraits/npc.dwarf.dora.png',set src(v){writes.push(v);}};
const host={contains:n=>n===img&&n.isConnected,querySelectorAll:()=>[img],addEventListener:(k,f)=>listeners[k]=f,removeEventListener:k=>delete listeners[k]};
try{
 const dispose=bindNpcPortraitErrors(host);listeners.error({target:img});assert(img.hidden&&!message.hidden);assert.equal(timers.shift().delay,250); // first bounded backoff
 // Fire retry directly through the registered retry callback in a fresh error cycle.
 listeners.error({target:img});assert.equal(timers.length,0,'duplicate error while pending does not start a new timer');
 // Manual retry clears pending timer and loads the same canonical asset, not another NPC.
 let stopped=0;listeners.click({type:'click',target:{closest:()=>wrapper},preventDefault(){stopped++;},stopPropagation(){stopped++;}});assert.equal(stopped,2);assert.equal(writes.length,1);assert(writes[0].startsWith('npc-portraits/npc.dwarf.dora.png?asset_retry='));
 listeners.load({target:img});assert(!img.hidden&&message.hidden);assert.equal(attrs.role,'img');dispose();assert.deepEqual(listeners,{});
}finally{Object.assign(globalThis,original);}
const app=fs.readFileSync('dist/app.js','utf8');assert(app.includes('bindNpcPortraitErrors(document)'));
const module=fs.readFileSync('dist/npc-portraits.js','utf8');assert(!/new Image\(|fetch\(/.test(module),'no eager all-cast loading');
console.log(`PASS 30 unique actual PNG portraits (${bytes} bytes), 96px decode/source hashes/prompts, current-area lazy HTML, same-identity manual error retry and App binding. Native pixel QA; not a browser screenshot.`);
