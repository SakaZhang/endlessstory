import {equipTestLoadout} from './equipped-test-fixture.mjs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {drawScene} from './dist/art.js';
import {DWARF_ART_IDS,dwarfMonsterSvg} from './dist/dwarf-monster-art.js';
import {DWARF_MONSTERS,dwarfParameterSet} from './dist/dwarf-content.js';
import * as E from './dist/engine.js';
import {PRODUCTION_DWARF_PARAMETERS,DWARF_PARAMETER_PROVENANCE} from './dist/dwarf-parameters.js';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {normalizeBattleEnemies,renderEnemyRoster} from './dist/multi-battle-ui.js';
// Isolate from aggregate tests which intentionally replace the module provider.
if(!process.env.M2_ART_ISOLATED){
 process.stdout.write(execFileSync(process.execPath,[fileURLToPath(import.meta.url)],{env:{...process.env,M2_ART_ISOLATED:'1'},encoding:'utf8'}));
}else{
const require=createRequire(import.meta.url),{createCanvas,GlobalFonts}=require('@napi-rs/canvas');
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','M2CJK');
const out=new URL('./qa/m2-art/',import.meta.url);mkdirSync(out,{recursive:true});
const render=s=>{const canvas=createCanvas(960,420);drawScene(canvas,s);return canvas;};
const hash=c=>createHash('sha256').update(c.toBuffer('image/png')).digest('hex');
const snap=(name,canvas)=>writeFileSync(new URL(name+'.png',out),canvas.toBuffer('image/png'));
// This legacy vector renderer was extended through A06; A07–10 use the
// live raster lifecycle renderer, covered by live-battle-a07-a10-tests.mjs.
assert.deepEqual(Object.keys(DWARF_ART_IDS).sort(),Object.values(DWARF_MONSTERS).filter(m=>m.area<=6).map(m=>m.id).sort());
for(const m of Object.values(DWARF_MONSTERS).filter(m=>m.area>6))assert.equal(dwarfMonsterSvg(m.id),'');
const rows=Object.values(DWARF_MONSTERS).filter(m=>m.area<=6),sheet=createCanvas(1040,Math.ceil(rows.length/4)*270),ctx=sheet.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#152124';ctx.fillRect(0,0,sheet.width,sheet.height);
const hashes=[],silhouettes=new Set();let rand=Math.random;Math.random=()=>{throw Error('Rendering must not consume RNG')};
try{
 rows.forEach((m,i)=>{const s={location:m.area-1,areaId:`dwarf.a0${m.area}`,time:1200,enemies:[{id:'u',definitionId:m.id,hp:100,max:100,boss:m.rank==='boss'}]};const before=JSON.stringify(s),canvas=render(s);assert.equal(JSON.stringify(s),before);assert.equal(hash(canvas),hash(render(s)));const fallback=render({...s,enemies:[{...s.enemies[0],definitionId:'unmapped'}]});assert.notEqual(hash(canvas),hash(fallback),m.id+' must bypass legacy fallback');const crop=createCanvas(260,220);crop.getContext('2d').drawImage(canvas,552,123,260,220,0,0,260,220);const signature=hash(crop);assert(!silhouettes.has(signature),m.id+' distinct');silhouettes.add(signature);hashes.push({id:m.id,kind:DWARF_ART_IDS[m.id],sha256:signature});const x=i%4*260,y=Math.floor(i/4)*270;ctx.drawImage(crop,x,y+20);ctx.fillStyle='#d0c19f';ctx.font='14px sans-serif';ctx.fillText(m.id,x+10,y+18);ctx.font='18px M2CJK';ctx.fillText(m.name,x+10,y+260);assert(dwarfMonsterSvg(m.id).includes('<rect'));});
 for(let a=1;a<=3;a++){const group=rows.filter(m=>m.area===a).slice(0,a===1?2:3).map((m,i)=>({id:'u'+i,definitionId:m.id,hp:100,max:100}));const s={location:a-1,areaId:`dwarf.a0${a}`,time:1200,enemies:group,targetId:'u0'};const canvas=render(s);snap(`area-a0${a}-${group.length}-enemies`,canvas);assert.notEqual(hash(canvas),hash(render({...s,areaId:undefined})));}
 const unknowns=rows.map(m=>dwarfMonsterSvg(m.id,{known:false}));assert.equal(new Set(unknowns).size,1);assert.equal(dwarfMonsterSvg('legacy'),'');
 for(let i=0;i<3;i++){const s={location:i,time:1200,enemies:[{id:'legacy',hp:100}]};const canvas=render(s);const legacyHashes=["bc02d6876f63dbd419e531b819159411cce8aab9d3b7a5056bd1b12f0b292510", "75d9d68aa0110d5fa76ec7d508c5687295504bfe1a5dba887138f83c6e86e6ec", "b73a877e1defeafe31f51e80a0c765b3f5d6f7c01c79928d58020634803c4460"];assert.equal(hash(canvas),legacyHashes[i]);snap('legacy-'+i,canvas);}
}finally{Math.random=rand;}
snap('monster-production-contact-sheet',sheet);
// Normal production provider and original fresh hero. Only access records are seeded.
const provider=dwarfParameterSet();assert.deepEqual(provider,PRODUCTION_DWARF_PARAMETERS);assert.equal(provider.reviewed,true);assert.notEqual(provider.testOnly,true);
const s=E.fresh();equipTestLoadout(s);const originalInventory=structuredClone(s.inventory),originalSkills=structuredClone(s.skills);
E.normalizeHealth(s,100000);E.normalizeExpedition(s);
s.areaProgress.dwarf={unlocked:[1,2,3],cleared:[1,2]};
const initialStats=E.stats(s),initialHp=s.heroHp;
const e=E.startInstanceEncounter(s,'dwarf.a03.boss',100000);assert(e);const boss=e.enemies.find(u=>u.definitionId==='dwarf.a03.boss');assert(boss);
let now=100000;for(let i=0;i<30&&!boss.control.preparing&&!e.done;i++){now=s.nextActionAt;E.step(s,e,now);}assert(boss.control.preparing,'Explicit owned Lv1 loadout reaches the production boss preparing state');assert.equal(boss.control.preparing.duration,2200);
assert.deepEqual(s.inventory,originalInventory);assert.deepEqual(s.skills,originalSkills);
const units=normalizeBattleEnemies(e,now);assert(units.some(u=>u.preparing));assert.equal(units[0].preparing.name,'断誓重槌');
const bossScene={location:2,areaId:'dwarf.a03',time:1200,enemies:units,targetId:e.targetId,boss:true};snap('area-a03-real-engine-boss',render(bossScene));
const html=renderEnemyRoster(e,{now});assert(html.includes('enemyUnitCast'));assert(html.includes('断誓重槌'));writeFileSync(new URL('boss-roster.html',out),html);
writeFileSync(new URL('evidence.json',out),JSON.stringify({renderer:'dist/art.js drawScene (production)',capture:'Native @napi-rs/canvas export, NOT browser screenshot',boss:{definitionId:boss.definitionId,source:'Default reviewed production provider; E.fresh + E.startInstanceEncounter + actual E.step until preparing',parameterSetId:provider.id,reviewed:provider.reviewed,testOnly:provider.testOnly===true,provenance:DWARF_PARAMETER_PROVENANCE,accessFixture:'Only legal A03 unlock/clear records seeded: unlocked [1,2,3], cleared [1,2]. No level, hero HP, raw items, monster parameters, cooldowns or skills changed.',hero:{level:s.level,initialHp,initialStats,inventoryCount:originalInventory.length,skills:originalSkills,currentHp:s.heroHp},runtimeSkillOverrides:boss.skillOverrides,preparing:boss.control.preparing,normalizedPreparing:units[0].preparing,simulationClock:now,limitation:'Real casting state verified in engine and production HTML roster. HTML bar is outside canvas and intentionally not fabricated into PNG. boss-roster.html is production HTML, not a browser screenshot.'},hashes},null,2));
console.log('PASS 26 historical A01–06 sprites distinct/non-fallback, 3 distinct areas, 2/3 formations, deterministic/nonmutating/no RNG, anonymous unknown SVG, legacy pixel hashes; default reviewed provider + explicitly equipped Lv1 hero reaches named 2200ms boss preparing; production HTML exported (not browser evidence).');
}
