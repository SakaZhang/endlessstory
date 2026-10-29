import {assertOriginalStoryContracts} from './story-copy-contract-test-helper.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as E from './dist/engine.js';
import {CHIK_FAMILY_EVENTS} from './dist/chik-family-events.js';
import {CHIK_FAMILY_REWARD_POLICY,CHIK_FAMILY_EVENT_REWARDS} from './dist/chik-family-event-rewards.js';
import {CHIK_FAMILY_CHARACTERS} from './dist/chik-family-registry.js';
import {RACIAL_NPCS,RACIAL_NPC_EVENTS} from './dist/racial-npc-event-content.js';
import {RETURN_RING_EVENTS} from './dist/return-ring-content.js';
import {NPC_EVENTS,beginNpcEvent,chooseNpcEventResponse,declineNpcEvent,npcEventReady,npcEventAccess,validNpcEventState} from './dist/npc-events.js';
import {claimTaskReward} from './dist/task-reward-transaction.js';
import {renderNpcEventBoard} from './dist/npc-event-ui.js';
import {renderChikFamilyEventBoard} from './dist/chik-family-event-ui.js';
import {reachStoryScene,preparedStoryGame} from './story-event-test-fixture.mjs';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {territoryAccess} from './dist/war-diplomacy.js';
const sha=x=>createHash('sha256').update(x).digest('hex');
const baseline=JSON.parse(fs.readFileSync('fixtures/chik-family/v067-scene-hashes.json'));
assertOriginalStoryContracts(STORY_SCENES);
assert.equal(RACIAL_NPCS.length,30);assert.equal(RACIAL_NPC_EVENTS.length,60);assert.equal(CHIK_FAMILY_EVENTS.length,6);assert.equal(Object.keys(CHIK_FAMILY_CHARACTERS).length,3);assert.equal(RETURN_RING_EVENTS.length,5);assert.equal(Object.keys(NPC_EVENTS).length,71);
const baseSaves=new Map(CHIK_FAMILY_EVENTS.map(d=>[d.areaId,reachStoryScene('goblin',d.conditions.requiredStorySceneIds[0],{finishTarget:true})]));
const fixture=d=>structuredClone(baseSaves.get(d.areaId));
const resources=s=>JSON.stringify({inventory:s.inventory,materials:s.materialStacks,gold:s.gold,xp:s.xp,recipe:s.returnRing,flags:s.story.flags,knowledge:s.story.knowledge,scenes:s.story.completedScenes,stats:s.stats,level:s.level});
const store=s=>({raw:JSON.stringify(s),fail:false,getItem(){return this.raw;},setItem(k,v){if(this.fail)throw Error('quota');this.raw=v;}});
for(const c of Object.values(CHIK_FAMILY_CHARACTERS))assert.equal(CHIK_FAMILY_EVENTS.filter(d=>d.npcId===c.id).length,2);
assert.equal(CHIK_FAMILY_REWARD_POLICY.approved,true);assert.equal(CHIK_FAMILY_REWARD_POLICY.fullArcRewardImplemented,false);

