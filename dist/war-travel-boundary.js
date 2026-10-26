import {AREAS,PLANNED_INSTANCES} from './location-schema.js';
import {territoryAccess,validDiplomacy} from './war-diplomacy.js';

// Candidate evacuation seam: the approved event/story owner supplies a safe
// own-territory camp. No invented timers, forced rest, loot loss or auto-hopping.
// Not wired to production while the exact return-target policy is pending.
export function retreatFromWar(s,returnSiteId){
 const area=AREAS[returnSiteId],field=PLANNED_INSTANCES[returnSiteId+'.field'];
 if(!validDiplomacy(s)||!area||!field?.enabled||area.race!==s.race||!territoryAccess(s,area.race).allowed||!(s.areaProgress?.[s.race]?.unlocked??[1]).includes(area.number))return null;
 const current=AREAS[s.siteId];if(!current||territoryAccess(s,current.race).allowed)return {ok:true,changed:false};
 // Current battle includes an unclaimed win. It must settle exactly once before
 // any location/run state is cleared; a paused fight is not silently resumed.
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return {ok:true,changed:false,pendingBattle:true};
 s.siteId=area.id;s.location=area.number-1;s.atCamp=true;s.running=false;s.restResume=false;s.stopAfterBattle=false;s.stopAfterDungeon=false;s.activeEncounter=null;s.dungeonRun=null;
 s.expedition={...s.expedition,mode:'field',fieldId:field.id,targetInstanceId:null,loop:false};
 return {ok:true,changed:true,siteId:area.id};
}
