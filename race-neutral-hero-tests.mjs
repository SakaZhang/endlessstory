import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {RACE_WEAPON_POOLS,EQUIPMENT_WEAPON_TYPES} from './dist/equipment-templates.js';
import {extendBattleManifest} from './dist/race-art.js';
import {liveHeroSpriteFor,liveHeroWeaponType,createLiveBattlePresentation,liveSceneBackgrounds,liveActorSprite} from './dist/live-battle-view.js';
import {captureCombatDisplay} from './dist/combat-display-bridge.js';
const base=JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')),manifest=extendBattleManifest(base);
const races=['human','elf','goblin','ashen'];
for(const [type,key]of Object.entries(base.heroWeaponSprites??{axe:'dwarf',hammer:'dwarf-hammer'})){assert.equal(liveHeroSpriteFor(type,manifest,'dwarf'),key);assert.deepEqual(manifest.sprites[key],base.sprites[key],'Dwarf native unchanged');}
assert.equal(liveHeroSpriteFor(null,manifest,'dwarf'),'hero-neutral');assert.deepEqual(manifest.sprites['hero-neutral'],base.sprites['hero-neutral']);
const canvas=()=>{const calls=[];const c=new Proxy({drawImage(img){calls.push(img);},measureText(){return {width:12};}},{get:(o,k)=>k in o?o[k]:()=>{}});return {width:480,height:270,calls,getContext:()=>c};};
const images=new Map([...manifest.backgrounds,...Object.values(manifest.campBackgrounds),...Object.values(manifest.sprites).flatMap(s=>s.frames)].map(f=>[f.file,{file:f.file}]));
function weaponOfType(type){const origin=Object.keys(RACE_WEAPON_POOLS).find(r=>RACE_WEAPON_POOLS[r].includes(type));for(let i=0;i<1000;i++){const item=E.item('weapon',1,null,0,{originRace:origin});if(item.weaponType===type)return item;}throw Error('Could not generate '+type);}
function equip(s,type){if(type===null){s.equip.weapon=null;return;}const item=weaponOfType(type);s.inventory.push(item);assert(E.equipItem(s,item.id));}
const wanted=(s,e)=>{const snap={campRace:s.atCamp?s.race:null,areaId:e?.areaId??s.siteId};return new Set([...liveSceneBackgrounds(snap,manifest),...[(liveHeroSpriteFor(liveHeroWeaponType(s),manifest,s.race)),...(e?.enemies??[]).map(u=>liveActorSprite(u,manifest))].flatMap(key=>manifest.sprites[key].frames)].map(f=>'./battle-assets/'+f.file));};
let variants=0,realEvents=0;
for(const race of races){
 const neutral=race+'-hero-neutral';assert.equal(manifest.raceHeroNeutralSprites[race],neutral);assert.equal(manifest.raceHeroSprites[race],neutral);
 const sprite=manifest.sprites[neutral];for(const f of sprite.frames)assert(fs.existsSync(new URL(f.file,new URL('./dist/battle-assets/',import.meta.url))),f.file);assert.deepEqual(sprite.frameSize,[192,192]);assert.deepEqual(sprite.anchor,[96,176]);
 for(const mode of ['idle','attack','hurt','death']){assert(sprite.animations[mode]?.length,race+' '+mode);for(const id of sprite.animations[mode])assert(sprite.frames.some(f=>f.id===id));}
 for(const type of [null,...EQUIPMENT_WEAPON_TYPES]){
  variants++;const s=E.fresh(race);equip(s,type);assert(E.validSave(s),race+' '+type+' valid equipped save');assert(E.validSave(JSON.parse(JSON.stringify(s))));
  const native=RACE_WEAPON_POOLS[race].includes(type),key=native?manifest.raceHeroWeaponSprites[race][type]:neutral;
  assert.equal(liveHeroSpriteFor(type,manifest,race),key);const view=createLiveBattlePresentation({manifest,images});const c=canvas();
  function check(e,label){const before=JSON.stringify(s);view.sync(s,e,{visible:true,running:!!e});assert.equal(view.status.mode,'ready',label);assert.equal(view.positions.hero.sprite,key);assert.equal(view.status.heroAppearance,native?'equipped-weapon':'neutral-generic');c.calls.length=0;assert(view.draw(c,0));assert.equal(view.status.mode,'ready');assert(c.calls.some(img=>manifest.sprites[key].frames.some(f=>f.file===img?.file)),label+' chosen frames drawn');const portrait=canvas();assert(view.drawPortrait(portrait,s));assert(portrait.calls.some(img=>manifest.sprites[key].animations.idle.some(id=>manifest.sprites[key].frames.find(f=>f.id===id)?.file===img?.file)),label+' portrait idle');assert.equal(JSON.stringify(s),before,'presentation is readonly');}
  check(null,race+' '+type+' camp');s.atCamp=false;s.siteId=race+'.a01';check(null,'field idle');
  const e=E.startInstanceEncounter(s,race+'.a01.field',10000);assert(e);check(e,'real battle');let events=[];for(let i=0;i<4&&!e.done;i++)events.push(...captureCombatDisplay(e,()=>E.step(s,e,s.nextActionAt)).events);realEvents+=events.length;assert(E.validSave(s),'post-step save');view.sync(s,e,{visible:true,running:true});view.enqueue(events,0);assert(view.draw(c,250));assert.equal(view.status.mode,'ready');assert.equal(view.positions.hero.sprite,key);
  // Explicit display-only probes cover all generic modes even if real RNG misses a hit.
  if(!native){const encounter=structuredClone(e);encounter.done=false;encounter.heroHp=100;encounter.enemies[0].hp=100;const enemy=encounter.enemies[0].id;
   const event=(sourceId,targetId,n)=>({eventId:'probe'+n,battleId:encounter.id,castId:'probe'+n,sourceId,targetId,kind:'hit',hitId:null,skillId:null,element:'physical',crit:false,outcome:'hit',segmentIndex:0,hpDelta:-1,shieldDelta:0,combatAt:10000});
   for(const [mode,source,target,n]of [['attack','hero',enemy,1],['hurt',enemy,'hero',2]]){const v=createLiveBattlePresentation({manifest,images});v.sync(s,encounter,{visible:true,running:true});assert.equal(v.enqueue([event(source,target,n)],0).accepted,1);const cv=canvas();v.draw(cv,250);assert.equal(v.status.mode,'ready');assert(cv.calls.some(img=>sprite.animations[mode].some(id=>sprite.frames.find(f=>f.id===id)?.file===img?.file)),race+' actual '+mode+' frame');v.dispose();}
   encounter.heroHp=0;const deadState={...s,heroHp:0};const v=createLiveBattlePresentation({manifest,images});v.sync(deadState,encounter,{visible:true,running:true});const cv=canvas();v.draw(cv,1000);assert(cv.calls.some(img=>sprite.animations.death.some(id=>sprite.frames.find(f=>f.id===id)?.file===img?.file)),race+' actual death frame');v.dispose();
  }
  view.dispose();
 }
 // No fallback to other races or armed legacy `raceHeroSprites` even with a partial manifest.
 assert.equal(liveHeroSpriteFor('axe',{raceHeroSprites:{[race]:'armed-wrong'},sprites:{'hero-neutral':{}}},race),null);
}
assert(realEvents>0,'real engine emitted combat events');
// Lazy loader must select only this race's currently resolved hero, replacing native cache with neutral and back.
const previous={fetch:globalThis.fetch,Image:globalThis.Image};let requested=[];
globalThis.fetch=async()=>({ok:true,json:async()=>base});globalThis.Image=class{async decode(){requested.push(this.src);}};
try{for(const race of races){const v=createLiveBattlePresentation();for(const type of [...RACE_WEAPON_POOLS[race],null,...EQUIPMENT_WEAPON_TYPES.filter(t=>!RACE_WEAPON_POOLS[race].includes(t)),...RACE_WEAPON_POOLS[race]]){const s=E.fresh(race);equip(s,type);for(const battle of [false,true]){const e=battle?E.startInstanceEncounter(s,race+'.a01.field',10000):null;requested=[];v.sync(s,e);await v.load();assert.equal(v.status.mode,'ready');const expected=wanted(s,e);assert.equal(v.debug.imageCacheSize,expected.size);assert(requested.every(f=>expected.has(f)),race+' scoped current frames only');}}v.dispose();}}finally{Object.assign(globalThis,previous);}
console.log(`PASS ${variants} valid native/foreign/empty saves; all four race camp/field/portrait/battle routes; real E.step (${realEvents} events); generic attack/hurt/death draw probes; native→neutral→native scoped loader/cache. Mock canvas/loader, not browser QA.`);
