import assert from 'node:assert/strict';import fs from 'node:fs';
import {extendBattleManifest} from './dist/race-art.js';import {drawBattleSliceCanvas,battleSpriteFrames,battleSpriteFlipX} from './dist/battle-slice.js';
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map();let draws=0;
for(const sprite of Object.values(manifest.sprites))for(const f of sprite.frames)images.set(f.file,{});
for(const b of manifest.backgrounds)images.set(b.file,{});
const context=new Proxy({drawImage(img){assert(img,'undefined native frame image');draws++;},measureText:s=>({width:s.length*5})},{get(o,k){return k in o?o[k]:(...args)=>{};}}),canvas={getContext:()=>context};
for(const [key,sprite] of Object.entries(manifest.sprites).filter(([key])=>key.startsWith('race-')||key.startsWith('hero-'))){
 for(const mode of ['idle','attack','hurt','death','anticipation','recovery']){const ids=battleSpriteFrames(sprite,mode);assert(ids?.length,key+' '+mode);for(const id of ids)assert(sprite.frames.some(f=>f.id===id),key+' '+mode+' '+id);
 const position={hero:{x:100,y:203,sprite:key}},encounter={areaId:'human.a01',enemies:[]};drawBattleSliceCanvas(canvas,{manifest,images,encounter,positions:position,animations:new Map([['hero',{kind:mode,at:0,skillId:null}]]),time:100,heroMaxHp:0});
 }
}
assert(battleSpriteFlipX({facing:'left'},{},100,300));assert(!battleSpriteFlipX({facing:'left'},{},300,100));console.log('PASS native frame routes for every race sprite and lifecycle fallback; canvas adapter draws '+draws+' sprites/backgrounds. Not screenshot or art-quality approval.');
