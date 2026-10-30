import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {extendBattleManifest} from './dist/race-art.js';
import {liveActorSprite,liveSceneBackgrounds,createLiveBattlePresentation} from './dist/live-battle-view.js';
import {renderEnemyRoster} from './dist/multi-battle-ui.js';
import {drawBattleSliceCanvas} from './dist/battle-slice.js';
import {OTHERWORLD_SPRITE_KEY as key,OTHERWORLD_SPRITE as art} from './dist/otherworld-art.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const m=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))), images=new Map();
const s=reachStoryScene('human','END.H01.human',{finishTarget:true,level:100,spring:'skip'});s.running=false;s.heroHp=E.stats(s).hp;
const now=Math.max(s.lastSeen,s.lastHealthClock??0,s.nextBattleAt??0)+2000;assert(E.enterOtherworld(s,now));const e=E.startRoutedEncounter(s,now+2000);assert(e?.otherworld);const u=e.enemies[0];assert.equal(liveActorSprite(u,m),key);assert.notEqual(liveActorSprite({...u,otherworldActor:false},m),key);assert.equal(liveActorSprite(u,{...m,otherworldSprite:undefined}),null);
const snap={areaId:e.areaId,encounter:e};assert.deepEqual(liveSceneBackgrounds(snap,{...m,otherworldBackground:undefined}),[]);assert.equal(liveSceneBackgrounds(snap,m)[0].id,'otherworld-rift-arena');assert(!liveSceneBackgrounds({...snap,encounter:{...e,otherworld:undefined}},m).some(x=>x.id==='otherworld-rift-arena'));
const hero=m.raceHeroWeaponSprites.human[s.inventory.find(x=>x.id===s.equip.weapon).weaponType];
for(const f of [...liveSceneBackgrounds(snap,m),...m.sprites[hero].frames,...art.frames])if(!images.has(f.file))images.set(f.file,await loadImage('dist/battle-assets/'+f.file));
const view=createLiveBattlePresentation({manifest:m,images});assert.equal(view.sync(s,e,{now,running:true,visible:true}).mode,'ready');assert.equal(view.positions[u.id].sprite,key);assert.equal(view.positions.hero.y,203);assert(!view.detailsHtml.includes('data-monster-detail'));const roster=renderEnemyRoster(e);assert(roster.includes('otherworld-assets/sentinel-idle.png'));assert(!roster.includes('data-monster-detail'));assert(!roster.includes(u.definitionId));
fs.mkdirSync('qa/otherworld',{recursive:true});const live=createCanvas(480,270);assert(view.draw(live,0));fs.writeFileSync('qa/otherworld/live-native.png',live.toBuffer('image/png'));
const sheet=createCanvas(960,882),ctx=sheet.getContext('2d');ctx.fillStyle='#101322';ctx.fillRect(0,0,960,882);ctx.imageSmoothingEnabled=false;
for(const [i,f] of art.frames.entries()){assert.deepEqual(art.animations[f.id],[f.id]);assert(f.alphaBBox[0]>=0&&f.alphaBBox[2]<192);assert(f.alphaBBox[3]>=174&&f.alphaBBox[3]<=178);const c=createCanvas(480,270);drawBattleSliceCanvas(c,{manifest:{...m,areaBackgrounds:undefined,backgrounds:liveSceneBackgrounds(snap,m)},images,encounter:e,positions:view.positions,actorFrames:{[u.id]:f.id},heroMaxHp:E.stats(s).hp});ctx.drawImage(c,(i%2)*480,Math.floor(i/2)*294+24);ctx.fillStyle='#ddd';ctx.font='14px monospace';ctx.fillText(f.id,(i%2)*480+12,Math.floor(i/2)*294+18);}
fs.writeFileSync('qa/otherworld/six-phases-native.png',sheet.toBuffer('image/png'));view.dispose();console.log('PASS exact marker routing, missing art has no ordinary fallback, protected roster/details identity, six authored anchored phases; production native montage written.');

// Tower holding view uses a detached state flag, not a fabricated combat encounter.
const holding=structuredClone(s);holding.activeEncounter=null;holding.running=false;const before=JSON.stringify(holding);
const idleView=createLiveBattlePresentation({manifest:m,images});assert.equal(idleView.sync(holding,null,{now,running:false,visible:true}).mode,'ready');assert.equal(JSON.stringify(holding),before);assert.deepEqual(idleView.status.backgroundIds,['otherworld-rift-arena']);assert.equal(idleView.status.label,'异界待机');assert.deepEqual(Object.keys(idleView.positions),['hero']);assert.equal(idleView.positions.hero.y,203);
assert(idleView.draw(live,0));fs.writeFileSync('qa/otherworld/idle-native.png',live.toBuffer('image/png'));
assert.deepEqual(liveSceneBackgrounds({otherworldActive:true,encounter:{enemies:[]}},{}),[]);
holding.otherworld.active=false;assert.deepEqual(idleView.status.backgroundIds,['otherworld-rift-arena'],'snapshot detached from subsequent state mutation');
for(const bg of liveSceneBackgrounds({areaId:holding.siteId,encounter:{enemies:[]}},m))images.set(bg.file,await loadImage('dist/battle-assets/'+bg.file));
assert.equal(idleView.sync(holding,null,{now,running:false,visible:true}).mode,'ready');assert(!idleView.status.backgroundIds.includes('otherworld-rift-arena'),'exit restores exact ordinary area');assert.equal(idleView.status.label,'野外待机');idleView.dispose();console.log('PASS active tower prestart/inter-fight idle, detached snapshot, missing-art no fallback, exit restores normal background.');
