// Exact authored combat overrides only. Ordinary A07 and camps retain their maps.
const races=['human','dwarf','elf','goblin','ashen'];
export const STORY_BATTLE_BACKGROUNDS=Object.freeze({
 ...Object.fromEntries(races.map(r=>['story.c10-x07-'+r,Object.freeze({id:'story-central-ritual-closed',file:'../story-assets/central-ritual-closed.png',size:[480,270],z:0})])),
 ...Object.fromEntries(races.map(r=>['story.c10-x05-'+r,Object.freeze({id:'story-central-ritual-open',file:'../story-assets/central-ritual-open.png',size:[480,270],z:0})]))
});
export function extendStoryBattleBackgrounds(manifest){manifest.storyScenarioBackgrounds=STORY_BATTLE_BACKGROUNDS;return manifest;}
