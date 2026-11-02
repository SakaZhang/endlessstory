import {assertOriginalStoryContracts} from './story-copy-contract-test-helper.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {STORY_SCENES} from './dist/story-event-registry.js';
import {STORY_CAST_CHARACTERS,storyHeroDescriptor,storyCastSpeaker,storyCastDisplayLine,storyCastDisplayLabel,knownStoryEvidenceCast} from './dist/story-cast-registry.js';
import {renderStoryDialogue,renderKnownStoryEvidence,renderStoryCastPortrait} from './dist/story-cast-ui.js';
import {renderStoryKnowledge} from './dist/story-event-ui.js';
import {NPC_PORTRAIT_REGISTRY} from './dist/npc-portrait-registry.js';
import {bindNpcPortraitErrors} from './dist/npc-portraits.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
const {loadImage}=createRequire(import.meta.url)('@napi-rs/canvas'),sha=b=>createHash('sha256').update(b).digest('hex');
assertOriginalStoryContracts(STORY_SCENES);
execFileSync(process.execPath,['tools/sync-story-portrait-crops.mjs','--check']);
const manifest=JSON.parse(fs.readFileSync('main-cast-source-manifest.json'));assert.equal(manifest.entries.length,6);
for(const entry of manifest.entries){assert.equal(typeof entry.prompt,'string');for(const key of ['source','source192',entry.designOnly?'designPreview':'runtime']){const item=entry[key],bytes=fs.readFileSync(item.path);assert.equal(sha(bytes),item.sha256);const im=await loadImage(item.path);assert.deepEqual([im.width,im.height],item.size);if(key==='source192')assert.deepEqual(item.size,[192,192]);if(key==='runtime'||key==='designPreview')assert.deepEqual(item.size,[96,96]);}}
for(const c of Object.values(STORY_CAST_CHARACTERS)){if(c.designOnly){assert.equal(c.file,null);assert(!fs.existsSync('dist/story-portraits/current-dwarf-king.png'));}else assert(fs.existsSync('dist/'+c.file));if(c.regionalNpcId)assert.equal(c.file,NPC_PORTRAIT_REGISTRY[c.regionalNpcId].file);}
assert.equal(storyHeroDescriptor('goblin').role,'盗贼');assert.equal(storyHeroDescriptor('ashen').role,'矿石行者');assert.equal(storyHeroDescriptor('dwarf').file,'hero-portraits/brock-96.png');assert.equal(storyHeroDescriptor('dwarf').portraitCrop,undefined);
const counts={};let lines=0,narration=0;
for(const scene of Object.values(STORY_SCENES))for(const line of scene.lines){
 lines++;const actor=storyCastSpeaker(scene,line),html=renderStoryDialogue(scene,line);assert(!html.includes('current-dwarf-king'));if(scene.id!=='personal.dwarf.coup.07')assert(!html.includes('dwarf-minister'));if(line.startsWith('[')){narration++;assert.equal(actor,null);assert(!html.includes('data-story-speaker'));}
 if(actor){if(scene.chapter<9&&!scene.personal)counts[actor.id]=(counts[actor.id]??0)+1;assert(html.includes(`data-story-speaker="${actor.id}"`));assert(html.includes('loading="lazy"'));assert(html.includes(actor.file));assert(html.includes(actor.name));assert(!actor.designOnly&&!actor.evidenceOnly);assert.equal((html.match(/data-npc-portrait-image=/g)||[]).length,1);}
 else assert(!html.includes('data-npc-portrait-image'));
}
assert.deepEqual(counts,{'border-scout':4,'hero.human':40,'hero.goblin':39,'mine-foreman':7,'hero.dwarf':45,'forest-keeper':9,'hero.elf':144,'ashen-repairer':6,'hero.ashen':111,'high-priest':59,carter:9,'royal-guard':1,'elf-medic':9,'ashen-chief':8,'ashen-sentry':2});
assert.equal(storyCastSpeaker(STORY_SCENES['C07.O01.dwarf'],'信使：精灵和烬裔打起来了。两边都在收路。'),null,'merchant courier is not medic');
assert.equal(storyCastSpeaker(STORY_SCENES['C06.H01.human'],STORY_SCENES['C06.H01.human'].lines[0]),null,'merchant scout is not silently border scout');
assert.equal(storyCastSpeaker({...STORY_SCENES['C06.D01.dwarf'],id:'fake'},'王室守军：这条道不通，我们赶不上增援。'),null);
assert.equal(storyCastSpeaker(STORY_SCENES['C06.D01.dwarf'],'王室守军：新台词'),null);
assert.equal(renderStoryCastPortrait(STORY_CAST_CHARACTERS['current-dwarf-king']),'');
const ancient=STORY_SCENES['C08.X03.elf'],ancientLine=ancient.lines.find(x=>x.includes('当年的矮人王'));assert.equal(storyCastSpeaker(ancient,ancientLine).id,'high-priest');assert(!renderStoryDialogue(ancient,ancientLine).includes('索兰姆'));
assert.equal(storyCastDisplayLabel(STORY_SCENES['C07.O01.human'],'边境斥候与车夫'),'贝菈与鲁托');
assert.equal(storyCastDisplayLine(STORY_SCENES['C06.A01.ashen'],'族长：你从外面带回了麻烦。'),'玄珀：你从外面带回了麻烦。');
let game=reachStoryScene('dwarf','C06.D03.dwarf');assert.deepEqual(knownStoryEvidenceCast(game),[]);assert(!renderStoryKnowledge(game).includes('维尔铎'));
game=reachStoryScene('dwarf','C06.D03.dwarf',{finishTarget:true});const before=JSON.stringify(game);assert.equal(knownStoryEvidenceCast(game)[0].name,'维尔铎');assert(!renderStoryKnowledge(game).includes('线索资料，不表示人物正在现场'));assert(renderStoryKnowledge(game).includes('已知线索中的人物'));assert(!renderKnownStoryEvidence(game).includes('索兰姆'));assert.equal(JSON.stringify(game),before);
for(const edit of [s=>s.story.flags=s.story.flags.filter(x=>x!=='D_COUP_LINK_PARTIAL'),s=>s.story.knowledge=s.story.knowledge.filter(x=>x.id!=='C06.D03.dwarf.k0'),s=>s.story.completedScenes=s.story.completedScenes.filter(x=>x!=='C06.D03.dwarf'),s=>s.race='human']){const s=structuredClone(game);edit(s);assert.deepEqual(knownStoryEvidenceCast(s),[]);}
// Shared delegate: two automatic tries, manual retry blocks story clicks, no RNG/save.
const oldRandom=Math.random,oldSet=globalThis.setTimeout,oldClear=globalThis.clearTimeout;Math.random=()=>{throw Error('art must not roll')};let scheduled=[];globalThis.setTimeout=(fn,delay)=>{scheduled.push({fn,delay});return scheduled.length};globalThis.clearTimeout=()=>{};
try{const listeners={},attrs={},classes=new Set(),error={hidden:true},img={dataset:{npcPortraitImage:'true'},alt:'玄珀 · 烬裔族长',hidden:false,getAttribute:()=> 'story-portraits/ashen-chief.png'},wrapper={classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k),contains:k=>classes.has(k)},querySelector:q=>q==='.npcPortraitError'?error:img,setAttribute:(k,v)=>attrs[k]=v,removeAttribute:k=>delete attrs[k]};img.closest=()=>wrapper;const host={addEventListener:(k,f,capture)=>{assert(capture);listeners[k]=f},removeEventListener:k=>delete listeners[k]};const dispose=bindNpcPortraitErrors(host);
 listeners.error({target:img});assert(img.hidden&&!error.hidden);assert.equal(scheduled[0].delay,250);scheduled[0].fn();listeners.error({target:img});assert.equal(scheduled[1].delay,1000);scheduled[1].fn();listeners.error({target:img});assert.equal(scheduled.length,2);let blocked=0;listeners.keydown({type:'keydown',key:'Enter',target:{closest:()=>wrapper},preventDefault(){blocked++},stopPropagation(){blocked++}});assert.equal(blocked,2);assert(img.src.endsWith('?asset_retry=3'));listeners.load({target:img});assert(!img.hidden&&error.hidden);dispose();assert.deepEqual(listeners,{});
}finally{Math.random=oldRandom;globalThis.setTimeout=oldSet;globalThis.clearTimeout=oldClear;}
fs.mkdirSync('qa/main-cast',{recursive:true});fs.writeFileSync('qa/main-cast/coverage.json',JSON.stringify({kind:'production pure renderers + actual controller evidence gate; not browser screenshot',scenes:Object.keys(STORY_SCENES).length,lines,narration,counts,sourceSceneHash:sha(fs.readFileSync('dist/story-event-registry.js')),browser:'Chromium launch unavailable in sandbox; no browser claim'},null,2));
console.log('PASS 103 scenes with unchanged mechanical contracts; exact 15 speaking identities / '+Object.values(counts).reduce((a,b)=>a+b,0)+' mapped lines; anonymous roles not merged; no king/minister false historical speaker; scoped postclear personal minister; six image SHA/size checks; bounded shared recovery; no ledger or RNG mutation.');
