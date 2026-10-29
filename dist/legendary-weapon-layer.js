// One immutable catalog weapon per identity. Race data may transform it, never replace it.
export const CANONICAL_LEGENDARY_WEAPONS=Object.freeze({
  "first-forge-oathhammer": {
    "file": "../equipment-assets/64/first-forge-oathhammer.png",
    "sha256": "bd6440844e6fa87a7de907c986ac9bcb00614d3c331d0f8f70a83717ee4d228e",
    "bounds": [
      8,
      2,
      53,
      60
    ],
    "size": [
      64,
      64
    ]
  },
  "human-oathblade": {
    "file": "../races/human/assets/materials-22.png",
    "sha256": "ac12e3a41a281f19a0c7a2ef361ae98a0da28da509f3a823126c02f92f078f7b",
    "bounds": [
      3,
      4,
      58,
      58
    ],
    "size": [
      64,
      64
    ]
  },
  "elf-sixfold-heartwood": {
    "file": "../races/elf/assets/equipment/64/elf-sixfold-heartwood.png",
    "sha256": "434a32ae1d055de3318671de6369c93d307c2fb8f004eab68af126d605a7251c",
    "bounds": [
      18,
      3,
      44,
      60
    ],
    "size": [
      64,
      64
    ]
  },
  "elf-last-string": {
    "file": "../races/elf/assets/equipment/64/elf-last-string.png",
    "sha256": "88ea25213e45c79d42bd9ea4c96b052b9be484c8d6343240ece33ad9b487cadf",
    "bounds": [
      9,
      3,
      53,
      60
    ],
    "size": [
      64,
      64
    ]
  },
  "goblin-silent-ration": {
    "file": "../races/goblin/assets/icon-goblin-silent-ration.png",
    "sha256": "ea6329e030b8d19bd459eee7ff7e388cb0c606748a274453451e1031249adde9",
    "bounds": [
      3,
      4,
      44,
      43
    ],
    "size": [
      48,
      48
    ]
  }
});
export function legendaryFrameFiles(sprite,frame){const weapon=CANONICAL_LEGENDARY_WEAPONS[sprite?.legendaryWeapon?.id];return weapon?[frame.file,weapon.file]:[frame.file];}
export function legendaryFrameBounds(sprite,frame){
 const body=frame.solidBBox??frame.alphaBBox??[0,0,...(sprite.frameSize??[192,192]).map(n=>n-1)],weapon=CANONICAL_LEGENDARY_WEAPONS[sprite?.legendaryWeapon?.id],pose=frame.weaponPose;
 if(!weapon||!pose)return body;
 const k=sprite.legendaryWeapon.scale,a=pose.angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a),[l,t,r,b]=weapon.bounds;
 const points=[[l,t],[r,t],[r,b],[l,b]];if(sprite.legendaryWeapon.id==='elf-last-string'&&pose.bowPull)points.push(pose.bowPull);
 const corners=points.map(([x,y])=>{x=(x-pose.grip[0])*k;y=(y-pose.grip[1])*k;return [pose.hand[0]+x*c-y*s,pose.hand[1]+x*s+y*c];});
 return [Math.floor(Math.min(body[0],...corners.map(p=>p[0]))),Math.floor(Math.min(body[1],...corners.map(p=>p[1]))),Math.ceil(Math.max(body[2],...corners.map(p=>p[0]))),Math.ceil(Math.max(body[3],...corners.map(p=>p[1])))];
}
export function drawLegendaryFrame(ctx,sprite,frame,images,{x=0,y=0,scale=1}={}){
 const body=images.get(frame.file),weapon=CANONICAL_LEGENDARY_WEAPONS[sprite?.legendaryWeapon?.id],pose=frame.weaponPose;
 if(!body)throw Error('Missing body frame '+frame.file);
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(x,y);ctx.scale(scale,scale);ctx.drawImage(body,0,0);
 if(weapon){
  const image=images.get(weapon.file);if(!image||!pose)throw Error('Missing canonical weapon or pose '+sprite.legendaryWeapon.id);
  const k=sprite.legendaryWeapon.scale;if(!(Number.isFinite(k)&&k>0))throw Error('Invalid shared weapon scale');
  ctx.save();ctx.translate(...pose.hand);ctx.rotate(pose.angle*Math.PI/180);ctx.scale(k,k);ctx.translate(-pose.grip[0],-pose.grip[1]);drawCanonicalWeapon(ctx,image,sprite.legendaryWeapon.id,pose);ctx.restore();
  for(const [x,y,w,h] of pose.front??[]){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(body,0,0);ctx.restore();}
 }
 ctx.restore();
}
// Bow limbs remain the immutable catalog PNG. Only its baked straight string is
// excluded at runtime; a shared vector string connects the same fixed nocks.
export const CANONICAL_BOW_STRING=Object.freeze({ends:[[45,11],[38,50]],rest:[41.5,30.5],removed:[[43,12],[46,12],[40,49],[37,49]],color:'#b9a06b'});
export function drawCanonicalWeapon(ctx,image,id,pose={}, {string=true}={}){
 if(id!=='elf-last-string'){ctx.drawImage(image,0,0);return;}
 ctx.save();ctx.beginPath();ctx.rect(0,0,64,59);ctx.rect(23,57,8,2);const polygon=CANONICAL_BOW_STRING.removed;ctx.moveTo(...polygon[0]);for(const p of polygon.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.clip('evenodd');ctx.drawImage(image,0,0);ctx.restore();
 if(string){const [a,b]=CANONICAL_BOW_STRING.ends,pull=pose.bowPull??CANONICAL_BOW_STRING.rest;ctx.save();ctx.strokeStyle=CANONICAL_BOW_STRING.color;ctx.lineWidth=.75;ctx.lineCap='butt';ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...pull);ctx.lineTo(...b);ctx.stroke();ctx.restore();}
}
