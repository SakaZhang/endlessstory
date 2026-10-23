import {captureCombatDisplay} from './combat-display-bridge.js';
// A view-session boundary only: no persistent fields, timers, gameplay RNG or log parsing.
// Transactional actions observe a draft, then publish only after the caller commits it.
export function createLiveCombatEvents(){
 let battleId=null,visible=false,epoch=0,serial=0;const consumed=new WeakSet();
 return Object.freeze({
  sync(encounter,{visible:nextVisible=true}={}){const nextId=encounter?.id??null;if(nextId!==battleId||!!nextVisible!==visible){epoch++;battleId=nextId;visible=!!nextVisible;}return {battleId,visible,epoch};},
  capture(encounter,operation){const atEpoch=epoch;if(!visible||!encounter||encounter.id!==battleId)return {result:operation(),events:[],battleId:encounter?.id??null,epoch:atEpoch};const out=captureCombatDisplay(encounter,operation);return {...out,battleId:encounter.id,epoch:atEpoch};},
  publish(batch){if(!batch||consumed.has(batch))return [];consumed.add(batch);if(!visible||batch.epoch!==epoch||batch.battleId!==battleId)return [];
   // Save/adopt clones have their own observer WeakMap sequence. Add a UI-only
   // session sequence so two successful manual potions in the same round cannot collide.
   return batch.events.map(event=>({...event,eventId:`${event.eventId}:live:${epoch}:${++serial}`}));
  },
  reset(){epoch++;battleId=null;visible=false;},
 });
}
