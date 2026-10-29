"""Generated atlas segmentation, uniform nearest-neighbour scaling and anchor placement only.
Transparent connected-component separation handles generated figures crossing nominal grid gutters.
No character painting, recoloring, per-frame scale, or pose synthesis.
"""
from PIL import Image
from scipy.ndimage import label,find_objects,distance_transform_edt
import numpy as np
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
N=['idle-0','idle-1','anticipation','attack','recovery','hurt','guard','death']
CONFIG={
'first-forge-oathhammer':(.27,81,429,[210,650,1070,1470,205,670,1040,1490],[429,428,429,427,844,847,846,864]),
'human-oathblade':(.286,78,406,[195,635,1080,1460,195,690,1070,1520],[406,404,404,406,821,821,821,839]),
'elf-sixfold-heartwood':(.274,80,423,[190,635,1040,1400,190,650,1040,1495],[423,423,423,423,844,844,845,839]),
'elf-last-string':(.276,67,407,[195,635,1050,1475,205,650,1040,1520],[407,407,407,407,830,830,830,828]),
'goblin-silent-ration':(.272,64,409,[225,660,1090,1470,225,680,1075,1510],[409,409,409,409,826,824,826,825])}
ANIMS={'idle':['idle-0','idle-1'],'anticipation':['anticipation'],'attack':['anticipation','attack','recovery','idle-0'],'recovery':['recovery'],'hurt':['hurt','idle-0'],'guard':['guard'],'death':['death']}
manifest={};report={}
for key,(scale,head,foot,xs,ys) in CONFIG.items():
 im=Image.open(R/f'qa/legendary-race-art/sources/ashen-{key}.png').convert('RGBA');arr=np.array(im); frames=[];metrics=[]
 for row in range(2):
  y0=round(row*im.height/2);y1=round((row+1)*im.height/2); pixels=arr[y0:y1].copy();a=pixels[:,:,3]
  labs,num=label(a>32);objs=find_objects(labs)
  major=sorted([(int((labs[s]==i+1).sum()),i+1,s) for i,s in enumerate(objs) if s],reverse=True)[:4]
  major=sorted(major,key=lambda z:(z[2][1].start+z[2][1].stop)/2)
  # Associate disconnected transparent-edge fragments / bow arrow with nearest main figure.
  seeds=np.zeros(a.shape,dtype=np.uint8)
  for col,(_,lab,s) in enumerate(major):seeds[labs==lab]=col+1
  if key=='elf-last-string' and row==0:
   for lab,s in enumerate(objs,1):
    if s and s[1].start>1600 and (labs[s]==lab).sum()>500: seeds[labs==lab]=4
  distance,indices=distance_transform_edt(seeds==0,return_indices=True);owners=seeds[tuple(indices)]
  for col in range(4):
   i=row*4+col; piece=pixels.copy();piece[:,:,3][(owners!=col+1) | (distance>12)]=0
   ci=Image.fromarray(piece);box=ci.getbbox();ci=ci.crop(box)
   resized=ci.resize((round(ci.width*scale),round(ci.height*scale)),Image.Resampling.NEAREST)
   dest=(round(128+(box[0]-xs[i])*scale),round(176+(box[1]+y0-ys[i])*scale))
   frame=Image.new('RGBA',(256,192));frame.alpha_composite(resized,dest)
   assert dest[0]>=0 and dest[1]>=0 and dest[0]+resized.width<=256 and dest[1]+resized.height<=192,(key,N[i],dest,resized.size)
   out=R/f'dist/legendary-hero-assets/ashen-{key}';out.mkdir(parents=True,exist_ok=True);frame.save(out/f'{N[i]}.png')
   bb=frame.getbbox();bb=[bb[0],bb[1],bb[2]-1,bb[3]-1]
   solid=frame.getchannel('A').point(lambda x:255 if x>128 else 0).getbbox();solid=[solid[0],solid[1],solid[2]-1,solid[3]-1]
   frames.append(dict(id=N[i],file=f'../legendary-hero-assets/ashen-{key}/{N[i]}.png',durationMs=180,alphaBBox=bb,solidBBox=solid))
   metrics.append(dict(id=N[i],sourceBox=[box[0],box[1]+y0,box[2],box[3]+y0],sourceAnchor=[xs[i],ys[i]],scale=scale,destination=dest))
 (R/f'qa/legendary-race-art/ashen-{key}-frames.json').write_text(json.dumps(frames,indent=2)+'\n')
 manifest[key]=dict(frameSize=[256,192],anchor=[128,176],facing='right',bodyReferenceBounds=[176-round((foot-head)*scale),176],animations=ANIMS,frames=frames)
 report[key]=metrics
(R/'dist/legendary-hero-art/ashen.js').write_text('// Built-in imagegen sources and provenance: qa/legendary-race-art/ashen-prompts.json\nexport const ASHEN_LEGENDARY_HERO_ART='+json.dumps(manifest,indent=2)+';\n')
(R/'qa/legendary-race-art/ashen-extraction.json').write_text(json.dumps(report,indent=2)+'\n')
print('Extracted 40 ashen legendary frames; all source bounds fit destination without clipping.')
