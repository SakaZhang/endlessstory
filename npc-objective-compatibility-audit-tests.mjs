// Independent regression audit: fabricated saves only, no user save reads.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import * as N from './dist/npc-events.js';
import {SAVE_KEY} from './dist/storage.js';
import {claimTaskReward} from './dist/task-reward-transaction.js';
import {RACIAL_NPC_EVENTS as BASE_NPC_EVENTS,RACIAL_NPCS} from './dist/racial-npc-event-content.js';
import {WORLD_MONSTERS} from './dist/world-content.js';
import {applyWarStart,applyWarEnd} from './dist/war-diplomacy.js';
import {renderNpcEventBoard,renderNpcTaskJournal,renderNpcAreaObjectives} from './dist/npc-event-ui.js';
const baseline=JSON.parse(fs.readFileSync(new URL('./tests/fixtures/npc-objective-legacy-v075.json',import.meta.url)));
const RACIAL_NPC_EVENTS=BASE_NPC_EVENTS.map(d=>N.NPC_EVENTS[d.id]);
const now=Date.now(),clone=structuredClone,ledgerKeys=['status','count','cycle','readyAt','acceptedAt','lastEncounterId','choiceId'].sort();
let assertions=0;const check=(value,message)=>{assert(value,message);assertions++;};
function fixture(d,race=d.race){const s=E.fresh(race);E.normalizeHealth(s,now);E.normalizeAreaProgress(s);E.normalizeExpedition(s);s.areaProgress[d.race]={unlocked:Array.from({length:10},(_,i)=>i+1),cleared:Array.from({length:9},(_,i)=>i+1)};s.siteId=d.areaId;s.location=E.AREAS[d.areaId].number-1;s.expedition.fieldId=d.areaId+'.field';return s;}
function store(s){return {raw:JSON.stringify(s),writes:0,fail:false,getItem(k){assert.equal(k,SAVE_KEY);return this.raw;},setItem(k,v){assert.equal(k,SAVE_KEY);if(this.fail)throw Error('audit quota');this.writes++;this.raw=v;}};}
function legacy(s,d,status,choiceId=d.choices[0].id){s.npcEvents={version:1,entries:{[d.id]:{status,count:d.objective.count??0,cycle:0,readyAt:status==='resolved'&&d.repeatable?now+300000:0,acceptedAt:now-50000,lastEncounterId:['victory','exploration'].includes(d.objective.kind)?'historical-encounter':null,choiceId}}};if(status==='resolved')s.taskRewardClaims=[N.npcClaimKey(s,d.id)];for(const row of N.npcEventCosts(d,s))s.materialStacks[row.key]=row.quantity+3;return s;}
function atSource(s,d){s.siteId=d.areaId;s.location=E.AREAS[d.areaId].number-1;s.running=false;s.restUntil=0;s.heroHp=E.stats(s).hp;}
function start(s,node){s.nextBattleAt=0;const at=Math.max(now,s.lastHealthClock??now,s.lastSeen??now)+2000;const e=E.startInstanceEncounter(s,node,at);check(e,'actual engine encounter starts '+node);return {e,at};}
function win(s,e,at){for(const u of e.enemies){u.hp=1;u.control.stunUntil=s.lastHealthClock+1e8;}for(let n=0;n<80&&!e.done;n++)E.step(s,e,at+n*1100);check(e.done&&e.win,'actual engine lethal transitions win');return e;}
function settle(s,e,at){E.reward(s,e,at+90000);check(e.rewarded,'successful genuine settlement');s.running=false;s.restUntil=0;}
function accept(s,d){check(N.beginNpcEvent(s,d.id,now),'new contract accepts '+d.id);assert.deepEqual(Object.keys(s.npcEvents.entries[d.id]).sort(),ledgerKeys);check(N.npcEventIsModern(s,d.id),'new acceptance gets parallel marker '+d.id);check(!N.chooseNpcEventResponse(s,d.id,d.choices[0].id),'choice cannot bypass objective '+d.id);}
check(RACIAL_NPCS.length===30&&RACIAL_NPC_EVENTS.length===60,'30 identities and 60 ordinary contracts');assert.deepEqual(RACIAL_NPCS,baseline.npcs,'all 30 complete NPC identities retained');
check(RACIAL_NPC_EVENTS.filter(d=>d.repeatable).length===20,'20 repeatable contracts');
const counts=Object.fromEntries(['kill','collect','investigate'].map(k=>[k,RACIAL_NPC_EVENTS.filter(d=>d.taskObjective?.kind===k).length]));
assert.deepEqual(counts,{kill:20,collect:20,investigate:20});
// Every shipped old contract still has exactly its old objective, material and choice IDs.
for(const old of baseline.events){
 const d=N.NPC_EVENTS[old.id];assert.deepEqual(d.objective,old.objective,old.id+' legacy objective');assert.deepEqual(d.materials,old.materials??[],old.id+' legacy cost');assert.deepEqual(d.choices.map(c=>c.id),old.choiceIds);assert.deepEqual(d.rewards,old.rewards,old.id+' reward economy');
 for(const status of ['active','resolved','declined']){
  const s=legacy(fixture(d),d,status),before=JSON.stringify(s);check(E.validSave(s),old.id+' old '+status+' save valid');check(!N.npcEventIsModern(s,d.id),'legacy never retroactively reinterpreted');N.npcEventObjectiveProgress(s,d.id);const legacyHtml=renderNpcEventBoard(s,{race:d.race,areaId:d.areaId,now});check(legacyHtml.includes('历史委托'),'old task is visibly differentiated');assert.equal(JSON.stringify(s),before,'old ledger read/render are pure');check(E.validSave(JSON.parse(before)),'old JSON reload valid');
  if(status==='active'){
   check(N.npcEventReady(s,d.id),'legacy active remains claimable '+d.id);const storage=store(s),tx=claimTaskReward(storage,s,d.id,{now});check(tx.ok,'legacy settlement '+d.id+': '+tx.reason);check(!tx.game.npcObjectiveProgress,'claim does not retrofit objective');check(tx.game.npcEvents.entries[d.id].choiceId===old.choiceIds[0],'legacy choice preserved');check(claimTaskReward(storage,s,d.id,{now}).reason==='already-claimed','old stale double claim rejected');
  }else{check(!N.npcEventReady(s,d.id),'legacy terminal not ready');check(!N.beginNpcEvent(s,d.id,now),'legacy terminal cannot premature reaccept');assert.equal(JSON.stringify(s),before);}
 }
 const s=legacy(fixture(d),d,'active',null);check(N.chooseNpcEventResponse(s,d.id,d.choices[1].id),'unfinished old choice remains functional');check(N.npcEventReady(s,d.id),'unfinished old contract can finish');
}
// Each new collection contract uses existing exact-quality stacks; high quality is not substituted.
for(const d of RACIAL_NPC_EVENTS.filter(d=>d.taskObjective.kind==='collect').map(d=>N.NPC_EVENTS[d.id])){
 const s=fixture(d);accept(s,d);const costs=N.npcEventCosts(d,s);check(costs.length>0,'collection has actual costs');for(const row of costs){check(E.parseMaterialKey(row.key)?.key===row.key,'canonical live stack');check(!E.MATERIALS[E.parseMaterialKey(row.key).material].storyOnly,'not monopolizing mainline source');delete s.materialStacks[row.key];s.materialStacks[row.key.replace(/\|\d$/,'|3')]=99;}
 check(!N.npcEventReady(s,d.id),'wrong quality does not satisfy '+d.id);check(claimTaskReward(store(s),s,d.id,{now}).reason==='not-ready','wrong-quality claim rejected');for(const row of costs)s.materialStacks[row.key]=row.quantity;
 check(N.npcEventReady(s,d.id),'correct stacks ready');const storage=store(s),before=clone(s);storage.fail=true;check(claimTaskReward(storage,s,d.id,{now}).reason==='storage','failed persistence rejects hand-in');assert.deepEqual(s,before);assert.equal(storage.raw,JSON.stringify(before));storage.fail=false;
 const tx=claimTaskReward(storage,s,d.id,{now});check(tx.ok,'collection commits '+d.id+': '+tx.reason);for(const row of costs)check((tx.game.materialStacks[row.key]??0)===(N.npcEventRewards(d,s).filter(r=>r.key===row.key).reduce((n,r)=>n+r.quantity,0)),'exact one-time cost');check(claimTaskReward(storage,s,d.id,{now}).reason==='already-claimed','stale duplicate no cost');check(claimTaskReward(storage,tx.game,d.id,{now}).reason==='already-claimed','fresh duplicate no cost');check(E.validSave(tx.game),'claimed modern state valid');
}
// Distinct investigation actions require the actual current unlocked safe site, not map preview.
for(const d of RACIAL_NPC_EVENTS.filter(d=>d.taskObjective.kind==='investigate').map(d=>N.NPC_EVENTS[d.id])){
 const s=fixture(d);accept(s,d);check(!N.npcEventReady(s,d.id),'investigation cannot finish on accept');check(d.taskObjective.checkpoints.length>=2,'investigation has distinct points');const before=JSON.stringify(s);renderNpcEventBoard(s,{race:d.race,areaId:d.areaId,now});assert.equal(JSON.stringify(s),before,'map/board rendering does not investigate');
 for(const c of d.taskObjective.checkpoints){const areaId=c.areaId??E.INSTANCES[c.nodeId].areaId;const previous=s.siteId;s.siteId=Object.keys(E.AREAS).find(a=>a!==areaId);check(!N.investigateNpcEvent(s,d.id,c.id,now),'remote investigation rejected');s.siteId=areaId;s.running=true;check(!N.investigateNpcEvent(s,d.id,c.id,now),'running investigation rejected');s.running=false;check(N.investigateNpcEvent(s,d.id,c.id,now),'actual site investigation '+c.id);const count=N.npcEventObjectiveProgress(s,d.id).count;check(!N.investigateNpcEvent(s,d.id,c.id,now),'same checkpoint cannot repeat');check(N.npcEventObjectiveProgress(s,d.id).count===count,'repeat leaves count');s.siteId=previous;check(E.validSave(JSON.parse(JSON.stringify(s))),'checkpoint reload valid');}
 atSource(s,d);check(N.npcEventReady(s,d.id),'all distinct points ready');const tx=claimTaskReward(store(s),s,d.id,{now});check(tx.ok,'investigation claims '+d.id+': '+tx.reason);
}
// Genuine target defeats only: accepting, choice, rendering or raw hp mutation never supplies kills.
for(const d of RACIAL_NPC_EVENTS.filter(d=>d.taskObjective.kind==='kill').map(d=>N.NPC_EVENTS[d.id])){
 const s=fixture(d);accept(s,d);check(!N.npcEventReady(s,d.id),'kill cannot finish on accept');
 for(const id of d.taskObjective.monsterIds)check(WORLD_MONSTERS[id]?.nodes.some(n=>d.taskObjective.nodeIds.includes(n)),'target exists at source '+id);
 let attempts=0;while(!N.npcEventObjectiveProgress(s,d.id).complete&&attempts++<100){const node=d.taskObjective.nodeIds[0],{e,at}=start(s,node);check(e.npcObjectiveReceipt,'real post-accept encounter has receipt');check(E.validSave(JSON.parse(JSON.stringify(s))),'in-progress encounter reload valid');const prior=N.npcEventObjectiveProgress(s,d.id).count;const expected=e.enemies.filter(u=>u.origin==='initial'&&!u.follower&&d.taskObjective.monsterIds.includes(u.definitionId)).length;win(s,e,at);check(N.npcEventObjectiveProgress(s,d.id).count===prior,'lethal step alone does not settle objective');settle(s,e,at);check(N.npcEventObjectiveProgress(s,d.id).count===Math.min(d.taskObjective.count,prior+expected),'exact matching initial kill count '+d.id);const snapshot=JSON.stringify(s);E.reward(s,e,at+100000);assert.equal(JSON.stringify(s),snapshot,'same settlement cannot replay');}
 check(N.npcEventObjectiveProgress(s,d.id).complete,'kill objective achievable '+d.id);atSource(s,d);const tx=claimTaskReward(store(s),s,d.id,{now});check(tx.ok,'kill claim '+d.id+': '+tx.reason);check(E.validSave(tx.game),'kill settled save valid');
}
// Focused transactional/access edge cases.
const collect=RACIAL_NPC_EVENTS.find(d=>d.repeatable&&d.taskObjective.kind==='collect'),cd=N.NPC_EVENTS[collect.id];
{
 const s=fixture(cd);accept(s,cd);const costs=N.npcEventCosts(cd,s),reward=cd.rewards[0],all=Object.keys(E.MATERIALS).filter(k=>!E.MATERIALS[k].storyOnly&&!E.MATERIALS[k].uniqueHeld).flatMap(k=>[0,1,2,3].map(q=>E.materialKey(k,q))).filter(Boolean),fill=all.filter(k=>k!==reward.key&&!costs.some(c=>c.key===k)).slice(0,100-costs.length);s.materialStacks=Object.fromEntries(fill.map(k=>[k,1]));for(const c of costs)s.materialStacks[c.key]=c.quantity+1;const storage=store(s),before=JSON.stringify(s);const tx=claimTaskReward(storage,s,cd.id,{now});check(tx.reason==='reward-unavailable','full bag blocks without spending costs');assert.equal(JSON.stringify(s),before);assert.equal(storage.raw,before);delete s.materialStacks[fill[0]];storage.raw=JSON.stringify(s);check(claimTaskReward(storage,s,cd.id,{now}).ok,'free slot allows retry without reroll');
}
{
 const s=fixture(cd);accept(s,cd);for(const row of N.npcEventCosts(cd,s))s.materialStacks[row.key]=row.quantity;const storage=store(s);s.gold++;const before=JSON.stringify(s);check(claimTaskReward(storage,s,cd.id,{now}).reason==='stale-state','unsaved/stale state cannot commit');assert.equal(JSON.stringify(s),before);
}
{
 const d=N.NPC_EVENTS[RACIAL_NPC_EVENTS.find(x=>x.race==='human'&&x.taskObjective.kind==='investigate').id],s=fixture(d,'dwarf');accept(s,d);const c=d.taskObjective.checkpoints[0];check(applyWarStart(s,{id:'audit.war',races:['dwarf','human']},now),'war starts');const before=JSON.stringify(s.npcObjectiveProgress);check(!N.investigateNpcEvent(s,d.id,c.id,now),'war blocks checkpoint');assert.equal(JSON.stringify(s.npcObjectiveProgress),before);check(applyWarEnd(s,'audit.war',now+1),'war ends');s.siteId=c.areaId??E.INSTANCES[c.nodeId].areaId;check(N.investigateNpcEvent(s,d.id,c.id,now+2),'peace resumes preserved objective');
}

