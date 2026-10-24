import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
const copy=x=>JSON.parse(JSON.stringify(x));
const fresh=E.fresh();assert.equal(E.SCHEMA_VERSION,6);assert(E.validSave(fresh));assert(E.validSave(copy(fresh)));assert.equal(fresh.skillTree.mode,'active');assert.deepEqual(fresh.skills,[null,null,null,null]);assert(!('legacy' in fresh.skillTree));assert(!('supportGrantEligible' in fresh));assert(!('grantDevelopmentSupport' in E));assert.throws(()=>E.fresh({legacySkillModel:true}),/Unknown playable race/);
for(const mutate of [s=>s.version=2,s=>delete s.skillTree,s=>s.skillTree.mode='prepared',s=>s.skillTree.legacy={skills:['break',null,null,null],conditions:null,loadouts:null},s=>s.supportGrantEligible=false,s=>s.bonusTalentPoints=30,s=>s.testGrants={v081support:true},s=>s.contentMigration={version:1,legacyDrain:true,reselectRequired:false},s=>{s.siteId='dwarf-blackforge-1';s.expedition.fieldId='dwarf-blackforge-1-field';}]){const s=copy(fresh);mutate(s);const before=copy(s);assert.equal(E.validSave(s),false);assert.deepEqual(s,before);}
{
 const s=copy(fresh),before=copy(s);assert.equal(E.startInstanceEncounter(s,'dwarf-blackforge-1-boss',s.lastSeen),null);assert.deepEqual(s,before);assert.equal(E.configureExpedition(s,{mode:'field',fieldId:'dwarf-blackforge-1-field',targetInstanceId:null,loop:false}),false);assert.deepEqual(s,before);
}
{
 const s=copy(fresh);E.normalizeHealth(s,s.lastSeen);const e=E.startRoutedEncounter(s,s.lastSeen);assert(e);assert.equal(e.multiVersion,1);assert.equal(e.skillResolver,'tree-v1');assert(E.validSave(s));for(let i=0;i<300&&!e.done;i++)E.step(s,e,s.nextActionAt);assert(e.done);if(e.win)E.reward(s,e,s.lastHealthClock);assert(E.validSave(s));assert(E.validSave(copy(s)));
 const prior=copy(s),fake={done:true,win:true,rewarded:false,location:0};assert.equal(E.reward(s,fake),null);assert.deepEqual(s,prior);assert.deepEqual(E.step(s,fake,s.lastSeen),[]);
}
{
 const s=copy(fresh);s.gold=10000;s.materialStacks['铁屑|0']=100;s.consumables.reforgeToken=3;const it=E.item('gloves',10,null,2);s.inventory.push(it);for(const mode of ['value','all']){const pending=E.reforge(s,it.id,mode,0);assert(pending);assert.equal(s.pendingReforge.ruleVersion,6);assert(E.validSave(s));for(const v of [undefined,2,3,4,5]){const old=copy(s);if(v===undefined)delete old.pendingReforge.ruleVersion;else old.pendingReforge.ruleVersion=v;assert.equal(E.validSave(old),false);}assert(E.resolveReforge(s,false,s.pendingReforge.operationId));assert(E.validSave(s));}
 const raw=copy(it),donor=E.item(it.slot,10,null,3);s.inventory.push(donor);const candidate=E.eligibleReforgeDonors(s,it.id,0).find(x=>x.item.id===donor.id);if(candidate){assert(E.reforge(s,it.id,'replace',0,donor.id));assert(E.validSave(s));assert(E.resolveReforge(s,true,s.pendingReforge.operationId));assert.equal(it.id,raw.id);assert.equal(it.atk,raw.atk);assert.equal(it.hp,raw.hp);assert.equal(it.armor,raw.armor);}
}
{
 const s=copy(fresh);const m=E.ensureMerchant(s,s.lastSeen);assert.equal(m.offers.length,8);assert(E.validSave(s));const before=copy(s);E.ensureMerchant(s,s.lastSeen+1);assert.deepEqual(s.merchant,before.merchant);const bad=copy(s);bad.merchant.offers=bad.merchant.offers.filter(x=>x.type==='material').map(({type,offerId,...rest})=>rest);assert.equal(E.validSave(bad),false);
}
{
 const s=copy(fresh);s.gold=10000;const result=E.forge(s,['铁屑|0']);assert(result);assert(E.validSave(s));const legend=E.legendaryItem('first-forge-oathhammer',10);s.inventory.push(legend);assert(E.validSave(s));assert.deepEqual(copy(s).inventory.at(-1),legend);
}
console.log('PASS schema6 current-only: fresh active tree, prior generation rejection without mutation, no support grant/historical route, actual combat+reward+reload, rule6 all operations, merchant, forge and legend raw identity');
{
 const {beginSkillTreeDraft,editSkillTreeDraft,quoteSkillTreeDraft,commitSkillTreeDraft,quoteSkillTreeChange}=await import('./dist/skill-tree-state.js');
 const s=E.fresh();s.level=100;const D=E.SKILL_TREE_DEFINITION,node=D.nodes.find(n=>n.requires.length===0);let draft=beginSkillTreeDraft(s,D);assert(draft);draft=editSkillTreeDraft(draft,D,{type:'unlock',skillId:node.id});assert(draft);const q=quoteSkillTreeDraft(s,draft,D,{confirm:true});assert(q);s.gold+=7;const before=copy(s);const bad=commitSkillTreeDraft({setItem(){throw Error('quota');}},s,q,D);assert.equal(bad.ok,false);assert.deepEqual(s,before);let stored;const ok=commitSkillTreeDraft({setItem(k,v){assert.equal(k,'ashencrown-v6');stored=v;}},s,q,D);assert(ok.ok);assert.equal(ok.game.gold,s.gold);assert(E.validSave(ok.game));assert(E.validSave(JSON.parse(stored)));assert(!('legacy' in ok.game.skillTree));assert.equal(quoteSkillTreeChange(s,D,{type:'activate',confirm:true}),null);assert.equal(quoteSkillTreeChange(s,D,{type:'prepare'}),null);
}
console.log('PASS current six-field active tree: no legacy/activation migration; independent draft, current resources preserved, quota rollback, v6 atomic save');
{
 const s=E.fresh(),it=E.item('gloves',20,null,3);s.inventory.push(it);assert(E.validSave(s));
 for(const mutate of [i=>delete i.templateId,i=>delete i.baseBudgetModel,i=>delete i.baseLevel,i=>delete i.levelSource,i=>i.levelSource='legacy',i=>delete i.affixes[0].sourceRange,i=>i.atk++,i=>i.baseLevel=0]){const bad=copy(s);mutate(bad.inventory.at(-1));assert.equal(E.validSave(bad),false);}
 const missing=copy(s);delete missing.inventory[0].baseLevel;delete missing.inventory[0].levelSource;const before=copy(missing);assert.equal(E.normalizeEquipmentLevels(missing),false);assert.deepEqual(missing,before);
 for(const mutate of [x=>x.potions={healing:1},x=>x.potionSlot={type:'healing',auto:false},x=>x.potionBuffs={strength:123}]){const bad=copy(s);mutate(bad);assert.equal(E.validSave(bad),false);const raw=copy(bad);assert.equal(E.normalizePotions(bad),false);assert.deepEqual(bad,raw);}
 for(const slot of E.SLOTS)for(let q=0;q<4;q++){const game=E.fresh();game.inventory.push(E.item(slot,100,null,q));assert(E.validSave(game));}
 console.log('PASS strict current factory metadata: every family/quality, missing budget/template/source rejected, no legacy level or potion migration, normalization never repairs invalid imported assets');
}
{
 const s=E.fresh();assert(s.inventory.every(it=>it.bless===0));for(const id of ['first-forge-oathhammer','everburning-reactor']){const it=E.legendaryItem(id,20);assert.equal(it.bless,0);s.inventory.push(it);}assert(E.validSave(s));const bad=copy(s);bad.inventory[0].bless=1;assert(!E.validSave(bad));assert.deepEqual(E.itemTotals(bad.inventory[0]),E.itemTotals(s.inventory[0]),'retired bless never contributes stats');
 s.gold=100000;const quote=E.quoteEnhancement(s,s.inventory[0].id);assert(quote.ok);assert(E.enhanceEquipment(s,quote,()=>0));assert(s.inventory.every(it=>it.bless===0));assert(E.validSave(s));
}
console.log('PASS old bless contribution retired: nonzero rejected, generated/legend/formally enhanced items retain zero');
