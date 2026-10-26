#!/usr/bin/env python3
"""Mechanically export the user-approved horned master bust; no new artwork."""
from pathlib import Path
import hashlib, io, json, sys
import numpy as np
from PIL import Image

root=Path(__file__).resolve().parents[1]
source=root/'art/brock-redesign/horned-master-sheet.png'
target=root/'dist/hero-portraits'
crop=(1018,128,1763,873)  # 745-square existing right-hand bust, all horns retained.
master=Image.open(source).convert('RGBA')
bust=master.crop(crop)
manifest={'version':1,'scope':'Dedicated head/bust contexts only. Do not replace full-body selection, battle, HUD or equipment-paperdoll assets.',
 'characters':{'dwarf.brock':{'name':'布洛克','race':'dwarf','facing':'right','approvedDesign':'Twin bull-horned battle helmet; user approved existing master with 没问题.',
 'source':{'file':'art/brock-redesign/horned-master-sheet.png','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'crop':list(crop),'cropFormat':'left,top,right,bottom exclusive','method':'Mechanical square crop and uniform nearest-neighbor resize only; original RGBA retained. No new image generation, repainting, alpha mask, sharpening or palette changes.'},
 'assets':{}}}}
outputs={}
for size in (96,192):
 padding=size//48
 content=size-padding*2
 out=Image.new('RGBA',(size,size),(0,0,0,0))
 scaled=bust.resize((content,content),Image.Resampling.NEAREST)
 # Paste without a mask retains original RGB/alpha exactly, including edge pixels.
 out.paste(scaled,(padding,padding))
 data=io.BytesIO();out.save(data,format='PNG');blob=data.getvalue()
 filename=f'brock-{size}.png';output_path='dist/hero-portraits/'+filename if size==96 else 'art/brock-redesign/horned-bust-192.png';outputs[output_path]=blob
 a=np.asarray(out)[:,:,3]
 bounds={}
 for name,threshold in [('alphaBBox',0),('solidBBox',128)]:
  y,x=np.where(a>threshold);bounds[name]=[int(x.min()),int(y.min()),int(x.max()),int(y.max())]
 assert all(a[0,:]==0) and all(a[-1,:]==0) and all(a[:,0]==0) and all(a[:,-1]==0)
 manifest['characters']['dwarf.brock']['assets'][str(size)]={'file':'hero-portraits/'+filename if size==96 else 'art/brock-redesign/horned-bust-192.png','size':[size,size],'contentPadding':padding,'sourceScale':content/745,'sha256':hashlib.sha256(blob).hexdigest(),**bounds}
outputs['art/brock-redesign/portrait-manifest.json']=(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
runtime={'version':1,'characters':{'dwarf.brock':{'name':'布洛克','race':'dwarf','facing':'right','usage':'dialogue/head portrait only; retain existing full-body selection/HUD/equipment assets','assets':{'96':manifest['characters']['dwarf.brock']['assets']['96']}}}}
outputs['dist/hero-portraits/manifest.json']=(json.dumps(runtime,ensure_ascii=False,indent=2)+'\n').encode()
if '--check' in sys.argv:
 for name,blob in outputs.items():assert (root/name).read_bytes()==blob, name+' is stale'
 print('PASS exact mechanical bust crop/NN export, original alpha retained, 96/192 edge margins, provenance and hashes.')
else:
 for name,blob in outputs.items():
  path=root/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(blob)
 print(json.dumps(manifest,ensure_ascii=False,indent=2))
