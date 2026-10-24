// New racial cutouts only. Dwarf legacy bounds intentionally have separate rules.
// Inclusive x/y extrema of every nontransparent pixel (alpha > 0), with <=2px
// tolerance for pre-existing inclusive/exclusive edge conventions. This catches
// stale metadata after resizing/cropping without discarding translucent effects.
import assert from 'node:assert/strict';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {EXPANSION_PACKS} from './dist/race-packs.js';
let count=0;const seen=new Set();
async function walk(value){
 if(!value||typeof value!=='object')return;
 if(Array.isArray(value.frames))for(const frame of value.frames){
  assert(Array.isArray(frame.alphaBBox)&&frame.alphaBBox.length===4,frame.file+' requires measured alphaBBox');
  if(seen.has(frame.file))continue;seen.add(frame.file);
  const image=await loadImage(new URL('./dist/'+frame.file,import.meta.url).pathname),canvas=createCanvas(image.width,image.height),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
  const data=ctx.getImageData(0,0,image.width,image.height).data,bounds=[image.width,image.height,-1,-1];
  for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(data[(y*image.width+x)*4+3]>0){bounds[0]=Math.min(bounds[0],x);bounds[1]=Math.min(bounds[1],y);bounds[2]=Math.max(bounds[2],x);bounds[3]=Math.max(bounds[3],y);}
  assert(bounds[2]>=0,frame.file+' is blank');assert(bounds.every((v,i)=>Math.abs(v-frame.alphaBBox[i])<=2),frame.file+' stale alphaBBox '+JSON.stringify({registered:frame.alphaBBox,decoded:bounds}));count++;
 }
 for(const child of Object.values(value))if(typeof child==='object')await walk(child);
}
for(const pack of EXPANSION_PACKS)await walk(pack.art);
assert(count>1000);console.log(`PASS ${count} new racial frame bounds match decoded PNGs (alpha>0 inclusive,2px tolerance); original Dwarf metadata untouched.`);
