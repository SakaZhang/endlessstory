import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {currentAffix} from './current-equipment-test-fixture.mjs';
import {displayTokens,COMBAT_GLYPHS,drawCombatFloat} from './dist/battle-slice.js';
import {calculateLifesteal} from './dist/affix-expansion.js';
import {captureCombatDisplay} from './dist/combat-display-bridge.js';
const event=delta=>({kind:'heal',hpDelta:delta,shieldDelta:0,element:null});
assert.equal(displayTokens(event(.2))[0].text,'+0.2');
assert.equal(displayTokens(event(.004))[0].text,'+<0.01');
assert.deepEqual(displayTokens(event(0)),[]);
assert.equal(displayTokens(event(23.6))[0].text,'+24');
assert.equal(displayTokens({...event(-.2),kind:'hit',element:'physical'})[0].text,'−0.2');
assert.equal(displayTokens({...event(-100),kind:'hit',element:'physical'})[0].glyph,null);
assert(!Object.hasOwn(COMBAT_GLYPHS,'physical'));
for(const element of ['earth','water','fire','wind','light','dark'])assert.equal(displayTokens({...event(-100),kind:'hit',element})[0].glyph,element);
assert.equal(displayTokens({...event(0),shieldDelta:-.2})[0].text,'−0.2');
assert.equal(displayTokens({...event(0),shieldDelta:-10})[0].glyph,'shield');
assert.equal(displayTokens({...event(-2),kind:'poison'})[0].glyph,'poison');
const rects=[],texts=[],c={measureText:()=>({width:18}),fillRect:(...args)=>rects.push(args),strokeText:t=>texts.push(t),fillText:t=>texts.push(t)};
drawCombatFloat(c,displayTokens({...event(-100),kind:'hit',element:'physical'})[0],10,10);
assert.equal(rects.length,0,'physical hits render no arrow or replacement glyph');assert.deepEqual(texts,['−100','−100']);
assert.equal(E.AFFIX_DEFS.lifesteal.name,'吸血');assert(!fs.readFileSync('dist/app.js','utf8').includes('吸血值'));
const recovery=calculateLifesteal({rating:3,maxHp:100,currentHp:50,hits:[{hitId:'hit',hpBefore:100,hpAfter:90,source:'basic'}]});
assert(recovery.heal>0&&recovery.heal<.5);assert.notEqual(displayTokens(event(recovery.heal))[0].text,'+0');
assert.equal(calculateLifesteal({rating:3,maxHp:100,currentHp:100,hits:[{hitId:'hit',hpBefore:100,hpAfter:90,source:'basic'}]}).heal,0);
// Exercise actual production equipment -> basic attack -> HP mutation -> display event.
const oldRandom=Math.random;let seed=41;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
try{
 const now=Date.now(),s=E.fresh(),ring=E.item('ring',1,null,0);ring.affixes=[currentAffix('lifesteal',3)];s.inventory.push(ring);assert(E.equipItem(s,ring.id,'ring1'));
 s.skillTree.presets[0].active=[null,null,null,null];s.skillTree.presets[0].passive=[null,null];E.normalizeHealth(s,now);s.heroHp=E.stats(s).hp/2;s.lastSeen=s.lastHealthClock=now;
 assert(E.chooseAdventureNode(s,'dwarf.a01.field',{start:true},now));const e=s.activeEncounter;let observed=false;
 for(let i=0;i<10&&!e.done;i++){
  const before=e.heroHp,batch=captureCombatDisplay(e,()=>E.step(s,e,now+1100+i*1100));
  const heals=batch.events.filter(x=>x.kind==='heal'&&x.skillId==='lifesteal');
  if(!heals.length)continue;
  assert(Math.abs(e.heroHp-before-batch.events.filter(x=>x.targetId==='hero').reduce((n,x)=>n+x.hpDelta,0))<1e-7,'emitted actual HP deltas match committed combat HP');
  for(const heal of heals){assert(heal.hpDelta>0&&heal.hpDelta<.5,'low-level actual healing is fractional');assert.notEqual(displayTokens(heal)[0].text,'+0');}
  observed=true;break;
 }
 assert(observed,'actual low-level combat emits fractional lifesteal healing');
}finally{Math.random=oldRandom;}
console.log('PASS damage signs without physical arrow, typed pixel suffixes, fractional HP feedback, zero-heal suppression, actual lifesteal recovery, and simplified affix label.');
