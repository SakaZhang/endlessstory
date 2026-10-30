import {MATERIALS,AFFIX_DEFS,SLOTS,item,rollMaterialFusionLevel,materialEntries,isProtected,isUniqueCraftedEquipment,canReceiveEquipment,validSave,normalizeCodexCollection,recordCollectedEquipment} from './engine.js';
import {createLegendaryEquipment} from './legendary-equipment.js';
import {noncombatRunning} from './noncombat-policy.js';
import {CASINO_COST,CASINO_MAX_WAGERS,casinoOutcome,normalizeCasinoState,validCasinoState,drawCasinoTicket} from './casino-state.js';
import {withMultiRng} from './multi-combat.js';
import {casinoHash} from './casino-state.js';
export {CASINO_COST,casinoOutcome} from './casino-state.js';
const bad=reason=>({ok:false,reason});
const protectedMaterial=m=>!m||m.uniqueHeld||m.unique||m.storyOnly||m.questOnly||m.locked||m.protected;
export function casinoEquipmentEligible(s,it){return !!it&&!it.locked&&!it.protected&&!it.unique&&!it.storyOnly&&!it.questOnly&&!it.legendaryId&&!isUniqueCraftedEquipment(it)&&!Object.values(s.equip??{}).includes(it.id)&&!isProtected(s,it.id)&&s.pendingForgeClaim?.item?.id!==it.id;}
export function casinoInputs(s){
 const materials=materialEntries(s).filter(row=>!protectedMaterial(MATERIALS[row.material])).map(row=>({kind:'material',id:row.key,name:MATERIALS[row.material]?.name??row.material,quality:row.quality,count:row.count,material:row.material}));
 const equipment=(s.inventory??[]).filter(it=>casinoEquipmentEligible(s,it)).map(it=>({kind:'equipment',id:it.id,name:it.name,quality:it.rarity,count:1,slot:it.slot,level:it.level,item:it}));
 return [...materials,...equipment];
}
export function casinoAvailability(s){
 if(!validCasinoState(s))return 'invalid-state';
 if(s.developmentEquipmentSandbox||noncombatRunning(s)||s.activeEncounter&&!s.activeEncounter.done||s.dungeonRun)return 'combat';
 if(s.pendingForgeClaim||s.pendingReforge)return 'pending-operation';
 if((s.casino?.revision??0)>=CASINO_MAX_WAGERS)return 'limit';
 if(!Number.isFinite(s.gold)||s.gold<CASINO_COST)return 'gold';
 return null;
}
function removeInput(s,row){if(row.kind==='material')s.materialStacks[row.id]--;else s.inventory=s.inventory.filter(it=>it.id!==row.id);}
function fingerprint(s,row){return JSON.stringify({input:row.kind==='equipment'?row.item:{key:row.id,count:row.count},gold:s.gold,revision:s.casino?.revision??0,rng:s.casino?.rng??null});}
export function quoteCasino(s,selection,{afterBattle=false}={}){
 const reason=casinoAvailability(s);const queued=reason==='combat'&&afterBattle&&s.running&&!s.developmentEquipmentSandbox&&!s.activeEncounter?.developmentFixture&&!s.activeEncounter?.storyScenario;
 if(reason&&!queued)return bad(reason);
 if(queued&&(s.pendingForgeClaim||s.pendingReforge))return bad('pending-operation');
 if(queued&&(s.casino?.revision??0)>=CASINO_MAX_WAGERS)return bad('limit');
 if(queued&&s.gold<CASINO_COST)return bad('gold');
 const row=casinoInputs(s).find(r=>r.kind===selection?.kind&&r.id===selection.id);if(!row)return bad('input');
 // Reserve every possible output before any RNG or charge, even if the necklace
 // is unlikely. Filters never discard a paid casino return.
 const after=structuredClone(s);removeInput(after,row);
 if(!canReceiveEquipment(after,'amulet'))return bad('amulet-capacity');
 if(SLOTS.filter(slot=>slot!=='core'||s.race==='ashen').some(slot=>!canReceiveEquipment(after,slot)))return bad('equipment-capacity');
 return {ok:true,version:1,kind:row.kind,id:row.id,name:row.name,quality:row.quality,cost:CASINO_COST,revision:s.casino?.revision??0,fingerprint:fingerprint(s,row)};
}
// Caller must persist by clone/save/adopt. This also stages internally so direct
// rejected calls never charge, mutate RNG, consume an input or partially reward.
export function wagerCasino(s,quote,{now=Date.now()}={}){
 if(!quote?.ok||!validSave(s)||!Number.isSafeInteger(now)||now<0||now>1e15)return null;
 const current=quoteCasino(s,quote);if(!current.ok||JSON.stringify(current)!==JSON.stringify(quote))return null;
 const next=structuredClone(s);if(!normalizeCasinoState(next)||!normalizeCodexCollection(next))return null;
 const row=casinoInputs(next).find(r=>r.kind===quote.kind&&r.id===quote.id),outcome=casinoOutcome(drawCasinoTicket(next.casino));
 const quality=outcome==='upgrade'?Math.min(3,row.quality+1):outcome==='downgrade'?Math.max(0,row.quality-1):row.quality;
 let rewardId,rewardName;
 removeInput(next,row);next.gold-=CASINO_COST;next.casino.revision++;
 if(outcome==='legendary'){
  rewardId='casino-lucky-dice-'+next.casino.rng.toString(16)+'-'+next.casino.revision;
  if(next.inventory.some(it=>it.id===rewardId))return null;
  const context={id:rewardId,rngState:casinoHash(row.id+'|'+next.casino.rng+'|'+next.casino.revision),rngDraws:0,itemSerial:0};
  const item=withMultiRng(context,()=>{const level=row.kind==='equipment'?{level:row.item.level,baseLevel:row.item.level,levelSource:'equipment'}:rollMaterialFusionLevel(next.level);return createLegendaryEquipment({id:rewardId,legendaryId:'lucky-dice',...level,affixDefs:AFFIX_DEFS});});
  if(!item)return null;rewardName=item.name;next.inventory.push(item);recordCollectedEquipment(next,item);
 }else{
  const context={id:'casino-'+next.casino.rng.toString(16)+'-'+next.casino.revision,rngState:casinoHash(row.id+'|'+next.casino.rng+'|'+next.casino.revision),rngDraws:0,itemSerial:0};
  const slots=SLOTS.filter(slot=>slot!=='core'||next.race==='ashen');
  const generated=withMultiRng(context,()=>{const slot=slots[Math.floor(Math.random()*slots.length)],level=row.kind==='equipment'?{level:row.item.level,baseLevel:row.item.level,levelSource:'equipment'}:rollMaterialFusionLevel(next.level);return item(slot,level.level,null,quality,{...level,originRace:next.race,luck:0});});
  if(!generated||next.inventory.some(it=>it.id===generated.id))return null;
  rewardId=generated.id;rewardName=generated.name;next.inventory.push(generated);recordCollectedEquipment(next,generated);
 }
 const receipt={revision:next.casino.revision,at:now,outcome,inputKind:row.kind,inputId:row.id,inputName:row.name,fromQuality:row.quality,toQuality:outcome==='legendary'?4:quality,rewardId,rewardName};next.casino.lastReceipt=receipt;
 if(!validSave(next))return null;Object.assign(s,next);return structuredClone(receipt);
}
