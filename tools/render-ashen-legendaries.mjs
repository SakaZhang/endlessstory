import fs from 'node:fs';
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
 for(const f of sprite.frames)images.set(f.file,await C.loadImage('dist/battle-assets/'+f.file));
 const contact=C.createCanvas(960,540),ctx=contact.getContext('2d');ctx.fillStyle='#17232b';ctx.fillRect(0,0,960,540);
 for(let i=0;i<8;i++){
  const f=sprite.frames[i], tile=C.createCanvas(240,270);
  drawBattleSliceCanvas(tile,{manifest:{...m,backgrounds:[],areaBackgrounds:undefined},images,encounter:{enemies:[]},positions:{hero:{x:100,y:203,sprite:key,scale:heroPresentationScale(sprite,'ashen')}},actorFrames:{hero:f.id}});
  ctx.drawImage(tile,(i%4)*240,Math.floor(i/4)*270);ctx.fillStyle='#e7bc58';ctx.font='14px sans-serif';ctx.fillText(f.id,(i%4)*240+12,Math.floor(i/4)*270+24);
 }
 fs.writeFileSync('qa/legendary-race-art/ashen-'+id+'-native.png',contact.toBuffer('image/png'));
 console.log(id,heroPresentationScale(sprite,'ashen'),sprite.bodyReferenceBounds);
}
