import {fresh,validSave,effectiveLuck} from './engine.js';
import {SCHEMA_VERSION,SAVE_KEY} from './save-generation.js';
export {SAVE_KEY} from './save-generation.js';
export const LEGACY_KEY='ashencrown-v1';
export const BACKUP_PREFIX='ashencrown-backup-';
export const RETIRED_SAVE_KEYS=Object.freeze(['ashencrown-v1','ashencrown-v2','ashencrown-v3']);
export const RETIRED_BACKUP_PREFIX='ashencrown-backup-';
const blockedStores=new WeakSet();
const validCurrent=game=>{try{return game?.version===SCHEMA_VERSION&&validSave(game)&&game.developmentEquipmentSandbox!==true;}catch{return false;}};
function retiredKeys(storage){
 const keys=new Set(RETIRED_SAVE_KEYS);
 for(let i=0;i<storage.length;i++){const key=storage.key(i);if(typeof key==='string'&&key.startsWith(RETIRED_BACKUP_PREFIX))keys.add(key);}
 return [...keys];
}
export function loadProgress(storage){
 let game=null,reason='storage-read',initialized=false;
 const fail=()=>{blockedStores.add(storage);return {game:game??fresh(),notice:'存档切代尚未完成，游戏已暂停。请检查浏览器存储后重试；无效新版存档可在设置中清空重开。',blocked:true,reason};};
 try{
  const raw=storage.getItem(SAVE_KEY),keys=retiredKeys(storage);
  if(raw!==null){reason='invalid-current-save';const parsed=JSON.parse(raw);if(!validCurrent(parsed))return fail();game=parsed;}
  else{game=fresh();game.lastSeen=Date.now();game.offlineLuck=effectiveLuck(game);if(!validCurrent(game)){game=null;reason='invalid-candidate';return fail();}reason='storage-write';storage.setItem(SAVE_KEY,JSON.stringify(game));initialized=true;}
  reason='storage-cleanup';for(const key of keys)if(storage.getItem(key)!==null)storage.removeItem(key);
  blockedStores.delete(storage);return {game,initialized,notice:initialized?'已启用新版独立存档；旧开发进度及备份已清除。':null,blocked:false,reason:null};
 }catch{return fail();}
}
// User-visible resource operations commit storage before adopting their candidate.
// A rejected operation may still carry a legitimate automatic merchant refresh.
export function commitGameTransaction(storage,game,operation,{commitOnNoop=false,now=Date.now()}={}){
 if(blockedStores.has(storage))return {ok:false,game,value:null,reason:'storage-blocked'};
 let candidate,value;
 try{candidate=structuredClone(game);value=operation(candidate);}catch{return {ok:false,game,value:null,reason:'operation'};}
 if(!value&&!commitOnNoop)return {ok:false,game,value,reason:'rejected'};
 if(!Number.isFinite(now)||now<0)return {ok:false,game,value:null,reason:'operation'};
 candidate.lastSeen=now;candidate.offlineLuck=effectiveLuck(candidate);
 if(candidate?.version!==SCHEMA_VERSION)return {ok:false,game,value:null,reason:'invalid-candidate'};
 try{storage.setItem(SAVE_KEY,JSON.stringify(candidate));}catch{return {ok:false,game,value:null,reason:'storage'};}
 return {ok:true,game:candidate,value,reason:null};
}

// Explicit user action only. Roll back current-generation data only; never recreate retired saves.
export function clearAndRestartNoBackup(storage,freshState,{now=Date.now()}={}){
 let candidate,raw;
 try{
  if(!Number.isFinite(now)||now<0)throw Error('Invalid clock');
  candidate=structuredClone(freshState);candidate.lastSeen=now;candidate.offlineLuck=effectiveLuck(candidate);
  if(!validCurrent(candidate))throw Error('Invalid fresh save');
  raw=JSON.stringify(candidate);
 }catch{return {ok:false,reason:'invalid-candidate',rollbackFailed:false};}
 const snapshot=new Map();let retired=[];
 try{
  retired=retiredKeys(storage);const keys=new Set([SAVE_KEY]);
  for(const key of keys)snapshot.set(key,storage.getItem(key));
 }catch{return {ok:false,reason:'storage-read',rollbackFailed:false};}
 try{
  storage.setItem(SAVE_KEY,raw);
  for(const key of retired)if(storage.getItem(key)!==null)storage.removeItem(key);
  blockedStores.delete(storage);return {ok:true,game:candidate,reason:null,rollbackFailed:false};
 }catch{
  let rollbackFailed=false;
  for(const [key,value]of snapshot){try{if(storage.getItem(key)===value)continue;if(value===null)storage.removeItem(key);else storage.setItem(key,value);}catch{rollbackFailed=true;}}
  for(const [key,value]of snapshot){try{if(storage.getItem(key)!==value)rollbackFailed=true;}catch{rollbackFailed=true;}}
  blockedStores.add(storage);return {ok:false,reason:'storage',rollbackFailed};
 }
}
