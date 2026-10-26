import {HERO_PORTRAIT_ASSETS} from './hero-portraits/manifest.js';
// Presentation identities only. Do not serialize this catalogue into story state.
// Canon scene/speaker labels, flags, choices and rewards stay in their existing registry.
import {STORY_SCENES} from './story-event-registry.js';
import {heroPortrait,heroPortraitScaleX} from './hero-selection.js';
import {getRacePack} from './race-registry.js';
import {HERO_BODY_REFERENCE_BOUNDS} from './hero-proportions.js';
import {DWARF_STORY_PORTRAIT_FRAME} from './story-portrait-crops.js';
const freeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
const portrait=(id,name,role,race,file,extra={})=>({id,name,role,race,file,width:96,height:96,...extra});
export const STORY_CAST_CHARACTERS=freeze({
 'high-priest':portrait('high-priest','大祭司','精灵大祭司','elf','story-assets/high-priest.png',{existingFullActor:true,portraitCrop:{x:63.5,y:19,size:65}}),
 'dwarf-minister':portrait('dwarf-minister','维尔铎','矮人重臣','dwarf','story-portraits/dwarf-minister.png',{evidenceOnly:true}),
 'current-dwarf-king':portrait('current-dwarf-king','索兰姆','现任矮人王','dwarf',null,{designOnly:true}),
 'ashen-chief':portrait('ashen-chief','玄珀','烬裔族长','ashen','story-portraits/ashen-chief.png'),
 'carter':portrait('carter','鲁托','商队幸存车夫','human','story-portraits/carter.png'),
 'mine-foreman':portrait('mine-foreman','杜铎','矿班长','dwarf','story-portraits/mine-foreman.png'),
 'elf-medic':portrait('elf-medic','伊瑟','精灵救护者','elf','story-portraits/elf-medic.png'),
 'forest-keeper':portrait('forest-keeper','赛林','林径巡护员 · 守林者','elf','npc-portraits/npc.elf.sailin.png',{regionalNpcId:'npc.elf.sailin'}),
 'ashen-repairer':portrait('ashen-repairer','陶褶','陶石棚修护者','ashen','npc-portraits/npc.ashen.taozhe.png',{regionalNpcId:'npc.ashen.taozhe'}),
 'border-scout':portrait('border-scout','贝菈','高地巡守 · 边境斥候','human','npc-portraits/npc.human.beila.png',{regionalNpcId:'npc.human.beila'}),
 'royal-guard':portrait('royal-guard','科霖','轮值盾卫 · 王室守军','dwarf','npc-portraits/npc.dwarf.kelin.png',{regionalNpcId:'npc.dwarf.kelin'}),
 'ashen-sentry':portrait('ashen-sentry','璞承','石道护行者 · 哨卫','ashen','npc-portraits/npc.ashen.pucheng.png',{regionalNpcId:'npc.ashen.pucheng'})
});
const HEROES=freeze(Object.fromEntries(['human','dwarf','elf','goblin','ashen'].map(race=>{const pack=getRacePack(race);return [race,{name:pack.heroName,role:pack.heroTitle}];})));
export function storyHeroDescriptor(race){
 const h=HEROES[race];if(!h)return null;
 if(race==='dwarf')return portrait('hero.dwarf',h.name,h.role,race,HERO_PORTRAIT_ASSETS.characters['dwarf.brock'].assets['96'].file,{nativeBodyFrame:DWARF_STORY_PORTRAIT_FRAME.file});
 const pack=getRacePack(race),weapon=pack.weapons[0],sprite=(pack.art?.heroWeapons??pack.art?.hero)?.[weapon],idle=sprite?.animations?.idle?.[0],frame=sprite?.frames?.find((f,i)=>f.id===idle||i===idle);
 const box=race==='dwarf'?DWARF_STORY_PORTRAIT_FRAME.bodyBounds:frame.solidBBox??frame.alphaBBox;
 const body=HERO_BODY_REFERENCE_BOUNDS[race]?.[weapon]??[box[1],box[3]],size=Math.round(Math.max(42,Math.min(96,(body[1]-body[0]+1)*.7))),center=race==='dwarf'?DWARF_STORY_PORTRAIT_FRAME.centerX:sprite.anchor[0];
 const authored=race==='dwarf'?DWARF_STORY_PORTRAIT_FRAME.portraitCrop:null;
 const edge=authored?Math.max(authored[2]-authored[0],authored[3]-authored[1]):size;
 const crop=authored?{x:(authored[0]+authored[2]-edge)/2,y:(authored[1]+authored[3]-edge)/2,size:edge}:{x:center-size/2,y:body[0]-2,size};
 return portrait('hero.'+race,h.name,h.role,race,heroPortrait(race),{existingFullActor:true,facing:heroPortraitScaleX(race),portraitCrop:crop});
}
// Exact source scene + POV, never a global “all guards/couriers are this person” alias.
const bindings=[];
const bind=(sourceScene,povs,aliases,id)=>{for(const pov of povs.split(' '))bindings.push({sourceScene,pov,aliases:aliases.split('|'),id});};
for(const source of ['C03.E01','C05.E03','C07.E01','C07.EA02','C07.EA03','C08.X03','C08.X04'])bind(source,'human dwarf elf goblin ashen','大祭司','high-priest');
for(const source of ['C01.D01','C02.O01','C06.D01','C07.O01'])bind(source,'dwarf','矿班长','mine-foreman');
for(const source of ['C01.E01','C02.E01','C02.E02','C02.E03','C02.E00B'])bind(source,'elf','守林者','forest-keeper');
for(const source of ['C01.A01','C02.O01','C07.X01'])bind(source,'ashen','修护者','ashen-repairer');
for(const source of ['C01.H01','C02.O01','C07.O01'])bind(source,'human','斥候|边境斥候','border-scout');
bind('C03.G01','goblin','车夫','carter');bind('C03.X01','human dwarf elf','车夫','carter');bind('C04.G01','human dwarf goblin','车夫','carter');
for(const source of ['C05.O01','C07.O01'])bind(source,'human','车夫','carter');
for(const source of ['C06.A01','C07.A01','C07.EA02'])bind(source,'ashen elf','族长','ashen-chief');
bind('C06.E01','elf','救护者','elf-medic');bind('C08.O01','ashen','救护者','elf-medic');
// This exact event names its NPC “幸存救护者”; C07.O01's unrelated merchant courier stays unnamed.
bind('C07.O02','dwarf human goblin','信使|幸存救护者','elf-medic');
bind('C06.D01','dwarf','王室守军','royal-guard');
for(const source of ['C07.A01','C07.X01'])bind(source,'ashen','哨卫','ashen-sentry');
export const STORY_CAST_BINDINGS=freeze(bindings);
function registeredScene(scene){const d=STORY_SCENES[scene?.id];return d&&d.sourceScene===scene.sourceScene&&d.pov===scene.pov?d:null;}
export function storyCastAlias(scene,alias){
 const d=registeredScene(scene);if(!d)return null;
 const binding=STORY_CAST_BINDINGS.find(x=>x.sourceScene===d.sourceScene&&x.pov===d.pov&&x.aliases.includes(alias));
 return binding?STORY_CAST_CHARACTERS[binding.id]:null;
}
export function storyCastSpeaker(scene,line){
 const d=registeredScene(scene);if(!d||typeof line!=='string'||!d.lines.includes(line))return null;
 const match=line.match(/^([^：\[\]]+)：/);if(!match)return null;
 const alias=match[1];for(const [race,h]of Object.entries(HEROES))if(alias===h.name)return storyHeroDescriptor(race);
 if(alias==='主角'&&d.sourceScene==='C06.RR01')return storyHeroDescriptor(d.pov);
 if(alias==='砾恩在外'&&d.sourceScene==='C08.E03'&&d.pov==='elf')return {...storyHeroDescriptor('ashen'),delivery:'封印外传来'};
 return storyCastAlias(d,alias);
}
export function storyCastDisplayLine(scene,line){const actor=storyCastSpeaker(scene,line);if(!actor)return line;return line.replace(/^[^：]+：/,actor.name+(actor.delivery?'（'+actor.delivery+'）':'')+'：');}
export function storyCastDisplayLabel(scene,label){if(typeof label!=='string')return label;return label.split(/(与|、)/).map(part=>storyCastAlias(scene,part)?.name??part).join('');}
// Present only what this save has actually learned, not the whole design catalogue.
// Existing knowledge ID + flag + completed scene are checked together to avoid spoilers.
export function knownStoryEvidenceCast(game){
 const st=game?.story;
 if(game?.race!=='dwarf'||!st?.completedScenes?.includes('C06.D03.dwarf')||!st.flags?.includes('D_COUP_LINK_PARTIAL')||!st.knowledge?.some(k=>k.id==='C06.D03.dwarf.k0'))return [];
 return [{...STORY_CAST_CHARACTERS['dwarf-minister'],summary:'已保存的调拨证词指向维尔铎一方。遗物盗卖与夺权军资的完整资金链，仍待查清。'}];
}
