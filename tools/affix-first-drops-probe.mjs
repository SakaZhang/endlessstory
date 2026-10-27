// Optional reproducible old/new generator comparison; no live save mutation.
// node tools/affix-first-drops-probe.mjs /absolute/baseline/repo [sample-count]
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const baseline=process.argv[2];if(!baseline)throw Error('Pass verified v0.70 baseline repository');
const expectedBaseline='9f56c77996038f929d390a35ac48167250f1475d';
assert.equal(execFileSync('git',['-C',baseline,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),expectedBaseline,'baseline checkout changed');
execFileSync('git',['-C',baseline,'diff','--quiet',expectedBaseline,'--','dist']);
const count=Number(process.argv[3]??1000);if(!Number.isSafeInteger(count)||count<1||count>10000)throw Error('Invalid sample count');
const old=await import(pathToFileURL(resolve(baseline,'dist/engine.js'))),current=await import('../dist/engine.js');
const originalRandom=Math.random,originalNow=Date.now,phys=(a,d)=>Math.max(1,Math.round(a*100/(100+Math.max(0,d))));
function run(E){let seed=998833;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);Date.now=()=>1700000000000;const rows=[];
 for(const race of ['dwarf','human','elf','goblin','ashen'])for(let trial=0;trial<count;trial++){
  const equip={},slots=['weapon','helm','armor','gloves','boots','ring','amulet',...(race==='ashen'?['core']:[])];
  assert.equal(E.areaGearLevel(race+'.a01.field'),5);
  for(let drop=1;drop<=3;drop++){const slot=slots[Math.floor(Math.random()*slots.length)],q=Math.random()<65/93?0:1,level=3+Math.floor(Math.random()*5),it=E.item(slot,level,null,q,{baseLevel:5,levelSource:'drop',originRace:race});const socket=slot==='ring'?(!equip.ring1?'ring1':'ring2'):slot;if(!equip[socket])equip[socket]=it;
   const st={atk:17,hp:134,armor:6,hit:0,crit:0,critDamage:0};for(const x of Object.values(equip)){for(const k of ['atk','hp','armor'])st[k]+=x[k];for(const a of x.affixes)if(Object.hasOwn(st,a.stat))st[a.stat]+=a.value;}
   const hit=.9+.1*st.hit/(100+st.hit),crit=.05+.55*st.crit/(100+st.crit),cd=1.5+st.critDamage/(100+st.critDamage);const dps=hit*((1-crit)*phys(st.atk,12)+crit*phys(st.atk*cd,12))/1.1;
   rows.push({race,trial,drop,equipped:Object.keys(equip).length,dps,ehp:st.hp*(100+st.armor)/100,latest:{slot:it.slot,level:it.level,quality:it.rarity,templateId:it.templateId,affixes:it.affixes.map(a=>({stat:a.stat,value:a.value,sourceRange:a.sourceRange}))}});
  }
 }
 return rows;
}
try{const before=run(old),after=run(current),paired=after.map((r,i)=>{const a=before[i];assert.equal(r.latest.templateId,a.latest.templateId);assert.deepEqual(r.latest.affixes.map(a=>a.stat),a.latest.affixes.map(a=>a.stat));assert.equal(r.latest.level,a.latest.level);return {...r,dpsDelta:r.dps/a.dps-1,ehpDelta:r.ehp/a.ehp-1};});const summaries=[];
 for(const race of ['dwarf','human','elf','goblin','ashen'])for(const drop of [1,2,3]){const sample=paired.filter(x=>x.race===race&&x.drop===drop),measure=k=>{const v=sample.map(x=>x[k]).sort((a,b)=>a-b);return {mean:v.reduce((a,b)=>a+b,0)/v.length,p05:v[Math.floor(.05*(v.length-1))],median:v[Math.floor(.5*(v.length-1))]};};summaries.push({race,drop,count,dpsDelta:measure('dpsDelta'),ehpDelta:measure('ehpDelta')});}
 console.log(JSON.stringify({scope:'same PRNG actual old/current item factories, A1 common Q0/Q1 conditional pool (93% of base quality draws), Lv3–7; empty-slot fill; heroLv1 vs neutral armor12 physical probe; not natural earning/combat survival',baselineCommit:expectedBaseline,seed:998833,countPerRace:count,pairedDropStates:paired.length,summaries},null,2));
}finally{Math.random=originalRandom;Date.now=originalNow;}
