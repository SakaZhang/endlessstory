// Mechanical extraction only: imagegen-authored atlas, no redraw/recolor/compositing.
const fs=require('fs'),sharp=require('sharp'),crypto=require('crypto');
(async()=>{
const root='qa/human-dwarf-parity',source=root+'/source-atlas.png',rows=JSON.parse(fs.readFileSync(root+'/catalog.json')),m=await sharp(source).metadata();
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest={generator:'built-in image_gen',source,sourceSha256:hash(source),sourceSize:[m.width,m.height],method:'4x7 visually verified row-boundary crop, transparent trim, nearest-neighbor contain; no painting or recoloring',entries:[]};
for(let i=0;i<rows.length;i++){
 const id=rows[i].id,col=i%4,row=Math.floor(i/4),rowEdges=[0,244,480,722,932,1170,1390,1659],left=Math.round(col*m.width/4),top=rowEdges[row],right=Math.round((col+1)*m.width/4),bottom=rowEdges[row+1];
 const crop={left,top,width:right-left,height:bottom-top};
 const cropped=await sharp(source).extract(crop).png().toBuffer();
 const buf=await sharp(cropped).trim({threshold:10}).png().toBuffer();
 const rasters={};for(const n of [32,48,64]){const path=`dist/equipment-assets/${n}/${id}.png`;await sharp(buf).resize(n-4,n-4,{fit:'contain',kernel:'nearest',background:{r:0,g:0,b:0,alpha:0}}).extend({top:2,bottom:2,left:2,right:2,background:{r:0,g:0,b:0,alpha:0}}).png().toFile(path);rasters[n]={path,sha256:hash(path)};}
 manifest.entries.push({id,name:rows[i].name,crop,rasters});
}
fs.writeFileSync(root+'/source-manifest.json',JSON.stringify(manifest,null,2)+'\n');
// Native-size contact, each row matches the source atlas.
for(const n of [32,64]){const cell=n+16;await sharp({create:{width:4*cell,height:7*cell,channels:4,background:'#242a33'}}).composite(manifest.entries.map((e,i)=>({input:e.rasters[n].path,left:(i%4)*cell+8,top:Math.floor(i/4)*cell+8}))).png().toFile(`${root}/contact-${n}.png`);}
console.log('Packaged',manifest.entries.length,'icons x 3 native sizes from',m.width,m.height,'alpha',m.hasAlpha);
})();
