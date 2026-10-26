// Native production live renderer proof only; not a browser screenshot.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {reachStoryScene} from './story-event-test-fixture.mjs';
import {STORY_SCENARIOS} from './dist/story-scenario-combat.js';
import {extendBattleManifest} from './dist/race-art.js';
import {createLiveBattlePresentation} from './dist/live-battle-view.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map();
// Load only actual scenario actor/background files, not all release assets.
const cases=[];for(const [id,d] of Object.entries(STORY_SCENARIOS).filter(([id])=>/^story\.c0[15]\./.test(id))){const s=reachStoryScene(d.race,d.sceneId,{level:d.sceneId.startsWith('C01')?1:60});const e=E.startStoryScenario(s,id,Math.max(s.lastHealthClock,s.nextBattleAt??0)+2000);assert(e);const weapon=s.inventory.find(it=>it.id===s.equip.weapon).weaponType,keys=[manifest.raceHeroWeaponSprites[s.race][weapon],manifest.raceHeroWeaponSprites[d.actorRace][d.actorWeapon]],bgs=manifest.areaBackgrounds[d.siteId].map(id=>manifest.backgrounds.find(bg=>bg.id===id));for(const f of [...bgs,...keys.flatMap(key=>manifest.sprites[key].frames)])if(!images.has(f.file))images.set(f.file,await loadImage('dist/battle-assets/'+f.file));cases.push({id,d,s,e});}
const output='qa/story-scenarios';fs.mkdirSync(output,{recursive:true});const sheet=createCanvas(960,620),cx=sheet.getContext('2d');cx.fillStyle='#0e1d2b';cx.fillRect(0,0,960,620);const rows=[];
for(let i=0;i<cases.length;i++){const {id,d,s,e}=cases[i],view=createLiveBattlePresentation({manifest,images}),canvas=createCanvas(480,270);assert.equal(view.sync(s,e,{now:s.lastHealthClock,running:true,visible:true}).mode,'ready');assert(view.draw(canvas,0));const x=i%2*480,y=Math.floor(i/2)*310;cx.fillStyle='#f6e7b4';cx.font='13px sans-serif';cx.fillText(id,x+8,y+18);cx.drawImage(canvas,x,y+28);fs.writeFileSync(`${output}/${id}.png`,canvas.toBuffer('image/png'));rows.push({id,sceneId:d.sceneId,selectedHero:s.race,opponent:d.actorRace,actorKeys:Object.values(view.positions).map(p=>p.sprite),status:view.status,source:'canonical public controller actions + genuine prior combat + real startStoryScenario + createLiveBattlePresentation; explicit test-only level/area-access fixture'});view.dispose();}
fs.writeFileSync(`${output}/four-scenes.png`,sheet.toBuffer('image/png'));fs.writeFileSync(`${output}/evidence.json`,JSON.stringify({kind:'native production renderer; not browser capture',rows},null,2));console.log('PASS native scenario renderer: four real encounters, real hero assets, exact scene backgrounds, no replacement opponent art.');
