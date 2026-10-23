import {INSTANCES,AREAS,PLANNED_INSTANCES} from './location-schema.js';
import {MATERIAL_CATALOG as DWARF_MATERIALS,resolveMaterialId as resolveDwarfMaterialId} from './material-catalog.js';
const safeId=id=>typeof id==='string'&&id.length>0&&id.length<=160&&/^[a-zA-Z0-9_.-]+$/.test(id)&&!['__proto__','constructor','prototype'].includes(id);
const favorites=v=>Array.isArray(v)&&v.length<=1000&&new Set(v).size===v.length&&Array.from(v).every(safeId);
const ids=(v,registry)=>Array.isArray(v)&&v.length<=Object.keys(registry).length&&new Set(v).size===v.length&&Array.from(v).every(id=>typeof id==='string'&&Object.hasOwn(registry,id));
export function validRegionNavigation(s){
 const n=s?.regionNavigation;if(n===undefined)return true;
 return !!n&&typeof n==='object'&&!Array.isArray(n)&&Object.keys(n).length===4&&n.version===1&&ids(n.exploredNodeIds,INSTANCES)&&favorites(n.favoriteNodeIds)&&ids(n.discoveredMaterialIds,DWARF_MATERIALS);
}
export function normalizeRegionNavigation(s){
 if(!validRegionNavigation(s))return false;
 if(s.regionNavigation!==undefined)return true;
 const found=new Set();
 for(const [key,count] of Object.entries(s.materialStacks??s.materials??{}))if(Number.isFinite(count)&&count>0){const id=resolveDwarfMaterialId(key.split('|')[0]);if(id)found.add(id);}
 const e=s.activeEncounter,explored=e&&!e.developmentFixture&&!e.rewarded&&Object.hasOwn(INSTANCES,e.instanceId)&&e.areaId===INSTANCES[e.instanceId].areaId?[e.instanceId]:[];
 s.regionNavigation={version:1,exploredNodeIds:explored,favoriteNodeIds:[],discoveredMaterialIds:[...found].sort()};return true;
}
export function getRegionNavigation(s){
 const n=s?.regionNavigation;
 if(!validRegionNavigation(s))return null;
 const state=n??{version:1,exploredNodeIds:[],favoriteNodeIds:[],discoveredMaterialIds:[]};
 return {...structuredClone(state),exploredAreaIds:[...new Set(state.exploredNodeIds.map(id=>INSTANCES[id].areaId))],discoveryLedger:{version:1,discovered:Object.fromEntries(state.discoveredMaterialIds.map(id=>[id,true]))}};
}
export function recordNodeExplored(s,e){
 if(!e||e.developmentFixture===true||s.activeEncounter!==e||!Object.hasOwn(INSTANCES,e.instanceId)||e.areaId!==INSTANCES[e.instanceId].areaId||!normalizeRegionNavigation(s))return false;
 const list=s.regionNavigation.exploredNodeIds;if(!list.includes(e.instanceId))list.push(e.instanceId);return true;
}
export function recordMaterialDiscovered(s,key){
 const id=resolveDwarfMaterialId(key);if(!id||!normalizeRegionNavigation(s))return false;
 const materialCount=Object.entries(s.materialStacks??s.materials??{}).reduce((n,[k,v])=>resolveDwarfMaterialId(k.split('|')[0])===id&&Number.isFinite(v)&&v>0?n+v:n,0);
 if(materialCount<=0)return false;
 const list=s.regionNavigation.discoveredMaterialIds;if(!list.includes(id))list.push(id);return true;
}
export function toggleFavoriteNode(s,nodeId){return setFavoriteNode(s,nodeId,!s.regionNavigation?.favoriteNodeIds?.includes(nodeId));}

export function setFavoriteNode(s,nodeId,desired){
 if(typeof desired!=='boolean'||!safeId(nodeId)||(desired&&!PLANNED_INSTANCES[nodeId]?.enabled)||!normalizeRegionNavigation(s))return false;
 const list=s.regionNavigation.favoriteNodeIds,index=list.indexOf(nodeId);if(desired&&index<0&&list.length>=1000)return false;if(desired&&index<0)list.push(nodeId);if(!desired&&index>=0)list.splice(index,1);return true;
}
