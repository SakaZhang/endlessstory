import fs from 'node:fs';
import * as E from '../dist/engine.js';
import {drawLiveHeroPortrait} from '../dist/live-battle-view.js';
import {createRequire} from 'node:module';
import {extendBattleManifest} from '../dist/race-art.js';
import {drawBattleSliceCanvas} from '../dist/battle-slice.js';
import {ELF_LEGENDARY_HERO_ART} from '../dist/legendary-hero-art/elf.js';
import {heroPresentationScale} from '../dist/hero-proportions.js';
const require=createRequire(import.meta.url);let cm;try{cm=require('@napi-rs/canvas')}catch{cm=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas')}
const {createCanvas,loadImage}=cm,m=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')));
for(const [id,sprite] of Object.entries(ELF_LEGENDARY_HERO_ART)){
 const key=`legendary-elf-${id}`,images=new Map();for(const f of sprite.frames)images.set(f.file,await loadImage('dist/battle-assets/'+f.file));
 const contact=createCanvas(1280,540),ctx=contact.getContext('2d');ctx.fillStyle='#17232b';ctx.fillRect(0,0,1280,540);
 for(let i=0;i<8;i++){const f=sprite.frames[i],tile=createCanvas(320,270);drawBattleSliceCanvas(tile,{manifest:{...m,backgrounds:[],areaBackgrounds:undefined},images,encounter:{enemies:[]},positions:{hero:{x:100,y:203,sprite:key,scale:heroPresentationScale(sprite,'elf')}},actorFrames:{hero:f.id}});ctx.drawImage(tile,i%4*320,Math.floor(i/4)*270);ctx.fillStyle='#e7bc58';ctx.font='14px sans-serif';ctx.fillText(f.id,i%4*320+12,Math.floor(i/4)*270+24);}
 fs.writeFileSync(`qa/legendary-race-art/elf-${id}-native.png`,contact.toBuffer('image/png'));
 const portrait=createCanvas(160,150),state=E.fresh('elf'),item=E.legendaryItem(id,20);state.inventory.push(item);E.equipItem(state,item.id);drawLiveHeroPortrait(portrait,state,{manifest:m,images});fs.writeFileSync(`qa/legendary-race-art/elf-${id}-portrait.png`,portrait.toBuffer('image/png'));
 console.log(id,sprite.frames.length,heroPresentationScale(sprite,'elf'));
}
