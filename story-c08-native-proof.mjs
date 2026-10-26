// Native production renderer + real story encounters. Not a browser capture.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {STORY_SCENARIOS} from './dist/story-scenario-registry.js';
import {STORY_ACTOR_ART} from './dist/story-actor-art.js';
import {extendBattleManifest} from './dist/race-art.js';
import {createLiveBattlePresentation} from './dist/live-battle-view.js';
import {renderEnemyRoster} from './dist/multi-battle-ui.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map(),rows=[];
const output='qa/story-c08';fs.mkdirSync(output,{recursive:true});
const sheet=createCanvas(960,810),cx=sheet.getContext('2d');cx.fillStyle='#0e1d2b';cx.fillRect(0,0,960,810);
for(const [i,id] of ['story.c07-ea03-elf','story.c08-e03-elf','story.c08-x04-human'].entries()){
 const d=STORY_SCENARIOS[id],a=STORY_ACTOR_ART[d.actorId],meta=JSON.parse(fs.readFileSync('dist/'+a.file.replace('.png','.json'))),bytes=fs.readFileSync('dist/'+a.file);assert.equal(createHash('sha256').update(bytes).digest('hex'),meta.sha256);assert.deepEqual(meta.alphaBBox,a.alphaBBox);assert.deepEqual(meta.solidBBox,a.solidBBox);
 const s=reachStoryScene(d.race,d.sceneId),e=E.startStoryScenario(s,id,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e);const actor=manifest.storyActorSprites[d.actorId];assert(actor);const weapon=s.inventory.find(it=>it.id===s.equip.weapon).weaponType,keys=[manifest.raceHeroWeaponSprites[s.race][weapon],actor],bgs=manifest.areaBackgrounds[d.siteId].map(id=>manifest.backgrounds.find(bg=>bg.id===id));
 for(const f of [...bgs,...keys.flatMap(key=>manifest.sprites[key].frames)])if(!images.has(f.file))images.set(f.file,await loadImage('dist/battle-assets/'+f.file));
 const art=images.get('../'+a.file),alpha=createCanvas(192,192);assert.equal(art.width,192);assert.equal(art.height,192);alpha.getContext('2d').drawImage(art,0,0);const pixels=alpha.getContext('2d').getImageData(0,0,192,192).data;assert([...pixels].some((v,n)=>n%4===3&&v===0));assert([...pixels].some((v,n)=>n%4===3&&v===255));
 const view=createLiveBattlePresentation({manifest,images}),canvas=createCanvas(960,240);assert.equal(view.sync(s,e,{now:s.lastHealthClock,running:s.running,visible:true}).mode,'ready');assert(view.draw(canvas,0));assert(Object.values(view.positions).some(p=>p.sprite===actor));
 const roster=renderEnemyRoster(e);assert(roster.includes(a.file));assert(!roster.includes('data-monster-detail='),'dedicated identity is not disguised local fauna/codex');
 cx.fillStyle='#f6e7b4';cx.font='14px sans-serif';cx.fillText(d.actorName+' · '+id,12,i*270+20);cx.drawImage(canvas,0,i*270+28);fs.writeFileSync(`${output}/${d.actorId}.png`,canvas.toBuffer('image/png'));rows.push({id,sceneId:d.sceneId,selectedHero:s.race,actorId:d.actorId,actorKey:actor,asset:a.file,sha256:meta.sha256,solidBBox:a.solidBBox,source:'actual controller + engine + production renderer; test-only level/area access'});view.dispose();
}
fs.writeFileSync(`${output}/three-actors.png`,sheet.toBuffer('image/png'));fs.writeFileSync(`${output}/evidence.json`,JSON.stringify({kind:'native production renderer, not browser screenshot',rows},null,2));console.log('PASS three dedicated C07–C08 identities, real production renderer, true-alpha source hashes, exact target sprites, no creature/codex substitution.');
