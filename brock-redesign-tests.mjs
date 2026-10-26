import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import * as E from './dist/engine.js';
import {extendBattleManifest} from './dist/race-art.js';
import {createLiveBattlePresentation,liveHeroSpriteFor,liveHasAuthoredAnimation} from './dist/live-battle-view.js';
import {drawBattleSliceCanvas} from './dist/battle-slice.js';
import {heroPresentationScale} from './dist/hero-proportions.js';
import {captureCombatDisplay} from './dist/combat-display-bridge.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const base=JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')),manifest=extendBattleManifest(base),out='qa/brock-redesign';fs.mkdirSync(out,{recursive:true});
const old=JSON.parse(execFileSync('git',['show','ddfcc19:dist/battle-assets/manifest.json'],{encoding:'utf8'}));
for(const key of Object.keys(old.sprites).filter(k=>!['dwarf','dwarf-hammer','hero-neutral'].includes(k)))assert.deepEqual(base.sprites[key],old.sprites[key],key+' unrelated sprite unchanged');
for(const key of ['backgrounds','campBackgrounds','heroWeaponSprites','monsterSprites','actorVariants'])assert.deepEqual(base[key],old[key],key+' gameplay art routes unchanged');
const images=new Map();for(const f of [...manifest.backgrounds,...Object.values(manifest.campBackgrounds),...Object.values(manifest.sprites).flatMap(s=>s.frames)])if(!images.has(f.file))images.set(f.file,await loadImage(new URL(f.file,new URL('./dist/battle-assets/',import.meta.url)).pathname));
function bounds(data,threshold){const b=[192,192,-1,-1];for(let y=0;y<192;y++)for(let x=0;x<192;x++)if(data[(y*192+x)*4+3]>threshold){b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y);}return b;}
const evidence={label:'Actual production canvas renders; NOT browser screenshots. Phase probes are explicitly labelled separately from real E.step event captures.',frames:[],realEvents:[],probes:[]};
const sheet=createCanvas(9*480,3*270),sheetCtx=sheet.getContext('2d');let row=0;
for(const [key,count,height] of [['dwarf',9,60],['dwarf-hammer',8,63],['hero-neutral',8,60]]){
 const sprite=manifest.sprites[key];assert.equal(sprite.frames.length,count);assert.deepEqual(sprite.frameSize,[192,192]);assert.deepEqual(sprite.anchor,[96,176]);assert.equal(sprite.facing,'right');assert.deepEqual(sprite.bodyReferenceBounds,[176-height,175]);assert.equal(heroPresentationScale(sprite,'dwarf'),1);
 const scales=new Set(sprite.frames.map(f=>f.sourceScale));assert.equal(scales.size,1,'one uniform scale for complete lifecycle');const hashes=new Set();
 for(const [column,f] of sprite.frames.entries()){
  const img=images.get(f.file);assert.equal(img.width,192);assert.equal(img.height,192);const c=createCanvas(192,192),cx=c.getContext('2d');cx.drawImage(img,0,0);const data=cx.getImageData(0,0,192,192).data;
  assert.deepEqual(bounds(data,0),f.alphaBBox);assert.deepEqual(bounds(data,128),f.solidBBox);assert(f.alphaBBox[0]>1&&f.alphaBBox[1]>1&&f.alphaBBox[2]<190&&f.alphaBBox[3]<190,f.file+' no edge clipping');
  hashes.add(createHash('sha256').update(c.toBuffer('image/png')).digest('hex'));
  const canvas=createCanvas(480,270);drawBattleSliceCanvas(canvas,{manifest:{...manifest,areaBackgrounds:undefined,backgrounds:[manifest.campBackgrounds.dwarf]},images,encounter:{heroHp:100,enemies:[]},positions:{hero:{x:144,y:manifest.campBackgrounds.dwarf.baseline,sprite:key,scale:1}},actorFrames:{hero:f.id},heroMaxHp:0,time:0});
  sheetCtx.drawImage(canvas,column*480,row*270);fs.writeFileSync(`${out}/renderer-${key}-${f.id}.png`,canvas.toBuffer('image/png'));evidence.frames.push({key,id:f.id,file:f.file,sourceScale:f.sourceScale,alphaBBox:f.alphaBBox,solidBBox:f.solidBBox,footAnchor:sprite.anchor,bodyReference:sprite.bodyReferenceBounds});
 }
 assert.equal(hashes.size,count,'all lifecycle frames are independently authored, not jitter copies');
 for(const mode of ['idle','attack','hurt','death'])assert(liveHasAuthoredAnimation(sprite,mode));row++;
}
fs.writeFileSync(out+'/all-25-production-renderer.png',sheet.toBuffer('image/png'));
assert(!liveHasAuthoredAnimation({frames:[{id:'idle'}],animations:{idle:['idle']}},'attack'));assert(!liveHasAuthoredAnimation({frames:[{id:'idle'}],animations:{attack:['missing']}},'attack'));
function stateFor(type){const s=E.fresh('dwarf');if(type===null)s.equip.weapon=null;else{const origin=type==='staff'?'elf':'dwarf';let item;for(let i=0;i<2000;i++){item=E.item('weapon',1,null,0,{originRace:origin});if(item.weaponType===type)break;}assert.equal(item.weaponType,type);s.inventory.push(item);assert(E.equipItem(s,item.id));}assert(E.validSave(s));return s;}
function tracingCanvas(){const c=createCanvas(480,270),ctx=c.getContext('2d'),calls=[],draw=ctx.drawImage.bind(ctx);ctx.drawImage=(img,...args)=>{calls.push(img);return draw(img,...args)};return {c,calls};}
for(const type of ['axe','hammer',null,'staff']){
 const state=stateFor(type),key=liveHeroSpriteFor(type,manifest,'dwarf'),sprite=manifest.sprites[key],encounter=E.startInstanceEncounter(state,'dwarf.a01.field',10000);assert(encounter);
 const v=createLiveBattlePresentation({manifest,images});let real=[];for(let i=0;i<30&&!encounter.done&&!real.some(e=>e.sourceId==='hero'&&e.kind==='hit');i++)real.push(...captureCombatDisplay(encounter,()=>E.step(state,encounter,state.nextActionAt)).events);assert(real.length);v.sync(state,encounter,{visible:true,running:true});v.enqueue(real,0);const tc=tracingCanvas();assert(v.draw(tc.c,250));assert(tc.calls.some(img=>sprite.frames.some(f=>images.get(f.file)===img)));fs.writeFileSync(`${out}/real-${type??'unarmed'}-combat.png`,tc.c.toBuffer('image/png'));evidence.realEvents.push({weapon:type,key,events:real});
 for(const [width,height]of [[160,150],[192,220]]){const portrait=createCanvas(width,height);assert(v.drawPortrait(portrait,state));const pixels=portrait.getContext('2d').getImageData(0,0,width,height).data;for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(x===0||y===0||x===width-1||y===height-1)assert(pixels[(y*width+x)*4+3]<128,'portrait horns and feet are not clipped at edge');fs.writeFileSync(`${out}/portrait-${type??'unarmed'}-${width}x${height}.png`,portrait.toBuffer('image/png'));}v.dispose();
 // Display-only probes cover every phase regardless of combat RNG. No save or damage mutation.
 const probe=structuredClone(encounter);probe.done=false;probe.heroHp=100;probe.enemies[0].hp=100;const enemy=probe.enemies[0].id;
 const event=(source,target,id)=>({eventId:id,battleId:probe.id,castId:id,sourceId:source,targetId:target,kind:'hit',hitId:null,skillId:null,element:'physical',crit:false,outcome:'hit',segmentIndex:0,hpDelta:-1,shieldDelta:0,combatAt:10000});
 const pv=createLiveBattlePresentation({manifest,images});pv.sync(state,probe,{visible:true,running:true});assert.equal(pv.enqueue([event('hero',enemy,'attack-probe')],0).accepted,1);const seen=new Set();
 for(const t of [250,360,470,580,690]){const frame=tracingCanvas();assert(pv.draw(frame.c,t));const found=sprite.frames.find(f=>frame.calls.includes(images.get(f.file)));assert(found);seen.add(found.id);fs.writeFileSync(`${out}/probe-${type??'unarmed'}-attack-${t}.png`,frame.c.toBuffer('image/png'));}
 assert.deepEqual([...seen],sprite.animations.attack,'full five-phase sequence, not position jitter');pv.dispose();
 const hv=createLiveBattlePresentation({manifest,images});hv.sync(state,probe,{visible:true,running:true});hv.enqueue([event(enemy,'hero','hurt-probe')],0);const ht=tracingCanvas();assert(hv.draw(ht.c,270));assert(ht.calls.includes(images.get(sprite.frames.find(f=>f.id==='hurt').file)));hv.dispose();
 const dv=createLiveBattlePresentation({manifest,images});dv.sync({...state,heroHp:0},{...probe,heroHp:0},{visible:true,running:true});const dt=tracingCanvas();assert(dv.draw(dt.c,1000));assert(dt.calls.includes(images.get(sprite.frames.find(f=>f.id==='death').file)));dv.dispose();
 if(type===null||type==='staff'){for(const wrong of ['dwarf','dwarf-hammer'])assert(!manifest.sprites[wrong].frames.some(f=>tc.calls.includes(images.get(f.file))),'no ghost native weapon');}
 evidence.probes.push({weapon:type,key,attack:[...seen],hurt:'hurt',death:'death'});
}
// Compatibility test using the historical idle-only neutral manifest with current pixels.
const legacy=structuredClone(manifest);legacy.sprites['hero-neutral']=old.sprites['hero-neutral'];const state=stateFor(null),e=E.startInstanceEncounter(state,'dwarf.a01.field',10000),view=createLiveBattlePresentation({manifest:legacy,images});view.sync(state,e,{visible:true,running:true});assert.equal(view.status.heroAppearance,'neutral-idle');view.enqueue([{eventId:'legacy',battleId:e.id,castId:'legacy',sourceId:'hero',targetId:e.enemies[0].id,kind:'hit',hitId:null,skillId:null,element:'physical',crit:false,outcome:'hit',segmentIndex:0,hpDelta:-1,shieldDelta:0,combatAt:10000}],0);const lc=tracingCanvas();assert(view.draw(lc.c,250));assert(lc.calls.includes(images.get('hero-neutral-idle.png')));view.dispose();
fs.writeFileSync(out+'/evidence.json',JSON.stringify(evidence,null,2));
console.log('PASS 25 measured RGBA bounds/no clipping/unique authored frames, fixed body heights and per-family scale, 25 real production-renderer captures, axe/hammer/unarmed/foreign-staff real engine events, every five-phase attack + hurt/death render, empty-hand routing, historical idle-only fallback. No browser proof claimed.');
