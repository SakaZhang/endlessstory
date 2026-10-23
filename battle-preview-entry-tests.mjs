import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createBattleSliceModel} from './dist/battle-slice.js';
const source=readFileSync(new URL('./dist/battle-preview-entry.js',import.meta.url),'utf8');
for(const [search,expected] of [['?scenario=eruption','eruption'],['?scenario=poison','poison'],['?scenario=fire','fire'],['','fire'],['?scenario=unknown','fire']]){
 const calls=[],host={};const script=source.replace("import {mountBattleSlice} from './battle-slice.js';",'');
 vm.runInNewContext(script,{document:{getElementById:id=>id==='battleSlice'?host:null},location:new URL('https://same-origin.example/battle-preview.html'+search),URLSearchParams,mountBattleSlice:(node,options)=>{calls.push({node,options});return Promise.resolve();}});
 assert.equal(calls.length,1);assert.equal(calls[0].node,host);assert.equal(calls[0].options.scenario,expected);
 const model=createBattleSliceModel({now:1700000000000,scenario:calls[0].options.scenario});model.toggle(1700000000000);const events=[];for(let i=1;i<=60&&!model.encounter.done;i++)events.push(...model.advance(1700000000000+i*1100));
 assert.equal(model.emissionError,null);
 if(expected==='eruption')assert(events.some(e=>e.skillId==='furnace_wave'&&e.kind==='hit'));
 if(expected==='poison')assert(events.some(e=>e.kind==='poison'));
 if(expected==='fire')assert(events.some(e=>['ember_brand','fracture_strike'].includes(e.skillId)&&e.kind==='hit'));
 model.dispose();
}
console.log('PASS actual preview URL entry whitelist routes eruption/poison/fire into real models; defaults retain real skill hits, unknown query safely falls back.');
