import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {raceSockets} from './dist/race-registry.js';
const codes={human:'H',dwarf:'D',elf:'E',goblin:'G',ashen:'A'},rows=[];
const seeded=(seed,fn)=>{const old=Math.random;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);try{return fn();}finally{Math.random=old;}};
const targets={dwarf:{set:'anvil'},human:{set:'human_blood_oath'},elf:{set:'elf_arrow'},goblin:{set:'goblin_spore'},ashen:{set:'ashen.strata'}};
for(const race of Object.keys(codes)){
 const base=reachStoryScene(race,`END.${codes[race]}01.${race}`,{finishTarget:true,level:100,spring:'skip'});base.running=false;base.level=100;base.xp=0;
 seeded(123456,()=>{for(const socket of raceSockets(race)){const slot=E.SOCKET_TYPE[socket],set=['helm','armor','gloves','boots'].includes(slot)?targets[race].set:null,it=E.item(slot,100,set,3,{baseLevel:100,levelSource:'generated',originRace:race});it.special=null;base.inventory.push(it);assert(E.equipItem(base,it.id,socket));}});
 // Keep the legal earned skill tree from the complete-story fixture; no forged skill unlocks.
 for(const floor of [50,150,300]){
  const s=structuredClone(base);s.heroHp=E.stats(s).hp;s.otherworld.highestCleared=floor-1;s.otherworld.floor=floor;assert(E.validSave(s));assert(E.enterOtherworld(s,s.lastHealthClock+2000));assert(E.setOtherworldAutoAdvance(s,false));
  const e=E.startRoutedEncounter(s,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e);e.rngState=12345;let rounds=0;while(!e.done&&rounds++<3000)E.step(s,e,s.nextActionAt);assert(e.done,'bounded battle');assert(E.validSave(s));if(e.win)assert(E.reward(s,e,s.lastHealthClock));assert(E.validSave(JSON.parse(JSON.stringify(s))));rows.push({race,set:targets[race].set,floor,win:e.win,rounds,hp:Math.round(s.heroHp),maxHp:Math.round(E.stats(s).hp),attack:Math.round(E.stats(s).atk)});
 }
}
fs.mkdirSync('qa/v090-sets',{recursive:true});fs.writeFileSync('qa/v090-sets/otherworld-five-race.json',JSON.stringify({note:'Compatibility fixture: Lv100 supreme sets with unchanged complete-story default skill route (NOT set-targeted). Separate review-tower-compare uses matched set-targeted legal skills for strength comparison. No special affixes; no victory guarantee.',rows},null,2));console.table(rows);console.log('PASS five races actual production otherworld floor50/150/300 fights and valid saves; outcomes recorded, not all-win requirement');
