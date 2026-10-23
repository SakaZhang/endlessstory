import assert from 'node:assert/strict';
import * as F from './dist/skill-tree-effects.js';
let s=F.createSkillEffectState(['enemy1','enemy2'],0);const put=(id,e)=>{const r=F.applySkillEffect(s,id,e,{callbacks:{shield(){}}});assert(r);s=r.state;};
put('enemy1',{sourceId:'fracture_strike',type:'armorDown',amount:5,durationMs:5000});put('enemy1',{sourceId:'furnace_etch',type:'armorDown',amount:10,durationMs:2000});assert.equal(F.skillEffectValue(s,'enemy1','armorDown'),10);s=F.advanceSkillEffectState(s,2000).state;assert.equal(F.skillEffectValue(s,'enemy1','armorDown'),5);put('enemy1',{sourceId:'fracture_strike',type:'armorDown',amount:7,durationMs:4000});assert.equal(s.enemies.enemy1.sources.length,1);assert.equal(F.skillEffectValue(s,'enemy1','armorDown'),7);
put('self',{sourceId:'anvil_cry',type:'attackUp',amount:8,durationMs:5000});put('self',{sourceId:'iron_vigil',type:'shield',amount:20,durationMs:3000,source:{kind:'skill',id:'iron_vigil'}});put('self',{sourceId:'reactor',type:'shield',amount:30,durationMs:3000,source:{kind:'equipment',id:'relic1'}});assert.equal(s.hero.sources.filter(x=>x.type==='shield').length,2);assert.equal(s.hero.sources.find(x=>x.sourceId==='iron_vigil').source.kind,'skill');
const dead=F.removeSkillEffectTarget(s,'enemy1');assert(!dead.enemies.enemy1);assert.deepEqual(dead.hero,s.hero);const carry=F.carryHeroSkillEffects(s),next=F.restoreHeroSkillEffects(carry,['nextEnemy']);assert.deepEqual(next.hero,s.hero);assert.deepEqual(next.enemies.nextEnemy.sources,[]);assert(!next.enemies.enemy1);assert(F.validSkillEffectState(JSON.parse(JSON.stringify(next))));
let now=F.createSkillEffectState(['target'],0),tickCount=0;now=F.applySkillEffect(now,'target',{sourceId:'ember_brand',type:'dot',status:'burn',damageType:'fire',amount:2,durationMs:3000,tickIntervalMs:1000}).state;assert.equal(F.advanceSkillEffectState(now,3000),null,'cannot silently skip periodic callbacks');const progressed=F.advanceSkillEffectState(now,3000,{onTick(id,source,time){assert.equal(id,'target');assert.equal(source.damageType,'fire');assert.equal(time,(++tickCount)*1000);}});assert.equal(tickCount,3);assert.equal(progressed.state.enemies.target.sources.length,0);assert.equal(F.advanceSkillEffectState(progressed.state,2999),null);
const paused=F.advanceSkillEffectState(now,0,{onTick(){throw Error();}});assert.deepEqual(paused.state,now);assert.equal(F.applySkillEffect(now,'target',{sourceId:'x',type:'armorDown',amount:1,durationMs:10},{clock:1000}),null);
let heals=0,cleansed=0;const raw=JSON.stringify(s);assert(F.applySkillEffect(s,'self',{type:'heal',amount:10},{callbacks:{heal(id,e){assert.equal(id,'self');heals+=e.amount;}}}));assert(F.applySkillEffect(s,'self',{type:'cleanse',eligibleIds:['burn'],count:1},{callbacks:{cleanse(id,e){cleansed=e.count;}}}));assert.equal(heals,10);assert.equal(cleansed,1);assert.equal(JSON.stringify(s),raw);
const bad=structuredClone(s);bad.hero.sources[0].amount=NaN;assert(!F.validSkillEffectState(bad));assert.equal(F.createSkillEffectState(['__proto__']),null);assert.equal(F.applySkillEffect(s,'enemy1',{sourceId:'scatter_ash',type:'dot',status:'poison',damageType:'earth',amount:1,durationMs:1000,tickIntervalMs:1000}),null);
put('enemy2',{sourceId:'ember_brand',type:'fireResistDown',amount:9,durationMs:4000,requiresStatus:'burn'});assert.equal(F.skillEffectValue(s,'enemy2','fireResistDown',{hasStatus:()=>false}),0);assert.equal(F.skillEffectValue(s,'enemy2','fireResistDown',{hasStatus:()=>true}),9);
console.log('PASS typed effects: strongest source expiry/refresh, no wallclock, periodic callbacks no skipped ticks, hero carry/deadtarget removal, JSON, independent skill/equipment shields, no legacy or poison migration');

