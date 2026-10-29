import assert from 'node:assert/strict';
import {createPixelMapScenes} from './dist/pixel-map-scenes.js';
const manifest={image:'map.png',size:[960,540]},images=new Map([['map.png',{}]]);
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject};};
const flush=()=>new Promise(resolve=>setImmediate(resolve));
const ok=value=>({ok:true,json:async()=>value});
// Hung fetch, repeated clicks share work, timeout exposes failure, explicit retry recovers.
let requests=[],statuses=[];
const scene=createPixelMapScenes({images,manifestTimeoutMs:20,onStatus:(_,state)=>statuses.push(state.mode),fetcher:(url,options)=>{const d=deferred();requests.push({...d,url,options});return d.promise;}});
const first=scene.load('world'),duplicate=scene.load('world',{retry:true});await flush();assert.equal(requests.length,1);
assert.equal(await first,false);assert.equal(await duplicate,false);assert.equal(requests[0].options.signal.aborted,true);assert.equal(scene.status('world').mode,'failed');
assert.equal(await scene.load('world'),false);assert.equal(requests.length,1);
const retry=scene.load('world',{retry:true});await flush();assert.equal(requests.length,2);assert.equal(requests[1].options.cache,'reload');requests[1].resolve(ok(manifest));assert.equal(await retry,true);
// The old fetch may disregard abort and return a corrupt manifest after recovery.
requests[0].resolve(ok({image:'stale.png',size:[1,1]}));await flush();assert.equal(scene.status('world').mode,'ready');
const draws=[];const canvas={width:960,height:540,getContext:()=>({save(){},restore(){},setTransform(){},clearRect(){},drawImage(...args){draws.push(args);}})};
assert.equal(scene.draw(canvas,'world'),true);assert.equal(draws.length,1);assert.deepEqual(statuses,['loading','failed','loading','ready']);scene.dispose();
// A response received immediately does not disable the timeout while JSON is hanging.
const body=deferred();let count=0;
const slow=createPixelMapScenes({images,manifestTimeoutMs:20,fetcher:async()=>++count===1?{ok:true,json:()=>body.promise}:ok(manifest)});
assert.equal(await slow.load('world'),false);assert.match(slow.status('world').error,/timed out/);
assert.equal(await slow.load('world',{retry:true}),true);body.resolve({image:'late.png',size:[1,1]});await flush();assert.equal(slow.draw(canvas,'world'),true);slow.dispose();
// Network and HTTP failures settle and permit a fresh request, not cached rejection.
for(const failure of [()=>Promise.reject(Error('offline')),async()=>({ok:false,status:503})]){
 let attempts=0;const s=createPixelMapScenes({images,fetcher:(...args)=>++attempts===1?failure(...args):Promise.resolve(ok(manifest))});
 assert.equal(await s.load('world'),false);assert.equal(s.status('world').mode,'failed');assert.equal(await s.load('world',{retry:true}),true);assert.equal(attempts,2);s.dispose();
}
// Leaving while fetch/body is hung settles immediately; late response cannot publish.
for(const phase of ['fetch','body']){
 const late=deferred();let signal;const events=[];
 const s=createPixelMapScenes({images,onStatus:(_,state)=>events.push(state.mode),fetcher:(_,{signal:sig})=>{signal=sig;return phase==='fetch'?late.promise:Promise.resolve({ok:true,json:()=>late.promise});}});
 const pending=s.load('world');await flush();s.dispose();assert.equal(await pending,false);assert.equal(signal.aborted,true);late.resolve(phase==='fetch'?ok(manifest):manifest);await flush();assert.equal(s.status('world').mode,'disposed');assert.deepEqual(events,['loading']);
 const reentry=createPixelMapScenes({images,fetcher:async()=>ok(manifest)});assert.equal(await reentry.load('world'),true);reentry.dispose();
}
// Two exploration areas share one family request and both recover after its timeout.
const exploration={areaBackgrounds:{'dwarf.a01':['one'],'elf.a01':['one']},backgrounds:[{id:'one',file:'area.png',size:[480,270],z:0}]};
let sharedCalls=0;const shared=createPixelMapScenes({images:new Map([['area.png',{}]]),manifestTimeoutMs:20,fetcher:async()=>{sharedCalls++;if(sharedCalls===1)return new Promise(()=>{});return ok(exploration);}});
assert.deepEqual(await Promise.all([shared.load('dwarf.a01'),shared.load('elf.a01')]),[false,false]);assert.equal(sharedCalls,1);
assert.deepEqual(await Promise.all([shared.load('dwarf.a01',{retry:true}),shared.load('elf.a01',{retry:true})]),[true,true]);assert.equal(sharedCalls,2);shared.dispose();
console.log('PASS map manifest bounded fetch/body, abort, duplicate load, explicit retry/cache reload, late-response isolation, network/HTTP failure, dispose/reentry.');
