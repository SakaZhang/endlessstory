import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {PLAYABLE_RACES} from './dist/race-registry.js';
import {commitGameTransaction,SAVE_KEY,loadProgress} from './dist/storage.js';
import {casinoFixture,casinoSeedForTicket} from './casino-test-fixture.mjs';
import {casinoInputs,quoteCasino,wagerCasino,casinoEquipmentEligible} from './dist/casino.js';
import {validCasinoState,normalizeCasinoState,drawCasinoTicket,casinoOutcome} from './dist/casino-state.js';
import {browseCasinoInputs,renderCasino,renderCasinoReceipt,freshCasinoBrowser} from './dist/casino-ui.js';
const counts={downgrade:0,upgrade:0,same:0,legendary:0};for(let n=0;n<100;n++){counts[casinoOutcome(n)]++;const c={rng:casinoSeedForTicket(n)};assert.equal(drawCasinoTicket(c),n);}assert.deepEqual(counts,{downgrade:33,upgrade:33,same:33,legendary:1});
for(const n of [-1,100,NaN,.5])assert.equal(casinoOutcome(n),null);
{const c={rng:casinoSeedForTicket(4294967295)},first=(Math.imul(c.rng,1664525)+1013904223)>>>0;assert.equal(first,4294967295);const ticket=drawCasinoTicket(c);assert(c.rng<4294967200);assert.equal(ticket,c.rng%100);assert.notEqual(c.rng,first,'biased uint32 tail must be rejected');}
for(const race of PLAYABLE_RACES)for(const kind of ['material','equipment'])for(const quality of [0,1,2,3])for(const ticket of [0,32,33,65,66,98,99]){
 const {game:s,selection}=casinoFixture({race,kind,quality,ticket}),input=structuredClone(s.inventory[0]),before=structuredClone(s),quote=quoteCasino(s,selection),random=Math.random;
 assert(quote.ok,JSON.stringify(quote));assert.deepEqual(s,before,'quote cannot mutate');Math.random=()=>{throw Error('global RNG touched');};let r;try{r=wagerCasino(s,quote,{now:10000});}finally{Math.random=random;}
 assert(r,`${race}/${kind}/${quality}/${ticket}`);assert.equal(r.outcome,casinoOutcome(ticket));assert.equal(s.gold,before.gold-100);assert.equal(s.casino.revision,1);assert(E.validSave(s));
 const output=s.inventory.find(it=>it.id===r.rewardId);assert(output);assert.notEqual(output.id,input.id);assert.equal(output.rarity,r.toQuality===4?3:r.toQuality);assert.equal(output.set,null);
 if(kind==='equipment'){assert(!s.inventory.some(it=>it.id===input.id));assert.equal(output.level,input.level);}else{assert.equal(s.materialStacks[selection.id],before.materialStacks[selection.id]-1);assert(s.inventory.some(it=>it.id===input.id));assert(output.level>=38&&output.level<=42);assert.equal(output.baseLevel,40);assert.equal(output.levelSource,'material');}
 if(ticket===99){assert.equal(output.legendaryId,'lucky-dice');assert.equal(output.atk,33);assert.equal(output.hp,333);assert.equal(output.affixes.length,0);assert(E.codexState(s,'lucky-dice').collected);}else{assert.equal(output.originRace,race);assert(!output.special?.growthKills);assert(!output.enhancement);assert(!output.divine);assert(!output.legendaryId);if(race!=='ashen')assert.notEqual(output.slot,'core');}
 const after=structuredClone(s);assert.equal(wagerCasino(s,quote,{now:10001}),null);assert.deepEqual(s,after,'stale/double submission cannot spend twice');assert.match(renderCasinoReceipt(r),/新装备已收入背包/);
}
// Same-quality means an entirely new item, including Q0/Q3 boundaries and sets.
{const {game:s,selection}=casinoFixture({ticket:66,quality:3});s.inventory[0]=E.item('weapon',29,'anvil',3);selection.id=s.inventory[0].id;const old=structuredClone(s.inventory[0]);const r=wagerCasino(s,quoteCasino(s,selection));assert(r);const result=s.inventory.find(it=>it.id===r.rewardId);assert.equal(result.set,null);assert.notEqual(result.id,old.id);assert.equal(result.level,old.level);}
// Equipped, locked, saved-loadout, pending, legendary, unique and story material input guards.
for(const mutate of [s=>s.inventory[0].locked=true,s=>s.equip.weapon=s.inventory[0].id,s=>{s.loadouts[0]={name:'保护方案',equip:{...s.equip,weapon:s.inventory[0].id},skills:[...s.skills],conditions:[...s.conditions]};},s=>s.inventory[0].legendaryId='lucky-dice',s=>s.inventory[0].unique=true,s=>s.inventory[0].protected=true]){const {game:s,selection}=casinoFixture();mutate(s);assert.equal(casinoEquipmentEligible(s,s.inventory[0]),false);assert(!quoteCasino(s,selection).ok);}
{const {game:s}=casinoFixture();for(const [id,m]of Object.entries(E.MATERIALS))if(m.uniqueHeld||m.storyOnly){const q=m.qualityRange?.[0]??3,key=E.materialKey(id,q);if(key)s.materialStacks[key]=1;}assert(casinoInputs(s).filter(r=>r.kind==='material').every(r=>!E.MATERIALS[r.material].uniqueHeld&&!E.MATERIALS[r.material].storyOnly));}
for(const kind of ['material','equipment'])for(const slot of ['amulet','helm']){const {game:s,selection}=casinoFixture({kind,full:slot}),before=structuredClone(s);assert(!quoteCasino(s,selection).ok);assert.deepEqual(s,before);}
// A consumed item frees its own slot before reserving all possible outputs.
{const {game:s,selection}=casinoFixture({full:'weapon'});s.inventory.pop();assert.equal(E.bagCounts(s).equipment.weapon,50);assert(quoteCasino(s,selection).ok);assert(wagerCasino(s,quoteCasino(s,selection)));assert(E.validSave(s));}
for(const change of [s=>s.gold=99,s=>s.running=true,s=>s.pendingForgeClaim={kind:'equipment',item:s.inventory[0]},s=>s.casino.rng=-1,s=>s.casino.revision=1e9]){const {game:s,selection}=casinoFixture();change(s);const before=structuredClone(s);assert(!quoteCasino(s,selection).ok);assert.equal(wagerCasino(s,quoteCasino(s,selection)),null);assert.deepEqual(s,before);}
// Recovery keeps original continuation/deadline/clocks untouched.
{const {game:s,selection}=casinoFixture();s.restUntil=Date.now()+300000;s.restResume=true;s.running=true;const deadline=s.restUntil;assert(E.validSave(s));assert(wagerCasino(s,quoteCasino(s,selection)));assert.equal(s.restUntil,deadline);assert(s.running&&s.restResume);}
// Storage rejection preserves input, outcome RNG, and exact retry-generated identity.
{const {game:s,selection}=casinoFixture({ticket:99}),before=structuredClone(s),quote=quoteCasino(s,selection),expected=structuredClone(s),receipt=wagerCasino(expected,quote,{now:100});let fail=true,raw=JSON.stringify(s);const storage={getItem:k=>k===SAVE_KEY?raw:null,setItem(k,v){if(fail)throw Error('quota');raw=v;},length:1,key:()=>SAVE_KEY};
 const rejected=commitGameTransaction(storage,s,x=>wagerCasino(x,quote,{now:100}),{now:100});assert.equal(rejected.reason,'storage');assert.deepEqual(s,before);fail=false;const tx=commitGameTransaction(storage,s,x=>wagerCasino(x,quote,{now:100}),{now:100});assert(tx.ok);assert.deepEqual(tx.value,receipt);assert.deepEqual(tx.game.inventory,expected.inventory);assert(validCasinoState(JSON.parse(raw)));const loaded=loadProgress(storage);assert(!loaded.blocked);assert.deepEqual(loaded.game.casino,tx.game.casino);assert.equal(wagerCasino(loaded.game,quote),null);
}
// Old save initialization is deterministic; malformed present state is not repaired.
{const a=E.fresh(),b=structuredClone(a);assert(normalizeCasinoState(a));assert(normalizeCasinoState(b));assert.deepEqual(a.casino,b.casino);a.casino.rng=NaN;assert(!normalizeCasinoState(a));assert(!E.validSave(a));}
// Luck and human discounts never alter casino's fixed cost or outcomes.
for(const race of PLAYABLE_RACES){const {game:s,selection}=casinoFixture({race,ticket:33});s.talents.luck=10;const q=quoteCasino(s,selection);assert.equal(q.cost,100);assert.equal(wagerCasino(s,q).outcome,'upgrade');assert.equal(s.gold,9900);}
{const {game:s}=casinoFixture();const b=freshCasinoBrowser();assert(browseCasinoInputs(s,b).every(r=>r.kind==='material'));assert.equal(browseCasinoInputs(s,{...b,search:'不存在'}).length,0);const html=renderCasino(s,{browser:b});assert.equal((html.match(/<strong>33%<\/strong>/g)||[]).length,3);assert.match(html,/<strong>1%<\/strong>/);assert.match(html,/每次仅消耗1件/);assert.match(html,/不继承原装备/);assert.match(html,/赌场|命运赌桌/);}
console.log('Casino: 280 race/input/quality/boundary draws; exact odds, new identities, level provenance, exclusions, no overflow, rollback/retry, reload/idempotence, rest, luck independence and UI contracts PASS');
