import {fresh,validSave,grantDevelopmentSupport,effectiveLuck} from './engine.js';
export const SAVE_KEY='ashencrown-v2';
export const LEGACY_KEY='ashencrown-v1';
export const BACKUP_PREFIX='ashencrown-backup-';
export function backupRaw(storage,raw,label='manual'){
  if(!raw)return null;
  let suffix=0,key=BACKUP_PREFIX+label+'-'+Date.now();
  while(storage.getItem(key+(suffix?'-'+suffix:''))!==null)suffix++;
  key+=suffix?'-'+suffix:'';
  storage.setItem(key,raw);
  return key;
}
export function loadProgress(storage){
  const raw=storage.getItem(SAVE_KEY);
  if(raw){try{const game=JSON.parse(raw);if(validSave(game)&&game.developmentEquipmentSandbox!==true)return {game,notice:null};}catch{}
    const backup=backupRaw(storage,raw,'recovery');
    return {game:fresh(),notice:'当前存档格式异常，原始数据已保留为可导出的恢复备份。',backup};
  }
  return {game:fresh(),notice:storage.getItem(LEGACY_KEY)?'装备系统已升级至 v0.4，新旅程已开启。旧版原始存档完整保留，可在设置中导出。':null};
}
export function listBackups(storage){
  const out=[];
  if(storage.getItem(LEGACY_KEY)!==null)out.push({key:LEGACY_KEY,label:'v0.3 及以前原始存档'});
  for(let i=0;i<storage.length;i++){const key=storage.key(i);if(key?.startsWith(BACKUP_PREFIX))out.push({key,label:key.includes('recovery')?'格式异常恢复备份':'手动操作前备份'});}
  return out;
}

export function applySupportGrant(storage,game){const next=JSON.parse(JSON.stringify(game));if(!grantDevelopmentSupport(next))return {game,granted:false};try{storage.setItem(SAVE_KEY,JSON.stringify(next));return {game:next,granted:true};}catch{return {game,granted:false,failed:true};}}

// User-visible resource operations commit storage before adopting their candidate.
// A rejected operation may still carry a legitimate automatic merchant refresh.
export function commitGameTransaction(storage,game,operation,{commitOnNoop=false,now=Date.now()}={}){
 let candidate,value;
 try{candidate=structuredClone(game);value=operation(candidate);}catch{return {ok:false,game,value:null,reason:'operation'};}
 if(!value&&!commitOnNoop)return {ok:false,game,value,reason:'rejected'};
 if(!Number.isFinite(now)||now<0)return {ok:false,game,value:null,reason:'operation'};
 candidate.lastSeen=now;candidate.offlineLuck=effectiveLuck(candidate);
 try{storage.setItem(SAVE_KEY,JSON.stringify(candidate));}catch{return {ok:false,game,value:null,reason:'storage'};}
 return {ok:true,game:candidate,value,reason:null};
}

// Explicit user action only. Keep the rollback snapshot in memory, never as a backup key.
export function clearAndRestartNoBackup(storage,freshState,{now=Date.now()}={}){
 let candidate,raw;
 try{
  if(!Number.isFinite(now)||now<0)throw Error('Invalid clock');
  candidate=structuredClone(freshState);candidate.lastSeen=now;candidate.offlineLuck=effectiveLuck(candidate);
  if(!validSave(candidate)||candidate.developmentEquipmentSandbox===true)throw Error('Invalid fresh save');
  raw=JSON.stringify(candidate);
 }catch{return {ok:false,reason:'invalid-candidate',rollbackFailed:false};}
 const snapshot=new Map();
 try{
  const keys=new Set([SAVE_KEY,LEGACY_KEY]);
  for(let i=0;i<storage.length;i++){const key=storage.key(i);if(typeof key==='string'&&key.startsWith(BACKUP_PREFIX))keys.add(key);}
  for(const key of keys)snapshot.set(key,storage.getItem(key));
 }catch{return {ok:false,reason:'storage-read',rollbackFailed:false};}
 try{
  storage.setItem(SAVE_KEY,raw);
  for(const [key,value]of snapshot)if(key!==SAVE_KEY&&value!==null)storage.removeItem(key);
  return {ok:true,game:candidate,reason:null,rollbackFailed:false};
 }catch{
  let rollbackFailed=false;
  for(const [key,value]of snapshot){try{if(storage.getItem(key)===value)continue;if(value===null)storage.removeItem(key);else storage.setItem(key,value);}catch{rollbackFailed=true;}}
  for(const [key,value]of snapshot){try{if(storage.getItem(key)!==value)rollbackFailed=true;}catch{rollbackFailed=true;}}
  return {ok:false,reason:'storage',rollbackFailed};
 }
}
