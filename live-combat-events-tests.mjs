import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {commitGameTransaction} from './dist/storage.js';
import {createLiveCombatEvents} from './dist/live-combat-events.js';
import {validDisplayEvent} from './dist/combat-display-queue.js';
const s=E.fresh();s.lastSeen=s.lastHealthClock=10000;s.heroHp=1;s.potionStacks={'healing|0':5};s.restUntil=0;s.nextBattleAt=0;const fight=E.startRoutedEncounter(s,10000);fight.heroHp=s.heroHp=1;const pipe=createLiveCombatEvents();pipe.sync(fight);
const control=structuredClone(s),captured=pipe.capture(fight,()=>E.step(s,fight,s.nextActionAt));assert.deepEqual(captured.result,E.step(control,control.activeEncounter,control.nextActionAt));assert.deepEqual(s,control);const shown=pipe.publish(captured);assert(shown.every(validDisplayEvent));assert.deepEqual(pipe.publish(captured),[]);
// Failed persistence never reaches the display; retry uses the same gameplay path.
let live=structuredClone(s);live.heroHp=live.activeEncounter.heroHp=1;live.potionReadyAt=0;let staged;const before=structuredClone(live);
const rejected=commitGameTransaction({setItem(){throw Error('quota');}},live,next=>{staged=pipe.capture(next.activeEncounter,()=>E.drinkPotion(next,'healing|0',30000,next.activeEncounter));return staged.result;});assert(!rejected.ok);assert.deepEqual(live,before);
let stored;const first=commitGameTransaction({setItem(k,v){stored=v;}},live,next=>{staged=pipe.capture(next.activeEncounter,()=>E.drinkPotion(next,'healing|0',30000,next.activeEncounter));return staged.result;});assert(first.ok);live=first.game;const a=pipe.publish(staged);assert.equal(a.filter(x=>x.kind==='heal').length,1);assert.equal(a[0].hpDelta,live.heroHp-1);assert.deepEqual(JSON.parse(stored),live);
live.heroHp=live.activeEncounter.heroHp=1;const second=commitGameTransaction({setItem(){}},live,next=>{staged=pipe.capture(next.activeEncounter,()=>E.drinkPotion(next,'healing|0',40000,next.activeEncounter));return staged.result;});assert(second.ok);live=second.game;const b=pipe.publish(staged);assert.equal(b.length,1);assert.notEqual(a[0].eventId,b[0].eventId,'same battle/round cloned transactions remain distinct');
// Navigation/refresh/offline cannot replay a captured history batch.
const late=pipe.capture(live.activeEncounter,()=>E.step(live,live.activeEncounter,live.nextActionAt));pipe.sync(live.activeEncounter,{visible:false});assert.deepEqual(pipe.publish(late),[]);const off=pipe.capture(live.activeEncounter,()=>42);assert.equal(off.result,42);assert.deepEqual(off.events,[]);pipe.reset();pipe.sync(live.activeEncounter);assert.deepEqual(pipe.publish(late),[]);assert(!JSON.stringify(live).includes(':live:'));
console.log('PASS live presentation session: actual step state/RNG parity, commit-only potion events, same-round clone IDs unique, single consume, navigation/refresh/offline stale suppression, no saved display state');
