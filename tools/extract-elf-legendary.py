"""Technical crop, common nearest-neighbor scale, and foot-anchor placement only."""
from PIL import Image
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
names=['idle-0','idle-1','anticipation','attack','recovery','hurt','guard','death']
# Each atlas: filename, anatomical idle hair-to-sole pixels, manually inspected full-sprite crops, body X anchors, sole Y anchors.
data={
'first-forge-oathhammer':('',(134,405),[(90,120,410,425),(505,120,815,425),(865,40,1160,425),(1250,150,1770,425),(60,535,425,842),(505,460,880,835),(895,490,1180,835),(1220,680,1755,850)],[204,624,1036,1410,205,652,1035,1485],[405,405,405,405,815,815,815,815]),
'human-oathblade':('-v2',(165,398),[(145,155,405,415),(590,155,850,415),(945,55,1180,410),(1340,190,1755,410),(100,590,410,830),(545,600,875,830),(965,495,1170,830),(1315,710,1760,830)],[222,665,1097,1470,200,665,1075,1500],[398,398,398,398,818,818,818,807]),
'elf-sixfold-heartwood':('',(98,397),[(75,35,365,415),(520,35,795,415),(890,20,1200,415),(1280,115,1750,415),(70,485,415,815),(490,455,825,815),(900,450,1200,815),(1230,660,1745,835)],[210,650,1080,1440,221,680,1050,1470],[397,397,397,397,796,796,796,786]),
'elf-last-string':('-v2',(160,404),[(125,150,350,415),(560,150,800,415),(940,130,1235,415),(1360,135,1760,415),(100,540,350,800),(550,550,800,800),(970,515,1215,800),(1340,660,1725,800)],[225,665,1060,1480,215,665,1072,1520],[404,404,404,404,790,790,790,775]),
'goblin-silent-ration':('',(132,439),[(90,120,380,450),(540,120,820,465),(920,145,1240,460),(1290,165,1755,465),(70,500,380,835),(510,505,825,840),(905,515,1220,835),(1310,660,1765,880)],[225,675,1085,1465,240,665,1075,1510],[439,439,439,439,821,821,821,855])}
entries={};report={}
for ident,(suffix,(head,feet),boxes,xs,ys) in data.items():
 src=root/f'qa/legendary-race-art/sources/elf-{ident}{suffix}.png'; im=Image.open(src).convert('RGBA');scale=98/(feet-head+1);frames=[]
 folder=root/f'dist/legendary-hero-assets/elf-{ident}';folder.mkdir(parents=True,exist_ok=True)
 for name,box,x,y in zip(names,boxes,xs,ys):
  crop=im.crop(box);crop=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.NEAREST)
  frame=Image.new('RGBA',(256,192));px=round(96+(box[0]-x)*scale);py=round(176+(box[1]-y)*scale)
  assert px>=0 and py>=0 and px+crop.width<=256 and py+crop.height<=192,(ident,name,px,py,crop.size)
  frame.alpha_composite(crop,(px,py));frame.save(folder/f'{name}.png');bb=frame.getbbox();bb=[bb[0],bb[1],bb[2]-1,bb[3]-1]
  frames.append(dict(id=name,file=f'../legendary-hero-assets/elf-{ident}/{name}.png',durationMs=180,alphaBBox=bb,solidBBox=bb))
 (root/f'qa/legendary-race-art/elf-{ident}-frames.json').write_text(json.dumps(frames,indent=2)+'\n')
 entries[ident]=dict(frameSize=[256,192],anchor=[96,176],facing='right',bodyReferenceBounds=[79,176],animations=dict(idle=names[:2],anticipation=['anticipation'],attack=['anticipation','attack','recovery','idle-0'],recovery=['recovery'],hurt=['hurt','idle-0'],guard=['guard'],death=['death']),frames=frames)
 report[ident]=dict(source=str(src.relative_to(root)),sourceSize=list(im.size),uniformScale=scale,idleBodySource=[head,feet],cropBoxes=boxes,bodyAnchorsX=xs,soleAnchorsY=ys)
(root/'dist/legendary-hero-art/elf.js').write_text('export const ELF_LEGENDARY_HERO_ART='+json.dumps(entries,indent=2)+';\n')
(root/'qa/legendary-race-art/elf-extraction.json').write_text(json.dumps(report,indent=2)+'\n')
