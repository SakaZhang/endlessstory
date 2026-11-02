import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from './dist/engine.js';
import {EQUIPMENT_TEMPLATES,applyEquipmentTemplate,validEquipmentTemplateMetadata} from './dist/equipment-templates.js';
import {equipmentDisplayName as display,equipmentNameFromReceipt as receipt} from './dist/equipment-display-name.js';
import {renderInventory} from './dist/inventory-ui.js';
import {renderPixelInventory} from './dist/pixel-inventory.js';
import {renderLootHistory,validLootHistory} from './dist/loot-history.js';
import {renderCasinoReceipt} from './dist/casino-ui.js';
const expected=JSON.parse(readFileSync('fixtures/set-names-approved-v093.json','utf8'));
const templates=EQUIPMENT_TEMPLATES.filter(t=>t.kind==='set');
assert.equal(Object.keys(expected).length,60);
assert.deepEqual(Object.keys(expected).sort(),templates.map(t=>t.id).sort(),'exact approved template set, no absent or extra IDs');
const sets=new Map(E.BUILD.map(s=>[s.id,s.name]));
const catalog=JSON.stringify(EQUIPMENT_TEMPLATES);
const oldDisplay=t=>t.name.startsWith(sets.get(t.setId)+'·')?t.name:sets.get(t.setId)+'·'+(t.name.startsWith(sets.get(t.setId))?t.name.slice(sets.get(t.setId).length):t.name);
let changed=0;
for(const t of templates){
 const want=expected[t.id];assert.equal(display(t),want,t.id);assert.equal(want.split('·').length,2);if(oldDisplay(t)!==want)changed++;
 if(t.slot==='gloves')assert(want.endsWith('护手'));
 const item=applyEquipmentTemplate({...E.item(t.slot,90,t.setId,3,{originRace:t.originRace}),templateId:undefined},t.id);
 assert(validEquipmentTemplateMetadata(item));assert.equal(item.name,t.name,'stored name remains frozen');assert.equal(display(item),want);
 const itemBefore=JSON.stringify(item), noTemplate=structuredClone(item);delete noTemplate.templateId;
 for(const oldName of new Set([t.name,oldDisplay(t),want])){
   assert.equal(receipt(oldName),want,`${t.id} exact historical receipt alias`);
   assert.equal(display({...noTemplate,name:oldName}),want,`${t.id} pre-template legacy alias`);
 }
 const s=E.fresh(t.originRace);s.inventory=[item];s.equip[t.slot]=item.id;assert(E.validSave(s));
 const attrs=JSON.stringify(E.stats(s)), save=JSON.stringify(s);
 const ctx={bagTab:'equipment',bagSlot:t.slot,bagSort:'quality',selected:item.id,sortedGear:()=>s.inventory,itemDetail:()=>'',potionView:()=>'',materialGrid:()=>''};
 assert(renderInventory(s,ctx).includes(want));assert(renderPixelInventory(s,ctx).includes(want));
 assert.equal(JSON.stringify(s),save);assert.equal(JSON.stringify(E.stats(s)),attrs);assert.equal(JSON.stringify(item),itemBefore);
 s.lootHistory={version:1,records:[{id:'legacy-set',at:1,mode:'dungeon',node:'旧副本',region:'旧地区',floor:0,stage:3,gold:0,xp:0,drops:[{kind:'equipment',name:item.name,quality:3,quantity:1,level:90,outcome:'received'}]}]};
 assert(validLootHistory(s));const frozen=JSON.stringify(s);assert(renderLootHistory(s).includes(want));assert.equal(JSON.stringify(s),frozen);
 assert(renderCasinoReceipt({revision:1,outcome:'same',inputKind:'equipment',inputName:item.name,rewardName:item.name,fromQuality:3,toQuality:3,rewardId:item.id}).includes(want));
 assert.equal(display({...item,legendaryId:'not-a-set'}),item.name,'legendary bypass retained');
}
assert.equal(changed,44,'precise change count relative to v087 display');
assert.equal(JSON.stringify(EQUIPMENT_TEMPLATES),catalog,'no template identity/stat changes');
for(const t of EQUIPMENT_TEMPLATES.filter(t=>t.kind!=='set'))assert.equal(display(t),t.name);
assert.equal(receipt('三相晶格·握的故事'),'三相晶格·握的故事','no prose substring replacement');
assert.equal(display({name:'自定旧名',set:'human_blood_oath',slot:'helm'}),'赤痕誓约·自定旧名');
assert.equal(display({name:'自定旧名',set:'unknown',slot:'helm'}),'自定旧名');
assert.equal(display({name:'三相晶格·握',set:'ashen.prism',slot:'armor'}),'三相晶格·握','exact historical alias must not override a mismatched slot');
assert.equal(display({name:'赤痕手套',set:'human_royal_edge',slot:'gloves'}),'王领锐锋·赤痕手套','wrong set must not resolve a historical alias');
assert.equal(display({name:'药剂'}),'药剂');assert.equal(display(null),'');
console.log('PASS v093 exact 60 approved names, 44 display revisions, five races, legacy raw/v087/current aliases, unchanged catalog/save/stats, equipped/inventory/loot/casino, non-set and legendary negative cases.');
