// Read-only adapter for the real game. No model creation, stepping, timers, storage or RNG.
import {createBattleSlicePresentation,drawBattleSliceCanvas,presentationActorX,battleSliceBars,drawBattleSliceBars} from './battle-slice.js';
import {normalizeBattleEnemies,readEnemyEffectRows,renderPlayerShieldSummary} from './multi-battle-ui.js';
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
export const LIVE_MONSTER_SPRITES=Object.freeze({'dwarf.a01.normal.1':'raider','dwarf.a01.normal.2':'pit-rat','dwarf.a01.normal.3':'golem','dwarf.a01.elite':'shield-captain'});
const identity=u=>u.monsterId??u.definitionId??null;
const areaOf=(s,e)=>e?.areaId??e?.instanceId??s?.siteId??'';
const areaKey=id=>String(id).match(/^dwarf\.a0[123456](?=\.|$)/)?.[0]??null;
export function liveActorSprite(unit,manifest){
 const variant=[...(manifest?.actorVariants??[])].sort((a,b)=>(b.priority??0)-(a.priority??0)).find(row=>row.match&&Object.entries(row.match).every(([key,value])=>(key==='definitionId'?(unit.definitionId??unit.monsterId):unit[key])===value));
 if(variant)return variant.spriteKey;
 if(unit.follower===true)return null; // A child retaining its mother's ID must never silently use her sprite.
 return ({...LIVE_MONSTER_SPRITES,...(manifest?.monsterSprites??{})})[identity(unit)]??null;
}
export function liveAreaBackgrounds(areaId,manifest){const key=areaKey(areaId),ids=manifest?.areaBackgrounds?.[key];if(!key||!Array.isArray(ids)||!ids.length)return [];const selected=ids.map(id=>manifest.backgrounds?.find(bg=>bg.id===id));return selected.every(Boolean)?selected:[];}
export function renderLiveBattleHud(s,e){
 const tree=s?.skillTree,p=tree?.presets?.[tree.selectedPreset];if(tree?.mode!=='active')return `<div class="liveBattleSkills isLegacy" aria-label="旧战技四槽 · 只读">${Array.from({length:4},(_,i)=>{const id=s?.skills?.[i];return `<span class="liveBattleSkill" data-live-slot="legacy-${i}">${icon(id?'sword':'bag')}<span>${esc(SKILLS[id]?.name??'空槽')}</span></span>`;}).join('')}</div>`;if(!p)return '';
 return `<div class="liveBattleSkills" aria-label="当前装备技能 · 只读">${[...Array.from({length:4},(_,i)=>({id:p.active?.[i],i,passive:false})),...Array.from({length:2},(_,i)=>({id:p.passive?.[i],i,passive:true}))].map(({id,i,passive})=>{const cd=id?(e?.treeSkillCooldowns?.[id]??e?.cd?.[id]??0):0;return `<span class="liveBattleSkill ${passive?'isPassive':''}" title="${esc(skillNames[id]??'空槽')}" data-live-skill="${esc(id??'')}" data-live-slot="${passive?'passive':'active'}-${i}">${icon(!id?'bag':passive?'shield':id.includes('ember')?'fire':id.includes('vigil')?'shield':id.includes('breath')?'herb':'sword')}<span>${esc(skillNames[id]??'空槽')}</span>${!passive&&cd>0?`<small>${Math.ceil(cd)}回</small>`:''}</span>`;}).join('')}</div>`;
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
  const base={mode:'fallback',reason:null,label:'使用原战斗画面',missingIds:[],coverage:[]};
  if(disposed)return {...base,reason:'disposed',label:'像素画面已释放'};
  if(!snapshot)return {...base,mode:'idle',reason:'no-encounter',label:'等待战斗'};
  if(!areaKey(snapshot.areaId))return {...base,reason:'area-not-covered',label:'当前区域尚未接入像素背景'};
  if(loading)return {...base,mode:'loading',reason:'assets-loading',label:'像素外观准备中'};
  if(loadError)return {...base,reason:'asset-load-failed',label:'像素素材加载失败，使用原画面',error:loadError};
  if(!manifest)return {...base,reason:'assets-not-loaded',label:'像素外观准备中'};
  const backgrounds=liveAreaBackgrounds(snapshot.areaId,manifest);if(!backgrounds.length)return {...base,reason:'area-not-covered',label:'当前区域尚未接入像素背景'};
  const rows=snapshot.encounter.enemies.map(u=>({unitId:u.id,monsterId:identity(u),follower:!!u.follower,sprite:liveActorSprite(u,manifest)}));
  const missing=rows.filter(r=>!r.sprite||!manifest.sprites?.[r.sprite]);
  if(missing.length)return {...base,reason:'monster-not-covered',label:'当前怪物尚未全部覆盖像素外观',missingIds:missing.map(r=>r.monsterId??r.unitId),coverage:rows};
  if(rows.length>6)return {...base,reason:'formation-not-covered',label:'当前编队尚未覆盖像素布局',coverage:rows};
  const heroSprite=({...LIVE_HERO_SPRITES,...(manifest.heroWeaponSprites??manifest.heroSprites??{})})[metadata.hero?.weaponType];if(!heroSprite||!manifest.sprites?.[heroSprite])return {...base,reason:'hero-weapon-not-covered',label:'当前武器尚未覆盖像素外观，使用原画面',coverage:rows,heroWeapon:metadata.hero?.weaponType??null};
  const sprites=[heroSprite,...new Set(rows.map(r=>r.sprite))];
  const files=[...backgrounds,...sprites.flatMap(key=>manifest.sprites?.[key]?.frames??[])];
  if(sprites.some(key=>!manifest.sprites?.[key]?.animations?.idle?.length)||files.some(f=>!images.get(f.file)))return {...base,reason:'asset-frames-missing',label:'像素帧尚未完整加载',coverage:rows};
  return {...base,mode:'ready',reason:null,label:'实时像素战斗',backgroundIds:backgrounds.map(bg=>bg.id),coverage:rows};
 };
 function rebuildPositions(){
  const units=snapshot.encounter.enemies;for(const u of units)if(!slots.has(u.id))slots.set(u.id,slots.size);
  const layout=units.length<=1?[350]:units.length===2?[305,405]:[275,350,425];
  const baseline=manifest?.areaBaselines?.[areaKey(snapshot.areaId)]??203;
  positions.hero={x:100,y:baseline,sprite:({...LIVE_HERO_SPRITES,...(manifest?.heroWeaponSprites??manifest?.heroSprites??{})})[metadata.hero?.weaponType]??null};
  for(const u of units){const n=slots.get(u.id),row=Math.floor(n/3);positions[u.id]={x:positions[u.id]?.x??layout[n%3]??425,y:baseline-row*51,sprite:liveActorSprite(u,manifest)};}
  for(const id of Object.keys(positions))if(id!=='hero'&&!units.some(u=>u.id===id))delete positions[id];
 }
 async function load(){
  if(disposed)return false;if(manifest&&providedImages)return coverage().reason!=='asset-frames-missing';if(loadPromise)return loadPromise;
  if(typeof globalThis.fetch!=='function'||typeof globalThis.Image!=='function'){loadError='Image/fetch unavailable';return false;}
  loading=true;loadPromise=(async()=>{try{if(!manifest){const response=await fetch(assetRoot+'manifest.json');if(!response.ok)throw Error('Manifest HTTP '+response.status);manifest=await response.json();}
   const files=[...new Set([...(manifest.backgrounds??[]),...Object.values(manifest.sprites??{}).flatMap(s=>s.frames??[])].map(f=>f.file))];
   await Promise.all(files.map(async file=>{if(images.has(file))return;const img=new Image();img.src=assetRoot+file;await img.decode();if(!disposed)images.set(file,img);}));if(snapshot)rebuildPositions();return !disposed;
  }catch(error){loadError=String(error?.message??error);return false;}finally{loading=false;}})();return loadPromise;
 }
 function sync(state,encounter,options={}){
  if(disposed)return coverage();if(typeof options==='number')options={now:options};
  const now=Number.isFinite(options.now??options.gameNow)?(options.now??options.gameNow):0,newVisible=options.visible??true,newPaused=!(options.running??state?.running)&&!encounter?.done||Number.isFinite(encounter?.pauseAt),changed=encounter?.id!==battleId;
  if(changed||newPaused!==paused||newVisible!==visible){reset(changed);}
  battleId=encounter?.id??null;paused=newPaused;visible=newVisible;displayTime=Number.isFinite(options.presentationTime)?options.presentationTime:displayTime;
  if(!encounter||!Array.isArray(encounter.enemies)){snapshot=null;return coverage();}
  // Detached snapshots guarantee later game mutations cannot race a presentation frame.
  snapshot={encounter:structuredClone(encounter),areaId:areaOf(state,encounter),units:normalizeBattleEnemies(encounter,now),gameNow:now};
  heroMaxHp=stats(structuredClone(state)).hp;Object.assign(metadata,{hero:{weaponType:liveHeroWeaponType(state)}});rebuildPositions();return coverage();
 }
 function enqueue(events,at){
  if(disposed||!snapshot||!visible||coverage().mode!=='ready')return {accepted:0,reason:'not-presenting'};
  if(!Array.isArray(events)||!Number.isFinite(at)||!events.every(e=>validDisplayEvent(e)))return {accepted:0,reason:'invalid-events'};
  const accepted=[];for(const event of events){if(event.battleId!==battleId||seen.has(event.eventId)||!positions[event.targetId])continue;seen.add(event.eventId);if(paused&&event.kind!=='heal')continue;if(!positions[event.sourceId]&&!['heal','shield'].includes(event.kind))continue;accepted.push(event);if(event.hpDelta<0&&(event.targetId==='hero'?snapshot.encounter.heroHp:snapshot.encounter.enemies.find(u=>u.id===event.targetId)?.hp)<=0&&!deathStarts.has(event.targetId))deathStarts.set(event.targetId,at+240+(event.displayDelayMs??event.segmentIndex*70));}
  presentation.enqueue(accepted,at);return {accepted:accepted.length,reason:null};
 }
 function draw(canvas,time=displayTime){
  if(typeof time==='object')time=time.time??displayTime;
  if(disposed||!visible||!snapshot||coverage().mode!=='ready')return false;
  try{if(canvas.width!==480)canvas.width=480;if(canvas.height!==270)canvas.height=270;
   displayTime=Number.isFinite(time)?time:displayTime;presentation.advance(displayTime);const animations=liveLivingAnimations(snapshot.encounter,presentation.animations);
   const actorFrames={};for(const u of [{id:'hero',hp:snapshot.encounter.heroHp},...snapshot.encounter.enemies]){if(u.hp>0)continue;const sprite=manifest.sprites[positions[u.id].sprite],frames=sprite.animations.death;if(frames?.length){const start=deathStarts.get(u.id);actorFrames[u.id]=start===undefined?frames.at(-1):displayTime<start?sprite.animations.idle[0]:frames[Math.min(frames.length-1,Math.floor((displayTime-start)/110))];}}
   drawBattleSliceCanvas(canvas,{manifest:{...manifest,backgrounds:liveAreaBackgrounds(snapshot.areaId,manifest)},images,actorFrames,encounter:{...snapshot.encounter,enemies:snapshot.encounter.enemies.map(u=>({...u,max:0}))},positions,animations,time:displayTime,floats:presentation.floats,heroMaxHp:0});
   const c=canvas.getContext('2d');const bars=liveBattleBars(snapshot.encounter,positions,animations,displayTime,{heroMaxHp,manifest});drawBattleSliceBars(c,bars);const target=snapshot.encounter.targetId;
   for(const u of snapshot.units){const p=positions[u.id];if(!p||u.hp<=0)continue;const x=presentationActorX(p,animations.get(u.id),displayTime);if(u.id===target){c.fillStyle='#e4c587';c.fillRect(Math.round(x-14),p.y+5,28,2);c.fillRect(Math.round(x-17),p.y+2,3,5);c.fillRect(Math.round(x+14),p.y+2,3,5);const top=(bars.find(b=>b.id===u.id)?.y??p.y-70)-4;c.fillRect(Math.round(x-35),top,8,2);c.fillRect(Math.round(x-35),top,2,8);c.fillRect(Math.round(x+27),top,8,2);c.fillRect(Math.round(x+33),top,2,8);}
    const effects=readEnemyEffectRows(snapshot.encounter,u.id),baseY=(bars.find(b=>b.id===u.id)?.y??p.y-80)-9;
    effects.slice(0,4).forEach((effect,i)=>{c.fillStyle=effect.key==='poison'?'#b7dc70':effect.key==='burn'?'#e69b57':'#b9c8d0';c.fillRect(Math.round(x-12+i*7),baseY,5,5);c.fillStyle='#25333a';c.fillRect(Math.round(x-11+i*7),baseY+2,3,1);if(effect.layers){c.font='bold 7px monospace';c.fillStyle='#e7f5b2';c.fillText(String(effect.layers),Math.round(x-12+i*7),baseY-1);}});
    if(u.preparing){c.fillStyle='#202b33';c.fillRect(Math.round(x-17),baseY-7,34,3);c.fillStyle=u.preparing.paused?'#83969e':'#e9bd71';c.fillRect(Math.round(x-17),baseY-7,Math.round(34*u.preparing.progress),3);}
   }return true;
  }catch(error){loadError='Draw: '+String(error?.message??error);presentation.clear();return false;}
 }
 function targetAt(event,canvas){
  if(disposed||!visible||!snapshot||coverage().mode!=='ready')return null;
  const bounds=canvas?.getBoundingClientRect?.()??canvas;if(!bounds?.width||!bounds?.height)return null;
  const x=(event.clientX-bounds.left)*480/bounds.width,y=(event.clientY-bounds.top)*270/bounds.height;
  let closest=null,distance=Infinity;for(const u of snapshot.encounter.enemies){if(u.hp<=0)continue;const p=positions[u.id],xx=presentationActorX(p,presentation.animations.get(u.id),displayTime);if(Math.abs(x-xx)<=37&&y>=p.y-83&&y<=p.y+10&&Math.abs(x-xx)<distance){closest=u.id;distance=Math.abs(x-xx);}}return closest;
 }
 function detailHtml(){if(!snapshot)return '';return renderPlayerShieldSummary(snapshot.encounter)+snapshot.units.filter(u=>u.hp>0).map(u=>`<button class="liveBattleDetail" data-monster-detail="${esc(u.definitionId??identity(snapshot.encounter.enemies.find(e=>e.id===u.id)))}" data-unit-detail="${esc(u.id)}" aria-label="查看${esc(u.name)}状态">${esc(u.name)}${u.preparing?` · ${esc(u.preparing.name)} · ${Math.max(0,((snapshot.encounter.enemies.find(e=>e.id===u.id)?.control?.preparing?.duration??0)*(1-u.preparing.progress))/1000).toFixed(1)}秒${u.preparing.paused?'（暂停）':''}`:''}${readEnemyEffectRows(snapshot.encounter,u.id).map(r=>' · '+esc(r.label)+(r.layers?' ×'+r.layers:'')).join('')} ⓘ</button><button class="liveBattleDetail" data-enemy-effects="${esc(u.id)}" aria-label="查看${esc(u.name)}状态来源与剩余">状态详情</button>`).join('');}
 return Object.freeze({load,sync,enqueue,draw,targetAt,get status(){return coverage();},get positions(){return structuredClone(positions);},get detailsHtml(){return detailHtml();},get debug(){return {battleId,paused,visible,floats:presentation.floats.length,deferredHurts:presentation.deferredHurtCount,effects:presentation.effects.length,seen:seen.size,deathActors:[...deathStarts.keys()]};},dispose(){disposed=true;reset();snapshot=null;images=new Map();}});
}
