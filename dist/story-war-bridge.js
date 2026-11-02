import {FINALE_SCENES} from './story-finale-scenes.js';
import {STORY_SCENES} from './story-event-registry.js';
import {validStoryEventState} from './story-event-controller.js';
import {AREAS} from './location-schema.js';
import {applyWarStart,applyWarEnd,territoryAccess,warKind} from './war-diplomacy.js';

export const STORY_WAR_ID='story.c07.elf-ashen';
export const STORY_WAR_DECLARATIONS=Object.freeze(['C07.E01.elf','C07.A01.ashen','C07.O01.human','C07.O01.dwarf','C07.O01.goblin']);
// Approved boundary: the actual C08 invasion turns both sides to the demons.
// It ends the full territory lock, not their hostility or the larger campaign.
export const STORY_WAR_ENDINGS=Object.freeze(['human','dwarf','elf','goblin','ashen'].map(race=>'C08.X04.'+race));
const canonicalScene=id=>typeof id==='string'&&Object.hasOwn(STORY_SCENES,id)?STORY_SCENES[id]:null;
const completed=(s,id)=>canonicalScene(id)?.pov===s.race&&s.story?.completedScenes?.includes(id);
export function validStoryWarState(s){
 const war=s.diplomacy?.wars?.find(w=>w.id===STORY_WAR_ID),declared=STORY_WAR_DECLARATIONS.some(id=>completed(s,id)),ended=STORY_WAR_ENDINGS.some(id=>completed(s,id));
 return declared?!!war&&warKind(war)==='story'&&war.races.join('|')==='ashen|elf'&&war.status===(ended?'ended':'active'):!war;
}
// Called only after a real controller completion has derived its canonical flags,
// within that same clone-save-adopt transaction. Non-war scenes are no-ops.
export function applyStoryWarTransition(s,id,now){
 if(!canonicalScene(id)||!completed(s,id)||!validStoryEventState(s))return false;
 if(STORY_WAR_DECLARATIONS.includes(id)){
  if(!canonicalScene(id).flags.includes('WAR_DECLARED')||!s.story.flags.includes('WAR_DECLARED'))return false;
  return applyWarStart(s,{id:STORY_WAR_ID,races:['elf','ashen'],kind:'story'},now);
 }
 if(STORY_WAR_ENDINGS.includes(id)){if(!['INVASION_BEGAN','RITUAL_SUCCEEDED','PRIEST_DIED_BACKLASH'].every(flag=>canonicalScene(id).flags.includes(flag)&&s.story.flags.includes(flag)))return false;return applyWarEnd(s,STORY_WAR_ID,now);}
 return {ok:true,changed:false};
}
// Each exception is an actual authored cross-border scene, never an arbitrary
// UI-provided pass. Unlocks, prerequisites, current action and receipts are
// separately enforced by the controller. Optional NPCs use territoryAccess.
export const STORY_WAR_ENTRANCES=Object.freeze({
 ...Object.fromEntries(['human','dwarf','goblin','ashen'].flatMap(r=>['11','12','13'].map(n=>['C08.O'+n+'.'+r,'ashen.a06']))),
 ...Object.fromEntries(Object.values(FINALE_SCENES).map(d=>[d.id,d.siteId])),
 'C01.H01.human':'goblin.a01','C01.X01.human':'goblin.a01',
 'C03.G01.goblin':'human.a02','C03.A01.ashen':'human.a02','C03.X01.dwarf':'human.a02','C03.X01.elf':'human.a02',
 'C04.HD01.dwarf':'human.a03','C04.G01.dwarf':'human.a03','C04.G01.goblin':'human.a03','C04.DE01.dwarf':'human.a03','C04.DE01.elf':'human.a03','C04.A01.elf':'ashen.a04',
 'C05.EA01.elf':'ashen.a04','C05.EA02.elf':'ashen.a04',
 'C07.EA02.elf':'ashen.a06','C07.EA03.elf':'ashen.a06','C08.E01.elf':'ashen.a06','C08.E02.elf':'ashen.a06','C08.E03.elf':'ashen.a06','C08.X01.elf':'ashen.a06',
 'C08.X02.elf':'ashen.a07','C08.X03.elf':'ashen.a07','C08.X04A.elf':'ashen.a07','C08.X04.elf':'ashen.a07','C08.X05.elf':'ashen.a07',
 // Neutral POVs also need these exact authored entrances during a random war.
 'C08.O01.human':'ashen.a06','C08.X01.human':'ashen.a06','C08.X02.human':'ashen.a07','C08.X03.human':'ashen.a07','C08.X04A.human':'ashen.a07','C08.X04.human':'ashen.a07','C08.X05.human':'ashen.a07',
 'C08.O01.dwarf':'ashen.a06','C08.X01.dwarf':'ashen.a06','C08.X02.dwarf':'ashen.a07','C08.X03.dwarf':'ashen.a07','C08.X04A.dwarf':'ashen.a07','C08.X04.dwarf':'ashen.a07','C08.X05.dwarf':'ashen.a07',
 'C08.O01.goblin':'ashen.a06','C08.X01.goblin':'ashen.a06','C08.X02.goblin':'ashen.a07','C08.X03.goblin':'ashen.a07','C08.X04A.goblin':'ashen.a07','C08.X04.goblin':'ashen.a07','C08.X05.goblin':'ashen.a07'
});
export function storyTerritoryAccess(s,id){
 const d=canonicalScene(id);if(!d||d.pov!==s.race||!AREAS[d.siteId])return {allowed:false,reason:'剧情入口不可用'};
 const access=territoryAccess(s,AREAS[d.siteId].race);if(access.allowed)return {...access,storyOnly:false};
 const exact=access.code==='war'&&STORY_WAR_ENTRANCES[id]===d.siteId;
 return exact?{allowed:true,storyOnly:true,warId:access.warId,reason:'仅限本场剧情；普通野外、副本、首领与挂机仍封锁。'}:access;
}
