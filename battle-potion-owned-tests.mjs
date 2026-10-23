import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {renderPotionSettings,renderPotionInventory,renderBattlePotionButton} from './dist/potion-ui.js';
const s=E.fresh();E.normalizeHealth(s,1000);E.normalizePotions(s);
let html=renderPotionSettings(s);assert(html.includes('无生命药剂'));assert(!html.includes('data-battle-potion-drink'));assert(!html.includes('potionTypeChoices'));
s.potionStacks={'healing|0':2,'healing|2':1,'strength|3':2};s.potionSlot.key='strength|3';s.potionSlot.auto=true;s.heroHp=1;
html=renderPotionSettings(s);assert(html.includes('普通'));assert(html.includes('优良'));assert(!html.includes('至臻'));assert(!html.includes('力量药剂'));assert(renderPotionInventory(s).includes('data-potion-use="strength|3"'));
E.setPotionPriority(s,'high');assert(E.autoDrinkPotion(s,null,1000));assert.equal(s.potionStacks['healing|2'],0);assert.equal(s.potionStacks['strength|3'],2);assert.equal(s.potionReadyAt,11000);assert(!E.drinkPotion(s,'strength|3',1001));assert(E.drinkPotion(s,'strength|3',11000));assert.equal(s.potionSlot.key,'strength|3','manual directuse does not need to change carrying');assert.equal(s.potionStacks['strength|3'],1);assert(renderBattlePotionButton(s,11000).includes('生命'));E.setPotionPriority(s,'low');s.heroHp=1;assert(E.autoDrinkPotion(s,null,21000));assert.equal(s.potionStacks['healing|0'],1);assert.equal(s.potionStacks['strength|3'],1);assert(E.validSave(s));console.log('PASS owned-only life controls, empty state, direct bag buff use, shared10s cooldown and high/low autohealing independent old buff selection');

// Exercise the production step wrapper, including its post-drink combat log.
for(const oldKey of [null,'strength|3']){
 const live=E.fresh();E.normalizeHealth(live,1000);E.normalizePotions(live);live.potionStacks={'healing|0':2,'strength|3':2};live.potionSlot={...live.potionSlot,key:oldKey,auto:true};live.heroHp=E.stats(live).hp*.2;
 const encounter=E.startRoutedEncounter(live,1000);assert(encounter);const hp=live.heroHp;
 const logs=E.step(live,encounter,live.nextActionAt);
 assert(logs.includes('自动饮用 · '+E.POTIONS.healing.name));assert(!logs.includes('自动饮用 · '+E.POTIONS.strength.name));assert.equal(live.potionStacks['healing|0'],1);assert.equal(live.potionStacks['strength|3'],2);assert.equal(live.potionReadyAt,live.lastHealthClock+10000);assert.equal(live.potionSlot.key,oldKey);assert(E.validSave(live));
 const count=live.potionStacks['healing|0'];E.step(live,encounter,live.nextActionAt);assert.equal(live.potionStacks['healing|0'],count,'actual next combat step respects shared cooldown');assert(E.validSave(live));
}
console.log('PASS production E.step automatic healing with null and prior buff carry: no exception, correct consumed-name log, one stock debit, shared CD and valid save');
