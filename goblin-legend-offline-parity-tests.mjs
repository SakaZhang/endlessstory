import assert from 'node:assert/strict';import{pathToFileURL}from'node:url';const root=process.env.TREE_HOST_ROOT??'/workspace/scratch/81f4d6a709c0/pixel-rpg-live-hotfix',imp=f=>import(pathToFileURL(root+'/dist/'+f));const E=await imp('engine.js'),{getRacePack}=await imp('race-registry.js'),{captureCombatDisplay}=await imp('combat-display-bridge.js');
const pack=getRacePack('goblin');
function setup(legend,active){const s=E.fresh('goblin');s.level=100;for(const socket of Object.keys(s.equip)){const it=E.item(socket.startsWith('ring')?'ring':socket,100,null,2,{originRace:'goblin'});it.special=null;s.inventory.push(it);E.equipItem(s,it.id,socket);}const prior=s.equip[legend.includes('silent')?'weapon':'amulet'],item=E.legendaryItem(legend,100);s.inventory.push(item);E.equipItem(s,item.id);s.skillTree.presets[0].unlocked=pack.tree.nodes.map(n=>n.id);s.skillTree.presets[0].active=active;E.normalizeHealth(s,s.lastSeen);E.normalizeExpedition(s);s.areaProgress.goblin={unlocked:[1,2,3,4,5,6,7,8,9,10],cleared:[1,2,3,4,5,6,7,8,9]};s.heroHp=E.stats(s).hp;assert(E.validSave(s));return{s,item,prior};}
const blade='goblin-silent-ration',spring='goblin-returning-spring';

const seed=n=>()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/2**32};
const originalRandom=Math.random,originalNow=Date.now;Date.now=()=>1800000000000;
try{
 for(const kind of ['shield-theft','fallback-and-miss']){
  Math.random=seed(61027);const{s,item:bladeItem}=setup(blade,['goblin.opening_cut','goblin.dust_escape','goblin.rattle_decoy','goblin.patch_ration']);
  const springItem=E.legendaryItem(spring,100);s.inventory.push(springItem);E.equipItem(s,springItem.id);let e;
  if(kind==='shield-theft')for(let stage=1;stage<=3;stage++){
   e=E.startInstanceEncounter(s,'goblin.a04.dungeon',Math.max(s.lastHealthClock,s.nextBattleAt??0));assert(e);if(stage<3){while(!e.done)E.step(s,e,s.nextActionAt);assert(e.win);E.reward(s,e,s.lastHealthClock);}
  }else e=E.startInstanceEncounter(s,'goblin.a09.boss',s.lastSeen);
  if(kind==='shield-theft')assert(e.enemies[0].shield>0);else assert.equal(e.enemies[0].shield??0,0);
  e.rngState=7919;E.normalizePotions(s);s.running=true;s.lastSeen=s.lastHealthClock;const online=JSON.parse(JSON.stringify(s)),off=JSON.parse(JSON.stringify(s));
  let thefts=0,stabs=0,rewinds=0,turn=0;const initialGold=s.gold;let lastEncounter;
  while(online.activeEncounter&&!online.activeEncounter.done&&turn<300){
   turn++;lastEncounter=online.activeEncounter;const offlineEncounter=off.activeEncounter;const at=online.nextActionAt,oe=online.activeEncounter,oldReady=online.legendaryRuntime.byId[springItem.id].state.nextReadyAt;
   const shadow=JSON.parse(JSON.stringify(online));shadow.legendaryRuntime.byId[springItem.id].state.nextReadyAt=1e12;E.step(shadow,shadow.activeEncounter,at);
   Math.random=seed(10000+turn);const batch=captureCombatDisplay(oe,()=>E.step(online,oe,at));
   thefts+=batch.events.filter(v=>v.skillId===blade&&v.shieldDelta<0).length;
   stabs+=batch.events.filter(v=>v.skillId===blade&&v.hpDelta<0).length;
   if(online.legendaryRuntime.byId[springItem.id].state.nextReadyAt>oldReady){
    rewinds++;const diffs=Object.keys(oe.treeSkillCooldowns).map(id=>(shadow.activeEncounter.treeSkillCooldowns[id]??0)-(oe.treeSkillCooldowns[id]??0)).filter(Boolean);
    assert.equal(diffs.length,1);assert(diffs[0]>0&&diffs[0]<=2);assert.equal(online.legendaryRuntime.byId[springItem.id].state.nextReadyAt-online.legendaryRuntime.byId[springItem.id].clock,6600);
   }
   if(oe.done&&oe.win)E.reward(online,oe,at);E.settleRest(online,at);online.lastSeen=at;
   Math.random=seed(10000+turn);E.offline(off,at);
   for(const key of ['heroHp','kills','gold','xp','level','materialStacks','potionStacks','nextActionAt','legendaryRuntime','normalWins','bossWins'])assert.deepEqual(off[key],online[key],kind+':'+key+':'+turn);
   const itemMetadata=state=>state.inventory.map(({id,...metadata})=>metadata);assert.deepEqual(itemMetadata(off),itemMetadata(online),kind+':reward inventory metadata, omitting generated IDs only');
   assert.deepEqual(off.activeEncounter,online.activeEncounter,kind+':active encounter');assert.deepEqual(offlineEncounter,lastEncounter,kind+':entire encounter incl HP/shield/CD/proc state/reward receipt');
   assert(E.validSave(JSON.parse(JSON.stringify(online))));assert(E.validSave(JSON.parse(JSON.stringify(off))));
  }
  assert(lastEncounter.done&&lastEncounter.win);assert(online.gold>initialGold);assert(lastEncounter.rewarded);
  if(kind==='shield-theft')assert(thefts>0);else{assert(stabs>0);assert(rewinds>0);}
  console.log('PASS targeted Goblin legendary online/offline JSON continuation',JSON.stringify({kind,turn,thefts,stabs,rewinds,goldDelta:online.gold-initialGold,ledger:online.legendaryRuntime,loot:lastEncounter.lootSummary}));
 }
}finally{Math.random=originalRandom;Date.now=originalNow;}
