import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const root=process.env.ELF_HOST_ROOT??new URL('../../../',import.meta.url).pathname;const E=await import(pathToFileURL(root+'/dist/engine.js'));const {RACE_PACK:p}=await import(pathToFileURL(root+'/dist/races/elf/index.js'));
const now=10000;function setup(){const s=E.fresh('elf');s.level=100;E.normalizeHealth(s,now);E.normalizeExpedition(s);s.skillTree.presets[0].unlocked=p.tree.nodes.map(n=>n.id);s.lastSeen=s.lastHealthClock=now;s.restUntil=0;s.nextBattleAt=0;s.heroHp=E.stats(s).hp;return s;}
const results=[];
for(const skillId of Object.keys(p.skills))for(const weaponType of ['bow','staff','axe']){
 const s=setup();let weapon;for(let n=0;n<120&&!weapon;n++){const it=E.item('weapon',30,null,0,{originRace:weaponType==='axe'?'dwarf':'elf'});if(it.weaponType===weaponType)weapon=it;}assert(weapon,weaponType);s.inventory.push(weapon);assert(E.equipItem(s,weapon.id));s.skillTree.presets[0].active=[skillId,null,null,null];s.heroHp=E.stats(s).hp;assert(E.validSave(s),'pre '+skillId);
 const e=E.startInstanceEncounter(s,'elf.a01.field',now);assert(e);for(const u of e.enemies){u.hp=u.max=1000000;u.atk=0;u.elementalPower=0;}e.heroHp=s.heroHp=E.stats(s).hp*.5;if(skillId==='elf.clear_moon'){e.heroBurn=1;e.heroBurnPower=1;}
 let cast=false,logs=[];for(let i=1;i<=8&&!e.done;i++){logs.push(...E.step(s,e,now+i*1100));if(e.lastCast?.skillId===skillId){cast=true;break;}}
 assert(cast,'no actual cast '+skillId+'/'+weaponType+' '+JSON.stringify({last:e.lastCast,logs}));assert(E.validSave(s),'save '+skillId+'/'+weaponType);assert(E.validSave(JSON.parse(JSON.stringify(s))),'roundtrip '+skillId);
 const hits=e.lastCast.hits??[];if(p.skills[skillId].scope!=='self')assert(hits.length,'damage resolved '+skillId);results.push({skillId,weaponType,hitCount:hits.length,heroHp:e.heroHp,runtime:e.raceRuntime});
}
const nodes=E.plannedNodes(setup()).filter(n=>n.id.startsWith('elf.'));assert.equal(nodes.length,24);
for(const node of nodes){const s=setup();s.areaProgress.elf={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9,10]};const e=E.startInstanceEncounter(s,node.id,now);assert(e,node.id);assert(e.enemies.every(u=>u.monsterId.startsWith('elf.')),node.id);E.step(s,e,now+1100);assert(E.validSave(s),node.id+' save');assert(E.validSave(JSON.parse(JSON.stringify(s))),node.id+' roundtrip');}
console.log(JSON.stringify({ok:true,actualEnginePlans:results.length,nodes:nodes.length,results}));
