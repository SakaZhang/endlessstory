import {STORY_SCENES} from './story-event-registry.js';
import {AREAS,PLANNED_INSTANCES} from './location-schema.js';
import {territoryAccess,validDiplomacy} from './war-diplomacy.js';

// Caller validates the strict save/scene ledger. This is only an exit, not an
// entry permission or ordinary unlock; a legitimate visited corridor is required.
export function storyCorridorExitAvailable(s){
 const area=AREAS[s?.siteId];if(!area||(s.areaProgress?.[area.race]?.unlocked??[1]).includes(area.number)||s.activeEncounter&&!s.activeEncounter.rewarded)return false;
 const proof=[...(s.story?.completedScenes??[]),s.story?.activeScene?.id].some(id=>{const d=STORY_SCENES[id];return d&&d.pov===s.race&&!d.optional&&d.siteId===s.siteId;});return proof;
}

// Explicit player withdrawal: the caller supplies a safe
// own-territory camp. No invented timers, forced rest, loot loss or auto-hopping.
// Never called automatically at declaration or settlement.
export function retreatFromWar(s,returnSiteId){
 const area=AREAS[returnSiteId],field=PLANNED_INSTANCES[returnSiteId+'.field'];
 if(!validDiplomacy(s)||!area||!field?.enabled||area.race!==s.race||!territoryAccess(s,area.race).allowed||!(s.areaProgress?.[s.race]?.unlocked??[1]).includes(area.number))return null;
 const current=AREAS[s.siteId];if(!current||territoryAccess(s,current.race).allowed&&!storyCorridorExitAvailable(s))return {ok:true,changed:false};
 // Current battle includes an unclaimed win. It must settle exactly once before
 // any location/run state is cleared; a paused fight is not silently resumed.
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return {ok:true,changed:false,pendingBattle:true};
 s.siteId=area.id;s.location=area.number-1;s.atCamp=true;s.running=false;s.restResume=false;s.stopAfterBattle=false;s.stopAfterDungeon=false;s.activeEncounter=null;s.dungeonRun=null;
 s.expedition={...s.expedition,mode:'field',fieldId:field.id,targetInstanceId:null,loop:false};
 return {ok:true,changed:true,siteId:area.id};
}
