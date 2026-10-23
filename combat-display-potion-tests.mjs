import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {captureCombatDisplay,setCombatDisplayObserver} from './dist/combat-display-bridge.js';
const s=E.fresh(),now=10000;E.normalizeHealth(s,now);
s.potionStacks={'healing|0':4};s.potionReadyAt=0;s.heroHp=1;
const e=E.startRoutedEncounter(s,now);e.heroHp=1;s.activeEncounter=e;
const a=structuredClone(s),b=structuredClone(s);let draws=0;const random=Math.random;Math.random=()=>{draws++;throw Error('potion display must not roll');};
try{
 const shown=captureCombatDisplay(a.activeEncounter,()=>E.drinkPotion(a,'healing|0',now));
 assert.equal(shown.result,true);assert.equal(E.drinkPotion(b,'healing|0',now),true);assert.deepEqual(a,b);assert.equal(shown.events.length,1);
 const event=shown.events[0];assert.equal(event.kind,'heal');assert.equal(event.sourceId,'potion:healing|0');assert.equal(event.targetId,'hero');assert.equal(event.hpDelta,a.heroHp-1);assert.equal(event.shieldDelta,0);assert.equal(event.crit,false);
 const denied=captureCombatDisplay(a.activeEncounter,()=>E.drinkPotion(a,'healing|0',now));assert.equal(denied.result,false);assert.deepEqual(denied.events,[]);
 const restored=JSON.parse(JSON.stringify(a));restored.heroHp=restored.activeEncounter.heroHp=1;
 const throwing=structuredClone(restored),unobserved=structuredClone(restored);const detach=setCombatDisplayObserver(throwing.activeEncounter,()=>{throw Error('display consumer unavailable');});assert(E.drinkPotion(throwing,'healing|0',now+10000));detach();assert(E.drinkPotion(unobserved,'healing|0',now+10000));assert.deepEqual(throwing,unobserved);
 const automatic=structuredClone(a);automatic.heroHp=automatic.activeEncounter.heroHp=1;automatic.potionSlot={key:'healing|0',auto:true,priority:'low',priorityVersion:1};const autoBaseline=structuredClone(automatic);
 const autoShown=captureCombatDisplay(automatic.activeEncounter,()=>E.autoDrinkPotion(automatic,automatic.activeEncounter,now+20000));assert(autoShown.result);assert(E.autoDrinkPotion(autoBaseline,autoBaseline.activeEncounter,now+20000));assert.deepEqual(automatic,autoBaseline);assert.equal(autoShown.events.length,1);assert.equal(autoShown.events[0].hpDelta,automatic.heroHp-1);
 assert.equal(draws,0);assert(!JSON.stringify(a).includes('display-event'));
}finally{Math.random=random;}
console.log('PASS potion display actual received HP, no cooldown/stock/RNG changes, rejected use silent, observer failure isolated, no serialized events');
