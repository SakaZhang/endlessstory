import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {enableM2TestBudget} from './m2-test-budget-fixture.mjs';
import {dwarfParameterSet} from './dist/dwarf-content.js';
enableM2TestBudget();const config=dwarfParameterSet();config.skillOverrides={'dwarf.a03.boss:0':{castMs:3300}};config.interruptStopMs=550;E.configureDwarfParameters(config);
for(const interruptFirst of [false,true]){
 const s=E.fresh({legacySkillModel:true});s.level=55;s.skills=['delay',null,null,null];s.conditions=['charge','always','always','always'];E.normalizeHealth(s,0);E.normalizeExpedition(s);s.areaProgress.dwarf={unlocked:[1,2,3],cleared:[1,2]};const e=E.startInstanceEncounter(s,'dwarf.a03.boss',0),u=e.enemies[0],skill='dwarf.a03.boss:0';u.hp=u.max=1e8;u.control.cooldowns[skill]=0;for(const other of Object.keys(u.control.cooldowns))if(other!==skill)u.control.cooldowns[other]=1e9;
 const step=()=>E.step(s,e,s.nextActionAt);step();assert(u.control.preparing);assert.equal(u.heavyDelayed,false);const firstEnd=u.control.preparing.completesAt;step();assert.equal(u.heavyDelayed,true);assert.equal(u.control.preparing.completesAt,firstEnd+1100);
 if(interruptFirst){s.skills=['interrupt',null,null,null];e.rngState=1;step();assert.equal(u.control.preparing,null);assert.equal(u.skillUses[skill]??0,0);}
 else{while(u.control.preparing)step();assert.equal(u.skillUses[skill],1);assert.equal(u.heavyDelayed,false);}
 s.skills=['delay',null,null,null];let guard=0;while(!u.control.preparing&&guard++<50)step();assert(u.control.preparing,'next actual cast starts');assert.equal(u.heavyDelayed,false,'new cast resets prior delay even if interrupted');assert.equal(e.cd.delay??0,0);const secondEnd=u.control.preparing.completesAt;step();assert.equal(u.heavyDelayed,true);assert.equal(u.control.preparing.completesAt,secondEnd+1100,'second cast can actually be delayed');assert(E.validSave(s));
}
E.configureDwarfParameters(null);console.log('PASS M2 typed delay lifecycle: next cast resets after completion or interruption, repeated actual delay once per cast, valid snapshots');
