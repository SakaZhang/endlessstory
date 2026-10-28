import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {RACE_PACKS,getSkillTreeDefinition} from './dist/race-registry.js';
import {skillConditionChoices as choices,effectiveSkillCondition as effective,skillConditionMatches as matches,skillConditionNotice,validSkillCondition,SKILL_CONDITION_CHOICES} from './dist/skill-conditions.js';
import {mountSkillTree} from './dist/skill-tree-ui.js';
import {renderLoadouts} from './dist/loadout-ui.js';
const ids=(skill,weapon='generic',sets={})=>choices(skill,weapon,sets).map(([id])=>id);
const expected={};
const add=(condition,list,weapon='all')=>list.split(' ').filter(Boolean).forEach(id=>((expected[id]??={})[weapon]??=[]).push(condition));
add('low','iron_vigil forge_breath purifying_bulwark bellows_ward stone_anchor human.red_recovery human.oath_guard human.hold_line human.rally human.field_dressing human.cleanse elf.resonant_guard elf.dew_mending elf.leaf_ward elf.clear_moon goblin.toxic_feint goblin.seam_step goblin.ration_rush goblin.braced_lure goblin.patch_ration goblin.dust_escape goblin.shed_binding ashen.anneal ashen.mantle ashen.rebuild ashen.chorus ashen.mend ashen.salve ashen.purify');
add('charge','breaking_intercept human.intercept goblin.stolen_moment goblin.jam_joint ashen.interrupt');
add('bleed','crag_verdict human.open_wound human.sever');add('bleed','breach_followup','axe');
add('armorDown','crag_verdict human.decisive');add('armorDown','breach_followup','hammer');
add('burn','furnace_wave cinder_barrage','hammer');
add('poison','goblin.bitter_wound goblin.spore_transfer');add('poison5','goblin.mire_seal');
add('selfDebuff','purifying_bulwark human.rally human.cleanse elf.clear_moon goblin.shed_binding ashen.purify');
add('selfShield','shield_relay human.return_cut');add('selfShield','bastion_blow','hammer');add('selfShield','human.shield_bash','sword_shield');
add('selfNoShield','iron_vigil purifying_bulwark bellows_ward human.oath_guard human.rally elf.resonant_guard elf.leaf_ward elf.clear_moon goblin.braced_lure goblin.shed_binding ashen.anneal ashen.mantle ashen.chorus ashen.purify');add('selfNoShield','stone_anchor shield_relay','hammer');add('selfNoShield','human.red_recovery human.return_cut human.sever','sword_shield');add('selfNoShield','goblin.patch_ration','sword');
const elements={ember_brand:['fire'],furnace_wave:['fire'],cinder_barrage:['fire'],'elf.sixfold_shift':['rotating'],'elf.ember_bloom':['fire'],'elf.moon_tide':['water'],'elf.wind_prism':['wind','light'],'elf.root_eclipse':['earth','dark'],'elf.sixfold_chorus':['earth','water','fire','wind','light','dark'],'elf.root_strike':['earth'],'elf.moon_sweep':['water'],'elf.prism_impact':['light'],'elf.dusk_reversal':['dark'],'elf.heartwood_release':['rotating'],'ashen.vent':['fire'],'ashen.surge':['fire'],'ashen.quarry':['earth'],'ashen.dawn':['light'],'ashen.dusk':['dark'],'ashen.resound':['light','dark']};
add('elementResistDown',Object.keys(elements).join(' '));
let activeCount=0;
for(const pack of Object.values(RACE_PACKS))for(const n of pack.tree.nodes.filter(n=>n.kind==='active')){activeCount++;for(const weapon of ['generic','axe','hammer','sword_shield','greatsword','bow','staff','dagger','sword','armguard']){
 const want=['always',...(expected[n.id]?.all??[]),...(expected[n.id]?.[weapon]??[])].sort();
 assert.deepEqual(ids(n.id,weapon).sort(),want,`${n.id}/${weapon}: exact audited choices`);
 assert(!ids(n.id,weapon).some(x=>['scorch','targetShield','attackDown','hitDown','stun'].includes(x)||x.startsWith('self_')),`${n.id}: inert/general states hidden`);
}}
assert.equal(activeCount,105);
const fixture=()=>({heroHp:100,treeEffects:{clock:1000,hero:{sources:[]},enemies:{a:{sources:[]},b:{sources:[]}}},treeCombatClock:1000,raceRuntime:{state:{elementIndex:0}},enemies:[{id:'a',hp:100,control:{}},{id:'b',hp:100,control:{}}]});
const check=(e,id,skillId,extra={})=>matches(id,{encounter:e,target:e.enemies[0],maxHp:100,now:1000,skillId,...extra});
const allElements=['earth','water','fire','wind','light','dark'];
for(const [skill,types] of Object.entries(elements))for(let index=0;index<6;index++)for(const element of allElements){const e=fixture();e.raceRuntime.state.elementIndex=index;e.treeEffects.enemies.a.sources=[{type:'elementResistDown',amount:10,endAt:2000,damageType:element}];const before=JSON.stringify(e);assert.equal(check(e,'elementResistDown',skill),types.includes(element)||types.includes('rotating')&&allElements[index]===element,`${skill} index${index} vs ${element}`);assert.equal(JSON.stringify(e),before,'predicate cannot advance resource');e.treeEffects.clock=2000;assert(!check(e,'elementResistDown',skill),'expired resist');}
{const e=fixture();e.treeEffects.enemies.a.sources=[{type:'fireResistDown',amount:10,endAt:2000,requiresStatus:'burn'}];assert(!check(e,'elementResistDown','ember_brand'));e.treeEffects.enemies.b.sources=[{type:'dot',status:'burn',endAt:2000}];assert(!check(e,'elementResistDown','ember_brand'),'other target burn');e.treeEffects.enemies.a.sources.push({type:'dot',status:'burn',endAt:1500});assert(check(e,'fireResistDown','ember_brand'));assert(!check(e,'fireResistDown','elf.moon_tide'));e.treeEffects.clock=1500;assert(!check(e,'elementResistDown','ember_brand'));}
{const e=fixture();e.treePoison={a:{layers:Array.from({length:5},()=>({expiresAt:1001}))}};assert(check(e,'poison5','goblin.mire_seal'));e.treePoison.a.layers[0].expiresAt=1000;assert(!check(e,'poison5','goblin.mire_seal'));assert(check(e,'poison','goblin.spore_transfer'));assert(!ids('goblin.mire_seal').includes('poison'));}
{const e=fixture();e.heroBurn=3;assert(!check(e,'selfDebuff','elf.clear_moon',{eligibleDebuffIds:[]}));assert(check(e,'selfDebuff','elf.clear_moon',{eligibleDebuffIds:['real-removable']}));assert(check(e,'scorch','fracture_strike'),'unsupported saved rule temporarily always');assert(!check(e,'scorch',undefined),'legacy raw predicate still works');}
assert.equal(effective('fireResistDown','ember_brand'),'elementResistDown');assert.equal(effective('fireResistDown','fracture_strike'),'always');assert(skillConditionNotice('scorch','fracture_strike').includes('暂按可用即施放'));assert.equal(skillConditionNotice('fireResistDown','ember_brand'),'');
// Every compatibility ID remains valid through JSON, snapshots and atomic loadout application.
for(const race of Object.keys(RACE_PACKS))for(const id of [...SKILL_CONDITION_CHOICES.map(x=>x[0]),'fireResistDown']){const s=E.fresh(race);s.conditions[0]=id;s.skillTree.presets[0].conditions[0]=id;assert(validSkillCondition(id));assert(E.validSave(s),race+id);assert(E.saveLoadout(s,0,'旧条件'));assert(E.validSave(JSON.parse(JSON.stringify(s))));assert(E.applyLoadout(s,0));assert.equal(s.conditions[0],id);assert.equal(s.skillTree.presets[0].conditions[0],id);}
// Real editor listeners: preset/weapon/slot changes re-evaluate choices without rewriting saved rules.
{
 const s=E.fresh('dwarf');s.level=100;const def=getSkillTreeDefinition(s);for(const p of s.skillTree.presets)p.unlocked=def.nodes.map(n=>n.id);s.skillTree.presets[0].active=['breach_followup',null,null,null];s.skillTree.presets[0].conditions=['bleed','always','always','always'];s.skillTree.presets[1].active=['ember_brand',null,null,null];s.skillTree.presets[1].conditions=['fireResistDown','always','always','always'];s.skills=[...s.skillTree.presets[0].active];s.conditions=[...s.skillTree.presets[0].conditions];s.inventory.push({id:'condition-ui-weapon',weaponType:'axe'});s.equip.weapon='condition-ui-weapon';
 const listeners={},host={innerHTML:'',contains:t=>t.owner===host,addEventListener(k,f){listeners[k]=f;},removeEventListener(k){delete listeners[k];}};const ui=mountSkillTree(host,{getState:()=>s,getDefinition:getSkillTreeDefinition,commit:async()=>({ok:false})});
 const selected=()=>host.innerHTML.match(/data-tree-condition="0"[^>]*>(.*?)<\/select>/s)?.[1]??'';
 assert(selected().includes('value="bleed" selected'));assert(!selected().includes('value="armorDown"'));
 s.inventory.at(-1).weaponType='hammer';ui.refresh();assert(selected().includes('value="armorDown"'));assert(!selected().includes('value="bleed"'));assert(host.innerHTML.includes('暂按可用即施放'));assert.equal(ui.getDraft().skillTree.presets[0].conditions[0],'bleed');
 const click=async(action,id)=>listeners.click({target:{closest:()=>({owner:host,dataset:{treeAction:action,treeId:id}})}});
 await click('plan','1');assert(selected().includes('value="elementResistDown" selected'));assert(!selected().includes('fireResistDown'));assert(!host.innerHTML.includes('暂按可用即施放'));
 const before=structuredClone(s);listeners.change({target:{owner:host,dataset:{treeCondition:'0'},value:'always'}});assert.equal(ui.getDraft().skillTree.presets[1].conditions[0],'always');assert.deepEqual(s,before,'draft condition editing is atomic');
 listeners.change({target:{owner:host,dataset:{treeSlot:'active',treeIndex:'0'},value:'forge_breath'}});assert(selected().includes('value="low"'));assert(!selected().includes('value="elementResistDown"'));await click('cancel');assert.deepEqual(s,before);ui.dispose();
}
console.log('PASS contextual skill conditions: 105 actives × 10 weapons exact matrix, six-element matching/rotation, poison5, compatibility roundtrips, live editor weapon/preset/slot changes and atomic drafts');
// Independent planner proof: contextual elements are actual hit segments, not branch labels.
const elf=await import('./dist/races/elf/skills.js'),ashen=await import('./dist/races/ashen/skills.js'),goblin=await import('./dist/races/goblin/skills.js');
const stats={atk:100,hp:1000,armor:50},target={id:'a',alive:true,hp:500,maxHp:1000,baseAtk:100,baseArmor:40};
for(const [skill,types] of Object.entries(elements).filter(([skill])=>skill.includes('.')))for(let index=0;index<6;index++){
 const pack=skill.startsWith('elf.')?elf:ashen,runtime=pack.createRuntime();if(skill.startsWith('elf.'))runtime.elementIndex=index;
 const plan=pack.planSkill({skillId:skill,castId:'condition-elements',weaponType:'generic',selectedTargetId:'a',targets:[target],stats,context:{runtime}});assert(plan,skill);
 const actual=[...new Set(plan.actions.filter(a=>a.kind==='hit'&&a.damageType!=='physical').map(a=>a.damageType))].sort();
 assert.deepEqual(actual,types.map(x=>x==='rotating'?allElements[index]:x).sort(),skill+' planner elements');
}
for(const layers of [0,1,4,5])for(const skill of ['goblin.bitter_wound','goblin.spore_transfer','goblin.mire_seal']){
 const p=goblin.planSkill({skillId:skill,castId:'poison-combo',weaponType:'generic',selectedTargetId:'a',targets:[{...target,poisonLayers:layers}],stats});
 if(skill==='goblin.spore_transfer'){assert.equal(!!p,layers>0);continue;}
 const effects=p.actions.flatMap(a=>a.effects??[]);assert.equal(effects.some(e=>e.type===(skill==='goblin.mire_seal'?'hitDown':'armorDown')),skill==='goblin.mire_seal'?layers>=5:layers>0);
}
console.log('PASS independent racial planner cross-check: exact elemental segments and actual poison prerequisite/5-layer bonus');
const {skillConditionSetCounts}=await import('./dist/skill-conditions.js');
const physical=new Set([
 ...'fracture_strike fault_sweep breach_followup breaking_intercept bastion_blow repelling_wave crag_verdict shield_relay'.split(' '),
 ...'cut red_sweep open_wound sever precise_cut cross_cut decisive flash_arc shield_bash repulse return_cut intercept'.split(' ').map(x=>'human.'+x),
 ...'twin_arrow thread_volley hunter_mark pursuit moon_finisher root_strike moon_sweep prism_impact dusk_reversal heartwood_release'.split(' ').map(x=>'elf.'+x),
 ...'venom_cut spore_fan bitter_wound spore_transfer mire_seal opening_cut finish_cut stolen_moment crossing_blade tangle_cut jam_joint'.split(' ').map(x=>'goblin.'+x),
 ...'kindle overload cleave fault fracture tap interrupt'.split(' ').map(x=>'ashen.'+x)
]);
for(const pack of Object.values(RACE_PACKS))for(const n of pack.tree.nodes.filter(n=>n.kind==='active'))for(const count of [0,1,2,4]){
 const expected=new Set(ids(n.id));if(count>=2&&physical.has(n.id)){expected.add('bleed');expected.add('armorDown');}
 assert.deepEqual(ids(n.id,'generic',{anvil:count}).sort(),[...expected].sort(),n.id+' anvil '+count);
}
{const e=fixture();assert(check(e,'bleed','fracture_strike',{setCounts:{anvil:1}}),'unavailable set condition safely falls back');assert(!check(e,'bleed','fracture_strike',{setCounts:{anvil:2}}));e.treeEffects.enemies.a.sources=[{type:'dot',status:'bleed',endAt:1100}];assert(check(e,'bleed','fracture_strike',{setCounts:{anvil:2}}));assert.equal(effective('bleed','fracture_strike','generic',{anvil:2}),'bleed');assert.equal(effective('bleed','fracture_strike','generic',{anvil:1}),'always');e.treeEffects.clock=1100;assert(!check(e,'bleed','fracture_strike',{setCounts:{anvil:2}}));}
{
 const s=E.fresh('dwarf');s.level=100;const def=getSkillTreeDefinition(s);s.skillTree.presets[0].unlocked=def.nodes.map(n=>n.id);s.skillTree.presets[0].active=['fracture_strike',null,null,null];s.skillTree.presets[0].conditions=['scorch','always','always','always'];s.skills=[...s.skillTree.presets[0].active];s.conditions=[...s.skillTree.presets[0].conditions];
 s.inventory.push({id:'same-axe',weaponType:'axe',set:'anvil'},{id:'set-helm',set:'anvil'},{id:'plain-helm',set:null},{id:'bag-anvil',set:'anvil'});s.equip.weapon='same-axe';s.equip.helm='plain-helm';assert.equal(skillConditionSetCounts(s).anvil,1,'bag pieces never count');
 const listeners={},host={innerHTML:'',contains:t=>t.owner===host,addEventListener(k,f){listeners[k]=f;},removeEventListener(k){delete listeners[k];}};const ui=mountSkillTree(host,{getState:()=>s,getDefinition:getSkillTreeDefinition,commit:async()=>({ok:false})});
 const selected=()=>host.innerHTML.match(/data-tree-condition="0"[^>]*>(.*?)<\/select>/s)?.[1]??'';
 assert(!selected().includes('value="bleed"'));assert(host.innerHTML.includes('data-tree-action="condition-reset"'));
 const before=structuredClone(s);await listeners.click({target:{closest:()=>({owner:host,dataset:{treeAction:'condition-reset',treeId:'0'}})}});assert.equal(ui.getDraft().skillTree.presets[0].conditions[0],'always');assert(!host.innerHTML.includes('data-tree-action="condition-reset"'));assert.deepEqual(s,before,'explicit fallback acceptance remains draft-only');
 await listeners.click({target:{closest:()=>({owner:host,dataset:{treeAction:'cancel'}})}});assert.deepEqual(s,before);assert.equal(ui.getDraft().skillTree.presets[0].conditions[0],'scorch');
 s.equip.helm='set-helm';ui.refresh();assert.equal(skillConditionSetCounts(s).anvil,2);assert(selected().includes('value="bleed"'));assert(selected().includes('value="armorDown"'));assert.equal(ui.getDraft().skillTree.presets[0].conditions[0],'scorch','gear refresh never rewrites old rules');
 listeners.change({target:{owner:host,dataset:{treeCondition:'0'},value:'bleed'}});assert(selected().includes('value="bleed" selected'));s.equip.helm='plain-helm';ui.refresh();assert(!selected().includes('value="bleed"'));assert(host.innerHTML.includes('暂按可用即施放'));assert.equal(ui.getDraft().skillTree.presets[0].conditions[0],'bleed');assert.equal(s.skillTree.presets[0].conditions[0],'scorch');ui.dispose();
}
console.log('PASS Anvil set-context matrix, matcher expiry/fallback, same-weapon gear UI refresh and explicit old-rule reset/cancel atomicity');
