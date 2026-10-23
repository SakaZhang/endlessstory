import {POTION_IMPORT_MATERIALS} from './potion-catalog.js';
import {DWARF_MONSTER_INFO,DWARF_MATERIALS,DWARF_MATERIAL_REGISTRY,DWARF_SOURCE_NODES,getDwarfMaterialPool,resolveDwarfMaterialId,toDwarfInventoryKey} from './dwarf-material-catalog.js';
import {INSTANCES,SITES} from './location-schema.js';
const freeze=x=>{Object.values(x).forEach(v=>{if(v&&typeof v==='object')freeze(v)});return Object.freeze(x)};
const common=[{name:'普通攻击',description:'造成物理伤害。'},{name:'蓄力重击',description:'准备后发动更强的物理攻击，可被打断。'}];
const defs=[
 ['grayflag-raider','灰旗劫掠者',0,false,['blackforge-road-field']],
 ['grayflag-vorn','灰旗首领 · 沃恩',0,true,['blackforge-road-boss']],
 ['rogue-mine-golem','失控矿傀',1,false,['blackforge-mine-field','dwarf-blackforge-1-dungeon']],
 ['furnace-warden','炉心守卫 · 断铸',1,true,['blackforge-mine-boss']],
 ['oathless-soldier','失誓卫兵',2,false,['blackforge-grave-field']],
 ['oathkeeper-morl','守誓者 · 莫尔',2,true,['blackforge-grave-boss']],
 ['rogue-mine-golem-elite','失控矿傀 · 精英',1,false,['dwarf-blackforge-1-dungeon']]
];
const legacyMonsters=Object.fromEntries(defs.map(([id,name,location,boss,sources])=>[id,{id,name,location,boss,elite:id.endsWith('-elite'),sources,elementTags:location===1?['earth','fire']:location===2?['dark']:[],skills:[...common,...(location===1?[{name:'矿炉余火',description:'周期性施加火焰灼烧。'}]:location===2?[{name:'失誓诅咒',description:'周期性施加虚弱。'}]:[])],traits:[],prototype:true}]));
export const MONSTER_CATALOG=freeze({...legacyMonsters,...Object.fromEntries(DWARF_MONSTER_INFO.map(m=>[m.id,{...m,location:m.area-1,boss:m.rank==='boss',elite:m.rank==='elite',prototype:false}]))});
export const MONSTER_MATERIALS=freeze({...DWARF_MATERIAL_REGISTRY,...DWARF_MATERIALS,...POTION_IMPORT_MATERIALS});
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const validId=id=>Object.hasOwn(MONSTER_CATALOG,id);
export function validMonsterLedger(s){const l=s?.monsterLedger;return l===undefined||plain(l)&&l.version===1&&plain(l.encountered)&&Object.entries(l.encountered).every(([id,v])=>validId(id)&&v===true);}
export function inferEncounterMonsterIds(e){
 if(plain(e)&&e.contentVersion==='dwarf-m2-v1'&&!e.developmentFixture&&!e.developmentTest&&!e.testEncounter&&Array.isArray(e.enemies)){
  return [...new Set(e.enemies.filter(u=>plain(u)&&u.origin!=='summoned').map(u=>({id:u.codexDefinitionId??u.leaderDefinitionId??u.definitionId??u.monsterId,source:u.sourceInstanceId??e.instanceId})).filter(({id,source})=>validId(id)&&INSTANCES[source]?.enabled&&MONSTER_CATALOG[id].sources.includes(source)).map(({id})=>id))];
 }
 if(!plain(e)||e.developmentFixture||e.developmentTest||e.testEncounter||typeof e.boss!=='boolean'||![0,1,2].includes(e.location)||typeof e.name!=='string'||!Number.isFinite(e.hp)||e.hp<0||!Number.isFinite(e.max)||e.max<=0)return [];
 const instance=INSTANCES[e.instanceId??(SITES[e.location]?.id+(e.boss?'-boss':'-field'))];if(!instance?.enabled)return [];
 const validForSource=id=>validId(id)&&MONSTER_CATALOG[id].sources.includes(instance.id);
 if(Array.isArray(e.enemies)){return [...new Set(e.enemies.filter(x=>plain(x)&&x.origin!=='summoned').filter(x=>{const id=x.monsterId??x.definitionId,source=x.sourceInstanceId??instance.id;return validId(id)&&INSTANCES[source]?.enabled&&MONSTER_CATALOG[id].sources.includes(source);}).map(x=>x.monsterId??x.definitionId))];}
 const id=e.boss?['grayflag-vorn','furnace-warden','oathkeeper-morl'][e.location]:e.kind==='dungeon'&&e.dungeonStage===3?'rogue-mine-golem-elite':['grayflag-raider','rogue-mine-golem','oathless-soldier'][e.location];return validForSource(id)?[id]:[];
}
export function normalizeMonsterLedger(s,{inferActive=true}={}){if(!plain(s)||!validMonsterLedger(s))return false;s.monsterLedger??={version:1,encountered:{}};if(inferActive&&s.activeEncounter&&!s.activeEncounter.rewarded)recordEncounteredMonsters(s,s.activeEncounter);return true;}
export function recordEncounteredMonsters(s,e){if(!plain(s)||!validMonsterLedger(s))return [];s.monsterLedger??={version:1,encountered:{}};const fresh=[];for(const id of inferEncounterMonsterIds(e)){if(!s.monsterLedger.encountered[id]){s.monsterLedger.encountered[id]=true;fresh.push(id);}}return fresh;}
export function monsterCodexEntry(s,id){if(!validId(id))return null;return s?.monsterLedger?.encountered?.[id]===true?{...structuredClone(MONSTER_CATALOG[id]),encountered:true}:{id,encountered:false};}
export function monsterMaterialPool(id,instanceId){
 const m=MONSTER_CATALOG[id],instance=INSTANCES[instanceId];if(!m||!instance?.enabled||!m.sources.includes(instanceId))return [];
 const actual=getDwarfMaterialPool(id,instanceId);if(actual)return [...new Set(actual.channels.flatMap(c=>c.entries.map(row=>toDwarfInventoryKey(row.materialId))))];
 return [[ '铁屑','炉火晶','誓约残片'][m.location],...(instance.kind!=='boss'?['灰根草']:[])];
}
export function materialMonsterSources(s,material){
 const canonical=resolveDwarfMaterialId(material);if(!canonical)return [];
 return Object.values(MONSTER_CATALOG).flatMap(m=>m.sources.filter(id=>monsterMaterialPool(m.id,id).some(key=>resolveDwarfMaterialId(key)===canonical)).map(instanceId=>{const i=INSTANCES[instanceId],site=SITES.find(x=>x.id===i?.siteId),node=DWARF_SOURCE_NODES[instanceId],known=s?.monsterLedger?.encountered?.[m.id]===true;return {monsterId:m.id,monsterName:known?m.name:'未知怪物',encountered:known,instanceId,siteId:i?.siteId,areaId:i?.areaId??node?.areaId,location:site?.legacyIndex??m.location,kind:i?.kind??node?.kind,available:!!i?.enabled&&!!node,historical:!node,sourceName:i?.name??node?.name??(site?.name??'旧原型地点')+(i?.kind==='boss'?' · 首领':' · 野外')};}));
}