for(const d of CHIK_FAMILY_EVENTS){
 assert.equal(d.playerRace,'goblin');assert.equal(d.category,'chik-family');assert.equal(d.objective.kind,'conversation');assert(!d.repeatable);assert.equal(d.narrativeOnly,false);assert.deepEqual(d.materials,[]);assert.deepEqual(d.rewards,[{kind:'potion',key:'healing|0',quantity:2}]);assert.deepEqual(CHIK_FAMILY_EVENT_REWARDS[d.id],d.rewards);assert.equal(d.choices.length,2);assert.notEqual(d.choices[0].outcome,d.choices[1].outcome);assert(d.choices.every(c=>c.dialogue.length>15&&c.outcome.length>25));
 const early=preparedStoryGame('goblin');assert(!npcEventAccess(early,d.id).allowed);assert(!beginNpcEvent(early,d.id));assert(!renderChikFamilyEventBoard(early,{race:'goblin',areaId:d.areaId}));
 for(const chosen of d.choices){
  const s=fixture(d),now=Math.max(s.lastSeen,s.lastHealthClock)+1000,unmutated=JSON.stringify(s);assert(E.validSave(s));
  assert(declineNpcEvent(s,d.id));assert.equal(JSON.stringify(s),unmutated,'later creates no permanent miss');assert(beginNpcEvent(s,d.id,now));assert.equal(s.npcEvents.entries[d.id].choiceId,null);assert(!npcEventReady(s,d.id));assert(!beginNpcEvent(s,d.id,now));
  assert(chooseNpcEventResponse(s,d.id,chosen.id));assert(!chooseNpcEventResponse(s,d.id,'invented'));assert(declineNpcEvent(s,d.id));assert.equal(s.npcEvents.entries[d.id].choiceId,chosen.id,'later keeps accepted choice');assert(npcEventReady(s,d.id));
  const snapshot=JSON.stringify(s),r=resources(s),potions=s.potionStacks?.['healing|0']??0,st=store(s);st.fail=true;let tx=claimTaskReward(st,s,d.id,{now});assert.equal(tx.reason,'storage');assert.equal(JSON.stringify(s),snapshot);assert.equal(st.raw,snapshot);st.fail=false;
  // A newer snapshot wins before either potions or completion can commit.
  const newer=structuredClone(s);newer.gold+=3;st.raw=JSON.stringify(newer);assert.equal(claimTaskReward(st,s,d.id,{now}).reason,'stale-state');assert.equal(JSON.parse(st.raw).gold,newer.gold);st.raw=snapshot;
  tx=claimTaskReward(st,s,d.id,{now});assert(tx.ok,tx.reason);assert(E.validSave(tx.game));assert.equal(tx.game.npcEvents.entries[d.id].status,'resolved');assert.equal(tx.game.npcEvents.entries[d.id].choiceId,chosen.id);assert.equal(resources(tx.game),r,'no other resource/stat/mainline drift');assert.equal(tx.game.potionStacks['healing|0'],potions+2);assert.equal(claimTaskReward(st,tx.game,d.id,{now}).reason,'already-claimed');assert(!beginNpcEvent(tx.game,d.id,now+1e9));assert(!chooseNpcEventResponse(tx.game,d.id,d.choices.find(c=>c!==chosen).id));
  const reloaded=JSON.parse(st.raw);assert(E.validSave(reloaded));const html=renderNpcEventBoard(reloaded,{race:'goblin',areaId:d.areaId,now});assert(html.includes('奇克与家人'));assert(html.includes(chosen.outcome));assert(html.includes(CHIK_FAMILY_CHARACTERS[d.npcId].file));assert(!html.includes(`data-npc-event="${d.id}"`),'done card has no replay actions');
  const broken=structuredClone(reloaded);broken.npcEvents.entries[d.id].choiceId=null;assert(!validNpcEventState(broken));
 }
 // Existing region/safe-state/war gates apply to every action and claim.
 for(const mutate of [s=>s.siteId='goblin.a02',s=>s.running=true,s=>s.restUntil=s.lastHealthClock+10000,s=>s.areaProgress.goblin.unlocked=[]]){const s=fixture(d);mutate(s);assert(!npcEventAccess(s,d.id).allowed);assert(!beginNpcEvent(s,d.id));}
 for(const race of ['human','dwarf','elf','ashen']){const s=preparedStoryGame(race);s.siteId=d.areaId;assert(!npcEventAccess(s,d.id).allowed);assert(!beginNpcEvent(s,d.id));assert.equal(renderChikFamilyEventBoard(s,{race:'goblin',areaId:d.areaId}),'');}
 const war=fixture(d),now=Math.max(war.lastSeen,war.lastHealthClock)+1000;assert(E.startWar(war,{id:'family-test-war-'+d.id,races:['goblin','human']},now));assert(territoryAccess(war,'goblin').allowed,'own home stays open under established war rules');assert(npcEventAccess(war,d.id).allowed);war.siteId='human.a02';assert.equal(territoryAccess(war,'human').code,'war');assert(!npcEventAccess(war,d.id).allowed);assert.equal(renderChikFamilyEventBoard(war,{race:'goblin',areaId:d.areaId}),'','no remote home interaction from blocked enemy territory');
}
// A full material bag does not block an item supply; no existing material is consumed.
const full=fixture(CHIK_FAMILY_EVENTS[0]),d=CHIK_FAMILY_EVENTS[0],now=Math.max(full.lastSeen,full.lastHealthClock)+1000;
const keys=Object.keys(E.MATERIALS).filter(k=>!E.MATERIALS[k].storyOnly).flatMap(k=>[0,1,2,3].map(q=>E.materialKey(k,q)).filter(Boolean));full.materialStacks=Object.fromEntries(keys.slice(0,100).map(k=>[k,1]));assert(E.validSave(full));assert(beginNpcEvent(full,d.id,now));chooseNpcEventResponse(full,d.id,d.choices[0].id);const r=resources(full),tx=claimTaskReward(store(full),full,d.id,{now});assert(tx.ok);assert.equal(resources(tx.game),r);
// Current C08 is not silently rewound or promoted to a fabricated C10 home.
const invasion=reachStoryScene('goblin','C08.X05.goblin',{finishTarget:true});assert(invasion.story.flags.includes('INVASION_BEGAN'));assert(!invasion.story.flags.includes('G_FAMILY_SAFE'));
for(const def of CHIK_FAMILY_EVENTS){
 const s=structuredClone(invasion);s.siteId=def.areaId;s.location=E.AREAS[def.areaId].number-1;s.expedition.fieldId=def.areaId+'.field';const before=JSON.stringify(s);assert(!npcEventAccess(s,def.id).allowed);assert(!beginNpcEvent(s,def.id));const html=renderChikFamilyEventBoard(s,{race:'goblin',areaId:def.areaId});assert(html.includes('此阶段暂不开放'));assert(html.includes(def.title));assert(!html.includes('data-npc-action='));assert.equal(JSON.stringify(s),before);
 const active=fixture(def),time=Math.max(active.lastSeen,active.lastHealthClock)+1000;beginNpcEvent(active,def.id,time);chooseNpcEventResponse(active,def.id,def.choices[0].id);s.npcEvents=structuredClone(active.npcEvents);assert(E.validSave(s));assert(!npcEventReady(s,def.id));assert(renderChikFamilyEventBoard(s,{race:'goblin',areaId:def.areaId}).includes('已有选择保留'));
 const done=claimTaskReward(store(active),active,def.id,{now:time});assert(done.ok);s.npcEvents=done.game.npcEvents;s.taskRewardClaims=[...done.game.taskRewardClaims];assert(E.validSave(s));assert(renderChikFamilyEventBoard(s,{race:'goblin',areaId:def.areaId}).includes(def.choices[0].outcome));assert(!npcEventAccess(s,def.id).allowed);
}
console.log('PASS six one-off family events / 12 distinct branches: fixed2 ordinary healing potions, no other resource/stat/mainline changes, explicit choice+confirmation, all quota/stale/repeat/reload gates, C02/C05 progression, current location/safe/war policy, four POV privacy, full bag, C08 pause with visible explanation and preserved pending/completed histories; 60 regional +6 family +5 Ring remain separate.');
