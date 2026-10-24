import fs from 'node:fs';
import {createRequire} from 'node:module';
import {PLAYABLE_RACES,getRacePack} from './dist/race-registry.js';
import {heroPortrait,renderHeroChoices} from './dist/hero-selection.js';
const {createCanvas,loadImage,GlobalFonts}=createRequire(import.meta.url)('@napi-rs/canvas');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','HeroProof');
const output='qa/named-heroes';fs.mkdirSync(output,{recursive:true});
const canvas=createCanvas(1000,320),c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#152321';c.fillRect(0,0,1000,320);
const rows=[];
for(const [i,race]of PLAYABLE_RACES.entries()){const p=getRacePack(race),file=heroPortrait(race),image=await loadImage('dist/'+file);c.fillStyle='#263a36';c.fillRect(i*200+4,4,192,310);c.drawImage(image,i*200+4,8,192,192);c.fillStyle='#d2b678';c.font='20px HeroProof';c.fillText(p.heroName,i*200+12,225);c.fillStyle='#e6e3ca';c.font='14px HeroProof';c.fillText(p.name+' · '+p.heroTitle,i*200+12,253);rows.push({race,name:p.heroName,title:p.heroTitle,file,width:image.width,height:image.height});}
fs.writeFileSync(output+'/native-assets.png',canvas.toBuffer('image/png'));
fs.writeFileSync(output+'/modal.html',renderHeroChoices());
fs.writeFileSync(output+'/evidence.json',JSON.stringify({kind:'Native canvas contact sheet of actual modal image sources, NOT browser layout',browser:'Chromium blocked: socket() Operation not permitted. No retry.',rows},null,2));console.log('PASS five live assets decoded; native contact sheet written');
