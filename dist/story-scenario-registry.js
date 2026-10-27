import {FINALE_SCENARIOS} from './story-finale-scenarios.js';
import {C08_SCENARIOS} from './story-c08-scenarios.js';
const freeze=value=>{for(const child of Object.values(value))if(child&&typeof child==='object')freeze(child);return Object.freeze(value)};

// Named, nonlethal authored scenes. The source monster ID is a numerical budget,
// never the character's identity, a codex discovery, or a loot source.
const LEGACY_SCENARIOS={
 'story.c01.human-chase':{sceneId:'C01.H01.human',race:'human',siteId:'goblin.a01',budgetId:'goblin.a01.normal.1',actorRace:'goblin',actorWeapon:'dagger',actorName:'奇克',rounds:4,result:'chase-transition',objective:'截住奇克，交手四轮后追入石道；本场不杀死对方。',outcome:'奇克钻入旧石道。罗什福尔追了进去。'},
 'story.c01.goblin-escape':{sceneId:'C01.G01.goblin',race:'goblin',siteId:'goblin.a01',budgetId:'goblin.a01.normal.1',actorRace:'human',actorWeapon:'sword_shield',actorName:'罗什福尔',rounds:4,result:'chase-transition',objective:'撑过四轮拦截，找到撤离口；本场不杀死对方。',outcome:'窄口的旧阶断开。奇克钻入石道，罗什福尔紧随其后。'},
 'story.c05.elf-duel':{sceneId:'C05.EA01.elf',race:'elf',siteId:'ashen.a04',budgetId:'ashen.a04.normal.1',actorRace:'ashen',actorWeapon:'armguard',actorName:'砾恩',rounds:4,result:'elf-defeated',objective:'交手四轮，确认核心变化；升级后莱姆斯将败退，不以杀死砾恩为目标。',outcome:'核心的光稳定下来。莱姆斯被逼退，武器落在石面；砾恩没有追击。'},
 'story.c05.ashen-duel':{sceneId:'C05.EA01.ashen',race:'ashen',siteId:'ashen.a04',budgetId:'ashen.a04.normal.1',actorRace:'elf',actorWeapon:'staff',actorName:'莱姆斯',rounds:4,result:'ashen-victory',objective:'交手四轮，稳住核心并突破拦截；击退对方也会转场，不杀死莱姆斯。',outcome:'核心的光稳定下来。砾恩击退莱姆斯，留下了离开的路。'}
};

export const STORY_SCENARIOS=freeze({...Object.fromEntries(Object.entries(LEGACY_SCENARIOS).map(([id,d])=>[id,{...d,mode:'nonlethal'}])),...C08_SCENARIOS,...FINALE_SCENARIOS});
export const storyScenarioMode=e=>STORY_SCENARIOS[e?.storyScenario?.id]?.mode??null;
export const storyScenarioNonlethal=e=>storyScenarioMode(e)==='nonlethal';
