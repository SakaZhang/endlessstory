import * as E from './dist/engine.js';
import {normalizeCasinoState} from './dist/casino-state.js';
export const casinoSeedForTicket=ticket=>Number(((BigInt(ticket)-1013904223n)*4276115653n%4294967296n+4294967296n)%4294967296n);
export function casinoFixture({ticket=33,quality=2,kind='equipment',race='dwarf',level=29,heroLevel=40,full=null}={}){
 const s=E.fresh(race);s.level=heroLevel;s.gold=10000;s.materialStacks={'铁屑|0':50,['铁屑|'+quality]:50};s.running=false;s.atCamp=true;
 const it=E.item('weapon',level,null,quality,{originRace:race});it.id='casino-fixture-input';it.name=it.name;s.inventory=[it];
 normalizeCasinoState(s);s.casino.rng=casinoSeedForTicket(ticket);E.normalizeHealth(s);
 if(full)for(let i=0;i<50;i++){const gear=E.item(full,1,null,0,{originRace:race});gear.id='full-'+full+'-'+i;s.inventory.push(gear);}
 E.normalizeCodexCollection(s);if(!E.validSave(s))throw Error('Invalid casino fixture');
 return {game:s,selection:{kind,id:kind==='equipment'?it.id:'铁屑|'+quality}};
}
