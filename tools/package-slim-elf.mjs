// Packaging imagegen art only: alpha cleanup, crop, uniform point sampling, anchor placement.
// No anatomy deformation, body painting, or per-frame scale normalization.
import fs from 'node:fs';
import {createRequire} from 'node:module';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
import {art} from '../dist/races/elf/content.js';
import {HERO_NEUTRAL} from '../dist/races/elf/art-neutral.js';
const dir='qa/elf-slim-review';
function bounds(c,threshold=0){const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,b=[c.width,c.height,-1,-1];for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>threshold){b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y);}return b;}
const report=[];
for(const variant of ['bow','staff','neutral']){
 const im=await loadImage(`${dir}/${variant}-lifecycle-source.png`),cols=variant==='neutral'?2:4,rows=2,cells=[];
 for(let i=0;i<cols*rows;i++){const c=createCanvas(im.width/cols,im.height/rows),ctx=c.getContext('2d');ctx.drawImage(im,-i%cols*c.width,-Math.floor(i/cols)*c.height);const d=ctx.getImageData(0,0,c.width,c.height);for(let a=3;a<d.data.length;a+=4)if(d.data[a]<32)d.data[a]=0;ctx.putImageData(d,0,0);cells.push({c,b:bounds(c)});}
 // Staff's idle hair top is y238 in generated source, excluding the staff tip.
 const bodyTop=variant==='staff'?238:cells[0].b[1];
 const bodyHeight=variant==='staff'?75:82,scale=bodyHeight/(cells[0].b[3]-bodyTop+1);
 const sprite=variant==='neutral'?HERO_NEUTRAL:art.hero[variant];
 for(let i=0;i<cells.length;i++){const {c,b}=cells[i],out=createCanvas(192,192),ctx=out.getContext('2d');ctx.imageSmoothingEnabled=false;
 const w=Math.round((b[2]-b[0]+1)*scale),h=Math.round((b[3]-b[1]+1)*scale),bottom=variant==='neutral'?177:176;
 ctx.drawImage(c,b[0],b[1],b[2]-b[0]+1,b[3]-b[1]+1,96-Math.floor(w/2),bottom-h,w,h);
 const f=sprite.frames[i];fs.writeFileSync('dist/'+f.file,out.toBuffer('image/png'));f.alphaBBox=bounds(out);if(variant==='neutral')f.solidBBox=bounds(out,128);report.push({variant,frame:f.id,sourceBBox:b,scale,alphaBBox:f.alphaBBox,bodyReferenceTop:bodyTop});
 }
}
const file='dist/races/elf/content.js',content=fs.readFileSync(file,'utf8');fs.writeFileSync(file,content.replace(/^export const art=.*;$/m,'export const art='+JSON.stringify(art)+';'));
fs.writeFileSync('dist/races/elf/art-neutral.js','// Imagegen slender empty-hand Elf lifecycle; 192px canvases and existing anchors preserved.\nexport const HERO_NEUTRAL='+JSON.stringify(HERO_NEUTRAL,null,2)+';\n');
fs.writeFileSync(dir+'/packaging-proof.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
