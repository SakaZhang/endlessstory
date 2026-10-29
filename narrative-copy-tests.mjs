import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {NPC_OBJECTIVE_CONTENT} from './dist/npc-objective-content.js';
import {RACIAL_NPC_EVENTS} from './dist/racial-npc-event-content.js';
import {PERSONAL_ARC_CONTENT} from './dist/personal-story-content.js';
import {CHIK_FAMILY_EVENTS} from './dist/chik-family-events.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {assertOriginalStoryContracts} from './story-copy-contract-test-helper.mjs';
const source=JSON.parse(fs.readFileSync('content/racial-npc-events/narrative-polish.json'));
assert.equal(Object.keys(source).length,60);
assert.equal(new Set(Object.values(source).map(p=>p.scene)).size,60,'each errand has an authored scene');
assert.equal(new Set(Object.values(source).map(p=>p.closing)).size,60,'each errand has a distinct response');
for(const e of RACIAL_NPC_EVENTS){assert(e.description.startsWith(source[e.id].scene));assert(e.completion.every(line=>!line.includes('已记录你的选择')));const m=NPC_OBJECTIVE_CONTENT[e.id];assert.equal(m.taskDescription,source[e.id].scene);assert.equal(m.taskDialogue.length,1);assert(!m.taskDialogue[0].includes(source[e.id].scene));assert.equal(m.taskCompletion.at(-1),source[e.id].closing);}
assert.equal(PERSONAL_ARC_CONTENT.length,30);
for(const e of PERSONAL_ARC_CONTENT)assert(e.intro.length>=3,e.id+' concrete scene and dialogue');
assert.equal(CHIK_FAMILY_EVENTS.length,6);
for(const e of CHIK_FAMILY_EVENTS){assert(e.dialogue.length>=5);assert(e.description.length>=70);}
const forbidden=/不限制其他种族穿戴|既定败北演出|不追补成|高伤害也不会|削弱已保存|已完成并记录当前状态|本次交接已记录|只消费已经完成|不重发战利品|不自动成为新的/;
for(const s of Object.values(STORY_SCENES))for(const line of [...s.lines,s.objective,...s.knowledge.map(k=>k.text)])assert(!forbidden.test(line),s.id+' leaked author instruction: '+line);
assertOriginalStoryContracts(STORY_SCENES);
execFileSync(process.execPath,['content/racial-npc-events/build-actionable-objectives.mjs','--check']);
console.log('PASS authored copy: 60 distinct errand scenes and responses, 30 personal openings, 6 expanded family exchanges, story prose leak scan, 103 pinned mainline contracts, generated objective parity.');
