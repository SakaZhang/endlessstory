import assert from 'node:assert/strict';
import {dwarfMonsterSvg} from './dist/dwarf-monster-art.js';
import {DWARF_MONSTER_INFO} from './dist/dwarf-material-catalog.js';
import {MONSTER_CATALOG} from './dist/monster-codex-schema.js';
import {monsterPortrait,renderMonsterDetail,renderMonsterCodex} from './dist/monster-codex-ui.js';
import {renderEnemyRoster,normalizeBattleEnemies} from './dist/multi-battle-ui.js';
const graphics=new Set(),silhouettes=new Set(),s={monsterLedger:{version:1,encountered:{}}};
for(const m of DWARF_MONSTER_INFO){
 const svg=dwarfMonsterSvg(m.id,{known:true,size:112}),portrait=monsterPortrait(m.id);assert(svg);assert.equal(portrait,svg.replace('<svg ','<svg class="monsterPortrait " '));graphics.add(svg);
 const silhouette=monsterPortrait(m.id,{known:false});silhouettes.add(silhouette);assert(silhouette.includes('monsterSilhouette'));assert(!silhouette.includes(m.id));assert(!silhouette.includes(m.name));assert(!renderMonsterDetail(s,m.id).includes(m.name));
 const e={id:'test',targetId:'unit',enemies:[{id:'unit',definitionId:m.id,name:m.name,hp:70,maxHp:90,enemyShield:8,main:true,burn:2}]},before=JSON.stringify(e),model=normalizeBattleEnemies(e,1000);const html=renderEnemyRoster(e,{now:1000});assert(html.includes(svg));assert(html.includes('data-enemy-target="unit"'));assert(html.includes('data-monster-detail="'+m.id+'"'));assert(html.includes('盾 8'));assert(html.includes('灼烧'));assert.equal(JSON.stringify(e),before);assert.equal(model[0].hp,70);
 s.monsterLedger.encountered[m.id]=true;assert(renderMonsterDetail(s,m.id).includes(svg.replace('<svg ','<svg class="monsterPortrait " ')));
}
assert.equal(graphics.size,26);assert.equal(silhouettes.size,1);
const empty={monsterLedger:{version:1,encountered:{}}};assert(!renderMonsterCodex(empty).includes('怪物像素画像'));assert(monsterPortrait('grayflag-raider').includes('viewBox="0 0 48 48"'));assert(monsterPortrait('grayflag-raider',{known:false}).includes('monsterSilhouette'));assert.equal(monsterPortrait('not-registered'),'');assert.equal(Object.keys(MONSTER_CATALOG).length,33);
console.log('PASS 26 shared production monster SVG portraits: exact scene geometry adapter in codex/roster, 26 distinct/one anonymous silhouette, legacy fallback, controls/status/state unchanged.');
