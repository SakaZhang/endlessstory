import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {PERSONAL_ARC_CONTENT} from './dist/personal-story-content.js';
import {renderStoryEventBoard} from './dist/story-event-ui.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
// Author-facing constraints belong in source comments/tests, not player prose.
// Ordinary character disagreement and meaningful safety instructions stay legal.
const leaked=/不是五人提前结盟|调查不是通关钥匙|没有收到异地刻纹报告|不假装亲见异地交手|只记任务持有|不复制装备|不记作全部货物追回|这是非致命剧情交手|两件核心不交换|奇克不是族群代表|不跳过持续战事|本场不是击杀大祭司|这是可胜的真实战斗|这不是保证关闭门户|成功撤离不等于阻止仪式|暂不确认支撑数量|不代表莱姆斯已经知道动机|迟来的交谈不预设|既有经历不改写|不会倒放旧粮路|无需补做可选调查|不在中央战斗列表|只重试本战斗检查点/;
function textLeaves(value){if(typeof value==='string')return [value];if(Array.isArray(value))return value.flatMap(textLeaves);if(value&&typeof value==='object')return Object.values(value).flatMap(textLeaves);return [];}
for(const d of Object.values(STORY_SCENES))for(const line of [d.objective,...d.lines,...textLeaves(d.choices),d.lateIntro??''])assert(!leaked.test(line),d.id+': '+line);
for(const d of PERSONAL_ARC_CONTENT)for(const line of textLeaves(d))assert(!leaked.test(line),d.id+': '+line);
assert(!leaked.test(fs.readFileSync('dist/story-event-ui.js','utf8')));
for(const race of ['human','dwarf','elf','goblin','ashen'])assert.equal(STORY_SCENES['C08.X03.'+race].objective,'走近主祭坛，听大祭司说下去。');
assert(!STORY_SCENES['C07.EA03.elf'].objective.includes('将被封印'),'objective must not announce the next scene before the encounter');
for(const race of ['human','dwarf','elf','goblin','ashen']){
 const d=STORY_SCENES['C08.X01.'+race];assert.match(d.objective,/说清追踪的方向/);
 if(race==='elf')assert(!d.objective.startsWith('与莱姆斯'));
 if(race==='ashen')assert(!d.objective.includes('与砾恩'));
 const state=reachStoryScene(race,d.id),before=JSON.stringify(state),html=renderStoryEventBoard(state);
 assert(html.includes(d.objective));assert(!leaked.test(html));assert.equal(JSON.stringify(state),before,'render is read only');
}
assert(STORY_SCENES['C01.X01.human'].lines.some(x=>x.includes('这不是你们垒的。')),'legitimate character negation preserved');
assert(PERSONAL_ARC_CONTENT.find(x=>x.id==='personal.elf.heir.04').intro.some(x=>x.includes('不能要求你们因此原谅我')),'character boundaries preserved');
console.log(`PASS story player prose: ${Object.keys(STORY_SCENES).length} scene/${PERSONAL_ARC_CONTENT.length} personal catalogs, all five C08 post-seal rendered boards, no author-note leaks, valid character disagreement retained, read-only rendering.`);
