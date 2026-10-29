// Production native-canvas proof, not browser UI screenshots. Source PNG bytes stay unchanged.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import * as E from './dist/engine.js';
import {addTestEquipment} from './equipped-test-fixture.mjs';
import {extendBattleManifest} from './dist/race-art.js';
import {createLiveBattlePresentation} from './dist/live-battle-view.js';
import {backgroundSourceRect,backgroundBaselineY,drawBattleBackground} from './dist/background-viewport.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const hashes=['dbf76630e7c913e92f1ca4ce2f9dcb9e037a37beaf3aa400fda569c990a5e62e','87e85cbc537a4a0e6137cd2f048f0bf71ddd2a4bdb2ff3a132e3ad8e1b937e07','df867e3ad0ec329541d652a4e50523072e488ecb1faa896f6567c93390f6533b','024b70e7012243f1b8aee25046f9f9a468610210d429184d62ab2cf5939685aa','a48a28e8b6c0f64894330889d96a845e303d5dfeed4d72d3c302cd075fcbc3ff','81b51eb7995e0c72638a5ee8fae429f507152454e19b8832aa09efabfbb88ac3'];
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map(),out='qa/elf-background-viewport';fs.mkdirSync(out,{recursive:true});
for(const row of [...manifest.backgrounds.filter(b=>b.id.includes('elf')),...Object.entries(manifest.sprites).filter(([id])=>id.includes('elf')).flatMap(([,s])=>s.frames)])if(!images.has(row.file))images.set(row.file,await loadImage('dist/battle-assets/'+row.file));
function opaque(canvas){const data=canvas.getContext('2d').getImageData(0,0,480,270).data;for(let i=3;i<data.length;i+=4)assert.equal(data[i],255,'uncovered canvas pixel');}
function bottomEqual(a,b){assert.deepEqual(a.getContext('2d').getImageData(0,260,480,10).data,b.getContext('2d').getImageData(0,260,480,10).data);}
for(let n=3;n<=8;n++){
 const area=`elf.a0${n}`,bg=manifest.backgrounds.find(b=>b.id==='race-bg-'+area),rect=n<5?[0,2,480,254]:n<7?[0,0,480,246]:[0,0,480,242];
 assert.deepEqual(bg.sourceRect,rect);const r=backgroundSourceRect(bg);assert(Math.abs(r[2]/r[3]-16/9)<1e-12);assert(r[0]>=0&&r[1]>=rect[1]&&r[0]+r[2]<=480&&r[1]+r[3]<=rect[1]+rect[3]);
 assert.equal(manifest.areaBaselines[area],backgroundBaselineY(bg));assert.equal(manifest.areaBaselines[area],n<5?214:n<7?223:226);
 assert.equal(createHash('sha256').update(fs.readFileSync(`dist/races/elf/assets/area-0${n}.png`)).digest('hex'),hashes[n-3]);
 const expected=createCanvas(480,270);expected.getContext('2d').imageSmoothingEnabled=false;drawBattleBackground(expected.getContext('2d'),images.get(bg.file),bg);opaque(expected);
 const s=E.fresh('elf');s.level=100;addTestEquipment(s,{level:100,weaponType:n%2?'staff':'bow'});E.normalizeHealth(s,10000);E.normalizeExpedition(s);s.areaProgress.elf={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9,10]};s.lastSeen=s.lastHealthClock=10000;s.restUntil=0;s.nextBattleAt=0;s.heroHp=E.stats(s).hp;const e=E.startInstanceEncounter(s,area+'.field',10000);assert(e);s.running=true;
 const view=createLiveBattlePresentation({manifest,images}),canvas=createCanvas(480,270);assert.equal(view.sync(s,e,{now:10000,running:true}).mode,'ready');assert(view.draw(canvas,0));assert.equal(view.positions.hero.y,manifest.areaBaselines[area]);assert(Object.values(view.positions).every(p=>p.y<245));for(const p of Object.values(view.positions)){const sprite=manifest.sprites[p.sprite],frame=sprite.frames.find(f=>f.id===sprite.animations.idle[0]),box=frame.solidBBox??frame.alphaBBox,scale=p.scale??1;assert(p.y+(box[1]-sprite.anchor[1])*scale>=0);assert(p.y+(box[3]-sprite.anchor[1])*scale<270);}opaque(canvas);bottomEqual(canvas,expected);fs.writeFileSync(`${out}/area-0${n}-battle.png`,canvas.toBuffer('image/png'));view.dispose();
 const notice=createLiveBattlePresentation({manifest,images:new Map([[bg.file,images.get(bg.file)]])}),nc=createCanvas(480,270);assert.equal(notice.sync(s,e,{now:10000,running:true}).reason,'asset-frames-missing');assert(notice.draw(nc,0));opaque(nc);bottomEqual(nc,expected);fs.writeFileSync(`${out}/area-0${n}-notice.png`,nc.toBuffer('image/png'));notice.dispose();
}
for(const bg of manifest.backgrounds.filter(b=>!b.sourceRect)){const args=[];drawBattleBackground({drawImage:(...a)=>args.push(a)},'image',bg);assert.deepEqual(args,[['image',0,0]]);}
for(const area of ['elf.a01','elf.a02','elf.a09','elf.a10','human.a03','goblin.a03','ashen.a03'])assert.equal(manifest.areaBaselines[area],203);
console.log('PASS elf viewport: six safe source rectangles, equal-axis scale, full opaque normal/notice canvases, transformed baselines, unchanged source hashes and legacy draws.');
