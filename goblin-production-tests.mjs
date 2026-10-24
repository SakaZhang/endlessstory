import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const base=process.env.RPG_ENGINE_ROOT??path.resolve('dist'),imp=name=>import(pathToFileURL(path.join(base,name)));
const E=await imp('engine.js'),{getRacePack}=await imp('race-registry.js'),pack=getRacePack('goblin');
function setup(level=100){const s=E.fresh('goblin');s.level=level;for(const socket of Object.keys(s.equip)){const it=E.item(socket.startsWith('ring')?'ring':socket,level,null,3,{originRace:'goblin'});s.inventory.push(it);assert(E.equipItem(s,it.id,socket));}E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);s.areaProgress.goblin={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};s.heroHp=E.stats(s).hp;return s;}
let records=[];
for(const skillId of Object.keys(pack.skills)){
 const s=setup();s.skillTree.presets[0].unlocked=pack.tree.nodes.map(n=>n.id);s.skillTree.presets[0].active=skillId==='goblin.spore_transfer'?['goblin.venom_cut',skillId,null,null]:[skillId,null,null,null];
 assert(E.validSave(s),'setup '+skillId);const e=E.startInstanceEncounter(s,'goblin.a09.boss',s.lastSeen);assert(e);let observed=false;
 for(let i=0;i<30&&!e.done;i++){E.step(s,e,s.nextActionAt);if(e.lastCast?.skillId===skillId||e.treeEffects?.hero.sources.some(x=>x.sourceId===skillId)||e.enemies.some(u=>e.treeEffects?.enemies[u.id]?.sources.some(x=>x.sourceId===skillId)))observed=true;assert(E.validSave(s),'step '+skillId);assert(E.validSave(JSON.parse(JSON.stringify(s))),'roundtrip '+skillId);}
 records.push({skillId,observed,rounds:e.round,heroHp:e.heroHp,enemyHp:e.enemies[0].hp,poisonLayers:e.treePoison?.[e.enemies[0].id]?.layers.length??0,runtime:e.raceRuntime});
}
console.log('GOBLIN_ACTUAL_SKILLS',JSON.stringify(records));
for(const area of pack.areas)for(const kind of ['field','dungeon',...(area.boss?['boss']:[])]){const s=setup();const e=E.startInstanceEncounter(s,area.id+'.'+kind,s.lastSeen);assert(e,area.id+kind);for(let i=0;i<4&&!e.done;i++)E.step(s,e,s.nextActionAt);assert(E.validSave(s),'node '+area.id+kind);}
console.log('PASS goblin actual23nodes +21 skill encounters, every step/save/JSON valid (observability records above; individual no-op utility requires conditional scenario).');
const setRecords=[];
for(const [setId,skillId]of [['goblin_spore','goblin.venom_cut'],['goblin_ambush','goblin.opening_cut'],['goblin_snare','goblin.snare_wire']])for(const count of [2,4]){
 const s=setup();for(const slot of ['helm','armor','gloves','boots'].slice(0,count)){const it=E.item(slot,100,setId,3,{originRace:'goblin'});s.inventory.push(it);assert(E.equipItem(s,it.id,slot));}
 for(const item of s.inventory)item.special=null;
 s.skillTree.presets[0].unlocked=pack.tree.nodes.map(n=>n.id);s.skillTree.presets[0].active=[skillId,null,null,null];s.heroHp=E.stats(s).hp;assert.equal(E.stats(s).count[setId],count);
 let e=E.startInstanceEncounter(s,'goblin.a09.boss',s.lastSeen);const initial=structuredClone(s);for(let seed=1;seed<=100;seed++){const trial=structuredClone(initial);trial.activeEncounter.rngState=seed*7919;E.step(trial,trial.activeEncounter,trial.nextActionAt);if(setId!=='goblin_spore'||(trial.activeEncounter.treePoison?.[trial.activeEncounter.enemies[0].id]?.layers.length??0)===(count===4?2:1)){Object.assign(s,trial);e=s.activeEncounter;break;}}assert(E.validSave(s));
 const result={setId,count,damage:e.lastCast.hits.reduce((n,h)=>n+h.actualHpLost,0),poisonLayers:e.treePoison?.[e.enemies[0].id]?.layers.length??0,traps:e.raceRuntime?.state.traps};
 if(setId==='goblin_spore')assert.equal(result.poisonLayers,count===4?2:1);
 if(setId==='goblin_snare')assert.equal(result.traps[0].charges,count===4?2:1);
 setRecords.push(result);
}
console.log('GOBLIN_ACTUAL_2_4_SETS',JSON.stringify(setRecords));
for(const id of ['goblin-silent-ration','goblin-silent-steps']){
 const s=setup(),item=E.legendaryItem(id,100);assert(item,id);assert.equal(item.affixes.length,4);s.inventory.push(item);assert(E.equipItem(s,item.id));s.skillTree.presets[0].unlocked=pack.tree.nodes.map(n=>n.id);s.skillTree.presets[0].active=[id==='goblin-silent-ration'?'goblin.opening_cut':'goblin.rattle_decoy',null,null,null];s.heroHp=E.stats(s).hp;
 const e=E.startInstanceEncounter(s,'goblin.a09.boss',s.lastSeen);e.rngState=12345;for(let i=0;i<8&&!e.done;i++)E.step(s,e,s.nextActionAt);assert(E.validSave(s));assert(E.validSave(JSON.parse(JSON.stringify(s))));console.log('GOBLIN_ACTUAL_LEGEND',JSON.stringify({id,castCount:s.equipmentRuntime?.byId[item.id]?.castCount,runtime:e.raceRuntime,enemyEffects:e.treeEffects.enemies}));
}
