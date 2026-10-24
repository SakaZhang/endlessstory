import assert from 'node:assert/strict';
const root=process.env.PIXEL_RPG_HOST??new URL('../../../',import.meta.url).pathname;
const E=await import(root+'dist/engine.js');
const {normalizeSkillTree}=await import(root+'dist/skill-tree-state.js');
const {RACE_PACK}=await import(root+'dist/races/human/index.js');
let report=[];
for(const weapon of ['sword_shield','greatsword','axe'])for(const skillId of Object.keys(RACE_PACK.skills)){
 const s=E.fresh('human');s.level=100;normalizeSkillTree(s,RACE_PACK.tree);const p=s.skillTree.presets[0];p.unlocked=RACE_PACK.tree.nodes.map(n=>n.id);p.active=[skillId,null,null,null];p.passive=[null,null];
 let w=s.inventory.find(i=>i.slot==='weapon'&&i.weaponType===weapon);if(!w){for(let i=0;i<200&&!w;i++){const it=E.item('weapon',50,null,2,{originRace:weapon==='axe'?'dwarf':'human'});if(it.weaponType===weapon)w=it;}if(w)s.inventory.push(w);}if(!w){throw new Error('Failed to generate '+weapon);}assert.ok(E.equipItem(s,w.id));s.heroHp=E.stats(s).hp*.6;s.lastSeen=s.lastHealthClock=10000;s.nextBattleAt=0;s.restUntil=0;
 const e=E.startInstanceEncounter(s,'human.a01.field',10000);assert.ok(e);for(const u of e.enemies){u.hp=u.max=1e6;u.atk=0;u.elementalPower=0;u.control.stunUntil=1e9;}
 e.rngState=123;let cast=false;for(let i=1;i<=20;i++){E.step(s,e,10000+i*1100);if(e.lastCast?.skillId===skillId)cast=true;assert.ok(E.validSave(s),skillId+' save '+i);}
 assert.ok(cast,weapon+' '+skillId+' actual cast');const copy=JSON.parse(JSON.stringify(s));assert.ok(E.validSave(copy));for(let i=21;i<=24;i++)assert.deepEqual(E.step(s,e,10000+i*1100),E.step(copy,copy.activeEncounter,10000+i*1100));report.push({skillId,weapon,cast,roundtrip:true});
}
assert.equal(report.length,63);console.log(JSON.stringify({ok:true,actualHostSkillWeaponPairs:report.length,stepsPerPair:24,saveAndRngContinuation:true}));
