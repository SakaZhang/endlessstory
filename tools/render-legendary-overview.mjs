import {legendaryFrameFiles} from '../dist/legendary-weapon-layer.js';
// Actual production renderer, all races share world pixel scale; not promotional/generated art.
import fs from 'node:fs';import {createRequire} from 'node:module';import {extendBattleManifest} from '../dist/race-art.js';import {drawBattleSliceCanvas} from '../dist/battle-slice.js';import {heroPresentationScale} from '../dist/hero-proportions.js';
const require=createRequire(import.meta.url);let canvas;try{canvas=require('@napi-rs/canvas');}catch{canvas=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');}const {createCanvas,loadImage,GlobalFonts}=canvas;GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','LegendCJK');
const m=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),races=[['dwarf','矮人'],['human','人类'],['elf','精灵'],['goblin','哥布林'],['ashen','烬裔']],weapons=[['first-forge-oathhammer','王统·初炉誓锤'],['human-oathblade','王誓·未折之锋'],['elf-sixfold-heartwood','六相·心木初鸣'],['elf-last-string','归林·最后一弦'],['goblin-silent-ration','留一口·无声刃']];
for(const mode of ['idle','attack']){
 const out=createCanvas(1800,1090),c=out.getContext('2d');c.fillStyle='#14212b';c.fillRect(0,0,1800,1090);c.fillStyle='#edc768';c.font='bold 27px LegendCJK';c.fillText('长路未尽 · 传说武器跨种族外观',32,44);c.fillStyle='#b6c3ca';c.font='15px LegendCJK';c.fillText((mode==='idle'?'待机':'攻击')+' · 实际游戏渲染 · 各族保持原生比例 · 每套另有完整8帧动作',32,76);
 for(let col=0;col<weapons.length;col++){c.fillStyle='#edc768';c.font='18px LegendCJK';c.fillText(weapons[col][1],150+col*325,116);}
 for(let row=0;row<races.length;row++){
  const [race,label]=races[row];c.fillStyle='#c4d0d6';c.font='bold 20px LegendCJK';c.fillText(label,28,230+row*180);
  for(let col=0;col<weapons.length;col++){
   const [id]=weapons[col],key=m.legendaryHeroSprites[race]?.[id],sprite=m.sprites[key];const x=130+col*325,y=135+row*180;c.fillStyle=(row+col)%2?'#1b2a34':'#192731';c.fillRect(x,y,319,173);
   if(!sprite){c.fillStyle='#8e9ca4';c.font='14px LegendCJK';c.fillText('待制作',x+85,y+100);continue;}
   const frame=sprite.frames.find(f=>f.id===(mode==='idle'?'idle-0':'attack')),images=new Map(await Promise.all(legendaryFrameFiles(sprite,frame).map(async file=>[file,await loadImage('dist/battle-assets/'+file)]))),tile=createCanvas(319,173);
   drawBattleSliceCanvas(tile,{manifest:{...m,backgrounds:[],areaBackgrounds:undefined},images,encounter:{enemies:[]},positions:{hero:{x:100,y:160,sprite:key,scale:heroPresentationScale(sprite,race)}},actorFrames:{hero:frame.id}});c.drawImage(tile,x,y);
  }
 }
 c.fillStyle='#99aab4';c.font='14px LegendCJK';c.fillText('范围：5种传说武器专属造型；不含戒指、项链、核心、防具的全身换装。',32,1063);fs.writeFileSync(`qa/legendary-race-art/all-races-${mode}-native.png`,out.toBuffer('image/png'));
}
