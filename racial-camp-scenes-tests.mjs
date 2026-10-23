import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import * as E from './dist/engine.js';
import {createLiveBattlePresentation,liveCampRace,RACIAL_CAMPS} from './dist/live-battle-view.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const manifest=JSON.parse(readFileSync('dist/battle-assets/manifest.json'));
const images=new Map();for(const row of [...manifest.backgrounds,...Object.values(manifest.campBackgrounds),...Object.values(manifest.sprites).flatMap(x=>x.frames)])images.set(row.file,await loadImage('dist/battle-assets/'+row.file));
const now=Date.now(),s=E.fresh();assert.equal(s.atCamp,true);assert(E.validSave(s));
const old=structuredClone(s);delete old.atCamp;assert(E.validSave(old));assert.equal(liveCampRace(old),null,'existing stopped field save must not teleport');old.restUntil=now+300000;assert.equal(liveCampRace(old),'dwarf','existing active rest uses camp without migration');
assert.equal(E.startInstanceEncounter(s,'dwarf.a10.boss',now),null);assert.equal(s.atCamp,true,'failed start cannot leave camp');
const encounter=E.startInstanceEncounter(s,'dwarf.a01.field',now);assert(encounter);assert.equal(s.atCamp,false);E.setMultiPaused(s,true,now+100);assert.equal(s.atCamp,false,'pause is not return');assert(E.startRest(s,now+200));assert.equal(s.atCamp,true);assert.equal(s.activeEncounter,null);const restUntil=s.restUntil;assert.equal(restUntil,s.lastHealthClock+300000);assert(E.settleRest(s,restUntil));assert.equal(s.atCamp,true,'rest complete stays in camp until actual next encounter');assert.equal(s.running,false);assert(E.validSave(s));
const canvas=createCanvas(480,270),view=createLiveBattlePresentation({manifest,images});const out='qa/racial-camp-scenes';mkdirSync(out,{recursive:true});
for(const race of Object.keys(RACIAL_CAMPS)){
 const state={...s,siteId:race+'.a01'};const before=JSON.stringify(state);const oldRng=Math.random;Math.random=()=>{throw Error('presentation RNG')};try{view.sync(state,null,{visible:true,running:false});assert.equal(view.status.mode,'ready');assert.equal(view.status.campRace,race);assert.deepEqual(view.status.backgroundIds,['camp-'+race]);assert.deepEqual(Object.keys(view.positions),['hero']);assert.equal(view.positions.hero.y,manifest.campBackgrounds[race].baseline);assert(view.draw(canvas,0));assert.equal(JSON.stringify(state),before);}finally{Math.random=oldRng;}writeFileSync(out+'/'+race+'.png',canvas.toBuffer('image/png'));
}
const missing=new Map(images);missing.delete(manifest.campBackgrounds.dwarf.file);const unavailable=createLiveBattlePresentation({manifest,images:missing});unavailable.sync(s,null);assert.equal(unavailable.status.reason,'asset-frames-missing');assert(unavailable.draw(canvas),'missing camp displays retry notice, never old field fallback');
const resumed=structuredClone(s);resumed.running=true;resumed.restResume=true;assert(E.startRest(resumed,restUntil+1,true));const end=resumed.restUntil;assert(E.settleRest(resumed,end));assert.equal(resumed.atCamp,true);assert(E.startRoutedEncounter(resumed,end));assert.equal(resumed.atCamp,false,'automatic resumption leaves camp only on successful encounter');
console.log('PASS camp identity, persisted legacy absent flag, successful start/failed start, pause, rest/manual and automatic resume, five real camp render assets, read-only no fake enemies.');
