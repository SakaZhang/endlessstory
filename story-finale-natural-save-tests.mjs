// Independently earned production-economy saves. No level/resource/equipment,
// area-unlock or story-flag grants. Foreign unlocks are earned JUST IN TIME.
import assert from 'node:assert/strict';import fs from 'node:fs';
import * as E from './dist/engine.js';import * as C from './dist/story-event-controller.js';
import {renderStoryEventBoard} from './dist/story-event-ui.js';import {AREAS} from './dist/location-schema.js';
import {readAndChooseStoryScene,playActiveStoryEncounter} from './story-event-test-fixture.mjs';
const inputs=process.argv.slice(2),paths=inputs.length?inputs:['human','dwarf','elf','goblin','ashen'].map(r=>'fixtures/natural-progression-v068/'+r+'.json'),rows=[];
for(const path of paths){
 const s=JSON.parse(fs.readFileSync(path));assert(E.validSave(s));assert(!s.story,'input has no prefilled story');const initial={level:s.level,gold:s.gold,inventory:s.inventory.length},r=s.race;
 const at=()=>Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;
 const rest=()=>{s.running=false;assert(E.startRest(s,at()));const wake=s.restUntil+1;assert(E.settleRest(s,wake));s.lastSeen=wake;};
 rest();s.expedition.autoDungeon=false;s.expedition.autoBoss=false;s.expedition.loop=false;
 let dungeonVictories=0,lockedGuidance=0,corridorEntries=0,peacefulExits=0;
 function earnAccess(race,target){
  for(let area=1;area<target;area++){
   if(E.getAreaProgress(s,race).unlocked.includes(area+1))continue;rest();const id=race+'.a'+String(area).padStart(2,'0')+'.dungeon';assert(E.chooseAdventureNode(s,id,{start:true,loop:false},at()),'real JIT dungeon entry '+id);
   let n=0;do{let e=s.activeEncounter??E.startRoutedEncounter(s,at());assert(e);let turns=0;while(!e.done&&turns++<10000)E.step(s,e,s.nextActionAt);assert(e.done&&e.win,'natural-budget dungeon win '+id);E.reward(s,e,s.lastHealthClock);s.lastSeen=s.lastHealthClock;n++;}while(s.dungeonRun&&n<10);assert(!s.dungeonRun);s.running=false;assert(E.getAreaProgress(s,race).unlocked.includes(area+1));dungeonVictories++;
  }
 }
 let steps=0;while(!s.story?.flags.includes('EPILOGUE_COMPLETE')&&steps++<100){
  rest();let d=C.availableStoryScenes(s).find(x=>!x.optional);assert(d);const area=AREAS[d.siteId],unlocked=E.getAreaProgress(s,area.race).unlocked.includes(area.number);
  if(!unlocked&&!C.canEnterWarStoryScene(s,d.id)&&!C.storySceneLocationAvailable(s,d)){
   assert.match(renderStoryEventBoard(s),/此剧情地点尚未解锁/);assert.match(renderStoryEventBoard(s),/普通副本/);lockedGuidance++;
   if(C.warWithdrawalAvailable(s)&&s.story.flags.includes('INVASION_BEGAN')){const hp=s.heroHp,ledger=JSON.stringify(s.story);assert(C.applyStoryEvent(s,{type:'retreat',returnSiteId:r+'.a01'},{now:at()}));assert.equal(s.heroHp,hp);assert.equal(JSON.stringify(s.story),ledger);peacefulExits++;}
   earnAccess(area.race,area.number);
  }else if(!unlocked)corridorEntries++;
  const prior=JSON.stringify(s.areaProgress);readAndChooseStoryScene(s,d,d.id==='C02.E01.elf'?'later':undefined);if(d.encounter)playActiveStoryEncounter(s);if(!s.story.completedScenes.includes(d.id))assert(C.finishStoryScene(s,d.id));assert(E.validSave(s));assert.equal(JSON.stringify(s.areaProgress),prior,'story encounter never grants ordinary unlocks');
 }
 assert(s.story.flags.includes('EPILOGUE_COMPLETE'));assert(lockedGuidance>0);if(r==='elf'){assert(corridorEntries>0,'must exercise locked war corridor');assert(peacefulExits>0,'must exercise postwar safe exit before lawful unlock');}
 rows.push({race:r,source:path,initial,final:{level:s.level,gold:s.gold,inventory:s.inventory.length},dungeonVictories,lockedGuidance,corridorEntries,peacefulExits,scenes:s.story.completedScenes.length,status:'genuine natural gear/resources, just-in-time foreign dungeons, exact essential war corridor, postwar safe exit, full mainline ending'});console.log('PASS natural JIT full mainline',r,dungeonVictories,s.story.completedScenes.length,'corridors',corridorEntries,'peaceful exits',peacefulExits);
}
fs.mkdirSync('qa/story-finale',{recursive:true});fs.writeFileSync('qa/story-finale/natural-save-proof.json',JSON.stringify(rows,null,2));
