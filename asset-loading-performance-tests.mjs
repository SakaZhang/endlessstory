import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createLiveBattlePresentation,liveHeroWeaponType,liveActorSprite,liveSceneBackgrounds} from './dist/live-battle-view.js';
import {extendBattleManifest} from './dist/race-art.js';
import * as E from './dist/engine.js';
const base=JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')),manifest=extendBattleManifest(base);
const original={fetch:globalThis.fetch,Image:globalThis.Image};
let requests=[],deferred=[],hold=false;
globalThis.fetch=async()=>({ok:true,json:async()=>base});
globalThis.Image=class{async decode(){requests.push(this.src);if(hold)await new Promise(resolve=>deferred.push(resolve));}};
const heroFor=s=>manifest.raceHeroWeaponSprites[s.race]?.[liveHeroWeaponType(s)]??manifest.raceHeroSprites[s.race]??({axe:'dwarf',hammer:'dwarf-hammer'})[liveHeroWeaponType(s)]??'hero-neutral';
const idleFiles=s=>{const sprite=manifest.sprites[heroFor(s)];return sprite.frames.filter(f=>sprite.animations.idle.includes(f.id)).map(f=>'./battle-assets/'+f.file);};
try{
 for(const race of ['dwarf','human','elf','goblin','ashen']){
  const state=E.fresh(race),view=createLiveBattlePresentation();requests=[];
  view.sync(state,null,{visible:false});await view.load();
  assert.deepEqual(new Set(requests),new Set(idleFiles(state)),race+' world page loads only portrait idle frames');
  const firstCount=requests.length;await view.load();view.sync(state,null,{visible:false});await view.load();assert.equal(requests.length,firstCount,'unchanged hidden view reuses decoded portrait frames');
  const encounter=E.startInstanceEncounter(state,race+'.a01.field',10000);
  view.sync(state,encounter,{visible:false});await view.load();assert.equal(requests.length,firstCount,'background combat never downloads invisible monsters/backgrounds');
  view.sync(state,encounter,{visible:true});await view.load();assert.equal(view.status.mode,'ready',race+' visible fight has full lifecycle before drawing');
  const allFiles=[...liveSceneBackgrounds({areaId:encounter.areaId,encounter},manifest),...[heroFor(state),...encounter.enemies.map(u=>liveActorSprite(u,manifest))].flatMap(key=>manifest.sprites[key].frames)];
  assert.deepEqual(new Set(requests),new Set(allFiles.map(f=>'./battle-assets/'+f.file)));
  view.sync(state,encounter,{visible:false});await view.load();assert.equal(view.debug.imageCacheSize,idleFiles(state).length,'hidden view evicts invisible decoded assets');view.dispose();
 }
 // If the player leaves while image decoding is in flight, no stale scene is retained.
 const state=E.fresh('human'),view=createLiveBattlePresentation();hold=true;
 view.sync(state,null,{visible:true});const old=view.load();await Promise.resolve();await Promise.resolve();
 view.sync(state,null,{visible:false});const current=view.load();hold=false;for(const finish of deferred.splice(0))finish();await Promise.all([old,current]);
 assert.equal(view.debug.imageCacheSize,idleFiles(state).length);view.dispose();
 console.log('PASS performance: five races load only hero idle frames outside visible battle; background combat deferred; repeat renders reuse; full visible animation coverage; interrupted navigation evicts stale assets. Mock loader, not browser timings.');
}finally{Object.assign(globalThis,original);}
