// Original, fixed 32-pixel equipment artwork. No rolls, generated stats or save writes.
import {EQUIPMENT_TEMPLATE_BY_ID} from './equipment-templates.js';
import {renderArmorPixels} from './equipment-armor-art.js';
import {icon} from './icons.js';
import {frameEquipmentSVG} from './equipment-presentation.js';
const C={ink:'#151b24',steel:'#899ba6',light:'#dce5df',shade:'#425361',copper:'#b57b49',gold:'#e2b574',wood:'#704635',ember:'#c65c35',stone:'#819286'};
export function renderWeaponAccessoryPixels(template){
 const id=template?.id?.replace('dwarf_scatter_','');let s='';
 const r=(x,y,w,h,c)=>s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C[c]||c}"/>`;
 const p=(points,c)=>s+=`<polygon points="${points}" fill="${C[c]||c}"/>`;
 const shaft=(x,y,h,wide=3)=>{r(x-1,y-1,wide+2,h+2,'ink');r(x,y,wide,h,'wood');r(x,y,1,h,'copper');for(let k=y+5;k<y+h-1;k+=5)r(x,k,wide,1,'gold');};
 const ring=(x,y,w,h,c='steel')=>{p(`${x+3},${y} ${x+w-3},${y} ${x+w-3},${y+2} ${x+w},${y+2} ${x+w},${y+h-3} ${x+w-3},${y+h-3} ${x+w-3},${y+h} ${x+3},${y+h} ${x+3},${y+h-3} ${x},${y+h-3} ${x},${y+2} ${x+3},${y+2}`,'ink');r(x+2,y+2,w-4,h-4,c);r(x+5,y+5,w-10,h-10,'ink');r(x+3,y+3,2,h-6,'light');r(x+5,y+h-4,w-10,2,'shade');};
 const chain=(kind='steel')=>{for(let j=0;j<5;j++){r(7+j,3+j*2,2,3,kind);r(23-j,3+j*2,2,3,kind);}r(14,12,4,3,'ink');r(15,12,2,3,kind);};
 switch(id){
 case 'cleft_axe':shaft(18,5,24);p('17,4 11,4 11,6 6,6 6,9 3,9 3,19 6,19 6,21 12,21 12,19 18,19','ink');p('16,6 11,6 11,8 7,8 7,10 5,10 5,18 8,18 8,19 12,19 12,17 17,17','steel');r(5,10,2,8,'light');r(7,8,2,3,'light');r(16,7,6,11,'shade');r(18,9,2,2,'copper');r(18,14,2,2,'gold');break;
 case 'veincut_axe':shaft(19,3,27,2);p('18,5 11,5 11,8 8,8 8,12 6,12 6,20 9,20 9,18 14,18 14,15 19,15','ink');p('17,7 12,7 12,10 10,10 10,13 8,13 8,18 10,18 10,16 14,16 14,13 18,13','shade');r(8,13,1,5,'light');r(10,10,1,4,'steel');r(15,7,3,2,'ember');r(20,7,5,4,'steel');break;
 case 'slagtooth_axe':shaft(17,5,24,4);p('15,4 8,4 8,7 4,7 4,12 3,12 3,20 7,20 7,23 13,23 13,20 17,20 17,5 24,5 24,8 28,8 28,11 24,11 24,14 28,14 28,17 23,17 23,20 17,20','ink');p('14,6 9,6 9,9 6,9 6,13 5,13 5,19 9,19 9,21 12,21 12,18 16,18 16,6','shade');r(5,13,2,6,'steel');r(8,8,2,4,'steel');r(22,8,4,2,'copper');r(22,14,4,2,'copper');r(18,6,2,12,'ember');break;
 case 'copperedge_axe':shaft(18,2,28,2);p('17,5 12,5 12,7 8,7 8,11 6,11 6,19 9,19 9,21 13,21 13,18 18,18','ink');p('16,7 12,7 12,9 10,9 10,12 8,12 8,18 11,18 11,19 12,19 12,16 17,16','copper');p('16,9 13,9 13,11 11,11 11,17 12,17 12,14 17,14','light');r(17,7,6,9,'shade');r(19,9,2,5,'gold');break;
 case 'rivet_hammer':shaft(15,12,17,3);r(4,5,25,12,'ink');r(6,7,21,8,'steel');r(6,7,21,2,'light');r(23,9,4,6,'shade');r(13,6,7,10,'shade');r(8,11,2,2,'copper');r(23,11,2,2,'copper');r(15,8,3,5,'gold');break;
 case 'deepforge_hammer':shaft(14,14,14,5);p('4,5 25,5 25,7 29,7 29,19 26,19 26,21 5,21 5,18 2,18 2,8 4,8','ink');r(5,7,20,12,'shade');r(6,8,17,2,'steel');r(25,9,2,8,'#29333f');r(11,6,9,14,'#2c3843');r(12,9,7,1,'ember');r(15,9,1,9,'copper');r(11,17,9,1,'ember');break;
 case 'squareforge_hammer':shaft(14,16,13,4);r(5,4,23,16,'ink');r(7,6,19,12,'steel');r(9,7,15,3,'light');for(const [x,y] of [[7,6],[23,6],[7,15],[23,15]])r(x,y,3,3,'copper');r(13,6,6,12,'shade');r(15,9,2,6,'light');r(13,26,6,3,'copper');break;
 case 'coalmark_hammer':shaft(14,15,14,5);p('7,3 24,3 24,5 28,5 28,8 30,8 30,16 27,16 27,20 5,20 5,17 2,17 2,7 5,7 5,5 7,5','ink');r(6,6,19,12,'steel');r(8,5,15,3,'light');r(25,8,3,8,'shade');r(11,8,10,8,'ink');r(13,10,6,4,'#343638');r(13,20,7,3,'copper');r(13,26,7,3,'gold');break;
 case 'anvil_seal_ring':ring(6,10,21,19,'copper');r(9,3,16,12,'ink');r(11,5,12,8,'gold');r(12,7,10,2,'ink');r(15,9,4,2,'ink');r(13,11,8,1,'ink');break;
 case 'engraved_ring':ring(6,5,21,24,'shade');r(9,8,2,6,'copper');r(10,8,5,1,'ember');r(22,10,2,8,'copper');r(19,24,4,1,'ember');r(10,19,1,5,'ember');break;
 case 'oathkeeper_ring':ring(5,8,23,20,'shade');r(8,6,17,8,'ink');r(9,7,15,5,'steel');r(10,9,13,1,'light');r(10,11,13,1,'shade');break;
 case 'hammermark_ring':ring(6,7,20,22,'copper');r(8,6,15,7,'wood');for(let j=0;j<4;j++){r(10+j*3,7+j,2,3,'gold');}r(8,17,2,6,'gold');break;
 case 'copperglyph_ring':ring(7,7,19,22,'steel');r(10,3,13,12,'ink');r(11,4,11,10,'shade');r(12,5,7,2,'copper');r(17,7,2,5,'copper');r(13,10,6,2,'gold');r(12,7,2,3,'ink');break;
 case 'stonebound_ring':ring(5,11,23,18,'steel');p('9,3 22,3 22,5 25,5 25,12 22,12 22,15 9,15 9,12 6,12 6,6 9,6','ink');r(10,5,12,8,'stone');r(11,6,9,2,'light');r(8,7,3,5,'shade');r(21,7,3,5,'shade');break;
 case 'hearth_pendant':chain('shade');p('10,13 22,13 22,16 25,16 25,27 22,27 22,30 10,30 10,27 7,27 7,16 10,16','ink');r(11,15,10,3,'copper');r(9,18,14,8,'copper');r(12,18,8,7,'ink');r(15,20,3,4,'ember');r(11,27,10,2,'gold');break;
 case 'stone_marrow_pendant':chain('wood');r(7,14,18,16,'ink');r(9,16,14,12,'shade');p('12,17 20,17 20,20 22,20 22,25 19,25 19,27 11,27 11,24 10,24 10,20 12,20','stone');r(13,18,5,2,'light');r(17,22,2,4,'#526c62');break;
 case 'old_oath_charm':chain('steel');p('11,13 21,13 21,27 18,27 18,30 14,30 14,27 11,27','ink');r(13,14,6,13,'steel');for(let y of [17,21,25])r(14,y,4,1,'shade');r(13,14,1,11,'light');break;
 case 'forgechip_pendant':chain('shade');p('8,15 22,15 22,18 25,18 25,27 21,27 21,29 9,29 9,26 6,26 6,19 8,19','ink');r(9,17,12,10,'shade');r(10,18,9,2,'steel');r(7,20,3,5,'copper');r(19,25,4,3,'copper');r(11,22,7,2,'ink');break;
 case 'deepstone_charm':chain('wood');p('11,13 21,13 21,16 24,16 24,26 21,26 21,30 10,30 10,27 7,27 7,18 10,18','ink');r(11,15,9,13,'#8f8370');r(9,19,13,7,'#8f8370');r(12,16,7,2,'#c1b8a2');for(let j=0;j<8;j++){r(10+j,18+j,2,2,'wood');r(19-j,18+j,2,2,'copper');}break;
 case 'inscribedplate_charm':chain('ink');r(10,13,13,17,'ink');r(12,14,9,14,'copper');r(12,14,2,14,'gold');r(15,16,5,1,'light');r(17,17,1,8,'steel');r(15,21,5,1,'light');r(15,25,5,1,'light');break;
 default:return null;
 }return s;
}
export function equipmentArtTemplate(item){for(const id of [item?.visualVariant,item?.templateId,item?.id])if(typeof id==='string'&&Object.hasOwn(EQUIPMENT_TEMPLATE_BY_ID,id))return EQUIPMENT_TEMPLATE_BY_ID[id];return null;}
export function renderEquipmentPixels(template){return renderWeaponAccessoryPixels(template)||renderArmorPixels(template);}
function legendaryEquipmentIcon(item,options){
 const size=Number.isFinite(options.size)?Math.max(16,Math.min(512,Math.round(options.size))):64;
 if(item?.legendaryId==='first-forge-oathhammer')return frameEquipmentSVG(icon('firstforge','guard',3).replace(/width="64" height="64"/,`width="${size}" height="${size}"`).replace('<svg ','<svg data-equipment-art="first-forge-oathhammer" '),item,64);
 if(item?.legendaryId!=='everburning-reactor')return null;
 let pixels='';const r=(x,y,w,h,c)=>pixels+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
 for(let j=0;j<5;j++){r(5+j*2,2+j*2,3,3,'#141c25');r(6+j*2,2+j*2,1,2,'#d7b66b');r(24-j*2,2+j*2,3,3,'#141c25');r(25-j*2,2+j*2,1,2,'#d7b66b');}
 r(12,9,8,5,'#18212b');r(14,10,4,3,'#b88a45');
 r(8,12,16,18,'#141c25');r(6,16,20,10,'#141c25');r(9,13,14,15,'#81949c');r(10,14,12,2,'#d7e1d5');r(7,17,3,8,'#526975');r(22,17,3,8,'#526975');r(10,26,12,3,'#ab7941');
 r(11,16,10,10,'#30323a');r(12,17,8,8,'#b85b32');r(13,18,6,6,'#f29c40');r(14,18,4,5,'#ffda74');r(15,19,2,3,'#fff7ce');
 for(const x of [9,21])for(const y of [14,25])r(x,y,2,2,'#e9c575');
 r(6,19,3,1,'#dbb767');r(23,19,3,1,'#dbb767');r(6,22,3,1,'#263a47');r(23,22,3,1,'#263a47');r(13,27,6,2,'#202d37');
 return frameEquipmentSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" shape-rendering="crispEdges" role="img" aria-label="不熄之炉" data-equipment-art="everburning-reactor">${pixels}</svg>`,item,32);
}
export function equipmentIcon(item,options={}){const legendary=legendaryEquipmentIcon(item,options);if(legendary)return legendary;const template=equipmentArtTemplate(item),pixels=template&&renderEquipmentPixels(template);if(!pixels)return frameEquipmentSVG(icon(item?.weaponType==='axe'?'axe':item?.weaponType==='hammer'?'hammer':item?.iconKey||item?.icon||item?.slot||'weapon',item?.set||item?.setId||'anvil',item?.rarity??1),item,64);const size=Number.isFinite(options.size)?Math.max(16,Math.min(512,Math.round(options.size))):64;return frameEquipmentSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" shape-rendering="crispEdges" role="img" aria-label="${String(template.name).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')}" data-equipment-art="${template.id}" data-equipment-visual="${template.id}" data-equipment-template="${template.id}">${pixels}</svg>`,{...item,set:item?.set||template.setId});}
