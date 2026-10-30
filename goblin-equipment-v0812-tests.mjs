import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as E from './dist/engine.js';
import {EQUIPMENT_TEMPLATES,applyEquipmentTemplate} from './dist/equipment-templates.js';
import {LEGENDARY_EQUIPMENT_DEFINITIONS} from './dist/legendary-equipment.js';
import {deriveNewItemBudget,validItemBudgetMetadata,equipmentBudgetNotice} from './dist/equipment-budget-adapter.js';
import {deriveEquipmentBase,enhanceRawBase} from './dist/equipment-budget.js';
import {GOBLIN_EQUIPMENT_BASE_BALANCE} from './dist/equipment-base-balance.js';
import * as EquipmentDisplay from './dist/equipment-display.js';
import {getRacePack} from './dist/race-registry.js';
import {equipmentIcon} from './dist/equipment-art.js';
import {renderSetEffects} from './dist/set-effects.js';
import {renderFormalEnhancement} from './dist/equipment-enhancement-ui.js';
import {renderEquipmentWorkshop} from './dist/equipment-workshop-ui.js';
const copy=x=>structuredClone(x),raw=it=>Object.fromEntries(['atk','armor','hp'].map(k=>[k,it[k]]));
const expectedBase=(it,goblin)=>Object.fromEntries(Object.entries(raw(it)).map(([k,v])=>[k,goblin&&k!=='atk'&&v?Math.max(1,Math.round(v*.8)):v]));
const originalNow=Date.now,originalRandom=Math.random;let seed=812;Date.now=()=>1700000000000;Math.random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/2**32);
try{
assert.deepEqual(GOBLIN_EQUIPMENT_BASE_BALANCE,{hp:.8,armor:.8});
function templateItem(t,level){
 let it=E.item(t.slot,level,t.setId,t.setId?3:2,{originRace:t.originRace});
 // Explicit new fixture identities follow the production template + budget APIs.
 for(const key of ['templateId','baseVariant','weaponType','originRace','visualKey','visualVariant','iconKey'])delete it[key];
 it=applyEquipmentTemplate(it,t.id);Object.assign(it,deriveNewItemBudget({slot:it.slot,baseVariant:it.baseVariant,level,quality:it.rarity}));return it;
}
let identities=0,goblin=0;
for(const t of [...EQUIPMENT_TEMPLATES,...Object.values(LEGENDARY_EQUIPMENT_DEFINITIONS)]){
 let previous=null;
 for(const level of [1,20,60,100]){
  const it=t.kind?templateItem(t,level):E.legendaryItem(t.id,level);assert(it,t.id);assert(validItemBudgetMetadata(it));
  const saved=JSON.stringify(it),isGoblin=t.originRace==='goblin',base=expectedBase(it,isGoblin);
  assert.deepEqual(E.balancedItemBase(it),base,t.id);assert.deepEqual(E.itemTotals(it),base,t.id);
  if(previous)for(const k of ['hp','armor'])assert(base[k]>=previous[k],t.id+' retains level growth');previous=base;
  const state=E.fresh();state.inventory.push(it);if(!E.isUniqueCraftedEquipment(it))assert(E.validSave(state),t.id+' still valid current budget');
  assert.equal(JSON.stringify(it),saved,'calculation/validation never rewrites raw inventory');
  for(let enhancement=0;enhancement<=5;enhancement++){
   const enhanced={...it,enhancement:{version:2,model:'equipment-budget-m2-v1',level:enhancement}},want=enhanceRawBase(base,enhancement);
   assert.deepEqual(E.itemTotals(enhanced),want,t.id+' balances once before enhancement');
   assert.equal(want.atk,enhanceRawBase(raw(it),enhancement).atk,'attack unchanged at every enhancement');
   E.applyForgeFavor(enhanced);assert.deepEqual(E.itemTotals(enhanced),Object.fromEntries(Object.entries(want).map(([k,v])=>[k,v*1.1])),'divine once after balanced enhancement');
   assert.deepEqual(enhanced.affixes,it.affixes,'ordinary affixes unchanged');assert(validItemBudgetMetadata(enhanced));
  }
 }
 identities++;if(t.originRace==='goblin')goblin++;
}
assert.equal(goblin,66,'52 ordinary +12 set +2 legendary identities');
// Real new drops and already-owned raw snapshots use exactly the same policy.
for(const slot of ['weapon','helm','armor','gloves','boots','ring','amulet'])for(const quality of [0,1,2,3]){
 const it=E.item(slot,60,null,quality,{originRace:'goblin',levelSource:'drop'}),saved=JSON.stringify(it),restored=JSON.parse(saved);
 assert.deepEqual(E.itemTotals(restored),expectedBase(it,true));assert.equal(JSON.stringify(restored),saved);
 assert.deepEqual(raw(it),raw(deriveEquipmentBase({slot,baseVariant:it.baseVariant,level:60,quality})),'immutable generated raw budget unchanged');
}
// Canonical origin, not wearer race or a spoofed origin string, chooses the policy.
const own=E.item('armor',60,null,2,{originRace:'goblin'}),other=E.item('armor',60,null,2,{originRace:'human'});
{const full=E.fresh('goblin');full.inventory=[copy(own)];assert(E.equipItem(full,own.id));E.normalizeHealth(full);const reducedHp=E.stats(full).hp;full.heroHp+=own.hp-E.balancedItemBase(own).hp;assert(E.validSave(full),'previously full-health owned save is not rejected');const gear=JSON.stringify(full.inventory);assert(E.normalizeHealth(full));assert.equal(full.heroHp,reducedHp,'existing health cap handles lower gear max');assert.equal(JSON.stringify(full.inventory),gear);}
for(const it of [own,other,E.legendaryItem('goblin-silent-steps',60)]){
 const totals=E.itemTotals(it),bonuses=Object.fromEntries(['atk','armor','hp'].map(k=>[k,it.affixes.filter(a=>a.stat===k).reduce((n,a)=>n+a.value,0)]));
 for(const race of E.RACE_KEYS){const s=E.fresh(race);s.level=60;const before=E.baseStats(s);s.inventory.push(copy(it));assert(E.equipItem(s,it.id));const after=E.baseStats(s);for(const k of ['atk','armor','hp'])assert.equal(after[k]-before[k],Math.round(totals[k]+bonuses[k]),race+' same gear contribution');assert(E.validSave(s));}
}
assert.deepEqual(E.balancedItemBase({...other,originRace:'goblin'}),raw(other),'no race-string-only nerf');
for(const invalid of [{...own,originRace:'human'},{...own,hp:own.hp-1},{...own,armor:own.armor-1},{...own,templateId:other.templateId}]){const s=E.fresh();s.inventory=[invalid];const json=JSON.stringify(s);assert(!E.validSave(s));assert.equal(JSON.stringify(s),json,'strict rejection is non-mutating');}
// Formal previews, successful/failed paid enhancement and reforge preserve bases.
const s=E.fresh('goblin');s.gold=1e6;s.consumables.reforgeToken=1;s.inventory=[copy(own)];E.applyForgeFavor(s.inventory[0]);
const ownedRaw=raw(s.inventory[0]),ownedAffixes=copy(s.inventory[0].affixes);
for(const roll of [0,0,.999]){
 const it=s.inventory[0],level=E.enhancementLevel(it),q=E.quoteEnhancement(s,it.id);assert(q.ok);
 for(const [key,n]of [['current',level],['success',level+1],['failure',Math.max(0,level-1)]])assert.deepEqual(q.bases[key],enhanceRawBase(expectedBase(it,true),n));
 const html=renderFormalEnhancement(s,{slot:it.slot,itemId:it.id,quote:q});for(const [key,label]of [['armor','护甲'],['hp','生命']])assert(html.includes(`<tr><th>${label}</th><td>${q.bases.current[key]}</td><td class="workshopGain">${q.bases.success[key]}</td><td>${q.bases.failure[key]}</td></tr>`));
 assert(E.enhanceEquipment(s,q,()=>roll));assert.deepEqual(raw(s.inventory[0]),ownedRaw);assert.deepEqual(s.inventory[0].affixes,ownedAffixes);assert(E.validSave(s));
}
const beforeReforge=E.itemTotals(s.inventory[0]);assert(E.reforge(s,own.id,'all'));assert(E.resolveReforge(s,true));assert.deepEqual(raw(s.inventory[0]),ownedRaw);assert.deepEqual(E.itemTotals(s.inventory[0]),beforeReforge);assert(E.validSave(JSON.parse(JSON.stringify(s))));
// Actual App itemDetail renders effective unenhanced bases, not stored raw budgets.
const source=fs.readFileSync('dist/app.js','utf8'),line=name=>source.split('\n').find(l=>l.startsWith('function '+name+'('));
const context=vm.createContext({...E,...EquipmentDisplay,MultiEngine:E,getRacePack,equipmentIcon,equipmentBudgetNotice,renderSetEffects,esc:x=>String(x??''),fmt:n=>Number(n.toFixed(2)),divineBadge:()=>''});
for(const name of ['equipmentLevelTitle','affixHtml','itemDetail'])vm.runInContext(line(name),context);
for(const it of [own,other,E.item('armor',60,'goblin_spore',3),E.legendaryItem('goblin-silent-steps',60),s.inventory[0]]){
 context.s={...E.fresh(),inventory:[it]};context.item=it;const html=vm.runInContext('itemDetail(item)',context),base=E.balancedItemBase(it),totals=E.itemTotals(it);
 for(const [k,label]of [['armor','护甲'],['hp','生命']]){assert(html.includes(`<b>${base[k]}${it.divine?'<small class="divineIncrease">（+10%）</small>':''}</b><small>${label}</small>`),'detail '+label);if(it.divine||it.enhancement)assert(html.includes(`<small>实际 ${Number(totals[k].toFixed(2))}</small>`));}
}
const workshop=renderEquipmentWorkshop({...s,developmentEquipmentSandbox:true},{selectedId:own.id});for(const [k,label]of [['armor','护甲'],['hp','生命']])assert(workshop.includes(`<tr><th>${label}</th><td>${E.balancedItemBase(s.inventory[0])[k]}</td>`));
// Existing current-schema earned saves are still accepted, never rewritten on read.
for(const race of E.RACE_KEYS){const saved=fs.readFileSync(`fixtures/natural-progression-v071/${race}.json`,'utf8'),state=JSON.parse(saved),before=JSON.stringify(state);assert(E.validSave(state),race+' owned save remains valid');E.stats(state);assert.equal(JSON.stringify(state),before);}
console.log(`PASS Goblin equipment balance: ${identities} canonical identities/${goblin} affected; all slots/sets/legends, level growth, other-origin controls, cross-wear, immutable current saves, strict tamper rejection, +0..5/divine once, reforge and actual detail/enhancement/workshop previews.`);
}finally{Date.now=originalNow;Math.random=originalRandom;}
