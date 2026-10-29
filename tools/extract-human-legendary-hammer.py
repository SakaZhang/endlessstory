"""Only atlas extraction, nearest-neighbor resize and anchor placement; no painted pixels."""
from PIL import Image
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
im=Image.open(root/'qa/legendary-race-art/sources/human-first-forge-oathhammer.png')
names=['idle-0','idle-1','anticipation','attack','recovery','hurt','guard','death']
frames=[]
for i,name in enumerate(names):
 col,row=i%4,i//4
 box=(round(col*im.width/4),round(row*im.height/2),round((col+1)*im.width/4),round((row+1)*im.height/2))
 cell=im.crop(box); scale=.37
 cell=cell.resize((round(cell.width*scale),round(cell.height*scale)),Image.Resampling.NEAREST)
 frame=Image.new('RGBA',(192,192));frame.alpha_composite(cell,(round(96-192*scale),round(176-(414 if row==0 else 387)*scale)))
 path=f'legendary-hero-assets/human-first-forge-oathhammer/{name}.png';frame.save(root/'dist'/path)
 solid=frame.getchannel('A').point(lambda a:255 if a>=64 else 0).getbbox();solid=[solid[0],solid[1],solid[2]-1,solid[3]-1]
 bounds=frame.getbbox(); bounds=[bounds[0],bounds[1],bounds[2]-1,bounds[3]-1]
 frames.append(dict(id=name,file='../'+path,durationMs=180,alphaBBox=bounds,solidBBox=solid))
(root/'qa/legendary-race-art/human-hammer-frames.json').write_text(json.dumps(frames,indent=2)+'\n')
