import assert from 'node:assert/strict';
import {deriveNewItemBudget,validItemBudgetMetadata,equipmentBudgetNotice} from './dist/equipment-budget-adapter.js';
import {VARIANTS} from './dist/equipment-budget.js';
let cases=0;
for(const [baseVariant,v]of Object.entries(VARIANTS))for(const level of [1,20,50,100,101,150,99999,1e12])for(let rarity=0;rarity<4;rarity++){
 const item={slot:v.slot,baseVariant,level,rarity,...deriveNewItemBudget({slot:v.slot,baseVariant,level,quality:rarity})};assert(validItemBudgetMetadata(item));assert.equal(item.budgetLevel,Math.min(100,level));assert.equal(item.level,level);assert.equal(Boolean(equipmentBudgetNotice(item)),level>100);assert(validItemBudgetMetadata(JSON.parse(JSON.stringify(item))));
 if(v.armor===0)assert.equal(item.armor,0);if(v.atk===0)assert.equal(item.atk,0);if(v.hp===0)assert.equal(item.hp,0);
 assert(!validItemBudgetMetadata({...item,budgetSourceLevel:level+1}));assert(!validItemBudgetMetadata({...item,atk:item.atk+1}));cases++;
}
const old={id:'old',level:150,atk:5000,armor:0,hp:15000,bless:4,affixes:[{stat:'atk',value:8}],divine:{model:'raw-v1'}};const before=JSON.stringify(old);assert(validItemBudgetMetadata(old));assert.equal(equipmentBudgetNotice(old),'');assert.equal(JSON.stringify(old),before);
for(const level of [0,-1,.5,NaN,Infinity,Number.MAX_SAFE_INTEGER,1e12+1])assert.throws(()=>deriveNewItemBudget({slot:'weapon',baseVariant:'axe_balanced',level,quality:3}));
assert.throws(()=>deriveNewItemBudget({slot:'ring',baseVariant:'axe_balanced',level:20,quality:3}));assert.throws(()=>deriveNewItemBudget({slot:'weapon',baseVariant:'axe_balanced',level:20,quality:4}));
assert(!validItemBudgetMetadata({...old,budgetLevel:100}));assert(!validItemBudgetMetadata({...old,baseBudgetModel:'invented'}));
console.log(`PASS M2 budget adapter ${cases}: finite1–100 budget vs preserved source/display levels, explicit overcap provenance, zero preservation, legacy untouched, strict unknown metadata. Not yet engine generation activation.`);
