import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {raceSockets} from './dist/race-registry.js';
const codes={human:'H',dwarf:'D',elf:'E',goblin:'G',ashen:'A'},rows=[];
const seeded=(seed,fn)=>{const old=Math.random;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);try{return fn();}finally{Math.random=old;}};
for(const race of Object.keys(codes)){
 const base=reachStoryScene(race,`END.${codes[race]}01.${race}`,{finishTarget:true,level:100,spring:'skip'});base.running=false;
 for(const quality of [0,2]){
  const s=structuredClone(base);s.level=100;s.xp=0;s.talents=Object.fromEntries(Object.keys(E.TALENTS).map(k=>[k,0]));
  seeded(123456,()=>{for(const socket of raceSockets(race)){const slot=E.SOCKET_TYPE[socket],it=E.item(slot,100,null,quality,{baseLevel:100,levelSource:'generated',originRace:race});s.inventory.push(it);assert(E.equipItem(s,it.id,socket));}});
  const geared=structuredClone(s);for(const floor of [1,25,100,250,500]){const s=structuredClone(geared);s.heroHp=E.stats(s).hp;s.otherworld.highestCleared=floor-1;s.otherworld.floor=floor;assert(E.validSave(s));assert(E.enterOtherworld(s,s.lastHealthClock+2000));assert(E.setOtherworldAutoAdvance(s,false));
  let wins=0,rests=0,totalRounds=0,firstResult=null,firstRounds=0;const start=s.lastHealthClock;
  while(wins<10&&rests<2){
   const e=E.startRoutedEncounter(s,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e);e.rngState=12345+wins+rests;let n=0;
   while(!e.done&&n++<3000)E.step(s,e,s.nextActionAt);assert(e.done,'finite battle');assert(E.validSave(s));totalRounds+=n;if(firstResult===null){firstResult=e.win;firstRounds=n;}
   if(e.win){assert(E.reward(s,e,s.lastHealthClock));wins++;}else{rests++;assert(s.restUntil>0);E.settleRest(s,s.restUntil);}
  }
  rows.push({race,quality,floor,firstResult:firstResult?'win':'loss',firstRounds,wins,rests,totalRounds,elapsedSeconds:Math.round((s.lastHealthClock-start)/1000),heroHp:E.stats(s).hp,heroAtk:Math.round(E.stats(s).atk),heroArmor:Math.round(E.stats(s).armor)});
 }}
}
fs.mkdirSync('qa/otherworld',{recursive:true});fs.writeFileSync('qa/otherworld/balance.json',JSON.stringify({status:'candidate tuning; synthetic level100 ordinary gear, no talent investment, existing selected skills; no guaranteed endgame win claim',rows},null,2));console.table(rows);console.log('PASS 50 actual five-race Q0/Q2 level100 floor1/25/100/250/500 finite combat and defeat/rest; measured evidence not mandatory wins.');
