// Actual equipment comparison; different quality budgets are disclosed, not normalized.
import assert from 'node:assert/strict';
import {E,ARMOR,setup,stableAffixes,tick,reflections} from './reflect-fixture.mjs';
const rows=[];
for(const mode of ['supreme','shelter','banner-armor']){
 const f=setup();if(mode!=='banner-armor'){
  let item;do{item=E.item('armor',100,null,3,{originRace:'human'});}while(item.baseVariant!=='armor_armor');stableAffixes(item);item.special=mode==='shelter'?{id:'shelter'}:null;f.s.inventory.push(item);assert(E.equipItem(f.s,item.id));
 }
 const st=E.stats(f.s),u=f.e.enemies[0];u.atk=st.hp*.1*(100+st.armor)/100;u.nextBasicAt=f.s.nextActionAt;f.e.heroHp=f.s.heroHp=st.hp*.4;
 const b=tick(f),returns=reflections(b);rows.push({mode,stats:{hp:st.hp,atk:st.atk,armor:st.armor},hpAfter:f.e.heroHp,reflected:returns.reduce((n,x)=>n-x.hpDelta-x.shieldDelta,0)});assert.equal(returns.length,mode==='banner-armor'?1:0);
}
console.log(JSON.stringify({method:'Actual equipped level100 armor, same base allocation, supreme/shelter versus registered legendary q4 budget; fixed 10%-max incoming attack. No equal-stat or general-superiority claim.',rows},null,2));
