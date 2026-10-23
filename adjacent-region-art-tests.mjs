// Canvas/HTML/CSS evidence only, NOT browser screenshots or measured browser layout.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {fresh,normalizeAreaProgress} from './dist/engine.js';
import {buildRegionSnapshot,buildRegionModel,renderRegion} from './dist/adjacent-region.js';
import {drawAdjacentRegion} from './dist/adjacent-region-map.js';
const {createCanvas,GlobalFonts}=createRequire(import.meta.url)('@napi-rs/canvas');
const out=new URL('./qa/adjacent-region/',import.meta.url);mkdirSync(out,{recursive:true});
for(const file of ['fixture.html','a01-desktop.html','a02-desktop.html','a03-desktop.html','a03-mobile.html'])rmSync(new URL(file,out),{force:true});
const css=readFileSync(new URL('./dist/adjacent-region.css',import.meta.url),'utf8');
assert.match(css,/min-width:44px;min-height:44px/);assert.match(css,/@media\(max-width:600px\)/);assert.match(css,/min-height:390px/);
// Fail when declared CSS changes: estimates must be updated with renderer styling.
for(const token of ['width:20%;max-width:190px','width:14%;max-width:130px','width:46%;max-width:none;left:50%!important','width:30%;max-width:none;top:8px','padding:10px 7px','padding:8px 5px','font-size:12px;line-height:1.5','font-size:11px','top:36%','top:60%','top:84%','top:62%','top:40%','top:76%'])assert.ok(css.includes(token),'CSS estimate drift: '+token);
assert.match(css,/\.adjacentRegion \.localNode,\.adjacentRegion \.localNode:hover,\.adjacentRegion \.localNode:disabled\{transform:translate\(-50%,-50%\)\}/);
const evidence=[];
const fontFamily='Noto Sans CJK JP';
assert.ok(GlobalFonts.families.some(f=>f.family===fontFamily),'installed CJK font required for estimates');
const measure=createCanvas(8,8).getContext('2d');
const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
function wrapped(text,width,size,bold=false){
 measure.font=`${bold?'bold ':''}${size}px "${fontFamily}"`;
 const lines=[];let line='';
 for(const char of Array.from(text)){if(line&&measure.measureText(line+char).width>width){lines.push(line);line='';}line+=char;}
 if(line)lines.push(line);
 return {text,font:measure.font,lines,widths:lines.map(x=>measure.measureText(x).width),lineHeight:size*1.5};
}
function estimate(markup,viewport){
 const mobile=viewport<=600,width=viewport-2,height=mobile?388:viewport*9/16-2;
 const rows=[];
 for(const m of markup.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)){
  const attrs=m[1],inner=m[2],className=attrs.match(/class="([^"]*)"/)?.[1]??'';
  const id=decode(attrs.match(/data-region-id="([^"]*)"/)?.[1]??'');
  if(className.includes('localNode')){
   const kind=['field','dungeon','boss'].find(k=>className.split(' ').includes(k));
   const w=mobile?width*.46:Math.min(width*.20,190),textWidth=w-2-14;
   const label=decode(inner.match(/<span>(.*?)<\/span>/s)[1]),name=decode(inner.match(/<b>(.*?)<\/b>/s)[1]);
   const text=[wrapped(label,textWidth,11),wrapped(name,textWidth,12,true)];
   const h=Math.max(44,22+text.reduce((n,t)=>n+t.lines.length*t.lineHeight,0));
   const cx=width*(mobile?.50:({field:.30,dungeon:.58,boss:.73})[kind]);
   const cy=height*(mobile?({field:.36,dungeon:.60,boss:.84})[kind]:({field:.62,dungeon:.40,boss:.76})[kind]);
   rows.push({id,type:'node',kind,x:1+cx-w/2,y:1+cy-h/2,w,h,textWidth,padding:[10,7],border:1,text});
  }else if(className.split(' ').includes('edge')){
   const w=mobile?width*.30:Math.min(width*.14,130),textWidth=w-2-10,text=[wrapped(decode(inner),textWidth,13)];
   const h=Math.max(44,18+text[0].lines.length*text[0].lineHeight),left=className.split(' ').includes('left');
   rows.push({id,type:'edge',side:left?'left':'right',x:1+(left?0:width-w),y:1+(mobile?8:height*.12),w,h,textWidth,padding:[8,5],border:1,text});
  }
 }
 const gaps=[];
 for(const a of rows){assert.ok(a.w>=44&&a.h>=44);assert.ok(a.x>=0&&a.x+a.w<=viewport&&a.y>=0&&a.y+a.h<=height+2);for(const t of a.text)assert.ok(t.widths.every(w=>w<=a.textWidth+.01));}
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const a=rows[i],b=rows[j],horizontalGap=Math.max(b.x-(a.x+a.w),a.x-(b.x+b.w)),verticalGap=Math.max(b.y-(a.y+a.h),a.y-(b.y+b.h));
  assert.ok(horizontalGap>=0||verticalGap>=0,`font-estimated overlap ${a.id} / ${b.id} at ${viewport}`);
  gaps.push({pair:[a.id||a.side,b.id||b.side],horizontalGap,verticalGap});
 }
 return {viewport,mapBorderBox:[viewport,height+2],fontFamily,minimumTarget:44,overlapCount:0,rows,gaps};
}

for(const area of ['dwarf.a01','dwarf.a02','dwarf.a03']){
 const s=fresh();normalizeAreaProgress(s);s.areaProgress.dwarf={unlocked:[1,2,3],cleared:[1,2]};
 const snap=buildRegionSnapshot(s,1000,null,{exploredAreaIds:[]});const model=buildRegionModel(snap,{viewAreaId:area,previewNodeId:null,travelPanelOpen:false});
 const canvas=createCanvas(960,540);assert.equal(drawAdjacentRegion({querySelector:()=>canvas},model.area),true);
 writeFileSync(new URL(area+'-scene.png',out),canvas.toBuffer('image/png'));
 const markup=renderRegion(model);assert.equal((markup.match(/class="localNode /g)||[]).length,area==='dwarf.a03'?3:2);assert.ok(!markup.includes('futureAreaTrack'));
 writeFileSync(new URL(area+'-renderer.html',out),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="../../dist/style.css"><link rel="stylesheet" href="../../dist/adjacent-region.css"><body>'+markup+'</body></html>');
 evidence.push({area,canvas:[960,540],realNodeIds:model.nodes.map(n=>n.id),edges:model.edges,travelCollapsed:!model.travelPanelOpen,layouts:[estimate(markup,960),estimate(markup,360),estimate(markup,336)]});
}
writeFileSync(new URL('structure-evidence.json',out),JSON.stringify({kind:'Actual renderer HTML text + installed CJK canvas measureText + declared CSS box estimates; NOT browser DOM measurements/screenshots',method:{fontFamily,wrapping:'Unicode code points, measured greedy wrapping within content width; overflow-wrap:anywhere approximation',node:'11px label line-height 16.5; bold12px name line-height18; padding10px 7px; border1px; min44',edge:'inherited13px line-height19.5; padding8px 5px; border1px; min44',widths:[960,360,336],limitations:'Font substitution differs from user browser. CSS engine text shaping, actual page gutters, hover/focus, full-page layout and screenshot QA remain unverified.'},evidence},null,2));
console.log('PASS actual renderer node/edge text: 3 areas × 960/360/336px; measured CJK wrapping, min44 targets, bounded boxes and no estimated overlap. Canvas/text/CSS estimates only, not browser DOM/screenshots.');
