import {createRequire} from 'node:module';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const sourceRoot=process.argv[2]||'../generated_images';
const ids=['b39c32ce-374b-4a90-986a-b926432048e3','fb5dd59a-2765-4abd-94e9-ae5947dc734b','d436f9fa-053b-4632-b452-aa6b0d0b578d','2ef39b1f-0ee6-434c-92d0-e2ff380b3cd5','02852614-a175-4e5c-9da2-e0797f756fb7','138b9114-13e9-4800-986f-41dfa00cbd69','899d33a2-9427-4d0f-b6bf-c082fe969df3','bca56713-c4f0-4b3a-91e8-8b5a6e012a19','7492613d-37b5-462a-a511-ea05142ae068','0e65085f-65e8-40ed-a6fe-0d6c2deee6fc'];
mkdirSync('dist/battle-assets/backgrounds/dwarf-v087',{recursive:true});mkdirSync('qa/dwarf-v087',{recursive:true});
let rows=[];const sheet=createCanvas(1440,1080),sx=sheet.getContext('2d');sx.fillStyle='#111';sx.fillRect(0,0,1440,1080);
for(let n=0;n<10;n++){
 const id='dwarf.a'+String(n+1).padStart(2,'0'),source=sourceRoot+'/exec-'+ids[n]+'.png',im=await loadImage(source),c=createCanvas(480,270),x=c.getContext('2d');
 x.imageSmoothingEnabled=false;
 // Uniform center crop to 16:9 then nearest-neighbor downsample; no painted/composited elements.
 const scale=Math.max(480/im.width,270/im.height),w=480/scale,h=270/scale,rect=[(im.width-w)/2,(im.height-h)/2,w,h];x.drawImage(im,...rect,0,0,480,270);
 const file='backgrounds/dwarf-v087/'+id+'.png',bytes=c.toBuffer('image/png');writeFileSync('dist/battle-assets/'+file,bytes);sx.drawImage(c,n%3*480,Math.floor(n/3)*270);
 rows.push({id,file,size:[480,270],z:0,source:'exec-'+ids[n]+'.png',sourceSize:[im.width,im.height],crop:rect,sha256:createHash('sha256').update(bytes).digest('hex')});
}
writeFileSync('qa/dwarf-v087/after.png',sheet.toBuffer('image/png'));
writeFileSync('dwarf-scenes-v087-source.json',JSON.stringify({tool:'built-in image_gen',packaging:'uniform center-crop to 16:9; nearest-neighbor 480x270',scenes:rows},null,2)+'\n');
for(const path of ['dist/battle-assets/manifest.json','dist/map-assets/exploration-manifest.json']){
 const m=JSON.parse(readFileSync(path));for(const row of rows){const b={id:'dwarf-v087-'+row.id,file:(path.includes('map-assets')?'../battle-assets/':'')+row.file,size:row.size,z:0};m.backgrounds=m.backgrounds.filter(x=>x.id!==b.id);m.backgrounds.push(b);m.areaBackgrounds[row.id]=[b.id];}
 if(path.includes('map-assets'))m.purpose='Exploration-only scene routing. All races use dedicated complete geography; dwarf scenes refreshed in v0.87.';
 else m.dwarfSceneRedesign={version:'v0.87',source:'dwarf-scenes-v087-source.json',note:'Ten complete generated landscapes. Historical layers preserved for compatibility; current battle and exploration share updated geography. Camp unchanged.'};
 writeFileSync(path,JSON.stringify(m,null,2)+'\n');
}
