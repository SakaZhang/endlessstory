import assert from 'node:assert/strict';
import {fresh,encounter,reward,validSave,normalizeExpedition,nextEncounterRoute,stats} from './dist/engine.js';
import {AREAS,SITES,INSTANCES,instanceCooldownMs,pickRoute,areaGearLevel} from './dist/location-schema.js';
assert.equal(Object.keys(AREAS).length,1);assert.deepEqual(AREAS['dwarf-blackforge-1'].levelRange,[1,10]);
assert.equal(Object.values(INSTANCES).filter(x=>x.kind==='field').length,3);
assert.equal(Object.values(INSTANCES).filter(x=>x.kind==='boss').length,3);
assert(Object.values(INSTANCES).filter(x=>x.kind==='dungeon').every(x=>x.enabled));
const s=fresh();s.location=1;s.bossReady=[100,200,300];const e=encounter(s);e.hp-=12;e.heroHp-=7;e.cd.mark=3;e.burn=4;
const old=structuredClone(e),hp=stats(s).hp;assert(validSave(s));assert(normalizeExpedition(s));assert.equal(s.siteId,'blackforge-mine');assert.equal(s.instanceCooldowns['blackforge-mine-boss'],200);assert.equal(e.hp,old.hp);assert.equal(e.heroHp,old.heroHp);assert.deepEqual(e.cd,old.cd);assert.equal(e.burn,4);assert.equal(stats(s).hp,hp);
const once=JSON.stringify(s);assert(normalizeExpedition(s));assert.equal(JSON.stringify(s),once);assert(validSave(JSON.parse(once)));assert.equal(nextEncounterRoute(s,0).id,'blackforge-mine-field');
assert.equal(instanceCooldownMs('blackforge-road-boss'),1800000);assert.equal(instanceCooldownMs('dwarf-blackforge-1-dungeon'),300000);
const field=INSTANCES['blackforge-road-field'],dungeon={id:'test-normal',areaId:field.areaId,kind:'dungeon',enabled:true},registry={...INSTANCES,[dungeon.id]:dungeon},ex={mode:'dungeon',targetInstanceId:dungeon.id,fieldId:field.id,loop:true};
assert.equal(pickRoute(ex,{[dungeon.id]:1000},999,registry),field);assert.equal(pickRoute(ex,{[dungeon.id]:1000},1000,registry),dungeon);
assert.equal(pickRoute({...ex,loop:false},{[dungeon.id]:1000},999,registry),null);
assert.equal(pickRoute({...ex,targetInstanceId:'blackforge-road-boss'},{},1000,registry),null);
assert.equal(pickRoute({...ex,targetInstanceId:'dwarf-blackforge-1-dungeon'},{},1000).kind,'dungeon');
const random=Math.random;Math.random=()=>0;
try{for(const level of [1,100,500])for(let index=0;index<3;index++){
 const x=fresh();x.level=level;x.location=index;const b=encounter(x);b.done=true;b.win=true;const gear=reward(x,b,Date.now());assert(gear);assert.equal(gear.baseLevel,[3,6,9][index]);assert(gear.level>=Math.max(1,gear.baseLevel-2)&&gear.level<=Math.min(10,gear.baseLevel+2));assert.equal(areaGearLevel(SITES[index].id+'-boss'),gear.baseLevel);
}}finally{Math.random=random;}
for(const mutate of [x=>x.instanceCooldowns.bad=100,x=>x.expedition.fieldId='blackforge-road-boss',x=>x.activeEncounter.instanceId='bad']){
 const bad=JSON.parse(once);mutate(bad);assert(!validSave(bad));
}
console.log('Location foundation: stable IDs/lossless old encounter and cooldown migration, single normal prototype, pure fallback/boundary routing, fixed area gear levels: PASS');
