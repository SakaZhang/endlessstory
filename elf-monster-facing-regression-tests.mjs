import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {RACE_PACK as elf} from './dist/races/elf/index.js';
import {extendBattleManifest} from './dist/race-art.js';
import {liveActorSprite} from './dist/live-battle-view.js';
import {battleSpriteFlipX,drawBattleSliceCanvas,presentationActorX} from './dist/battle-slice.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
// Independent pixel audit: idle, anticipation, strike, hurt, death. In particular,
// bats turn LEFT only in hurt; never apply a whole-sprite flip to their actions.
const expected={
 'elf.a02.normal.2':['right','left','left','left','right'],
 'elf.a03.normal.2':['right','right','left','left','left'],
 'elf.a04.elite':['right','left','right','right','right'],
 'elf.a05.normal.2':['right','right','right','left','right'],
 'elf.a09.normal.3':['right','right','right','left','right'],
};
const pngs=[...new Set(Object.values(elf.art.monsters).flatMap(s=>s.frames.map(f=>f.file)))].sort();
assert.equal(pngs.length,220);
const hash=createHash('sha256');for(const file of pngs)hash.update(file+'\0').update(fs.readFileSync('dist/'+file));
assert.equal(hash.digest('hex'),'fa4b4cb25763f6bdba5ded56fe02452f9935d1da588af051a100abd0b33b01d4','all 220 audited PNG bytes unchanged');
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')));
manifest.backgrounds=[];delete manifest.areaBackgrounds;
const images=new Map();
for(const key of ['elf-hero-neutral',...Object.keys(expected).map(id=>manifest.monsterSprites[id])])for(const frame of manifest.sprites[key].frames)images.set(frame.file,await loadImage('dist/battle-assets/'+frame.file));
for(const [parent,child]of [['elf.a05.elite','elf.a05.normal.2'],['elf.a08.elite','elf.a08.normal.2'],['elf.a10.boss','elf.a10.normal.2']]){
 assert.equal(elf.monsters[parent].trait.followerMonsterId,child);
 assert.equal(liveActorSprite({monsterId:parent,follower:true,followerMonsterId:child},manifest),manifest.monsterSprites[child]);
}
const canvas=createCanvas(480,270),ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx);let seen=[],checks=0;
ctx.drawImage=(img,...args)=>{seen.push({img,args,m:ctx.getTransform()});return draw(img,...args);};
const oldRandom=Math.random;Math.random=()=>{throw Error('presentation must not consume RNG');};
try{
 for(const [id,directions]of Object.entries(expected)){
  const key=manifest.monsterSprites[id],sprite=manifest.sprites[key];assert.equal(sprite.frames.length,5);
  sprite.frames.forEach((f,i)=>assert.equal(f.facing??sprite.facing,directions[i],f.id+' audited source pixels'));
  for(const [i,frame]of sprite.frames.entries())for(const heroX of [90,390])for(const reduced of [false,true]){
   const encounter={heroHp:100,enemies:[{id:'enemy',hp:i===4?0:100,max:100}]};
   const positions={hero:{x:heroX,y:203,sprite:'elf-hero-neutral'},enemy:{x:240,y:203,sprite:key}};
   const animations=new Map([['enemy',{kind:'attack',element:'physical',at:0,targetX:heroX}]]);
   const before=JSON.stringify({encounter,positions,manifest});seen=[];
   drawBattleSliceCanvas(canvas,{manifest,images,encounter,positions,animations,time:220,reduced,actorFrames:{enemy:frame.id}});
   const call=seen.find(r=>r.img===images.get(frame.file));assert(call,frame.id+' actual image');
   const actorX=reduced?240:presentationActorX(positions.enemy,animations.get('enemy'),220),want=heroX<actorX?'left':'right';
   const flip=directions[i]!==want;assert.equal(battleSpriteFlipX(sprite,frame,actorX,heroX),flip);
   assert.equal(call.m.a,flip?-1:1,frame.id+' actual native transform');assert.equal(call.m.d,1);
   assert.equal(call.m.e,actorX,'world foot X unchanged');assert.equal(call.m.f,203,'world foot Y unchanged');
   assert.deepEqual(call.args,[-sprite.anchor[0],-sprite.anchor[1]]);
   assert.equal(ctx.getTransform().a,1,'transform restored');assert.equal(ctx.getTransform().e,0);
   assert.equal(JSON.stringify({encounter,positions,manifest}),before,'read-only draw');checks++;
  }
  // Unforced animation selection must use the per-frame facing at each transition.
  for(const [kind,time,index]of [['idle',0,0],['attack',0,1],['attack',110,2],['attack',220,0],['hurt',0,3],['hurt',110,0],['cast',0,0]]){
   seen=[];drawBattleSliceCanvas(canvas,{manifest,images,encounter:{heroHp:100,enemies:[{id:'enemy',hp:100,max:100}]},positions:{hero:{x:90,y:203,sprite:'elf-hero-neutral'},enemy:{x:350,y:203,sprite:key}},animations:new Map([['enemy',{kind,at:0}]]),time});
   const f=sprite.frames[index],call=seen.find(r=>r.img===images.get(f.file));assert(call,id+' '+kind+' frame');assert.equal(call.m.a,directions[index]==='right'?-1:1);checks++;
  }
 }
}finally{Math.random=oldRandom;}
console.log(`PASS elf facing: 5 independently pixel-audited identities, 8 corrected frames, ${checks} native draws, both hero sides, reduced/moving actors, lifecycle selection, 3 follower routes, 220 unchanged PNGs.`);
