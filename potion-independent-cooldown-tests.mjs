import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {POTION_BUFF_KEYS} from './dist/potion-catalog.js';
import {renderPotionInventory,renderBattlePotionButton,renderPotionPanel} from './dist/potion-ui.js';
import {commitGameTransaction} from './dist/storage.js';
const T=1700000000000;
function fresh(){const s=E.fresh();E.normalizeHealth(s,T);E.normalizePotions(s);s.potionStacks={'healing|0':9,'luck|0':9,'strength|0':9,'strength|3':9,'fireResist|0':9};s.heroHp=1;return s;}
const s=fresh(),base=E.stats(s).atk;
assert(E.drinkPotion(s,'luck|0',T));assert.equal(s.potionReadyAt,0);
assert(E.drinkPotion(s,'strength|0',T));assert(E.drinkPotion(s,'fireResist|0',T));
assert(E.drinkPotion(s,'healing|0',T));assert(!E.drinkPotion(s,'healing|0',T));assert(!E.drinkPotion(s,'strength|0',T));
assert.equal(E.stats(s).atk,base+10);assert(E.drinkPotion(s,'strength|0',T+10000));assert.equal(E.stats(s).atk,base+10);assert.equal(s.potionBuffs.strength.endAt,T+600000);
assert(E.drinkPotion(s,'strength|3',T+20000));assert.equal(E.stats(s).atk,base+25);assert.equal(s.potionBuffs.strength.endAt,T+320000);assert(!E.drinkPotion(s,'strength|0',T+30000));
// Old shared timer migrates once, retaining every remaining cooldown, including across JSON.
const old=fresh();delete old.potionFunctionCooldowns;old.potionReadyAt=T+5000;assert(E.validSave(old));assert(!E.drinkPotion(old,'luck|0',T));assert(E.normalizePotions(old));for(const type of POTION_BUFF_KEYS)assert.equal(old.potionFunctionCooldowns[type],T+5000);assert(E.validSave(JSON.parse(JSON.stringify(old))));assert(E.drinkPotion(old,'luck|0',T+5000));assert(E.drinkPotion(old,'strength|0',T+5000));
for(const value of [null,[],{luck:-1},{...old.potionFunctionCooldowns,healing:0},{...old.potionFunctionCooldowns,luck:Infinity}]){const bad=structuredClone(old);bad.potionFunctionCooldowns=value;assert(!E.validSave(bad));const before=structuredClone(bad);assert(!E.normalizePotions(bad));assert.deepEqual(bad,before);}
// Running is not the definition of combat: both active and paused fights keep functional CD.
for(const running of [true,false]){const c=fresh();const battle=E.startRoutedEncounter(c,T);assert(battle);c.running=running;assert(E.drinkPotion(c,'luck|0',T));assert(!E.drinkPotion(c,'strength|0',T));assert(!E.drinkPotion(c,'strength|0',T,null),'explicit null cannot bypass live encounter');c.potionSlot.auto=true;assert(E.autoDrinkPotion(c,battle,T),'lucky buff cannot delay auto-healing');assert.equal(c.potionStacks['healing|0'],8);assert.equal(c.potionReadyAt,T+10000);assert(E.validSave(c));}
// Encounter passed by legacy callers is also combat even without activeEncounter.
const legacy=fresh(),battle=E.encounter(legacy,false,T);legacy.activeEncounter=null;assert(E.drinkPotion(legacy,'luck|0',T,battle));assert(!E.drinkPotion(legacy,'strength|0',T,battle));assert(E.drinkPotion(legacy,'strength|0',T,{done:true}));
// Offline replay consumes the same automatic healing despite an active lucky cooldown.
const replay=fresh();const fight=E.startRoutedEncounter(replay,T);replay.running=true;replay.lastSeen=T;replay.potionSlot.auto=true;assert(E.drinkPotion(replay,'luck|0',T));
for(const enemy of fight.enemies??[]){enemy.hp=enemy.max=1e8;enemy.atk=enemy.elementalPower=0;}
const online=structuredClone(replay),off=JSON.parse(JSON.stringify(replay)),end=replay.nextActionAt;
E.step(online,online.activeEncounter,end);E.settleRest(online,end);online.lastSeen=end;const result=E.offline(off,end);assert.equal(result.rounds,1);assert.equal(off.potionStacks['healing|0'],8);
for(const key of ['heroHp','potionStacks','potionReadyAt','potionFunctionCooldowns','potionBuffs','activeEncounter'])assert.deepEqual(off[key],online[key],key);assert(E.validSave(off));
// Actual UI uses each card's cooldown; lucky never shades the healing button.
const ui=fresh();assert(E.drinkPotion(ui,'luck|0',T));const html=renderPotionInventory(ui,T);assert.match(html,/data-potion-use="luck\|0" disabled/);assert.match(html,/data-potion-use="strength\|0" >使用/);assert.match(html,/data-potion-use="healing\|0" >使用/);assert(!renderBattlePotionButton(ui,T).includes('battlePotionShade'));assert.match(renderPotionPanel(ui,{potions:[{id:'luck|0',type:'luck',count:8,name:'幸运'}],selected:'luck|0',now:T}),/冷却 0:10/);
// Failed storage cannot consume stock, set cooldowns, or apply buffs.
const txs=fresh(),before=structuredClone(txs);let raw;let tx=commitGameTransaction({setItem(){throw Error('quota');}},txs,d=>E.drinkPotion(d,'luck|0',T),{now:T});assert(!tx.ok);assert.deepEqual(txs,before);tx=commitGameTransaction({setItem(k,v){raw=v;}},txs,d=>E.drinkPotion(d,'luck|0',T),{now:T});assert(tx.ok);assert(E.validSave(JSON.parse(raw)));assert.equal(JSON.parse(raw).potionFunctionCooldowns.luck,T+10000);assert.deepEqual(txs,before);
console.log('PASS independent potion cooldowns: combat/paused/explicit battle, out-of-combat preparation, same-kind quality/strength rules, legacy migration/validation, UI timers and transaction rollback');
