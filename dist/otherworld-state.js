import {hasCanonicalEpilogue} from './otherworld-gate.js';
// Optional generation-6 extension. World location/expedition stay untouched while active.
export const OTHERWORLD_PENDING_LIMIT=32;
export const OTHERWORLD_LOOT_POLICY=Object.freeze({equipmentLevel:100,gearPerWin:1,rarities:Object.freeze([1,2,3]),qualityWeights:Object.freeze([55,35,10]),setChance:.2,xp:108,gold:0,pendingLimit:32});
export const OTHERWORLD_MAX_FLOOR=Math.floor(Math.log(1e12/12000)/Math.log(1.01))+1;
export const OTHERWORLD_BASE=Object.freeze({hp:12000,atk:240,armor:60,basicIntervalMs:2200,elementalPower:0});
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
export function otherworldUnlocked(s){return hasCanonicalEpilogue(s); }
export function freshOtherworldState(){return {version:1,stoneGranted:false,stoneUsed:false,active:false,floor:1,highestCleared:0,autoAdvance:true,pendingEquipment:[]};}
export const OTHERWORLD_ELITE_MULTIPLIERS=Object.freeze({hp:1.25,atk:2,armor:1.1});
export function otherworldFloorStats(floor,{legacy=false}={}){if(!Number.isSafeInteger(floor)||floor<1||floor>OTHERWORLD_MAX_FLOOR)return null;const scale=1.01**(floor-1),elite=!legacy&&floor%50===0,m=elite?OTHERWORLD_ELITE_MULTIPLIERS:{hp:1,atk:1,armor:1};return {...OTHERWORLD_BASE,hp:Math.min(1e12,OTHERWORLD_BASE.hp*scale*m.hp),atk:OTHERWORLD_BASE.atk*scale*m.atk,armor:OTHERWORLD_BASE.armor*scale*m.armor,scale,elite};}
export function validOtherworldState(s,validateItem=()=>true){
 const o=s?.otherworld;if(o===undefined)return !s?.activeEncounter?.otherworld;
 if(!exact(o,['version','stoneGranted','stoneUsed','active','floor','highestCleared','autoAdvance','pendingEquipment'])||o.version!==1||!Array.isArray(o.pendingEquipment)||!['stoneGranted','stoneUsed','active','autoAdvance'].every(k=>typeof o[k]==='boolean')||!otherworldFloorStats(o.floor)||!Number.isSafeInteger(o.highestCleared)||o.highestCleared<0||o.highestCleared>OTHERWORLD_MAX_FLOOR||o.floor>o.highestCleared+1||o.stoneUsed&&!o.stoneGranted)return false;
 if((o.stoneGranted||o.active||o.highestCleared>0||o.pendingEquipment.length>0)&&!otherworldUnlocked(s))return false;
 if(!Array.isArray(o.pendingEquipment)||o.pendingEquipment.length>OTHERWORLD_PENDING_LIMIT||new Set(o.pendingEquipment.map(it=>it?.id)).size!==o.pendingEquipment.length||!o.pendingEquipment.every(it=>it&&validateItem(it)&&[1,2,3].includes(it.rarity)&&!it.legendaryId&&it.level===100&&it.baseLevel===100&&it.levelSource==='drop'&&!s.inventory?.some(x=>x.id===it.id)&&!s.rareRewardProgress?.pendingSets?.some(x=>x.id===it.id)&&s.pendingForgeClaim?.item?.id!==it.id))return false;
 const e=s.activeEncounter;
 if(e?.otherworld&&(!o.active||e.otherworld.floor!==o.floor||e.areaId!==s.race+'.a01'||e.rewarded!==false))return false;
 if(o.active&&(s.dungeonRun||s.story?.activeScene||e&&!e.otherworld))return false;
 return true;
}
export function normalizeOtherworldState(s){if(!validOtherworldState(s))return false;s.otherworld??=freshOtherworldState();return true;}
export function validOtherworldEncounter(e){
 if(e?.otherworld===undefined)return !e?.enemies?.some(u=>u.otherworldActor!==undefined||['otherworld-v081','otherworld-v090'].includes(u.parameterSetId));
 const t=e.otherworld,p=otherworldFloorStats(t?.floor,{legacy:t?.version===1}),u=e.enemies?.[0];
 return !!p&&exact(t,['version','floor'])&&[1,2].includes(t.version)&&e.contentVersion==='dwarf-m2-v1'&&e.kind==='field'&&!e.boss&&!e.fieldGroup&&!e.developmentFixture&&!e.storyScenario&&e.enemies.length===1&&e.rewardGold===OTHERWORLD_LOOT_POLICY.gold&&e.rewardXp===OTHERWORLD_LOOT_POLICY.xp&&e.clearRewards===undefined&&e.npcObjectiveReceipt===undefined&&e.legendaryDropReceipt===undefined&&(e.materialLoot===undefined||Array.isArray(e.materialLoot)&&e.materialLoot.length===0)&&u?.otherworldActor===true&&u.origin==='initial'&&!u.follower&&u.main===true&&u.name===(p.elite?'异界精英守卫':'异界守卫')+' · 第'+t.floor+'层'&&u.max===p.hp&&u.atk===p.atk&&u.armor===p.armor&&u.elementalPower===0&&u.basicIntervalMs===2200&&u.parameterSetId===(t.version===1?'otherworld-v081':'otherworld-v090')&&Object.keys(u.skillUses??{}).length===0&&Object.keys(u.skillOverrides??{}).length===0&&u.elementTags.length===0&&Object.values(u.elementResistance).every(n=>n===0)&&u.definitionId===e.rewardDefinitionId&&u.definitionId===e.areaId+'.normal.1'&&e.instanceId===e.areaId+'.field'&&/^(human|dwarf|elf|goblin|ashen)\.a01$/.test(e.areaId);
}
