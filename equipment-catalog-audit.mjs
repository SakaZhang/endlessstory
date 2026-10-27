// Permanent matrix contract: totals alone are never evidence of slot parity.
import {EQUIPMENT_TEMPLATES,RACE_WEAPON_POOLS} from './dist/equipment-templates.js';
import {LEGENDARY_EQUIPMENT_DEFINITIONS} from './dist/legendary-equipment.js';
export const COMMON_SLOT_TARGETS=Object.freeze({weapon:16,helm:6,armor:6,gloves:6,boots:6,ring:6,amulet:6});
export const PARITY_RACES=Object.freeze(['dwarf','human','elf','goblin','ashen']);
export function auditEquipmentCatalog(templates=EQUIPMENT_TEMPLATES,legends=Object.values(LEGENDARY_EQUIPMENT_DEFINITIONS)){
 const errors=[],matrix={},check=(ok,message)=>{if(!ok)errors.push(message);};
 check(new Set(templates.map(t=>t.id)).size===templates.length,'duplicate template IDs');
 check(templates.every(t=>PARITY_RACES.includes(t.originRace)),'unknown race');
 for(const race of PARITY_RACES){
  const own=templates.filter(t=>t.originRace===race),ordinary=own.filter(t=>t.kind==='scatter'),common=ordinary.filter(t=>t.slot!=='core'),sets=own.filter(t=>t.kind==='set'),cores=ordinary.filter(t=>t.slot==='core'),native=RACE_WEAPON_POOLS[race];
  const slots=Object.fromEntries(Object.keys(COMMON_SLOT_TARGETS).map(slot=>[slot,common.filter(t=>t.slot===slot).length]));
  for(const [slot,target]of Object.entries(COMMON_SLOT_TARGETS))check(slots[slot]===target,`${race}.${slot}: ${slots[slot]} != ${target}`);
  check(common.length===52,`${race}: ordinary common total must be 52`);
  const families=Object.fromEntries(native.map(f=>[f,common.filter(t=>t.slot==='weapon'&&t.weaponType===f).length]));
  check(Object.values(families).every(n=>n===8),`${race}: each native weapon family must have eight`);
  check(common.filter(t=>t.slot==='weapon').every(t=>native.includes(t.weaponType)),`${race}: non-native ordinary weapon`);
  check(cores.length===(race==='ashen'?3:0),`${race}: unexpected ordinary cores`);
  const setIds=[...new Set(sets.map(t=>t.setId))];check(setIds.length===3&&sets.length===12,`${race}: three four-part sets required`);
  for(const id of setIds)for(const slot of ['helm','armor','gloves','boots'])check(sets.filter(t=>t.setId===id&&t.slot===slot).length===1,`${race}.${id}.${slot}: exactly one set part required`);
  const relics=legends.filter(t=>t.originRace===race);check(relics.length===(race==='ashen'?4:2),`${race}: legend count changed`);
  matrix[race]={slots,nativeWeaponFamilies:families,common:common.length,extraCores:cores.length,setParts:sets.length,setIds,legends:relics.length};
 }
 const reserved=legends.filter(t=>t.questOnly);check(reserved.length===3&&['ashen-primal-core','return-ring','infinity-gauntlet'].every(id=>reserved.some(t=>t.id===id)),'non-random-drop legends changed');
 const neutral=legends.filter(t=>t.originRace===null);check(neutral.length===2&&neutral.every(t=>t.questOnly)&&neutral.some(t=>t.id==='return-ring'&&t.slot==='ring')&&neutral.some(t=>t.id==='infinity-gauntlet'&&t.slot==='gloves'),'only the approved two hidden-recipe legends are race-neutral');
 const totals={common:templates.filter(t=>t.kind==='scatter'&&t.slot!=='core').length,ordinary:templates.filter(t=>t.kind==='scatter').length,sets:templates.filter(t=>t.kind==='set').length,legends:legends.length,definitions:templates.length+legends.length};
 check(totals.common===260&&totals.ordinary===263&&totals.sets===60&&totals.legends===14&&totals.definitions===337,'catalog totals differ from approved contract');
 return {passed:!errors.length,errors,matrix,totals,reservedNonDrop:reserved.map(t=>t.id)};
}
if(process.argv[1]&&new URL(import.meta.url).pathname===process.argv[1]){
 const report=auditEquipmentCatalog();console.table(Object.fromEntries(Object.entries(report.matrix).map(([race,row])=>[race,{...row.slots,common:row.common,extraCores:row.extraCores,setParts:row.setParts,legends:row.legends}])));console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
}
