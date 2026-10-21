import assert from 'node:assert/strict';
import {fresh,stats,preset,encounter,step,reward,offline,forge,BUILD,SLOTS} from './dist/engine.js';
for (let build of BUILD) for(let location=0;location<3;location++){let s=fresh();preset(s,build.id);s.location=location;let e=encounter(s,true),turn=0;while(!e.done&&turn++<500)step(s,e);assert(e.done);assert(Number.isFinite(e.heroHp));console.log(build.name,location,'L1',e.win?'WIN':'LOSS',turn);s.level=20;e=encounter(s,true);turn=0;while(!e.done&&turn++<500)step(s,e);assert(e.win,`${build.id} must beat location ${location} at high level`);}
{let s=fresh(),e=encounter(s,true);e.done=true;e.win=true;let time=Date.now();reward(s,e,time);assert.equal(s.bossReady[0],time+60000);assert.equal(s.bossWins[0],1);assert.equal(s.chapters.length,1);e.win=false;reward(s,e,time+200);assert.equal(s.bossReady[0],time+60000);}
{let s=fresh();s.running=true;s.lastSeen=0;let g=s.gold;let o=offline(s,10*3600000);assert.equal(o.minutes,240);assert.equal(s.gold,g+o.gold);assert.equal(offline(s,10*3600000),null);}
{let s=fresh();let g=s.gold,m=s.materials['铁屑'];assert.equal(forge(s,Array(6).fill('铁屑'),'weapon'),null);assert.equal(s.gold,g);assert.equal(s.materials['铁屑'],m);let i=forge(s,['铁屑'],'weapon');assert(i);assert(SLOTS.includes(i.slot));assert.equal(s.gold,g-40);assert.equal(s.materials['铁屑'],m-1);}
{let s=fresh();for(let b of BUILD){preset(s,b.id);assert.deepEqual(s.skills,b.skills);assert.equal(stats(s).count[b.id],4);}assert.equal(new Set(Object.values(s.equip)).size,4);}
console.log('All engine tests passed.');
