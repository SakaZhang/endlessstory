// Shared production sprite renderer: scene and codex use these exact silhouettes.
export const DWARF_ART_IDS=Object.freeze({
 'dwarf.a01.normal.1':'raider','dwarf.a01.normal.2':'rat','dwarf.a01.normal.3':'golem','dwarf.a01.elite':'shield',
 'dwarf.a02.normal.1':'lizard','dwarf.a02.normal.2':'bat','dwarf.a02.normal.3':'crab','dwarf.a02.elite':'brood',
 'dwarf.a03.normal.1':'guard','dwarf.a03.normal.2':'runeLizard','dwarf.a03.normal.3':'statue','dwarf.a03.elite':'executioner','dwarf.a03.boss':'morl'});
export const dwarfArtId=unit=>[unit?.definitionId,unit?.monsterId,unit?.codexDefinitionId,unit?.id].find(id=>DWARF_ART_IDS[id])??null;
export function drawDwarfMonster(c,x,y,unit={},options={}){
 const kind=DWARF_ART_IDS[dwarfArtId(unit)];if(!kind)return false;
 const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},p=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(2*(options.scale??1),2*(options.scale??1));if(unit.dead||unit.hp<=0)c.globalAlpha=.28;
 r(-27,5,54,5,'#10171980');
 const eye=(x,y,color='#e7bc70')=>{r(x-1,y-1,5,4,'#222b2a');r(x,y,3,2,color)};
 if(kind==='rat'){
 p([[28,-15],[40,-17],[46,-30],[50,-29],[48,-13],[37,-8],[19,-8]],'#987369');
 p([[-29,-24],[-19,-36],[9,-36],[24,-26],[27,-9],[11,-3],[-14,-5],[-35,-13]],'#756e60');p([[-21,-29],[-8,-35],[12,-30],[19,-22],[-16,-21]],'#958975');r(-19,-33,9,7,'#b0a28b');p([[-33,-25],[-25,-39],[-16,-39],[-11,-24]],'#6d635a');r(-24,-36,7,10,'#a0776a');p([[-28,-23],[-44,-14],[-38,-8],[-17,-11]],'#928371');r(-44,-14,5,5,'#393b36');eye(-29,-22);r(-37,-8,4,7,'#d7cfad');r(-31,-7,3,5,'#c3bc9f');r(-20,-4,12,8,'#625b51');r(12,-5,12,8,'#625b51');r(-22,1,8,3,'#b0a491');r(17,1,9,3,'#b0a491');
 }else if(['lizard','brood','runeLizard'].includes(kind)){
 const brood=kind==='brood',runic=kind==='runeLizard';if(brood)c.scale(1.16,1.16);
 const skin=runic?'#586d66':'#806b49',light=runic?'#82998a':'#a58d61';
 p([[14,-21],[35,-20],[48,-30],[51,-25],[43,-12],[19,-4]],skin);p([[-29,-28],[-11,-38],[13,-32],[28,-16],[20,-3],[-14,-5],[-34,-14]],skin);p([[-21,-28],[-7,-35],[13,-29],[23,-19],[-7,-19]],light);
 for(let i=0;i<5;i++)p([[-18+i*8,-29],[-17+i*8,-40+(i%2)*4],[-10+i*8,-28]],runic?'#b8c6ac':'#c2ae7b');
 p([[-27,-22],[-47,-17],[-48,-9],[-26,-8],[-16,-17]],light);r(-46,-9,23,3,'#373b32');r(-42,-7,3,4,'#d0c5a1');eye(-31,-19,runic?'#b6e4bd':'#f1c775');
 for(const x of [-18,14]){p([[x,-15],[x+9,-11],[x+8,3],[x-4,5],[x-7,1],[x+1,-3]],skin);r(x-5,2,5,3,'#c2b58d');}for(let i=0;i<5;i++)r(-15+i*7,-22+(i%2)*6,4,3,runic?'#a3c6ad':'#5b513b');
 if(brood){r(-1,-28,5,7,'#ba744e');r(8,-23,5,7,'#ba744e');p([[-33,-22],[-39,-30],[-31,-25]],'#d7c68e');}
 }else if(kind==='bat'){
 const wing=Math.round(Math.sin((options.time??0)*.007)*3);
 p([[-7,-53],[-29,-75-wing],[-49,-72-wing],[-59,-48],[-47,-52],[-37,-34],[-25,-43],[-13,-29]],'#71616c');p([[7,-53],[29,-75-wing],[49,-72-wing],[59,-48],[47,-52],[37,-34],[25,-43],[13,-29]],'#71616c');
 for(const side of [-1,1]){p([[side*9,-50],[side*29,-69-wing],[side*23,-46],[side*14,-35]],'#a18585');p([[side*29,-69-wing],[side*47,-66-wing],[side*39,-43]],'#8c7180');r(side*47-2,-72-wing,4,6,'#c5b39b');}
 p([[-11,-59],[-8,-73],[-1,-62],[8,-73],[12,-58],[10,-34],[0,-27],[-10,-35]],'#4e4b50');r(-8,-58,17,16,'#8d7f78');eye(-7,-54,'#e0c982');eye(4,-54,'#e0c982');r(-5,-45,3,5,'#d4c6aa');r(4,-45,3,5,'#d4c6aa');r(-7,-33,4,9,'#a58d81');r(5,-33,4,9,'#a58d81');
 }else if(kind==='crab'){
 for(let i=0;i<3;i++)for(const s of [-1,1])p([[s*17,-16+i*4],[s*(30+i*6),-18+i*6],[s*(37+i*5),3],[s*(32+i*5),4],[s*(25+i*5),-10+i*5],[s*16,-9+i*4]],'#665f55');
 p([[-27,-25],[-17,-38],[16,-38],[29,-25],[24,-7],[-23,-7]],'#69777a');p([[-20,-27],[-13,-34],[13,-34],[22,-26],[18,-16],[-18,-16]],'#9a9d8c');r(-15,-26,30,4,'#c0b794');r(-10,-17,20,7,'#353c3d');for(let i=0;i<4;i++)r(-9+i*5,-16,3,6,'#af9e7c');
 for(const s of [-1,1]){r(s*12-2,-44,4,11,'#767c71');eye(s*12-1,-44);p([[s*22,-23],[s*36,-36],[s*47,-34],[s*51,-25],[s*43,-19],[s*36,-24],[s*29,-13]],'#8a8170');p([[s*38,-33],[s*44,-43],[s*49,-40],[s*47,-31]],'#b4aa8b');}
 }else if(kind==='golem'||kind==='statue'){
 const stone=kind==='statue',base=stone?'#687670':'#706b60',high=stone?'#9ba295':'#a29a7c',dark=stone?'#3d514d':'#41433d',magic=stone?'#a9d3ba':'#e2a85b';
 for(const x of [-23,8]){r(x,-27,16,30,base);r(x-3,0,22,7,high);r(x+2,-22,4,17,dark);}
 p([[-26,-59],[-12,-67],[18,-65],[29,-48],[23,-23],[0,-16],[-24,-24]],base);r(-21,-54,43,6,high);r(-16,-44,33,19,dark);r(-5,-42,10,14,magic);r(-2,-45,4,20,magic);
 for(const s of [-1,1]){r(s*29-8,-57,18,19,high);r(s*34-8,-37,17,23,base);r(s*34-5,-32,4,12,dark);}r(-12,-80,28,22,base);r(-15,-80,34,6,high);r(-8,-69,20,5,dark);eye(-7,-68,magic);eye(7,-68,magic);
 if(stone){p([[-14,-80],[-8,-88],[12,-88],[18,-80]],high);r(-20,-57,4,23,'#89976a');r(14,-34,8,5,'#88966a');r(-3,-75,3,14,dark);}else{r(-19,-59,5,9,'#a1854d');r(16,-59,5,9,'#a1854d');r(-10,-83,21,3,'#c1af7c');}
 }else{
 const boss=kind==='morl',execution=kind==='executioner',shield=kind==='shield',raider=kind==='raider';
 const cloth=raider||shield?'#68554b':boss?'#454e69':'#3e5955',armor=raider?'#817561':boss?'#98a99b':'#788c82',trim=boss?'#d2bc80':'#b0b297';
 if(boss)c.scale(1.1,1.1);p([[-19,-61],[12,-63],[26,-44],[31,2],[10,-6],[-3,3],[-26,1]],cloth);
 r(-16,-25,11,26,'#303b3c');r(7,-26,11,27,'#303b3c');r(-20,0,17,7,armor);r(6,0,18,7,armor);r(-18,-51,37,30,armor);r(-15,-43,30,18,cloth);r(-11,-41,5,15,armor);r(7,-41,5,15,armor);r(-20,-22,41,5,'#4b4638');r(-3,-23,8,7,trim);
 r(-27,-53,15,15,armor);r(14,-53,16,15,armor);r(-27,-53,16,4,trim);r(14,-53,16,4,trim);r(-28,-38,10,16,cloth);r(22,-38,10,16,cloth);r(-27,-25,9,8,trim);r(23,-25,9,8,trim);
 if(raider){p([[-15,-61],[-13,-74],[1,-82],[14,-74],[18,-58]],cloth);r(-9,-68,23,17,'#ac9471');r(-11,-65,26,5,'#313a37');eye(-8,-64);eye(7,-64);r(-9,-54,23,7,'#594e42');}else{r(-13,-75,30,25,armor);p([[-14,-75],[-7,-82],[11,-82],[18,-75]],trim);r(-11,-68,26,6,'#253a3b');eye(-8,-66,boss?'#e5d793':'#b4d2b6');eye(8,-66,boss?'#e5d793':'#b4d2b6');r(-1,-70,5,20,trim);r(-10,-53,23,4,'#455955');}
 if(shield){p([[-39,-42],[-26,-49],[-12,-42],[-12,-15],[-26,-6],[-39,-15]],trim);p([[-35,-39],[-26,-44],[-16,-39],[-16,-17],[-26,-11],[-35,-17]],'#4b5b55');r(-28,-38,5,23,'#c4b48a');r(-33,-30,15,5,'#c4b48a');r(30,-58,4,60,'#ad9569');p([[33,-62],[42,-59],[48,-47],[39,-40],[34,-43]],'#b5b6a0');}
 else if(execution||raider){r(-36,-61,4,67,'#a48b5d');p([[-35,-61],[-49,-67],[-58,-57],[-55,-42],[-40,-40],[-34,-47]],armor);p([[-51,-62],[-57,-55],[-53,-44],[-48,-44]],trim);if(execution){r(30,-22,7,20,'#5b5c50');r(28,-2,12,7,armor);}}
 else{r(-35,-43,4,52,'#8d805c');r(-43,-45,21,5,trim);p([[-35,-44],[-35,-88],[-31,-95],[-28,-88],[-29,-44]],armor);r(-33,-86,2,39,trim);p([[20,-39],[32,-44],[43,-36],[40,-15],[31,-7],[22,-16]],armor);r(29,-34,5,18,trim);}
 if(boss){p([[-13,-78],[-22,-93],[-10,-86],[-5,-79]],trim);p([[11,-79],[22,-94],[21,-82],[17,-77]],trim);r(-2,-84,5,6,'#d7d6a0');}
 }
 c.restore();return true;
}
export function drawDwarfMonsterPortrait(canvas,id){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);c.imageSmoothingEnabled=false;return drawDwarfMonster(c,canvas.width/2,canvas.height*.88,{definitionId:id,hp:1},{time:0,scale:Math.min(canvas.width/260,canvas.height/220)});}
// SVG adapter executes the SAME production geometry; no separately authored portrait.
export function dwarfMonsterSvg(id,{known=true,size=112}={}){
 if(!DWARF_ART_IDS[id])return '';
 const safeSize=Math.min(1024,Math.max(16,Number(size)||112));
 if(!known)return `<svg xmlns="http://www.w3.org/2000/svg" width="${safeSize}" height="${safeSize}" viewBox="0 0 260 220" aria-label="未知怪物" role="img"><path fill="#3c4948" d="M100 50h60v20h20v65h-15v45h-30v-35h-10v35H95v-45H80V70h20z"/></svg>`;
 let out=[],path=[],depth=0;
 const ctx={fillStyle:'#000',globalAlpha:1,save(){out.push('<g>');depth++},restore(){out.push('</g>');depth--},translate(x,y){out.push(`<g transform="translate(${x} ${y})">`);depth++},scale(x,y){out.push(`<g transform="scale(${x} ${y})">`);depth++},fillRect(x,y,w,h){out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${this.fillStyle}"/>`)},beginPath(){path=[]},moveTo(x,y){path.push(`M${x} ${y}`)},lineTo(x,y){path.push(`L${x} ${y}`)},closePath(){path.push('Z')},fill(){out.push(`<path d="${path.join(' ')}" fill="${this.fillStyle}"/>`)}};
 drawDwarfMonster(ctx,130,195,{definitionId:id,hp:1},{time:0,scale:.96});while(depth-->0)out.push('</g>');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${safeSize}" height="${safeSize}" viewBox="0 0 260 220" shape-rendering="crispEdges" role="img" aria-label="怪物像素画像">${out.join('')}</svg>`;
}
