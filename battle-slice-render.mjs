// QA only: actual production slice renderer + engine events, not a browser screenshot.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {createBattleSliceModel,createBattleSlicePresentation,drawBattleSliceCanvas,slicePositions,sliceActorMetadata} from './dist/battle-slice.js';
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require('@napi-rs/canvas');
const out=process.argv[2]??'/workspace/shared/battle-slice-review';fs.mkdirSync(path.join(out,'frames'),{recursive:true});
const root='dist/battle-assets/',manifest=JSON.parse(fs.readFileSync(root+'manifest.json')),images=new Map();
for(const f of [...manifest.backgrounds,...Object.values(manifest.sprites).flatMap(s=>s.frames)])images.set(f.file,await loadImage(root+f.file));
const scenario=process.argv[3]??'fire';
const START=1800000000000,model=createBattleSliceModel({now:START,scenario}),positions=slicePositions(model.encounter),presentation=createBattleSlicePresentation(positions,sliceActorMetadata(model.state)),canvas=createCanvas(480,270),events=[],initial=JSON.stringify(model.state);model.toggle(START);
const fps=20,duration=22000;let nextStep=1100;
for(let i=0;i<=duration/1000*fps;i++){
 const t=i*1000/fps;
 if(t>=nextStep){const batch=model.advance(START+t);events.push(...batch);presentation.enqueue(batch,t);nextStep+=1100;}
 presentation.advance(t);
 const stateBeforeDraw=JSON.stringify(model.state);
 drawBattleSliceCanvas(canvas,{manifest,images,encounter:model.encounter,positions,animations:presentation.animations,time:t,floats:presentation.floats});
 assert.equal(JSON.stringify(model.state),stateBeforeDraw,'native drawing must not mutate gameplay');
 fs.writeFileSync(path.join(out,'frames',String(i).padStart(4,'0')+'.png'),canvas.toBuffer('image/png'));
}
fs.writeFileSync(path.join(out,'events.json'),JSON.stringify(events,null,2));fs.writeFileSync(path.join(out,'initial-state.json'),initial);
const report={kind:'native-canvas sequence, NOT browser or full HTML/HUD QA',renderer:'drawBattleSliceCanvas',presentation:'createBattleSlicePresentation',fixture:model.fixture,initialSha256:createHash('sha256').update(initial).digest('hex'),fps,durationMs:duration,frameCount:duration/1000*fps+1,enemyCount:model.encounter.enemies.length,events:events.length,kinds:Object.fromEntries([...new Set(events.map(e=>e.kind))].map(k=>[k,events.filter(e=>e.kind===k).length])),crits:events.filter(e=>e.crit).length,multiSegments:events.filter(e=>e.segmentIndex>0).length,emissionError:model.emissionError};
fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));model.dispose();
