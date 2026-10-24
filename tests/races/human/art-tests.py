from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parents[3]/'dist/races/human/assets';m=json.load(open(root/'lifecycle-manifest.json'));assert len(m)==43
hashes=[]
for id,sprite in m.items():
 assert sprite['frameSize']==[192,192] and sprite['anchor']==[96,176]
 assert set(sprite['animations'])=={'idle','anticipation','attack','recovery','hurt','death'}
 own=[]
 for f in sprite['frames']:
  im=Image.open(root/Path(f['file']).name);assert im.size==(192,192);assert im.mode=='RGBA';b=im.getbbox();assert b and 0<b[0]<b[2]<192 and 0<b[1]<b[3]<=176
  own.append(hashlib.sha256(im.tobytes()).hexdigest())
 assert len(set(own))==6,id
 hashes.extend(own)
assert len(set(hashes))==258
for weapon in ['sword_shield','greatsword']:
 s=json.load(open(root/(weapon+'-manifest.json')));assert len(s['frames'])==8
 for f in s['frames']:assert Image.open(root/Path(f['file']).name).size==(192,192)
print('PASS 43 distinct identities / 258 distinct lifecycle rasters; 16 hero weapon frames; native 192x192 anchor and alpha bounds')
