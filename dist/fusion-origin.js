// Origin selection only. Does not roll quality/level/favor, consume inputs or mutate saves.
import {EQUIPMENT_TEMPLATES} from './equipment-templates.js';
const own=(object,key)=>Object.hasOwn(object,key);
function registry(templates){
 if(!Array.isArray(templates)||!templates.length)return null;
 const byId=Object.create(null),origins=new Set();
 for(const t of templates){if(!t||typeof t.id!=='string'||!t.id||typeof t.originRace!=='string'||!t.originRace||own(byId,t.id))return null;byId[t.id]=t;origins.add(t.originRace);}
 return {byId,origins};
}
export function fusionOriginTemplates(originRace,{slot,setId=null,templates=EQUIPMENT_TEMPLATES}={}){
 const reg=registry(templates);if(!reg||!reg.origins.has(originRace))return [];
 return templates.filter(t=>t.originRace===originRace&&(slot===undefined||t.slot===slot)&&(t.setId??null)===setId);
}
export function equipmentFusionOrigin(item,{templates=EQUIPMENT_TEMPLATES}={}){
 const reg=registry(templates);if(!reg||!item||typeof item!=='object'||Array.isArray(item))return null;
 let template=null;
 for(const key of ['templateId','visualVariant']){const id=item[key];if(id===undefined||id===null)continue;if(typeof id!=='string'||!own(reg.byId,id)||template&&template.id!==id)return null;template=reg.byId[id];}
 const stored=item.originRace;
 if(stored!==undefined&&stored!==null&&(typeof stored!=='string'||!reg.origins.has(stored)))return null;
 if(template&&stored!==undefined&&stored!==null&&stored!==template.originRace)return null;
 const origin=template?.originRace??stored??'dwarf';
 return reg.origins.has(origin)?origin:null;
}
export function fusionOriginWeights({heroRace,equipment=[]}={},options={}){
 if(!Array.isArray(equipment)||equipment.length>5)return null;
 const templates=options.templates??EQUIPMENT_TEMPLATES,reg=registry(templates);if(!reg)return null;
 if(!equipment.length)return typeof heroRace==='string'&&reg.origins.has(heroRace)?{[heroRace]:1}:null;
 const counts={},ids=new Set();
 for(const item of equipment){if(item?.id!==undefined){if(typeof item.id!=='string'||!item.id||ids.has(item.id))return null;ids.add(item.id);}const origin=equipmentFusionOrigin(item,{templates});if(origin===null)return null;counts[origin]=(counts[origin]??0)+1;}
 return counts;
}
export function chooseFusionOrigin(input,random=Math.random,options={}){
 const weights=fusionOriginWeights(input,options);if(!weights)return null;
 const entries=Object.entries(weights);if(entries.length===1)return entries[0][0];
 if(typeof random!=='function')return null;let roll;try{roll=random();}catch{return null;}
 if(!Number.isFinite(roll)||roll<0||roll>=1)return null;
 const total=entries.reduce((n,[,count])=>n+count,0);let at=roll*total;
 for(const [origin,count]of entries){if(at<count)return origin;at-=count;}
 return null;
}
