"""Only transparent atlas separation, nearest-neighbour uniform resize and placement.
Hand coordinates reviewed from imagegen body-only source; weapon itself stays canonical.
"""
from PIL import Image
from scipy.ndimage import label,find_objects,distance_transform_edt
import numpy as np,json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
N=['idle-0','idle-1','anticipation','attack','recovery','hurt','guard','death']
# scale, idle hood/foot, x body anchors, footlines, canonical scale/grip, primary hands, secondary hands, angles
C={
'first-forge-oathhammer':(.27,101,426,[170,620,1070,1435,160,620,1060,1470],[426,426,426,426,841,841,841,818],1.4,[43,48],[[146,320],[594,323],[1130,167],[1540,270],[260,729],[610,716],[1123,715],[1510,811]],[[245,301],[695,301],[1073,132],[1670,235],[310,752],[698,653],[1164,575],[1680,797]],[110,110,-25,107,147,83,46,100]),
'human-oathblade':(.24,146,435,[155,606,1040,1395,155,641,1035,1430],[435,435,435,435,842,842,842,842],1.65,[50,12],[[240,327],[700,327],[1027,132],[1541,318],[300,717],[738,689],[1153,697],[1524,831]],[[170,353],[630,353],[991,193],[1502,333],[276,741],[703,704],[1145,713],[1440,832]],[-155,-155,-180,-155,-120,-175,-220,-135]),
'elf-sixfold-heartwood':(.27,95,433,[204,653,1060,1430,190,660,1060,1470],[433,433,433,433,839,839,839,822],1.5,[31,35],[[310,280],[755,286],[970,174],[1599,280],[313,658],[758,674],[1159,694],[1648,801]],[[165,338],[610,338],[982,256],[1545,281],[266,678],[710,685],[1150,718],[1505,812]],[0,0,20,90,70,10,0,90]),
'elf-last-string':(.25,84,404,[208,655,1060,1430,212,700,1075,1490],[404,404,404,404,816,816,816,804],1.5,[20,31],[[314,283],[770,279],[1215,240],[1631,230],[365,645],[794,728],[1180,657],[1690,771]],[[158,307],[602,309],[1015,226],[1565,235],[170,648],[661,678],[1030,671],[1535,789]],[180,180,180,180,180,150,180,270]),
'goblin-silent-ration':(.24,78,416,[200,630,1035,1380,195,670,1035,1450],[416,416,416,416,808,808,808,806],1.15,[35,14],[[269,305],[710,312],[1141,329],[1655,268],[356,676],[549,704],[1135,671],[1452,801]],[[140,321],[575,323],[1030,326],[1612,281],[60,671],[767,656],[1110,684],[1477,790]],[-55,-55,-170,-135,-125,-65,-220,45])}
A={'idle':['idle-0','idle-1'],'anticipation':['anticipation'],'attack':['anticipation','attack','recovery','idle-0'],'recovery':['recovery'],'hurt':['hurt','idle-0'],'guard':['guard'],'death':['death']}
manifest={};qa={}
for key,(k,head,foot,xs,ys,wk,grip,hands,second,angles) in C.items():
 im=Image.open(R/f'qa/legendary-race-art/sources/goblin-{key}-body.png').convert('RGBA');arr=np.array(im);frames=[];records=[]
 for row in range(2):
  y0=round(row*im.height/2);y1=round((row+1)*im.height/2);pixels=arr[y0:y1].copy();a=pixels[:,:,3]
  labs,num=label(a>32);objs=find_objects(labs);major=sorted([(int((labs[s]==i+1).sum()),i+1,s) for i,s in enumerate(objs) if s],reverse=True)[:4];major=sorted(major,key=lambda z:(z[2][1].start+z[2][1].stop)/2)
  seeds=np.zeros(a.shape,dtype=np.uint8)
  for col,(_,lab,s) in enumerate(major):seeds[labs==lab]=col+1
  distance,indices=distance_transform_edt(seeds==0,return_indices=True);owners=seeds[tuple(indices)]
  for col in range(4):
   i=row*4+col;piece=pixels.copy();piece[:,:,3][(owners!=col+1)|(distance>12)]=0;ci=Image.fromarray(piece);box=ci.getbbox();ci=ci.crop(box);ci=ci.resize((round(ci.width*k),round(ci.height*k)),Image.Resampling.NEAREST)
   dest=(round(96+(box[0]-xs[i])*k),round(176+(box[1]+y0-ys[i])*k));frame=Image.new('RGBA',(256,256));frame.alpha_composite(ci,dest)
   out=R/f'dist/legendary-hero-body/goblin-{key}';out.mkdir(parents=True,exist_ok=True);frame.save(out/f'{N[i]}.png')
   bb=frame.getbbox();bb=[bb[0],bb[1],bb[2]-1,bb[3]-1];sb=frame.getchannel('A').point(lambda x:255 if x>128 else 0).getbbox();sb=[sb[0],sb[1],sb[2]-1,sb[3]-1]
   transform=lambda p:[round(96+(p[0]-xs[i])*k,2),round(176+(p[1]-ys[i])*k,2)]
   hand=transform(hands[i]);sh=transform(second[i]);front=[[round(x-5),round(y-5),10,10] for x,y in [hand,sh]]
   pose=dict(hand=hand,grip=grip,angle=angles[i],front=front)
   if key=='elf-last-string' and i in [2,4]:
    angle=angles[i]*np.pi/180;dx=(sh[0]-hand[0])/wk;dy=(sh[1]-hand[1])/wk
    pose['bowPull']=[round(grip[0]+dx*np.cos(angle)+dy*np.sin(angle),2),round(grip[1]-dx*np.sin(angle)+dy*np.cos(angle),2)]
   frames.append(dict(id=N[i],file=f'../legendary-hero-body/goblin-{key}/{N[i]}.png',durationMs=180,alphaBBox=bb,solidBBox=sb,weaponPose=pose));records.append(dict(sourceBox=[box[0],box[1]+y0,box[2],box[3]+y0],sourcePrimaryHand=hands[i],sourceSecondaryHand=second[i],destination=dest,scale=k))
 manifest[key]=dict(frameSize=[256,256],anchor=[96,176],facing='right',bodyReferenceBounds=[176-round((foot-head)*k),176],legendaryWeapon=dict(id=key,scale=wk),animations=A,frames=frames);qa[key]=records
(R/'dist/legendary-hero-art/goblin.js').write_text('// Canonical weapons + imagegen body-only layers. Provenance: qa/legendary-race-art/goblin-body-prompts.json\nexport const GOBLIN_LEGENDARY_HERO_ART='+json.dumps(manifest,indent=2)+';\n')
(R/'qa/legendary-race-art/goblin-body-extraction.json').write_text(json.dumps(qa,indent=2)+'\n')
print('40 body-only frames extracted; canonical weapon placements authored.')
