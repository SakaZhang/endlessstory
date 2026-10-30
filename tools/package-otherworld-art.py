from PIL import Image,ImageDraw
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
src=root/'source-art/otherworld-v081'; dst=root/'dist/otherworld-assets'
im=Image.open(src/'sentinel-cleanup.png').convert('RGBA')
# Alpha cleanup only: discard generator's translucent ambient halo. No painting.
im.putalpha(im.getchannel('A').point(lambda a:255 if a>=220 else 0))
rows=[('idle',(0,0,512,512),(290,482)),('anticipation',(512,0,1000,512),(724,482)),('attack',(910,170,1536,512),(1280,482)),('recovery',(0,512,512,1024),(300,943)),('hurt',(512,512,1000,1024),(790,956)),('death',(1000,700,1536,1024),(1300,975))]
frames=[]
for name,box,anchor in rows:
 crop=im.crop(box)
 if name=='anticipation':
  a=crop.getchannel('A'); ImageDraw.Draw(a).rectangle((400,260,488,512),fill=0);crop.putalpha(a)
 crop=crop.resize((round(crop.width*.25),round(crop.height*.25)),Image.Resampling.NEAREST)
 out=Image.new('RGBA',(192,192)); out.alpha_composite(crop,(96-round((anchor[0]-box[0])*.25),176-round((anchor[1]-box[1])*.25)))
 out.save(dst/f'sentinel-{name}.png'); b=out.getbbox(); bbox=[b[0],b[1],b[2]-1,b[3]-1]
 frames.append(dict(id=name,file=f'../otherworld-assets/sentinel-{name}.png',durationMs=180,sourceCrop=list(box),sourceAnchor=list(anchor),alphaBBox=bbox,solidBBox=bbox))
Image.open(src/'arena-original.png').resize((480,270),Image.Resampling.NEAREST).save(dst/'rift-arena.png')
row=dict(frameSize=[192,192],anchor=[96,176],facing='left',frames=frames,animations={name:[name] for name,_,_ in rows})
(root/'dist/otherworld-art.js').write_text('// Original generated art; exact marker-only routing. No world identity overrides.\nexport const OTHERWORLD_SPRITE_KEY="otherworld-rift-sentinel";\nexport const OTHERWORLD_SPRITE='+json.dumps(row,ensure_ascii=False,indent=2)+';\nexport const OTHERWORLD_BACKGROUND=Object.freeze({id:"otherworld-rift-arena",file:"../otherworld-assets/rift-arena.png",size:[480,270],baseline:203,z:0});\nexport function extendOtherworldArt(manifest){manifest.sprites[OTHERWORLD_SPRITE_KEY]=structuredClone(OTHERWORLD_SPRITE);manifest.otherworldSprite=OTHERWORLD_SPRITE_KEY;manifest.otherworldBackground=OTHERWORLD_BACKGROUND;return manifest;}\n')
