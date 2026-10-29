import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';import {extendBattleManifest} from './dist/race-art.js';import {drawBattleSliceCanvas} from './dist/battle-slice.js';import {CANONICAL_LEGENDARY_WEAPONS as C,legendaryFrameFiles,drawCanonicalWeapon} from './dist/legendary-weapon-layer.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map();for(const [id,w] of Object.entries(C)){const bytes=fs.readFileSync('dist/battle-assets/'+w.file);assert.equal(createHash('sha256').update(bytes).digest('hex'),w.sha256,id+' immutable source');images.set(w.file,await loadImage(bytes));}
let frames=0;
for(const [race,entries] of Object.entries(manifest.legendaryHeroSprites))for(const [id,key] of Object.entries(entries)){
 const sprite=manifest.sprites[key];assert.equal(sprite.legendaryWeapon?.id,id);assert(Number.isFinite(sprite.legendaryWeapon.scale)&&sprite.legendaryWeapon.scale>0);assert.equal(sprite.frames.length,8);
 for(const f of sprite.frames){assert(f.file.startsWith('../legendary-hero-body/'));assert(!('file'in f.weaponPose));assert(!('scale'in f.weaponPose));const body=await loadImage('dist/battle-assets/'+f.file);images.set(f.file,body);
  const canvas=createCanvas(480,270),ctx=canvas.getContext('2d'),draws=[];const proxy=new Proxy(ctx,{get(target,k){if(k==='drawImage')return (img,...args)=>{draws.push(img);target.drawImage(img,...args);};return typeof target[k]==='function'?target[k].bind(target):target[k];},set(t,k,v){t[k]=v;return true;}});
  drawBattleSliceCanvas({getContext:()=>proxy},{manifest:{...manifest,backgrounds:[],areaBackgrounds:undefined},images,encounter:{enemies:[]},positions:{hero:{x:150,y:200,sprite:key,scale:1}},actorFrames:{hero:f.id}});
  assert.equal(draws.filter(img=>img===images.get(C[id].file)).length,1,key+'/'+f.id+' draws exact shared asset once');assert(draws.every(img=>img===body||img===images.get(C[id].file)),'no alternate weapon or painted substitute');frames++;
 }
}
assert.equal(frames,200);
// Runtime bow clipping may remove only the old cord and the isolated red source speck.
const original=createCanvas(64,64),clipped=createCanvas(64,64),a=original.getContext('2d'),b=clipped.getContext('2d'),bow=images.get(C['elf-last-string'].file);a.drawImage(bow,0,0);drawCanonicalWeapon(b,bow,'elf-last-string',{}, {string:false});const aa=a.getImageData(0,0,64,64).data,bb=b.getImageData(0,0,64,64).data;let differences=0;
for(let y=0;y<64;y++)for(let x=0;x<64;x++){const p=(y*64+x)*4;if(aa.slice(p,p+4).some((v,j)=>v!==bb[p+j])){differences++;assert((x>=36&&x<=47&&y>=11&&y<=50)||(x>=22&&x<=31&&y>=56)||y>=59,'bow limb/leaf/handle unexpectedly changed '+[x,y]);}}
assert(differences>0);for(let y=58;y<64;y++)for(let x=23;x<31;x++)assert.equal(bb[(y*64+x)*4+3],0,'red debris removed in shared layer');
assert.equal(fs.readdirSync('dist/legendary-hero-assets',{recursive:true}).filter(f=>String(f).endsWith('.png')).length,0,'rejected baked runtime art removed');
console.log('PASS immutable canonical PNG/hash + exact shared draw for 200 real production frames; no per-race weapon override/scale; bow limbs pixel-identical outside cord/red-speck clip; no baked runtime assets.');
