import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {NPC_EVENTS,npcEventDefinition,beginNpcEvent,npcEventObjectiveProgress,investigateNpcEvent} from './dist/npc-events.js';
import {renderNpcEventBoard,renderNpcTaskJournal,renderNpcAreaObjectives} from './dist/npc-event-ui.js';
import {MONSTER_CATALOG} from './dist/monster-codex-schema.js';
import {AREAS,INSTANCES} from './dist/location-schema.js';
const now=Date.now(),defs=Object.values(NPC_EVENTS).filter(d=>d.objectiveVersion===2);
assert.equal(defs.length,60,'all ordinary contracts have actionable offers');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fixture(def){const s=E.fresh(def.race);E.normalizeHealth(s,now);E.normalizeAreaProgress(s);E.normalizeExpedition(s);for(const race of E.RACE_KEYS)s.areaProgress[race]={unlocked:Array.from({length:10},(_,i)=>i+1),cleared:Array.from({length:9},(_,i)=>i+1)};s.siteId=def.areaId;s.location=AREAS[def.areaId].number-1;s.expedition.fieldId=def.areaId+'.field';return s;}
for(const original of defs){
 const s=fixture(original),def=npcEventDefinition(s,original.id),o=def.objective;
 const before=JSON.stringify(s),offer=renderNpcEventBoard(s,{race:def.race,areaId:def.areaId,now});
 assert.equal(JSON.stringify(s),before,'preview must not mutate '+def.id);
 assert(offer.includes('data-task-kind="'+o.kind+'"'));
 assert(!offer.includes('data-npc-action="choose"'),'ordinary fresh offers never need choices');
 assert(offer.includes('完成报酬：')&&offer.includes('交付给 '+def.npcName));
 assert(offer.includes(esc(AREAS[def.areaId].name)));
 if(o.kind==='kill'){for(const id of o.monsterIds)assert(offer.includes(esc(MONSTER_CATALOG[id].name)),def.id+' target name');for(const id of o.nodeIds)assert(offer.includes(esc(INSTANCES[id].name)),def.id+' target location');assert(offer.includes(o.count+' 只'));}
 if(o.kind==='collect'){const p=npcEventObjectiveProgress(s,def.id);for(const r of p.materials){const [id,q]=r.key.split('|');assert(offer.includes(esc(E.MATERIALS[id].name??id)));assert(offer.includes(E.RARITY[Number(q)]));assert(offer.includes(r.quantity+' 份'));for(const node of r.sourceNodeIds??[])assert(offer.includes(esc(INSTANCES[node].name)));}assert(offer.includes('更高品质不会替代'));}
 if(o.kind==='investigate'){assert.equal(new Set(o.checkpoints.map(p=>p.label)).size,o.checkpoints.length);for(const point of o.checkpoints){assert(offer.includes(esc(point.label)));assert(offer.includes(esc(AREAS[point.areaId].name)));}assert(!offer.includes('data-npc-action="investigate"'),'NPC dialogue is not a checkpoint action');}
 assert(beginNpcEvent(s,def.id,now));
 const journalBefore=JSON.stringify(s),journal=renderNpcTaskJournal(s,{now});assert.equal(JSON.stringify(s),journalBefore);assert(journal.includes(def.title));assert(!journal.includes('data-npc-action="choose"'));
 // Every active task survives changing the viewed/current region in its global ledger.
 const remote=Object.values(AREAS).find(a=>a.race===def.race&&a.id!==def.areaId&&a.id.includes('.a'));
 s.siteId=remote.id;s.location=remote.number-1;s.expedition.fieldId=remote.id+'.field';
 const away=renderNpcTaskJournal(s,{now});assert(away.includes(def.title));assert(away.includes('data-npc-map-area="'+def.areaId+'"'));assert.match(away,/data-npc-action="claim"[^>]*disabled/);assert(away.includes('先前往'));
 if(o.kind==='investigate'){
  for(const point of o.checkpoints){
   s.siteId=remote.id===point.areaId?def.areaId:remote.id;
   if(s.siteId===point.areaId)s.siteId=Object.values(AREAS).find(a=>a.race===def.race&&a.id!==point.areaId&&a.id.includes('.a')).id;
   s.location=AREAS[s.siteId].number-1;s.expedition.fieldId=s.siteId+'.field';
   const preview=renderNpcAreaObjectives(s,{areaId:point.areaId,now});assert(preview.includes(esc(point.label)));assert.match(preview,/data-npc-action="investigate"[^>]*disabled/);assert(preview.includes('地图预览'));
   s.siteId=point.areaId;s.location=AREAS[s.siteId].number-1;s.expedition.fieldId=s.siteId+'.field';
   assert(investigateNpcEvent(s,def.id,point.id,now));const result=renderNpcAreaObjectives(s,{areaId:point.areaId,now});assert(result.includes(esc(point.evidence)));assert(result.includes('isComplete'));assert(result.includes('已调查'));
  }
  assert(npcEventObjectiveProgress(s,def.id).complete);assert(renderNpcTaskJournal(s,{now}).includes('目标已完成 · 待交付'));
 }
 assert(E.validSave(s));
}
// An old resolved repeatable displays the historical answer AND next cycle's
// actual targets before accepting the new contract. Rendering changes no save.
const repeat=defs.find(d=>d.repeatable),legacy=fixture(repeat);
legacy.npcEvents={version:1,entries:{[repeat.id]:{status:'resolved',count:repeat.objective.count??0,cycle:0,readyAt:now,acceptedAt:now-300001,lastEncounterId:null,choiceId:repeat.choices[1].id}}};
legacy.taskRewardClaims=[repeat.id+'.cycle-0'];
const raw=JSON.stringify(legacy),html=renderNpcEventBoard(legacy,{race:repeat.race,areaId:repeat.areaId,now});assert.equal(JSON.stringify(legacy),raw);assert(html.includes('历史委托'));assert(html.includes(esc(repeat.choices[1].outcome)));assert(html.includes('下一轮委托'));assert(html.includes('接取下一轮委托'));assert(html.includes('接取前查看目标'));assert(E.validSave(legacy));
// A valid pre-update resolved ledger may contain no selected response. Its
// journal fallback must use the original completion, never overlay evidence or
// the modern-only payout story that this historical player did not perform.
const nullChoiceDef=NPC_EVENTS['local.dwarf.lamp_labels'],nullChoice=fixture(nullChoiceDef);
nullChoice.npcEvents={version:1,entries:{[nullChoiceDef.id]:{status:'resolved',count:0,cycle:0,readyAt:0,acceptedAt:now-1000,lastEncounterId:null,choiceId:null}}};
nullChoice.taskRewardClaims=[nullChoiceDef.id];
const nullChoiceRaw=JSON.stringify(nullChoice),nullChoiceReloaded=JSON.parse(nullChoiceRaw);
assert(E.validSave(nullChoiceReloaded),'historical resolved null-choice save remains valid');
assert(!npcEventDefinition(nullChoiceReloaded,nullChoiceDef.id).modern);
const nullChoiceJournal=renderNpcTaskJournal(nullChoiceReloaded,{now});
for(const line of nullChoiceDef.completion)assert(nullChoiceJournal.includes(esc(line)),'original completion fallback retained');
for(const line of nullChoiceDef.taskCompletion)assert(!nullChoiceJournal.includes(esc(line)),'no new investigation or reward narration fabricated');
for(const point of nullChoiceDef.taskObjective.checkpoints)assert(!nullChoiceJournal.includes(esc(point.evidence)),'no modern checkpoint evidence backfilled');
assert(nullChoiceJournal.includes('历史委托')&&nullChoiceJournal.includes('无物资报酬'),'legacy identity and original reward retained');
assert.equal(JSON.stringify(nullChoiceReloaded),nullChoiceRaw,'history rendering never migrates the old contract');
console.log('PASS 60 objective UI offers: real target/source names, exact-quality requirements, counts/rewards before accept, no fresh choice quiz, global away journal, disabled remote actions, distinct area evidence/once markers, render purity and legacy-next-cycle disclosure and null-choice historical completion.');
