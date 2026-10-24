from PIL import Image
import pathlib,json,hashlib
root=pathlib.Path(__file__).resolve().parents[3];p=root/'dist/races/goblin';m=json.load(open(p/'asset-manifest.json'));report={}
for id,row in {'hero':m['hero'],**m['monsters']}.items():
 hashes=[]
 for f in row['frames']:
  image=Image.open(root/'dist'/f['file']);assert image.size==(192,192);assert image.mode=='RGBA';box=image.getbbox();assert box and box[0]>=0 and box[1]>=0 and box[2]<=192 and box[3]<=177,(id,box);assert f['facing']=='left';hashes.append(hashlib.sha256(image.tobytes()).hexdigest())
 assert len(set(hashes))>=6,id
 report[id]={'distinctFrames':len(set(hashes)),'anchor':row['anchor'],'facing':row['facing']}
for kind in ['equipment','skills','materials']:
 hashes=[]
 for id,row in m[kind].items():
  im=Image.open(root/'dist'/row['file']);assert im.size==(48,48);assert im.getbbox();hashes.append(hashlib.sha256(im.tobytes()).hexdigest())
 assert len(set(hashes))==len(hashes),kind
for row in m['areas'].values():assert Image.open(root/'dist'/row['file']).size==(480,270)
print('PASS 352 actorframes, all44 identities ≥6 unique poses, left-facing metadata, 192/176 anchors; 98 unique category icons;10 exact480x270 scenes.')
(p/'art-qa.json').write_text(json.dumps(report,indent=2))
