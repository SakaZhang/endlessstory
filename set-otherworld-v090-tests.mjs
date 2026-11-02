import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {raceSockets} from './dist/race-registry.js';
const codes={human:'H',dwarf:'D',elf:'E',goblin:'G',ashen:'A'},rows=[];
const seeded=(seed,fn)=>{const old=Math.random;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);try{return fn();}finally{Math.random=old;}};
const targets={dwarf:{set:'anvil',skills:['fracture_strike','breach_followup','fault_sweep','forge_breath']},human:{set:'human_blood_oath',skills:['human.rending_cut','human.sever','human.opening','human.rally']},elf:{set:'elf_arrow',skills:['elf.twin_arrow','elf.thread_volley','elf.moon_finisher','elf.dew_mending']},goblin:{set:'goblin_spore',skills:['goblin.venom_cut','goblin.spore_fan','goblin.mire_seal','goblin.seam_step']},ashen:{set:'ashen.strata',skills:['ashen.mantle','ashen.fracture','ashen.rebuild','ashen.cleave']}};
for(const race of Object.keys(codes)){
 const base=reachStoryScene(race,`END.${codes[race]}01.${race}`,{finishTarget:true,level:100,spring:'skip'});base.running=false;base.level=100;base.xp=0;
 seeded(123456,()=>{for(const socket of raceSockets(race)){const slot=E.SOCKET_TYPE[socket],set=['helm','armor','gloves','boots'].includes(slot)?targets[race].set:null,it=E.item(slot,100,set,3,{baseLevel:100,levelSource:'generated',originRace:race});it.special=null;base.inventory.push(it);assert(E.equipItem(base,it.id,socket));}});
 // Keep the legal earned skill tree from the complete-story fixture; no forged skill unlocks.
 for(const floor of [50,150,300]){
  const s=structuredClone(base);s.heroHp=E.stats(s).hp;s.otherworld.highestCleared=floor-1;s.otherworld.floor=floor;assert(E.validSave(s));assert(E.enterOtherworld(s,s.lastHealthClock+2000));assert(E.setOtherworldAutoAdvance(s,false));
  const e=E.startRoutedEncounter(s,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e);e.rngState=12345;let rounds=0;while(!e.done&&rounds++<3000)E.step(s,e,s.nextActionAt);assert(e.done,'bounded battle');assert(E.validSave(s));if(e.win)assert(E.reward(s,e,s.lastHealthClock));assert(E.validSave(JSON.parse(JSON.stringify(s))));rows.push({race,set:targets[race].set,floor,win:e.win,rounds,hp:Math.round(s.heroHp),maxHp:Math.round(E.stats(s).hp),attack:Math.round(E.stats(s).atk)});
 }
}
fs.mkdirSync('qa/v090-sets',{recursive:true});fs.writeFileSync('qa/v090-sets/otherworld-five-race.json',JSON.stringify({note:'Synthetic Lv100 supreme sets, completed-story legal skill tree, no special-affix chance, measured survivability not a guaranteed progression promise',rows},null,2));console.table(rows);console.log('PASS five races actual production otherworld floor50/150/300 fights and valid saves; outcomes recorded, not all-win requirement');
