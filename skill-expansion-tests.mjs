import assert from 'node:assert/strict';
import {fresh,stats,encounter,step,SKILLS,combatStatuses,SET_SLOTS,item,equipItem,BUILD,preset,SOCKETS} from './dist/engine.js';
const original=Math.random;Math.random=()=>.5;
const setup=(key,location=0)=>{const s=fresh();s.location=location;s.skills=[key,null,null,null];s.conditions=['always','always','always','always'];const e=encounter(s);e.hp=e.max=100000;e.heroHp=stats(s).hp;return [s,e];};
try{
 assert.equal(Object.keys(SKILLS).length,14);
 for(const key of ['warcry','ironcoat','barrier']){const [s,e]=setup(key);step(s,e);assert.equal(e.hp,e.max);assert(e[key]>0);const first=e[key];e.cd[key]=0;step(s,e);assert.equal(e[key],first-1);}
 const [s,e]=setup('warcry');step(s,e);const a=setup(null);step(a[0],a[1]);const baseline=a[1].max-a[1].hp;const hp=e.hp;step(s,e);assert(hp-e.hp>baseline);assert(combatStatuses(e).some(x=>x.key==='warcry'&&x.side==='hero'));
 for(const key of ['blunt','ironcoat']){const [s,e]=setup(key);const before=e.heroHp;step(s,e);const [plain,p]=setup(null);step(plain,p);assert(before-e.heroHp<stats(plain).hp-p.heroHp);}
 const [fire,f]=setup('scorch');step(fire,f);fire.skills=['mark',null,null,null];let hpFire=f.hp;step(fire,f);const [plain,p]=setup('mark');step(plain,p);assert(hpFire-f.hp>p.max-p.hp);
 const [phys,pe]=setup(null);pe.scorch=3;step(phys,pe);const [normal,ne]=setup(null);step(normal,ne);assert.equal(pe.max-pe.hp,ne.max-ne.hp);
 const [delay,de]=setup('delay');for(let i=0;i<3;i++)step(delay,de);const before=de.heroHp;let logs=step(delay,de);assert(logs.some(x=>x.includes('迟滞符')));assert.equal(de.nextHeavy,5);assert(de.heavyDelayed);de.cd.delay=0;logs=step(delay,de);assert(logs.some(x=>x.startsWith('敌人重击')));assert.equal(de.nextHeavy,9);assert(!de.heavyDelayed);
 const [heal,he]=setup('mend');logs=step(heal,he);assert(!logs.some(x=>x.includes('回炉息')));he.heroHp=30;const pre=he.heroHp;logs=step(heal,he);assert(logs.some(x=>x.includes('回炉息')));assert(he.heroHp>pre);assert(he.heroHp<=pre+Math.floor(stats(heal).hp*.2));
 const [clean,ce]=setup('cleanse');logs=step(clean,ce);assert(!logs.some(x=>x.includes('净炉')));ce.heroBurn=3;ce.weakness=2;logs=step(clean,ce);assert.equal(ce.heroBurn,0);assert.equal(ce.weakness,0);assert(logs.some(x=>x.includes('净炉')));
 for(const [loc,round,field] of [[1,5,'heroBurn'],[2,6,'weakness']]){const [s,e]=setup(null,loc);for(let i=0;i<round;i++)step(s,e);assert(e[field]>0);assert(combatStatuses(e).some(x=>x.side==='hero'&&x.key===(field==='heroBurn'?'mark':'blunt')));}
 // Set utility linkages are enhancements, not prerequisites.
 for(const [build,key,field,turns] of [['anvil','warcry','warcry',3],['rune','scorch','scorch',4],['guard','ironcoat','ironcoat',3]]){const [s,e]=setup(key);for(const slot of SET_SLOTS.slice(0,2)){const g=item(slot,2,build,3);s.inventory.push(g);equipItem(s,g.id);}step(s,e);assert.equal(e[field],turns);}
 const [wall,we]=setup('barrier');for(const slot of SET_SLOTS){const g=item(slot,2,'guard',3);wall.inventory.push(g);equipItem(wall,g.id);}logs=step(wall,we);assert(logs.some(x=>x.includes('坚守反击')));assert(logs.some(x=>x.includes('敌人攻击 · -0')));assert.equal(we.guard,1);
 // Both existing builds and utility-heavy setups finish fights, not an infinite heal loop.
 for(const location of [0,1,2])for(const skills of [null,['mend','barrier','ironcoat','cleanse'],['delay','blunt','warcry','scorch']])for(const b of skills?[null]:BUILD){const s=fresh();s.level=15;s.location=location;for(let i=0;i<s.inventory.length;i++){const g=item(s.inventory[i].slot,15,null,2);s.inventory[i]=g;s.equip[SOCKETS[i]]=g.id;}if(skills)s.skills=skills;else preset(s,b.id);const e=encounter(s,true);for(let i=0;i<1000&&!e.done;i++)step(s,e);assert(e.done);assert(e.win);}
 assert.deepEqual(combatStatuses(null),[]);console.log('14 skills: utility/no-damage, finite effects, real buffs/debuffs, delay clock, cleanse, set links, shield counter, sustain/boss matrix: PASS');
}finally{Math.random=original;}
