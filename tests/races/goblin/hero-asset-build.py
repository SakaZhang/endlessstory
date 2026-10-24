from PIL import Image
import json,pathlib
import numpy as np
from scipy.ndimage import label
root=pathlib.Path('/workspace/scratch/81f4d6a709c0/goblin-expansion/dist/races/goblin');m=json.load(open(root/'asset-manifest.json'));im=Image.open('/workspace/scratch/81f4d6a709c0/generated_images/exec-5758f454-0891-4aed-9c01-096f7bd016a2.png').convert('RGBA');w,h=im.size
m['heroWeapons']={}
for r,weapon in enumerate(['dagger','sword']):
 tiles=[]
 for c in range(9):
  edges=[[0,234,439,653,881,1093,1392,1603,1791,2032],[0,210,424,639,880,1090,1400,1597,1790,2032]][r];edges=[round(x*w/2032) for x in edges];tile=im.crop((edges[c],round(r*h/2),edges[c+1],round((r+1)*h/2)));a=np.array(tile);labs,n=label(a[:,:,3]>10);counts=np.bincount(labs.ravel());counts[0]=0;keep=np.flatnonzero(counts>=max(counts)*.05);a[:,:,3][~np.isin(labs,keep)]=0;tile=Image.fromarray(a);bb=tile.getchannel('A').point(lambda p:255 if p>70 else 0).getbbox();tiles.append(tile.crop(bb))
 scale=min(174/max(t.width for t in tiles),160/max(t.height for t in tiles));frames=[]
 for c,tile in enumerate(tiles):
  tile=tile.resize((round(tile.width*scale),round(tile.height*scale)),Image.Resampling.NEAREST);can=Image.new('RGBA',(192,192));can.alpha_composite(tile,(96-tile.width//2,176-tile.height));name='hero-'+weapon+'-'+str(c)+'.png';can.save(root/'assets'/name);frames.append({'id':['idle-0','idle-1','ready','step','anticipation','attack','hurt','recover','death'][c],'file':'races/goblin/assets/'+name,'durationMs':120,'facing':'left','alphaBBox':can.getbbox()})
 m['heroWeapons'][weapon]={'frameSize':[192,192],'anchor':[96,176],'facing':'left','frames':frames,'animations':m['hero']['animations']}
m['hero']=m['heroWeapons']['dagger']
(root/'art.js').write_text('export const art = '+json.dumps(m,ensure_ascii=False,indent=2)+';\n');(root/'asset-manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2))
sheet=Image.new('RGBA',(192*9,192*2),(29,30,39,255))
for r,row in enumerate(m['heroWeapons'].values()):
 for c,f in enumerate(row['frames']):sheet.alpha_composite(Image.open(root.parent.parent/f['file']),(192*c,192*r))
sheet.save(root/'hero-weapons-native-proof.png')
