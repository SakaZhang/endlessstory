from PIL import Image, ImageDraw
from pathlib import Path
out=Path('dist/skill-assets');out.mkdir(exist_ok=True)
steel='#b8d6e0';light='#f1ead3';dark='#344c61';gold='#d7a94e';fire='#e76b37';red='#a6362d';blue='#62b9ca';stone='#788795'
def poly(d,p,c):d.polygon(p,fill=c)
def shield(d,x=16,y=16,c=steel):
 poly(d,[(x-8,y-9),(x,y-11),(x+8,y-9),(x+7,y+4),(x,y+11),(x-7,y+4)],dark)
 poly(d,[(x-6,y-7),(x,y-9),(x+6,y-7),(x+5,y+3),(x,y+8),(x-5,y+3)],c)
 d.line([(x,y-7),(x,y+6)],fill=light,width=2)
def axe(d,x=16,y=16):
 d.line([(x+6,y-10),(x-6,y+11)],fill='#795634',width=4);d.line([(x+5,y-10),(x-7,y+11)],fill=gold,width=1)
 poly(d,[(x+3,y-10),(x-6,y-10),(x-10,y-3),(x-6,y+1),(x+2,y-4),(x+8,y-3),(x+10,y-7)],steel);d.line([(x-6,y-9),(x-9,y-3),(x-6,y)],fill=light,width=1)
def flame(d,x,y):
 poly(d,[(x,y-10),(x+3,y-4),(x+5,y-7),(x+8,y+2),(x+5,y+7),(x-5,y+7),(x-8,y+2),(x-3,y-5)],red)
 poly(d,[(x,y-7),(x+2,y),(x+4,y-2),(x+5,y+3),(x+2,y+6),(x-3,y+5),(x-4,y+1)],fire)
 poly(d,[(x,y-2),(x+2,y+3),(x,y+5),(x-2,y+3)],'#f9d77c')
def anvil(d,x=16,y=18):
 poly(d,[(x-12,y-5),(x+11,y-5),(x+8,y),(x+2,y),(x+2,y+5),(x+8,y+7),(x+8,y+9),(x-9,y+9),(x-9,y+7),(x-4,y+5),(x-4,y)],dark)
 poly(d,[(x-12,y-6),(x+11,y-6),(x+7,y-2),(x-6,y-2)],steel);d.line([(x-11,y-6),(x+10,y-6)],fill=light,width=1)
ids=['ore_rally','crag_verdict','bellows_ward','stone_anchor','shield_relay','prospectors_mark','ember_temper','anvil_balance','patient_craft']
for idx,key in enumerate(ids):
 im=Image.new('RGBA',(32,32));d=ImageDraw.Draw(im)
 # restrained broken pixel halo, preserving transparent corners of existing assets
 for x,y in [(4,11),(6,5),(23,4),(27,10),(26,24),(20,28),(6,25),(3,19)]:d.rectangle((x,y,x+1,y+1),fill=dark)
 if key=='ore_rally':
  poly(d,[(5,26),(8,13),(13,8),(18,14),(23,9),(28,26)],stone);poly(d,[(10,24),(13,12),(16,17),(17,24)],gold);d.line([(20,5),(20,18)],fill=gold,width=2);poly(d,[(20,5),(29,7),(20,12)],red)
 elif key=='crag_verdict':
  poly(d,[(5,26),(8,20),(15,18),(26,24),(25,28)],stone);axe(d,17,13);d.line([(15,22),(13,24),(17,26),(15,29)],fill=dark,width=2)
 elif key=='bellows_ward':
  shield(d,16,17,'#6b7884');flame(d,16,15);d.rectangle((4,13,7,20),fill=gold);d.rectangle((25,13,28,20),fill=gold)
 elif key=='stone_anchor':
  poly(d,[(3,27),(9,12),(14,8),(19,14),(23,11),(29,27)],stone);d.line([(16,6),(16,25),(8,21)],fill=steel,width=3);d.line([(16,25),(24,21)],fill=steel,width=3);d.rectangle((13,4,19,7),fill=gold)
 elif key=='shield_relay':
  shield(d,12,16,blue);poly(d,[(21,7),(28,12),(23,15),(24,12),(20,11)],gold);poly(d,[(22,24),(27,18),(26,24),(19,28)],gold)
 elif key=='prospectors_mark':
  poly(d,[(5,25),(7,9),(19,5),(27,14),(24,27)],stone);d.line([(10,11),(23,23)],fill=red,width=3);d.line([(21,9),(11,25)],fill=red,width=3);d.rectangle((14,14,18,18),fill=gold)
 elif key=='ember_temper':
  flame(d,16,13);anvil(d,16,20);d.rectangle((9,15,22,17),fill=gold)
 elif key=='anvil_balance':
  anvil(d,16,19);d.line([(16,4),(16,12)],fill=gold,width=2);d.line([(7,7),(25,7)],fill=gold,width=1);poly(d,[(5,13),(10,13),(8,8)],steel);poly(d,[(22,13),(27,13),(24,8)],steel)
 elif key=='patient_craft':
  poly(d,[(9,4),(23,4),(23,7),(19,12),(17,16),(21,21),(23,24),(23,28),(9,28),(9,24),(13,19),(15,16),(11,10),(9,7)],dark);d.rectangle((9,4,23,6),fill=gold);d.rectangle((9,26,23,28),fill=gold);poly(d,[(12,8),(20,8),(16,14)],steel);poly(d,[(16,19),(21,25),(11,25)],gold);d.point((16,16),fill=light)
 im.save(out/(key+'.png'))
