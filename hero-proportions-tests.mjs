import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {extendBattleManifest} from './dist/race-art.js';
import {heroPresentationScale,HERO_REFERENCE_HEIGHTS} from './dist/hero-proportions.js';
import {createLiveBattlePresentation} from './dist/live-battle-view.js';
import {drawBattleSliceCanvas} from './dist/battle-slice.js';
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')));
const images=new Map([...manifest.backgrounds,...Object.values(manifest.campBackgrounds),...Object.values(manifest.sprites).flatMap(s=>s.frames)].map(f=>[f.file,{file:f.file}]));
const calls=[];const context=new Proxy({scale:(x,y)=>calls.push(['scale',x,y]),translate:(x,y)=>calls.push(['translate',x,y]),drawImage:(img,...args)=>calls.push(['image',img.file,...args]),measureText:()=>({width:10})},{get:(o,k)=>k in o?o[k]:()=>{}});
const canvas={width:160,height:150,getContext:()=>context};
const results=[];
for(const race of ['dwarf','human','elf','goblin','ashen']){
 const variants={...(race==='dwarf'?manifest.heroWeaponSprites:manifest.raceHeroWeaponSprites[race]),neutral:race==='dwarf'?'hero-neutral':manifest.raceHeroNeutralSprites[race]};
 for(const [weapon,key] of Object.entries(variants)){
  const sprite=manifest.sprites[key],idle=sprite.frames.find(f=>f.id===sprite.animations.idle[0]),box=idle.solidBBox??idle.alphaBBox,height=sprite.bodyReferenceBounds?sprite.bodyReferenceBounds[1]-sprite.bodyReferenceBounds[0]+1:box[3]-box[1]+1,scale=heroPresentationScale(sprite,race);
  assert.equal(height*scale,HERO_REFERENCE_HEIGHTS[race]??Math.min(94,height));
  const state=E.fresh(race);if(weapon==='neutral')state.equip.weapon=null;else state.inventory.find(it=>it.id===state.equip.weapon).weaponType=weapon;
  const view=createLiveBattlePresentation({manifest,images});
  for(const camp of [true,false]){state.atCamp=camp;state.siteId=race+'.a01';view.sync(state,null,{visible:true});assert.equal(view.status.mode,'ready');assert.equal(view.positions.hero.scale,scale);assert.equal(view.positions.hero.y,camp?manifest.campBackgrounds[race].baseline:203);assert(view.draw(canvas,0));}
  // Every native/neutral lifecycle frame uses the SAME transform and foot anchor.
  for(const frame of sprite.frames){calls.length=0;drawBattleSliceCanvas(canvas,{manifest:{...manifest,backgrounds:[],areaBackgrounds:undefined},images,encounter:{enemies:[]},positions:{hero:{x:100,y:203,sprite:key,scale}},actorFrames:{hero:frame.id}});assert(calls.some(c=>c[0]==='scale'&&Math.abs(c[1])===scale&&c[2]===scale));assert(calls.some(c=>c[0]==='translate'&&c[1]===100&&c[2]===203));assert(calls.some(c=>c[0]==='image'&&c[1]===frame.file&&c[2]===-sprite.anchor[0]&&c[3]===-sprite.anchor[1]));assert.equal(context.imageSmoothingEnabled,false);}
  calls.length=0;canvas.width=160;canvas.height=150;assert(view.drawPortrait(canvas,state));const draw=calls.find(c=>c[0]==='image');assert(draw);assert.equal(draw[4],draw[5],'aspect-preserving portrait scaling');
  if(HERO_REFERENCE_HEIGHTS[race])assert(Math.abs(height*draw[5]/192-(canvas.height-10)/112*HERO_REFERENCE_HEIGHTS[race])<1,'portrait body proportions preserved independent of weapon tip');
  results.push({race,weapon,rawHeight:height,renderHeight:height*scale,scale});view.dispose();
 }
}
assert(heroPresentationScale(manifest.sprites['hero-elf-bow'],'elf')>1);
assert.deepEqual(manifest.sprites['hero-elf-staff'].bodyReferenceBounds,[101,175]);
assert.equal(heroPresentationScale(manifest.sprites['hero-elf-staff'],'elf'),98/75);
assert.equal(HERO_REFERENCE_HEIGHTS.goblin,62);assert.equal(HERO_REFERENCE_HEIGHTS.elf,98);
console.log('PASS fixed idle-reference transforms for all native/neutral lifecycle frames, camp/field baselines, uniform portrait scaling, nearest-neighbor rendering; unchanged other race sizing.');
console.table(results);
