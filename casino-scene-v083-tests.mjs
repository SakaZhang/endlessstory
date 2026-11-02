import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {casinoFixture} from './casino-test-fixture.mjs';
import {renderCasino} from './dist/casino-ui.js';
import {PLAYABLE_RACES} from './dist/race-registry.js';
const asset=readFileSync('dist/service-assets/casino-hall-v083.webp');
assert.equal(asset.subarray(0,4).toString(),'RIFF');
assert.equal(asset.subarray(8,12).toString(),'WEBP');
assert(asset.length<600000,'scene budget stays below 600 KB');
for(const race of PLAYABLE_RACES){
 const {game}=casinoFixture({race});const before=structuredClone(game);const html=renderCasino(game);
 assert.match(html,/class="casinoHall" aria-labelledby="casinoHallTitle"/);
 assert.match(html,/service-assets\/casino-hall-v083\.webp/);
 assert.match(html,/alt="烛火照亮石砌赌厅/);
 assert.match(html,/id="casinoHallTitle">命运赌桌/);
 assert.match(html,/按当前角色种族抽取装备/);
 assert.doesNotMatch(html,/虚魂|⚄|左侧/);
 assert.equal((html.match(/<strong>33%<\/strong>/g)||[]).length,3);
 assert.match(html,/<strong>1%<\/strong>/);
 assert.match(html,/100金币/);assert.match(html,/角色等级±2/);assert.match(html,/保存失败不扣费/);
 assert.deepEqual(game,before,'read-only scene cannot mutate gameplay');
}
const css=readFileSync('dist/casino-ui.css','utf8');
assert.match(css,/#dock\{grid-template-columns:repeat\(9,minmax\(0,1fr\)\)\}/);
assert.match(css,/@media\(max-width:600px\).*repeat\(3,minmax\(0,1fr\)\)/s);
assert.match(css,/object-position:center/);assert.match(css,/image-rendering:pixelated/);
console.log('v0.83 casino scene: five race renderings, pure state, odds/copy, asset and responsive contracts pass');
