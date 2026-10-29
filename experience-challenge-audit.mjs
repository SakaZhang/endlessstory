import fs from 'node:fs';import assert from 'node:assert/strict';import * as E from './dist/engine.js';import {setup} from './boss-growth-test-fixture.mjs';import {WORLD_MONSTERS} from './dist/world-content.js';
const realRandom=Math.random,realNow=Date.now;Date.now=()=>1700000000000;const rows=[];
const cases=E.RACE_KEYS.flatMap(race=>[1,5,10].map(area=>({race,area,kind:'dungeon'})));
for(const d of Object.values(WORLD_MONSTERS).filter(d=>d.rank==='boss'))cases.push({race:d.id.split('.')[0],area:d.area,kind:'boss'});
for(const {race,area,kind} of cases){const s=setup(race,area*10,0,739,true);s.siteId=`${race}.a${String(area).padStart(2,'0')}`;s.location=area-1;s.expedition.fieldId=s.siteId+'.field';let seconds=0,xp=0,win=true;
for(let stage=1;stage<=(kind==='dungeon'?3:1);stage++){const e=E.startInstanceEncounter(s,s.siteId+'.'+kind,Math.max(s.lastHealthClock,s.nextBattleAt??0));assert(e);while(!e.done)E.step(s,e,s.nextActionAt);seconds+=e.round*1.1+1.8;if(!e.win){win=false;break;}xp+=e.rewardXp+(stage===3?e.clearRewards.xp:0);E.reward(s,e,s.lastHealthClock);}
const cooldown=kind==='dungeon'?300:1800;rows.push({race,area,level:area*10,kind,win,xp,seconds:+seconds.toFixed(2),cooldownSeconds:cooldown,xpHourWithCooldown:Math.round(xp/(seconds+cooldown)*3600)});}
Math.random=realRandom;Date.now=realNow;console.table(rows);fs.writeFileSync('/tmp/experience-challenges.json',JSON.stringify(rows,null,2));
