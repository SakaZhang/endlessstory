import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {RACE_PACK as p} from './dist/races/elf/index.js';import {extendBattleManifest} from './dist/race-art.js';import {heroPresentationScale} from './dist/hero-proportions.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json')));let count=0;
for(const [variant,sprite] of Object.entries({...p.art.hero,neutral:p.art.heroNeutral})){
 assert.deepEqual(sprite.anchor,[96,176]);assert.deepEqual(sprite.frameSize,[192,192]);
 const key=variant==='neutral'?'elf-hero-neutral':'hero-elf-'+variant;
 for(const f of sprite.frames){const im=await loadImage('dist/'+f.file);assert.equal(im.width,192);assert.equal(im.height,192);const c=createCanvas(192,192),ctx=c.getContext('2d');ctx.drawImage(im,0,0);const d=ctx.getImageData(0,0,192,192).data,b=[192,192,-1,-1];let hairTop=192;
 for(let y=0;y<192;y++)for(let x=0;x<192;x++){if(d[(y*192+x)*4+3]>0){b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y);}if(x>=70&&x<108&&y>=60&&y<140&&d[(y*192+x)*4+3]>32)hairTop=Math.min(hairTop,y);}
 assert.deepEqual(f.alphaBBox,b,f.id+' exact alpha bounds');assert.equal(b[3],variant==='neutral'?176:175);
 if(f===sprite.frames[0]){const actual=[hairTop,b[3]];assert.deepEqual(manifest.sprites[key].bodyReferenceBounds,actual,variant+' metadata must match actual hair-to-feet pixels, not weapon tip');assert.equal((actual[1]-actual[0]+1)*heroPresentationScale(manifest.sprites[key],'elf'),98);}
 count++;
 }
 for(const action of ['idle','attack','hurt','death'])assert(sprite.animations[action].every(id=>sprite.frames.some(f=>f.id===id)));
}
assert.equal(count,20);console.log('PASS20 actual slim Elf PNGs; exact bounds, unchanged anchor and lifecycle mapping; actual hair-to-feet bounds match98px body calibration.');
