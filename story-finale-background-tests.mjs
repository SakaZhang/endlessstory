import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';
import {extendBattleManifest} from './dist/race-art.js';import {liveSceneBackgrounds,liveAreaBackgrounds} from './dist/live-battle-view.js';
import {STORY_BATTLE_BACKGROUNDS} from './dist/story-battle-backgrounds.js';
const {loadImage,createCanvas}=createRequire(import.meta.url)('@napi-rs/canvas');const original=JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')),m=extendBattleManifest(original),ordinary=liveAreaBackgrounds('ashen.a07',m);
assert.equal(Object.keys(STORY_BATTLE_BACKGROUNDS).length,10);assert.deepEqual(liveSceneBackgrounds({areaId:'ashen.a07',encounter:{}},m),ordinary);
for(const r of ['human','dwarf','elf','goblin','ashen'])for(const phase of ['x05','x07']){const id='story.c10-'+phase+'-'+r,row=STORY_BATTLE_BACKGROUNDS[id];assert.deepEqual(liveSceneBackgrounds({areaId:'ashen.a07',encounter:{storyScenario:{id}}},m),[row]);assert.match(row.file,phase==='x05'?/ritual-open/:/ritual-closed/);}
assert.deepEqual(liveSceneBackgrounds({areaId:'ashen.a07',encounter:{storyScenario:{id:'story.c08-x04-human'}}},m),ordinary);
assert.deepEqual(liveSceneBackgrounds({areaId:'ashen.a07',encounter:{storyScenario:{id:'unregistered'}}},m),ordinary);
for(const file of ['central-ritual-open','central-ritual-closed']){const im=await loadImage('dist/story-assets/'+file+'.png');assert.equal(im.width,480);assert.equal(im.height,270);const c=createCanvas(480,270);c.getContext('2d').drawImage(im,0,0);const data=c.getContext('2d').getImageData(0,0,480,270).data;for(let i=3;i<data.length;i+=4)assert.equal(data[i],255);}
assert.notEqual(createHash('sha256').update(fs.readFileSync('dist/story-assets/central-ritual-open.png')).digest('hex'),createHash('sha256').update(fs.readFileSync('dist/story-assets/central-ritual-closed.png')).digest('hex'));
console.log('PASS exact ten scenario-only open/closed ritual overrides, normal A07/C08/unregistered encounters unchanged, opaque 480x270 images; production native proof covers baseline203 and correct actors.');
