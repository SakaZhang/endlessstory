import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {HUMAN_ART} from './dist/races/human/art.js';
import {extendBattleManifest} from './dist/race-art.js';
import {drawBattleSliceCanvas,battleSpriteFrames} from './dist/battle-slice.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const art=HUMAN_ART.monsters['human.a10.boss'],states=['idle','anticipation','attack','recovery','hurt','death'];
assert.deepEqual(art.frames.map(f=>f.id),states);assert.deepEqual(art.anchor,[96,176]);assert.equal(art.facing,'left');
const hashes=new Set(),images=new Map(),manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')));
const key=manifest.monsterSprites['human.a10.boss'];assert(key);assert(manifest.sprites[key]);
for(const f of art.frames){const file='dist/'+f.file,buf=fs.readFileSync(file);hashes.add(createHash('sha256').update(buf).digest('hex'));const im=await loadImage(file);assert.equal(im.width,192);assert.equal(im.height,192);const c=createCanvas(192,192),ctx=c.getContext('2d');ctx.drawImage(im,0,0);const d=ctx.getImageData(0,0,192,192).data;let b=[192,192,-1,-1],solid=[192,192,-1,-1];for(let y=0;y<192;y++)for(let x=0;x<192;x++){const a=d[(y*192+x)*4+3];if(a)b=[Math.min(b[0],x),Math.min(b[1],y),Math.max(b[2],x),Math.max(b[3],y)];if(a>32)solid=[Math.min(solid[0],x),Math.min(solid[1],y),Math.max(solid[2],x),Math.max(solid[3],y)];}assert.deepEqual(b,f.alphaBBox);assert(b[0]>0&&b[2]<191);assert(Math.abs(solid[3]-175)<=2,`${f.id}: visible ground ${solid[3]}`);if(f.id==='death')assert(solid[3]-solid[1]<60,'true low collapsed death');for(const id of battleSpriteFrames(art,f.id))assert(states.includes(id));images.set(manifest.sprites[key].frames.find(x=>x.id===f.id).file,im);}
assert.equal(hashes.size,6,'six distinct image files');
for(const bg of manifest.backgrounds){const path=bg.file.startsWith('../')?'dist/'+bg.file.slice(3):'dist/battle-assets/'+bg.file;if(fs.existsSync(path))images.set(bg.file,await loadImage(path));}
for(const f of manifest.sprites['hero-human'].frames)images.set(f.file,await loadImage('dist/battle-assets/'+f.file));
const out='qa/human-level100-boss';fs.mkdirSync(out,{recursive:true});const sheet=createCanvas(960,3*294),ctx=sheet.getContext('2d');ctx.fillStyle='#14202d';ctx.fillRect(0,0,960,882);ctx.font='14px sans-serif';ctx.fillStyle='#ffffff';
for(let i=0;i<states.length;i++){const c=createCanvas(480,270);drawBattleSliceCanvas(c,{manifest,images,encounter:{areaId:'human.a10',heroHp:100,enemies:[{id:'boss',hp:states[i]==='death'?0:100,max:100}]},positions:{hero:{x:100,y:203,sprite:'hero-human'},boss:{x:350,y:203,sprite:key}},actorFrames:{boss:states[i]},time:0,heroMaxHp:100});ctx.drawImage(c,(i%2)*480,Math.floor(i/2)*294+24);ctx.fillText(states[i],(i%2)*480+8,Math.floor(i/2)*294+18);}
fs.writeFileSync(out+'/native-six-states.png',sheet.toBuffer('image/png'));fs.writeFileSync(out+'/art-evidence.json',JSON.stringify({kind:'production drawBattleSliceCanvas native render, not browser',spriteKey:key,states,anchor:art.anchor,alphaBounds:art.frames.map(f=>({id:f.id,bounds:f.alphaBBox})),distinctHashes:hashes.size},null,2));console.log('PASS human level100 boss: 6 unique generated PNGs, exact alpha bounds, stable visible ground, complete lifecycle and production native render');
