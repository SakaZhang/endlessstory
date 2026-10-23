// Stable identifiers for the three legacy fields/bosses and one approved
// three-encounter normal dungeon prototype, all in dwarf area 1.
export const LEGACY_AREAS=Object.freeze({
 'dwarf-blackforge-1':Object.freeze({id:'dwarf-blackforge-1',race:'dwarf',number:1,name:'黑炉边境',levelRange:Object.freeze([1,10])})
});
export const SITES=Object.freeze([
 {id:'blackforge-road',legacyIndex:0,gearLevel:3,areaId:'dwarf-blackforge-1',name:'失落驿道'},
 {id:'blackforge-mine',legacyIndex:1,gearLevel:6,areaId:'dwarf-blackforge-1',name:'熄火矿井'},
 {id:'blackforge-grave',legacyIndex:2,gearLevel:9,areaId:'dwarf-blackforge-1',name:'旧誓墓园'}
].map(Object.freeze));
export const LEGACY_INSTANCES=Object.freeze(Object.fromEntries([
 ...SITES.flatMap(site=>[
  {id:site.id+'-field',siteId:site.id,areaId:site.areaId,kind:'field',enabled:true},
  {id:site.id+'-boss',siteId:site.id,areaId:site.areaId,kind:'boss',enabled:true}
 ]),
 {id:'dwarf-blackforge-1-dungeon',siteId:'blackforge-mine',areaId:'dwarf-blackforge-1',kind:'dungeon',enabled:true,name:'熄火矿井 · 普通副本'}
].map(instance=>[instance.id,Object.freeze(instance)])));
export const PLANNED_AREAS=Object.freeze(Object.fromEntries(['山麓矿道','岩蜥支洞','旧矿与石牌遗址','废炉外坡','冷泉与炉区交界','地下炉池','银纹矿廊','深脉裂谷','晶脉深层','地心锻造遗址'].map((name,i)=>{const number=i+1,id='dwarf.a'+String(number).padStart(2,'0');return [id,Object.freeze({id,race:'dwarf',number,name,levelRange:[i*10+1,number*10]})]})));
export const PLANNED_SITES=Object.freeze(Object.values(PLANNED_AREAS).map(a=>Object.freeze({id:a.id,areaId:a.id,legacyIndex:a.number-1,gearLevel:(a.number-1)*10+5,name:a.name})));
export const PLANNED_INSTANCES=Object.freeze(Object.fromEntries(PLANNED_SITES.flatMap(site=>['field','dungeon',...(['dwarf.a03','dwarf.a06','dwarf.a09','dwarf.a10'].includes(site.id)?['boss']:[])].map(kind=>{const id=site.id+'.'+kind;return [id,Object.freeze({id,siteId:site.id,areaId:site.areaId,kind,enabled:true,contentVersion:'dwarf-m2-v1',name:site.name+' · '+({field:'野外',dungeon:'普通副本',boss:'首领副本'}[kind])})]}))));
export const AREAS=Object.freeze({...LEGACY_AREAS,...PLANNED_AREAS});
export const INSTANCES=Object.freeze({...LEGACY_INSTANCES,...PLANNED_INSTANCES});
export function resolveLegacySite(value){
 return typeof value==='number'?SITES.find(s=>s.legacyIndex===value)??null:[...SITES,...PLANNED_SITES].find(s=>s.id===value)??null;
}
export function instanceCooldownMs(instance){
 const kind=typeof instance==='string'?INSTANCES[instance]?.kind:instance?.kind;
 return kind==='dungeon'?300000:kind==='boss'?1800000:0;
}
// Pure routing policy. Optional current-area automation never interrupts an active encounter.
// registry argument supports testing confirmed rules against synthetic content.
export function pickRoute(expedition,cooldowns,now,registry=INSTANCES){
 if(!expedition||!Number.isFinite(now)||now<0)return null;
 const field=registry[expedition.fieldId];
 if(!field?.enabled||field.kind!=='field')return null;
 if(expedition.autoBoss===true||expedition.autoDungeon===true){
  for(const kind of ['boss','dungeon']){
   if(!(kind==='boss'?expedition.autoBoss:expedition.autoDungeon))continue;
   const target=Object.values(registry).find(n=>n.enabled&&n.areaId===field.areaId&&n.kind===kind);
   if(target&&now>=(cooldowns?.[target.id]??0))return target;
  }
  return field;
 }
 if(expedition.mode==='dungeon'){
  const target=registry[expedition.targetInstanceId];
  if(target?.enabled&&target.kind==='dungeon'){
   if(now>=(cooldowns?.[target.id]??0))return target;
   return expedition.loop?field:null;
  }
  return null;
 }
 return field;
}
export function areaGearLevel(instanceId){
 const instance=INSTANCES[instanceId],site=resolveLegacySite(instance?.siteId);
 if(!site)return null;
 const [min,max]=AREAS[site.areaId].levelRange;
 return Math.max(min,Math.min(max,site.gearLevel));
}

export const RACE_KEYS=Object.freeze(['human','dwarf','elf','goblin','ashen']);
export function areaLevelRange(number){
 return Number.isInteger(number)&&number>=1&&number<=10?[(number-1)*10+1,number*10]:null;
}
