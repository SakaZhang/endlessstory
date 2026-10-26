import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {NPC_EVENTS} from './dist/npc-events.js';
import {RACIAL_NPCS} from './dist/racial-npc-event-content.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_CAST_CHARACTERS,storyCastSpeaker} from './dist/story-cast-registry.js';
import {CHIK_FAMILY_CHARACTERS,chikFamilySpeaker} from './dist/chik-family-registry.js';
import {renderStoryDialogue,renderStoryCastPortrait} from './dist/story-cast-ui.js';
const base='706c2687a448635d75088977abf61c3000eeccfe';
for(const file of ['engine.js','app.js','storage.js','save-generation.js','story-event-registry.js','story-event-controller.js','races/ashen/story-core.js','story-scenario-combat.js','story-scenario-registry.js','story-c08-scenarios.js','story-war-bridge.js','npc-events.js','racial-npc-event-content.js','return-ring-state.js','random-world-events.js','war-diplomacy.js','asset-recovery.js'])assert.equal(fs.readFileSync('dist/'+file,'utf8'),execFileSync('git',['show',base+':dist/'+file],{encoding:'utf8'}),'art-only release preserves '+file+' byte-for-byte');
assert.equal(Object.keys(STORY_SCENES).length,103);assert.equal(RACIAL_NPCS.length,30);assert.equal(Object.keys(NPC_EVENTS).length,65);
for(const id of Object.keys(CHIK_FAMILY_CHARACTERS)){assert(!NPC_EVENTS[id]);assert(!RACIAL_NPCS.some(n=>n.id===id));}
for(const scene of Object.values(STORY_SCENES))for(const line of scene.lines){const actor=storyCastSpeaker(scene,line),family=chikFamilySpeaker(scene,line);assert(!(actor&&family),'one portrait owner per speaking line');if(family)assert(!renderStoryDialogue(scene,line).includes('npcPortraitImage'),'family roster owns its only portrait');if(/^\[/.test(line))assert.equal(actor,null,'stage direction does not borrow a victim portrait');assert.notEqual(actor?.id,'current-dwarf-king');assert.notEqual(actor?.id,'dwarf-minister');}
assert.equal(renderStoryCastPortrait(STORY_CAST_CHARACTERS['current-dwarf-king']),'');
execFileSync(process.execPath,['tools/sync-story-portrait-crops.mjs','--check'],{stdio:'inherit'});
console.log('PASS v068 art-only boundary: byte-identical engine/App/save/canonical103 scenes/economy/war/recovery, unchanged30+60 local cast/events plus5Ring, one speaker portrait owner, no family quest or king/minister live dialogue.');
