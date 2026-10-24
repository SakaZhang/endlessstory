import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL,fileURLToPath} from 'node:url';
const root=process.env.REVIEW_REPO??fileURLToPath(new URL('.',import.meta.url));
const moduleURL=p=>pathToFileURL(root+'/dist/'+p).href;
const E=await import(moduleURL('engine.js'));
const S=await import(moduleURL('storage.js'));
const R=await import(moduleURL('race-registry.js'));
const T=await import(moduleURL('skill-tree-state.js'));
const old=readFileSync(new URL('./fixtures/live-v059-schema3-save.json',import.meta.url),'utf8').trim();
assert.equal(JSON.parse(old).version,3);assert.equal(JSON.parse(old).gold,98765);
assert.equal(E.SCHEMA_VERSION,5);assert.equal(S.SAVE_KEY,'ashencrown-v5');
const make=(initial=[],fail={})=>{const map=new Map(initial);return {map,get length(){return map.size},key:i=>[...map.keys()][i],getItem(k){if(fail.read)throw Error('read denied');return map.get(k)??null},setItem(k,v){if(fail.write)throw Error('quota');map.set(k,v)},removeItem(k){if(fail.remove)throw Error('remove denied');map.delete(k)},clear(){assert.fail('global clear forbidden')}}};
const retired=['ashencrown-v1','ashencrown-v2','ashencrown-v3','ashencrown-v4','ashencrown-backup-2026','ashencrown-backup-v3'];
const old4=readFileSync(new URL('./fixtures/pre-legend-reset-schema4-save.json',import.meta.url),'utf8').trim();
assert.equal(JSON.parse(old4).version,4);assert.equal(JSON.parse(old4).gold,76543);assert(!E.validSave(JSON.parse(old4)));
const safe=[['other-app','opaque bytes'],['ashencrown-custom-note','keep'],['ashencrown-v30','not an exact old save'],['backup-ashencrown','keep also']];
const st=make([...retired.map(k=>[k,k==='ashencrown-v4'?old4:old]),...safe]);
let result=S.loadProgress(st);assert.equal(result.blocked,false);assert.equal(result.game.gold,100);assert.equal(result.game.level,1);assert(E.validSave(result.game));assert(!E.validSave(JSON.parse(old)));
for(const k of retired)assert(!st.map.has(k),k+' retired');for(const [k,v]of safe)assert.equal(st.map.get(k),v,k+' untouched');
let committed=S.commitGameTransaction(st,result.game,s=>{s.gold=427;return true});assert(committed.ok);const persisted=st.map.get(S.SAVE_KEY);
for(let i=0;i<3;i++){const reload=await import(moduleURL('storage.js')+'?independentReload='+i);result=reload.loadProgress(st);assert.equal(result.blocked,false);assert.equal(result.game.gold,427);assert.equal(st.map.get(S.SAVE_KEY),persisted,'reload never resets or rewrites current');}
assert.equal(R.PLAYABLE_RACES.length,5);
for(const race of R.PLAYABLE_RACES){let s=E.fresh(race);assert(E.validSave(s),race);assert(E.validSave(JSON.parse(JSON.stringify(s))));assert.equal(s.version,5);const d=R.getSkillTreeDefinition(s);assert.equal(d.nodes.length,30,race);assert.equal(d.nodes.reduce((a,n)=>a+n.cost,0),99);assert(T.validSkillTreeConfig(d));assert.equal(s.skillTree.configId,d.id);assert.equal(s.skillTree.presets.length,3);assert(!('legacy'in s.skillTree));assert(s.skillTree.presets.every(p=>p.unlocked.length===0&&p.active.length===4&&p.passive.length===2));
 s.level=100;const dependent=d.nodes.find(n=>n.requires.length);assert.equal(T.quoteSkillTreeChange(s,d,{type:'unlock',skillId:dependent.id}),null,'prerequisite enforced');
 for(const p of s.skillTree.presets){p.unlocked=d.nodes.map(n=>n.id);p.active=d.nodes.filter(n=>n.kind==='active').slice(0,4).map(n=>n.id);p.passive=d.nodes.filter(n=>n.kind==='passive').slice(0,2).map(n=>n.id);}assert(E.validSave(s),race+' fully allocated');
 for(const mutation of [x=>x.skillTree.presets.pop(),x=>x.skillTree.presets[0].active.push(null),x=>x.skillTree.presets[0].passive.push(null),x=>x.skillTree.presets[0].unlocked.splice(x.skillTree.presets[0].unlocked.indexOf(dependent.requires[0]),1)]){const bad=structuredClone(s);mutation(bad);assert(!E.validSave(bad),race+' rejects invalid shape or prerequisite');}
 const ss=make();ss.setItem(S.SAVE_KEY,JSON.stringify(s));assert.equal(S.loadProgress(ss).game.race,race);assert.equal(S.loadProgress(ss).game.skillTree.presets[0].active.length,4);
}
for(const kind of ['read','write','remove']){const fail={[kind]:true},ss=make([...retired.map(k=>[k,k==='ashencrown-v4'?old4:old]),...safe],fail);const out=S.loadProgress(ss);assert.equal(out.blocked,true,kind);assert.equal(S.commitGameTransaction(ss,out.game,s=>{s.gold++;return true}).ok,false,kind+' blocks transactions');for(const [k,v]of safe)assert.equal(ss.map.get(k),v);fail[kind]=false;const retry=S.loadProgress(ss);assert.equal(retry.blocked,false,kind+' recoverable');assert(E.validSave(retry.game));for(const key of retired)assert(!ss.map.has(key));}
console.log('PASS independent real v3+v4 reset: old game keys deleted, unrelated bytes retained, schema5 current reload x3 preserves progress; five30/99 race trees, prerequisite/3presets/4active/2passive enforcement; read/write/cleanup failure gating and safe retries.');
for(const race of R.PLAYABLE_RACES){const ss=make([...safe,['ashencrown-v3',old]]),s=E.fresh(race);const reset=S.clearAndRestartNoBackup(ss,s);assert(reset.ok);assert.equal(S.loadProgress(ss).game.race,race);for(const [k,v]of safe)assert.equal(ss.map.get(k),v);assert(!ss.map.has('ashencrown-v3'));}
{const ss=make([[S.SAVE_KEY,'broken-current'],...safe]);assert(S.loadProgress(ss).blocked);assert.equal(ss.map.get(S.SAVE_KEY),'broken-current','bad current is not silently reset on every load');assert(S.clearAndRestartNoBackup(ss,E.fresh()).ok);assert(!S.loadProgress(ss).blocked);}
{const s=E.fresh();s.level=100;const d=R.getSkillTreeDefinition(s),ss=make();let draft=T.beginSkillTreeDraft(s,d);draft=T.editSkillTreeDraft(draft,d,{type:'unlock',skillId:d.nodes.find(n=>!n.requires.length).id});const quote=T.quoteSkillTreeDraft(s,draft,d,{confirm:true});assert(quote);const out=T.commitSkillTreeDraft(ss,s,quote,d);assert(out.ok);assert(ss.map.has(S.SAVE_KEY));assert(!ss.map.has('ashencrown-v3'));assert(E.validSave(S.loadProgress(ss).game));}
console.log('PASS independent manual restart all5 races, corrupt-current explicit repair, and skill draft commit uses current key and reloads valid.');
