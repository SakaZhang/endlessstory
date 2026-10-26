#!/usr/bin/env python3
"""Mechanical packaging of imagegen-authored cutouts; never draws/repaints art.

Each source atlas has nine disconnected opaque subjects. Their rectangular
bounds occasionally overlap, so nearest connected-alpha ownership separates
adjacent cutouts while retaining the original RGBA pixels, including edge alpha.
Then one fixed uniform affine scale per atlas and an inspected foot origin
place each pose on the existing 192x192 canvas. No pose/body-part compositing.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import label, find_objects, distance_transform_edt

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'art/brock-redesign'
DEST = ROOT / 'dist/battle-assets'
OUT = ROOT / 'qa/brock-redesign'
OUT.mkdir(parents=True, exist_ok=True)
MANIFEST = DEST / 'manifest.json'
manifest = json.loads(MANIFEST.read_text())
configs = {
 'axe': dict(key='dwarf', target=60, crownY=55, anchors=[(172,403),(583,404),(1011,404),(185,829),(560,829),(966,833),(171,1224),(596,1222),(983,1209)], ids=['idle-0','idle-1','anticipation','windup','strike','followthrough','recovery','hurt','death']),
 'hammer': dict(key='dwarf-hammer', target=63, crownY=41, anchors=[(171,405),(584,407),(1013,407),(185,832),(558,832),(985,836),(172,1227),(596,1223),(984,1211)], ids=['idle',None,'anticipation','windup','strike','followthrough','recovery','hurt','death']),
 'neutral': dict(key='hero-neutral', target=60, crownY=55, anchors=[(186,407),(600,407),(1018,407),(183,823),(590,823),(1017,823),(185,1217),(615,1217),(1007,1214)], ids=['idle',None,'anticipation','windup','strike','followthrough','recovery','hurt','death']),
}

def bbox(a, threshold=0):
 y, x = np.where(a[:,:,3] > threshold)
 return [int(x.min()),int(y.min()),int(x.max()),int(y.max())]

evidence = {'operation':'Mechanical alpha-component slicing and fixed uniform nearest-neighbor placement only; original RGB and alpha preserved inside each cutout. No artwork drawing or body-part compositing.', 'sources':{}, 'frames':[]}
for family,cfg in configs.items():
 source = SOURCE / ('horned-'+family+'-atlas.png')
 rgba = np.asarray(Image.open(source).convert('RGBA'))
 labels,n = label(rgba[:,:,3]>32)
 components=[]
 for i,sl in enumerate(find_objects(labels),1):
  if sl is not None and (labels[sl]==i).sum()>1000:
   ys,xs=sl
   components.append((i,(xs.start,ys.start,xs.stop,ys.stop)))
 assert len(components)==9,(family,len(components))
 # Stable row-major order, based on lower edge rather than raised weapon tips.
 components.sort(key=lambda c: (round((c[1][3]-400)/420),c[1][0]))
 core=np.zeros(labels.shape,dtype=np.int16)
 for index,(component,_) in enumerate(components,1): core[labels==component]=index
 nearest=distance_transform_edt(core==0,return_distances=False,return_indices=True)
 owner=core[tuple(nearest)]
 idle=components[0][1]
 scale=cfg['target']/(cfg['anchors'][0][1]-cfg['crownY'])
 sprite=manifest['sprites'][cfg['key']]
 old={f['id']:f for f in sprite['frames']}
 frames=[]
 for index,((component,box),anchor,frame_id) in enumerate(zip(components,cfg['anchors'],cfg['ids']),1):
  if frame_id is None: continue
  x0,y0,x1,y1=box
  crop=[max(0,x0-2),max(0,y0-2),min(rgba.shape[1],x1+2),min(rgba.shape[0],y1+2)]
  l,t,r,b=crop
  cut=rgba[t:b,l:r].copy()
  # Slicing selector excludes only pixels belonging to a different cutout.
  cut[owner[t:b,l:r]!=index]=0
  image=Image.fromarray(cut,'RGBA')
  inverse=(1/scale,0,anchor[0]-l-96/scale,0,1/scale,anchor[1]-t-176/scale)
  result=image.transform((192,192),Image.Transform.AFFINE,inverse,Image.Resampling.NEAREST)
  if family=='neutral': file='hero-neutral-idle.png' if frame_id=='idle' else 'sprites/hero-neutral-'+frame_id+'.png'
  else: file='sprites/'+cfg['key']+'-'+frame_id+'.png'
  result.save(DEST/file)
  arr=np.asarray(result)
  frame={**old.get(frame_id,{}),'id':frame_id,'file':file,'sourceCrop':crop,'sourceAnchor':list(anchor),'sourceScale':scale,'alphaBBox':bbox(arr),'solidBBox':bbox(arr,128),'durationMs':old.get(frame_id,{}).get('durationMs',650 if frame_id=='death' else 120)}
  frame.pop('uniformSourceScale',None)
  frames.append(frame)
  evidence['frames'].append({'family':family,**frame})
 sprite['frames']=frames
 sprite['uniformSourceScale']=scale
 sprite['sourceAtlas']='brock-redesign-horned-'+family+'-atlas'
 sprite['bodyReferenceBounds']=[176-cfg['target'],175]
 sprite['headY']=frames[0]['solidBBox'][1]
 sprite['healthBarAnchor']=[96,sprite['headY']-9]
 if family=='axe':
  sprite['portraitCrop']=[68,110,126,158]
  sprite['portraitCropFormat']='left,top,right,bottom exclusive'
 if family=='neutral':
  sprite['animations']={'idle':['idle'],'attack':['anticipation','windup','strike','followthrough','recovery'],'hurt':['hurt','idle'],'death':['death']}
  sprite['portraitCrop']=[frames[0]['solidBBox'][0]-1,frames[0]['solidBBox'][1]-1,frames[0]['solidBBox'][2]+2,frames[0]['solidBBox'][3]+2]
  sprite['appearance']='neutral'
  sprite['weaponFamily']=None
 evidence['sources'][family]={'path':str(source.relative_to(ROOT)),'size':list(Image.open(source).size),'uniformScale':scale,'bodyIdleTarget':cfg['target'],'sourceCrownYExcludingHorns':cfg['crownY'],'components':components,'sourceAnchors':cfg['anchors']}

manifest['brockVisualRedesign']={'version':1,'source':'Built-in image generation; approved master design; original sources and prompts retained in art/brock-redesign','scope':'Dwarf visual assets and native/neutral animation frames only; no game rules or save changes','frameSize':[192,192],'anchor':[96,176],'facing':'right'}
MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(OUT/'packaging-evidence.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
# Review sheet: unchanged exported frame pixels, nearest-neighbor 3x preview.
sheet=Image.new('RGBA',(9*245,3*300),'#14282c');draw=ImageDraw.Draw(sheet)
for row,(family,cfg) in enumerate(configs.items()):
 for col,f in enumerate(manifest['sprites'][cfg['key']]['frames']):
  im=Image.open(DEST/f['file']);b=f['alphaBBox'];cut=im.crop((b[0],b[1],b[2]+1,b[3]+1));cut=cut.resize((cut.width*3,cut.height*3),Image.Resampling.NEAREST)
  x=col*245;y=row*300
  sheet.alpha_composite(cut,(x+(245-cut.width)//2,y+245-cut.height))
  draw.text((x+8,y+12),family+' / '+f['id'],fill='#ead3a6')
  draw.line((x+8,y+246,x+237,y+246),fill='#44616a')
sheet.convert('RGB').save(OUT/'all-25-frames-3x.png')
native=Image.new('RGBA',(9*204,3*222),'#14282c');draw=ImageDraw.Draw(native)
for row,(_,cfg) in enumerate(configs.items()):
 for col,f in enumerate(manifest['sprites'][cfg['key']]['frames']):
  x,y=col*204+6,row*222+22
  draw.rectangle((x,y,x+191,y+191),outline='#29444a')
  draw.line((x,y+176,x+191,y+176),fill='#537179')
  draw.line((x+96,y+168,x+96,y+183),fill='#537179')
  native.alpha_composite(Image.open(DEST/f['file']),(x,y))
  draw.text((x,y-16),cfg['key']+' '+f['id'],fill='#ead3a6')
native.convert('RGB').save(OUT/'all-25-runtime-192.png')
print(json.dumps({'frames':len(evidence['frames']),'output':str(OUT),'scales':{k:v['uniformScale'] for k,v in evidence['sources'].items()}},indent=2))
