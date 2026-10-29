"""Technical extraction only: transparent grid cells, one NN scale per atlas, foot anchor.
Manually inspected body/feet, not weapon alpha, set each atlas's single scale.
No painting, recoloring, masking or per-frame resizing.
"""
from PIL import Image
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
names=['idle-0','idle-1','anticipation','attack','recovery','hurt','guard','death']
configs={
'first-forge-oathhammer':dict(scale=60/253,x=[195,640,1074,1468,185,675,1065,1460],y=[416]*4+[824]*4,split=[[0,450,885,1260,1774],[0,450,885,1260,1774]]),
'human-oathblade':dict(scale=60/228,x=[170,598,1053,1367,170,655,1049,1390],y=[440]*4+[829,829,829,825],split=[[0,445,870,1230,1774],[0,490,880,1220,1774]]),
'elf-sixfold-heartwood':dict(scale=60/241,x=[200,650,1065,1400,187,641,1044,1410],y=[405]*4+[813]*4,split=[[0,450,880,1220,1774],[0,450,890,1220,1774]]),
'elf-last-string':dict(scale=60/251,x=[210,654,1050,1452,210,655,1058,1450],y=[421]*4+[825,825,825,804],split=[[0,450,890,1300,1774],[0,450,890,1300,1774]]),
'goblin-silent-ration':dict(scale=60/294,x=[209,649,1083,1472,216,674,1078,1455],y=[409]*4+[806,806,806,804],split=[[0,475,900,1300,1774],[0,480,900,1300,1774]])}
rows={};evidence={}
for id,c in configs.items():
 im=Image.open(root/f'qa/legendary-race-art/sources/dwarf-{id}.png').convert('RGBA');frames=[]; proofs=[]
 for i,name in enumerate(names):
  col,row=i%4,i//4; xs=c['split'][row];box=(xs[col],0 if row==0 else 455,xs[col+1],455 if row==0 else 887)
  cell=im.crop(box); s=c['scale'];cell=cell.resize((round(cell.width*s),round(cell.height*s)),Image.Resampling.NEAREST)
  xy=(round(96-(c['x'][i]-box[0])*s),round(176-(c['y'][i]-box[1])*s))
  frame=Image.new('RGBA',(224 if id=='human-oathblade' else 192,208 if id=='elf-last-string' else 192));frame.alpha_composite(cell,xy)
  path=f'legendary-hero-assets/dwarf-{id}/{name}.png';(root/'dist'/path).parent.mkdir(parents=True,exist_ok=True);frame.save(root/'dist'/path)
  b=frame.getbbox();b=[b[0],b[1],b[2]-1,b[3]-1]
  assert b[0]>0 and b[1]>0 and b[2]<frame.width-1 and b[3]<frame.height-1,(id,name,b)
  frames.append(dict(id=name,file='../'+path,durationMs=180,alphaBBox=b,solidBBox=b));proofs.append(dict(id=name,sourceCrop=box,scale=s,placement=xy,alphaBBox=b))
 rows[id]=dict(frameSize=[224 if id=='human-oathblade' else 192,208 if id=='elf-last-string' else 192],anchor=[96,176],facing='right',bodyReferenceBounds=[116,176],animations=dict(idle=['idle-0','idle-1'],anticipation=['anticipation'],attack=['anticipation','attack','recovery','idle-0'],recovery=['recovery'],hurt=['hurt','idle-0'],guard=['guard'],death=['death']),frames=frames)
 (root/f'qa/legendary-race-art/dwarf-{id}-frames.json').write_text(json.dumps(frames,indent=2)+'\n'); evidence[id]=proofs
(root/'dist/legendary-hero-art/dwarf.js').write_text('export const DWARF_LEGENDARY_HERO_ART='+json.dumps(rows,indent=2)+';\n')
(root/'qa/legendary-race-art/dwarf-extraction.json').write_text(json.dumps(evidence,indent=2)+'\n')
