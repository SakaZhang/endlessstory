import fs from 'node:fs';import {createRequire} from 'node:module';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
import * as E from './dist/engine.js';import {extendBattleManifest} from './dist/race-art.js';import {createLiveBattlePresentation} from './dist/live-battle-view.js';
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map(),out='qa/hero-proportions';fs.mkdirSync(out,{recursive:true});
const records=[];
for(const race of ['dwarf','human','elf','goblin','ashen']){
 for(const weapon of [...Object.keys(race==='dwarf'?manifest.heroWeaponSprites:manifest.raceHeroWeaponSprites[race]),'neutral']){
  let s;for(let n=0;n<1000;n++){s=E.fresh(race);if(weapon==='neutral'||s.inventory.find(i=>i.id===s.equip.weapon)?.weaponType===weapon)break;}
  if(weapon==='neutral')s.equip.weapon=null;
  const camp=manifest.campBackgrounds[race];const key=weapon==='neutral'?(race==='dwarf'?'hero-neutral':manifest.raceHeroNeutralSprites[race]):race==='dwarf'?manifest.heroWeaponSprites[weapon]:manifest.raceHeroWeaponSprites[race][weapon];
  const e=E.startInstanceEncounter(structuredClone(s),race+'.a01.field',10000);
  const files=[camp,...manifest.backgrounds,...Object.values(manifest.sprites).filter(sp=>sp===manifest.sprites[key]||e.enemies.some(u=>manifest.monsterSprites[u.monsterId]&&sp===manifest.sprites[manifest.monsterSprites[u.monsterId]])).flatMap(sp=>sp.frames)];
  for(const f of files)if(!images.has(f.file))images.set(f.file,await loadImage(new URL(f.file,new URL('./dist/battle-assets/',import.meta.url)).pathname));
  const v=createLiveBattlePresentation({manifest,images}),c=createCanvas(480,270);
  for(const scene of ['camp','battle']){s.atCamp=scene==='camp';v.sync(s,scene==='battle'?e:null,{visible:true,running:scene==='battle'});if(v.status.mode!=='ready')throw Error(JSON.stringify(v.status));v.draw(c,0);fs.writeFileSync(`${out}/${race}-${weapon}-${scene}.png`,c.toBuffer('image/png'));records.push({race,weapon,scene,position:v.positions.hero,status:v.status.mode});}
  const p=createCanvas(160,150);v.drawPortrait(p,s);fs.writeFileSync(`${out}/${race}-${weapon}-portrait.png`,p.toBuffer('image/png'));v.dispose();
 }
}
fs.writeFileSync(`${out}/evidence.json`,JSON.stringify({source:'Real E.fresh per race; native starter weapon selected by fresh reroll; neutral explicitly unequipped. Real E.startInstanceEncounter. Presentation-only capture; no combat mutation or publication.',records},null,2));console.log('PASS actual canvas rendered 15 native/neutral variants × camp/battle/portrait; '+out);
