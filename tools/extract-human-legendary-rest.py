"""Source-authoring is imagegen. This step only crops, scales nearest-neighbor and places anchors."""
from PIL import Image
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
names=['idle-0','idle-1','anticipation','attack','recovery','hurt','guard','death']
specs={
 'human-oathblade':('bb9f3def-58ef-46ce-8f80-c1a440ad14b6',.387,[0,450,887,1250,1774],[200,640,1090,1460,190,640,1090,1460],[455,840]),
 'goblin-silent-ration':('73dd720f-549b-43b8-9ccd-97a1f1287c88',.318,[0,443,887,1290,1774],[214,660,1090,1500,190,650,1100,1500],[430,835]),
 'elf-sixfold-heartwood':('503dbbf1-cfc5-4d40-9ed2-e599346b5131',.289,[0,420,840,1190,1774],[205,620,1015,1380,205,640,1000,1440],[443,824]),
 'elf-last-string':('b94fceb1-afe0-4ba1-9c5a-b1795a4e1e1d',.303,[0,443,887,1330,1774],[200,640,1090,1520,205,645,1090,1530],[428,840])
}
entries={}
for id,(file,scale,xs,centers,baselines) in specs.items():
 source=root.parent/'generated_images'/('exec-'+file+'.png');im=Image.open(source);out=root/'dist/legendary-hero-assets'/('human-'+id);out.mkdir(exist_ok=True)
 im.save(root/'qa/legendary-race-art/sources'/('human-'+id+'.png'))
 frames=[]
 size=[256,192] if id in ['human-oathblade','elf-sixfold-heartwood'] else [192,192]
 for i,name in enumerate(names):
  col,row=i%4,i//4;split=480 if id=='human-oathblade' else 450;box=(xs[col],0 if row==0 else split,xs[col+1],split if row==0 else im.height)
  if id=='elf-last-string' and i==6: box=(887,split,1250,im.height)
  cell=im.crop(box);cell=cell.resize((round(cell.width*scale),round(cell.height*scale)),Image.Resampling.NEAREST)
  frame=Image.new('RGBA',tuple(size));frame.alpha_composite(cell,(round(96-(centers[i]-box[0])*scale),round(176-(baselines[row]-box[1])*scale)))
  frame.save(out/(name+'.png'));b=frame.getbbox();bounds=[b[0],b[1],b[2]-1,b[3]-1]
  solid=frame.getchannel('A').point(lambda a:255 if a>=64 else 0).getbbox();solid=[solid[0],solid[1],solid[2]-1,solid[3]-1]
  frames.append(dict(id=name,file='../legendary-hero-assets/human-'+id+'/'+name+'.png',durationMs=180,alphaBBox=bounds,solidBBox=solid))
 entries[id]=dict(frameSize=size,anchor=[96,176],facing='right',bodyReferenceBounds=[86,176],frames=frames,animations=dict(idle=names[:2],anticipation=['anticipation'],attack=['anticipation','attack','recovery','idle-0'],recovery=['recovery'],hurt=['hurt','idle-0'],guard=['guard'],death=['death']))
# Keep initial hammer source and extraction independently reproducible.
hammer=json.load(open(root/'qa/legendary-race-art/human-hammer-frames.json'))
entries['first-forge-oathhammer']={**entries['human-oathblade'],'frames':hammer,'frameSize':[192,192]}
(root/'dist/legendary-hero-art/human.js').write_text('export const HUMAN_LEGENDARY_HERO_ART='+json.dumps(entries,indent=2)+';\n')
