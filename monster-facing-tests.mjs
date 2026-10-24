import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {battleSpriteFlipX,drawBattleSliceCanvas,presentationActorX} from './dist/battle-slice.js';
import {liveActorSprite} from './dist/live-battle-view.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const manifest=JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')),images=new Map();
for(const s of Object.values(manifest.sprites))for(const f of s.frames)images.set(f.file,await loadImage('dist/battle-assets/'+f.file));
const keys=new Set([...Object.values(manifest.monsterSprites),...manifest.actorVariants.map(v=>v.spriteKey)]);
assert.equal(Object.keys(manifest.monsterSprites).length,44);
for(const variant of manifest.actorVariants)assert.equal(liveActorSprite(variant.match,manifest),variant.spriteKey);
for(const source of ['left','right'])for(const target of [30,400])assert.equal(battleSpriteFlipX({facing:source},{},200,target),source!==(target<200?'left':'right'));
assert.equal(battleSpriteFlipX({facing:'left'},{facing:'right'},200,30),true);
assert.equal(battleSpriteFlipX({facing:'right'},{},200,undefined),false);
assert.equal(battleSpriteFlipX({facing:'right'},{},200,200),false);
const tablet=manifest.sprites['tablet-executioner'];for(const f of tablet.frames)assert.equal(f.facing??tablet.facing,['idle','anticipation','recovery','death'].includes(f.id)?'right':'left');
let checks=0;const c=createCanvas(480,270),ctx=c.getContext('2d'),draw=ctx.drawImage.bind(ctx);let seen=[];
ctx.drawImage=(img,...args)=>{seen.push({img,args,m:ctx.getTransform()});return draw(img,...args);};
const oldRandom=Math.random;Math.random=()=>{throw Error('draw must not use gameplay RNG');};
try{for(const key of keys){const sprite=manifest.sprites[key];for(const frame of sprite.frames)for(const heroX of [90,390])for(const reduced of [false,true]){
 const encounter={heroHp:100,enemies:[{id:'enemy',hp:frame.id==='death'?0:100,max:100}]},positions={hero:{x:heroX,y:203,sprite:'dwarf'},enemy:{x:240,y:203,sprite:key}};
 const animations=new Map([['enemy',{kind:'attack',element:'physical',at:0,targetX:heroX}]]),before=JSON.stringify({encounter,positions,manifest});seen=[];
 drawBattleSliceCanvas(c,{manifest:{...manifest,backgrounds:[],areaBackgrounds:undefined},images,encounter,positions,animations,time:220,reduced,actorFrames:{enemy:frame.id},floats:[{at:0,x:240,y:110,text:'17',color:'#fff'}]});
 const call=seen.find(r=>r.img===images.get(frame.file));assert(call,`${key}/${frame.id} identity`);
 const actorX=reduced?240:presentationActorX(positions.enemy,animations.get('enemy'),220),flip=(frame.facing??sprite.facing)!==(heroX<actorX?'left':'right');
 assert.equal(call.m.a,flip?-1:1,`${key}/${frame.id} facing`);assert.equal(call.m.d,1);
 assert.equal(call.m.a*(flip?-sprite.anchor[0]+sprite.anchor[0]:call.args[0]+sprite.anchor[0])+call.m.e,actorX,'same world anchor');
 assert.equal(ctx.getTransform().a,1,'bars/floats not mirrored');assert.equal(ctx.getTransform().e,0);
 assert.equal(JSON.stringify({encounter,positions,manifest}),before);checks++;
 }}
 // Unforced lifecycle selection: idle -> anticipation -> strike -> recovery ->
 // idle; cast falls back to idle, and hurt uses its own authored orientation.
 for(const [kind,time,expected] of [['idle',0,'idle'],['attack',0,'anticipation'],['attack',110,'strike'],['attack',220,'recovery'],['attack',330,'idle'],['attack',700,'idle'],['cast',200,'idle'],['hurt',0,'hurt'],['hurt',110,'idle']]){
  seen=[];const animations=new Map([['enemy',{kind,at:0}]]);
  drawBattleSliceCanvas(c,{manifest:{...manifest,backgrounds:[],areaBackgrounds:undefined},images,encounter:{heroHp:1,enemies:[{id:'enemy',hp:1}]},positions:{hero:{x:90,y:203,sprite:'dwarf'},enemy:{x:350,y:203,sprite:'tablet-executioner'}},animations,time});
  const frame=tablet.frames.find(f=>f.id===expected),call=seen.find(r=>r.img===images.get(frame.file));assert(call,kind+' chooses '+expected);assert.equal(call.m.a,(frame.facing??tablet.facing)==='right'?-1:1);
 }
 // Hero crossing the enemy during a lunge must use its displayed, not formation, X.
 seen=[];drawBattleSliceCanvas(c,{manifest:{...manifest,backgrounds:[],areaBackgrounds:undefined},images,encounter:{heroHp:1,enemies:[{id:'enemy',hp:1}]},positions:{hero:{x:90,y:203,sprite:'dwarf'},enemy:{x:240,y:203,sprite:'raider'}},animations:new Map([['hero',{kind:'attack',element:'physical',at:0,targetX:400}]]),time:220});assert.equal(seen.find(r=>r.img===images.get(manifest.sprites.raider.frames[0].file)).m.a,-1);
}finally{Math.random=oldRandom;}
console.log(`PASS ${checks} native draws: 44 monster identities + ${manifest.actorVariants.length} follower variants, every source frame, both hero sides, reduced/normal, anchors, transform isolation, state/RNG invariance.`);
