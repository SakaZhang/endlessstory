import {assertOriginalStoryContracts} from './story-copy-contract-test-helper.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {NPC_EVENTS,NPC_TASK_REWARD_REGISTRY} from './dist/npc-events.js';
import {RACIAL_NPCS,RACIAL_NPC_EVENTS} from './dist/racial-npc-event-content.js';
import {returnRingExperienceBonus} from './dist/return-ring-state.js';
import {RETURN_RING_EVENTS} from './dist/return-ring-content.js';
import {CHIK_FAMILY_EVENTS} from './dist/chik-family-events.js';
import {CHIK_FAMILY_REWARD_POLICY,CHIK_FAMILY_MILESTONE} from './dist/chik-family-event-rewards.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_CAST_CHARACTERS,storyCastSpeaker} from './dist/story-cast-registry.js';
import {CHIK_FAMILY_CHARACTERS,chikFamilySpeaker} from './dist/chik-family-registry.js';
import {renderStoryDialogue,renderStoryCastPortrait} from './dist/story-cast-ui.js';
const base='706c2687a448635d75088977abf61c3000eeccfe';
// Approved v0.71 scheduler fix preserves a pending starting deadline under the four-hour cap.
// Keep a strict source snapshot for that explicit exception; all other boundaries retain v0.68.
const boundaryBase=file=>file==='random-world-events.js'?'470bb29':base;
// v0.69 evolves the engine/host additively. Preserve the historical scene data
// and the unaffected regional/art/save boundaries, not obsolete whole-app hashes.
for(const file of ['hero-selection.js','hero-proportions.js','save-generation.js','races/ashen/story-core.js','story-c08-scenarios.js','random-world-events.js','war-diplomacy.js','asset-recovery.js'])assert.equal(fs.readFileSync('dist/'+file,'utf8'),execFileSync('git',['show',boundaryBase(file)+':dist/'+file],{encoding:'utf8'}),'unchanged boundary '+file);
// User-authorized v0.78 ring exception: retain every historical state byte;
// only this exact identity-based +20% getter may be appended.
const originalRingState=execFileSync('git',['show',base+':dist/return-ring-state.js'],{encoding:'utf8'});
const experienceAddition="\n// Identity-based, equipped-only; two sockets never multiply the same effect.\nexport function returnRingExperienceBonus(s){return equippedReturnRing(s) ? .2 : 0;}\n";
assert.equal(fs.readFileSync('dist/return-ring-state.js','utf8'),originalRingState+experienceAddition,'ring state: only approved experience getter added');
// Link the content comparator's pinned v0.77 baseline back to the v0.68
// historical boundary, rather than replacing the historical expectation.
assert.equal(execFileSync('git',['show','8d08d0b73f6e765749526b51785880d2a46132a6:dist/return-ring-content.js'],{encoding:'utf8'}),execFileSync('git',['show',base+':dist/return-ring-content.js'],{encoding:'utf8'}));
// The copy-mechanics check below validates all old content fields and the exact
// approved five ordered trace/full-dungeon/recovery contracts.
const ring={id:'identity-test',legendaryId:'return-ring',exclusive:{id:'return-home'}};
for(const equip of [{ring1:ring.id},{ring2:ring.id},{ring1:ring.id,ring2:ring.id}])assert.equal(returnRingExperienceBonus({equip,inventory:[ring]}),.2);
for(const state of [
 {equip:{},inventory:[ring]},
 {equip:{ring1:ring.id},inventory:[]},
 {equip:{ring1:'other'},inventory:[ring]},
 {equip:{ring1:ring.id},inventory:[{...ring,legendaryId:'another-ring'}]},
 {equip:{ring1:ring.id},inventory:[{...ring,exclusive:{id:'another-effect'}}]},
 {equip:{ring1:ring.id},inventory:[{...ring,exclusive:undefined}]},
 {equip:{ring1:'fake'},inventory:[{id:'fake',name:'归途之环'}]}
])assert.equal(returnRingExperienceBonus(state),0,'name/possession alone never grants experience');
// Reviewed copy-only storage changes: every other source byte stays protected.
const currentStorage=fs.readFileSync('dist/storage.js','utf8');
const originalStorage=execFileSync('git',['show',base+':dist/storage.js'],{encoding:'utf8'});
assert.equal(currentStorage,originalStorage
 .replace('存档切代尚未完成，游戏已暂停。请检查浏览器存储后重试；无效新版存档可在设置中清空重开。','无法读取或保存进度，游戏已暂停。请先检查浏览器存储后重试；若存档确已损坏，可在设置中清空重开，这会失去当前进度。')
 .replace('已启用新版独立存档；旧开发进度及备份已清除。','新旅程已开始，进度将保存在此浏览器中。'));
