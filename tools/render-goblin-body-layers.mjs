import fs from 'node:fs';
import {legendaryFrameFiles,legendaryFrameBounds,drawLegendaryFrame} from '../dist/legendary-weapon-layer.js';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {GOBLIN_LEGENDARY_HERO_ART as ART} from '../dist/legendary-hero-art/goblin.js';
import {extendBattleManifest} from '../dist/race-art.js';
import {drawBattleSliceCanvas} from '../dist/battle-slice.js';
import {heroPresentationScale} from '../dist/hero-proportions.js';
const require=createRequire(import.meta.url);let C;try{C=require('@napi-rs/canvas')}catch{C=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas')}
const m=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')));
for(const [id,sprite] of Object.entries(ART)){
 const key='legendary-goblin-'+id, images=new Map();
 assert.equal(m.sprites[key].frames.length,8);
 for(const f of sprite.frames)for(const file of legendaryFrameFiles(sprite,f))images.set(file,await C.loadImage('dist/battle-assets/'+file));
 const contact=C.createCanvas(960,540),ctx=contact.getContext('2d');ctx.fillStyle='#17232b';ctx.fillRect(0,0,960,540);
 for(let i=0;i<8;i++){
  const f=sprite.frames[i], tile=C.createCanvas(240,270);
  drawBattleSliceCanvas(tile,{manifest:{...m,backgrounds:[],areaBackgrounds:undefined},images,encounter:{enemies:[]},positions:{hero:{x:100,y:203,sprite:key,scale:heroPresentationScale(sprite,'goblin')}},actorFrames:{hero:f.id}});
  ctx.drawImage(tile,(i%4)*240,Math.floor(i/4)*270);ctx.fillStyle='#e7bc58';ctx.font='14px sans-serif';ctx.fillText(f.id,(i%4)*240+12,Math.floor(i/4)*270+24);
 }
 fs.writeFileSync('qa/legendary-race-art/goblin-'+id+'-shared-native.png',contact.toBuffer('image/png'));
 const detail=C.createCanvas(1024,520),dc=detail.getContext('2d');dc.fillStyle='#293642';dc.fillRect(0,0,1024,520);
 for(let i=0;i<8;i++){const f=sprite.frames[i];drawLegendaryFrame(dc,sprite,f,images,{x:i%4*256,y:Math.floor(i/4)*260,scale:1});dc.fillStyle='#fff';dc.fillText(f.id,i%4*256+10,Math.floor(i/4)*260+20);const b=legendaryFrameBounds(sprite,f);assert(b[0]>=0&&b[1]>=0&&b[2]<256&&b[3]<256,id+' '+f.id+' weapon extent '+b);}
 fs.writeFileSync('qa/legendary-race-art/goblin-'+id+'-shared-detail.png',detail.toBuffer('image/png'));
 const portrait=C.createCanvas(200,200),pc=portrait.getContext('2d'),f=sprite.frames[0],b=legendaryFrameBounds(sprite,f),k=Math.min(176/(b[2]-b[0]+1),176/(b[3]-b[1]+1));pc.fillStyle='#293642';pc.fillRect(0,0,200,200);drawLegendaryFrame(pc,sprite,f,images,{x:12-b[0]*k,y:12-b[1]*k,scale:k});fs.writeFileSync('qa/legendary-race-art/goblin-'+id+'-shared-portrait.png',portrait.toBuffer('image/png'));
 console.log(id,heroPresentationScale(sprite,'goblin'),sprite.bodyReferenceBounds);
}
