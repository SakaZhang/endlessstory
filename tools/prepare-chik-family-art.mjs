import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {createCanvas,loadImage,GlobalFonts}=createRequire(import.meta.url)('@napi-rs/canvas');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','CJK');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc','CJK Bold');
const source='source-art/chik-family',prompts=JSON.parse(readFileSync('chik-family-prompts.json'));
const cast=[
 {id:'kalo',name:'咔洛',role:'快长大的弟弟',description:'急着证明自己，也想替哥哥分担。',line:'今天带我去。我背得动。'},
 {id:'mirei',name:'米芮',role:'帮忙分粮的妹妹',description:'把余粮数清楚，也把哥哥那份留好。',line:'那就还没拿到。'},
 {id:'dobu',name:'豆布',role:'最小的弟弟',description:'抱着旧木碗，还不懂粮从哪里来。',line:'今天也能吃满吗？'}
];
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const manifest={version:1,method:'builtin image_gen',familyOf:'奇克',ordinaryNpcCount:30,familyCount:3,entries:[]};
for(const n of cast){
 const id='family.goblin.'+n.id,path=source+'/original/'+id+'.png',im=await loadImage(path);
 for(const size of [64,96,192]){
  const target=size===96?'dist/story-family-portraits':source+'/'+size;mkdirSync(target,{recursive:true});
  const c=createCanvas(size,size),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(im,0,0,size,size);writeFileSync(target+'/'+id+'.png',c.toBuffer('image/png'));
 }
 const runtime='dist/story-family-portraits/'+id+'.png',preview=source+'/192/'+id+'.png';
 manifest.entries.push({id,name:n.name,role:n.role,race:'goblin',method:'builtin image_gen',prompt:prompts.find(p=>p.id===n.id).prompt,source:{path,sha256:hash(path),size:[im.width,im.height]},preview:{path:preview,sha256:hash(preview),size:[192,192]},runtime:{path:runtime,sha256:hash(runtime),size:[96,96],bytes:readFileSync(runtime).length},facing:'right',bounds:{earsAndHairUnclipped:true,bodyCrop:'chest-up'},pixelQa:{at64:'pending',at96:'pending',browserScreenshot:false}});
}
writeFileSync('chik-family-source-manifest.json',JSON.stringify(manifest,null,2)+'\n');
const c=createCanvas(1000,624),ctx=c.getContext('2d');ctx.fillStyle='#11282e';ctx.fillRect(0,0,1000,624);ctx.fillStyle='#efdbb3';ctx.font='bold 30px "CJK Bold"';ctx.fillText('奇克的弟弟妹妹',32,48);ctx.font='17px CJK';ctx.fillStyle='#b9cdc5';ctx.fillText('咔洛 · 米芮 · 豆布  /  主线家人，不是新增日常委托 NPC',32,80);
for(let i=0;i<cast.length;i++){
 const n=cast[i],x=32+i*324;ctx.fillStyle='#1a3339';ctx.fillRect(x,108,310,476);ctx.strokeStyle='#52615c';ctx.strokeRect(x+.5,108.5,309,475);
 const im=await loadImage('dist/story-family-portraits/family.goblin.'+n.id+'.png');ctx.imageSmoothingEnabled=false;ctx.drawImage(im,x+59,128,192,192);
 ctx.font='bold 27px "CJK Bold"';ctx.fillStyle='#efdbb3';ctx.textAlign='center';ctx.fillText(n.name,x+155,356);ctx.font='19px CJK';ctx.fillStyle='#c0d4c7';ctx.fillText(n.role,x+155,386);ctx.font='16px CJK';ctx.fillText(n.description,x+155,422);ctx.fillStyle='#efdbb3';ctx.fillText('「'+n.line+'」',x+155,456);
 const small=await loadImage(source+'/64/family.goblin.'+n.id+'.png');ctx.drawImage(small,x+122,478,64,64);ctx.font='13px CJK';ctx.fillStyle='#9fb8b0';ctx.fillText('64 px 窄屏显示',x+155,563);ctx.textAlign='left';
}
ctx.font='14px CJK';ctx.fillStyle='#9fb8b0';ctx.fillText('正式运行 96 px · 原始生成稿与 192 px 设计稿保留 · 原有剧情台词 / 无新增奖励',32,609);
writeFileSync(source+'/奇克家人-命名形象总览.png',c.toBuffer('image/png'));
copyFileSync(source+'/奇克家人-命名形象总览.png','/workspace/shared/chik-family-v068/奇克家人-命名形象总览.png');
console.log('Prepared 3 original portraits, 64/96/192 px derivatives, provenance and Chinese contact sheet.');
