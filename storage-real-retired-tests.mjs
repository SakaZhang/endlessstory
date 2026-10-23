import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadProgress,SAVE_KEY} from './dist/storage.js';
import {validSave} from './dist/engine.js';
// Actual historical factories, not a current save with its version hand-edited.
for(const commit of ['cd8bd18','6f4d3172cc52a84c11b09a17c71d999daebd5e92']){
 const dir=mkdtempSync(join(tmpdir(),'retired-save-'));
 try{
  const archive=execFileSync('git',['archive',commit,'dist'],{maxBuffer:64*1024*1024});execFileSync('tar',['-xf','-','-C',dir],{input:archive});writeFileSync(join(dir,'package.json'),'{"type":"module"}');
  const script="import * as E from './dist/engine.js';const s=E.fresh();s.gold=123456;console.log(JSON.stringify(s));";
  const raw=execFileSync(process.execPath,['--input-type=module','-e',script],{cwd:dir,encoding:'utf8'}).trim();assert.equal(JSON.parse(raw).gold,123456);
  const map=new Map([['ashencrown-v2',raw],['ashencrown-v1',raw],['ashencrown-backup-history',raw],['another-game',raw]]);
  const storage={get length(){return map.size},key:i=>[...map.keys()][i],getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k),clear(){throw Error('Forbidden global clear')}};
  const result=loadProgress(storage);assert(!result.blocked);assert(validSave(result.game));assert.equal(result.game.gold,100);assert.equal(result.game.level,1);assert.equal(result.game.skillTree.mode,'active');assert.equal(result.game.version,3);assert(!('legacy' in result.game.skillTree));for(const k of ['ashencrown-v1','ashencrown-v2','ashencrown-backup-history'])assert(!map.has(k));assert.equal(map.get('another-game'),raw);
  const fresh=JSON.parse(map.get(SAVE_KEY));fresh.gold=117;storage.setItem(SAVE_KEY,JSON.stringify(fresh));const bytes=map.get(SAVE_KEY);assert.equal(loadProgress(storage).game.gold,117);assert.equal(map.get(SAVE_KEY),bytes);
 }finally{rmSync(dir,{recursive:true,force:true});}
}
console.log('PASS real retired factories: historical untyped starter and released v0441 reset once; only exact game keys cleared, current generation persists and unrelated bytes remain.');
