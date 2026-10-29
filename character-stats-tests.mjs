import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fresh,stats,baseStats} from './dist/engine.js';
import {characterStatsSnapshot,renderCharacterStats,CHARACTER_STAT_GROUPS} from './dist/character-stats-ui.js';
import {createSkillEffectState,applySkillEffect} from './dist/skill-tree-effects.js';
for(const race of ['human','dwarf','elf','goblin','ashen']){
 const s=fresh(race),before=JSON.stringify(s),random=Math.random;Math.random=()=>{throw Error('UI consumed RNG');};
 try{for(let i=0;i<3;i++){const snap=characterStatsSnapshot(s);assert.deepEqual(snap.current,stats(s));const html=renderCharacterStats(s);for(const label of ['全部属性','闪避率','韧性减时','火抗性','地抗性','水抗性','风抗性','光抗性','暗抗性','原始数值'])assert(html.includes(label));assert(!html.includes('NaN'));}}finally{Math.random=random;}
 assert.equal(JSON.stringify(s),before);
 s.lastHealthClock=1000;s.potionBuffs={strength:{quality:0,endAt:301000}};const snap=characterStatsSnapshot(s);assert.equal(snap.current.atk-snap.permanent.atk,10);
 s.lastHealthClock=301000;assert.equal(characterStatsSnapshot(s).current.atk,characterStatsSnapshot(s).permanent.atk);
}
const known=new Set(CHARACTER_STAT_GROUPS.flatMap(([,fields])=>fields.map(([k])=>k)).concat(['dodge','elementAttack','elementResistance','elementResist','lifesteal','count','specials','legend','bonus']));
assert.deepEqual(Object.keys(stats(fresh())).filter(k=>!known.has(k)),[],'every production stat accounted for; aliases and metadata are explicit');
const html=await readFile('dist/index.html','utf8');assert(html.indexOf('data-stats="1"')<html.indexOf('<details id="heroDetails"'));assert(html.includes('character-stats-ui.css'));
console.log('PASS all races, complete stats schema, potion expiry, read-only/RNG invariant, visible entry and stylesheet');

const active=fresh('dwarf');active.skillTree.mode='active';let effects=createSkillEffectState(['enemy'],0);effects=applySkillEffect(effects,'self',{type:'attackUp',amount:17,durationMs:3000,sourceId:'test'}).state;
active.activeEncounter={done:false,heroHp:40,pauseAt:1234,treeEffects:effects};const before=JSON.stringify(active),snap=characterStatsSnapshot(active);assert.equal(snap.current.atk,baseStats(active).atk+17);assert.equal(snap.hp,40);assert(renderCharacterStats(active).includes('攻击增强'));assert.equal(JSON.stringify(active),before);console.log('PASS paused battle effect and HP use stored state without advancing clocks');
