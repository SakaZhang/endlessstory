import {createHash} from 'node:crypto';
import {CANONICAL_LEGENDARY_WEAPONS,legendaryFrameFiles,legendaryFrameBounds} from './dist/legendary-weapon-layer.js';
import {heroPresentationScale} from './dist/hero-proportions.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import * as E from './dist/engine.js';
import {LEGENDARY_EQUIPMENT_DEFINITIONS} from './dist/legendary-equipment.js';
import {equipmentPresentation} from './dist/equipment-presentation.js';
import {equipmentIcon} from './dist/equipment-art.js';
import {extendBattleManifest} from './dist/race-art.js';
import {liveHeroSpriteFor,createLiveBattlePresentation,drawLiveHeroPortrait} from './dist/live-battle-view.js';
import {drawBattleSliceCanvas,battleSpriteFlipX} from './dist/battle-slice.js';
const m=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')));
const key='legendary-human-first-forge-oathhammer',sprite=m.sprites[key];
assert.equal(liveHeroSpriteFor('hammer',m,'human','first-forge-oathhammer'),key);
assert.equal(liveHeroSpriteFor('hammer',m,'human'),m.raceHeroNeutralSprites.human);
assert.equal(sprite.frames.length,8);assert.equal(sprite.anchor[1],176);assert(sprite.anchor[0]>=0&&sprite.anchor[0]<sprite.frameSize[0]);assert.equal(sprite.facing,'right');
for(const [id,def] of Object.entries(LEGENDARY_EQUIPMENT_DEFINITIONS)){
 const item=E.legendaryItem(id,20),before=JSON.stringify(item);assert(item,id);
 assert.equal(item.rarity,3);assert.equal(equipmentPresentation(item).quality,4,id);assert(equipmentIcon(item).includes('data-equipment-quality="4"'),id);assert.equal(JSON.stringify(item),before);
}
assert.equal(equipmentPresentation({rarity:3}).quality,3);
const registered=Object.entries(m.legendaryHeroSprites).flatMap(([race,entries])=>Object.entries(entries).map(([id,key])=>({race,id,key})));
const images=new Map([...m.backgrounds,...Object.values(m.campBackgrounds),...Object.values(m.sprites).flatMap(s=>s.frames.flatMap(f=>legendaryFrameFiles(s,f).map(file=>({file}))))].map(f=>[f.file,{}]));
for(const weapon of Object.values(CANONICAL_LEGENDARY_WEAPONS))assert.equal(createHash('sha256').update(fs.readFileSync('dist/battle-assets/'+weapon.file)).digest('hex'),weapon.sha256);
for(const {race,id,key} of registered){
 const sprite=m.sprites[key],def=LEGENDARY_EQUIPMENT_DEFINITIONS[id];assert(def?.weaponType,id);if(process.argv.includes('--require-shared'))assert.equal(sprite.legendaryWeapon?.id,id,key+' must use canonical shared weapon');if(sprite.legendaryWeapon){assert.equal(sprite.legendaryWeapon.id,id);assert(sprite.legendaryWeapon.scale>0);for(const f of sprite.frames){assert(f.weaponPose);assert(!('file' in f.weaponPose));assert(!('scale' in f.weaponPose));const b=legendaryFrameBounds(sprite,f);assert(b[0]>=0&&b[1]>=0&&b[2]<sprite.frameSize[0]&&b[3]<sprite.frameSize[1],key+' '+f.id+' full weapon bounds '+b);}}
 assert.equal(liveHeroSpriteFor(def.weaponType,m,race,id),key);
 assert.notEqual(liveHeroSpriteFor(def.weaponType,m,race),key,'ordinary weapon never receives legendary identity');
 assert.equal(sprite.frames.length,8);assert.equal(sprite.anchor[1],176);assert(sprite.anchor[0]>=0&&sprite.anchor[0]<sprite.frameSize[0]);assert.equal(sprite.facing,'right');
 for(const kind of ['idle','anticipation','attack','recovery','hurt','guard','death']){assert(sprite.animations[kind]?.length,`${key} ${kind}`);for(const frame of sprite.animations[kind])assert(sprite.frames.some(f=>f.id===frame));}
 for(const f of sprite.frames){assert(fs.existsSync('dist/battle-assets/'+f.file));assert(f.alphaBBox[0]>=0&&f.alphaBBox[1]>=0&&f.alphaBBox[2]<sprite.frameSize[0]&&f.alphaBBox[3]<sprite.frameSize[1],key+' bounds');}
 const s=E.fresh(race),it=E.legendaryItem(id,20);s.inventory.push(it);assert(E.equipItem(s,it.id));
 const view=createLiveBattlePresentation({manifest:m,images});for(const camp of [true,false]){s.atCamp=camp;s.siteId=race+'.a01';view.sync(s,null,{visible:true});assert.equal(view.positions.hero.sprite,key);assert.equal(view.status.mode,'ready');}
 s.equip.weapon=null;view.sync(s,null,{visible:true});assert.equal(view.positions.hero.sprite,race==='dwarf'?'hero-neutral':m.raceHeroNeutralSprites[race]);view.dispose();
 assert(battleSpriteFlipX(sprite,{},300,100));assert(!battleSpriteFlipX(sprite,{},100,300));
}
// Actual scoped loader switching from one legendary to another, then unequipping.
const previousImage=globalThis.Image,requested=[];globalThis.Image=class {async decode(){requested.push(this.src);}};
try{for(const race of new Set(registered.map(x=>x.race))){
 const s=E.fresh(race),view=createLiveBattlePresentation({manifest:m});
 for(const {id,key} of registered.filter(x=>x.race===race)){
  const item=E.legendaryItem(id,20);s.inventory.push(item);assert(E.equipItem(s,item.id));const start=requested.length;view.sync(s,null,{visible:true});await view.load();assert.equal(view.positions.hero.sprite,key);assert.equal(view.status.mode,'ready');assert(requested.slice(start).some(file=>file.includes('legendary-hero-body/')||file.includes('legendary-hero-assets/')),key+' switched preload');
  assert.equal(view.debug.imageCacheSize,m.sprites[key].frames.length+1+(m.sprites[key].legendaryWeapon?1:0),'only current hero, canonical weapon and camp cached');
 }
 view.sync(s,null,{visible:false});await view.load();assert.equal(view.debug.imageCacheSize,3,'hidden legendary portrait loads only two body idle frames and canonical weapon');
 s.equip.weapon=null;view.sync(s,null,{visible:true});await view.load();assert.equal(view.positions.hero.sprite,race==='dwarf'?'hero-neutral':m.raceHeroNeutralSprites[race]);assert.equal(view.status.mode,'ready');view.dispose();
}}finally{globalThis.Image=previousImage;}
if(process.argv.includes('--render')){
 const require=createRequire(import.meta.url);let canvasModule;try{canvasModule=require('@napi-rs/canvas');}catch{canvasModule=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');}
 const {createCanvas,loadImage}=canvasModule;
 for(const {race,id,key} of registered){
 const sprite=m.sprites[key],realImages=new Map();
 for(const f of sprite.frames){const image=await loadImage('dist/battle-assets/'+f.file);assert.equal(image.width,sprite.frameSize[0],key+' frame width');assert.equal(image.height,sprite.frameSize[1],key+' frame height');realImages.set(f.file,image);for(const file of legendaryFrameFiles(sprite,f))if(!realImages.has(file))realImages.set(file,await loadImage('dist/battle-assets/'+file));}
 const contact=createCanvas(1280,600),ctx=contact.getContext('2d');ctx.fillStyle='#17232b';ctx.fillRect(0,0,1280,600);
 for(let i=0;i<sprite.frames.length;i++){
  const f=sprite.frames[i],tile=createCanvas(320,300);
  drawBattleSliceCanvas(tile,{manifest:{...m,backgrounds:[],areaBackgrounds:undefined},images:realImages,encounter:{enemies:[]},positions:{hero:{x:128,y:220,sprite:key,scale:heroPresentationScale(sprite,race)}},actorFrames:{hero:f.id}});
  ctx.drawImage(tile,(i%4)*320,Math.floor(i/4)*300);ctx.fillStyle='#e7bc58';ctx.font='14px sans-serif';ctx.fillText(f.id,(i%4)*320+12,Math.floor(i/4)*300+24);
 }
 const portrait=createCanvas(160,150),s=E.fresh(race),it=E.legendaryItem(id,20);s.inventory.push(it);E.equipItem(s,it.id);assert(drawLiveHeroPortrait(portrait,s,{manifest:m,images:realImages}));
 fs.mkdirSync('qa/legendary-race-art',{recursive:true});fs.writeFileSync(`qa/legendary-race-art/${race}-${id}-native.png`,contact.toBuffer('image/png'));fs.writeFileSync(`qa/legendary-race-art/${race}-${id}-portrait.png`,portrait.toBuffer('image/png'));
 }
}
fs.mkdirSync('qa/legendary-race-art',{recursive:true});fs.writeFileSync('qa/legendary-race-art/coverage.json',JSON.stringify({dedicatedCombinations:registered.length,frames:registered.length*8,sharedCombinations:registered.filter(x=>m.sprites[x.key].legendaryWeapon).length,registered},null,2)+'\n');
console.log(`PASS: 14 legendary gold identities; ${registered.length} dedicated race/legend combinations (${registered.filter(x=>m.sprites[x.key].legendaryWeapon).length} shared-canonical), 8 frames each; equip/unequip, camp/field, scoped loading switch, facing and portrait render.`);
