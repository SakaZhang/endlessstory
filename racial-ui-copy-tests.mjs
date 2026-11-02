import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fresh} from './dist/engine.js';
import {renderLuckRates,rareLootSnapshot} from './dist/rare-loot-ui.js';
import {ordinarySecondRollProbability} from './dist/luck-policy.js';
const read=path=>readFileSync(path,'utf8');
const index=read('dist/index.html');assert.match(index,/>天赋 <b id="talentCount"/);assert.doesNotMatch(index,/黑炉氏族|血脉天赋/);assert.match(index,/v0\.84/);
for(const path of ['dist/app.js','dist/rare-loot-ui.js','dist/adjacent-region.js','dist/dwarf-region-ui.js'])assert.doesNotMatch(read(path),/黑炉血脉|DWARVEN LEGACY|黑炉锻坊|推荐等级不是进入限制|不是掉率增加|不限制其他种族穿戴/,path);
// Race-specific world names and art are intentionally retained.
assert.match(read('dist/dwarf-region-ui.js'),/黑炉山脉/);assert.match(read('dist/equipment-templates.js'),/黑炉板甲/);
const pct=n=>(n*100).toFixed(4).replace(/0+$/,'').replace(/\.$/,'')+'%';
for(const race of ['human','dwarf','elf','goblin','ashen'])for(const luck of [0,18,21,100]){
 const s=fresh(race);s.talents.luck=luck;const before=JSON.stringify(s),originalRandom=Math.random;let html;
 Math.random=()=>{throw Error('UI must not draw random numbers');};try{html=renderLuckRates(s);}finally{Math.random=originalRandom;}
 const snap=rareLootSnapshot(s);for(const chance of [snap.dungeonRate,snap.bossRate,ordinarySecondRollProbability(snap.luck)])assert(html.includes(pct(chance)),race+' actual '+chance);
 assert.equal(JSON.stringify(s),before);assert.doesNotMatch(html,/不是|并非|不决定|不提高|只计算一次/);
}
execFileSync(process.execPath,['racial-ui-copy-app-tests.cjs'],{stdio:'inherit'});
console.log('PASS five-race concise UI copy, initial neutral identity, actual probabilities, read-only RNG/save invariants and preserved named dwarf world content');
