import assert from 'node:assert/strict';
import * as E from '../../../dist/engine.js';
import {RACE_PACK as pack} from '../../../dist/races/human/index.js';
import {makeAffixSourceRange} from '../../../dist/affix-range.js';
import {captureCombatDisplay} from '../../../dist/combat-display-bridge.js';
export {E,pack,captureCombatDisplay};
export function stableAffixes(item){item.affixes=['atk','hp','armor','luck'].slice(0,item.affixes.length).map(stat=>{const sourceRange=makeAffixSourceRange(E.AFFIX_DEFS[stat],item.budgetQuality??item.rarity);return {stat,value:sourceRange.min,sourceRange};});return item;}
export const ARMOR='human-banner-armor',T=10000;
export function setup(node='human.a01.field'){
 const s=E.fresh('human');s.level=100;E.normalizeHealth(s,T);E.normalizeExpedition(s);
 s.skillTree.presets[0].unlocked=pack.tree.nodes.map(n=>n.id);s.skillTree.presets[0].passive=[null,null];s.skillTree.presets[0].active=[null,null,null,null];
 // Strip random combat specials from starter gear; keep the real registered armor.
 for(const item of s.inventory)item.special=null;
 const item=stableAffixes(E.legendaryItem(ARMOR,100));assert(item);s.inventory.push(item);assert(E.equipItem(s,item.id));
 s.lastSeen=s.lastHealthClock=T;s.nextBattleAt=s.restUntil=0;s.heroHp=E.stats(s).hp;
 s.areaProgress.human={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};
 const e=E.startInstanceEncounter(s,node,T);assert(e);
 for(const u of e.enemies){u.hp=u.max=1e7;u.atk=u.elementalPower=0;u.nextBasicAt=T+1e8;u.control.cooldowns=Object.fromEntries(Object.keys(u.control.cooldowns).map(k=>[k,T+1e8]));}
 e.rngState=1331;e.rngDraws=0;assert(E.validSave(s));return {s,e,item};
}
export function tick(f){const b=captureCombatDisplay(f.e,()=>E.step(f.s,f.e,f.s.nextActionAt));assert(E.validSave(f.s));assert(E.validSave(JSON.parse(JSON.stringify(f.s))));return b;}
export function reflections(b){return b.events.filter(x=>x.skillId===ARMOR&&(x.hpDelta<0||x.shieldDelta<0));}
export function received(b){return b.events.filter(x=>x.targetId==='hero'&&(x.hpDelta<0||x.shieldDelta<0)&&x.kind!=='counter');}
export function exactSegments(b){const hits=received(b),returns=reflections(b);assert.equal(returns.length,hits.length);for(let i=0;i<hits.length;i++){assert.equal(returns[i].targetId,hits[i].sourceId);assert(Math.abs(returns[i].hpDelta+returns[i].shieldDelta-(hits[i].hpDelta+hits[i].shieldDelta)*.5)<1e-7);assert.equal(returns[i].crit,false);}return hits;}
