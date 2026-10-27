import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {NPC_EVENTS,NPC_TASK_REWARD_REGISTRY} from './dist/npc-events.js';
import {RACIAL_NPCS,RACIAL_NPC_EVENTS} from './dist/racial-npc-event-content.js';
import {RETURN_RING_EVENTS} from './dist/return-ring-content.js';
import {CHIK_FAMILY_EVENTS} from './dist/chik-family-events.js';
import {CHIK_FAMILY_REWARD_POLICY,CHIK_FAMILY_MILESTONE} from './dist/chik-family-event-rewards.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_CAST_CHARACTERS,storyCastSpeaker} from './dist/story-cast-registry.js';
import {CHIK_FAMILY_CHARACTERS,chikFamilySpeaker} from './dist/chik-family-registry.js';
import {renderStoryDialogue,renderStoryCastPortrait} from './dist/story-cast-ui.js';
const base='706c2687a448635d75088977abf61c3000eeccfe';
// v0.69 evolves the engine/host additively. Preserve the historical scene data
// and the unaffected regional/art/save boundaries, not obsolete whole-app hashes.
for(const file of ['hero-selection.js','hero-proportions.js','storage.js','save-generation.js','races/ashen/story-core.js','story-c08-scenarios.js','racial-npc-event-content.js','return-ring-state.js','return-ring-content.js','random-world-events.js','war-diplomacy.js','asset-recovery.js'])assert.equal(fs.readFileSync('dist/'+file,'utf8'),execFileSync('git',['show',base+':dist/'+file],{encoding:'utf8'}),'unchanged boundary '+file);
const oldScenes=JSON.parse(fs.readFileSync('fixtures/chik-family/v067-scene-hashes.json')).sceneHashes;
const {createHash}=await import('node:crypto');
assert.equal(Object.keys(oldScenes).length,103);
for(const [id,hash] of Object.entries(oldScenes))assert.equal(createHash('sha256').update(JSON.stringify(STORY_SCENES[id])).digest('hex'),hash,'original scene '+id);
assert.equal(RACIAL_NPCS.length,30);assert.equal(RACIAL_NPC_EVENTS.length,60);assert.equal(RETURN_RING_EVENTS.length,5);assert.equal(CHIK_FAMILY_EVENTS.length,6);assert.equal(Object.keys(NPC_EVENTS).length,71);
assert.equal(CHIK_FAMILY_REWARD_POLICY.approved,true);assert.equal(CHIK_FAMILY_REWARD_POLICY.fullArcRewardImplemented,false);
for(const def of CHIK_FAMILY_EVENTS){assert.equal(def.playerRace,'goblin');assert.equal(def.repeatable,false);assert.deepEqual(def.rewards,[{kind:'potion',key:'healing|0',quantity:2}]);}
assert(!NPC_EVENTS[CHIK_FAMILY_MILESTONE.id]);assert(NPC_TASK_REWARD_REGISTRY[CHIK_FAMILY_MILESTONE.id]);assert.deepEqual(CHIK_FAMILY_MILESTONE.rewards,[{kind:'consumable',key:'reforgeToken',quantity:1}]);
for(const id of Object.keys(CHIK_FAMILY_CHARACTERS)){assert(!NPC_EVENTS[id]);assert(!RACIAL_NPCS.some(n=>n.id===id));}
for(const scene of Object.values(STORY_SCENES))for(const line of scene.lines){const actor=storyCastSpeaker(scene,line),family=chikFamilySpeaker(scene,line);assert(!(actor&&family),'one portrait owner per speaking line');if(family)assert(!renderStoryDialogue(scene,line).includes('npcPortraitImage'),'family roster owns its only portrait');if(/^\[/.test(line))assert.equal(actor,null,'stage direction does not borrow a victim portrait');assert.notEqual(actor?.id,'current-dwarf-king');if(scene.id!=='personal.dwarf.coup.07')assert.notEqual(actor?.id,'dwarf-minister');}
assert.equal(renderStoryCastPortrait(STORY_CAST_CHARACTERS['current-dwarf-king']),'');
execFileSync(process.execPath,['tools/sync-story-portrait-crops.mjs','--check'],{stdio:'inherit'});
console.log('PASS v068 bounded scope: canonical103 scene definitions and unchanged save/war/recovery, unchanged30+60 regional cast/events plus5Ring; exactly6 approved one-off family events and separate once-only milestone; one speaker portrait owner, no king live dialogue; minister only in scoped postclear personal confrontation.');
