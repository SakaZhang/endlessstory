import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
const now=Date.now();
for(const race of ['human','dwarf','elf','goblin','ashen']){
 const s=E.fresh(race);E.normalizeHealth(s,now);E.normalizeExpedition(s);E.normalizeRegionNavigation(s);const before=structuredClone(s);let calls=0;const rng=Math.random;Math.random=()=>{calls++;return .5};
 try{assert(E.travelToArea(s,'goblin.a01',now));assert.equal(calls,0)}finally{Math.random=rng}
 assert.equal(s.siteId,'goblin.a01');assert.equal(s.location,0);assert.equal(s.expedition.fieldId,'goblin.a01.field');assert.equal(s.race,race);assert(!s.activeEncounter);assert(!s.running);assert(E.validSave(s));
 for(const k of ['heroHp','restUntil','inventory','gold','xp','materialStacks','monsterLedger','areaProgress','instanceCooldowns','npcEvents'])assert.deepEqual(s[k],before[k],k);
 assert.deepEqual(E.getRegionNavigation(s).exploredAreaIds,['goblin.a01']);assert.deepEqual(E.getRegionNavigation(s).discoveryLedger,E.getRegionNavigation(before).discoveryLedger);
 const arrived=structuredClone(s);assert(E.travelToArea(s,'goblin.a01',now));assert.deepEqual(s,arrived);
}
for(const mode of ['locked','war','running','rest','legacy','unrewarded','dungeon','invalid']){
 const s=E.fresh('human');E.normalizeHealth(s,now);let target='goblin.a01';
 if(mode==='locked')target='goblin.a02';if(mode==='war')assert(E.startWar(s,{id:'test.travel',races:['human','goblin']},now));if(mode==='running')s.running=true;if(mode==='rest')s.restUntil=now+30000;if(mode==='legacy')s.contentMigration={version:1,legacyDrain:true,reselectRequired:false};if(mode==='unrewarded'||mode==='dungeon'){assert(E.chooseAdventureNode(s,mode==='dungeon'?'human.a01.dungeon':'human.a01.field',{},now));s.running=false;}if(mode==='invalid')target='__proto__';
 const before=structuredClone(s);assert.equal(E.travelToArea(s,target,now),null,mode);assert.deepEqual(s,before,mode+' preserves all state');
}
console.log('PASS selected travel engine: five races, zero RNG/heal/reward/discovery/unlock; visited area, idempotency and locked/war/running/rest/legacy/unrewarded/dungeon guards.');
