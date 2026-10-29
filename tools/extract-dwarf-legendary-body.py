"""Extract imagegen BODY-ONLY atlases; only crop, uniform NN scale, anchor placement.
weapon poses use immutable canonical catalog PNG via shared runtime helper.
"""
from pathlib import Path
from PIL import Image
import json,math
root=Path(__file__).resolve().parents[1]
names=['idle-0','idle-1','anticipation','attack','recovery','hurt','guard','death']
# source-body foot anchors; ONE uniform scale per atlas, all frames.
C={
'first-forge-oathhammer':dict(scale=60/255,x=[195,640,1074,1468,185,675,1065,1460],y=[418]*4+[825]*4,weaponScale=1.2,grip=[32,32], hands=[[290,308],[746,308],[1028,174],[1650,287],[300,744],[665,677],[1146,669],[1676,792]],angles=[108,108,0,115,130,65,30,110],second=[[146,342],[594,342],[1078,230],[1596,293],[199,727],None,[1145,706],None]),
'human-oathblade':dict(scale=60/258,x=[170,615,1053,1410,180,665,1065,1410],y=[455]*4+[835]*4,weaponScale=1.5,grip=[52,7],hands=[[229,336],[674,336],[1084,170],[1574,334],[276,731],[716,624],[1160,682],[1565,816]],angles=[180,180,70,220,210,165,133,225],second=[[166,357],[620,356],[1040,170],[1540,350],[239,741],None,[1160,719],None]),
'elf-sixfold-heartwood':dict(scale=60/300,x=[199,650,1060,1470,192,662,1060,1450],y=[439]*4+[818]*4,weaponScale=1.35,grip=[31,32],hands=[[330,290],[777,290],[1218,278],[1640,275],[321,674],[617,671],[1167,666],[1690,796]],angles=[0,0,20,85,20,-25,0,87],second=[None,None,None,[1445,294],None,None,[1134,682],None]),
'elf-last-string':dict(scale=60/256,x=[200,650,1050,1490,194,660,1055,1450],y=[425]*4+[822,822,822,805],weaponScale=1.15,grip=[17,29],hands=[[337,305],[796,311],[1217,270],[1668,261],[336,698],[792,676],[1205,685],[1516,800]],angles=[180]*7+[270],second=[None,None,[1012,260],[1433,258],None,None,[1146,685],None]),
'goblin-silent-ration':dict(scale=60/296,x=[209,649,1083,1472,216,674,1078,1455],y=[410]*4+[806]*4,weaponScale=.8,grip=[35,11],hands=[[312,303],[752,303],[994,153],[1625,285],[350,684],[651,706],[1112,665],[1533,785]],angles=[175,175,190,205,200,65,175,220],second=[None]*8)
}
rows={};evidence={}
for id,c in C.items():
 im=Image.open(root/f'qa/legendary-race-art/sources/dwarf-body-{id}.png').convert('RGBA');frames=[];proof=[];s=c['scale']
 for i,name in enumerate(names):
  col,row=i%4,i//4;xs=([0,445,890,1230,1774] if id=='human-oathblade' else [0,445,890,1290,1774] if id in ['elf-last-string','goblin-silent-ration'] else [0,445,890,1260,1774]);box=(xs[col],0 if row==0 else 480,xs[col+1],480 if row==0 else im.height)
  cell=im.crop(box);cell=cell.resize((round(cell.width*s),round(cell.height*s)),Image.Resampling.NEAREST)
  xy=(round(96-(c['x'][i]-box[0])*s),round(176-(c['y'][i]-box[1])*s))
  frame=Image.new('RGBA',(256,256));frame.alpha_composite(cell,xy)
  path=f'legendary-hero-body/dwarf-{id}/{name}.png';(root/'dist'/path).parent.mkdir(parents=True,exist_ok=True);frame.save(root/'dist'/path)
  b=frame.getbbox();b=[b[0],b[1],b[2]-1,b[3]-1]
  def point(p):return [round(96+(p[0]-c['x'][i])*s),round(176+(p[1]-c['y'][i])*s)]
  hand=point(c['hands'][i]);front=[[hand[0]-4,hand[1]-4,8,8]]
  if c['second'][i]:
   q=point(c['second'][i]);front.append([q[0]-4,q[1]-4,8,8])
  pose=dict(hand=hand,grip=c['grip'],angle=c['angles'][i],front=front)
  if id=='elf-last-string' and i in [2,3]:
   q=point(c['second'][i]);a=math.radians(-pose['angle']);dx=(q[0]-hand[0])/c['weaponScale'];dy=(q[1]-hand[1])/c['weaponScale'];pose['bowPull']=[round(c['grip'][0]+dx*math.cos(a)-dy*math.sin(a),2),round(c['grip'][1]+dx*math.sin(a)+dy*math.cos(a),2)]
  frames.append(dict(id=name,file='../'+path,durationMs=180,alphaBBox=b,solidBBox=b,weaponPose=pose));proof.append(dict(id=name,sourceCrop=box,scale=s,placement=xy,alphaBBox=b,weaponPose=pose))
 rows[id]=dict(frameSize=[256,256],anchor=[96,176],facing='right',bodyReferenceBounds=[116,176],legendaryWeapon=dict(id=id,scale=c['weaponScale']),animations=dict(idle=['idle-0','idle-1'],anticipation=['anticipation'],attack=['anticipation','attack','recovery','idle-0'],recovery=['recovery'],hurt=['hurt','idle-0'],guard=['guard'],death=['death']),frames=frames);evidence[id]=proof
(root/'dist/legendary-hero-art/dwarf.js').write_text('export const DWARF_LEGENDARY_HERO_ART='+json.dumps(rows,indent=2)+';\n')
(root/'qa/legendary-race-art/dwarf-body-extraction.json').write_text(json.dumps(evidence,indent=2)+'\n')
