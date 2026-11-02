import assert from 'node:assert/strict';
import fs from 'node:fs';
import {planSkill,modifySkillPlan} from './dist/races/human/skills.js';
import {planTreeSkill,validTreeSkillPlan} from './dist/skill-tree-consumer.js';
import {createSkillEffectState,applySkillEffect,advanceSkillEffectState,validSkillEffectState,carryHeroSkillEffects,restoreHeroSkillEffects} from './dist/skill-tree-effects.js';
import {skillTreeHeroStats} from './dist/skill-tree-attributes.js';
import {setSkillCritChance,clearRemovedSetSkillCrit} from './dist/set-skill-critical.js';
import * as E from './dist/engine.js';
import {executeTreePlayerAction} from './dist/multi-combat.js';
const base={atk:100,armor:100,hp:1000,penetration:0,hitRating:0,critRating:0,critDamageRating:0,crit:0.05,count:{human_royal_edge:2},bonus:{},elementAttack:{},elementResistance:{}};
const apply=(state,effect)=>{const r=applySkillEffect(state,'self',effect);assert(r);return r.state;};
const bonus=(skill='human.opening',durationMs=6600)=>({type:'setSkillCrit',sourceId:skill,source:{kind:'skill',id:skill},amount:.05,durationMs});
for(const weaponType of ['sword_shield','greatsword'])for(const skillId of ['human.precise_cut','human.flash_arc','human.opening'])for(const count of [0,1,2,4]){
 const input={config:{cooldownMs:10000},skillId,castId:'test',weaponType,selectedTargetId:'e',targets:[{id:'e',alive:true,hp:1000,maxHp:1000}],stats:{...base,count:{human_royal_edge:count}},hero:{hp:1000,maxHp:1000}};
 const raw=planSkill(input),p=modifySkillPlan(raw,{setCounts:input.stats.count});assert(p);
 const oldCrit=raw.actions.flatMap(a=>a.effects??[]).filter(e=>e.type==='critUp'),newCrit=p.actions.flatMap(a=>a.effects??[]).filter(e=>e.type==='critUp'),extra=p.actions.flatMap(a=>a.effects??[]).filter(e=>e.type==='setSkillCrit');
 assert.deepEqual(newCrit.map(e=>e.amount),oldCrit.map(e=>e.amount));assert.equal(extra.length,count>=2?oldCrit.length:0);
 for(const ef of extra){assert.equal(ef.amount,.05);assert.equal(ef.durationMs,newCrit[0].durationMs);}
 const normalized=planTreeSkill(input);assert(normalized);assert(validTreeSkillPlan(normalized));
 if(extra.length){const corrupt=structuredClone(normalized);corrupt.actions.flatMap(a=>a.effects).find(e=>e.type==='setSkillCrit').amount=.04;assert(!validTreeSkillPlan(corrupt));}
}
let effects=apply(createSkillEffectState(['e']),bonus());
for(const critRating of [0,100,300,1000,1e12]){
 const ordinary=skillTreeHeroStats({...base,critRating},effects,{dodgeCap:.5});
 const plain=skillTreeHeroStats({...base,critRating},createSkillEffectState(['e']),{dodgeCap:.5});
 assert.equal(ordinary.crit,plain.crit,'ordinary/basic chance unchanged');
 assert(Math.abs(setSkillCritChance(ordinary,effects)-ordinary.crit-.05)<1e-12);
 assert(setSkillCritChance(ordinary,effects)<=.65);
 assert.equal(setSkillCritChance({...ordinary,count:{}},effects),ordinary.crit);
}
effects=apply(effects,bonus('human.precise_cut'));assert.equal(effects.hero.sources.length,2);assert.equal(setSkillCritChance({...base,crit:.6},effects),.65,'max not sum');
effects=apply(effects,bonus('human.precise_cut'));assert.equal(effects.hero.sources.length,2,'same source refresh');
assert.equal(setSkillCritChance(base,advanceSkillEffectState(effects,6600).state),base.crit,'expiry');
assert(validSkillEffectState(JSON.parse(JSON.stringify(effects))));assert.deepEqual(restoreHeroSkillEffects(carryHeroSkillEffects(effects),['e']),effects);
for(const [skill,oldAmount,amount]of [['human.precise_cut',14,8],['human.precise_cut',16,10],['human.flash_arc',18,12],['human.opening',22,16]]){
 let old=apply(createSkillEffectState(['e']),{type:'critUp',amount:oldAmount,durationMs:5000,sourceId:skill});const end=old.hero.sources[0].endAt;
 assert(validSkillEffectState(old));old=apply(old,bonus());assert.equal(old.hero.sources.find(s=>s.type==='critUp').amount,amount);assert.equal(old.hero.sources.find(s=>s.type==='critUp').endAt,end);
 assert.equal(old.hero.sources.filter(s=>s.type==='setSkillCrit').length,1,'legacy cast does not gain extra marker');
}
for(const [skill,amount]of [['anvil_cry',16],['human.opening',16],['human.flash_arc',12],['human.precise_cut',10]]){
 let ordinary=apply(createSkillEffectState(['e']),{type:'critUp',amount,durationMs:5000,sourceId:skill});ordinary=apply(ordinary,bonus());assert.equal(ordinary.hero.sources.find(s=>s.type==='critUp').amount,amount);
}
for(const bad of [{...bonus(),amount:.06},{...bonus(),sourceId:'anvil_cry'},{...bonus(),source:{kind:'equipment',id:'human.opening'}}])assert.equal(applySkillEffect(createSkillEffectState(['e']),'self',bad),null);
const state={inventory:[{id:'one',set:'human_royal_edge'},{id:'two',set:'human_royal_edge'}],activeEncounter:{treeEffects:structuredClone(effects)},dungeonRun:{carry:{treeEffects:carryHeroSkillEffects(effects)}}};
clearRemovedSetSkillCrit(state,new Set(['one','two']));assert.equal(state.activeEncounter.treeEffects.hero.sources.length,2);
clearRemovedSetSkillCrit(state,new Set(['one']));assert.equal(state.activeEncounter.treeEffects.hero.sources.length,0);assert.equal(state.dungeonRun.carry.treeEffects.hero.sources.length,0);
clearRemovedSetSkillCrit(state,new Set(['one','two']));assert.equal(state.activeEncounter.treeEffects.hero.sources.length,0,'re-equip no grant');
// Production direct skill path, fixed RNG threshold lies only inside the extra 5pp window.
function production(withBonus){
 const s=E.fresh();s.heroHp=E.stats(s).hp;s.lastHealthClock=s.lastSeen=10000;s.nextBattleAt=0;s.restUntil=0;const e=E.startDeveloperGroup(s,{count:2,seed:987},10000);for(const u of e.enemies){u.hp=u.max=100000;u.armor=0;u.profile.counterRatio=0;}
 e.treeEffects=createSkillEffectState(e.enemies.map(u=>u.id));if(withBonus)e.treeEffects=apply(e.treeEffects,bonus());
 const native=E.stats(s);const stats=()=>({...native,hit:1,crit:.6,critRating:1e12,count:{human_royal_edge:2},critDamage:2,specials:{}});
 const saved=Math.random;Math.random=()=>.62;try{const out=executeTreePlayerAction(s,e,{stats,resolveElementDamage:E.resolveElementDamage,now:11100,attributeConfig:{dodgeCap:.5},input:{skillId:'fracture_strike',castId:e.id+':test',weaponType:'staff',config:{genericCoefficient:1,axeCoefficients:[.6,.9],hammerCoefficient:1.2,cooldownMs:4400,armorBreak:{amount:7,durationMs:2200,timing:'after-hit'}}},effects:{apply:()=>true,applyArmorBreak:()=>{}},onDamageAction:()=>{},onHeroDeath:()=>{}});assert(out);return out.original.hits[0].actualHpLost;}finally{Math.random=saved;}
}
assert.equal(production(true),2*production(false));
const source=fs.readFileSync('dist/multi-combat.js','utf8');assert.equal(source.split('setSkillCritChance(st,e.treeEffects)').length-1,1,'only direct skill path uses set bonus');
console.log('PASS v088 royal edge: exact skill5pp, ordinary/basic unchanged, source/timing validation, no stack, expiry, legacy6 retirement, equip/carry removal, reload and production skill crit threshold.');

const legacy=apply(createSkillEffectState(['e']),{...bonus(),amount:.03});assert(validSkillEffectState(legacy));assert.equal(setSkillCritChance({...base,crit:.6},legacy),.63);
