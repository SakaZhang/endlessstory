import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {equipmentIcon} from './dist/equipment-art.js';
import {icon} from './dist/icons.js';
import {renderCodex} from './dist/codex-ui.js';
import {renderReturnRingRecipe} from './dist/return-ring-ui.js';
import {renderReturnRingEffects} from './dist/return-ring-presentation.js';
import {completeStory} from './story-event-test-fixture.mjs';
import {syncReturnRingRecipe} from './dist/return-ring-state.js';
for(const item of [{legendaryId:'return-ring'},E.legendaryItem('return-ring',20),{legendaryId:'return-ring',slot:'weapon',icon:'hammer'}]){
 const before=JSON.stringify(item);
 for(const size of [32,48,64]){
  const html=equipmentIcon(item,{size});
  assert(html.includes('data-equipment-art="return-ring"'));
  assert(html.includes('aria-label="归途之环"'));
  assert(html.includes('width="'+size+'" height="'+size+'"'));
  assert(html.includes('20,18 44,18'),'existing ring silhouette, never weapon fallback');
  assert(!html.includes('10,10 46,10'),'no hammer geometry');
 }
 assert.equal(JSON.stringify(item),before);
}
const s=completeStory('dwarf');syncReturnRingRecipe(s);
const hidden=renderCodex(s,{tab:'legends',selectedLegend:'return-ring'});
assert(!hidden.includes('data-return-ring-codex'));
assert(!hidden.includes('五族旧物，合为一环'));
assert(!hidden.includes('归途之环'));
const ring=E.legendaryItem('return-ring',20);
s.inventory.push(ring);s.returnRing={version:1,recipeLearned:true,crafted:true,craftedItemId:ring.id};
E.normalizeCodexCollection(s);assert(E.validSave(s));
const before=JSON.stringify(s),html=renderCodex(s,{tab:'legends',selectedLegend:'return-ring'});
assert.equal(JSON.stringify(s),before);
assert.equal((html.match(/data-equipment-art="return-ring"/g)||[]).length,2,'gallery and detail use same ring art');
assert.equal((html.match(/data-material-pixel="true"/g)||[]).length,5);
for(const text of ['经验获取 +20%','恢复15%最大生命','增加3个百分点','双戒指槽不重复叠加','不改变掉落来源','无法重造'])assert(html.includes(text));
assert(renderReturnRingRecipe(s).includes('data-equipment-art="return-ring"'));
assert(renderReturnRingEffects().includes('returnRingPowers'));
s.inventory=s.inventory.filter(it=>it.id!==ring.id);assert(renderCodex(s,{tab:'legends',selectedLegend:'return-ring'}).includes('data-return-ring-codex'));
assert(E.validSave(s));
console.log('PASS ring identity across stubs/old item/forge/inventory/codex; dedicated effect and keepsake layout; hidden DOM, lifetime collection, read-only render.');
