import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {getSkillTreeDefinition} from './dist/race-registry.js';
import {createSkillEffectState,applySkillEffect} from './dist/skill-tree-effects.js';
function fixture(race,id,condition){const s=E.fresh(race);s.level=100;const p=s.skillTree.presets[0];p.unlocked=getSkillTreeDefinition(s).nodes.map(n=>n.id);p.active=[id,null,null,null];p.conditions=[condition,'always','always','always'];s.heroHp=E.stats(s).hp;s.lastHealthClock=s.lastSeen=10000;s.restUntil=0;s.nextBattleAt=0;const e=E.startRoutedEncounter(s,10000);for(const u of e.enemies)u.hp=u.max=100000;e.treeEffects=createSkillEffectState(e.enemies.map(u=>u.id),0);e.treeCombatClock=0;return {s,e,target:e.enemies.find(u=>u.id===e.targetId)??e.enemies[0]};}
for(const [race,id,condition,type,extra] of [
 ['human','human.open_wound','bleed','dot',{status:'bleed',damageType:'physical',tickIntervalMs:2000}],
 ['human','human.decisive','armorDown','armorDown',{}],
 ['dwarf','cinder_barrage','elementResistDown','elementResistDown',{damageType:'fire'}],
 ['dwarf','cinder_barrage','fireResistDown','fireResistDown',{}]
])for(const state of ['absent','present','expired','other-element','zero']){
 const {s,e,target}=fixture(race,id,condition);
 if(state!=='absent'){const effect={type,amount:state==='zero'?0:10,durationMs:state==='expired'?1100:5000,sourceId:'selector-proof',source:{kind:'skill',id:'proof'},...extra};if(state==='other-element'&&type==='elementResistDown')effect.damageType='water';const next=applySkillEffect(e.treeEffects,target.id,effect);assert(next);e.treeEffects=next.state;}
 const shouldCast=state==='present'||state==='other-element'&&type!=='elementResistDown'||state==='zero'&&type==='dot';
 assert(E.validSave(s));const resumed=JSON.parse(JSON.stringify(s));assert.deepEqual(E.step(s,e,11100),E.step(resumed,resumed.activeEncounter,11100));assert.equal(e.lastCast?.skillId===id,shouldCast,`${id} ${condition} ${state}`);assert.deepEqual(s,resumed);assert(E.validSave(s));assert.equal(s.skillTree.presets[0].conditions[0],condition);
}
console.log('PASS real contextual selector: supported bleed/break/matching element + legacy alias, absent/live/expiry/wrong element, JSON replay and unchanged saved rules');
