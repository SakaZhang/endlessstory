import {skillEffectValue,validSkillEffectState} from './skill-tree-effects.js';
// Skill-only chance. The ordinary rating curve and basic attacks are unchanged.
// Sources are granted alongside the human skill's own timed critical-rating buff.
export function setSkillCritChance(stats,effects){
 const ordinary=Math.max(0,Math.min(.6,Number.isFinite(stats?.crit)?stats.crit:0));
 const enabled=(stats?.count?.human_royal_edge??0)>=2&&validSkillEffectState(effects);
 const extra=enabled?Math.min(.03,skillEffectValue(effects,'self','setSkillCrit')??0):0;
 return Math.min(.63,ordinary+extra);
}
// A completed removal destroys the set-only window. Re-equipping never restores it.
// Dungeon carry is separate from the live encounter and must be cleared as well.
export function clearRemovedSetSkillCrit(state,nextEquippedIds){
 const count=[...nextEquippedIds].filter(id=>state.inventory?.some(it=>it.id===id&&it.set==='human_royal_edge')).length;
 if(count>=2)return;
 for(const hero of [state.activeEncounter?.treeEffects?.hero,state.dungeonRun?.carry?.treeEffects?.hero]){
  if(Array.isArray(hero?.sources))hero.sources=hero.sources.filter(source=>source.type!=='setSkillCrit');
 }
}
