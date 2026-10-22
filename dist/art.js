import {drawDwarfMonster} from './dwarf-monster-art.js';
import {drawDwarfArea,dwarfAreaIndex} from './dwarf-area-art.js';
// Original, deliberately low-resolution pixel artwork. All assets are drawn locally.
export function enemySceneLayout(count){
 const n=Number.isInteger(count)&&count>0?count:1;
 const xs=n===1?[682]:n===2?[625,805]:n===3?[555,705,850]:Array.from({length:n},(_,i)=>535+i*355/(n-1));
 return xs.map((x,i)=>({x,y:333+(n>1&&i%2?-6:0),scale:Math.min(1,3/n)}));
}
export function drawScene(canvas, state = {}) {
  const W=960,H=420;
  if(canvas.width!==W)canvas.width=W;if(canvas.height!==H)canvas.height=H;
  const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
  const t=(state.time||0), loc=state.location||0, fight=state.fighting;
  const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h));};
  const poly=(p,col)=>{c.fillStyle=col;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
  const rng=(i)=>{let x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
  const glow=(x,y,r,color)=>{let g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);};
  const palettes=[['#101b23','#263435','#34403b','#161e20','#4b4938'],['#19151b','#34262b','#443039','#211d23','#594038'],['#111a23','#26313b','#36414a','#1a222a','#404a47']];
  const p=palettes[loc];rect(0,0,W,H,p[0]);
  // Skies and distant silhouettes.
  for(let y=0;y<230;y+=6)rect(0,y,W,6,loc===1?`rgba(101,45,34,${.12+y/1800})`:`rgba(75,95,91,${.06+y/1700})`);
  if(loc!==1){glow(715,76,110,loc===2?'#53796b27':'#87978220');rect(703,37,31,31,'#a7aa821c');rect(707,37,23,31,'#c2c5a12a');}
  for(let i=0;i<6;i++)poly([[i*210-70,230],[i*210+25,88+rng(i)*62],[i*210+125,170],[i*210+220,230]],p[1]);
  if(loc===0){
    // Ancient dense pines.
    for(let i=0;i<27;i++){let x=i*39-15,h=75+rng(i+5)*95,y=230-h;rect(x+13,y+5,7,h+38,'#1a292a');for(let k=0;k<4;k++)poly([[x+16,y+k*24],[x-10-k*5,y+53+k*25],[x+43+k*5,y+53+k*25]],i%3?'#1b2b2b':'#253431');}
    for(const x of [26,122,878,932]){rect(x,0,22,300,'#152022');rect(x+3,0,5,280,'#27302c');poly([[x+10,120],[x-36,77],[x-49,32],[x-40,70],[x+15,99]],'#152022');poly([[x+12,63],[x+64,16],[x+57,5],[x+16,39]],'#152022');}
    // Abandoned wagon, chest, scattered travel supplies.
    rect(87,243,118,44,'#322f29');rect(91,238,116,8,'#574734');for(let i=0;i<5;i++){rect(94+i*22,246,17,32,'#59452f');rect(96+i*22,249,3,23,'#796044');}rect(88,278,126,7,'#1e2120');
    for(const x of [110,190]){c.strokeStyle='#1c2021';c.lineWidth=8;c.beginPath();c.arc(x,290,23,0,7);c.stroke();c.strokeStyle='#715b3d';c.lineWidth=4;c.beginPath();c.arc(x,290,19,0,7);c.stroke();for(let a=0;a<4;a++){c.beginPath();c.moveTo(x-18*Math.cos(a*Math.PI/4),290-18*Math.sin(a*Math.PI/4));c.lineTo(x+18*Math.cos(a*Math.PI/4),290+18*Math.sin(a*Math.PI/4));c.stroke();}}
    rect(99,211,77,26,'#6f6850');rect(104,205,64,7,'#82785a');rect(128,207,6,33,'#3b3e31');rect(80,221,24,18,'#4b4736');
  } else if(loc===1){
    // Forge masonry, furnace and hanging industrial chains.
    rect(0,55,W,248,'#292329');for(let row=0;row<7;row++)for(let col=0;col<14;col++){let x=col*76+(row%2)*-38;rect(x+2,62+row*34,70,29,['#3b3033','#332c31','#403236'][Math.floor(rng(row*14+col)*3)]);rect(x+4,64+row*34,66,3,'#49383a');}
    rect(388,96,192,207,'#171a20');poly([[377,96],[402,65],[563,65],[589,96]],'#56403b');rect(409,120,150,179,'#21191a');rect(426,155,115,139,'#743329');rect(436,170,95,123,'#b9512c');glow(486,226,155,'#df743c45');for(let k=0;k<7;k++){let x=439+k*13;poly([[x,290],[x-2,235],[x+4,203+rng(k)*30],[x+9,244],[x+13,290]],k%2?'#e18d3e':'#b75b2e');}rect(411,273,145,13,'#111a20');for(let i=0;i<7;i++)rect(418+i*21,190,7,102,'#282426');
    for(const x of [172,785,840])for(let y=0;y<145;y+=16){c.strokeStyle='#71604d';c.lineWidth=3;c.strokeRect(x+(y%32?2:0),y,7,13);}rect(140,282,100,14,'#778080');poly([[134,271],[250,271],[225,283],[167,287]],'#92958a');rect(181,285,27,35,'#485154');rect(166,315,58,8,'#555e5b');
    rect(770,244,76,71,'#544035');for(let y=250;y<311;y+=17)rect(773,y,70,3,'#251f24');rect(783,244,5,73,'#8b6b45');rect(827,244,5,73,'#8b6b45');
  }else{
    // Broken cathedral arches, stone tombs, sickly lanterns.
    for(let i=0;i<5;i++){let x=i*223-35;rect(x,40,37,267,'#38424a');rect(x-6,45,49,13,'#4b5355');rect(x-5,280,49,20,'#4c5353');rect(x+7,62,9,203,'#454e52');poly([[x+31,43],[x+83,0],[x+178,0],[x+223,43],[x+223,73],[x+168,22],[x+92,22],[x+31,73]],'#303b44');}
    for(let i=0;i<4;i++){let x=66+i*236;rect(x,110,71,146,'#0f1a21');poly([[x,112],[x+35,78],[x+71,112]],'#0f1a21');rect(x+32,95,5,154,'#3a4b4b');rect(x,154,71,5,'#3a4b4b');}
    rect(63,286,166,24,'#535957');poly([[51,282],[78,261],[218,261],[239,282]],'#66706a');rect(84,266,116,5,'#85877b');rect(767,264,100,43,'#404b4c');rect(759,257,118,13,'#606b65');
    for(const x of [248,711]){rect(x,159,7,102,'#323d40');rect(x-8,162,23,7,'#758379');rect(x-4,143,15,19,'#a4bb88');glow(x+4,151,82,'#84c4a238');}
  }
  const m2Area=dwarfAreaIndex(state.areaId??state.instanceId);
  if(m2Area!==null)drawDwarfArea(c,m2Area,t);
  // Mist between background and combat plane.
  for(let i=0;i<10;i++){let x=(i*173+(t*.008))%1150-120;rect(x,251+(i%4)*11,180,3,'#b0ba9620');}
  poly([[0,300],[190,289],[380,306],[623,290],[960,302],[960,420],[0,420]],p[3]);
  poly([[0,350],[198,312],[478,320],[754,306],[960,335],[960,420],[0,420]],p[4]);
  for(let i=0;i<180;i++){let x=rng(i+14)*W,y=310+rng(i+280)*110;rect(x,y,3+rng(i+800)*13,2+rng(i+400)*3,i%4?'#141b1d55':'#b2a17b28');}
  for(let i=0;i<37;i++){let x=rng(i+50)*W,y=302+rng(i+90)*39;for(let j=0;j<3;j++)rect(x+j*4,y-j*3,2,5+rng(i+j)*9,loc===0?'#5b6344':'#50554a');}
  // A warm campfire in the foreground.
  const fireX=loc===0?506:loc===1?74:900;
  glow(fireX,327,91,loc===2?'#79bd8120':'#ec8d3b2b');rect(fireX-21,345,44,6,'#1c1c1c');rect(fireX-18,340,35,5,'#6c4931');
  for(let j=0;j<5;j++){let h=17+Math.sin(t*.007+j*3)*7;rect(fireX-12+j*6,338-h,6,h,j%2?'#e9ae58':'#bf6737');rect(fireX-7+j*3,333-h*.5,4,h*.6,'#efc879');}
  // Pixel character sprite helpers. 2x hand placed geometry.
  function dwarf(x,y){
    c.save();c.translate(Math.floor(x),Math.floor(y));c.scale(2,2);
    rect(-24,6,50,5,'#11181970');
    rect(-17,-23,13,24,'#2b2726');rect(6,-22,12,23,'#242528');rect(-20,-3,17,8,'#363332');rect(5,-3,18,8,'#363332');rect(-19,-3,15,3,'#716958');rect(7,-3,13,3,'#777061');
    poly([[-20,-49],[-9,-57],[16,-52],[23,-25],[14,-12],[-19,-15]],'#303e40');rect(-19,-44,39,8,'#77817a');rect(-16,-36,32,22,'#586466');rect(-15,-35,4,18,'#839188');rect(7,-34,8,18,'#3d4c50');rect(-20,-18,39,5,'#8e6941');rect(-3,-20,9,8,'#c3a366');rect(-1,-18,5,4,'#413e33');
    rect(-24,-44,13,17,'#89958a');rect(-25,-43,13,5,'#b4b9a2');rect(15,-45,13,16,'#818c81');rect(15,-44,14,5,'#b8b69a');rect(-26,-28,9,12,'#9f7950');rect(22,-29,10,11,'#bb9162');
    rect(-12,-67,28,23,'#bb9567');rect(-7,-59,24,12,'#d3ad77');rect(0,-58,5,3,'#242c2c');rect(12,-58,5,3,'#242c2c');rect(5,-55,9,8,'#e3b783');
    poly([[-14,-54],[-5,-50],[0,-48],[11,-48],[20,-54],[18,-34],[12,-23],[6,-18],[-3,-24],[-12,-35]],'#b8b8a0');rect(-10,-48,5,15,'#dfd6b4');rect(-2,-44,5,19,'#d2c8a7');rect(7,-43,4,20,'#e4d6ae');rect(13,-47,4,13,'#8a958a');rect(3,-26,8,4,'#967b49');
    rect(-15,-73,33,14,'#647575');rect(-11,-79,24,8,'#81908a');rect(-7,-80,15,3,'#b8baa2');rect(-17,-65,37,6,'#a6ac94');rect(-1,-78,6,16,'#bea36a');rect(-16,-63,5,12,'#637570');
    // Heirloom axe and shield.
    let swing=fight?Math.sin(t*.012)*.12:0;c.save();c.translate(30,-29);c.rotate(swing);rect(-2,-37,4,59,'#684e35');rect(-1,-36,2,56,'#a28758');poly([[0,-39],[5,-43],[18,-41],[24,-33],[20,-23],[6,-23],[1,-27]],'#aeb5aa');poly([[16,-40],[22,-33],[19,-25],[13,-25],[16,-32]],'#dde0be');rect(-7,-36,9,9,'#788b8b');rect(-4,-35,3,7,'#c7c9aa');c.restore();
    poly([[-34,-33],[-25,-39],[-14,-34],[-14,-14],[-23,-7],[-33,-14]],'#8f9581');poly([[-31,-31],[-25,-35],[-17,-31],[-17,-16],[-23,-11],[-30,-16]],'#3c5755');rect(-25,-29,4,14,'#bda66b');rect(-29,-24,12,4,'#bda66b');c.restore();
  }
  function foe(x,y,unit={}){if(drawDwarfMonster(c,x,y,unit,{time:t,scale:unit.sceneScale??1}))return;c.save();c.translate(Math.floor(x),Math.floor(y));c.scale(2*(unit.sceneScale??1),2*(unit.sceneScale??1));let boss=unit.boss??state.boss;const loc=unit.artLocation??unit.location??state.location??0;if(unit.dead||unit.hp<=0)c.globalAlpha=.28;
    rect(-27,5,53,6,'#10171980');
    if(loc===1){
      rect(-21,-21,16,27,'#4c4948');rect(7,-24,17,30,'#514d49');rect(-24,0,19,7,'#77706a');rect(8,0,20,7,'#77706a');poly([[-25,-57],[-11,-66],[19,-62],[29,-48],[24,-23],[11,-13],[-20,-20]],'#5c5b56');rect(-22,-53,42,7,'#858173');rect(-17,-43,34,19,'#383c3c');rect(-9,-42,7,15,'#de6939');rect(6,-43,6,17,'#c95832');rect(-34,-54,16,21,'#787268');rect(-38,-35,17,22,'#55544e');rect(23,-53,15,22,'#777064');rect(28,-34,17,22,'#55544e');rect(-11,-79,27,23,'#676b61');rect(-14,-78,33,5,'#939181');rect(-7,-69,6,4,'#faac51');rect(7,-69,6,4,'#faac51');rect(-6,-60,17,4,'#252e31');
    }else{
      const armor=loc===2||boss, cloak=armor?'#374849':'#603d36';
      poly([[-19,-63],[10,-66],[26,-43],[29,1],[6,-8],[-13,1],[-29,-4],[-24,-43]],cloak);
      rect(-16,-26,11,26,'#272e32');rect(6,-26,11,27,'#242d32');rect(-21,0,17,7,'#484a44');rect(5,0,18,7,'#484a44');rect(-18,-49,37,30,armor?'#586669':'#655241');rect(-18,-48,37,5,armor?'#99a39a':'#8b7358');rect(-16,-24,34,5,'#292e30');rect(-2,-25,7,6,'#ad9664');rect(-26,-49,14,13,armor?'#798782':'#83735c');rect(14,-49,14,13,armor?'#7e8780':'#83735c');rect(-27,-36,9,17,'#4a5351');rect(21,-37,9,17,'#4a5351');
      if(armor){rect(-13,-72,29,26,'#5d6f70');poly([[-14,-72],[-9,-79],[11,-79],[17,-72]],'#8d9b91');rect(-11,-69,25,7,'#1d3037');rect(-9,-67,7,3,'#b2ddb7');rect(6,-67,6,3,'#b2ddb7');rect(-1,-65,5,18,'#9aaba0');rect(-10,-53,23,5,'#3d5058');if(boss){poly([[-15,-74],[-23,-89],[-13,-83],[-7,-75]],'#b9ae85');poly([[13,-75],[22,-91],[23,-80],[18,-72]],'#b9ae85');}}
      else{poly([[-16,-60],[-14,-73],[0,-80],[14,-72],[19,-54]],'#665b4a');rect(-9,-65,21,16,'#aa8c68');rect(-11,-64,26,6,'#2b3131');rect(-8,-62,5,2,'#d9cb9b');rect(7,-62,5,2,'#d9cb9b');rect(-9,-53,23,9,'#53443c');}
      rect(-35,-32,4,39,'#6f6047');rect(-41,-36,17,5,'#b4ad86');poly([[-35,-35],[-35,-75],[-31,-81],[-28,-74],[-30,-35]],armor?'#b1c5bc':'#989d8b');rect(-33,-73,2,36,'#d4dac0');
    }c.restore();}
  const bob=fight?Math.sin(t*.012)*2:Math.sin(t*.002)*1;
  const units=Array.isArray(state.enemies)&&state.enemies.length?state.enemies:null;
  dwarf((units&&units.length>1?260:329)+(fight?Math.sin(t*.009)*4:0),333+bob);
  if(units){const layout=enemySceneLayout(units.length);units.forEach((unit,i)=>{const p=layout[i];foe(p.x,p.y-bob,{...unit,sceneScale:p.scale});if(unit.id===state.targetId&&unit.hp>0){rect(p.x-24,p.y+16,48,3,'#d5b77c');rect(p.x-28,p.y+12,4,7,'#d5b77c');rect(p.x+24,p.y+12,4,7,'#d5b77c');poly([[p.x-7,p.y-180],[p.x+7,p.y-180],[p.x,p.y-172]],'#e4c887');}});}else foe(682,333-bob);
  if(state.hit){const hitX=units?enemySceneLayout(units.length)[Math.max(0,units.findIndex(u=>u.id===state.targetId))].x-30:650;glow(hitX+1,232,62,'#eabd6960');for(let i=0;i<8;i++){let a=i*Math.PI/4;rect(hitX+Math.cos(a)*35,234+Math.sin(a)*35,8,3,'#f8dc8d');}}
  // Embers and canopy dust: tiny hard-edged pixels, never smooth sprites.
  for(let i=0;i<23;i++){let x=(rng(i+700)*W+t*(.003+rng(i)*.004))%W,y=(rng(i+950)*300-t*.008+600)%300;rect(x,y,i%4?2:3,2,i%3?'#b5b48a55':'#e6b76a99');}
  const vignette=c.createRadialGradient(480,230,190,480,230,540);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'#060b128f');c.fillStyle=vignette;c.fillRect(0,0,W,H);
}
