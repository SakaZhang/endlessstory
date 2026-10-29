import fs from 'node:fs';
import * as E from '../dist/engine.js';
import {drawLiveHeroPortrait} from '../dist/live-battle-view.js';
import {legendaryFrameFiles,legendaryFrameBounds,drawLegendaryFrame,CANONICAL_LEGENDARY_WEAPONS} from '../dist/legendary-weapon-layer.js';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {ASHEN_LEGENDARY_HERO_ART as ART} from '../dist/legendary-hero-art/ashen.js';
import {extendBattleManifest} from '../dist/race-art.js';
import {drawBattleSliceCanvas} from '../dist/battle-slice.js';
import {heroPresentationScale} from '../dist/hero-proportions.js';
const require=createRequire(import.meta.url);let C;try{C=require('@napi-rs/canvas')}catch{C=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas')}
const m=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')));
for(const [id,sprite] of Object.entries(ART)){
 const key='legendary-ashen-'+id, images=new Map();
 assert.equal(m.sprites[key].frames.length,8);
 for(const f of sprite.frames)for(const file of legendaryFrameFiles(sprite,f))images.set(file,await C.loadImage('dist/battle-assets/'+file));
 const contact=C.createCanvas(960,540),ctx=contact.getContext('2d');ctx.fillStyle='#17232b';ctx.fillRect(0,0,960,540);
 for(let i=0;i<8;i++){
  const f=sprite.frames[i], tile=C.createCanvas(240,270);
  drawBattleSliceCanvas(tile,{manifest:{...m,backgrounds:[],areaBackgrounds:undefined},images,encounter:{enemies:[]},positions:{hero:{x:100,y:203,sprite:key,scale:heroPresentationScale(sprite,'ashen')}},actorFrames:{hero:f.id}});
  ctx.drawImage(tile,(i%4)*240,Math.floor(i/4)*270);ctx.fillStyle='#e7bc58';ctx.font='14px sans-serif';ctx.fillText(f.id,(i%4)*240+12,Math.floor(i/4)*270+24);
 }
 fs.writeFileSync('qa/legendary-race-art/ashen-'+id+'-shared-native.png',contact.toBuffer('image/png'));
 const portrait=C.createCanvas(160,150),state=E.fresh('ashen'),item=E.legendaryItem(id,20);state.inventory.push(item);E.equipItem(state,item.id);drawLiveHeroPortrait(portrait,state,{manifest:m,images});fs.writeFileSync('qa/legendary-race-art/ashen-'+id+'-shared-portrait.png',portrait.toBuffer('image/png'));
 const compare=C.createCanvas(960,660),cc=compare.getContext('2d');cc.fillStyle='#17232b';cc.fillRect(0,0,960,660);cc.imageSmoothingEnabled=false;cc.drawImage(images.get(CANONICAL_LEGENDARY_WEAPONS[id].file),20,10,96,96);cc.drawImage(portrait,160,0,128,120);cc.fillStyle='#e7bc58';cc.font='16px sans-serif';cc.fillText(id+' — original PNG / production portrait / eight poses',310,55);cc.drawImage(contact,0,120);fs.writeFileSync('qa/legendary-race-art/ashen-'+id+'-canonical-comparison.png',compare.toBuffer('image/png'));
 const proof=C.createCanvas(1600,600),p=proof.getContext('2d');p.fillStyle='#17232b';p.fillRect(0,0,1600,600);p.imageSmoothingEnabled=false;for(let i=0;i<8;i++){p.fillStyle='#e7bc58';p.fillText(sprite.frames[i].id,(i%4)*400+10,Math.floor(i/4)*300+20);drawLegendaryFrame(p,sprite,sprite.frames[i],images,{x:(i%4)*400+20,y:Math.floor(i/4)*300+20,scale:1.4});}fs.writeFileSync('qa/legendary-race-art/ashen-'+id+'-shared-detail.png',proof.toBuffer('image/png'));
 console.log(id,heroPresentationScale(sprite,'ashen'),sprite.bodyReferenceBounds);
}
