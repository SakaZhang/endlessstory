// Exact image identities selected by actual App DOM fixtures, composed natively.
// This is NOT a browser screenshot or a reproduction of browser layout.
import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import {CHIK_FAMILY_CHARACTERS} from './dist/chik-family-registry.js';import {storyHeroDescriptor} from './dist/story-cast-registry.js';
const {createCanvas,loadImage,GlobalFonts}=createRequire(import.meta.url)('@napi-rs/canvas');GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','MixedProof');
const actors=[...Object.values(CHIK_FAMILY_CHARACTERS),storyHeroDescriptor('goblin')],canvas=createCanvas(1000,510),c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#10272d';c.fillRect(0,0,1000,510);c.fillStyle='#efdbae';c.font='22px MixedProof';c.fillText('实际 App 对白选中画像 · 原生身份拼图（非浏览器页面）',20,32);
for(const [i,label] of ['family-speaking','hero-and-family'].entries()){
 const html=fs.readFileSync('qa/v068-integration/'+label+'.html','utf8'),files=[...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);assert.equal(files.length,i?4:3);assert.equal(new Set(files).size,files.length,'no duplicate family portrait');
 const y=65+i*220;c.fillStyle='#1a3339';c.fillRect(16,y,968,205);c.fillStyle='#efdbae';c.font='17px MixedProof';c.fillText(i?'奇克发言：三位家人仍在场，不误标为正在说话':'咔洛发言：家人卡高亮，不追加第二张咔洛头像',30,y+26);
 for(const [n,file]of files.entries()){const a=actors.find(a=>a.file===file);assert(a);const im=await loadImage('dist/'+file),x=32+n*192;c.save();c.beginPath();c.rect(x,y+40,96,96);c.clip();if(a.existingFullActor){const b=a.portraitCrop;if(a.facing===-1){c.translate(x+96,y+40);c.scale(-1,1);c.drawImage(im,b.x,b.y,b.size,b.size,0,0,96,96);}else c.drawImage(im,b.x,b.y,b.size,b.size,x,y+40,96,96);}else c.drawImage(im,x,y+40,96,96);c.restore();c.fillStyle='#efdbae';c.font='17px MixedProof';c.fillText(a.name,x,y+163);c.font='11px MixedProof';c.fillStyle='#bad1c2';c.fillText(a.role,x,y+183);}
}
fs.writeFileSync('qa/v068-integration/mixed-dialogue-identities.png',canvas.toBuffer('image/png'));console.log('PASS actual App selected portrait identity proof:3 family images and3+1 hero images, no duplicated sibling; native composition, not browser UI.');