// Consume real planner descriptors, not independently handwritten source shapes.
const {planTreeSkill}=await import('./dist/skill-tree-consumer.js');
const planned=(skillId,config)=>{const p=planTreeSkill({skillId,castId:`cast:${skillId}`,weaponType:'generic',selectedTargetId:'target',targets:[{id:'target',alive:true}],hero:{},config:{cooldownMs:1000,...config}});assert(p,skillId);return p.actions.flatMap(a=>a.effects.map(effect=>({targetId:a.targetId,effect})));};
let integrated=F.createSkillEffectState(['target']);let shields=0,ticks=0;
for(const [skillId,config,type] of [
 ['anvil_cry',{attackUp:4,durationMs:3000},'attackUp'],
 ['furnace_etch',{armorDown:5,fireResistDown:3,durationMs:3000},'armorDown'],
 ['iron_vigil',{shield:20,durationMs:3000},'shield'],
 ['ember_brand',{coefficient:1,burnPower:2,durationMs:3000},'dot']
]){
 const row=planned(skillId,config).find(x=>x.effect.type===type);assert(row);
 const effect=type==='dot'?{...row.effect,tickIntervalMs:1000}:row.effect;
 const result=F.applySkillEffect(integrated,row.targetId,effect,{callbacks:{shield(){shields++;}}});assert(result,skillId);integrated=result.state;
 const saved=(row.targetId==='self'?integrated.hero:integrated.enemies.target).sources.find(x=>x.type===type);
 assert.deepEqual(saved.source,{kind:'skill',id:skillId});assert(!Object.hasOwn(saved.source,'skillId'));
}
assert.equal(shields,1);assert.equal(F.skillEffectValue(integrated,'self','attackUp'),4);assert.equal(F.skillEffectValue(integrated,'target','armorDown'),5);
assert(F.validSkillEffectState(JSON.parse(JSON.stringify(integrated))));
assert(F.advanceSkillEffectState(integrated,3000,{onTick(){ticks++;}}));assert.equal(ticks,3);
const realEffect=planned('anvil_cry',{attackUp:4,durationMs:3000})[0].effect;
for(const source of [{kind:'skill',skillId:'anvil_cry',id:'different'},{kind:'skill',skillId:'anvil_cry',extra:1},{kind:'equipment',skillId:'anvil_cry'},{kind:'skill',skillId:['anvil_cry']}])assert.equal(F.applySkillEffect(integrated,'self',{...realEffect,source}),null);
console.log('PASS real consumer → effects: canonical skill source normalization, attack/armor/shield/burn ticks and conflicting/unknown source keys rejected');
// A lethal tick stops at the event boundary, preserving equal-time peers and expiries.
let interrupted=F.createSkillEffectState(['target']);
for(const sourceId of ['z-burn','a-burn'])interrupted=F.applySkillEffect(interrupted,'target',{sourceId,type:'dot',status:'burn',damageType:'fire',amount:2,durationMs:1000,tickIntervalMs:1000}).state;
const executed=[];
const stop=F.advanceSkillEffectState(interrupted,5000,{onTick(id,source,clock,tickId){executed.push({source:source.sourceId,tickId});return false;},onExpire(){throw Error('must not expire before stopped tick boundary');}});
assert.equal(stop.stopped,true);assert.equal(stop.caughtUp,false);assert.equal(stop.state.clock,1000);assert.deepEqual(executed.map(x=>x.source),['a-burn']);assert.equal(stop.state.enemies.target.sources.length,2);
const persisted=JSON.parse(JSON.stringify(stop.state));assert(F.validSkillEffectState(persisted));let expired=0;
const resumed=F.advanceSkillEffectState(persisted,5000,{onTick(id,source,clock,tickId){executed.push({source:source.sourceId,tickId});},onExpire(){expired++;}});
assert.deepEqual(executed.map(x=>x.source),['a-burn','z-burn']);assert.equal(new Set(executed.map(x=>x.tickId)).size,2);assert.equal(expired,2);assert.equal(resumed.state.clock,5000);assert.equal(resumed.state.enemies.target.sources.length,0);assert.equal(resumed.caughtUp,true);
const sameClock=F.advanceSkillEffectState(persisted,1000,{onTick(){},onExpire(){}});assert.equal(sameClock.caughtUp,true);assert.equal(sameClock.state.enemies.target.sources.length,0);
const cleared=F.removeSkillEffectTarget(persisted,'target');assert(F.advanceSkillEffectState(cleared,5000,{onTick(){throw Error('removed dead target must not tick');}}));
console.log('PASS stopped tick cursor: deterministic equal-time order, persisted replay exactly once, pending expiry retained, same-clock resume and dead-target cleanup');
