// Asset integration only: alpha-bound crops and nearest-neighbor downscaling.
// Source pixels are generated using the built-in imagegen tool; no procedural painting.
import fs from 'node:fs';import {createRequire} from 'node:module';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const root='qa/elf-equipment-parity';
const jobs=[['weapons',5,2,[9,10,11,12].map(n=>`elf_scatter_weapon_${n}`).concat('elf-last-string',[13,14,15,16].map(n=>`elf_scatter_weapon_${n}`),'elf-sixfold-heartwood')],['ordinary',5,2,['elf_scatter_helm_5','elf_scatter_helm_6','elf_scatter_armor_5','elf_scatter_armor_6','elf_scatter_gloves_5','elf_scatter_gloves_6','elf_scatter_boots_5','elf_scatter_boots_6','elf_scatter_amulet_5','elf_scatter_amulet_6']],['sets',4,3,['elf_arrow','elf_prism','elf_root'].flatMap(s=>['helm','armor','gloves','boots'].map(slot=>`${s}_${slot}`))]];
const manifest=[];
for(const [family,cols,rows,ids] of jobs){const img=await loadImage(`${root}/sources/${family}.png`),c=createCanvas(img.width,img.height),g=c.getContext('2d');g.drawImage(img,0,0);const d=g.getImageData(0,0,c.width,c.height).data;
for(let i=0;i<ids.length;i++){const x0=Math.round(i%cols*c.width/cols),x1=Math.round((i%cols+1)*c.width/cols),y0=Math.round(Math.floor(i/cols)*c.height/rows),y1=Math.round((Math.floor(i/cols)+1)*c.height/rows);let l=x1,t=y1,r=x0,b=y0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(d[(y*c.width+x)*4+3]>24){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}const sw=r-l+1,sh=b-t+1;
for(const size of [32,48,64]){const out=createCanvas(size,size),og=out.getContext('2d');og.imageSmoothingEnabled=false;const ratio=(size-6)/Math.max(sw,sh),w=Math.round(sw*ratio),h=Math.round(sh*ratio);og.drawImage(img,l,t,sw,sh,Math.floor((size-w)/2),Math.floor((size-h)/2),w,h);const dir=`dist/races/elf/assets/equipment/${size}`;fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(`${dir}/${ids[i]}.png`,out.toBuffer('image/png'));}
manifest.push({id:ids[i],source:`sources/${family}.png`,cell:[x0,y0,x1,y1],crop:[l,t,sw,sh],method:'alpha bounds >24; nearest-neighbor; preserved source alpha'});}}
fs.writeFileSync(`${root}/extraction.json`,JSON.stringify(manifest,null,2));console.log('Extracted',manifest.length,'independent imagegen icons at 32/48/64px');
