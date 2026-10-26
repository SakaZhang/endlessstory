// Native Canvas proof using the actual source PNGs and production renderers.
// This is deliberately NOT described as browser layout or a browser screenshot.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import * as E from './dist/engine.js';
import {PLAYABLE_RACES,getRacePack} from './dist/race-registry.js';
import {heroPortrait,heroPortraitScale,heroPortraitScaleX,renderHeroChoices} from './dist/hero-selection.js';
import {extendBattleManifest} from './dist/race-art.js';
import {drawLiveHeroPortrait} from './dist/live-battle-view.js';
import {drawBattleSliceCanvas} from './dist/battle-slice.js';
const {createCanvas,loadImage,GlobalFonts}=createRequire(import.meta.url)('@napi-rs/canvas');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','HeroProof');
const out=process.argv[2]??'qa/goblin-facing',baseline='2a77f9eceee8f77a0e39429d6c40513f7c230395';fs.mkdirSync(out,{recursive:true});
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map();
const variants={...manifest.raceHeroWeaponSprites.goblin,neutral:manifest.raceHeroNeutralSprites.goblin};
const sourceFrames=Object.entries(variants).flatMap(([weapon,key])=>manifest.sprites[key].frames.map(frame=>({weapon,key,frame})));
for(const {frame}of sourceFrames)images.set(frame.file,await loadImage(new URL(frame.file,new URL('./dist/battle-assets/',import.meta.url))));
function sheet(w,h){const canvas=createCanvas(w,h),c=canvas.getContext('2d');c.fillStyle='#263a36';c.fillRect(0,0,w,h);c.imageSmoothingEnabled=false;c.fillStyle='#e6e3ca';c.font='14px HeroProof';return [canvas,c];}
const [source,sc]=sheet(1200,880),[camp,cc]=sheet(1200,880);
for(const [i,{weapon,key,frame}]of sourceFrames.entries()){
 const x=i%6*200,y=Math.floor(i/6)*220;sc.fillText(weapon+' / '+frame.id,x+5,y+16);sc.drawImage(images.get(frame.file),x+4,y+20);
 const actual=createCanvas(480,270);drawBattleSliceCanvas(actual,{manifest:{...manifest,backgrounds:[],areaBackgrounds:undefined},images,encounter:{enemies:[]},positions:{hero:{x:96,y:192,sprite:key,scale:1}},actorFrames:{hero:frame.id}});cc.fillText(weapon+' / '+frame.id,x+5,y+16);cc.drawImage(actual,0,16,192,192,x+4,y+20,192,192);
}
fs.writeFileSync(out+'/source-22-frames.png',source.toBuffer('image/png'));fs.writeFileSync(out+'/camp-facing-22-frames.png',camp.toBuffer('image/png'));
// Reproduce only the selection asset transform/scale, not browser layout.
const [selection,sel]=sheet(1000,600);
for(const [i,race]of PLAYABLE_RACES.entries()){
 const im=await loadImage('dist/'+heroPortrait(race)),scale=heroPortraitScale(race),x=i*200+100;
 for(let row=0;row<2;row++){
  const y=row*300,flip=row?heroPortraitScaleX(race):1;sel.fillText((row?'AFTER ':'BEFORE ')+getRacePack(race).heroName,x-86,y+25);
  sel.save();sel.translate(x,y+240);sel.scale(flip,1);sel.drawImage(im,-96*scale,-176*scale,192*scale,192*scale);sel.restore();
 }
}
fs.writeFileSync(out+'/selection-before-after.png',selection.toBuffer('image/png'));fs.writeFileSync(out+'/selection-markup.html',renderHeroChoices());
const temporary='dist/.goblin-facing-before.js';
fs.writeFileSync(temporary,execFileSync('git',['show',baseline+':dist/live-battle-view.js']));
try{
 const before=(await import('./'+temporary)).drawLiveHeroPortrait;
 for(const [name,w,h]of [['hud',160,150],['equipment',240,280]]){
  const [proof,c]=sheet(w*2,(h+36)*3);
  for(const [i,weapon]of Object.keys(variants).entries()){
   const state=E.fresh('goblin');if(weapon==='neutral')state.equip.weapon=null;else state.inventory.find(it=>it.id===state.equip.weapon).weaponType=weapon;
   for(let side=0;side<2;side++){
    const canvas=createCanvas(w,h);(side?drawLiveHeroPortrait:before)(canvas,state,{manifest,images});c.fillText((side?'AFTER ':'BEFORE ')+weapon,side*w+5,i*(h+36)+23);c.drawImage(canvas,side*w,i*(h+36)+30);
   }
  }
  fs.writeFileSync(out+'/'+name+'-before-after.png',proof.toBuffer('image/png'));
 }
}finally{fs.unlinkSync(temporary);}
fs.writeFileSync(out+'/evidence.json',JSON.stringify({kind:'Native source and production Canvas proof; NOT browser verification',baseline,sourceFrames:sourceFrames.length,sourceArtChanged:false,selection:'Actual heroPortrait/heroPortraitScale/heroPortraitScaleX; native transform demonstration, not browser layout',portraits:'Actual before/after drawLiveHeroPortrait at HUD and equipment sizes',camp:'Actual unchanged drawBattleSliceCanvas for every Goblin frame',browser:'Prior Chromium socket EPERM; no workaround/retry attempted.'},null,2));
console.log('PASS wrote native source, selection transform, actual portrait before/after and all 22 camp-frame proofs to '+out);
