import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const {HERO_PORTRAIT_ASSETS:manifest}=await import('./dist/hero-portraits/manifest.js');
const provenance=JSON.parse(fs.readFileSync('art/brock-redesign/portrait-manifest.json'));
const row=provenance.characters['dwarf.brock'],hash=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.deepEqual(Object.keys(manifest.characters['dwarf.brock'].assets),['96'],'only the consumed 96px asset is in runtime');assert.deepEqual(manifest.characters['dwarf.brock'].assets['96'],row.assets['96']);
assert.equal(row.race,'dwarf');assert.equal(row.facing,'right');
assert.equal(hash(fs.readFileSync(row.source.file)),row.source.sha256);
assert.deepEqual(row.source.crop,[1018,128,1763,873]);
for(const size of [96,192]){
 const asset=row.assets[size],bytes=fs.readFileSync(size===96?'dist/'+asset.file:asset.file),image=await loadImage(bytes);
 assert.equal(hash(bytes),asset.sha256);assert.equal(image.width,size);assert.equal(image.height,size);
 const canvas=createCanvas(size,size),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const data=ctx.getImageData(0,0,size,size).data;
 const bounds=threshold=>{const box=[size,size,-1,-1];for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(data[(y*size+x)*4+3]>threshold){box[0]=Math.min(box[0],x);box[1]=Math.min(box[1],y);box[2]=Math.max(box[2],x);box[3]=Math.max(box[3],y);}return box;};
 assert.deepEqual(bounds(0),asset.alphaBBox);assert.deepEqual(bounds(128),asset.solidBBox);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(x<asset.contentPadding||y<asset.contentPadding||x>=size-asset.contentPadding||y>=size-asset.contentPadding)assert.equal(data[(y*size+x)*4+3],0,'transparent safety border keeps both horns intact');
}
execFileSync('python3',['tools/package-brock-portrait.py','--check'],{stdio:'inherit'});
console.log('PASS dedicated Brock 96/192 bust: approved source hash, exact crop/NN bytes, original alpha, measured bounds and horn safety margins. No battle/full-body consumer changed.');
