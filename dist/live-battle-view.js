import {extendBattleManifest} from './race-art.js';
import {getSkillMetadata} from './race-registry.js';
import {renderSkillPixelIcon} from './skill-pixel-icons.js';
// Read-only adapter for the real game. No model creation, stepping, timers, storage or RNG.
import {createBattleSlicePresentation,drawBattleSliceCanvas,presentationActorX,battleSliceBars,drawBattleSliceBars} from './battle-slice.js';
import {normalizeBattleEnemies,readEnemyEffectRows} from './multi-battle-ui.js';
import {validDisplayEvent} from './combat-display-queue.js';
import {stats,SKILL_TREE_DEFINITION,SKILLS} from './engine.js';
import {icon} from './icons.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const skillNames=Object.fromEntries(SKILL_TREE_DEFINITION.nodes.map(n=>[n.id,n.name]));
// Only approved identity mappings. Missing frames never become an unrelated substitute.
export const LIVE_HERO_SPRITES=Object.freeze({axe:'dwarf',hammer:'dwarf-hammer'});
export function liveHeroWeaponType(state){
 const item=state?.inventory?.find(it=>it.id===state?.equip?.weapon);
 return item?.slot==='weapon'?item.weaponType??null:null;
}
const heroSpriteFor=(weapon,manifest,race='dwarf')=>manifest?.raceHeroSprites?.[race]??({...LIVE_HERO_SPRITES,...(manifest?.heroWeaponSprites??manifest?.heroSprites??{})})[weapon]??(manifest?.sprites?.['hero-neutral']?'hero-neutral':null);
// These placeholders are intentionally not legacy art or substitute equipment.
function drawPixelNotice(canvas,label,{width=480,height=270}={}){if(!canvas?.getContext)return false;canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#132232';c.fillRect(0,0,width,height);c.strokeStyle='#516b80';c.lineWidth=2;c.strokeRect(6,6,width-12,height-12);c.fillStyle='#e7cb8d';c.font='12px sans-serif';c.textAlign='center';c.fillText(label,width/2,height/2,Math.max(24,width-20));return true;}
export function drawLiveHeroPortrait(canvas,state,{manifest,images,time=0}={}){
 const width=canvas?.width??160,height=canvas?.height??150;
 const key=heroSpriteFor(liveHeroWeaponType(state),manifest,state.race),sprite=manifest?.sprites?.[key];
 if(!sprite)return drawPixelNotice(canvas,manifest?'角色外观暂不可用':'角色外观加载中',{width,height});
 const ids=sprite.animations.idle,frame=sprite.frames.find(f=>f.id===ids[Math.floor(time/500)%ids.length]),img=images?.get(frame?.file);
 if(!img)return drawPixelNotice(canvas,'角色素材待加载 · 可重试',{width,height});
 const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,width,height);const box=frame.solidBBox??[0,0,192,192],w=box[2]-box[0]+1,h=box[3]-box[1]+1,scale=Math.max(.5,Math.min((width-12)/w,(height-10)/h));
 c.drawImage(img,Math.round((width-w*scale)/2-box[0]*scale),Math.round(height-5-(box[3]+1)*scale),Math.round(192*scale),Math.round(192*scale));return true;
}
export const LIVE_MONSTER_SPRITES=Object.freeze({'dwarf.a01.normal.1':'raider','dwarf.a01.normal.2':'pit-rat','dwarf.a01.normal.3':'golem','dwarf.a01.elite':'shield-captain'});
const identity=u=>u.monsterId??u.definitionId??null;
const areaOf=(s,e)=>e?.areaId??e?.instanceId??s?.siteId??'';
export const RACIAL_CAMPS=Object.freeze({dwarf:'黑炉营地',human:'边境营地',elf:'林间营地',goblin:'拾荒者营地',ashen:'余烬营地'});
export function liveCampRace(state){if(state?.atCamp!==true&&!(state?.restUntil>0))return null;const territory=String(state.siteId??'').split('.')[0];return Object.hasOwn(RACIAL_CAMPS,territory)?territory:Object.hasOwn(RACIAL_CAMPS,state.race)?state.race:'dwarf';}
export function liveSceneBackgrounds(snapshot,manifest){if(snapshot?.campRace){const row=manifest?.campBackgrounds?.[snapshot.campRace];return row?[row]:[];}return liveAreaBackgrounds(snapshot?.areaId,manifest);}
const areaKey=id=>String(id).match(/^(?:dwarf|human|elf|goblin|ashen)\.a(?:0[1-9]|10)(?=\.|$)/)?.[0]??null;
export function liveActorSprite(unit,manifest){
 const variant=[...(manifest?.actorVariants??[])].sort((a,b)=>(b.priority??0)-(a.priority??0)).find(row=>row.match&&Object.entries(row.match).every(([key,value])=>(key==='definitionId'?(unit.definitionId??unit.monsterId):unit[key])===value));
 if(variant)return variant.spriteKey;
 if(unit.follower===true)return null; // A child retaining its mother's ID must never silently use her sprite.
 return ({...LIVE_MONSTER_SPRITES,...(manifest?.monsterSprites??{})})[identity(unit)]??null;
}
export function liveAreaBackgrounds(areaId,manifest){const key=areaKey(areaId),ids=manifest?.areaBackgrounds?.[key];if(!key||!Array.isArray(ids)||!ids.length)return [];const selected=ids.map(id=>manifest.backgrounds?.find(bg=>bg.id===id));return selected.every(Boolean)?selected:[];}
export function renderLiveBattleHud(s,e){
 const tree=s?.skillTree,p=tree?.presets?.[tree.selectedPreset];if(tree?.mode!=='active')return `<div class="liveBattleSkills isLegacy" aria-label="旧战技四槽 · 只读">${Array.from({length:4},(_,i)=>{const id=s?.skills?.[i];return `<span class="liveBattleSkill" data-live-slot="legacy-${i}">${icon(id?'sword':'bag')}<span>${esc(SKILLS[id]?.name??'空槽')}</span></span>`;}).join('')}</div>`;if(!p)return '';
 return `<div class="liveBattleSkills" aria-label="当前装备技能 · 只读">${[...Array.from({length:4},(_,i)=>({id:p.active?.[i],i,passive:false})),...Array.from({length:2},(_,i)=>({id:p.passive?.[i],i,passive:true}))].map(({id,i,passive})=>{const cd=id?(e?.treeSkillCooldowns?.[id]??e?.cd?.[id]??0):0;return `<span class="liveBattleSkill ${passive?'isPassive':''}" title="${esc(getSkillMetadata(id)?.name??skillNames[id]??'空槽')}" data-live-skill="${esc(id??'')}" data-live-slot="${passive?'passive':'active'}-${i}">${renderSkillPixelIcon(id)}<span>${esc(getSkillMetadata(id)?.name??skillNames[id]??'空槽')}</span>${!passive&&cd>0?`<small>${Math.ceil(cd)}回</small>`:''}</span>`;}).join('')}</div>`;
}
// Death is authoritative even while the shared presentation retains timed attacks.
// Derive draw-only state: never remove real damage floats or mutate event queues.
export function liveLivingAnimations(encounter, animations){
 const dead=new Set([{id:'hero',hp:encounter.heroHp},...encounter.enemies].filter(u=>u.hp<=0).map(u=>u.id));
 const visible=new Map([...animations].filter(([id])=>!dead.has(id)));
 visible.skillEffects=(animations.skillEffects??[]).filter(effect=>!dead.has(effect.sourceId));
 return visible;
}
export function liveBattleBars(encounter,positions,animations,time,{heroMaxHp,manifest}){
 const bars=battleSliceBars(encounter,positions,animations,time,{heroMaxHp});
 for(let i=0;i<bars.length;i++){const b=bars[i],sprite=manifest.sprites[positions[b.id].sprite],frame=sprite.frames.find(f=>f.id===sprite.animations.idle[0]);b.y=positions[b.id].y-sprite.anchor[1]+(sprite.healthBarAnchor?.[1]??((frame.solidBBox?.[1]??frame.headY??sprite.anchor[1]-(positions[b.id].sprite==='pit-rat'?46:62))-9));
  while(bars.slice(0,i).some(r=>Math.abs(r.x-b.x)<36&&Math.abs(r.y-b.y)<6))b.y-=7;
 }return bars;
}
export function createLiveBattlePresentation({assetRoot='./battle-assets/',manifest:providedManifest=null,images:providedImages=null}={}){
 let manifest=providedManifest,images=providedImages??new Map(),loadPromise=null,loadError=null,loading=false,disposed=false,snapshot=null,battleId=null,paused=true,visible=true,displayTime=0,heroMaxHp=1;
 let positions={},metadata={},presentation=createBattleSlicePresentation(positions,metadata,{preserveAttack:true}),seen=new Set(),slots=new Map(),deathStarts=new Map();
 const reset=(dropHistory=true)=>{presentation.clear();if(dropHistory)seen.clear();deathStarts.clear();positions={};metadata={};slots=new Map();presentation=createBattleSlicePresentation(positions,metadata,{preserveAttack:true});};
 const coverage=()=>{
  const base={mode:'fallback',reason:null,label:'像素画面暂不可用',missingIds:[],coverage:[]};
  if(disposed)return {...base,reason:'disposed',label:'像素画面已释放'};
  if(!snapshot)return {...base,mode:'idle',reason:'no-encounter',label:'等待战斗'};
  if(!snapshot.campRace&&!areaKey(snapshot.areaId))return {...base,reason:'area-not-covered',label:'当前区域尚未接入像素背景'};

  if(loadError)return {...base,reason:'asset-load-failed',label:'像素素材加载失败 · 请重试',error:loadError};
  if(!manifest)return {...base,reason:'assets-not-loaded',label:'像素外观准备中'};
  const backgrounds=liveSceneBackgrounds(snapshot,manifest);if(!backgrounds.length)return {...base,reason:'area-not-covered',label:'当前区域尚未接入像素背景'};
  const rows=snapshot.encounter.enemies.map(u=>({unitId:u.id,monsterId:identity(u),follower:!!u.follower,sprite:liveActorSprite(u,manifest)}));
  const missing=rows.filter(r=>!r.sprite||!manifest.sprites?.[r.sprite]);
  if(missing.length)return {...base,reason:'monster-not-covered',label:'当前怪物尚未全部覆盖像素外观',missingIds:missing.map(r=>r.monsterId??r.unitId),coverage:rows};
  if(rows.length>6)return {...base,reason:'formation-not-covered',label:'当前编队尚未覆盖像素布局',coverage:rows};
  const heroSprite=heroSpriteFor(metadata.hero?.weaponType,manifest,metadata.hero?.race);if(!heroSprite||!manifest.sprites?.[heroSprite])return {...base,reason:'hero-weapon-not-covered',label:'当前角色外观暂不可用',coverage:rows,heroWeapon:metadata.hero?.weaponType??null};
  const sprites=[heroSprite,...new Set(rows.map(r=>r.sprite))];
  const files=[...backgrounds,...sprites.flatMap(key=>manifest.sprites?.[key]?.frames??[])];
  if(sprites.some(key=>!manifest.sprites?.[key]?.animations?.idle?.length)||files.some(f=>!images.get(f.file)))return {...base,reason:'asset-frames-missing',label:'像素帧尚未完整加载',coverage:rows};
  return {...base,mode:'ready',reason:null,label:snapshot.campRace?RACIAL_CAMPS[snapshot.campRace]:snapshot.idle?'野外待机':'实时像素战斗',campRace:snapshot.campRace,heroAppearance:heroSprite==='hero-neutral'?'neutral-idle':'equipped-weapon',heroAppearanceNote:heroSprite==='hero-neutral'?'中立待机外观 · 当前武器外观未覆盖':'',backgroundIds:backgrounds.map(bg=>bg.id),coverage:rows};
 };
 function rebuildPositions(){
  const units=snapshot.encounter.enemies;for(const u of units)if(!slots.has(u.id))slots.set(u.id,slots.size);
  const layout=units.length<=1?[350]:units.length===2?[305,405]:[275,350,425];
  const baseline=snapshot.campRace?(manifest?.campBackgrounds?.[snapshot.campRace]?.baseline??195):manifest?.areaBaselines?.[areaKey(snapshot.areaId)]??203;
  positions.hero={x:snapshot.campRace?144:100,y:baseline,sprite:heroSpriteFor(metadata.hero?.weaponType,manifest,metadata.hero?.race)};
  for(const u of units){const n=slots.get(u.id),row=Math.floor(n/3);positions[u.id]={x:positions[u.id]?.x??layout[n%3]??425,y:baseline-row*51,sprite:liveActorSprite(u,manifest)};}
  for(const id of Object.keys(positions))if(id!=='hero'&&!units.some(u=>u.id===id))delete positions[id];
 }
 async function load(){
  if(disposed)return false;if(manifest&&providedImages)return coverage().reason!=='asset-frames-missing';if(loadPromise)return loadPromise;
  if(typeof globalThis.fetch!=='function'||typeof globalThis.Image!=='function'){loadError='Image/fetch unavailable';return false;}
  loading=true;loadError=null;loadPromise=(async()=>{try{if(!manifest){const response=await fetch(assetRoot+'manifest.json');if(!response.ok)throw Error('Manifest HTTP '+response.status);manifest=extendBattleManifest(await response.json());}
   const files=[...new Set([...(manifest.backgrounds??[]),...Object.values(manifest.campBackgrounds??{}),...Object.values(manifest.sprites??{}).flatMap(s=>s.frames??[])].map(f=>f.file))];
   // Unrelated area failures cannot invalidate already usable current-area assets.
   await Promise.allSettled(files.map(async file=>{if(images.has(file))return;const img=new Image();img.src=assetRoot+file;await img.decode();if(!disposed)images.set(file,img);}));if(snapshot)rebuildPositions();return !disposed&&(!snapshot||coverage().mode==='ready');
  }catch(error){loadError=String(error?.message??error);return false;}finally{loading=false;loadPromise=null;}})();return loadPromise;
 }
 function sync(state,encounter,options={}){
  if(disposed)return coverage();if(typeof options==='number')options={now:options};
  const now=Number.isFinite(options.now??options.gameNow)?(options.now??options.gameNow):0,newVisible=options.visible??true,newPaused=!(options.running??state?.running)&&!encounter?.done||Number.isFinite(encounter?.pauseAt),changed=(encounter?.id??null)!==battleId||snapshot?.areaId!==areaOf(state,encounter);
  if(changed||newPaused!==paused||newVisible!==visible){reset(changed);}
  battleId=encounter?.id??null;paused=newPaused;visible=newVisible;displayTime=Number.isFinite(options.presentationTime)?options.presentationTime:displayTime;
  if(!state){snapshot=null;return coverage();}
  heroMaxHp=stats(structuredClone(state)).hp;
  const campRace=liveCampRace(state);
  const idle=!!campRace||!encounter||!Array.isArray(encounter.enemies);
  const displayEncounter=idle?{heroHp:state.heroHp??heroMaxHp,enemies:[],areaId:areaOf(state,null),targetId:null}:encounter;
  // Detached snapshots guarantee later game mutations cannot race a presentation frame.
  snapshot={idle,campRace,encounter:{...structuredClone(displayEncounter),heroHp:idle||encounter.done?state.heroHp??heroMaxHp:displayEncounter.heroHp},areaId:areaOf(state,displayEncounter),units:idle?[]:normalizeBattleEnemies(encounter,now),gameNow:now};
  heroMaxHp=stats(structuredClone(state)).hp;Object.assign(metadata,{hero:{weaponType:liveHeroWeaponType(state),race:state.race}});rebuildPositions();return coverage();
 }
 function enqueue(events,at){
  if(disposed||!snapshot||!visible||coverage().mode!=='ready')return {accepted:0,reason:'not-presenting'};
  if(!Array.isArray(events)||!Number.isFinite(at)||!events.every(e=>validDisplayEvent(e)))return {accepted:0,reason:'invalid-events'};
  const accepted=[];for(const event of events){if(event.battleId!==battleId||seen.has(event.eventId)||!positions[event.targetId])continue;seen.add(event.eventId);if(paused&&event.kind!=='heal')continue;if(!positions[event.sourceId]&&!['heal','shield'].includes(event.kind))continue;accepted.push(event);if(event.hpDelta<0&&(event.targetId==='hero'?snapshot.encounter.heroHp:snapshot.encounter.enemies.find(u=>u.id===event.targetId)?.hp)<=0&&!deathStarts.has(event.targetId))deathStarts.set(event.targetId,at+240+(event.displayDelayMs??event.segmentIndex*70));}
  presentation.enqueue(accepted,at);return {accepted:accepted.length,reason:null};
 }
 function draw(canvas,time=displayTime){
  if(typeof time==='object')time=time.time??displayTime;
  if(disposed||!visible)return false;
  const heroUnavailable=coverage().reason==='hero-weapon-not-covered';
  if(!snapshot||coverage().mode!=='ready'&&!heroUnavailable){drawPixelNotice(canvas,coverage().label);if(snapshot&&manifest){const bgs=liveSceneBackgrounds(snapshot,manifest);if(bgs.length&&bgs.every(bg=>images.has(bg.file))){const c=canvas.getContext('2d');for(const bg of bgs)c.drawImage(images.get(bg.file),0,0);c.fillStyle='#102030ee';c.fillRect(50,112,380,46);c.fillStyle='#e7cb8d';c.font='12px sans-serif';c.textAlign='center';c.fillText(coverage().label,240,139,350);}}return true;}
  try{if(canvas.width!==480)canvas.width=480;if(canvas.height!==270)canvas.height=270;
   displayTime=Number.isFinite(time)?time:displayTime;presentation.advance(displayTime);const animations=liveLivingAnimations(snapshot.encounter,presentation.animations);if(positions.hero?.sprite==='hero-neutral'){animations.delete('hero');animations.skillEffects=(animations.skillEffects??[]).filter(effect=>effect.sourceId!=='hero');}
   const drawPositions=heroUnavailable?Object.fromEntries(Object.entries(positions).filter(([id])=>id!=='hero')):positions;
   const actorFrames={};for(const u of [{id:'hero',hp:snapshot.encounter.heroHp},...snapshot.encounter.enemies]){if(u.hp>0||!drawPositions[u.id])continue;const sprite=manifest.sprites[positions[u.id].sprite],frames=sprite.animations.death;if(frames?.length){const start=deathStarts.get(u.id);actorFrames[u.id]=start===undefined?frames.at(-1):displayTime<start?sprite.animations.idle[0]:frames[Math.min(frames.length-1,Math.floor((displayTime-start)/110))];}}
   drawBattleSliceCanvas(canvas,{manifest:{...manifest,areaBackgrounds:undefined,backgrounds:liveSceneBackgrounds(snapshot,manifest)},images,actorFrames,encounter:{...snapshot.encounter,enemies:snapshot.encounter.enemies.map(u=>({...u,max:0}))},positions:drawPositions,animations,time:displayTime,floats:presentation.floats,heroMaxHp:0});
   const c=canvas.getContext('2d');const bars=liveBattleBars(snapshot.encounter,drawPositions,animations,displayTime,{heroMaxHp,manifest});drawBattleSliceBars(c,bars);if(heroUnavailable||positions.hero?.sprite==='hero-neutral'&&(metadata.hero?.weaponType||snapshot.encounter.heroHp<=0)){c.fillStyle='#142334ee';c.fillRect(20,210,160,26);c.fillStyle='#e7cb8d';c.font='12px sans-serif';c.textAlign='center';c.fillText(heroUnavailable?'角色外观暂不可用':snapshot.encounter.heroHp<=0?'已倒下 · 中立外观':'中立待机 · 未覆盖武器外观',100,227);}const target=snapshot.encounter.targetId;
   for(const u of snapshot.units){const p=positions[u.id];if(!p||u.hp<=0)continue;const x=presentationActorX(p,animations.get(u.id),displayTime);if(u.id===target){c.fillStyle='#e4c587';c.fillRect(Math.round(x-14),p.y+5,28,2);c.fillRect(Math.round(x-17),p.y+2,3,5);c.fillRect(Math.round(x+14),p.y+2,3,5);const top=(bars.find(b=>b.id===u.id)?.y??p.y-70)-4;c.fillRect(Math.round(x-35),top,8,2);c.fillRect(Math.round(x-35),top,2,8);c.fillRect(Math.round(x+27),top,8,2);c.fillRect(Math.round(x+33),top,2,8);}
    const effects=readEnemyEffectRows(snapshot.encounter,u.id),baseY=(bars.find(b=>b.id===u.id)?.y??p.y-80)-9;
    effects.slice(0,4).forEach((effect,i)=>{c.fillStyle=effect.key==='poison'?'#b7dc70':effect.key==='burn'?'#e69b57':'#b9c8d0';c.fillRect(Math.round(x-12+i*7),baseY,5,5);c.fillStyle='#25333a';c.fillRect(Math.round(x-11+i*7),baseY+2,3,1);if(effect.layers){c.font='bold 7px monospace';c.fillStyle='#e7f5b2';c.fillText(String(effect.layers),Math.round(x-12+i*7),baseY-1);}});
    if(u.preparing){c.fillStyle='#202b33';c.fillRect(Math.round(x-17),baseY-7,34,3);c.fillStyle=u.preparing.paused?'#83969e':'#e9bd71';c.fillRect(Math.round(x-17),baseY-7,Math.round(34*u.preparing.progress),3);}
   }return true;
  }catch(error){loadError='Draw: '+String(error?.message??error);presentation.clear();return drawPixelNotice(canvas,'像素绘制失败 · 请重试');}
 }
 function targetAt(event,canvas){
  if(disposed||!visible||!snapshot||coverage().mode!=='ready')return null;
  const bounds=canvas?.getBoundingClientRect?.()??canvas;if(!bounds?.width||!bounds?.height)return null;
  const x=(event.clientX-bounds.left)*480/bounds.width,y=(event.clientY-bounds.top)*270/bounds.height;
  let closest=null,distance=Infinity;for(const u of snapshot.encounter.enemies){if(u.hp<=0)continue;const p=positions[u.id],xx=presentationActorX(p,presentation.animations.get(u.id),displayTime);if(Math.abs(x-xx)<=37&&y>=p.y-83&&y<=p.y+10&&Math.abs(x-xx)<distance){closest=u.id;distance=Math.abs(x-xx);}}return closest;
 }
 function detailHtml(){if(!snapshot)return '';return snapshot.units.filter(u=>u.hp>0).map(u=>`<button class="liveBattleDetail" data-monster-detail="${esc(u.definitionId??identity(snapshot.encounter.enemies.find(e=>e.id===u.id)))}" data-unit-detail="${esc(u.id)}" aria-label="查看${esc(u.name)}状态">${esc(u.name)}${u.preparing?` · ${esc(u.preparing.name)} · ${Math.max(0,((snapshot.encounter.enemies.find(e=>e.id===u.id)?.control?.preparing?.duration??0)*(1-u.preparing.progress))/1000).toFixed(1)}秒${u.preparing.paused?'（暂停）':''}`:''}${readEnemyEffectRows(snapshot.encounter,u.id).map(r=>' · '+esc(r.label)+(r.layers?' ×'+r.layers:'')).join('')} ⓘ</button><button class="liveBattleDetail" data-enemy-effects="${esc(u.id)}" aria-label="查看${esc(u.name)}状态来源与剩余">状态详情</button>`).join('');}
 return Object.freeze({load,sync,enqueue,draw,targetAt,drawPortrait(canvas,state,options={}){return drawLiveHeroPortrait(canvas,state,{manifest,images,...options});},get status(){return coverage();},get positions(){return structuredClone(positions);},get detailsHtml(){return detailHtml();},get debug(){return {battleId,paused,visible,floats:presentation.floats.length,deferredHurts:presentation.deferredHurtCount,effects:presentation.effects.length,seen:seen.size,deathActors:[...deathStarts.keys()]};},dispose(){disposed=true;reset();snapshot=null;images=new Map();}});
}
