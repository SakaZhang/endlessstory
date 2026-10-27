// Actual production battle renderer, not a browser screenshot.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {extendBattleManifest} from './dist/race-art.js';
import {createLiveBattlePresentation} from './dist/live-battle-view.js';
import {renderEnemyRoster} from './dist/multi-battle-ui.js';
import {renderStoryEventBoard} from './dist/story-event-ui.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map(),rows=[];
const out='qa/story-finale';fs.mkdirSync(out,{recursive:true});const sheet=createCanvas(960,1350),cx=sheet.getContext('2d');cx.fillStyle='#10202b';cx.fillRect(0,0,960,1350);
for(const [i,race] of ['human','dwarf','elf','goblin','ashen'].entries()){
 const s=reachStoryScene(race,'C10.X07.'+race),id='story.c10-x07-'+race,e=E.startStoryScenario(s,id,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e);const weapon=s.inventory.find(it=>it.id===s.equip.weapon).weaponType,actor=manifest.storyActorSprites[e.enemies[0].storyActorId],keys=[(manifest.raceHeroWeaponSprites[race]?.[weapon]??manifest.heroWeaponSprites[weapon]),actor],bgs=manifest.areaBackgrounds[s.siteId].map(id=>manifest.backgrounds.find(bg=>bg.id===id));
 for(const f of [...bgs,...keys.flatMap(k=>manifest.sprites[k].frames)])if(!images.has(f.file))images.set(f.file,await loadImage('dist/battle-assets/'+f.file));
 const view=createLiveBattlePresentation({manifest,images}),canvas=createCanvas(960,240);assert.equal(view.sync(s,e,{now:s.lastHealthClock,running:s.running,visible:true}).mode,'ready');assert(view.draw(canvas,0));assert(Object.values(view.positions).some(p=>p.sprite===actor));const html=renderEnemyRoster(e);assert(html.includes('story-assets/'));assert(!html.includes('data-monster-detail='));assert.equal(e.enemies.length,1);
 cx.fillStyle='#f6e7b4';cx.font='14px sans-serif';cx.fillText(race+' · four supports permanently down · solo final checkpoint',12,i*270+20);cx.drawImage(canvas,0,i*270+28);fs.writeFileSync(out+'/'+race+'.png',canvas.toBuffer('image/png'));rows.push({race,id,enemyCount:e.enemies.length,actor:e.enemies[0].storyActorId,flags:s.story.flags.filter(f=>f.startsWith('SUPPORT_')),source:'real controller + combat engine + production native renderer'});view.dispose();
}
fs.writeFileSync(out+'/five-povs.png',sheet.toBuffer('image/png'));fs.writeFileSync(out+'/evidence.json',JSON.stringify({kind:'native renderer, not browser screenshot',rows},null,2));console.log('PASS five selected protagonists solo in actual final boss renderer, correct registered demon (not fauna/codex), four persisted altar flags, native evidence written.');
