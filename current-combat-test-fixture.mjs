// Explicit current-node fixtures, not historical routing or production fallbacks.
import * as E from './dist/engine.js';
export function currentEncounter(s,boss=false,now=s.lastHealthClock??s.lastSeen){
 if(boss){E.normalizeAreaProgress(s);s.areaProgress.dwarf={unlocked:[1,2,3],cleared:[1,2]};return E.startInstanceEncounter(s,'dwarf.a03.boss',now);}
 return E.startRoutedEncounter(s,now);
}
export function markVictory(e){e.done=e.win=true;e.hp=0;e.targetId=null;for(const u of e.enemies)u.hp=0;return e;}
export function rewardSeeded(s,predicate,maxSeeds=10000){for(let seed=0;seed<maxSeeds;seed++){const game=structuredClone(s),e=game.activeEncounter;e.rngState=seed;const drop=E.reward(game,e,game.lastHealthClock);if(predicate(game,e,drop))return {game,e,drop,seed};}return null;}
