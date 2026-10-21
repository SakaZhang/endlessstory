import {fresh,validSave,grantDevelopmentSupport} from './engine.js';
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
  if(raw){try{const game=JSON.parse(raw);if(validSave(game))return {game,notice:null};}catch{}
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
