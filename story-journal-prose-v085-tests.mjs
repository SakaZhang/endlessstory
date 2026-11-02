import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_SCENARIOS} from './dist/story-scenario-registry.js';
import {storyJournalText,storyPlayerText,STORY_JOURNAL_COPY_IDS} from './dist/story-journal-copy.js';
import {renderStoryKnowledge,renderStoryEventBoard} from './dist/story-event-ui.js';
import {storyScenarioObjective} from './dist/story-scenario-combat.js';
import {validSave} from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
const leaked=/永久队伍|任务道具解除核心的声响|仍不知道.{0,3}惧死|古代身份|独立记录印证|并不代表和解|尚不能确认四座|一次性旧物丢失后无法补领|不是另一座中央祭坛|尚无私卖|资金闭环|未转移|不表示|战术检查点|不判通关|主线已找齐|未向信使公开私密对白/;
let records=0;for(const d of Object.values(STORY_SCENES))for(const k of [...d.knowledge,...d.choices.flatMap(c=>c.knowledge??[])]){assert(!leaked.test(storyJournalText(k)),k.id+': '+storyJournalText(k));records++;}
for(const [id,d] of Object.entries(STORY_SCENARIOS)){const row=storyScenarioObjective({round:1,storyScenario:{id,result:d.result}});assert(!leaked.test(row.objective+' '+row.outcome),id);assert.equal(storyPlayerText(row.outcome),row.outcome);}
const old=[...JSON.parse(fs.readFileSync('fixtures/v070-active-story.json')).cases,...JSON.parse(fs.readFileSync('fixtures/v070-active-finale.json')).cases];
for(const {state:s} of old){const before=JSON.stringify(s);assert(validSave(s));const html=renderStoryKnowledge(s);assert(!leaked.test(html),'historical journal');assert.equal(JSON.stringify(s),before);assert(validSave(s));for(const k of s.story.knowledge){assert(html.includes(storyJournalText(k).replaceAll('&','&amp;')));}}
for(const race of ['human','dwarf','elf','goblin','ashen']){
 const s=reachStoryScene(race,'C08.X05.'+race,{finishTarget:true}),before=JSON.stringify(s),html=renderStoryKnowledge(s);
 assert(validSave(s));assert(!leaked.test(html));assert(html.includes('寿命将尽'));assert(html.includes('砾恩认出'));assert.equal(JSON.stringify(s),before);
 if(race==='goblin'){fs.mkdirSync('qa/journal-v085',{recursive:true});fs.writeFileSync('qa/journal-v085/old-ledger-goblin.json',JSON.stringify(s));fs.writeFileSync('qa/journal-v085/rendered.html',html);}
 const pre=reachStoryScene(race,race==='elf'?'C07.E01.elf':race==='ashen'?'C07.A01.ashen':'C07.O01.'+race);assert(!renderStoryEventBoard(pre).includes('推进至界外入侵后'),'no future-war spoiler');
}
assert.equal(storyJournalText({id:'future.unknown',text:'原有未知记录'}),'原有未知记录');
const legacy={id:'C08.O01.goblin.k0',text:'内部传来两次战斗声，最后传来任务道具解除核心的声响；莱姆斯从内部打开通道。',mode:'heard'};
assert(!storyJournalText(legacy).includes('稳住'),'old hearsay does not invent participation');assert(storyJournalText(legacy).includes('声响'));
const corrupt=structuredClone(old[0].state);if(corrupt.story.knowledge.length){corrupt.story.knowledge[0].text+=' forged';assert(!validSave(corrupt));assert.equal(renderStoryKnowledge(corrupt),'');}
console.log(`PASS ${records} journal records (${STORY_JOURNAL_COPY_IDS.length} canonical display entries), ${old.length} historical saves, all five C08 routes, read-only ledger/POV, scenario text and no future-war spoilers.`);