// An explicit present-time investigation cannot use an old timestamp to evade a current war.
{
 const d=N.NPC_EVENTS[RACIAL_NPC_EVENTS.find(x=>x.race==='human'&&x.taskObjective.kind==='investigate').id],s=fixture(d,'dwarf');accept(s,d);const c=d.taskObjective.checkpoints[0];s.siteId=c.areaId;const warAt=Math.max(now,s.lastSeen,s.lastHealthClock)+1000;check(applyWarStart(s,{id:'audit.random-war',kind:'random',races:['dwarf','human'],durationMs:60000},warAt),'random war starts');const realNow=Date.now;Date.now=()=>warAt+100;try{check(!N.investigateNpcEvent(s,d.id,c.id,now),'supplied pre-war time does not bypass current blockade');}finally{Date.now=realNow;}
}
// A missing or corrupt modern sidecar must not downgrade into an old free-choice contract.
{
 const d=N.NPC_EVENTS[RACIAL_NPC_EVENTS.find(d=>d.taskObjective.kind==='kill').id],s=fixture(d);accept(s,d);
 for(const change of [x=>delete x.npcObjectiveProgress,x=>delete x.npcObjectiveProgress.entries[d.id],x=>x.npcObjectiveProgress.entries[d.id]=null,x=>x.npcObjectiveProgress.entries[d.id].count=-1,x=>x.npcObjectiveProgress.entries[d.id].cycle++,x=>x.npcEvents.entries[d.id].lastEncounterId=null,x=>x.npcEvents.entries[d.id].choiceId=d.choices[0].id,x=>x.npcObjectiveProgress.entries[d.id].receipts=['duplicate','duplicate']]){const invalid=clone(s);change(invalid);check(!E.validSave(invalid),'malformed modern progress rejected');check(!N.chooseNpcEventResponse(invalid,d.id,d.choices[0].id),'malformed progress cannot become choice objective');}
 for(const npcEvents of [null,[],5,'bad',{version:1,entries:null},{version:1,entries:[]}]){const invalid=clone(s);invalid.npcEvents=npcEvents;assert.doesNotThrow(()=>N.validNpcEventState(invalid));check(!N.validNpcEventState(invalid),'malformed event ledger rejected');}
}
// Old repeatable contract finishes with old terms; only the next accepted cycle becomes modern.
{
 const d=N.NPC_EVENTS[RACIAL_NPC_EVENTS.find(d=>d.repeatable).id],s=legacy(fixture(d),d,'active'),tx=claimTaskReward(store(s),s,d.id,{now});check(tx.ok,'old repeat completes');const next=tx.game;check(!N.beginNpcEvent(next,d.id,now+299999),'full cooldown enforced');check(N.beginNpcEvent(next,d.id,now+300000),'next cycle accepts');check(N.npcEventIsModern(next,d.id),'next cycle adopts actual objective');check(next.npcEvents.entries[d.id].cycle===1,'cycle advances once');check(next.taskRewardClaims.includes(d.id+'.cycle-0'),'old claim retained');check(!N.beginNpcEvent(next,d.id,now+300001),'double acceptance does not reset new progress');
}
// Saved pre-accept battles, raw zero HP and unrelated nodes never count toward new kill contracts.
{
 const d=N.NPC_EVENTS[RACIAL_NPC_EVENTS.find(d=>d.taskObjective.kind==='kill').id];
 let s=fixture(d),{e,at}=start(s,d.taskObjective.nodeIds[0]);win(s,e,at);s.running=false;check(N.beginNpcEvent(s,d.id,at+90000),'accept while old completed fight awaits settlement');settle(s,e,at);check(N.npcEventObjectiveProgress(s,d.id).count===0,'pre-accept battle does not backfill');
 s=fixture(d);accept(s,d);({e,at}=start(s,d.taskObjective.nodeIds[0]));for(const u of e.enemies)u.hp=0;e.done=true;e.win=true;E.reward(s,e,at+90000);check(N.npcEventObjectiveProgress(s,d.id).count===0,'raw zero HP is not an actual defeated-unit receipt');
 s=fixture(d);accept(s,d);const other=Object.values(E.INSTANCES).find(n=>n.enabled&&n.id.startsWith(d.race+'.a')&&n.kind==='field'&&E.AREAS[n.areaId]?.race===d.race&&!d.taskObjective.nodeIds.includes(n.id));({e,at}=start(s,other.id));win(s,e,at);settle(s,e,at);check(N.npcEventObjectiveProgress(s,d.id).count===0,'unrelated node does not advance kill objective');
}
// Tracking survives moving away and opening a remote map; neither operation grants evidence.
{
 const d=N.NPC_EVENTS[RACIAL_NPC_EVENTS.find(d=>d.taskObjective.kind==='investigate').id],s=fixture(d);accept(s,d);s.siteId=Object.keys(E.AREAS).find(id=>id!==d.areaId);const before=JSON.stringify(s),journal=renderNpcTaskJournal(s,{now});check(journal.includes(d.title)&&journal.includes(d.npcName),'away journal retains task and giver');const point=d.taskObjective.checkpoints[0],html=renderNpcAreaObjectives(s,{areaId:point.areaId,now});check(html.includes('data-npc-action="investigate"')&&html.includes(' disabled'),'remote map shows blocked evidence action');assert.equal(JSON.stringify(s),before,'remote tracking is read-only');
}


