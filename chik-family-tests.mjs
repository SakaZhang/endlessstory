import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {CHIK_FAMILY_CHARACTERS as FAMILY,CHIK_FAMILY_SCENE_CAST,chikFamilyCast,chikFamilySpeaker,chikFamilyDisplayText} from './dist/chik-family-registry.js';
import {renderChikFamilyCast} from './dist/chik-family-ui.js';
import {renderStoryEventBoard} from './dist/story-event-ui.js';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {RACIAL_NPCS} from './dist/racial-npc-event-content.js';
import {NPC_PORTRAIT_REGISTRY} from './dist/npc-portrait-registry.js';
import {NPC_EVENTS,beginNpcEvent} from './dist/npc-events.js';
import * as E from './dist/engine.js';
import * as C from './dist/story-event-controller.js';
import {preparedStoryGame,reachStoryScene,completeStory} from './story-event-test-fixture.mjs';
import {bindNpcPortraitErrors} from './dist/npc-portraits.js';
const {loadImage,createCanvas}=createRequire(import.meta.url)('@napi-rs/canvas');
const sha=x=>createHash('sha256').update(x).digest('hex');
const baseline=JSON.parse(fs.readFileSync('fixtures/chik-family/v067-scene-hashes.json'));
for(const [id,hash]of Object.entries(baseline.sceneHashes))assert.equal(sha(JSON.stringify(STORY_SCENES[id])),hash,'canonical scene unchanged: '+id);
assert.equal(Object.keys(FAMILY).length,3);assert.equal(RACIAL_NPCS.length,30);assert.equal(Object.keys(NPC_PORTRAIT_REGISTRY).length,30);
const manifest=JSON.parse(fs.readFileSync('chik-family-source-manifest.json')),hashes=new Set();let bytes=0;
assert.equal(manifest.entries.length,3);
for(const c of Object.values(FAMILY)){
 assert(!RACIAL_NPCS.some(n=>n.id===c.id));assert(!NPC_EVENTS[c.id]);assert.equal(beginNpcEvent(preparedStoryGame('goblin'),c.id),false);
 const m=manifest.entries.find(m=>m.id===c.id);assert(m);assert.equal(m.name,c.name);assert.equal(m.runtime.path,'dist/'+c.file);assert.equal(m.method,'builtin image_gen');assert.match(m.prompt,/pixel/);
 for(const [key,size]of [['runtime',96],['preview',192],['source',1254]]){const b=fs.readFileSync(m[key].path),im=await loadImage(m[key].path);assert.equal(sha(b),m[key].sha256);assert.equal(im.width,size);assert.equal(im.height,size);}
 const b=fs.readFileSync(m.runtime.path);bytes+=b.length;hashes.add(sha(b));const im=await loadImage(b),canvas=createCanvas(96,96),ctx=canvas.getContext('2d');ctx.drawImage(im,0,0);const pixels=ctx.getImageData(0,0,96,96).data,colors=new Set();for(let i=0;i<pixels.length;i+=4){assert.equal(pixels[i+3],255);colors.add(pixels.slice(i,i+3).join(','));}assert(colors.size>100,'genuine detailed portrait');
 assert.equal(c.facing,'right');assert(m.bounds.earsAndHairUnclipped);
}
assert.equal(hashes.size,3);assert(bytes<128000);
for(const value of [null,{}, {pov:'human',sourceScene:'C01.G01'}, {pov:'goblin',sourceScene:'__proto__'}, {pov:'goblin',sourceScene:'C08.X03'}]){assert.deepEqual(chikFamilyCast(value),[]);assert.equal(chikFamilyDisplayText(value,'谨慎的那个：原文。'),'谨慎的那个：原文。');assert.equal(renderChikFamilyCast(value),'');}
const present=['C01.G01.goblin','C02.O01.goblin','C05.O01.goblin','C07.O01.goblin'];
assert.equal(chikFamilyDisplayText(STORY_SCENES['C01.G01.goblin'],'一家人，护送三个家人。'),'一家人，护送三个家人。');
for(const id of present){
 const d=STORY_SCENES[id],cast=chikFamilyCast(d),known=JSON.stringify(d);assert(cast.length);const html=renderChikFamilyCast(d,d.lines.find(l=>chikFamilySpeaker(d,l)));assert.equal((html.match(/class="npcPortraitImage"/g)||[]).length,cast.length);assert(html.includes('isSpeaking'));assert(!html.includes('data-npc-action'));assert(!html.includes('data-story-action'));assert(!html.includes('<svg'));assert(!html.includes('fetch'));
 for(const c of cast){assert(html.includes(c.file));assert(html.includes(c.name));assert(html.includes('loading="lazy"'));assert(html.includes('decoding="async"'));}
 const s=reachStoryScene('goblin',id),snapshot=JSON.stringify(s);s.story.activeScene.cursor=0;s.story.activeScene.choiceId=null;assert(E.validSave(s));const before=JSON.stringify(s),board=renderStoryEventBoard(s);assert(board.includes('data-family-character'));assert(!board.includes('谨慎的那个：'));assert(!board.includes('快长大的那个：'));assert(!board.includes('最小的那个：'));assert.equal(JSON.stringify(s),before,'render never writes save');assert.equal(JSON.stringify(d),known,'render never rewrites definitions');
 for(const line of d.lines){const c=chikFamilySpeaker(d,line);if(c)assert.equal(chikFamilyDisplayText(d,line),c.name+line.slice(c.alias.length));else assert.equal(chikFamilyDisplayText(d,line),line);}
}
for(const sourceScene of ['C10.G01','END.G01']){const d={pov:'goblin',sourceScene};assert.equal(chikFamilyCast(d).length,3);for(const c of Object.values(FAMILY))assert.equal(chikFamilyDisplayText(d,c.alias+'：旧台词'),c.name+'：旧台词');assert(Object.values(STORY_SCENES).some(d=>d.sourceScene===sourceScene),'finale now hosts the approved family scenes');assert(!C.availableStoryScenes(preparedStoryGame('goblin')).some(d=>d.sourceScene===sourceScene),'presentation does not bypass story gates');}
// Existing completed saves retain canonical derived knowledge and strict validation.
const old=JSON.parse(fs.readFileSync('fixtures/chik-family/v067-completed-goblin-save.json'));assert(E.validSave(old));const saved=JSON.stringify(old);renderStoryEventBoard(old);assert.equal(JSON.stringify(old),saved);assert(C.availableStoryScenes(old).some(d=>d.id==='C07.O01.goblin'));
for(const race of ['human','dwarf','elf','ashen'])for(const s of [preparedStoryGame(race),completeStory(race)]){const before=JSON.stringify(s),html=renderStoryEventBoard(s);assert(!html.includes('story-family-portraits'));assert(!html.includes('data-family-character'));assert(!/咔洛|米芮|豆布/.test(html));assert.equal(JSON.stringify(s),before);assert(E.validSave(s));}
// Family markup uses the already-bound shared recovery. Exercise both bounded
// automatic attempts, manual keyboard retry, load, and detached-node cleanup.
const original={setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout};
try{
 for(const c of Object.values(FAMILY)){
  const timers=new Map(),listeners={},classes=new Set(),attrs={},message={hidden:true},writes=[];let seq=0;
  globalThis.setTimeout=(fn,delay)=>{timers.set(++seq,{fn,delay});return seq;};globalThis.clearTimeout=id=>timers.delete(id);
  const wrapper={classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k),contains:k=>classes.has(k)},querySelector:q=>q==='.npcPortraitError'?message:img,setAttribute:(k,v)=>attrs[k]=v,removeAttribute:k=>delete attrs[k]};
  const img={dataset:{npcPortraitImage:'true'},alt:c.name+' · '+c.role,complete:false,naturalWidth:0,isConnected:true,matches:q=>q==='.npcPortraitImage',closest:()=>wrapper,getAttribute:()=>c.file,set src(v){writes.push(v);}};
  const host={contains:n=>n===img&&n.isConnected,querySelectorAll:()=>[img],addEventListener:(k,f)=>listeners[k]=f,removeEventListener:k=>delete listeners[k]};
  const dispose=bindNpcPortraitErrors(host);
  for(const delay of [250,1000]){listeners.error({target:img});assert(img.hidden&&!message.hidden);assert.equal(timers.size,1);const [id,timer]=[...timers][0];assert.equal(timer.delay,delay);timers.delete(id);timer.fn();}
  listeners.error({target:img});assert.equal(timers.size,0);assert.equal(writes.length,2);let stopped=0;
  listeners.keydown({type:'keydown',key:'Enter',target:{closest:()=>wrapper},preventDefault(){stopped++;},stopPropagation(){stopped++;}});assert.equal(stopped,2);assert.equal(writes.length,3);assert(writes.every(url=>url.startsWith(c.file+'?asset_retry=')));
  listeners.load({target:img});assert(!img.hidden&&message.hidden);assert.equal(attrs.role,'img');
  listeners.error({target:img});const [tid,timer]=[...timers][0];timers.delete(tid);img.isConnected=false;timer.fn();assert.equal(writes.length,3);dispose();assert.deepEqual(listeners,{});
 }
}finally{Object.assign(globalThis,original);}
assert(fs.readFileSync('dist/app.js','utf8').includes('bindNpcPortraitErrors(document)'));
console.log(`PASS family: 3 unique 96px portraits (${bytes} bytes), source/192px hashes, unchanged ${Object.keys(baseline.sceneHashes).length} canonical scene definitions, 30 ordinary NPCs, scoped speaker/name UI, C01/C02/C05/C07 real controller states, old saves, non-Goblin privacy, gated C10/END host, shared bounded recovery.`);
