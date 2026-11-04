// Independent production-path QA. No coefficient helper is used to calculate expectations.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {getRacePack} from './dist/race-registry.js';
import {makeAffixSourceRange} from './dist/affix-range.js';
import {captureCombatDisplay} from './dist/combat-display-bridge.js';
import {applyEnemyDamageSegment} from './dist/multi-combat.js';
import {createPlayerShieldLayers,grantPlayerShieldLayer} from './dist/player-shield-layers.js';
import {prepareLegendaryDrop,LEGENDARY_DROP_CANDIDATES} from './dist/legendary-drop.js';
import {returnRingRareBonus,returnRingExperienceBonus} from './dist/return-ring-state.js';
import {loadProgress,SAVE_KEY} from './dist/storage.js';
const clone=structuredClone,T=10000,models=[null,'raw-v1','raw-v2'];
const originalRandom=Math.random;let factorySeed=940011;Math.random=()=>((factorySeed=(Math.imul(factorySeed,1664525)+1013904223)>>>0)/2**32);
const near=(a,b,tolerance=1e-6)=>assert(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
const oldFixtures=JSON.parse(fs.readFileSync(new URL('./tests/fixtures/pre-v094-divine-saves.json',import.meta.url),'utf8'));
assert.equal(oldFixtures.source.commit,'bd2e839aaeefe4a3ddc56d5dc95f7f89bd87a473');
assert.deepEqual(oldFixtures.oldBehavior,{divineDiceBonuses:{luck:33,crit:33},divineDiceHigh:{outcome:'high',multiplier:1.25,fixedDamage:null},divineDiceJackpot:{outcome:'jackpot',multiplier:1,fixedDamage:3333},staffElementMultiplier:1.3,divineBootsDodgeRating:100,divinePrismCoefficient:2});
function loadOld(race,model){
 let serialized=JSON.stringify(oldFixtures.saves[model][race]),game,baselineStats;
 const inventory=JSON.stringify(oldFixtures.saves[model][race].inventory),stones=JSON.stringify(oldFixtures.saves[model][race].divineStones);
 for(let reload=0;reload<3;reload++){
  const storage={length:1,key:()=>SAVE_KEY,getItem:key=>key===SAVE_KEY?serialized:null,setItem:(key,value)=>{assert.equal(key,SAVE_KEY);serialized=value;},removeItem:()=>assert.fail('no retired fixture keys')};
  const result=loadProgress(storage);assert.equal(result.blocked,false);assert.equal(result.initialized,false);game=result.game;
  assert.equal(JSON.stringify(game.inventory),inventory,'loading old divine gear never writes base, affixes, exclusive or blessing receipt');assert.equal(JSON.stringify(game.divineStones),stones,'old blessing is free: no stone consumed');
  const stats=E.stats(game);if(baselineStats)assert.deepEqual(stats,baselineStats,'refresh never stacks divine bonuses');baselineStats=stats;serialized=JSON.stringify(game);
 }
 return game;
}

function factory(id,race){
 if(['infinity-gauntlet','return-ring','ashen-primal-core'].includes(id))return E.legendaryItem(id,100);
 const pool=LEGENDARY_DROP_CANDIDATES[race],index=pool.findIndex(x=>x.id===id);assert(index>=0);
 const draws=[.01,(index+.5)/pool.length],receipt=prepareLegendaryDrop({settlementId:'divine-qa-'+id,nodeId:race+'.a03.boss',regionRace:race,kind:'boss',won:true},{probability:.05,random:()=>draws.shift(),generateItem:({legendaryId})=>E.legendaryItem(legendaryId,100),validateItem:item=>item.legendaryId===id});
 assert.equal(receipt?.outcome,'hit');assert.equal(draws.length,0);return clone(receipt.item);
}
function setup(race,id,model=null,skill=null){
 const s=model?loadOld(race,model):E.fresh(race);s.level=100;E.normalizeHealth(s,T);E.normalizeExpedition(s);
 const empty=Object.fromEntries(Object.keys(s.equip).map(key=>[key,null]));assert(E.applyEquipmentRuntimeChange(s,s.equip,empty));s.equip=empty;
 const p=s.skillTree.presets[0];p.unlocked=getRacePack(race).tree.nodes.map(n=>n.id);p.active=[skill,null,null,null];p.passive=[null,null];s.skills=[null,null,null,null];
 const item=model?s.inventory.find(i=>i.legendaryId===id):factory(id,race);assert(item);if(!model)item.affixes=['atk','hp','armor','luck'].slice(0,item.affixes.length).map(stat=>{const sourceRange=makeAffixSourceRange(E.AFFIX_DEFS[stat],4);return {stat,value:sourceRange.min,sourceRange};});
 const raw=JSON.stringify({atk:item.atk,hp:item.hp,armor:item.armor,affixes:item.affixes,exclusive:item.exclusive});
 if(!model)s.inventory.push(item);if(id==='return-ring')s.returnRing={version:1,recipeLearned:true,crafted:true,craftedItemId:item.id};if(id==='infinity-gauntlet')s.infinityGauntlet={version:1,recipeLearned:true,crafted:true,craftedItemId:item.id};assert(E.equipItem(s,item.id));s.lastSeen=s.lastHealthClock=T;s.nextBattleAt=s.restUntil=0;s.heroHp=E.stats(s).hp;
 const e=E.startInstanceEncounter(s,race+'.a01.field',T);assert(e);
 for(const u of e.enemies){u.hp=u.max=1e8;u.atk=u.elementalPower=0;u.armor=0;u.shield=0;u.nextBasicAt=T+1e8;u.elementTags=[];for(const key of Object.keys(u.elementResistance))u.elementResistance[key]=0;u.control.cooldowns=Object.fromEntries(Object.keys(u.control.cooldowns).map(k=>[k,T+1e8]));}
 e.rngState=1;e.rngDraws=0;assert(E.validSave(s),id+' initial valid save');return {s,e,item,raw,receipt:JSON.stringify(item.divine)};
}
function tick(f,seed=null){if(seed!==null)f.e.rngState=seed;const events=captureCombatDisplay(f.e,()=>E.step(f.s,f.e,f.s.nextActionAt)).events;assert(E.validSave(f.s),f.item.legendaryId+' live valid');assert(E.validSave(JSON.parse(JSON.stringify(f.s))),f.item.legendaryId+' JSON valid');assert.equal(JSON.stringify({atk:f.item.atk,hp:f.item.hp,armor:f.item.armor,affixes:f.item.affixes,exclusive:f.item.exclusive}),f.raw,'combat never rewrites raw item');assert.equal(JSON.stringify(f.item.divine),f.receipt,'combat leaves original blessing receipt unchanged');return events;}
function copy(f){const s=JSON.parse(JSON.stringify(f.s));return {...f,s,e:s.activeEncounter,item:s.inventory.find(i=>i.id===f.item.id)};}
function ordinaryCopy(f){const c=copy(f);delete c.item.divine;c.receipt=undefined;return c;}
const semantic=events=>events.map(({eventId,...event})=>event);
const hpDamage=event=>-(event.hpDelta??0)-(event.shieldDelta??0);
const heroHits=(events,skill)=>events.filter(x=>x.sourceId==='hero'&&x.skillId===skill&&x.outcome==='hit'&&hpDamage(x)>0);
const critFactor=(event,stats)=>event.crit?stats.critDamage:1;

// Dwarf fifth-attack damage/penetration and 12-second all-target pulse/shield.
for(const model of models){const power=model?2:1;
 const h=setup('dwarf','first-forge-oathhammer',model),st=E.stats(h.s);for(const u of h.e.enemies)u.armor=500;
 h.s.equipmentRuntime.byId[h.item.id].attackCount=3;assert(!tick(h).some(x=>x.skillId==='hammer'));assert.equal(h.s.equipmentRuntime.byId[h.item.id].attackCount,4);
 const hit=tick(h).find(x=>x.skillId==='hammer'&&hpDamage(x)>0);assert(hit,'fifth real attack procs');near(hpDamage(hit),Math.max(1,Math.round(st.atk*1.4*power*critFactor(hit,st)*100/(100+Math.max(0,500*(1-.3*power)-st.penetration)))));assert.equal(h.s.equipmentRuntime.byId[h.item.id].attackCount,0);
 const r=setup('dwarf','everburning-reactor',model),rs=E.stats(r.s);r.s.equipmentRuntime.byId[r.item.id].combatMs=9900;assert(!tick(r).some(x=>x.skillId==='reactor'));
 const pulse=tick(r).filter(x=>x.skillId==='reactor'&&hpDamage(x)>0);assert.equal(pulse.length,r.e.enemies.length);for(const x of pulse)near(hpDamage(x),E.resolveElementDamage(rs.atk*.75*power*critFactor(x,rs),'fire',rs.elementAttack.fire,0,[]));
 const layer=r.e.playerShieldLayers.layers.find(l=>l.ownerItemId===r.item.id);near(layer.capacity,rs.hp*.08*power+rs.shieldBonus);assert.equal(layer.expiresAt-r.e.playerShieldLayers.clock,3000);
 const restored=copy(r);assert.deepEqual(semantic(tick(r,123)),semantic(tick(restored,123)),'JSON resume does not redouble pulse');
 const replacement=E.legendaryItem('everburning-reactor',100);r.s.inventory.push(replacement);assert(E.equipItem(r.s,replacement.id));assert(!r.e.playerShieldLayers.layers.some(l=>l.ownerItemId===r.item.id));assert(!r.s.equipmentRuntime.byId[r.item.id]);
}
console.log('PASS v094 actual dwarf fifth-hit penetration, timed AoE/shield, owner removal and JSON continuation, normal/raw-v1/raw-v2.');

// Human mark detonation and authored equipment bleed both settle actual HP loss.
for(const model of models){const power=model?2:1,f=setup('human','human-oathblade',model,'human.cut'),st=E.stats(f.s);let proc,bleed;
 for(let i=0;i<12&&(!proc||!bleed);i++)for(const event of tick(f)){if(event.skillId==='human-oathblade'&&event.kind==='legend')proc??=event;if(event.skillId==='human-oathblade'&&event.kind==='dot')bleed??=event;}
 assert(proc&&bleed,'actual mark detonates and scheduled bleed ticks');near(hpDamage(proc),Math.round(st.atk*.8*power*critFactor(proc,st)));near(hpDamage(bleed),Math.round(st.atk*.08*power));
 const b=setup('human','human-banner-armor',model),bs=E.stats(b.s),u=b.e.enemies[0];b.e.shield=20;b.e.heroHp=50;
 const events=captureCombatDisplay(b.e,()=>applyEnemyDamageSegment(b.s,b.e,1000,{sourceId:u.id,element:'fire'},{st:bs,resolveElementDamage:E.resolveElementDamage,logs:[]})).events;
 const reflection=events.find(x=>x.skillId==='human-banner-armor');assert(reflection);near(hpDamage(reflection),70*.5*power);assert.equal(reflection.crit,false);assert.equal(b.e.heroHp,0);assert.equal(b.e.activeCastCount,0,'lethal reflection does not count a cast');
}
console.log('PASS v094 actual human detonation, bleeding, capped shield+HP reflection and no recursive active cast.');

// Elf effects compare actual same-seed combat after accounting for ordinary base-stat doubling.
for(const model of models.filter(Boolean)){
 for(const charged of [false,true]){const d=setup('elf','elf-sixfold-heartwood',model,'elf.root_strike'),n=ordinaryCopy(d);
  if(charged)for(const f of [d,n]){const state=f.s.legendaryRuntime.byId[f.item.id].state;state.seenElements=['earth','water','fire','wind'];state.ready=true;}
  const ds=E.stats(d.s),ns=E.stats(n.s),dh=heroHits(tick(d,1),'elf.root_strike'),nh=heroHits(tick(n,1),'elf.root_strike');assert.equal(dh.length,2);assert.equal(nh.length,2);
  for(let i=0;i<2;i++){const expected=hpDamage(nh[i])*ds.atk/ns.atk*(charged?3/2:1)*(dh[i].element==='physical'?1:1.6/1.3);near(hpDamage(dh[i]),expected,2);}
  assert.equal(d.s.legendaryRuntime.byId[d.item.id].state.pendingCastId,null);
 }
 const d=setup('elf','elf-last-string',model,'elf.twin_arrow'),n=ordinaryCopy(d),ratio=E.stats(d.s).atk/E.stats(n.s).atk;
 const dh=heroHits(tick(d,1),'elf.twin_arrow'),nh=heroHits(tick(n,1),'elf.twin_arrow');assert.equal(dh.length,3);assert.equal(nh.length,3);for(let i=0;i<3;i++)near(hpDamage(dh[i]),hpDamage(nh[i])*ratio*(i===2?2/1.5:1),2);
 const a=setup('elf','elf-last-string',model,'elf.hunter_mark'),b=ordinaryCopy(a);a.e.enemies[0].armor=500;b.e.enemies[0].armor=500;const as=E.stats(a.s),bs=E.stats(b.s),ah=heroHits(tick(a,1),'elf.hunter_mark')[0],bh=heroHits(tick(b,1),'elf.hunter_mark')[0];assert(ah&&bh);near(hpDamage(ah),hpDamage(bh)*as.atk/bs.atk*(100+Math.max(0,500*.7-bs.penetration))/(100+Math.max(0,500*.4-as.penetration)),2);
}
console.log('PASS v094 actual elf mixed-element bonus, charged x3 vs x2, final segment +100% vs +50%, 60% vs 30% armor ignore.');

// Goblin first-target shield theft and fallback are independent and occur only once.
for(const model of models){const power=model?2:1;
 for(const shield of [0,100,1e8]){const f=setup('goblin','goblin-silent-ration',model),st=E.stats(f.s),u=f.e.enemies[0];u.shield=shield;u.shieldUntil=T+100000;const events=tick(f,1),effect=events.filter(x=>x.skillId==='goblin-silent-ration');
  if(shield){const theft=effect.find(x=>x.targetId===u.id&&x.kind==='shield');assert(theft);near(-theft.shieldDelta,Math.min(shield*.4*power,st.hp*.08*power));const layer=f.e.playerShieldLayers.layers.find(l=>l.ownerItemId===f.item.id);near(layer.capacity,Math.min(shield*.4*power,st.hp*.08*power)+st.shieldBonus);assert.equal(layer.expiresAt-f.e.playerShieldLayers.clock,6000);}
  else{const stab=effect.find(x=>x.kind==='legend');assert(stab);near(hpDamage(stab),Math.round(st.atk*.7*power*critFactor(stab,st)));}
  assert(!tick(f,1).some(x=>x.skillId==='goblin-silent-ration'),'same target never grants second opening');
 }
 const boots=setup('goblin','goblin-silent-steps',model);assert.equal(E.stats(boots.s).dodgeRating,100*power);near(E.stats(boots.s).dodge,power===2?1/3:.25);
 const ordinary=E.legendaryItem('goblin-silent-steps',100);boots.s.inventory.push(ordinary);assert(E.equipItem(boots.s,ordinary.id));assert.equal(E.stats(boots.s).dodgeRating,100,'divine copy in bag cannot boost normal owner');assert(E.equipItem(boots.s,boots.item.id));assert.equal(E.stats(boots.s).dodgeRating,100*power);
}
// Real E.step enemy attack rolls consume the larger diminishing-return dodge value.
{const d=setup('goblin','goblin-silent-steps','raw-v2'),n=ordinaryCopy(d);for(const f of [d,n]){for(const u of f.e.enemies)u.nextBasicAt=T;}
 let missesD=0,missesN=0;for(let seed=1;seed<=320;seed++){for(const [f,isDivine]of [[d,true],[n,false]]){const c=copy(f);c.e.rngState=seed*7919;let event;for(let turn=0;turn<5&&!event;turn++)event=tick(c).find(x=>x.targetId==='hero'&&c.e.enemies.some(u=>u.id===x.sourceId)&&['hit','miss'].includes(x.outcome));assert(event);if(event.outcome==='miss'){if(isDivine)missesD++;else missesN++;}}}assert(missesD>missesN+12,`${missesD} divine misses vs ${missesN} normal`);assert(missesD<150,'200 rating is not guaranteed evasion');}
console.log('PASS v094 actual goblin theft percent/cap/duration, fallback damage, target once, swap isolation and battle dodge rolls.');

// Ashen: actual resource spending builds magnitudes, never counters or resource caps.
for(const model of models){const power=model?2:1;
 const m=setup('ashen','ashen-molten-core',model,'ashen.vent');m.e.raceRuntime={race:'ashen',state:{...getRacePack('ashen').createRuntime(),heat:40}};const base=E.baseStats(m.s).atk;tick(m,1);assert.equal(m.e.raceRuntime.state.heat,0);const row=m.s.legendaryRuntime.byId[m.item.id];assert.equal(row.state.stacks,1);assert.equal(row.state.remainder,10);near(E.baseStats(m.s).atk,base*(1+.2*power));assert.equal(row.state.expiresAt-row.clock,6000);
 // Actual shield-break listener heals 4%/8%, refunds 2/4 and clamps at the racial cap of six.
 for(const shards of [0,5]){const r=setup('ashen','ashen-stone-core',model);r.e.heroHp=E.stats(r.s).hp/2;r.s.heroHp=r.e.heroHp;r.e.raceRuntime={race:'ashen',state:{...getRacePack('ashen').createRuntime(),shards}};r.e.playerShieldLayers=grantPlayerShieldLayer(createPlayerShieldLayers(),{source:'test-shield',capacity:1,durationMs:60000,clock:0,hp:r.e.heroHp}).state;for(const u of r.e.enemies){u.atk=u.elementalPower=100;u.nextBasicAt=T;}
  let heal;for(let i=0;i<8&&!heal;i++)heal=tick(r,1).find(x=>x.kind==='heal'&&x.skillId==='ashen-stone-core');assert(heal);near(heal.hpDelta,E.stats(r.s).hp*.04*power);assert.equal(r.e.raceRuntime.state.shards,Math.min(6,shards+2*power));const record=r.s.legendaryRuntime.byId[r.item.id];assert.equal(record.state.readyAt-record.clock,8000);
 }
 const c=setup('ashen','ashen-crystal-core',model);for(const u of c.e.enemies){u.armor=1e8;u.elementResistance.light=1e8;}
 for(let turn=0;turn<27;turn++)assert(!tick(c,1).some(x=>x.skillId==='ashen-prism-beam'));
 const cs=E.stats(c.s),beam=heroHits(tick(c,1),'ashen-prism-beam')[0];assert(beam);near(hpDamage(beam),E.resolveElementDamage(cs.atk*2*power*critFactor(beam,cs),'light',cs.elementAttack.light,0,[]));assert.equal(c.e.activeCastCount,1);assert.deepEqual(c.s.skillTree.presets[0].active,[null,null,null,null]);const cr=c.s.legendaryRuntime.byId[c.item.id];assert.equal(cr.state.readyAt-cr.clock,30000);
 const saved=copy(c);assert.deepEqual(semantic(tick(c,19)),semantic(tick(saved,19)),'crystal resumes without immediate extra beam');
}
console.log('PASS v094 actual ashen heat stacks, shield-break heal/resource cap, 30s armor/resistance-bypassing beam, raw-v1/v2 JSON parity.');


// The three named exclusions retain their exclusive values, while their bases still double.
for(const model of models){
 const g=setup('dwarf','infinity-gauntlet',model,'bellows_ward'),target=g.e.enemies[0];
 for(let cast=1;cast<=5;cast++){g.e.treeSkillCooldowns={};if(g.e.treeEffects)g.e.treeEffects.hero.sources=[];if(g.e.playerShieldLayers)g.e.playerShieldLayers.layers=[];const events=tick(g,1);const snap=events.find(x=>x.skillId==='infinity-snap');assert.equal(!!snap,cast===5);if(snap)near(hpDamage(snap),target.max*.5);}
 assert.equal(g.s.equipmentRuntime.byId[g.item.id].castCount,0);near(target.hp,target.max*.5);assert.equal(E.itemTotals(g.item).atk,g.item.atk*(model?2:1));
 const r=setup('dwarf','return-ring',model);r.e.heroHp=r.s.heroHp=E.stats(r.s).hp*.4;for(const u of r.e.enemies)u.hp=1;for(let i=0;i<10&&!r.e.done;i++)tick(r,1);assert(r.e.done&&r.e.win);const before=r.s.heroHp;E.reward(r.s,r.e,r.s.lastHealthClock);near(r.s.heroHp,Math.min(E.stats(r.s).hp,before+E.stats(r.s).hp*.15));assert.equal(returnRingExperienceBonus(r.s),.2);for(const pool of ['boss-legendary','material-special','material-gem'])assert.equal(returnRingRareBonus(r.s,pool),.03);assert(E.validSave(r.s));assert.equal(E.itemTotals(r.item).hp,r.item.hp*(model?2:1));
 const p=setup('ashen','ashen-primal-core',model),boosted=E.stats(p.s).atk;p.s.skillTree.presets[0].active[0]='ashen.kindle';near(E.stats(p.s).atk,boosted/2);p.s.skillTree.presets[0].active[0]=null;const basic=heroHits(tick(p,1),'basic')[0];assert(basic);near(hpDamage(basic),Math.round(boosted*critFactor(basic,E.stats(p.s))));assert.equal(E.itemTotals(p.item).atk,p.item.atk*(model?2:1));
}
console.log('PASS v094 excluded actual gauntlet fifth-cast50%, Return Ring15% heal/20% XP/3pp rare drops, primal empty-slot x2; base doubling preserved.');
// The casino legend also upgrades in-place from a real old divine save.
for(const model of ['raw-v1','raw-v2']){
 const f=setup('dwarf','lucky-dice',model),naked=copy(f).s;naked.equip.amulet=null;const st=E.stats(f.s),base=E.stats(naked);
 assert.equal(st.atk-base.atk,66);assert.equal(st.hp-base.hp,666);assert.equal(st.luck-base.luck,66);assert.equal(st.critRating-base.critRating,66);
 const seen=new Set();for(let seed=0;seed<20000&&seen.size<4;seed++){let rng=seed;const draw=()=>((rng=(Math.imul(rng,1664525)+1013904223)>>>0)/2**32);const hit=draw(),roll=draw(),crit=draw();if(hit>=st.hit||crit<st.crit)continue;const outcome=roll<.33?'low':roll<.66?'high':roll<.99?'normal':'jackpot';if(seen.has(outcome))continue;
  const expected={outcome,multiplier:outcome==='low'?.75:outcome==='high'?1.5:1,fixedDamage:outcome==='jackpot'?6666:null},trial=copy(f);tick(trial,seed);assert.deepEqual(trial.e.lastCast.luckyDice,expected);assert.equal(trial.e.lastCast.hits[0].actualHpLost,expected.fixedDamage??Math.round(st.atk*expected.multiplier));seen.add(outcome);
 }assert.equal(seen.size,4,'every old-divine dice outcome exercised');
}
console.log('PASS v094 genuine old-divine dice immediately has 66/666 fixed stats, 75%/150%/100%/6666 actual damage outcomes.');

// Frozen old-save online/offline continuation exercises refresh without re-blessing.
for(const model of ['raw-v1','raw-v2'])for(const [race,id]of Object.entries({dwarf:'everburning-reactor',human:'human-oathblade',elf:'elf-sixfold-heartwood',goblin:'goblin-silent-ration',ashen:'ashen-crystal-core'})){
 const f=setup(race,id,model),originalInventory=JSON.stringify(f.s.inventory),originalStones=JSON.stringify(f.s.divineStones);let online=copy(f).s,offline=copy(f).s;
 for(let turn=0;turn<30;turn++){const at=online.nextActionAt;E.step(online,online.activeEncounter,at);E.settleRest(online,at);online.lastSeen=at;E.offline(offline,at);for(const key of ['heroHp','legendaryRuntime','equipmentRuntime','activeEncounter','nextActionAt'])assert.deepEqual(offline[key],online[key],`${model}/${race} old-save online/offline ${key}`);assert(E.validSave(online));assert(E.validSave(offline));assert.equal(JSON.stringify(online.inventory),originalInventory);assert.equal(JSON.stringify(offline.inventory),originalInventory);assert.equal(JSON.stringify(offline.divineStones),originalStones);online=JSON.parse(JSON.stringify(online));offline=JSON.parse(JSON.stringify(offline));}
}
console.log('PASS v094 genuine v093 already-divine frozen saves: all enhanced combat cases above load historical raw-v1/v2, three storage refreshes, five-race online/offline JSON continuation, no new blessing or divine-stone operation.');
Math.random=originalRandom;
console.log('PASS independent v094 production combat QA: all eleven ordinary legendary identities and all three exclusive-effect exclusions. Dice and exact reducer timing boundaries have separate v094 suites.');
