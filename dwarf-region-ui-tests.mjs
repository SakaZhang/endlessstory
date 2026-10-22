import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderDwarfRegion,renderPlannedRoute,renderLegacyHandoff} from './dist/dwarf-region-ui.js';
const nodes=[1,2,3].flatMap(n=>(n===3?['field','dungeon','boss']:['field','dungeon']).map(kind=>({id:`dwarf.a0${n}.${kind}`,name:`区域${n}-${kind}`,kind,areaNumber:n,areaId:`dwarf.a0${n}`,levelRange:[(n-1)*10+1,n*10],unlocked:n===1,budgetReady:true,readyAt:0,fieldId:`dwarf.a0${n}.field`})));let h=renderDwarfRegion(nodes,{selectedArea:1});assert(h.includes('data-planned-node="dwarf.a01.field"'));assert(h.includes('data-planned-node="dwarf.a01.dungeon"'));assert(!h.includes('data-dungeon='));assert(!h.includes('blackforge-road'));assert(h.includes('区域 10'));assert(h.includes('尚未开放'));h=renderDwarfRegion(nodes,{selectedArea:3});assert(h.includes('data-planned-node="dwarf.a03.boss" disabled'));assert(h.includes('首领副本 · 手动挑战'));assert(h.includes('先通关前一区域普通副本'));
const locked=structuredClone(nodes);locked[0].budgetReady=false;h=renderDwarfRegion(locked);assert(h.includes('配置准备中 · 暂不可出发'));
const s={expedition:{mode:'dungeon',fieldId:'dwarf.a01.field',targetInstanceId:'dwarf.a01.dungeon',loop:true}};h=renderPlannedRoute(nodes,s,{now:100});assert(h.includes('value="dwarf.a01.field" selected'));assert(!h.includes('value="dwarf.a02.field"'));assert(h.includes('aria-pressed="true"'));assert(h.includes('data-planned-node="dwarf.a01.dungeon"'));assert(h.includes('首领只手动挑战'));
const cooling=structuredClone(nodes);cooling[1].readyAt=301000;h=renderPlannedRoute(cooling,s,{now:1000});assert(h.includes('副本冷却 5:00'));assert(h.includes('id="dungeonBtn" disabled'));
h=renderPlannedRoute(nodes,{...s,contentMigration:{legacyDrain:true}});assert(h.includes('旧旅程正在收尾'));assert(!h.includes('data-dungeonloop'));assert(renderLegacyHandoff({reselectRequired:true}).includes('不会自动前往更强的区域'));
assert(renderDwarfRegion(nodes,{highestUnlocked:4}).includes('已解锁 · 待开放'));
const css=fs.readFileSync(new URL('./dist/dwarf-region-ui.css',import.meta.url),'utf8');assert(css.includes('@media(max-width:650px)'));assert(css.includes('.plannedNodeTray{grid-template-columns:1fr}'));
console.log('PASS planned dwarf UI:7node contract/3areas, locked/budget/cooldown states, manual boss, fallbackfield options, futureunavailable labels, legacyhandoff, mobilelayout.');

for(const [area,range] of [[1,'3–7'],[2,'13–17'],[3,'23–27']])assert(renderDwarfRegion(nodes,{selectedArea:area}).includes('装备Lv.'+range));
