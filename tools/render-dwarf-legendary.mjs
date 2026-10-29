import fs from 'node:fs';
import {createRequire} from 'node:module';
import {DWARF_LEGENDARY_HERO_ART as entries} from '../dist/legendary-hero-art/dwarf.js';
import {drawBattleSliceCanvas} from '../dist/battle-slice.js';
const require=createRequire(import.meta.url);let c;try{c=require('@napi-rs/canvas')}catch{c=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas')}
const {createCanvas,loadImage}=c;
for(const [id,sprite] of Object.entries(entries)){
 const images=new Map();for(const f of sprite.frames)images.set(f.file,await loadImage('dist/battle-assets/'+f.file));
 const contact=createCanvas(960,540),ctx=contact.getContext('2d');ctx.fillStyle='#17232b';ctx.fillRect(0,0,960,540);
 for(let i=0;i<8;i++){const f=sprite.frames[i],tile=createCanvas(240,270);drawBattleSliceCanvas(tile,{manifest:{sprites:{hero:sprite},backgrounds:[]},images,encounter:{enemies:[]},positions:{hero:{x:100,y:203,sprite:'hero',scale:1}},actorFrames:{hero:f.id}});ctx.drawImage(tile,(i%4)*240,Math.floor(i/4)*270);ctx.fillStyle='#e7bc58';ctx.font='14px sans-serif';ctx.fillText(f.id,(i%4)*240+12,Math.floor(i/4)*270+24);}
 fs.writeFileSync(`qa/legendary-race-art/dwarf-${id}-native.png`,contact.toBuffer('image/png'));
}
console.log('Rendered all 40 dwarf frames using production drawBattleSliceCanvas');
