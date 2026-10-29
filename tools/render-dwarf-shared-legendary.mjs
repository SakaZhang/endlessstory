import fs from 'node:fs';
import {createRequire} from 'node:module';
import {DWARF_LEGENDARY_HERO_ART as entries} from '../dist/legendary-hero-art/dwarf.js';
import {legendaryFrameFiles,drawLegendaryFrame,legendaryFrameBounds,CANONICAL_LEGENDARY_WEAPONS} from '../dist/legendary-weapon-layer.js';
import {drawBattleSliceCanvas} from '../dist/battle-slice.js';
const require=createRequire(import.meta.url);let c;try{c=require('@napi-rs/canvas')}catch{c=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas')}
const {createCanvas,loadImage}=c;
for(const [id,sprite] of Object.entries(entries)){
 const images=new Map();for(const f of sprite.frames)for(const file of legendaryFrameFiles(sprite,f))images.set(file,await loadImage('dist/battle-assets/'+file));
 const contact=createCanvas(1280,540),ctx=contact.getContext('2d');ctx.fillStyle='#17232b';ctx.fillRect(0,0,1280,540);
 for(let i=0;i<8;i++){const f=sprite.frames[i],tile=createCanvas(320,270);drawBattleSliceCanvas(tile,{manifest:{sprites:{hero:sprite},backgrounds:[]},images,encounter:{enemies:[]},positions:{hero:{x:100,y:203,sprite:'hero',scale:1}},actorFrames:{hero:f.id}});ctx.drawImage(tile,(i%4)*320,Math.floor(i/4)*270);ctx.fillStyle='#e7bc58';ctx.font='14px sans-serif';ctx.fillText(f.id,(i%4)*320+12,Math.floor(i/4)*270+24);}
 fs.writeFileSync(`qa/legendary-race-art/dwarf-shared-${id}-native.png`,contact.toBuffer('image/png'));
 const detail=createCanvas(2048,1024),dc=detail.getContext('2d');dc.fillStyle='#17232b';dc.fillRect(0,0,2048,1024);
 for(let i=0;i<8;i++){const f=sprite.frames[i];drawLegendaryFrame(dc,sprite,f,images,{x:(i%4)*512,y:Math.floor(i/4)*512,scale:2});dc.fillStyle='white';dc.font='15px sans-serif';dc.fillText(f.id,i%4*512+10,Math.floor(i/4)*512+25);}
 fs.writeFileSync(`qa/legendary-race-art/dwarf-shared-${id}-detail.png`,detail.toBuffer('image/png'));
 const portrait=createCanvas(160,150),pc=portrait.getContext('2d'),f=sprite.frames[0],b=legendaryFrameBounds(sprite,f),k=Math.min(140/(b[2]-b[0]+1),130/(b[3]-b[1]+1));pc.fillStyle='#17232b';pc.fillRect(0,0,160,150);drawLegendaryFrame(pc,sprite,f,images,{x:80-(b[0]+b[2])/2*k,y:140-b[3]*k,scale:k});fs.writeFileSync(`qa/legendary-race-art/dwarf-shared-${id}-portrait.png`,portrait.toBuffer('image/png'));
 for(const f of sprite.frames){const b=legendaryFrameBounds(sprite,f);if(b[0]<0||b[1]<0||b[2]>=256||b[3]>=256)console.log('BOUNDS',id,f.id,b);}

}
console.log('Rendered all 40 dwarf frames using production drawBattleSliceCanvas');
