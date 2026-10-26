import {heroPresentationScale,heroPortraitFlipX,HERO_BODY_REFERENCE_BOUNDS} from './hero-proportions.js';
import {getRacePack,PLAYABLE_RACES} from './race-registry.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Use the live weapon-idle assets, including the current slim Elf; no alternate portraits.
export function heroPortrait(race){
 const pack=getRacePack(race);
 if(race==='dwarf')return 'battle-assets/sprites/dwarf-idle-0.png';
 const sprites=pack?.art?.heroWeapons??pack?.art?.hero;
 const row=sprites?.[pack.weapons[0]],idle=row?.animations?.idle?.[0];
 return row?.frames.find((frame,i)=>frame.id===idle||i===idle)?.file??row?.frames[0]?.file;
}
export function heroPortraitScale(race){
 if(race==='dwarf')return 1;
 const p=getRacePack(race),weapon=p.weapons[0],row=(p.art.heroWeapons??p.art.hero)[weapon];
 const idle=row.animations.idle.map(id=>typeof id==='number'?row.frames[id].id:id);
 return heroPresentationScale({...row,animations:{...row.animations,idle},bodyReferenceBounds:HERO_BODY_REFERENCE_BOUNDS[race]?.[weapon]},race);
}
export function heroPortraitScaleX(race){
 const pack=getRacePack(race),row=(pack?.art?.heroWeapons??pack?.art?.hero)?.[pack?.weapons[0]],idle=row?.animations?.idle?.[0];
 const frame=row?.frames.find((frame,i)=>frame.id===idle||i===idle);
 return heroPortraitFlipX(row,frame)?-1:1;
}
export const heroRaceLabel=race=>race==='goblin'?'哥布林':getRacePack(race)?.name;
export function renderHeroChoices(){return '<section class="heroSelection" aria-labelledby="heroSelectionTitle"><h2 id="heroSelectionTitle">选择你的旅人</h2><p>一个存档固定一位主角。选择人物，开启他的旅程。</p><div class="raceHeroChoices">'+PLAYABLE_RACES.map(id=>{const p=getRacePack(id);return `<button type="button" class="raceHeroChoice" data-new-hero-race="${id}" aria-label="选择${escape(p.heroName)}，${escape(heroRaceLabel(id))}，${escape(p.heroTitle)}"><span class="raceHeroPortrait" style="--hero-scale:${heroPortraitScale(id)};--hero-facing:${heroPortraitScaleX(id)}"><img src="${escape(heroPortrait(id))}" width="192" height="192" alt="${escape(p.heroName)}的持武器像素形象" draggable="false"></span><strong>${escape(p.heroName)}</strong><span class="raceHeroIdentity">${escape(heroRaceLabel(id))} · ${escape(p.heroTitle)}</span><span class="raceHeroDescription">${escape(p.heroDescription)}</span><span class="raceHeroAction" aria-hidden="true">选择这位旅人 →</span></button>`}).join('')+'</div></section>';}
