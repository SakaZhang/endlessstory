import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {drawScene} from './dist/art.js';
import {DWARF_ART_IDS,drawDwarfMonster,dwarfMonsterSvg} from './dist/dwarf-monster-art.js';
import {drawDwarfArea,dwarfAreaIndex} from './dist/dwarf-area-art.js';
import {renderDwarfRegion} from './dist/dwarf-region-ui.js';
const require=createRequire(import.meta.url),{createCanvas,GlobalFonts}=require('@napi-rs/canvas');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','M3CJK');
const out='/workspace/shared/m3-art-review';mkdirSync(out,{recursive:true});
const sha=c=>createHash('sha256').update(c.toBuffer('image/png')).digest('hex');
const save=(name,c)=>writeFileSync(out+'/'+name+'.png',c.toBuffer('image/png'));
const names=['渣火蜥','烟囱灰蝠','积盐炉壳','鼓风监炉官','泉壁苔兽','冷雾晶蛾','石胆菌甲虫','寒泉汲髓兽','炉池铸渣兵','汽压游魂','沉炉搬运傀','沉炉督造傀','炉心守卫 · 断铸'];
const ids=Object.keys(DWARF_ART_IDS).filter(id=>/^dwarf\.a0[456]\./.test(id));assert.equal(ids.length,13);assert.equal(new Set(ids.map(id=>DWARF_ART_IDS[id])).size,13);
// Compare unchanged A01–03 drawing directly with published branch-parent production source.
const priorMonster=execFileSync('git',['show','HEAD:dist/dwarf-monster-art.js'],{encoding:'utf8'}),priorArea=execFileSync('git',['show','HEAD:dist/dwarf-area-art.js'],{encoding:'utf8'});
const oldM=await import('data:text/javascript;base64,'+Buffer.from(priorMonster).toString('base64')),oldA=await import('data:text/javascript;base64,'+Buffer.from(priorArea).toString('base64'));
const portrait=(draw,id)=>{const c=createCanvas(260,220);draw(c.getContext('2d'),130,195,{definitionId:id,hp:100},{time:1200,scale:.96});return c;};
for(const id of Object.keys(oldM.DWARF_ART_IDS))assert.equal(sha(portrait(drawDwarfMonster,id)),sha(portrait(oldM.drawDwarfMonster,id)),id+' unchanged');
for(let area=0;area<3;area++){const a=createCanvas(960,310),b=createCanvas(960,310);drawDwarfArea(a.getContext('2d'),area,1200);oldA.drawDwarfArea(b.getContext('2d'),area,1200);assert.equal(sha(a),sha(b));}
const sheet=createCanvas(1040,1080),ctx=sheet.getContext('2d');ctx.fillStyle='#192629';ctx.fillRect(0,0,1040,1080);const hashes=[];
const random=Math.random;Math.random=()=>{throw Error('Art must not consume RNG');};
try{
 ids.forEach((id,i)=>{const c=portrait(drawDwarfMonster,id),signature=sha(c);assert(!hashes.some(x=>x.sha256===signature));hashes.push({id,name:names[i],sha256:signature});assert.equal(signature,sha(portrait(drawDwarfMonster,id)));const x=i%4*260,y=Math.floor(i/4)*270;ctx.drawImage(c,x,y+12);ctx.font='13px sans-serif';ctx.fillStyle='#b6c9c6';ctx.fillText(id,x+10,y+18);ctx.font='19px M3CJK';ctx.fillStyle='#e1d1aa';ctx.fillText(names[i],x+10,y+258);assert(dwarfMonsterSvg(id).includes('<rect'));});
 save('monster-production-contact-sheet',sheet);
 for(let area=4;area<=6;area++){assert.equal(dwarfAreaIndex(`dwarf.a0${area}.dungeon`),area-1);const state={location:area-1,areaId:`dwarf.a0${area}`,time:1200,enemies:(area===6?['dwarf.a06.boss','dwarf.a06.normal.1','dwarf.a06.normal.2']:ids.filter(id=>id.startsWith(`dwarf.a0${area}`)).slice(0,3)).map((id,i)=>({id:'unit'+i,definitionId:id,hp:100,max:100})),targetId:'unit0'};const before=JSON.stringify(state),c=createCanvas(960,420);drawScene(c,state);assert.equal(JSON.stringify(state),before);save(`area-a0${area}-production-scene`,c);}
}finally{Math.random=random;}
assert.equal(dwarfAreaIndex('dwarf.a07.field'),null);assert.equal(new Set(ids.map(id=>dwarfMonsterSvg(id,{known:false}))).size,1,'undiscovered silhouettes do not leak names or shapes');
const nodes=Array.from({length:6},(_,i)=>({id:`dwarf.a0${i+1}.field`,areaNumber:i+1,name:`区域${i+1} · 野外`,levelRange:[i*10+1,i*10+10],kind:'field',unlocked:true,budgetReady:true,readyAt:0}));const html=renderDwarfRegion(nodes,{selectedArea:6,now:0});assert.equal((html.match(/data-planned-area=/g)||[]).length,6);assert(!html.includes('前三'));assert(html.includes('区域 7'));assert(!html.includes('<span>区域 4<small>'));
save('monster-production-contact-sheet',sheet);writeFileSync(out+'/manifest.json',JSON.stringify({kind:'native production Canvas render, not browser QA',ids:hashes,scenes:[4,5,6],unchangedOldMonsters:Object.keys(oldM.DWARF_ART_IDS).length},null,2));console.log('PASS M3 13 unique production portraits, 3 production scenes, deterministic/no RNG/no state mutation, A01–03 pixels unchanged, registry-derived region UI, unknown privacy. Renders: '+out);
