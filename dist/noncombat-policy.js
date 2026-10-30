// During recovery running is continuation intent, not an active fight. Never
// clear that intent merely to prepare a build, and never exempt unfinished combat.
export function safeRestPreparation(s){
 return (s.restUntil??0)>0&&!s.dungeonRun&&(!s.activeEncounter||s.activeEncounter.done===true);
}
export function noncombatRunning(s){return !!s.running&&!safeRestPreparation(s);}
