// v0.82 growth-only paired production combats; historical total-nerf evidence is read-only.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(process.env.TEST_ENGINE_ROOT??'.');
const module=async name=>import(pathToFileURL(path.join(root,'dist',name+'.js')));
const E=await module('engine'),{getSkillTreeDefinition}=await module('race-registry'),{setCombatDisplayObserver}=await module('combat-display-bridge');
const out=process.argv[2]??'qa/goblin-growth-v082/after.json';fs.mkdirSync(path.dirname(out),{recursive:true});
let rng;const seed=n=>{rng=n;Math.random=()=>((rng=Math.imul(rng,1664525)+1013904223>>>0)/2**32);};
Date.now=()=>1700000000000;
const skills=['goblin.venom_cut','goblin.spore_fan','goblin.mire_seal','goblin.patch_ration'];
function setup(level,profile){
 seed(731+level);const s=E.fresh('goblin');s.level=level;
 if(profile!=='naked')for(const socket of Object.keys(s.equip)){
  const slot=E.SOCKET_TYPE[socket],set=profile!=='ordinary'&&E.SET_SLOTS.includes(slot)?profile:null;
  const it=E.item(slot,level,set,set?3:2,{originRace:'goblin'});it.special=null;s.inventory.push(it);assert(E.equipItem(s,it.id,socket));
 }
 if(profile!=='naked'){
  const tree=getSkillTreeDefinition('goblin'),unlocked=new Set();
  const add=id=>{tree.nodes.find(n=>n.id===id).requires.forEach(add);unlocked.add(id);};skills.forEach(add);
  Object.assign(s.skillTree.presets[0],{unlocked:[...unlocked],active:skills});
 }
 E.normalizeHealth(s,s.lastSeen);s.heroHp=E.stats(s).hp;s.restUntil=0;
 s.areaProgress=Object.fromEntries(E.RACE_KEYS.map(r=>[r,{unlocked:Array.from({length:Math.ceil(level/10)},(_,i)=>i+1),cleared:Array.from({length:Math.max(0,Math.ceil(level/10)-1)},(_,i)=>i+1)}]));
 assert(E.validSave(s));return s;
}
const rows=[];
for(const level of [20,60,100])for(const profile of ['ordinary','goblin_spore','goblin_ambush','goblin_snare']){
 const original=setup(level,profile),st=E.stats(original),gearHash=createHash('sha256').update(JSON.stringify(original.inventory)).digest('hex');
 if(level===100&&profile==='ordinary')fs.writeFileSync(path.join(path.dirname(out),'browser-lv100-q2.json'),JSON.stringify(original,null,2)+'\n');
 for(const kind of (level===20?['field','dungeon']:['field','dungeon','boss'])){
  const trials=[];
  for(let n=1;n<=10;n++){
   seed(n*7919);const s=structuredClone(original),id=`human.a${String(level/10).padStart(2,'0')}.${kind}`,e=E.startInstanceEncounter(s,id,s.lastSeen);assert(e,id);
   let incoming=0,healing=0,damage=0,poison=0,enemyHealing=0,minHp=s.heroHp;
   const detach=setCombatDisplayObserver(e,v=>{if(v.targetId==='hero'){if(v.hpDelta<0)incoming-=v.hpDelta;if(v.hpDelta>0)healing+=v.hpDelta;}else if(v.hpDelta<0){damage-=v.hpDelta;if(v.kind==='poison')poison-=v.hpDelta;}else if(v.hpDelta>0)enemyHealing+=v.hpDelta;});
   while(!e.done&&e.round<1500){E.step(s,e,s.nextActionAt);minHp=Math.min(minHp,e.heroHp);}detach();assert(e.done);assert(E.validSave(s));
   trials.push({win:!!e.win,seconds:e.round*1.1,incoming,healing,remainingHp:e.heroHp,remainingFraction:e.heroHp/st.hp,minFraction:minHp/st.hp,damage,poison,enemyHealing});
  }
  const avg=k=>trials.reduce((sum,t)=>sum+t[k],0)/trials.length;
  rows.push({level,profile,kind,gearHash,atk:st.atk,hp:st.hp,armor:st.armor,physicalEhp:st.hp*(1+st.armor/100),wins:trials.filter(t=>t.win).length,trials:trials.length,seconds:avg('seconds'),incoming:avg('incoming'),healing:avg('healing'),remainingHp:avg('remainingHp'),remainingFraction:avg('remainingFraction'),minFraction:avg('minFraction'),damage:avg('damage'),poison:avg('poison'),enemyHealing:avg('enemyHealing')});
 }
}
const s=setup(1,'naked'),nakedStats=E.stats(s);seed(7919);const e=E.startInstanceEncounter(s,'goblin.a01.dungeon',s.lastSeen);assert(e);while(!e.done&&e.round<1500)E.step(s,e,s.nextActionAt);assert(e.done);assert(E.validSave(s));
const naked={stats:nakedStats,win:e.win,rounds:e.round,heroHp:e.heroHp};
fs.writeFileSync(out,JSON.stringify({method:'12 same-level Goblin loadouts:8 slots ordinary Q2, or4 Q3 pieces of each Goblin set +4 Q2; legal13-point poison/heal skill closure, no talents/passives/specials/enhancement/divine/potions;10 paired seeds;actual same-level Human field/dungeon first-stage/boss (no boss in area2;Lv20 omits boss), fresh full HP each fight. Physical EHP=HP*(1+armor/100), excludes dodge/shields/elemental damage. Naked Lv1 Goblin first dungeon single-seed regression control.',rows,naked},null,2));
console.log(out,rows.length,'rows');
