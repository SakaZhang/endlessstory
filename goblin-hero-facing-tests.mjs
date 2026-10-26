import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import * as E from './dist/engine.js';
import {PLAYABLE_RACES} from './dist/race-registry.js';
import {extendBattleManifest} from './dist/race-art.js';
import {heroPortrait,heroPortraitScaleX,renderHeroChoices} from './dist/hero-selection.js';
import {heroPortraitFlipX,heroPresentationScale,HERO_REFERENCE_HEIGHTS} from './dist/hero-proportions.js';
import {drawLiveHeroPortrait,liveHeroSpriteFor} from './dist/live-battle-view.js';
import {drawBattleSliceCanvas} from './dist/battle-slice.js';
const {createCanvas,loadImage}=createRequire(import.meta.url)('@napi-rs/canvas');
const manifest=extendBattleManifest(JSON.parse(fs.readFileSync('dist/battle-assets/manifest.json'))),images=new Map();
const heroKeys=new Set(['dwarf','dwarf-hammer','hero-neutral',...Object.values(manifest.raceHeroWeaponSprites).flatMap(Object.values),...Object.values(manifest.raceHeroNeutralSprites)]);
for(const key of [...heroKeys,'raider'])for(const f of manifest.sprites[key].frames)images.set(f.file,await loadImage(new URL(f.file,new URL('./dist/battle-assets/',import.meta.url))));
const html=renderHeroChoices(),css=fs.readFileSync('dist/style.css','utf8');
for(const race of PLAYABLE_RACES){
 assert.equal(heroPortraitScaleX(race),race==='goblin'?-1:1);
 const card=html.match(new RegExp('data-new-hero-race="'+race+'"[\\s\\S]*?</button>'))?.[0];
 assert(card?.includes('--hero-facing:'+heroPortraitScaleX(race)),race+' actual selection markup');
 assert(card.includes('src="'+heroPortrait(race)+'"'),race+' same original image identity');
}
assert(css.includes('transform:translateX(-50%) scaleX(var(--hero-facing,1))'),'one image-only flip after centering; text and card remain unchanged');
assert.equal(heroPortraitFlipX({facing:'left'},{facing:'right'}),false,'frame override wins');
assert.equal(heroPortraitFlipX({facing:'right'},{facing:'left'}),true);
assert.equal(heroPortraitFlipX({},{}),false,'unknown art is not arbitrarily flipped');
// Independent pre-fix portrait rendering: the patch must be exactly its mirror
// for Goblin and pixel-identical for every other native/neutral hero.
function originalPortrait(canvas,state,sprite,frame){
 const c=canvas.getContext('2d'),width=canvas.width,height=canvas.height;c.imageSmoothingEnabled=false;
 const box=frame.solidBBox??[0,0,192,192],w=box[2]-box[0]+1,h=box[3]-box[1]+1,fitScale=Math.max(.5,Math.min((width-12)/w,(height-10)/h)),scale=HERO_REFERENCE_HEIGHTS[state.race]?Math.min(fitScale,(height-10)/112*heroPresentationScale(sprite,state.race)):fitScale;
 c.drawImage(images.get(frame.file),Math.round((width-w*scale)/2-box[0]*scale),Math.round(height-5-(box[3]+1)*scale),Math.round(192*scale),Math.round(192*scale));
}
let portraits=0,frames=0,draws=0;
for(const race of PLAYABLE_RACES){
 const variants={...(race==='dwarf'?manifest.heroWeaponSprites:manifest.raceHeroWeaponSprites[race]),neutral:race==='dwarf'?'hero-neutral':manifest.raceHeroNeutralSprites[race]};
 for(const [weapon,key]of Object.entries(variants)){
  const state=E.fresh(race);if(weapon==='neutral')state.equip.weapon=null;else state.inventory.find(i=>i.id===state.equip.weapon).weaponType=weapon;
  assert.equal(liveHeroSpriteFor(weapon==='neutral'?null:weapon,manifest,race),key);
  const sprite=manifest.sprites[key];
  for(const [i,id]of sprite.animations.idle.entries())for(const [width,height]of [[160,150],[240,280]]){
   const frame=sprite.frames.find(f=>f.id===id),canvas=createCanvas(width,height),expected=createCanvas(width,height),ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx);let call;
   ctx.drawImage=(img,...args)=>{call={img,args,m:ctx.getTransform()};return draw(img,...args);};
   const stateBefore=JSON.stringify(state),manifestBefore=JSON.stringify(manifest);
   assert(drawLiveHeroPortrait(canvas,state,{manifest,images,time:i*500}));
   assert.equal(call.img,images.get(frame.file));assert.equal(call.m.a,race==='goblin'?-1:1);assert.equal(call.m.d,1);
   assert.equal(call.args[2],call.args[3],'uniform scale, no stretching');assert.equal(ctx.getTransform().a,1);assert.equal(ctx.getTransform().e,0,'transform restored');
   const ec=expected.getContext('2d');if(race==='goblin'){ec.translate(width,0);ec.scale(-1,1);}originalPortrait(expected,state,sprite,frame);
   assert.deepEqual(ctx.getImageData(0,0,width,height).data,ec.getImageData(0,0,width,height).data,race+'/'+weapon+'/'+id+' exact expected pixels');
   assert(drawLiveHeroPortrait(canvas,state,{manifest,images,time:i*500}));
   assert.deepEqual(ctx.getImageData(0,0,width,height).data,ec.getImageData(0,0,width,height).data,'repeated redraw must not accumulate a second reflection');
   assert.equal(JSON.stringify(state),stateBefore);assert.equal(JSON.stringify(manifest),manifestBefore);portraits++;
  }
  if(race!=='goblin')continue;
  for(const frame of sprite.frames){
   frames++;assert.equal(frame.facing??sprite.facing,'left','visually inspected original PNG direction');
   for(const targetX of [null,350,60])for(const reduced of [false,true]){
    const canvas=createCanvas(480,270),c=canvas.getContext('2d'),draw=c.drawImage.bind(c);let seen;
    c.drawImage=(img,...args)=>{if(img===images.get(frame.file))seen={args,m:c.getTransform()};return draw(img,...args);};
    const positions={hero:{x:200,y:203,sprite:key,scale:heroPresentationScale(sprite,race)}};
    if(targetX!==null)positions.enemy={x:targetX,y:203,sprite:'raider'};
    drawBattleSliceCanvas(canvas,{manifest:{...manifest,backgrounds:[],areaBackgrounds:undefined},images,encounter:{heroHp:100,enemies:targetX===null?[]:[{id:'enemy',hp:100,max:100}]},positions,actorFrames:{hero:frame.id},reduced});
    assert(seen);assert(Math.abs(seen.m.a-(targetX===60?1:-1)*positions.hero.scale)<1e-6,'existing camp/right/left battle orientation unchanged');
    assert(Math.abs(seen.m.d-positions.hero.scale)<1e-6);assert.equal(seen.m.e,200);assert.equal(seen.m.f,203);assert.deepEqual(seen.args,[-sprite.anchor[0],-sprite.anchor[1]]);assert.equal(c.getTransform().a,1);draws++;
   }
  }
 }
}
assert.equal(frames,22);
console.log(`PASS ${portraits} exact-pixel native portraits across all 5 races (HUD and equipment sizes), selection markup/CSS, ${frames} Goblin source frames / ${draws} camp and both-side battle draws; identity, aspect, anchors, state and transform isolation preserved.`);
