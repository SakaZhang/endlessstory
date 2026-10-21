// Stable identifiers for the three legacy fields/bosses and one approved
// three-encounter normal dungeon prototype, all in dwarf area 1.
export const AREAS=Object.freeze({
 'dwarf-blackforge-1':Object.freeze({id:'dwarf-blackforge-1',race:'dwarf',name:'黑炉边境',levelRange:Object.freeze([1,10])})
});
export const SITES=Object.freeze([
 {id:'blackforge-road',legacyIndex:0,gearLevel:3,areaId:'dwarf-blackforge-1',name:'失落驿道'},
 {id:'blackforge-mine',legacyIndex:1,gearLevel:6,areaId:'dwarf-blackforge-1',name:'熄火矿井'},
 {id:'blackforge-grave',legacyIndex:2,gearLevel:9,areaId:'dwarf-blackforge-1',name:'旧誓墓园'}
].map(Object.freeze));
export const INSTANCES=Object.freeze(Object.fromEntries([
 ...SITES.flatMap(site=>[
  {id:site.id+'-field',siteId:site.id,areaId:site.areaId,kind:'field',enabled:true},
  {id:site.id+'-boss',siteId:site.id,areaId:site.areaId,kind:'boss',enabled:true}
 ]),
 {id:'dwarf-blackforge-1-dungeon',siteId:'blackforge-mine',areaId:'dwarf-blackforge-1',kind:'dungeon',enabled:true,name:'熄火矿井 · 普通副本'}
].map(instance=>[instance.id,Object.freeze(instance)])));
export function resolveLegacySite(value){
 return typeof value==='number'?SITES.find(s=>s.legacyIndex===value)??null:SITES.find(s=>s.id===value)??null;
}
export function instanceCooldownMs(instance){
 const kind=typeof instance==='string'?INSTANCES[instance]?.kind:instance?.kind;
 return kind==='dungeon'?300000:kind==='boss'?1800000:0;
}
// Pure routing policy: never returns a boss, and never starts combat or heals.
// registry argument supports testing confirmed rules against synthetic content.
export function pickRoute(expedition,cooldowns,now,registry=INSTANCES){
 if(!expedition||!Number.isFinite(now)||now<0)return null;
 const field=registry[expedition.fieldId];
 if(!field?.enabled||field.kind!=='field')return null;
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
