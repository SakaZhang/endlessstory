// Mechanical imagegen packaging only: whole-image nearest-neighbor fit. No painting, recoloring, cropping or clipped-pixel deletion.
// Reviewed edge-touching sources retain their entire image inside a transparent 2px frame.
const PADDED_IDS=new Set(['goblin_scatter_weapon_8','goblin_scatter_armor_6','ashen.scatter.43','ashen.scatter.44','ashen.scatter.46','ashen.scatter.47','ashen.scatter.48','ashen.scatter.53']);
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const dir='tests/art/goblin-ashen-parity';
const rows=JSON.parse(fs.readFileSync(dir+'/generation.json'));
const result=[];
for(const row of rows){
 const race=row.id.startsWith('goblin')?'goblin':'ashen';
 const source=dir+'/sources/'+row.id+'.png',file=`dist/races/${race}/assets/${row.id}.png`;
 const padded=PADDED_IDS.has(row.id);
 if(padded||!fs.existsSync(file))execFileSync('magick',padded?[source,'-filter','point','-resize','60x60','-background','none','-gravity','center','-extent','64x64','-define','png:exclude-chunk=date,time',file]:[source,'-filter','point','-resize','64x64!',file]);
 const im=await loadImage(file),c=createCanvas(64,64),ctx=c.getContext('2d');ctx.drawImage(im,0,0);
 const pixels=ctx.getImageData(0,0,64,64).data;let transparent=0,visible=0;const bounds=[64,64,-1,-1];
 for(let y=0;y<64;y++)for(let x=0;x<64;x++){const alpha=pixels[(y*64+x)*4+3];if(!alpha)transparent++;else{visible++;bounds[0]=Math.min(bounds[0],x);bounds[1]=Math.min(bounds[1],y);bounds[2]=Math.max(bounds[2],x);bounds[3]=Math.max(bounds[3],y);}}
 result.push({id:row.id,source,file,transparentPadding:padded?2:0,prompt:row.prompt,sha256:createHash('sha256').update(fs.readFileSync(file)).digest('hex'),sourceSha256:createHash('sha256').update(fs.readFileSync(source)).digest('hex'),size:[64,64],transparentPixels:transparent,visiblePixels:visible,alphaBounds:bounds});
}
fs.writeFileSync('goblin-ashen-parity-art-source-manifest.json',JSON.stringify({generator:'built-in image_gen.imagegen',packaging:'Individual generated sources, whole-image nearest-neighbor fit to 64x64; reviewed edge-touching sources fit within 60x60 and centered on transparent 64x64. Original source pixels retained without cropping, recoloring or procedural drawing.',entries:result},null,2)+'\n');
for(const race of ['goblin','ashen']){
 const subset=result.filter(r=>r.id.startsWith(race));const columns=5,cellW=220,cellH=272,c=createCanvas(columns*cellW,Math.ceil(subset.length/columns)*cellH),ctx=c.getContext('2d');ctx.fillStyle='#202431';ctx.fillRect(0,0,c.width,c.height);ctx.imageSmoothingEnabled=false;
 for(const [i,r] of subset.entries()){const x=(i%columns)*cellW,y=Math.floor(i/columns)*cellH,im=await loadImage(r.file);ctx.drawImage(im,x+14,y+4,192,192);ctx.drawImage(im,x+12,y+198,64,64);ctx.fillStyle='#eee';ctx.font='12px sans-serif';ctx.fillText(r.id.replace('goblin_scatter_','gob_'),x+80,y+230);}
 fs.writeFileSync(dir+'/'+race+'-contact.png',c.toBuffer('image/png'));
}
console.log('Packaged '+result.length+' individually generated icons, manifest and native + enlarged contacts.');

{const rows=result.filter(r=>PADDED_IDS.has(r.id)),c=createCanvas(4*220,2*272),ctx=c.getContext('2d');ctx.fillStyle='#202431';ctx.fillRect(0,0,c.width,c.height);ctx.imageSmoothingEnabled=false;for(const[i,r]of rows.entries()){const x=(i%4)*220,y=Math.floor(i/4)*272,im=await loadImage(r.file);ctx.drawImage(im,x+14,y+4,192,192);ctx.drawImage(im,x+12,y+198,64,64);ctx.fillStyle='#eee';ctx.font='12px sans-serif';ctx.fillText(r.id.replace('goblin_scatter_','gob_'),x+80,y+230);}fs.writeFileSync(dir+'/padded-contact.png',c.toBuffer('image/png'));}
