// Consumes an independently earned economy simulation save. No resource, level,
// equipment, map-unlock or story-flag grants; every added unlock is a dungeon win.
import assert from 'node:assert/strict';import fs from 'node:fs';
import * as E from './dist/engine.js';import * as C from './dist/story-event-controller.js';
import {renderStoryEventBoard} from './dist/story-event-ui.js';
import {AREAS} from './dist/location-schema.js';
import {readAndChooseStoryScene,playActiveStoryEncounter} from './story-event-test-fixture.mjs';
const paths=process.argv.slice(2);assert(paths.length,'pass natural-save JSON paths');const rows=[];
for(const path of paths){
 const s=JSON.parse(fs.readFileSync(path));assert(E.validSave(s));assert(!s.story,'input has no prefilled story');const initial={level:s.level,gold:s.gold,inventory:s.inventory.length},r=s.race;
 const at=()=>Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;
 const rest=()=>{s.running=false;assert(E.startRest(s,at()));const wake=s.restUntil+1;assert(E.settleRest(s,wake));s.lastSeen=wake;};
 rest();let lockedGuidance=false;
 // Meet the first genuine foreign-map gate with the actual mainline state.
 for(let n=0;n<15;n++){const d=C.availableStoryScenes(s).find(x=>!x.optional);assert(d);const area=AREAS[d.siteId];if(!E.getAreaProgress(s,area.race).unlocked.includes(area.number)){assert.match(renderStoryEventBoard(s),/此剧情地点尚未解锁/);assert.match(renderStoryEventBoard(s),/普通副本/);lockedGuidance=true;break;}rest();readAndChooseStoryScene(s,d,d.id==='C02.E01.elf'?'later':undefined);if(d.encounter)playActiveStoryEncounter(s);if(!s.story.completedScenes.includes(d.id))assert(C.finishStoryScene(s,d.id));}
 assert(lockedGuidance,'natural route surfaces the real prerequisite instead of teleporting');
 rest();s.expedition.autoDungeon=false;s.expedition.autoBoss=false;s.expedition.loop=false;let dungeonVictories=0;
 for(const race of ['human','dwarf','elf','goblin','ashen'])for(let area=1;area<7;area++){
  if(E.getAreaProgress(s,race).unlocked.includes(area+1))continue;rest();const id=race+'.a'+String(area).padStart(2,'0')+'.dungeon';assert(E.chooseAdventureNode(s,id,{start:true,loop:false},at()),'real dungeon entry '+id);
  let n=0;do{let e=s.activeEncounter??E.startRoutedEncounter(s,at());assert(e);let turns=0;while(!e.done&&turns++<10000)E.step(s,e,s.nextActionAt);assert(e.done&&e.win,'natural-budget dungeon win '+id);E.reward(s,e,s.lastHealthClock);s.lastSeen=s.lastHealthClock;n++;}while(s.dungeonRun&&n<10);assert(!s.dungeonRun);s.running=false;assert(E.getAreaProgress(s,race).unlocked.includes(area+1));dungeonVictories++;
 }
 let steps=0;while(!s.story?.flags.includes('EPILOGUE_COMPLETE')&&steps++<100){rest();const d=C.availableStoryScenes(s).find(x=>!x.optional);assert(d);readAndChooseStoryScene(s,d,d.id==='C02.E01.elf'?'later':undefined);if(d.encounter)playActiveStoryEncounter(s);if(!s.story.completedScenes.includes(d.id))assert(C.finishStoryScene(s,d.id));assert(E.validSave(s));}
 assert(s.story.flags.includes('EPILOGUE_COMPLETE'));rows.push({race:r,source:path,initial,final:{level:s.level,gold:s.gold,inventory:s.inventory.length},dungeonVictories,lockedGuidance,scenes:s.story.completedScenes.length,status:'real natural gear/resources through every mainline scene, genuine foreign-map unlocks, real camp rest'});console.log('PASS natural full mainline',r,dungeonVictories,s.story.completedScenes.length);
}
fs.mkdirSync('qa/story-finale',{recursive:true});fs.writeFileSync('qa/story-finale/natural-save-proof.json',JSON.stringify(rows,null,2));
