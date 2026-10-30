// Fixed lawful loadouts; no potions, specials, sets, boss edits or forced outcomes.
import fs from 'node:fs';import assert from 'node:assert/strict';
import * as E from './dist/engine.js';import {equipTestLoadout} from './equipped-test-fixture.mjs';import {getSkillTreeDefinition} from './dist/race-registry.js';import {skillPresetCost} from './dist/skill-tree-state.js';import {setCombatDisplayObserver} from './dist/combat-display-bridge.js';
const sets={dwarf:['fracture_strike','fault_sweep','forge_breath'],human:['human.cut','human.red_sweep','human.field_dressing'],elf:['elf.twin_arrow','elf.hunter_mark','elf.dew_mending'],goblin:['goblin.venom_cut','goblin.spore_fan','goblin.mire_seal','goblin.patch_ration'],ashen:['ashen.kindle','ashen.vent','ashen.salve']};
const out=process.argv[2]??'/tmp/goblin-before.json',rows=[];Date.now=()=>1700000000000;
for(const level of [30,60,100])for(const quality of [0,2]){
 let rng=731+level+quality;Math.random=()=>((rng=Math.imul(rng,1664525)+1013904223>>>0)/4294967296);
 const gear=E.fresh('human');gear.level=level;equipTestLoadout(gear,{level,quality,clean:quality===0,weaponType:null});for(const it of gear.inventory)it.special=null;
 for(const race of Object.keys(sets))for(const kind of ['field','dungeon','boss']){
 const trials=[];
 for(let seed=1;seed<=10;seed++){
 rng=seed*7919;const s=E.fresh(race);s.level=level;s.inventory=structuredClone(gear.inventory);for(const socket of Object.keys(gear.equip))s.equip[socket]=gear.equip[socket];
 const tree=getSkillTreeDefinition(race),unlocked=new Set();const add=id=>{tree.nodes.find(n=>n.id===id).requires.forEach(add);unlocked.add(id);};sets[race].forEach(add);Object.assign(s.skillTree.presets[0],{unlocked:[...unlocked],active:[...sets[race],...Array(4-sets[race].length).fill(null)]});
 s.talents.healing=10;s.talents.power=10;E.normalizeHealth(s,s.lastSeen);s.heroHp=E.stats(s).hp;s.restUntil=0;s.areaProgress=Object.fromEntries(E.RACE_KEYS.map(r=>[r,{unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]}]));assert(E.validSave(s));
 const node=`human.a${String(level/10).padStart(2,'0')}.${kind}`,e=E.startInstanceEncounter(s,node,s.lastSeen);assert(e,node);let damage=0,poison=0,maxStacks=0,stackSamples=0,samples=0,full=0,firstFull=null;
 const detach=setCombatDisplayObserver(e,ev=>{if(ev.targetId!=='hero'&&ev.hpDelta<0){damage-=ev.hpDelta;if(ev.kind==='poison')poison-=ev.hpDelta;}});
 while(!e.done&&e.round<1500){E.step(s,e,s.nextActionAt);for(const u of e.enemies.filter(u=>u.hp>0)){const n=e.treePoison?.[u.id]?.layers.length??0;maxStacks=Math.max(maxStacks,n);stackSamples+=n;samples++;if(n===5){full++;firstFull??=e.round*1.1;}}}detach();assert(e.done);assert(E.validSave(s));trials.push({win:!!e.win,seconds:e.round*1.1,poisonShare:damage?poison/damage:0,maxStacks,meanStacks:samples?stackSamples/samples:0,fullShare:samples?full/samples:0,firstFull,cost:skillPresetCost(s.skillTree.presets[0],tree),stats:E.stats(s)});
 }
 const avg=k=>trials.reduce((n,r)=>n+r[k],0)/trials.length;rows.push({race,level,quality,kind,wins:trials.filter(r=>r.win).length,trials:trials.length,meanSeconds:avg('seconds'),meanPoisonShare:avg('poisonShare'),meanMaxStacks:avg('maxStacks'),meanStacks:avg('meanStacks'),fullStackSampleShare:avg('fullShare'),firstFullSeconds:trials.filter(r=>r.firstFull!==null).map(r=>r.firstFull),cost:trials[0].cost,atk:trials[0].stats.atk,hp:trials[0].stats.hp,armor:trials[0].stats.armor});
 }
}fs.writeFileSync(out,JSON.stringify({method:'10 paired seeds; identical generated human gear per level/quality across races; no special/sets;20 lawful talent points; legal prerequisite skills; human same-level actual nodes; no potions; dungeon measures first encounter stage, not entire run; seconds are time to terminal (not TTK on losses)',rows},null,2));console.log(out,rows.length);
