from PIL import Image
import pathlib,json,numpy as np
root=pathlib.Path('/workspace/scratch/81f4d6a709c0/goblin-expansion/dist/races/goblin'); src=pathlib.Path('/workspace/scratch/81f4d6a709c0/generated_images'); out=root/'assets';out.mkdir(exist_ok=True)
files=['978b344c-caf7-45f6-982b-f78f878eab61','cf6674f7-29c2-4d8e-8abb-def3efac2dda','6e5636c2-839c-47cf-a430-73a244c13a8f','46497eb8-dce8-4e22-add5-e409b0b7abc1','2248bfaa-d2cd-43e7-b783-6cba568e3229','79be6794-a642-4e28-b3a8-0cc362903235','372de008-3015-4369-9790-96d999743f37']
ids=[['hero','a01.normal.1','a01.normal.2','a04.normal.1','a01.normal.3','a03.normal.2'],['a03.boss','a06.boss','a09.boss','a08.normal.1','a09.normal.2','a08.normal.2'],['a01.elite','a02.normal.1','a02.normal.2','a02.normal.3','a02.elite','a03.normal.1'],['a03.normal.3','a03.elite','a04.normal.2','a04.normal.3','a04.elite','a05.normal.1'],['a05.normal.2','a05.normal.3','a05.elite','a06.normal.1','a06.normal.2','a06.normal.3'],['a06.elite','a07.normal.1','a07.normal.2','a07.normal.3','a07.elite','a08.normal.3'],['a08.elite','a09.normal.1','a09.normal.3','a09.elite','a10.normal.1','a10.normal.2','a10.normal.3','a10.elite']]
manifest={'hero':None,'monsters':{},'areas':{},'equipment':{},'skills':{},'materials':{},'camp':'battle-assets/scenes/camp-goblin.png'}
# Detect nearby empty scanlines to avoid trimming limbs at nonuniform generated row spacing.
for fi,(f,group) in enumerate(zip(files,ids)):
 im=Image.open(src/('exec-'+f+'.png')).convert('RGBA'); w,h=im.size; arr=np.array(im)[:,:,3]; edges=[0]
 for r in range(1,len(group)):
  center=round(h*r/len(group)); radius=round(h/len(group)*.22); projection=(arr[max(0,center-radius):min(h,center+radius)]>50).sum(axis=1)
  edges.append(max(0,center-radius)+int(np.argmin(projection)))
 edges.append(h)
 edges=[[0,194,351,515,638,835,1086],[0,227,410,632,802,954,1086],[0,194,339,521,689,886,1086],[0,181,365,558,707,906,1086],[0,169,354,535,688,869,1086],[0,170,345,520,683,872,1086],[0,145,291,418,553,688,800,924,1122]][fi]
 for row,id in enumerate(group):
  tiles=[]
  xedges=[0]
  for c in range(1,8):
   center=round(w*c/8);radius=25;proj=(arr[edges[row]:edges[row+1],center-radius:center+radius]>70).sum(axis=0);xedges.append(center-radius+int(np.argmin(proj)))
  xedges.append(w)
  if id=='hero':xedges=[round(w*c/8) for c in range(9)]
  for col in range(8):
   box=(xedges[col],edges[row],xedges[col+1],edges[row+1]);tile=im.crop(box);bbox=tile.getchannel('A').point(lambda p:255 if p>70 else 0).getbbox();tile=tile.crop(bbox) if bbox else tile;tiles.append((tile,box))
  scale=min(164/max(t[0].width for t in tiles),160/max(t[0].height for t in tiles)); frames=[]
  for col,(tile,box) in enumerate(tiles):
   tile=tile.resize((max(1,round(tile.width*scale)),max(1,round(tile.height*scale))),Image.Resampling.NEAREST);canvas=Image.new('RGBA',(192,192));canvas.alpha_composite(tile,(96-tile.width//2,176-tile.height));name=id.replace('.','-')+f'-{col}.png';canvas.save(out/name)
   frames.append({'id':['idle-0','idle-1','ready','step','anticipation','attack','hurt','recover'][col],'file':'races/goblin/assets/'+name,'durationMs':120,'facing':'left','alphaBBox':canvas.getbbox(),'sourceCrop':box})
  rowDef={'frameSize':[192,192],'anchor':[96,176],'facing':'left','frames':frames,'sourceAtlas':f,'sourceRow':row,'animations':{'idle':['idle-0','idle-1'],'attack':['anticipation','attack','recover'],'hurt':['hurt'],'move':['ready','step'],'anticipation':['anticipation'],'recovery':['recover'],'death':['death']}}
  if id=='hero':manifest['hero']=rowDef
  else:manifest['monsters']['goblin.'+id]=rowDef
im=Image.open(src/'exec-f33d6487-4d78-4025-af5c-5916d1ea7ada.png').convert('RGB');w,h=im.size
for i in range(10):
 c=i%2;r=i//2;bounds=[(0,180),(183,364),(367,560),(563,747),(750,941)];tile=im.crop((c*836+3,bounds[r][0]+2,(c+1)*836-3,bounds[r][1]-2))
 edits={5:'02e176df-6127-49d4-9534-cb6b3b8e8a59',8:'eb37cac7-921a-4fff-bf61-4d9f41fc3f78',9:'befb1066-6ed8-4bc9-9619-00a8dbedb93b'}
 if i in edits:tile=Image.open(src/('exec-'+edits[i]+'.png')).convert('RGB')
 tile=tile.resize((480,270),Image.Resampling.NEAREST);name=f'area-{i+1:02}.png';tile.save(out/name);manifest['areas'][f'goblin.a{i+1:02}']={'file':'races/goblin/assets/'+name,'width':480,'height':270,'baselineY':203}
(root/'art-base.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
icons=[]
for file,rows in [('cc550731-80e5-446a-86cb-539c4213e5ad',6),('f63eb6ef-7392-45c3-b7a9-16cd79497486',7)]:
 im=Image.open(src/('exec-'+file+'.png')).convert('RGBA');w,h=im.size;group=[]
 yedges=[0,207,382,559,741,896,1087] if rows==6 else [0,184,352,521,687,844,1009,1173]
 for r in range(rows):
  cols=9 if rows==7 and r==6 else 8
  for c in range(cols):
   tile=im.crop((round(c*w/cols),yedges[r],round((c+1)*w/cols),yedges[r+1]));bbox=tile.getchannel('A').point(lambda p:255 if p>70 else 0).getbbox();tile=tile.crop(bbox) if bbox else tile;scale=min(42/tile.width,42/tile.height);tile=tile.resize((max(1,round(tile.width*scale)),max(1,round(tile.height*scale))),Image.Resampling.NEAREST);can=Image.new('RGBA',(48,48));can.alpha_composite(tile,((48-tile.width)//2,(48-tile.height)//2));group.append(can)
 icons.append(group)
def icon(key,kind,atlas,n):
 name='icon-'+key.replace('.','-')+'.png';icons[atlas][n].save(out/name);manifest[kind][key]={'file':'races/goblin/assets/'+name,'width':48,'height':48}
gear={ 'weapon':[(0,i) for i in range(6)],'helm':[(0,6),(0,7),(1,0),(1,1),(1,2)],'armor':[(0,8),(0,9),(1,3),(1,4),(1,5)],'gloves':[(1,6),(0,11),(0,10),(1,7),(1,8)],'boots':[(0,12),(0,13),(1,9),(1,10),(1,11)],'ring':[(0,14),(0,15),(1,12),(1,13),(1,14)],'amulet':[(1,15),(1,16),(1,17),(1,18),(0,18)]}
for slot,coords in gear.items():
 for i,(atlas,n) in enumerate(coords):icon(f'goblin_scatter_{slot}_{i+1}','equipment',atlas,n)
for j,setid in enumerate(['goblin_spore','goblin_ambush','goblin_snare']):
 for i,slot in enumerate(['helm','armor','gloves','boots']):icon(setid+'_'+slot,'equipment',0,20+j*4+i)
for id,n in [('goblin-silent-ration',19),('goblin-returning-spring',20)]:icon(id,'equipment',1,n)
for i in range(16):icon(f'goblin.mat.{i+1:02}','materials',0,32+i)
icon('goblin.infinity_gem_goblin','materials',1,21);icon('goblin.return_token_goblin','materials',1,22)
keys=['venom_cut','spore_fan','bitter_wound','spore_transfer','toxic_feint','mire_seal','opening_cut','seam_step','finish_cut','stolen_moment','crossing_blade','ration_rush','snare_wire','rattle_decoy','tangle_cut','spring_scatter','jam_joint','braced_lure','patch_ration','dust_escape','shed_binding','spore_lore','bitter_edge','light_pack','scout_breath','copper_brace','tendon_knots','tunnel_survivor','ration_sense','quiet_step']
for i,key in enumerate(keys):icon('goblin.'+key,'skills',1,24+i)
# True collapsed lifecycle art derived from the complete identity contact sheet.
im=Image.open(src/'exec-472a31cd-bcba-4a49-9a76-b51264e3bb03.png').convert('RGBA');w,h=im.size
for i,(id,row) in enumerate(list(manifest['monsters'].items())+[('hero',manifest['hero'])]):
 c=i%8;r=i//8;tile=im.crop((round(c*w/8),round(r*h/6),round((c+1)*w/8),round((r+1)*h/6)));bbox=tile.getchannel('A').point(lambda p:255 if p>70 else 0).getbbox();tile=tile.crop(bbox) if bbox else tile;scale=min(164/tile.width,150/tile.height);tile=tile.resize((max(1,round(tile.width*scale)),max(1,round(tile.height*scale))),Image.Resampling.NEAREST);can=Image.new('RGBA',(192,192));can.alpha_composite(tile,(96-tile.width//2,176-tile.height));name=id.replace('goblin.','').replace('.','-')+'-death.png';can.save(out/name);row['frames'].append({'id':'death','file':'races/goblin/assets/'+name,'durationMs':240,'facing':'left','alphaBBox':can.getbbox()})
manifest['camp']='battle-assets/backgrounds/camp-goblin.png'
(root/'art.js').write_text('export const art = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n')
(root/'asset-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
# Contact sheets for inspecting real delivered assets, not source generation alone.
for kind,items in [('monsters',manifest['monsters']),('equipment',manifest['equipment']),('skills',manifest['skills'])]:
 size=192 if kind=='monsters' else 48;sheet=Image.new('RGBA',(size*8,size*((len(items)+7)//8)),(29,30,39,255))
 for i,(id,row) in enumerate(items.items()):
  path=row['frames'][0]['file'] if kind=='monsters' else row['file'];tile=Image.open(root.parent.parent/path);sheet.alpha_composite(tile,((i%8)*size,(i//8)*size))
 sheet.save(root/(kind+'-native-proof.png'))
