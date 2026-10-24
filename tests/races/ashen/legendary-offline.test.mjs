import assert from 'node:assert/strict';
import * as E from '../../../dist/engine.js';
import {RACE_PACK as P} from '../../../dist/races/ashen/index.js';
import {createPlayerShieldLayers,grantPlayerShieldLayer} from '../../../dist/player-shield-layers.js';
const old=Math.random;let seed=711;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
try{for(const id of ['ashen-molten-core','ashen-stone-core','ashen-crystal-core']){
 const s=E.fresh('ashen');s.level=100;s.skillTree.presets[0].unlocked=P.tree.nodes.map(x=>x.id);s.skillTree.presets[0].active=id==='ashen-molten-core'?['ashen.kindle','ashen.vent',null,null]:[null,null,null,null];s.skillTree.presets[0].passive=[null,null];const it=E.legendaryItem(id,100);s.inventory.push(it);assert(E.equipItem(s,it.id));s.lastSeen=s.lastHealthClock=1000;E.normalizeHealth(s,1000);s.heroHp=E.stats(s).hp;s.restUntil=0;s.nextBattleAt=0;s.running=true;const e=E.startInstanceEncounter(s,'ashen.a01.field',1000);for(const u of e.enemies){u.hp=u.max=1e8;u.atk=u.elementalPower=0;}
 if(id==='ashen-molten-core')e.raceRuntime={race:'ashen',state:{...P.createRuntime(),heat:40}};
 for(let n=0;n<35;n++)E.step(s,e,s.nextActionAt);assert(E.validSave(s));s.lastSeen=s.lastHealthClock;
 const online=structuredClone(s),offline=structuredClone(s),end=s.lastSeen+60000;
 while(online.nextActionAt<=end){assert(!online.activeEncounter.done);E.step(online,online.activeEncounter,online.nextActionAt);}E.settleRest(online,end);online.lastSeen=end;const report=E.offline(offline,end);assert(report.rounds>0);assert(E.validSave(online)&&E.validSave(offline));for(const key of ['heroHp','gold','xp','kills','legendaryRuntime'])assert.deepEqual(online[key],offline[key],id+' '+key);for(const key of ['raceRuntime','treeCombatClock','treeSkillCooldowns','playerShieldLayers','activeCastCount'])assert.deepEqual(online.activeEncounter[key],offline.activeEncounter[key],id+' '+key);assert.deepEqual(online.activeEncounter.enemies.map(x=>x.hp),offline.activeEncounter.enemies.map(x=>x.hp));
 if(id==='ashen-crystal-core')assert(offline.activeEncounter.activeCastCount>=3,'beam repeats in offline combat');
 }
 console.log('PASS each equipped Ashen core exact60s online/offline HP, damage, active casts, buff/cooldown ledgers and race resources.');
}finally{Math.random=old;}
