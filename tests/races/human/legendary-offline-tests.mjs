import assert from 'node:assert/strict';
import {E,ARMOR,T,setup,tick,captureCombatDisplay,reflections} from './reflect-fixture.mjs';
const f=setup(),{s,e}=f,u=e.enemies[0],sword=E.legendaryItem('human-oathblade',100);s.inventory.push(sword);assert(E.equipItem(s,sword.id));s.skillTree.presets[0].active=['human.cut',null,null,null];u.atk=25;u.nextBasicAt=s.nextActionAt;s.running=true;
// A serialized source-bearing DOT stays attached to its attacker across catch-up.
e.typedDots=[{key:'human-reflect-offline-burn',sourceId:u.id,type:'fire',raw:3,nextAt:s.nextActionAt+1000,endAt:s.nextActionAt+18000}];
const prelude=tick(f);assert(reflections(prelude).length);s.lastSeen=s.lastHealthClock;E.normalizePotions(s);assert(E.validSave(s));
const online=JSON.parse(JSON.stringify(s)),offline=JSON.parse(JSON.stringify(s)),end=s.lastSeen+33000;let rounds=0;
const a=captureCombatDisplay(online.activeEncounter,()=>{while(online.nextActionAt<=end&&!online.activeEncounter.done){E.step(online,online.activeEncounter,online.nextActionAt);rounds++;}E.settleRest(online,end);online.lastSeen=end;});
const b=captureCombatDisplay(offline.activeEncounter,()=>E.offline(offline,end));
assert.equal(b.result.rounds,rounds);for(const key of ['heroHp','legendaryRuntime','nextActionAt','potionStacks','equipmentRuntime'])assert.deepEqual(offline[key],online[key],key);assert.deepEqual(offline.activeEncounter,online.activeEncounter);assert.deepEqual(b.events,a.events);assert(E.validSave(online));assert(E.validSave(offline));
assert(reflections(a).length>3);assert(a.events.some(x=>x.kind==='dot'&&x.targetId==='hero'));assert(a.events.some(x=>x.skillId==='human-oathblade'&&x.kind==='legend'));
const at=online.lastHealthClock,clock=online.legendaryRuntime.byId[f.item.id].clock;assert(E.setMultiPaused(online,true,at));assert(E.setMultiPaused(online,false,at+60000));assert.equal(online.legendaryRuntime.byId[f.item.id].clock,clock);assert(E.validSave(JSON.parse(JSON.stringify(online))));
console.log('PASS Human actual equipped sword + reflection armor: serialized DOT source, 33s online/offline exact events/state, repeated returns, oathburst preserved, pause/JSON.',rounds,reflections(a).length);
