import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {RACE_PACK as P} from './dist/races/ashen/index.js';
import {LEGENDARY_DROP_CANDIDATES,prepareLegendaryDrop} from './dist/legendary-drop.js';
import {dispatchRacialLegendaryEvent as dispatch,advanceRacialLegendaryClock as advance} from './dist/racial-legendary-runtime.js';
import {grantAshenStoryCore} from './dist/races/ashen/story-core.js';
import {equipmentIcon} from './dist/equipment-art.js';
const ids=['ashen-molten-core','ashen-stone-core','ashen-crystal-core'];
assert.deepEqual(LEGENDARY_DROP_CANDIDATES.ashen.map(x=>x.id),ids);
for(let j=0;j<3;j++){let rolls=[.049,(j+.5)/3];const receipt=prepareLegendaryDrop({settlementId:'test'+j,nodeId:'ashen.a01.boss',regionRace:'ashen',kind:'boss',won:true},{probability:.05,random:()=>rolls.shift()});assert.equal(receipt.legendaryId,ids[j]);}
for(const id of [...ids,'ashen-primal-core']){const it=E.legendaryItem(id,40);assert(it);assert.equal(it.slot,'core');assert.equal(it.affixes.length,id.endsWith('primal-core')?0:4);assert(equipmentIcon(it).includes('equipment-'+id+'.png'));for(const race of ['ashen','human','elf','goblin','dwarf']){const s=E.fresh(race);s.inventory.push(it);assert.equal(E.equipItem(s,it.id),race==='ashen');assert(E.validSave(s));}}
assert.equal(E.legendaryItem('ashen-veinbreaker',40),null);assert.equal(E.legendaryItem('ashen-dusk-prism',40),null);
function equipped(id){const s=E.fresh('ashen'),it=E.legendaryItem(id,40);s.inventory.push(it);assert(E.equipItem(s,it.id));return {s,it};}
const {s,it}=equipped(ids[0]),base=E.baseStats(s).atk;
const spend=amount=>dispatch(s,{type:'resourceSpend',resource:'heat',amount},{maxHp:1000});
spend(29);assert.equal(E.baseStats(s).atk,base);spend(1);assert.equal(E.baseStats(s).atk,base*1.2);assert.equal(s.legendaryRuntime.byId[it.id].state.expiresAt,6000);
advance(s,1000);spend(65);assert.equal(E.baseStats(s).atk,base*1.6);assert.equal(s.legendaryRuntime.byId[it.id].state.expiresAt,18000);assert.equal(s.legendaryRuntime.byId[it.id].state.remainder,5);spend(30);assert.equal(s.legendaryRuntime.byId[it.id].state.expiresAt,24000);assert.equal(E.baseStats(s).atk,base*1.6);advance(s,23000);assert.equal(E.baseStats(s).atk,base);spend(25);assert.equal(E.baseStats(s).atk,base*1.2);assert(E.validSave(s));
const replacement=E.item('core',40,null,0,{originRace:'ashen'});s.inventory.push(replacement);assert(E.equipItem(s,replacement.id));assert(!s.legendaryRuntime.byId[it.id]);assert(E.equipItem(s,it.id));assert.equal(E.baseStats(s).atk,base);
const rock=equipped(ids[1]);assert.deepEqual(dispatch(rock.s,{type:'shieldBreak',sourceKind:'expiry',broken:true},{maxHp:1000}),[]);let cmds=dispatch(rock.s,{type:'shieldBreak',sourceKind:'enemy-direct',broken:true},{maxHp:1000});assert.equal(cmds[0].amount,2);assert.equal(cmds[1].amount,40);assert.deepEqual(dispatch(rock.s,{type:'shieldBreak',sourceKind:'enemy-direct',broken:true},{maxHp:1000}),[]);advance(rock.s,8000);assert.equal(dispatch(rock.s,{type:'shieldBreak',sourceKind:'enemy-direct',broken:true},{maxHp:1000}).length,2);
const crystal=equipped(ids[2]);assert.deepEqual(dispatch(crystal.s,{type:'combatTick'},{targetId:'enemy'}),[]);advance(crystal.s,30000);assert.deepEqual(dispatch(crystal.s,{type:'combatTick'},{targetId:'enemy'}),[]);assert.equal(crystal.s.legendaryRuntime.byId[crystal.it.id].state.readyAt,30000,'cooldown only consumed by real committed equipment active');
const primal=equipped('ashen-primal-core'),doubled=E.baseStats(primal.s).atk;primal.s.skillTree.presets[0].active[0]='ashen.kindle';assert.equal(E.baseStats(primal.s).atk,doubled/2);primal.s.skillTree.presets[0].active[0]=null;primal.s.skillTree.presets[0].passive[0]='anything';assert.equal(E.baseStats(primal.s).atk,doubled/2);primal.s.skillTree.presets[0].passive[0]=null;assert.equal(E.baseStats(primal.s).atk,doubled);
assert.equal(grantAshenStoryCore(E.fresh('ashen'),{questId:'invented'}).reason,'story-unavailable');assert.equal(grantAshenStoryCore(primal.s,{}).reason,'already-granted');assert.equal(grantAshenStoryCore(E.fresh('dwarf'),{}).reason,'wrong-race');
console.log('PASS Ashen core pool, factory, metadata, race equip restrictions, original-power slots, molten exact stacks/time/remainder/reset, rock CD, crystal timing/beam contract, guarded story grant.');
