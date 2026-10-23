// Static DOM/CSS contract math, not a browser/layout-engine screenshot.
import assert from 'node:assert/strict';import fs from 'node:fs';import {TERRITORIES} from './dist/maps.js';
const css=fs.readFileSync(new URL('./dist/adjacent-region-map.css',import.meta.url),'utf8');
assert(css.includes('.viewport>.mapHint{position:relative'));assert(css.includes('width:70px;min-width:70px;min-height:46px'));assert(css.includes('font-size:12px'));
const app=fs.readFileSync(new URL('./dist/app.js',import.meta.url),'utf8');assert(app.includes('class="worldMapStage"'));assert(app.includes('style="left:${t.x*100}%;top:${t.y*100}%"'));assert(!app.includes('drawWorld('));
const results=[];
for(const [viewport,stage,width,height] of [[320,292,70,46],[390,362,70,46],[768,520,120,50],[1440,1000,145,55]]){
 const rects=TERRITORIES.map(t=>({id:t.id,x:t.x*stage-width/2,y:t.y*stage*9/16-height/2,w:width,h:height}));
 for(const a of rects){assert(a.x>=0&&a.x+a.w<=stage,`${viewport} ${a.id} bounds`);for(const b of rects){if(a.id>=b.id)continue;assert(!(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y),`${viewport} overlap ${a.id}/${b.id}`)}}
 results.push({viewport,assumedStageWidth:stage,assumedPin:[width,height],overlap:false});
}
console.log('PASS static DOM anchor/CSS checks; geometry assumptions (not measured browser boxes):',JSON.stringify(results));
