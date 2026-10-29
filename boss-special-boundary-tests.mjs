import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {setup} from './boss-growth-test-fixture.mjs';
const random=Math.random,now=Date.now;Date.now=()=>1700000000000;
const rows=[];
for(const race of E.RACE_KEYS){const variants=Object.fromEntries(['none','reaper','infinity','both'].map(k=>[k,{race,variant:k,wins:0,total:20,rounds:0}]));for(let seed=1;seed<=20;seed++){
const base=setup(race,20,2,seed,true,race==='elf'?'sustain':'standard');for(const item of base.inventory)item.special=null;
const gauntlet=E.legendaryItem('infinity-gauntlet',20);assert(gauntlet);
for(const [variant,row] of Object.entries(variants)){const s=structuredClone(base);if(['reaper','both'].includes(variant))s.inventory.find(i=>i.id===s.equip.weapon).special={id:'reaper'};
if(['infinity','both'].includes(variant)){s.inventory.push(structuredClone(gauntlet));s.infinityGauntlet={version:1,recipeLearned:true,crafted:true,craftedItemId:gauntlet.id};assert(E.equipItem(s,gauntlet.id,'gloves'));}
s.heroHp=E.stats(s).hp;assert(E.validSave(s));const e=E.startInstanceEncounter(s,'elf.a08.boss',s.lastSeen);assert(e);e.rngState=seed;e.rngDraws=0;let n=0;while(!e.done&&n++<2000)E.step(s,e,s.nextActionAt);assert(e.done);row.wins+=!!e.win;row.rounds+=e.round;
}}
for(const row of Object.values(variants)){row.rounds/=20;if(row.variant==='none')assert.equal(row.wins,0);rows.push(row);}}
Math.random=random;Date.now=now;console.table(rows);fs.writeFileSync(process.env.OUT??'/tmp/boss-special-boundaries.json',JSON.stringify(rows,null,2));