// A later summoned copy of a target is excluded even when real combat kills it.
{
 const d=N.NPC_EVENTS['local.human.seed_sacks'];let s,e,at;for(let i=0;i<100;i++){s=fixture(d);accept(s,d);({e,at}=start(s,d.taskObjective.nodeIds[0]));if(e.enemies.length===1&&d.taskObjective.monsterIds.includes(e.enemies[0].definitionId))break;}check(e.enemies.length===1&&d.taskObjective.monsterIds.includes(e.enemies[0].definitionId),'single matching initial target fixture');const summoned=clone(e.enemies[0]);summoned.id=e.id+'-audit-summon';summoned.control.unitId=summoned.id;summoned.origin='summoned';summoned.main=false;e.enemies.push(summoned);e.summonSerial++;check(E.validSave(s),'summoned target clone has a legal production actor shape');win(s,e,at);check(!e.npcObjectiveReceipt.defeatedUnitIds.includes(summoned.id),'summoned defeat never enters initial-unit receipt');settle(s,e,at);check(N.npcEventObjectiveProgress(s,d.id).count===1,'only the original target counts, not its summoned copy');
}
// Real partial kills followed by camp withdrawal or defeat are not successful settlements.
for(const outcome of ['retreat','loss']){
 const d=N.NPC_EVENTS['local.human.seed_sacks'];let s,e,at;for(let i=0;i<100;i++){s=fixture(d);accept(s,d);({e,at}=start(s,d.taskObjective.nodeIds[0]));if(e.enemies.length>1&&e.enemies.some(u=>d.taskObjective.monsterIds.includes(u.definitionId)))break;}check(e.enemies.length>1,'genuine multi-unit fixture for '+outcome);for(const u of e.enemies)u.control.stunUntil=s.lastHealthClock+1e8;const target=e.enemies.find(u=>d.taskObjective.monsterIds.includes(u.definitionId));check(target,'partial kill is an authored matching target');E.setCombatTarget(s,target.id);target.hp=1;for(let tick=0;tick<20&&!e.npcObjectiveReceipt.defeatedUnitIds.includes(target.id)&&!e.done;tick++)E.step(s,e,at+1100+tick*1100);check(e.npcObjectiveReceipt.defeatedUnitIds.includes(target.id)&&e.npcObjectiveReceipt.defeatedUnitIds.length===1&&!e.done,'partial genuine lethal step before '+outcome);
 if(outcome==='retreat')check(E.startRest(s,at+2200,false),'normal camp retreat succeeds');else{e.heroHp=s.heroHp=1;for(const u of e.enemies){u.control.stunUntil=0;u.nextBasicAt=0;}for(let i=0;i<20&&!e.done;i++)E.step(s,e,at+2200+i*1100);check(e.done&&!e.win,'real combat loss occurs');}
 E.reward(s,e,at+90000);check(N.npcEventObjectiveProgress(s,d.id).count===0,'partial kills on '+outcome+' do not count');check(E.validSave(s),'abandoned objective state remains valid');
}
// Genuine three-stage follower combat cannot masquerade as a named normal field target.
{
 const d=N.NPC_EVENTS['local.human.highland_patrol'],s=fixture(d);accept(s,d);let followerSeen=false;for(let stage=1;stage<=3;stage++){const {e,at}=start(s,'human.a08.dungeon');check(e.dungeonStage===stage,'actual dungeon stage '+stage);followerSeen ||= e.enemies.some(u=>u.follower&&d.taskObjective.monsterIds.includes(u.followerMonsterId));win(s,e,at);settle(s,e,at);check(N.npcEventObjectiveProgress(s,d.id).count===0,'wrong source/stage never supplies field target kills');}check(followerSeen,'real final stage includes follower named like the target');check(E.validSave(s),'three-stage follower settlement valid');
}
// Multiple accepted contracts are independent; one matching battle does not progress its neighbor.
{
 const a=N.NPC_EVENTS['local.human.seed_sacks'],b=N.NPC_EVENTS['local.human.road_report'];let s,e,at;for(let i=0;i<100;i++){s=fixture(a);accept(s,a);atSource(s,b);accept(s,b);atSource(s,a);({e,at}=start(s,a.taskObjective.nodeIds[0]));if(e.enemies.some(u=>a.taskObjective.monsterIds.includes(u.definitionId)))break;}check(Object.keys(e.npcObjectiveReceipt.tasks).join()===a.id,'receipt binds only its matching accepted task');win(s,e,at);settle(s,e,at);check(N.npcEventObjectiveProgress(s,a.id).count>0,'matching task progresses');check(N.npcEventObjectiveProgress(s,b.id).count===0,'other active task remains untouched');check(E.validSave(s),'cross-task progress state valid');
}

console.log(JSON.stringify({ok:true,assertions,legacyContracts:baseline.events.length,modernObjectives:counts,scope:'independent legacy compatibility, no-choice bypass, real-engine target kills, distinct-site investigations, exact-quality atomic collection, stale and replay safety'},null,2));
