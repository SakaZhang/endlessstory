import assert from 'node:assert/strict';
import {renderMonsterPixelPortrait} from './dist/monster-pixel-portrait.js';
import {DWARF_MONSTER_INFO} from './dist/dwarf-material-catalog.js';
import {MONSTER_CATALOG} from './dist/monster-codex-schema.js';
import {monsterPortrait,renderMonsterDetail,renderMonsterCodex} from './dist/monster-codex-ui.js';
import {renderEnemyRoster,normalizeBattleEnemies} from './dist/multi-battle-ui.js';
const graphics=new Set(),silhouettes=new Set(),s={monsterLedger:{version:1,encountered:{}}};
for(const m of DWARF_MONSTER_INFO){
 const svg=renderMonsterPixelPortrait(m.id),portrait=monsterPortrait(m.id);assert(svg);assert.equal(portrait,svg);graphics.add(svg);
 const silhouette=monsterPortrait(m.id,{known:false});silhouettes.add(silhouette);assert(silhouette.includes('monsterSilhouette'));assert(!silhouette.includes(m.id));assert(!silhouette.includes(m.name));assert(!renderMonsterDetail(s,m.id).includes(m.name));
 const e={id:'test',targetId:'unit',enemies:[{id:'unit',definitionId:m.id,name:m.name,hp:70,maxHp:90,enemyShield:8,main:true,burn:2}]},before=JSON.stringify(e),model=normalizeBattleEnemies(e,1000);const html=renderEnemyRoster(e,{now:1000});assert(html.includes(svg));assert(html.includes('data-enemy-target="unit"'));assert(html.includes('data-monster-detail="'+m.id+'"'));assert(html.includes('盾 8'));assert(html.includes('灼烧'));assert.equal(JSON.stringify(e),before);assert.equal(model[0].hp,70);
 s.monsterLedger.encountered[m.id]=true;assert(renderMonsterDetail(s,m.id).includes(svg));
}
assert.equal(graphics.size,44);assert.equal(silhouettes.size,1);
const empty={monsterLedger:{version:1,encountered:{}}};assert(!renderMonsterCodex(empty).includes('怪物像素画像'));assert(monsterPortrait('grayflag-raider').includes('monsterPixelUnavailable'));assert(monsterPortrait('grayflag-raider',{known:false}).includes('monsterSilhouette'));assert(monsterPortrait('not-registered').includes('monsterPixelUnavailable'));assert.equal(Object.keys(MONSTER_CATALOG).length,224);
console.log('PASS44 exact production PNG portraits in codex/roster, distinct identities/one anonymous unknown, legacy unavailable, controls/status/state unchanged.');
