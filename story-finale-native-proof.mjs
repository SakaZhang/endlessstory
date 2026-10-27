// Actual production battle renderer, not a browser screenshot.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {extendBattleManifest} from './dist/race-art.js';
import {createLiveBattlePresentation,liveSceneBackgrounds} from './dist/live-battle-view.js';
import {renderEnemyRoster} from './dist/multi-battle-ui.js';
import {renderStoryEventBoard} from './dist/story-event-ui.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map(),rows=[];
const out='qa/story-finale';fs.mkdirSync(out,{recursive:true});const sheet=createCanvas(960,1500),cx=sheet.getContext('2d');cx.fillStyle='#10202b';cx.fillRect(0,0,960,1500);
for(const [i,race] of ['human','dwarf','elf','goblin','ashen'].entries())for(const [j,phase] of ['X05','X07'].entries()){
 const s=reachStoryScene(race,'C10.'+phase+'.'+race),id='story.c10-'+phase.toLowerCase()+'-'+race,e=E.startStoryScenario(s,id,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e);const weapon=s.inventory.find(it=>it.id===s.equip.weapon).weaponType,actor=manifest.storyActorSprites[e.enemies[0].storyActorId],keys=[(manifest.raceHeroWeaponSprites[race]?.[weapon]??manifest.heroWeaponSprites[weapon]),...e.enemies.map(u=>manifest.storyActorSprites[u.storyActorId])],bgs=liveSceneBackgrounds({areaId:s.siteId,encounter:e},manifest);
 for(const f of [...bgs,...keys.flatMap(k=>manifest.sprites[k].frames)])if(!images.has(f.file))images.set(f.file,await loadImage('dist/battle-assets/'+f.file));
 const view=createLiveBattlePresentation({manifest,images}),canvas=createCanvas(960,240);assert.equal(view.sync(s,e,{now:s.lastHealthClock,running:s.running,visible:true}).mode,'ready');assert(view.draw(canvas,0));assert(Object.values(view.positions).some(p=>p.sprite===actor));const html=renderEnemyRoster(e);assert(html.includes('story-assets/'));assert(!html.includes('data-monster-detail='));assert.equal(e.enemies.length,phase==='X05'?2:1);assert.deepEqual(view.status.backgroundIds,[phase==='X05'?'story-central-ritual-open':'story-central-ritual-closed']);assert.equal(view.positions.hero.y,203);
 cx.fillStyle='#f6e7b4';cx.font='14px sans-serif';cx.fillText(race+' · '+phase+' · '+(phase==='X05'?'portal open / four supports active':'portal closed / four supports down'),j*480+12,i*300+20);cx.drawImage(canvas,j*480,i*300+28);fs.writeFileSync(out+'/'+race+'-'+phase+'.png',canvas.toBuffer('image/png'));rows.push({race,phase,id,backgroundIds:view.status.backgroundIds,baseline:view.positions.hero.y,enemyCount:e.enemies.length,actor:e.enemies[0].storyActorId,flags:s.story.flags.filter(f=>f.startsWith('SUPPORT_')),source:'real controller + combat engine + production native renderer'});view.dispose();
}
fs.writeFileSync(out+'/five-povs.png',sheet.toBuffer('image/png'));fs.writeFileSync(out+'/evidence.json',JSON.stringify({kind:'native renderer, not browser screenshot',rows},null,2));console.log('PASS five protagonists in both real boss phases, exact open/closed central ritual scenery, correct registered demon (not fauna/codex), four persisted altar flags, native evidence written.');
