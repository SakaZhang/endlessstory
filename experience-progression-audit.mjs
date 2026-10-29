import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {setup} from './boss-growth-test-fixture.mjs';
import {raceParameterSet} from './dist/world-content.js';
const realRandom=Math.random,realNow=Date.now;Date.now=()=>1700000000000;
const rows=[];
for(const level of [1,10,30,50,70,90,99]){
 const area=level===1?1:Math.min(10,Math.ceil(level/10));
 let seconds=0,xp=0,oldXp=0,wins=0,groups=0,minHp=1;const races=[];
 for(const race of E.RACE_KEYS){let rs=0,rx=0,rw=0;for(let seed=1;seed<=20;seed++){
  const s=setup(race,level,0,Math.imul(seed,2654435761)>>>0,level>=10);if(level===1){s.inventory=[];for(const socket in s.equip)s.equip[socket]=null;}
  s.siteId=`${race}.a${String(area).padStart(2,'0')}`;s.location=area-1;s.expedition.fieldId=s.siteId+'.field';s.heroHp=E.stats(s).hp;
  const e=E.startInstanceEncounter(s,s.siteId+'.field',s.lastSeen);assert(e);let n=0;while(!e.done&&n++<2000)E.step(s,e,s.nextActionAt);assert(e.done);const elapsed=e.round*1.1+1.8;seconds+=elapsed;rs+=elapsed;groups+=!!e.fieldGroup;minHp=Math.min(minHp,Math.max(0,e.heroHp)/E.stats(s).hp);if(e.win){wins++;rw++;const award=e.rewardXp*(e.fieldGroup?2:1);xp+=award;rx+=award;oldXp+=(area===1?4:12+4*area)*(e.fieldGroup?2:1);}
 }races.push({race,wins:rw,xpHour:Math.round(rx/rs*3600),cycleSeconds:+(rs/20).toFixed(2)});}
 const rate=xp/seconds*3600;rows.push({level,area,wins,total:100,groups,minHpPercent:Math.round(minHp*100),cycleSeconds:+(seconds/100).toFixed(2),xpHour:Math.round(rate),oldXpHour:Math.round(oldXp/seconds*3600),oldMinutesNext:+(80*level/(oldXp/seconds*3600)*60).toFixed(2),xpNext:80*level,minutesNext:+(80*level/rate*60).toFixed(2),xpTo100:40*(100*99-level*(level-1)),hoursTo100AtThisRate:+(40*(100*99-level*(level-1))/rate).toFixed(2),clearXp:raceParameterSet('dwarf').clearRewards[area].xp,races});
}
Math.random=realRandom;Date.now=realNow;console.table(rows.map(({races,...r})=>r));fs.writeFileSync(process.env.OUT??'/tmp/experience-audit.json',JSON.stringify(rows,null,2)+'\n');
