/** Production transactions only. No grants, parameter edits, HP refill, or instant offline crafting. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const args=Object.fromEntries(process.argv.slice(2).map(a=>a.replace(/^--/,'').split('=')));
const root=path.resolve(args['engine-root']??new URL('.',import.meta.url).pathname);
const races=(args.races??'human,dwarf,elf,goblin,ashen').split(',');
const seeds=(args.seeds??'1917,8675309,739').split(',').map(Number);
const hours=Number(args.hours??.5),shopping=args.shopping!=='0',develop=args.develop!=='0';
assert(hours>0&&hours<=168);
if(!args.single){
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'natural-onramp-')),rows=[];
 for(const race of races)for(const seed of seeds){const out=path.join(tmp,`${race}-${seed}.json`);const child={...args,'engine-root':root,races:race,seeds:seed,single:1,out};execFileSync(process.execPath,[new URL(import.meta.url).pathname,...Object.entries(child).map(([k,v])=>`--${k}=${v}`)],{stdio:'inherit'});rows.push(JSON.parse(fs.readFileSync(out)));if(args.out)fs.writeFileSync(args.out,JSON.stringify({policy:'Separate process per race/seed; each result carries policy and exact source revision.',rows},null,2));}
 if(!args.out)console.log(JSON.stringify({rows},null,2));process.exit(0);
}
assert.equal(races.length,1);assert.equal(seeds.length,1);
const runtimeHash=createHash('sha256');for(const file of fs.readdirSync(path.join(root,'dist')).filter(x=>x.endsWith('.js')).sort()){runtimeHash.update(file);runtimeHash.update(fs.readFileSync(path.join(root,'dist',file)));}const runtimeSha256=runtimeHash.digest('hex');
const E=await import(pathToFileURL(path.join(root,'dist/engine.js')));
const T=await import(pathToFileURL(path.join(root,'dist/skill-tree-state.js')));
const R=await import(pathToFileURL(path.join(root,'dist/race-registry.js')));
// xorshift32 deliberately differs from encounter's internal LCG; serials reset by child process.
let z=(seeds[0]^0x9e3779b9)>>>0||1;
Math.random=()=>{z^=z<<13;z^=z>>>17;z^=z<<5;return (z>>>0)/4294967296;};
const START=1700000000000,END=START+hours*3600000;let now=START;Date.now=()=>now;
const s=E.fresh(races[0]);E.normalizeHealth(s,now);E.normalizeExpedition(s);E.normalizeMaterials(s);E.normalizePotions(s);
if(args['require-naked']==='1')assert.equal(s.inventory.length,0,'new game must not grant starter equipment');
const initialIds=new Set(s.inventory.map(i=>i.id)),counts={wins:0,deaths:0,rests:0,steps:0,dungeonAttempts:0,dungeonClears:0};
const ledger={initialGold:s.gold,rewardGold:0,saleGold:0,equipmentGold:0,recipeGold:0,potionCraftGold:0,craftedPotions:0,consumedPotions:0};
const events=[],dungeons=[],checkpoints=[];let firstBattle=null,firstGear=null,firstUsefulGear=null,firstWeapon=null,firstDungeonClear=null,restMs=0,nextReview=START,firstLevel100=null;
const sockets=R.raceSockets(s.race),build=args.build??'balanced';
const score=it=>{if(!it)return 0;const t=E.itemTotals(it);return t.atk+(build==='defense'?t.hp/9+t.armor: t.hp/15+t.armor*.65)+it.affixes.reduce((a,b)=>a+(['lifesteal','hit','crit'].includes(b.stat)?b.value*.3:0),0);};
const record=extra=>({seconds:(now-START)/1000,level:s.level,wins:counts.wins,...extra});
const potions=()=>E.potionEntries(s).filter(p=>p.type==='healing').reduce((a,p)=>a+p.count,0);
function equip(){
 for(const slot of sockets){const old=s.inventory.find(i=>i.id===s.equip[slot]);const best=s.inventory.filter(i=>i.slot===(E.SOCKET_TYPE[slot]??slot)&&(!Object.values(s.equip).includes(i.id)||i.id===old?.id)).sort((a,b)=>score(b)-score(a))[0];
 if(best&&best.id!==old?.id&&score(best)>score(old)*1.03){assert(E.equipItem(s,best.id,slot));const ev=record({kind:'equip',slot,item:best.id,itemLevel:best.level,quality:best.rarity,source:best.levelSource,previous:old?.id??null});events.push(ev);if(!initialIds.has(best.id))firstUsefulGear??=ev;if(slot==='weapon'&&!initialIds.has(best.id))firstWeapon??=ev;}}
}
function skills(){
 const sequence=build==='defense'?['heart','steel','power','steel']:['power','heart','power','steel'];
 while(E.availableTalentPoints(s)>0){const spent=Object.values(s.talents).reduce((a,b)=>a+b,0);assert(E.spendTalent(s,sequence[spent%4]));}
 const config=R.getSkillTreeDefinition(s),heal=n=>/dressing|mend|renewal|recovery|forge_breath|salve|patch_ration/.test(n.id)&&n.kind==='active';
 const ordered=[...config.nodes.filter(n=>heal(n)&&!n.requires.length),...config.nodes].filter((n,i,a)=>a.findIndex(x=>x.id===n.id)===i);
 const change=c=>{const q=T.quoteSkillTreeChange(s,config,c);if(!q)return false;const p=T.prepareSkillTreeChange(s,q,config);assert(p);Object.assign(s,p.game);return true;};
 // A support player saves points for a root heal instead of buying an unaffordable future skill.
 const p0=s.skillTree.presets[s.skillTree.selectedPreset],desired=ordered.find(heal);
 if(!(build==='support'&&desired&&!p0.unlocked.includes(desired.id)&&T.skillPointBudget(s)-T.skillPresetCost(p0,config)<desired.cost))for(const n of ordered)change({type:'unlock',skillId:n.id});
 const preset=s.skillTree.presets[s.skillTree.selectedPreset],chosen=kind=>ordered.filter(n=>n.kind===kind&&preset.unlocked.includes(n.id)).map(n=>n.id),pad=(a,n)=>Array.from({length:n},(_,i)=>a[i]??null);
 change({type:'slots',active:pad(chosen('active'),4),passive:pad(chosen('passive'),2)});
 E.reconcileSkillTreeHealth(s);
}
function review(){
 // Pause only at completed field battles / completed dungeon runs. No camp healing is granted.
 assert(!s.activeEncounter||s.activeEncounter.done);assert(!s.dungeonRun);
 s.running=false;equip();if(develop)skills();
 if(shopping){
  const m=E.ensureMerchant(s,now);assert(m);
  for(const o of m.offers)if(o.type==='recipe'&&o.recipeId==='potion-healing'&&o.stock&&o.price<=s.gold&&!E.recipeKnown(s,o.recipeId)){const before=s.gold;assert(E.purchaseRecipe(s,o.offerId,m.revision,now));ledger.recipeGold+=before-s.gold;events.push(record({kind:'recipe',price:before-s.gold}));}
  for(const o of m.offers.filter(o=>o.type==='equipment'&&o.stock).sort((a,b)=>score(b.item)/b.price-score(a.item)/a.price)){
   const slots=sockets.filter(k=>(E.SOCKET_TYPE[k]??k)===o.item.slot);const upgrade=slots.some(k=>score(o.item)>score(s.inventory.find(i=>i.id===s.equip[k]))*1.15);
   const cap=now-START<1800000?s.gold*.8:s.gold*.25;
   if(upgrade&&o.price<=cap){const before=s.gold;assert(E.purchaseEquipment(s,o.offerId,m.revision,now));ledger.equipmentGold+=before-s.gold;firstGear??=record({kind:'purchase',slot:o.item.slot,itemLevel:o.item.level});events.push(record({kind:'purchase',price:before-s.gold,slot:o.item.slot,item:o.item.id}));equip();}
  }
 }
 // Sell only genuinely unused equipment using the game's protected-item transaction.
 for(const slot of E.SLOTS){const q=E.quoteBatchSale(s,slot,[0,1,2,3]);if(q?.count){const r=E.executeBatchSale(s,q);assert(r);ledger.saleGold+=r.gold;}}
 if(E.recipeKnown(s,'potion-healing'))for(let q=3;q>=0;q--){let need=Math.min(100-potions(),Math.floor(s.gold/(q+1)));const inputs=[];for(const row of E.eligibleRecoveryMaterials(s,q)){const quantity=Math.min(row.count,need);if(quantity>0){inputs.push({key:row.key,quantity});need-=quantity;}}if(inputs.length){const quote=E.quoteRecoveryRecipe(s,q,inputs);if(quote){const result=E.craftRecoveryRecipe(s,quote);assert(result);ledger.potionCraftGold+=quote.gold;ledger.craftedPotions+=result.quantity;}}}
 E.setPotionAuto(s,true);const owned=E.potionEntries(s).filter(x=>x.type==='healing').sort((a,b)=>a.quality-b.quality);E.equipPotion(s,owned[0]?.key??null);
 const unlocked=Math.max(...E.getAreaProgress(s,s.race).unlocked),area=Math.min(unlocked,Math.max(1,Math.floor((s.level-1)/10)+1)),site=`${s.race}.a${String(area).padStart(2,'0')}`;
 const dungeon=args.route!=='field'&&s.level>=(area-1)*10+Number(args['dungeon-level']??5);
 assert(E.configureExpedition(s,{mode:dungeon?'dungeon':'field',targetInstanceId:dungeon?site+'.dungeon':null,fieldId:site+'.field',loop:dungeon},now));
 checkpoints.push(record({gold:s.gold,hp:s.heroHp,maxHp:E.stats(s).hp,atk:E.stats(s).atk,armor:E.stats(s).armor,gearCount:Object.values(s.equip).filter(Boolean).length,potions:potions(),recipe:E.recipeKnown(s,'potion-healing'),route:s.expedition.mode,activeSkills:[...s.skillTree.presets[s.skillTree.selectedPreset].active]}));
 nextReview=now+(now-START<1800000?120000:900000);s.running=true;assert(E.validSave(s));
}
review();let encounterStart=null,seenRun=new Set(),runStarts=new Map();
while(now<END){
 if(E.worldEventsDue(s,now))E.advanceWorldEvents(s,now);
 if(s.restUntil>0){const next=Math.min(END,s.restUntil);restMs+=Math.max(0,next-now);now=next;E.settleRest(s,now);if(now>=END)break;s.running=true;}
 if(!s.activeEncounter&&!s.dungeonRun&&now>=nextReview)review();
 now=Math.max(now,s.nextBattleAt??0);if(now>=END)break;
 let e=s.activeEncounter;
 if(!e){e=E.startRoutedEncounter(s,now);if(!e){if(s.restUntil>0)continue;throw Error('Route blocked without a battle/rest: '+JSON.stringify({level:s.level,expedition:s.expedition,now}));}encounterStart={at:now,hp:e.heroHp,kind:e.kind,stage:e.dungeonStage,runId:e.runId,inventory:new Set(s.inventory.map(i=>i.id))};if(e.runId&&!seenRun.has(e.runId)){seenRun.add(e.runId);runStarts.set(e.runId,{at:now,hp:e.heroHp,level:s.level,stages:[]});counts.dungeonAttempts++;}}
 const next=Math.max(now,s.nextActionAt??now+1100);if(next>END){now=END;break;}now=next;
 if(E.worldEventsDue(s,now))E.advanceWorldEvents(s,now);
 const pBefore=potions(),hadRest=s.restUntil>0;E.step(s,e,now);ledger.consumedPotions+=pBefore-potions();counts.steps++;
 if(!hadRest&&s.restUntil>0)counts.rests++;
 if(!e.done)continue;
 const battle=record({win:e.win,kind:e.kind,stage:e.dungeonStage,runId:e.runId,durationSeconds:(now-encounterStart.at)/1000,hpBefore:encounterStart.hp,hpAfter:e.heroHp,enemies:e.enemies.map(u=>u.definitionId)});firstBattle??=battle;if(e.runId)runStarts.get(e.runId)?.stages.push(battle);
 if(e.win){counts.wins++;const gold=s.gold;E.reward(s,e,now);assert(e.rewarded);ledger.rewardGold+=s.gold-gold;
  for(const it of s.inventory.filter(i=>!encounterStart.inventory.has(i.id))){const loot=record({kind:'drop',slot:it.slot,item:it.id,itemLevel:it.level,quality:it.rarity});firstGear??=loot;events.push(loot);}
  if(e.kind==='dungeon'&&e.dungeonStage===3){counts.dungeonClears++;const run=runStarts.get(e.runId),full={...battle,entryLevel:run.level,entryHp:run.hp,fullDurationSeconds:(now-run.at)/1000,stages:run.stages};firstDungeonClear??=full;dungeons.push(full);}
 }else{counts.deaths++;if(e.kind==='dungeon'){const run=runStarts.get(e.runId);dungeons.push({...battle,entryLevel:run.level,entryHp:run.hp,fullDurationSeconds:(now-run.at)/1000,stages:run.stages});}assert(s.restUntil>now);}
 // Immediate equipment inspection is reasonable early play; no points/skills/shop during an active run.
 if(!s.dungeonRun){s.running=false;equip();s.running=true;}
 if(s.level===100)firstLevel100??=(now-START)/3600000;
 assert(E.validSave(s));
}
s.lastSeen=now;assert(E.validSave(s));
assert.equal(s.gold,ledger.initialGold+ledger.rewardGold+ledger.saleGold-ledger.equipmentGold-ledger.recipeGold-ledger.potionCraftGold,'all gold flows reconcile');
const result={source:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),root,runtimeSha256,sourceDirty:execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim(),race:s.race,seed:seeds[0],hours,policy:{shopping,develop,build,route:args.route??'cautious',dungeonLevel:Number(args['dungeon-level']??5),reviews:'2 minutes first30m then15m, safe field/dungeon boundaries; beneficial drops equipped after each completed field/run',initialGold:ledger.initialGold,initialEquipment:initialIds.size,rng:'xorshift32(seed XOR 0x9e3779b9), independent process/serial',noGrants:true},firstBattle,firstGear,firstUsefulGear,firstWeapon,firstDungeonClear,firstLevel100,counts,restSeconds:restMs/1000,restFraction:restMs/(hours*3600000),ledger,final:{level:s.level,gold:s.gold,hp:s.heroHp,stats:E.stats(s),potions:potions(),recipe:E.recipeKnown(s,'potion-healing'),progress:E.getAreaProgress(s,s.race),materials:E.materialEntries(s).reduce((n,r)=>n+r.count,0)},dungeons,checkpoints,events};
if(args.save)fs.writeFileSync(args.save,JSON.stringify(s));
if(args.out)fs.writeFileSync(args.out,JSON.stringify(result,null,2));else console.log(JSON.stringify(result,null,2));
console.error(JSON.stringify({race:s.race,seed:seeds[0],hours,level:s.level,...counts,firstGear:firstGear?.seconds,firstClear:firstDungeonClear?.seconds,restFraction:result.restFraction,potions:ledger.consumedPotions,gold:s.gold}));
