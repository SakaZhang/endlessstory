import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import * as T from './dist/skill-tree-state.js';
function prepare(s,change){const q=T.quoteSkillTreeChange(s,E.SKILL_TREE_DEFINITION,change);assert(q,JSON.stringify(change));const p=T.prepareSkillTreeChange(s,q,E.SKILL_TREE_DEFINITION);assert(p);return p.game;}
let s=E.fresh();s.level=30;for(const id of ['fracture_strike','anvil_cry','ember_brand','furnace_etch','scatter_ash','furnace_wave','cinder_barrage'])s=prepare(s,{type:'unlock',skillId:id});s=prepare(s,{type:'slots',active:['anvil_cry','cinder_barrage','fracture_strike',null],conditions:['always','always','always','always']});
s.heroHp=E.stats(s).hp;s.lastHealthClock=s.lastSeen=10000;s.restUntil=0;s.nextBattleAt=0;const e=E.startRoutedEncounter(s,10000);assert(e);for(const u of e.enemies)u.hp=u.max=1e6;

let logs=E.step(s,e,11100);assert(logs);assert.equal(e.lastCast.skillId,'anvil_cry');assert(e.treeEffects.hero.sources.some(x=>x.type==='attackUp'));assert(E.validSave(s));
logs=E.step(s,e,12200);assert(logs);assert.equal(e.lastCast.skillId,'cinder_barrage');assert.equal(e.lastCast.hits.length,s.inventory.find(it=>it.id===s.equip.weapon)?.weaponType==='axe'?3:2);assert(E.validSave(s));
// Saved encounter resumes the same selector/production enemies with identical persisted RNG.
const resumed=JSON.parse(JSON.stringify(s));for(let i=3;i<=8;i++){const at=10000+i*1100;assert.deepEqual(E.step(s,e,at),E.step(resumed,resumed.activeEncounter,at));}assert.deepEqual(s,resumed);assert(E.validSave(s));
// Default current entry never silently equips new skills.
const old=E.fresh();const oldSkills=[...old.skills];E.normalizeExpedition(old);assert.deepEqual(old.skills,oldSkills);assert.deepEqual(E.step(old,null),[]);
console.log('PASS real engine current selector: explicit current allocation, left-to-right ready/usefulness, real buffs, multihit, full shared enemy step, persisted RNG/JSON, empty new tree has no free skills');
