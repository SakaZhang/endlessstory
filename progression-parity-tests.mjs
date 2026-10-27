import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
import * as E from './dist/engine.js';
const [mode,race,dest]=process.argv.slice(2),START=1700000000000,HOURS=Number(process.env.PARITY_HOURS??4);
if(mode){
 Date.now=()=>START;let z=1917;Math.random=()=>((z=(Math.imul(z,1664525)+1013904223)>>>0)/2**32);
 const s=E.fresh(race);s.lastSeen=START;E.normalizeHealth(s,START);E.normalizeExpedition(s);E.normalizeMaterials(s);E.normalizePotions(s);s.worldEvents={version:1,lastProcessedAt:START,nextWarCheckAt:START+600000,rngState:1,serial:0};s.running=true;const end=START+HOURS*3600000;
 let report=null;if(mode==='offline'||mode==='capped')report=E.offline(s,end+(mode==='capped'?4*3600000:0));else{
 let time=START;while(time<end&&s.running){if(E.worldEventsDue(s,time))assert(E.advanceWorldEvents(s,time));if(s.restUntil>0){if(s.restUntil>end)break;time=Math.max(time,s.restUntil);E.settleRest(s,time);if(!s.running)break;continue;}if(s.nextBattleAt>time){time=Math.min(end,s.nextBattleAt);if(time>=end)break;}let e=s.activeEncounter;if(e?.done){if(e.win&&!e.rewarded)E.reward(s,e,time);else s.activeEncounter=null;continue;}if(!e){e=E.startRoutedEncounter(s,time);if(!e){if(s.restUntil>0)continue;break;}}const next=Math.max(time,s.nextActionAt??time+1100);if(next>end)break;time=next;if(E.worldEventsDue(s,time))assert(E.advanceWorldEvents(s,time));E.step(s,e,time);if(e.done&&e.win){E.reward(s,e,time);const before=JSON.stringify(s);E.reward(s,e,time);assert.equal(JSON.stringify(s),before,'no rewarded replay');}}
 E.advanceWorldEvents(s,end);E.settleRest(s,end);s.lastSeen=end;
 }
 assert(E.validSave(s));delete s.chronicle;fs.writeFileSync(dest,JSON.stringify({state:s,report}));
}else{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'natural-world-parity-'));for(const race of (process.env.PARITY_RACES??'human,dwarf,elf,goblin,ashen').split(',')){
 const rows=['online','offline'].map(mode=>{const dest=path.join(dir,`${race}-${mode}.json`);execFileSync(process.execPath,[new URL(import.meta.url).pathname,mode,race,dest],{stdio:'inherit'});return JSON.parse(fs.readFileSync(dest)).state;});assert.deepEqual(rows[0],rows[1],race+' full state including world clocks, natural rewards and active fight');console.log(`PASS ${race} ${HOURS}h natural online/offline full-state parity; ${rows[0].kills} wins, level ${rows[0].level}, world serial ${rows[0].worldEvents.serial}`);
 if(HOURS===4){const dest=path.join(dir,`${race}-capped.json`);execFileSync(process.execPath,[new URL(import.meta.url).pathname,'capped',race,dest],{stdio:'inherit'});const cap=JSON.parse(fs.readFileSync(dest));assert.equal(cap.report.minutes,240);assert.equal(cap.report.capped,true);for(const key of ['level','xp','gold','kills','inventory','materialStacks','potionStacks','areaProgress'])assert.deepEqual(cap.state[key],rows[1][key],race+' cap preserves '+key);assert.equal(cap.state.lastSeen,START+8*3600000);console.log(`PASS ${race} 8h absence earns only4h resources, while lastSeen advances8h`);}

 }
}
