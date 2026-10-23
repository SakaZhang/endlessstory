import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {makeAffixSourceRange} from './dist/affix-range.js';
import {combinedFavorableRollChance} from './dist/dwarf-forge-favor.js';
import {DWARF_FORGE_FAVOR_CONFIG as C} from './dist/dwarf-forge-favor-config.js';
const old=Math.random,copy=x=>structuredClone(x);
const withRoll=(fn,value)=>{Math.random=()=>value;try{return fn();}finally{Math.random=old;}};
const aff=(stat,q,value)=>({stat,value,sourceRange:makeAffixSourceRange(E.AFFIX_DEFS[stat],q)});
function setup(){const s=withRoll(()=>E.fresh(),.5);s.level=20;s.gold=10000;s.materialStacks['铁屑|0']=100;s.consumables.reforgeToken=10;const it=withRoll(()=>E.item('gloves',10,null,0),.5);it.affixes=[aff('hp',3,45)];s.inventory.push(it);return {s,it};}
{
 const {s,it}=setup();let seq=[0,0,.999],draws=0;Math.random=()=>{draws++;return seq.shift()??.9;};assert(E.reforge(s,it.id,'value'));assert.equal(draws,3,'one first roll, one combined chance, one better roll');assert.equal(s.pendingReforge.newAffixes[0].value,45);assert.deepEqual(s.pendingReforge.newAffixes[0].sourceRange,it.affixes[0].sourceRange);assert.equal(s.gold,9990);assert.equal(s.materialStacks['铁屑|0'],99);const paid=JSON.parse(JSON.stringify(s));paid.talents.luck=10;const expected=copy(paid.pendingReforge.newAffixes);Math.random=()=>{throw Error('paid result must not reroll');};assert(E.resolveReforge(paid,true));assert.deepEqual(paid.inventory.find(x=>x.id===it.id).affixes,expected);assert(E.validSave(paid));
}
{
 const {s,it}=setup();s.race='elf';let draws=0;Math.random=()=>{draws++;return 0;};assert(E.reforge(s,it.id,'value'));assert.equal(draws,1,'non-dwarf zero luck follows old one-roll path');assert.equal(s.pendingReforge.newAffixes[0].value,it.affixes[0].sourceRange.min);
}
{
 const {s,it}=setup(),d=withRoll(()=>E.item('boots',20,null,2),.5);d.affixes=[aff('atk',0,E.AFFIX_DEFS.atk.min),aff('hp',3,45)];s.inventory.push(d);const before=copy(d.affixes);let draws=0;Math.random=()=>{draws++;return .45;};assert(E.reforge(s,it.id,'replace',0,d.id));assert.equal(draws,1);assert.deepEqual(s.pendingReforge.newAffixes[0],before[1],'higher source percentile has greater probability, RAW/source unchanged');assert(!s.inventory.some(x=>x.id===d.id));assert.equal(s.gold,10000);assert(E.resolveReforge(s,false));assert.equal(it.affixes[0].value,45);assert(!s.inventory.some(x=>x.id===d.id),'keep old does not refund donor');
}
{
 const a=setup(),b={s:copy(a.s)};b.s.race='elf';withRoll(()=>{assert(E.reforge(a.s,a.it.id,'all'));assert(E.reforge(b.s,a.it.id,'all'));},.032);assert(E.getPendingReforgeCandidate(a.s).divine);assert(!E.getPendingReforgeCandidate(b.s).divine);assert(!a.it.divine,'candidate divine not adopted early');assert(E.resolveReforge(a.s,false));assert(!a.it.divine);assert.equal(a.s.consumables.reforgeToken,9);
}
{
 const normal=withRoll(()=>E.item('gloves',20,null,2),.105),forged=withRoll(()=>E.item('gloves',20,null,2,{forgeRace:'dwarf'}),.105);assert(!normal.special,'ordinary factory/drop path unchanged');assert(forged.special,'only forge occurrence gets racial benefit');assert.equal(forged.affixes.length,normal.affixes.length);assert(Math.abs(combinedFavorableRollChance(0,'dwarf',C)-.08)<1e-12);
}
Math.random=old;console.log('PASS actual dwarf forge: one combined value draw, source/raw retained, weighted donor no refund, pending independent of later luck, divine candidate only, forge-only special and unchanged costs/counts.');
