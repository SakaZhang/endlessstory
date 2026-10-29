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
'first-forge-oathhammer':(.27,109,424,[170,620,1070,1435,160,620,1060,1470],[424,424,424,423,839,839,839,839]),
'human-oathblade':(.24,154,433,[155,606,1040,1395,155,641,1035,1430],[431,433,433,433,841,841,841,841]),
'elf-sixfold-heartwood':(.27,96,433,[204,653,1060,1430,190,660,1060,1470],[433,433,432,433,838,840,840,840]),
'elf-last-string':(.25,85,405,[208,655,1060,1430,212,700,1075,1490],[405,405,406,406,816,816,816,816]),
'goblin-silent-ration':(.24,90,414,[200,630,1035,1380,195,670,1035,1450],[413,414,414,414,805,805,805,805])}
ANIMS={'idle':['idle-0','idle-1'],'anticipation':['anticipation'],'attack':['anticipation','attack','recovery','idle-0'],'recovery':['recovery'],'hurt':['hurt','idle-0'],'guard':['guard'],'death':['death']}
manifest={};report={}
for key,(scale,head,foot,xs,ys) in CONFIG.items():
 im=Image.open(R/f'qa/legendary-race-art/sources/goblin-{key}.png').convert('RGBA');arr=np.array(im); frames=[];metrics=[]
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
   dest=(round(96+(box[0]-xs[i])*scale),round(176+(box[1]+y0-ys[i])*scale))
   frame=Image.new('RGBA',(192,192));frame.alpha_composite(resized,dest)
   assert dest[0]>=0 and dest[1]>=0 and dest[0]+resized.width<=192 and dest[1]+resized.height<=192,(key,N[i],dest,resized.size)
   out=R/f'dist/legendary-hero-assets/goblin-{key}';out.mkdir(parents=True,exist_ok=True);frame.save(out/f'{N[i]}.png')
   bb=frame.getbbox();bb=[bb[0],bb[1],bb[2]-1,bb[3]-1]
   solid=frame.getchannel('A').point(lambda x:255 if x>128 else 0).getbbox();solid=[solid[0],solid[1],solid[2]-1,solid[3]-1]
   frames.append(dict(id=N[i],file=f'../legendary-hero-assets/goblin-{key}/{N[i]}.png',durationMs=180,alphaBBox=bb,solidBBox=solid))
   metrics.append(dict(id=N[i],sourceBox=[box[0],box[1]+y0,box[2],box[3]+y0],sourceAnchor=[xs[i],ys[i]],scale=scale,destination=dest))
 (R/f'qa/legendary-race-art/goblin-{key}-frames.json').write_text(json.dumps(frames,indent=2)+'\n')
 manifest[key]=dict(frameSize=[192,192],anchor=[96,176],facing='right',bodyReferenceBounds=[176-round((foot-head)*scale),176],animations=ANIMS,frames=frames)
 report[key]=metrics
(R/'dist/legendary-hero-art/goblin.js').write_text('// Built-in imagegen sources and provenance: qa/legendary-race-art/goblin-prompts.json\nexport const GOBLIN_LEGENDARY_HERO_ART='+json.dumps(manifest,indent=2)+';\n')
(R/'qa/legendary-race-art/goblin-extraction.json').write_text(json.dumps(report,indent=2)+'\n')
print('Extracted 40 goblin legendary frames; all source bounds fit destination without clipping.')
