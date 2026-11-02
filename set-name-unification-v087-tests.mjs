import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs';
import * as E from './dist/engine.js';
import {EQUIPMENT_TEMPLATES,applyEquipmentTemplate,validEquipmentTemplateMetadata} from './dist/equipment-templates.js';
import {equipmentDisplayName as name,equipmentNameFromReceipt} from './dist/equipment-display-name.js';
import {renderInventory} from './dist/inventory-ui.js';
import {renderPixelInventory} from './dist/pixel-inventory.js';
import {renderLootHistory,validLootHistory} from './dist/loot-history.js';
import {renderCasinoReceipt} from './dist/casino-ui.js';
const templates=EQUIPMENT_TEMPLATES.filter(t=>t.kind==='set');assert.equal(templates.length,60);
const sets=new Map(E.BUILD.map(b=>[b.id,b.name]));let changed=0;
for(const t of EQUIPMENT_TEMPLATES){const snapshot=JSON.stringify(t),display=name(t);assert.equal(JSON.stringify(t),snapshot);if(!t.setId){assert.equal(display,t.name);continue;}
 assert(display.startsWith(sets.get(t.setId)+'·'));assert.equal(display.split('·').length,2);if(display!==t.name)changed++;
 const it=applyEquipmentTemplate({...E.item(t.slot,90,t.setId,3,{originRace:t.originRace}),templateId:undefined},t.id);assert(it&&validEquipmentTemplateMetadata(it));assert.equal(name(it),display);assert.equal(it.name,t.name,'stored historical identity remains exact');
 const old=structuredClone(it);delete old.templateId;assert.equal(name(old),display);assert.equal(name({...old,name:display}),display,'no duplicate prefix');assert.equal(equipmentNameFromReceipt(t.name),display);assert.equal(name({...it,legendaryId:'test-legend'}),it.name,'legendary excluded');
 const s=E.fresh(t.originRace);s.inventory=[it];s.equip[t.slot]=it.id;assert(E.validSave(s));const raw=JSON.stringify(s);
 const ctx={bagTab:'equipment',bagSlot:t.slot,bagSort:'quality',selected:it.id,sortedGear:()=>s.inventory,itemDetail:()=>'',potionView:()=>'',materialGrid:()=>''};
 for(const render of [renderInventory,renderPixelInventory])assert(render(s,ctx).includes(display));assert.equal(JSON.stringify(s),raw);
 s.lootHistory={version:1,records:[{id:'old-set-receipt',at:1,mode:'dungeon',node:'旧副本',region:'旧地区',floor:0,stage:3,gold:0,xp:0,drops:[{kind:'equipment',name:it.name,quality:3,quantity:1,level:90,outcome:'received'}]}]};assert(validLootHistory(s));const stored=JSON.stringify(s);assert(renderLootHistory(s).includes(display));assert.equal(JSON.stringify(s),stored);
 assert(renderCasinoReceipt({revision:1,outcome:'same',inputKind:'equipment',inputName:it.name,rewardName:it.name,fromQuality:3,toQuality:3,rewardId:it.id}).includes(display));
}
assert.equal(changed,53);assert.equal(name({name:'自定旧名',set:'human_blood_oath',slot:'helm'}),'赤痕誓约·自定旧名');assert.equal(name({name:'自定旧名',set:'unknown',slot:'helm'}),'自定旧名');assert.equal(equipmentNameFromReceipt('赤痕盔的故事'),'赤痕盔的故事');assert.equal(name({name:'王统·初炉誓锤',legendaryId:'first-forge-oathhammer'}),'王统·初炉誓锤');assert.equal(name({name:'药水'}),'药水');assert.equal(name(null),'');
const s=E.fresh('human');for(const t of templates.filter(t=>t.originRace==='human')){const it=E.item(t.slot,90,t.setId,3,{originRace:'human'});s.inventory.push(it);}s.equip.helm=s.inventory[0].id;assert(E.validSave(s));mkdirSync('qa/v087-set-names',{recursive:true});writeFileSync('qa/v087-set-names/legacy-human-set-save.json',JSON.stringify(s));
console.log('PASS all 60 pieces / 15 sets, 53 differ from frozen raw names, all five races, generated and legacy item identities unmutated, inventory/equipment slots/accessible labels, old loot and casino receipts, duplicate-prefix protection, non-set/legendary unchanged.');

assert(!/[a-zA-Z]equipmentDisplayName/.test(readFileSync('dist/app.js','utf8')),'no identifier substring rewrites');
