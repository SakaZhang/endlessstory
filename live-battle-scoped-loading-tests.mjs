import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createLiveBattlePresentation,liveActorSprite,liveSceneBackgrounds,liveHeroWeaponType} from './dist/live-battle-view.js';
import {extendBattleManifest} from './dist/race-art.js';
import * as E from './dist/engine.js';
const base=JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')),manifest=extendBattleManifest(base);
const previous={fetch:globalThis.fetch,Image:globalThis.Image};let requested=[],active=0,peak=0,fail=null,waiters=[],hold=false;
globalThis.fetch=async()=>({ok:true,json:async()=>base});
globalThis.Image=class {async decode(){requested.push(this.src);active++;peak=Math.max(peak,active);try{if(hold)await new Promise(resolve=>waiters.push(resolve));else await Promise.resolve();if(this.src===fail)throw Error('test missing');}finally{active--;}}};
const expected=(s,e)=>{
 const hero=manifest.raceHeroWeaponSprites[s.race]?.[liveHeroWeaponType(s)]??manifest.raceHeroSprites[s.race]??({axe:'dwarf',hammer:'dwarf-hammer'})[liveHeroWeaponType(s)]??'hero-neutral';
 const spriteIds=[hero,...(e?.enemies??[]).map(u=>liveActorSprite(u,manifest))];
 const snap={campRace:s.atCamp?s.race:null,areaId:e?.areaId??s.location,encounter:e??{enemies:[]}};
 return new Set([...liveSceneBackgrounds(snap,manifest),...spriteIds.flatMap(id=>manifest.sprites[id].frames)].map(f=>'./battle-assets/'+f.file));
};
try{
 const view=createLiveBattlePresentation();await view.load();assert.equal(requested.length,0,'manifest-only load before state does not preload world');
 for(const race of ['human','elf','goblin','ashen','dwarf']){
  const s=E.fresh(race);view.sync(s,null);await view.load();assert.equal(view.status.mode,'ready',race);let want=expected(s,null);assert.equal(view.debug.imageCacheSize,want.size);assert(requested.slice(-want.size).every(f=>want.has(f)),race+' only current camp and hero');
  const e=E.startInstanceEncounter(s,race+'.a01.field',10000);const before=requested.length;view.sync(s,e);await view.load();assert.equal(view.status.mode,'ready',race+' field');want=expected(s,e);assert(requested.slice(before).every(f=>want.has(f)));assert.equal(view.debug.imageCacheSize,want.size);
 }
 assert(peak<=6,'bounded decode concurrency');
 // Navigation while old requests are in flight: queued old assets are skipped, no stale cache retention.
 hold=true;requested=[];const a=E.fresh('human');view.sync(a,null);const old=view.load();await Promise.resolve();await Promise.resolve();const b=E.fresh('elf');view.sync(b,null);const current=view.load();hold=false;for(const resolve of waiters.splice(0))resolve();await Promise.all([old,current]);assert.equal(view.status.mode,'ready');assert.equal(view.debug.imageCacheSize,expected(b,null).size);assert(peak<=6);
 view.dispose();assert.equal(view.debug.imageCacheSize,0);
 // Disposal while decodes are pending clears queued jobs and never reattaches decoded assets.
 hold=true;const pending=createLiveBattlePresentation();pending.sync(E.fresh('human'),null);const disposal=pending.load();await Promise.resolve();await Promise.resolve();await Promise.resolve();pending.dispose();hold=false;for(const resolve of waiters.splice(0))resolve();await disposal;assert.equal(pending.debug.imageCacheSize,0);assert.equal(pending.debug.imageQueueSize,0);assert.equal(pending.status.reason,'disposed');
 // One missing current frame must be reported, never old-race fallback, and explicit retry recovers.
 const retry=createLiveBattlePresentation();const s=E.fresh('ashen');fail=[...expected(s,null)][0];retry.sync(s,null);await retry.load();assert.equal(retry.status.reason,'asset-frames-missing');fail=null;await retry.load();assert.equal(retry.status.mode,'ready');retry.dispose();
 console.log('PASS scoped current camp/area + hero/enemies only, five races, max six decodes, scene-only cache, in-flight navigation, failure/retry, disposal. Mock loader, not browser QA.');
}finally{globalThis.fetch=previous.fetch;globalThis.Image=previous.Image;}
