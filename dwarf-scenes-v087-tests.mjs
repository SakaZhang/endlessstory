import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const root='dist/battle-assets/',m=JSON.parse(readFileSync(root+'manifest.json')),e=JSON.parse(readFileSync('dist/map-assets/exploration-manifest.json')),src=JSON.parse(readFileSync('dwarf-scenes-v087-source.json'));
const baseline=JSON.parse(execFileSync('git',['show','6e83080:dist/battle-assets/manifest.json'],{encoding:'utf8'})),oldExplore=JSON.parse(execFileSync('git',['show','6e83080:dist/map-assets/exploration-manifest.json'],{encoding:'utf8'}));
assert.equal(src.scenes.length,10);const hashes=new Set();
for(const row of src.scenes){
 const ids=m.areaBackgrounds[row.id];assert.deepEqual(ids,['dwarf-v087-'+row.id]);assert.deepEqual(e.areaBackgrounds[row.id],ids);
 const b=m.backgrounds.find(b=>b.id===ids[0]),eb=e.backgrounds.find(b=>b.id===ids[0]);assert.equal(b.file,row.file);assert.equal(eb.file,'../battle-assets/'+row.file);assert.deepEqual(b.size,[480,270]);assert.equal(b.z,0);
 const bytes=readFileSync(root+b.file),hash=createHash('sha256').update(bytes).digest('hex');assert.equal(hash,row.sha256);hashes.add(hash);
 const im=await loadImage(bytes);assert.equal(im.width,480);assert.equal(im.height,270);const c=createCanvas(480,270),x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,480,270).data;for(let i=3;i<d.length;i+=4)assert.equal(d[i],255,'complete opaque scene, no empty stage cutout');
}
assert.equal(hashes.size,10,'ten distinct geographies');assert.deepEqual(m.areaBaselines,baseline.areaBaselines,'same actor ground anchors');assert.deepEqual(m.campBackgrounds,baseline.campBackgrounds,'camp scenes untouched');
for(const [id,route] of Object.entries(oldExplore.areaBackgrounds))if(!id.startsWith('dwarf.'))assert.deepEqual(e.areaBackgrounds[id],route,'other race geography unchanged');
for(const b of baseline.backgrounds)assert.deepEqual(m.backgrounds.find(x=>x.id===b.id),b,'legacy layers metadata preserved');
console.log('PASS 10 distinct opaque 480x270 generated scenes, exact source hashes, shared exploration/battle routes, unchanged anchors/camps/other races and legacy layers.');
