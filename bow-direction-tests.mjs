import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {LEGENDARY_HERO_ART as ART} from './dist/legendary-hero-art.js';import {CANONICAL_BOW_STRING as B} from './dist/legendary-weapon-layer.js';
const {loadImage,createCanvas}=createRequire(import.meta.url)('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const transform=(s,f,point,mirror=1)=>{const p=f.weaponPose,a=p.angle*Math.PI/180,k=s.legendaryWeapon.scale,x=(point[0]-p.grip[0])*k,y=(point[1]-p.grip[1])*k;return [(p.hand[0]+x*Math.cos(a)-y*Math.sin(a)-s.anchor[0])*mirror,p.hand[1]+x*Math.sin(a)+y*Math.cos(a)];};
let poses=0;
for(const [race,entries] of Object.entries(ART)){const s=entries['elf-last-string'];for(const f of s.frames){if(f.id==='death')continue;const p=f.weaponPose;assert.deepEqual(p.grip,[18,30],race+' true source grip');
 for(const mirror of [1,-1]){const hand=transform(s,f,[18,30],mirror),front=transform(s,f,[14,30],mirror),rest=transform(s,f,B.rest,mirror);assert(mirror*(front[0]-rest[0])>4,race+'/'+f.id+' limbs face enemy after mirror');assert(mirror*(hand[0]-rest[0])>4,race+'/'+f.id+' string lies behind grip toward archer');
  if(f.id==='anticipation'){assert(p.bowPull&&p.drawHand);const pull=transform(s,f,p.bowPull,mirror);assert(mirror*(rest[0]-pull[0])>2,race+' draws backward not toward enemy');assert(Math.abs(pull[0]-(p.drawHand[0]-s.anchor[0])*mirror)<.02&&Math.abs(pull[1]-p.drawHand[1])<.02,race+' string meets inspected rear finger');}
  else assert.equal(p.bowPull,undefined,race+'/'+f.id+' no stale draw point after release');
 }
 const body=await loadImage('dist/battle-assets/'+f.file),cv=createCanvas(body.width,body.height),c=cv.getContext('2d');c.drawImage(body,0,0);const rgba=c.getImageData(0,0,body.width,body.height).data;
 const occupied=point=>{for(let y=Math.round(point[1])-3;y<=Math.round(point[1])+3;y++)for(let x=Math.round(point[0])-3;x<=Math.round(point[0])+3;x++)if(rgba[(y*body.width+x)*4+3]>128)return true;return false;};assert(occupied(p.hand),race+'/'+f.id+' grip must intersect actual body hand pixels');if(p.drawHand)assert(occupied(p.drawHand),race+' draw finger must exist in actual body pixels');poses++;
 }}
assert.equal(poses,35);console.log('PASS 5 races ×7 active bow poses, right-facing + whole-sprite mirrored left: limbs toward enemy, string behind grip, anticipation pulled back to actual rear-hand pixels, release/recovery no stale pull. Death excluded from shooting geometry; no arrow sprite is rendered.');
