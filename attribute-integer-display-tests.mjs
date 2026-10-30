import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {formatAttribute,formatAttributePercent} from './dist/attribute-format.js';
import {fresh,stats} from './dist/engine.js';
import {createSkillEffectState,applySkillEffect} from './dist/skill-tree-effects.js';
import {characterStatsSnapshot,renderCharacterStats} from './dist/character-stats-ui.js';
for(const [input,expected] of [[1152.3600000000001,'1152'],[385,'385'],[0,'0'],[1.5,'2'],[1.49,'1'],[-1.6,'-2'],[NaN,'—'],[Infinity,'—'],[undefined,'—']])assert.equal(formatAttribute(input),expected);
assert.equal(formatAttributePercent(1.5),'150%');assert.equal(formatAttributePercent(.298),'30%');
for(const [input,expected] of [[.003,'不足1%'],[.00999,'不足1%'],[0,'0%'],[-0,'0%'],[-.003,'负值（绝对值不足1%）'],[.01,'1%'],[-.01,'-1%']]){assert.equal(formatAttributePercent(input),expected);assert.doesNotMatch(formatAttributePercent(input),/-0%/);}
assert.equal(formatAttribute(-.001),'0');
const app=readFileSync('dist/app.js','utf8');
// Exercise the actual rail expression, with screenshot values, without starting the app.
const rail=app.match(/\$\('stats'\)\.innerHTML=(.*?);\$\('gold'\)/)[1];
const railHtml=vm.runInNewContext(rail,{fmt:formatAttribute,st:{atk:1152.3600000000001,armor:385.6,hp:3018.4},s:{heroHp:1965.8},icon:()=>''});
assert.match(railHtml,/<b>1152<\/b>/);assert.match(railHtml,/<b>386<\/b>/);assert.match(railHtml,/<b>1966\/3018<\/b>/);assert.doesNotMatch(railHtml,/\d\.\d/);
for(const race of ['human','dwarf','elf','goblin','ashen']){
 const s=fresh(race);s.skillTree.mode='active';
 s.activeEncounter={done:false,heroHp:42.75,treeEffects:applySkillEffect(createSkillEffectState(['enemy'],0),'self',{type:'attackUp',amount:17.36,durationMs:3000,sourceId:'test'}).state};
 const before=structuredClone(s),prior=stats(s),snapshot=characterStatsSnapshot(s),html=renderCharacterStats(s);
 assert(!Number.isInteger(snapshot.current.atk),'combat still keeps fractional attack');
 assert.equal(snapshot.hp,42.75);
 const values=[...html.matchAll(/class="attributeRow[^>]*>[\s\S]*?<\/div>/g)].map(m=>m[0]);
 assert(values.length>20);for(const row of values)assert.doesNotMatch(row,/\d\.\d/);
 assert.match(html,/43 \/ /);assert.match(html,/暴击伤害倍率/);assert.match(html,/150% 即一点五倍/);
 assert.deepEqual(s,before);assert.deepEqual(stats(s),prior);assert.deepEqual(characterStatsSnapshot(s),snapshot);
}
// Actual equipment detail/affix renderers retain fractional source values, show integers.
const context={fmt:formatAttribute,LEGENDARY_CODEX:[],affixRollInfo:()=>({tier:0,min:0,max:10,sourceLabel:'测试'}),RARITY:['普通'],esc:String,AFFIX_DEFS:{atk:{name:'攻击'}},SPECIALS:{}};
const affix=app.match(/function affixHtml\(it\)\{[^\n]+/)[0];
const renderAffix=vm.runInNewContext('('+affix+')',context),item={affixes:[{stat:'atk',value:10.5}],divine:true},before=structuredClone(item);
assert.match(renderAffix(item),/\+11/);assert.match(renderAffix(item),/实际 \+12/);assert.deepEqual(item,before);
assert.match(app,/fmt\(it\[k\]\)/);assert.match(app,/fmt\(tot\[k\]\)/);
console.log('PASS integer attributes: screenshot rail, rounding boundaries, percentages/multiplier, all-race full stats, equipment affixes; state and derived combat precision unchanged');
