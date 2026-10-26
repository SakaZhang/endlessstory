import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {CHIK_FAMILY_EVENTS} from './dist/chik-family-events.js';
import {CHIK_FAMILY_MILESTONE as STAGE,CHIK_FAMILY_REWARD_POLICY} from './dist/chik-family-event-rewards.js';
import {NPC_EVENTS,NPC_TASK_REWARD_REGISTRY,beginNpcEvent,chooseNpcEventResponse,npcEventReady,completedFamilyEventCount,familyMilestoneAccess,validNpcEventState} from './dist/npc-events.js';
import {claimTaskReward} from './dist/task-reward-transaction.js';
import {renderChikFamilyEventBoard} from './dist/chik-family-event-ui.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
const store=s=>({raw:JSON.stringify(s),fail:false,writes:0,getItem(){return this.raw;},setItem(k,v){if(this.fail)throw Error('quota');this.raw=v;this.writes++;}});
const at=(s,area)=>{s.siteId=area;s.location=E.AREAS[area].number-1;s.expedition.fieldId=area+'.field';};
const seed=reachStoryScene('goblin','C05.O01.goblin',{finishTarget:true});
const time=s=>Math.max(s.lastSeen,s.lastHealthClock)+1000;
const start=(s,d,choice=d.choices[0].id)=>{at(s,d.areaId);assert(beginNpcEvent(s,d.id,time(s)));assert(chooseNpcEventResponse(s,d.id,choice));assert(npcEventReady(s,d.id));};
const complete=(s,d)=>{start(s,d);const tx=claimTaskReward(store(s),s,d.id,{now:time(s)});assert(tx.ok,tx.reason);return tx.game;};
assert(CHIK_FAMILY_REWARD_POLICY.approved);assert(!CHIK_FAMILY_REWARD_POLICY.fullArcRewardImplemented);
assert(!NPC_EVENTS[STAGE.id],'milestone is not a seventh story event');assert.deepEqual(NPC_TASK_REWARD_REGISTRY[STAGE.id].rewards,[{kind:'consumable',key:'reforgeToken',quantity:1}]);
// The actual inventory catalog has <=62 item stack types, below the100-slot bag.
// Exercise its reachable capacity boundary (1e9 per stack), not illegal fake keys.
assert.equal(Object.keys(E.POTIONS).length*4+2,62);assert.equal(E.BAG_LIMITS.items,100);
for(const d of CHIK_FAMILY_EVENTS)for(const choice of d.choices){
 const s=structuredClone(seed);E.normalizePotions(s);s.potionStacks['healing|0']=1e9-1;s.lootFilters={equipment:[],materials:[],items:[0]};start(s,d,choice.id);assert(E.validSave(s));const before=JSON.stringify(s),st=store(s);
 let tx=claimTaskReward(st,s,d.id,{now:time(s)});assert.equal(tx.reason,'reward-unavailable');assert.equal(JSON.stringify(s),before);assert.equal(st.raw,before);assert.equal(s.npcEvents.entries[d.id].status,'active');assert(!s.taskRewardClaims?.includes(d.id));
 // Reload remains exactly pending; a single freed unit now permits both potions.
 let retry=JSON.parse(st.raw);retry.potionStacks['healing|0']--;st.raw=JSON.stringify(retry);tx=claimTaskReward(st,retry,d.id,{now:time(retry)});assert(tx.ok);assert.equal(tx.game.potionStacks['healing|0'],1e9);assert.deepEqual(tx.game.lootFilters.items,[0],'reward bypasses battle discard without changing filter');assert.equal(tx.game.npcEvents.entries[d.id].choiceId,choice.id);assert(E.validSave(tx.game));
 const reload=JSON.parse(st.raw);assert.equal(claimTaskReward(st,reload,d.id,{now:time(reload)}).reason,'already-claimed');assert.equal(reload.potionStacks['healing|0'],1e9);
 // Consuming/discarding supplies is not a fresh eligibility condition.
 reload.potionStacks['healing|0']=0;st.raw=JSON.stringify(reload);assert.equal(claimTaskReward(st,reload,d.id,{now:time(reload)}).reason,'already-claimed');assert.equal(reload.potionStacks['healing|0'],0);
}
let s=structuredClone(seed);E.normalizePotions(s);const startingPotions=s.potionStacks['healing|0']??0;
for(const [i,d]of CHIK_FAMILY_EVENTS.entries()){
 assert.equal(completedFamilyEventCount(s),i);const st=store(s),before=st.raw;assert.equal(claimTaskReward(st,s,STAGE.id,{now:time(s)}).reason,'not-ready');assert.equal(st.raw,before);
 if(i===5){
  s.potionStacks['healing|0']=1e9-1;start(s,d);const lastStore=store(s),raw=lastStore.raw,tx=claimTaskReward(lastStore,s,d.id,{now:time(s)});assert.equal(tx.reason,'reward-unavailable');assert.equal(lastStore.raw,raw);assert.equal(completedFamilyEventCount(s),5);assert(!familyMilestoneAccess(s).allowed,'failed sixth potion grant cannot unlock the stage');s.potionStacks['healing|0']=startingPotions+10;lastStore.raw=JSON.stringify(s);const finish=claimTaskReward(lastStore,s,d.id,{now:time(s)});assert(finish.ok);s=finish.game;
 }else s=complete(s,d);
}
assert.equal(completedFamilyEventCount(s),6);assert.equal(s.potionStacks['healing|0'],startingPotions+12);assert(familyMilestoneAccess(s).allowed);assert(!s.taskRewardClaims.includes(STAGE.id));
let html=renderChikFamilyEventBoard(s,{race:'goblin',areaId:s.siteId});assert(html.includes('6 / 6 · 已备好的补给待领取'));assert(html.includes('重铸印记 ×1'));assert(!html.includes('至臻'));
const earned=structuredClone(s);s.consumables.reforgeToken=1e9;const before=JSON.stringify(s),st=store(s);let tx=claimTaskReward(st,s,STAGE.id,{now:time(s)});assert.equal(tx.reason,'reward-unavailable');assert.equal(st.raw,before);assert.equal(JSON.stringify(s),before);assert.equal(completedFamilyEventCount(s),6);assert(!s.taskRewardClaims.includes(STAGE.id));
// Pending earned loot survives quota and newer-save conflicts without replaying a scene.
s.consumables.reforgeToken=1e9-1;st.raw=JSON.stringify(s);st.fail=true;const quota=st.raw;tx=claimTaskReward(st,s,STAGE.id,{now:time(s)});assert.equal(tx.reason,'storage');assert.equal(st.raw,quota);assert.equal(s.consumables.reforgeToken,1e9-1);st.fail=false;
const newer=structuredClone(s);newer.gold+=11;st.raw=JSON.stringify(newer);assert.equal(claimTaskReward(st,s,STAGE.id,{now:time(s)}).reason,'stale-state');assert.equal(JSON.parse(st.raw).gold,newer.gold);s=newer;st.raw=JSON.stringify(s);
tx=claimTaskReward(st,s,STAGE.id,{now:time(s)});assert(tx.ok);assert.equal(tx.game.consumables.reforgeToken,1e9);assert.equal(tx.game.potionStacks['healing|0'],startingPotions+12);assert(E.validSave(tx.game));assert.equal(tx.game.taskRewardClaims.filter(id=>id===STAGE.id).length,1);const marked=JSON.parse(st.raw);assert.equal(claimTaskReward(st,marked,STAGE.id,{now:time(marked)}).reason,'already-claimed');assert(!renderChikFamilyEventBoard(marked,{race:'goblin',areaId:marked.siteId}).includes(`data-npc-event="${STAGE.id}"`));
marked.consumables.reforgeToken=0;st.raw=JSON.stringify(marked);assert.equal(claimTaskReward(st,marked,STAGE.id,{now:time(marked)}).reason,'already-claimed');assert.equal(marked.consumables.reforgeToken,0);
// Strict source history: no token claim without all real scene outcomes/claim keys.
const empty=structuredClone(seed);empty.taskRewardClaims=[STAGE.id];assert(!validNpcEventState(empty));assert(!E.validSave(empty));
for(const mutate of [x=>delete x.npcEvents.entries[CHIK_FAMILY_EVENTS[0].id],x=>x.taskRewardClaims=x.taskRewardClaims.filter(id=>id!==CHIK_FAMILY_EVENTS[0].id),x=>x.npcEvents.entries[CHIK_FAMILY_EVENTS[0].id].choiceId=null,x=>x.npcEvents.entries[CHIK_FAMILY_EVENTS[0].id].status='active',x=>x.story.completedScenes=x.story.completedScenes.filter(id=>id!=='C02.O01.goblin'),x=>x.race='human']){const bad=structuredClone(tx.game);mutate(bad);assert(!validNpcEventState(bad));assert(!E.validSave(bad));}
for(const mutate of [x=>at(x,'human.a02'),x=>x.running=true,x=>x.restUntil=x.lastHealthClock+10000,x=>x.areaProgress.goblin.unlocked=[]]){const bad=structuredClone(earned);mutate(bad);assert(!familyMilestoneAccess(bad).allowed);}
// Invasion pauses new house scenes but cannot confiscate an already-earned reward.
const invasion=reachStoryScene('goblin','C08.X05.goblin',{finishTarget:true});invasion.npcEvents=structuredClone(earned.npcEvents);invasion.taskRewardClaims=[...earned.taskRewardClaims];at(invasion,'goblin.a04');assert(E.validSave(invasion));assert(invasion.story.flags.includes('INVASION_BEGAN'));assert(!invasion.story.flags.includes('G_FAMILY_SAFE'));assert(familyMilestoneAccess(invasion).allowed);html=renderChikFamilyEventBoard(invasion,{race:'goblin',areaId:'goblin.a04'});assert(html.includes('此阶段暂不开放'));assert(html.includes('6 / 6 · 已备好的补给待领取'));const lateStore=store(invasion),late=claimTaskReward(lateStore,invasion,STAGE.id,{now:time(invasion)});assert(late.ok);assert.equal(late.game.consumables.reforgeToken,(invasion.consumables.reforgeToken??0)+1);assert(E.validSave(late.game));
console.log('PASS approved family rewards: all12 branch potion-capacity failures and atomic exact2 retry; total12 potions; real all6 milestone provenance; independent one-token pending/full-stack/quota/newer/reload/discard once-only claim; C08 earned supply preserved; no Q3, new item identity, invented100-slot full bag or mainline reset.');
