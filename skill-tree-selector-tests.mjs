import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
function prepare(s,change){const q=E.quoteSkillTreePreparation(s,change);assert(q,JSON.stringify(change));const p=E.prepareSkillTreePreparation(s,q);assert(p);return p.game;}
let s=E.fresh({legacySkillModel:true});s.level=30;s=prepare(s,{type:'prepare'});for(const id of ['fracture_strike','anvil_cry','ember_brand','furnace_wave','cinder_barrage'])s=prepare(s,{type:'unlock',skillId:id});s=prepare(s,{type:'slots',active:['anvil_cry','cinder_barrage','fracture_strike',null],conditions:['always','always','always','always']});
s.heroHp=E.stats(s).hp;s.lastHealthClock=s.lastSeen=10000;s.restUntil=0;s.nextBattleAt=0;const e=E.startRoutedEncounter(s,10000);assert(e);for(const u of e.enemies)u.hp=u.max=1e6;
const parameters={attributeConfig:{dodgeCap:.5},periodic:{burnTickMs:2000,bleedTickMs:2000,healingTickMs:2000},configs:base=>({anvil_cry:{cooldownMs:6600,attackUp:base.atk*.2,critUp:8,penetrationUp:5,durationMs:4400},cinder_barrage:{cooldownMs:4400,coefficient:.6,burnBonus:.2},fracture_strike:{genericCoefficient:1,axeCoefficients:[.6,.9],hammerCoefficient:1.2,cooldownMs:4400,armorBreak:{amount:7,durationMs:2200,timing:'after-hit'}}})};
let logs=E.stepSkillTreeCandidate(s,e,parameters,11100);assert(logs);assert.equal(e.lastCast.skillId,'anvil_cry');assert(e.treeEffects.hero.sources.some(x=>x.type==='attackUp'));assert(E.validSave(s));
logs=E.stepSkillTreeCandidate(s,e,parameters,12200);assert(logs);assert.equal(e.lastCast.skillId,'cinder_barrage');assert.equal(e.lastCast.hits.length,s.inventory.find(it=>it.id===s.equip.weapon).weaponType==='axe'?3:2);assert(E.validSave(s));
// Saved encounter resumes the same selector/production enemies with identical persisted RNG.
const resumed=JSON.parse(JSON.stringify(s));for(let i=3;i<=8;i++){const at=10000+i*1100;assert.deepEqual(E.stepSkillTreeCandidate(s,e,parameters,at),E.stepSkillTreeCandidate(resumed,resumed.activeEncounter,parameters,at));}assert.deepEqual(s,resumed);assert(E.validSave(s));
// Default normal entry is unchanged: preparation never silently equips new skills.
const old=E.fresh({legacySkillModel:true});const oldSkills=[...old.skills];E.normalizeExpedition(old);assert.deepEqual(old.skills,oldSkills);assert.equal(E.stepSkillTreeCandidate(old,null,parameters),null);
console.log('PASS real engine candidate selector: explicit paid prepared allocation, left-to-right ready/usefulness, real buffs, multihit, full shared enemy step, persisted RNG/JSON, default legacy entry unchanged');
