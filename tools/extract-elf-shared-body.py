"""Imagegen-authored body extraction only: crop, uniform NEAREST resize, foot anchors.
Weapon poses refer to immutable shared PNGs; no weapon drawing or raster edits here.
"""
from PIL import Image
from pathlib import Path
import json,math
root=Path(__file__).resolve().parents[1];names=['idle-0','idle-1','anticipation','attack','recovery','hurt','guard','death']
# suffix, idle height, body X anchors, sole Ys, primary hands (source atlas pixels), angles, weapon scale, source grip
D={
'first-forge-oathhammer':('-v2',274,[204,624,1036,1410,205,652,1035,1485],[406]*4+[815]*4,[(261,327),(677,327),(1019,221),(1529,298),(264,722),(732,610),(1080,656),(1490,798)],[146,146,-9,130,146,89,45,130],1.6,[35,37]),
'human-oathblade':('-v2',309,[180,660,1090,1490,180,670,1075,1520],[445]*4+[824]*4,[(254,332),(727,332),(1121,171),(1648,315),(254,720),(739,662),(1144,639),(1695,798)],[-105,-105,90,-135,-105,-175,135,-135],1.35,[48,12]),
'elf-sixfold-heartwood':('-v3',300,[210,650,1080,1440,221,680,1050,1470],[399]*4+[796]*4,[(309,234),(738,232),(1030,185),(1528,231),(294,676),(681,586),(1128,624),(1524,777)],[0,0,-50,90,35,45,0,90],1.75,[31,32]),
'elf-last-string':('',246,[225,665,1060,1480,215,665,1072,1520],[404]*4+[790]*4,[(275,321),(718,321),(1181,257),(1581,264),(276,703),(635,698),(1151,641),(1621,764)],[0,0,180,180,0,0,180,-90],1.55,[14,31]),
'goblin-silent-ration':('',309,[225,675,1085,1465,240,665,1075,1510],[439]*4+[821]*4,[(284,336),(730,336),(995,241),(1614,293),(326,710),(654,705),(1127,656),(1592,806)],[-105,-105,90,-140,-105,-165,135,-135],1.1,[32,15])}
tops={'first-forge-oathhammer':[120,120,135,160,535,510,530,680],'human-oathblade':[130,130,140,180,525,530,530,680],'elf-sixfold-heartwood':[85,85,135,120,485,510,520,670],'elf-last-string':[145,145,150,160,535,550,550,660],'goblin-silent-ration':[120,120,170,170,505,515,530,670]}
second={'first-forge-oathhammer':[(214,315),(625,315),(1000,230),(1490,290),(219,704),(643,681),(1102,561),None],'human-oathblade':[(230,333),(703,333),(1148,197),(1625,310),(223,707),(705,689),(1145,677),(1608,807)],'elf-sixfold-heartwood':[None,None,(1168,298),(1478,232),None,(616,628),(1128,652),None]}
entries={};qa={}
for id,(suffix,h,xs,ys,hands,angles,ws,grip) in D.items():
 im=Image.open(root/f'qa/legendary-race-art/sources/elf-body-{id}{suffix}.png').convert('RGBA');scale=98/h;frames=[];folder=root/f'dist/legendary-hero-body/elf-{id}';folder.mkdir(parents=True,exist_ok=True)
 for i,name in enumerate(names):
  row=i//4;col=i%4;bounds=[0,450,890,1225,1774] if id!='elf-last-string' else [0,450,890,1330,1774];box=(bounds[col],tops[id][i],bounds[col+1],450 if row==0 else 835)
  cell=im.crop(box);cell=cell.resize((round(cell.width*scale),round(cell.height*scale)),Image.Resampling.NEAREST)
  px=round(96+(box[0]-xs[i])*scale);py=round(176+(box[1]-ys[i])*scale);frame=Image.new('RGBA',(256,240));frame.alpha_composite(cell,(px,py));frame.save(folder/f'{name}.png');bb=frame.getbbox();bb=[bb[0],bb[1],bb[2]-1,bb[3]-1]
  hand=[round(96+(hands[i][0]-xs[i])*scale),round(176+(hands[i][1]-ys[i])*scale)]
  pose=dict(hand=hand,grip=grip,angle=angles[i],front=[[hand[0]-4,hand[1]-5,9,10]])
  if id in second and second[id][i]:
   hx,hy=second[id][i];hx=round(96+(hx-xs[i])*scale);hy=round(176+(hy-ys[i])*scale);pose['front'].append([hx-4,hy-5,9,10])
  if id=='elf-last-string' and i in [2,3]:
   pull=(1057,255) if i==2 else (1472,256);world=[96+(pull[0]-xs[i])*scale,176+(pull[1]-ys[i])*scale];a=-angles[i]*math.pi/180;dx=(world[0]-hand[0])/ws;dy=(world[1]-hand[1])/ws;pose['bowPull']=[round(grip[0]+dx*math.cos(a)-dy*math.sin(a),2),round(grip[1]+dx*math.sin(a)+dy*math.cos(a),2)]
  frames.append(dict(id=name,file=f'../legendary-hero-body/elf-{id}/{name}.png',durationMs=180,alphaBBox=bb,solidBBox=bb,weaponPose=pose))
 entries[id]=dict(frameSize=[256,240],anchor=[96,176],facing='right',bodyReferenceBounds=[79,176],legendaryWeapon=dict(id=id,scale=ws),animations=dict(idle=names[:2],anticipation=['anticipation'],attack=['anticipation','attack','recovery','idle-0'],recovery=['recovery'],hurt=['hurt','idle-0'],guard=['guard'],death=['death']),frames=frames)
 qa[id]=dict(source=f'sources/elf-body-{id}{suffix}.png',scale=scale,sourceBodyHeight=h,xAnchors=xs,footYs=ys,sourceHands=hands)
(root/'qa/legendary-race-art/elf-body-entries.json').write_text(json.dumps(entries,indent=2))
(root/'qa/legendary-race-art/elf-body-extraction.json').write_text(json.dumps(qa,indent=2))
(root/'dist/legendary-hero-art/elf.js').write_text('export const ELF_LEGENDARY_HERO_ART='+json.dumps(entries,indent=2)+';\n')