// NPC wording is now authored prose; pinned path-specific invariants protect every
// ID, trigger, objective, reward and effect instead of freezing the old sentences.
execFileSync(process.execPath,['copy-mechanics-invariants-tests.mjs'],{stdio:'inherit'});
const oldScenes=JSON.parse(fs.readFileSync('fixtures/chik-family/v067-scene-hashes.json')).sceneHashes;
const {createHash}=await import('node:crypto');
assert.equal(Object.keys(oldScenes).length,103);
assertOriginalStoryContracts(STORY_SCENES);
assert.equal(RACIAL_NPCS.length,30);assert.equal(RACIAL_NPC_EVENTS.length,60);assert.equal(RETURN_RING_EVENTS.length,5);assert.equal(CHIK_FAMILY_EVENTS.length,6);assert.equal(Object.keys(NPC_EVENTS).length,71);
assert.equal(CHIK_FAMILY_REWARD_POLICY.approved,true);assert.equal(CHIK_FAMILY_REWARD_POLICY.fullArcRewardImplemented,false);
for(const def of CHIK_FAMILY_EVENTS){assert.equal(def.playerRace,'goblin');assert.equal(def.repeatable,false);assert.deepEqual(def.rewards,[{kind:'potion',key:'healing|0',quantity:2}]);}
assert(!NPC_EVENTS[CHIK_FAMILY_MILESTONE.id]);assert(NPC_TASK_REWARD_REGISTRY[CHIK_FAMILY_MILESTONE.id]);assert.deepEqual(CHIK_FAMILY_MILESTONE.rewards,[{kind:'consumable',key:'reforgeToken',quantity:1}]);
for(const id of Object.keys(CHIK_FAMILY_CHARACTERS)){assert(!NPC_EVENTS[id]);assert(!RACIAL_NPCS.some(n=>n.id===id));}
for(const scene of Object.values(STORY_SCENES))for(const line of scene.lines){const actor=storyCastSpeaker(scene,line),family=chikFamilySpeaker(scene,line);assert(!(actor&&family),'one portrait owner per speaking line');if(family)assert(!renderStoryDialogue(scene,line).includes('npcPortraitImage'),'family roster owns its only portrait');if(/^\[/.test(line))assert.equal(actor,null,'stage direction does not borrow a victim portrait');assert.notEqual(actor?.id,'current-dwarf-king');if(scene.id!=='personal.dwarf.coup.07')assert.notEqual(actor?.id,'dwarf-minister');}
assert.equal(renderStoryCastPortrait(STORY_CAST_CHARACTERS['current-dwarf-king']),'');
execFileSync(process.execPath,['tools/sync-story-portrait-crops.mjs','--check'],{stdio:'inherit'});
console.log('PASS v068 bounded scope: canonical103 scene definitions and unchanged save/war/recovery, unchanged30+60 regional cast/events plus5Ring; exactly6 approved one-off family events and separate once-only milestone; one speaker portrait owner, no king live dialogue; minister only in scoped postclear personal confrontation.');
