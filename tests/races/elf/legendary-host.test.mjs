import assert from'node:assert/strict';import{pathToFileURL}from'node:url';
const root=process.env.ELF_HOST_ROOT??new URL('../../../',import.meta.url).pathname;const E=await import(pathToFileURL(root+'/dist/engine.js'));const{RACE_PACK:p}=await import(pathToFileURL(root+'/dist/races/elf/index.js'));const T=10000;const {captureCombatDisplay}=await import(pathToFileURL(root+'/dist/combat-display-bridge.js'));
function setup(id,node='elf.a01.field'){const s=E.fresh('elf');s.level=100;E.normalizeHealth(s,T);E.normalizeExpedition(s);s.skillTree.presets[0].unlocked=p.tree.nodes.map(n=>n.id);const item=E.legendaryItem(id,100);assert(item);s.inventory.push(item);assert(E.equipItem(s,item.id));s.lastSeen=s.lastHealthClock=T;s.nextBattleAt=0;s.restUntil=0;s.heroHp=E.stats(s).hp;const e=E.startInstanceEncounter(s,node,T);assert(e);for(const u of e.enemies){u.hp=u.max=1e7;u.atk=u.elementalPower=0;}e.rngState=1331;e.rngDraws=0;return{s,e,item};}
function tick(f){const logs=E.step(f.s,f.e,f.s.nextActionAt);assert(E.validSave(f.s));assert(E.validSave(JSON.parse(JSON.stringify(f.s))));return logs;}
const staff='elf-sixfold-heartwood',bow='elf-last-string';
function damage(f){return captureCombatDisplay(f.e,()=>tick(f)).events.filter(x=>x.sourceId==='hero'&&x.hpDelta<0&&x.kind!=='legend');}
function copy(f){const s=structuredClone(f.s);return {s,e:s.activeEncounter,item:s.inventory.find(i=>i.id===f.item.id)};}
function near(a,b){assert(Math.abs(a-b)<=2,`${a} != ${b}`);}
for(const shielded of [false,true]){
 const f=setup(staff);f.s.skillTree.presets[0].active=['elf.sixfold_chorus','elf.root_strike',null,null];if(shielded){f.e.enemies[0].shield=1e8;f.e.enemies[0].shieldUntil=T+100000;}
 tick(f);assert(f.s.legendaryRuntime.byId[f.item.id].state.ready);assert.equal(f.e.activeCastCount,1);
  f.e.rngState=1;f.e.rngDraws=0;const control=copy(f);control.s.legendaryRuntime.byId[f.item.id].state.seenElements=[];control.s.legendaryRuntime.byId[f.item.id].state.ready=false;
 const hp=f.e.enemies[0].hp,sh=f.e.enemies[0].shield;tick(f);tick(control);
 near((hp-f.e.enemies[0].hp)+(sh-f.e.enemies[0].shield),2*((hp-control.e.enemies[0].hp)+(sh-control.e.enemies[0].shield)));
 assert.equal(f.e.lastCast.hits.length,2);assert.equal(f.e.activeCastCount,2);assert.equal(f.s.legendaryRuntime.byId[f.item.id].state.pendingCastId,null);assert(f.s.legendaryRuntime.byId[f.item.id].state.seenElements.includes('earth'));
 f.e.done=true;f.e.win=false;f.s.activeEncounter=null;f.s.running=false;f.s.restUntil=0;const replacement=E.item('weapon',100,null,0,{originRace:'elf'});f.s.inventory.push(replacement);assert(E.equipItem(f.s,replacement.id));assert(!f.s.legendaryRuntime.byId[f.item.id]);assert(E.equipItem(f.s,f.item.id));assert(!f.s.legendaryRuntime.byId[f.item.id]);
}
{
 const f=setup(staff);f.s.skillTree.presets[0].active=['elf.sixfold_chorus',null,null,null];tick(f);assert(f.s.legendaryRuntime.byId[f.item.id].state.ready);
 for(const skill of ['elf.leaf_ward','elf.dew_mending']){f.s.skillTree.presets[0].active=[skill,null,null,null];if(skill==='elf.dew_mending')f.e.heroHp*=.6;tick(f);assert(f.s.legendaryRuntime.byId[f.item.id].state.ready);}
 f.s.skillTree.presets[0].active=['elf.root_strike',null,null,null];f.e.treeSkillCooldowns['elf.root_strike']=100;const before=structuredClone(f.s.legendaryRuntime.byId[f.item.id].state);tick(f);assert.deepEqual(f.s.legendaryRuntime.byId[f.item.id].state,before);
 // Compare charged real mixed cast against same item with pending boost disabled.
 f.e.treeSkillCooldowns['elf.root_strike']=0;const normal=copy(f);normal.s.legendaryRuntime.byId[f.item.id].state.ready=false;normal.s.legendaryRuntime.byId[f.item.id].state.seenElements=[];
 const boosted=damage(f),unboosted=damage(normal);assert.equal(boosted.length,2);for(let i=0;i<2;i++)near(boosted[i].hpDelta,unboosted[i].hpDelta*2);
}
{
 const f=setup(bow);f.s.skillTree.presets[0].active=['elf.twin_arrow',null,null,null];const control=copy(f); // Identical gear budget, disable exclusive identity only for damage baseline.
 control.item.legendaryId=staff;control.item.weaponType='bow';delete control.s.legendaryRuntime.byId[control.item.id];
 // Use host calls without validSave for deliberately identity-swapped damage baseline.
 const before=f.e.enemies[0].armor;f.e.enemies[0].armor=control.e.enemies[0].armor=0;
 const actual=damage(f),baseline=captureCombatDisplay(control.e,()=>E.step(control.s,control.e,control.s.nextActionAt)).events.filter(x=>x.sourceId==='hero'&&x.hpDelta<0&&x.kind!=='legend');
 assert.equal(actual.length,3);assert.equal(baseline.length,3);for(let i=0;i<3;i++)near(actual[i].hpDelta,baseline[i].hpDelta*(i===2?1.5:1));
 assert.equal(f.e.activeCastCount,1);assert.equal(f.e.lastCast.hits.length,3);
}
console.log('PASS actual Elf item host: four elements, mixed double cast, all segments, shield damage, support/failed retention, equip reset, final bow segment only');
{
 const f=setup(staff);f.s.skillTree.presets[0].active=['elf.root_strike',null,null,null];f.e.rngState=1;
 const baseline=copy(f);baseline.item.legendaryId=bow;delete baseline.s.legendaryRuntime.byId[baseline.item.id];
 const boosted=copy(f),state=boosted.s.legendaryRuntime.byId[f.item.id].state;state.seenElements=['earth','water','fire','wind'];state.ready=true;
 const a=damage(f),b=captureCombatDisplay(baseline.e,()=>E.step(baseline.s,baseline.e,baseline.s.nextActionAt)).events.filter(x=>x.sourceId==='hero'&&x.hpDelta<0&&x.kind!=='legend'),c=damage(boosted);
 assert.equal(a.length,2);near(a[0].hpDelta,b[0].hpDelta);near(a[1].hpDelta,b[1].hpDelta*1.3);near(c[0].hpDelta,b[0].hpDelta*2);near(c[1].hpDelta,b[1].hpDelta*2.6);
}
{
 const f=setup(bow);f.s.skillTree.presets[0].active=['elf.hunter_mark',null,null,null];f.e.rngState=1;f.e.enemies[0].armor=500;
 const control=copy(f);control.item.legendaryId=staff;delete control.s.legendaryRuntime.byId[control.item.id];control.e.enemies[0].armor=350;
 const a=damage(f),b=captureCombatDisplay(control.e,()=>E.step(control.s,control.e,control.s.nextActionAt)).events.filter(x=>x.sourceId==='hero'&&x.hpDelta<0&&x.kind!=='legend');assert.equal(a.length,1);near(a[0].hpDelta,b[0].hpDelta);
 // Same actual item and normal-attack schedule: no bow armor ignore or final-hit bonus.
 const basic=setup(bow);basic.s.skillTree.presets[0].active=[null,null,null,null];const plain=copy(basic);plain.item.legendaryId=staff;delete plain.s.legendaryRuntime.byId[plain.item.id];const x=damage(basic),y=captureCombatDisplay(plain.e,()=>E.step(plain.s,plain.e,plain.s.nextActionAt)).events.filter(x=>x.sourceId==='hero'&&x.hpDelta<0&&x.kind!=='legend');assert.equal(x.length,1);near(x[0].hpDelta,y[0].hpDelta);
}
{
 const s=E.fresh('human'),item=E.legendaryItem(bow,1);s.inventory.push(item);assert(E.equipItem(s,item.id));assert(E.validSave(s));
 const {racialLegendaryHitModifiers:mod}=await import('../../../dist/racial-legendary-runtime.js');assert.deepEqual(mod(s,{weaponType:'staff',sourceKind:'skill',damageType:'physical',isFinalPhysicalSegment:true}),{damageMultiplier:1,armorMultiplier:1});assert.deepEqual(mod(s,{sourceKind:'counter',damageType:'physical',isFinalPhysicalSegment:true}),{damageMultiplier:1,armorMultiplier:1});
 const f=setup(staff);for(const damageType of ['earth','water','fire','wind','light','dark'])assert.equal(mod(f.s,{sourceKind:'dot',damageType}).damageMultiplier,1.3);assert.equal(mod(f.s,{sourceKind:'skill',damageType:'poison'}).damageMultiplier,1);
}
console.log('PASS real 30% armor ignore, no basic/counter/wrong weapon effect, cross-race bow equip, +30% elemental and 2 × 1.3 mixed damage');
{
 const f=setup(staff,'elf.a01.dungeon');f.s.skillTree.presets[0].active=['elf.sixfold_chorus',null,null,null];tick(f);assert(f.s.legendaryRuntime.byId[f.item.id].state.ready);for(const u of f.e.enemies)u.hp=1;for(let i=0;i<8&&!f.e.done;i++)tick(f);assert(f.e.done&&f.e.win);E.reward(f.s,f.e,f.s.lastHealthClock);const ledger=structuredClone(f.s.legendaryRuntime.byId[f.item.id]);const next=E.startInstanceEncounter(f.s,'elf.a01.dungeon',f.s.nextBattleAt);assert(next);assert.deepEqual(f.s.legendaryRuntime.byId[f.item.id],ledger);assert(E.validSave(f.s));
 console.log('PASS actual dungeon encounter transition retains per-item charge and clock');
}
{
 const f=setup(staff);f.s.skillTree.presets[0].active=['elf.sixfold_chorus',null,null,null];f.e.rngState=1;
 const baseline=copy(f);baseline.item.legendaryId=bow;delete baseline.s.legendaryRuntime.byId[baseline.item.id];
 const first=damage(f),plain=captureCombatDisplay(baseline.e,()=>E.step(baseline.s,baseline.e,baseline.s.nextActionAt)).events.filter(x=>x.sourceId==='hero'&&x.hpDelta<0&&x.kind!=='legend');assert.equal(first.length,6);for(let i=0;i<6;i++)near(first[i].hpDelta,plain[i].hpDelta*1.3);assert(f.s.legendaryRuntime.byId[f.item.id].state.ready,'fourth actual hit charges, remaining hits not boosted');
 f.e.treeSkillCooldowns['elf.sixfold_chorus']=0;f.e.rngState=1;const normal=copy(f);normal.s.legendaryRuntime.byId[f.item.id].state.seenElements=[];normal.s.legendaryRuntime.byId[f.item.id].state.ready=false;
 const next=damage(f),unboosted=damage(normal);assert.equal(next.length,6);for(let i=0;i<6;i++)near(next[i].hpDelta,unboosted[i].hpDelta*2);assert(f.s.legendaryRuntime.byId[f.item.id].state.ready,'charged six-element cast earns next charge from real distinct hits');assert.equal(f.s.legendaryRuntime.byId[f.item.id].state.pendingCastId,null);assert.equal(f.e.activeCastCount,2);
 console.log('PASS actual six-hit cast: fourth hit never retroactively boosts; next full cast doubled once and may earn next charge');
}
