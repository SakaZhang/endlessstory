import assert from 'node:assert/strict';
import * as E from './dist/engine.js';
import {renderBuildPicker} from './dist/skill-ui.js';
import {commitGameTransaction} from './dist/storage.js';
const now=Date.now(),s=E.fresh('human');E.normalizeHealth(s,now);E.normalizeExpedition(s);
assert(E.saveLoadout(s,0,'战前空装'));
const weapon=E.item('weapon',1,null,1,{originRace:'human'});s.inventory.push(weapon);assert(E.equipItem(s,weapon.id));
const e=E.startRoutedEncounter(s,now);assert(e);s.heroHp=e.heroHp=1;for(const u of e.enemies){u.hp=u.max=1e8;u.atk=1e8;u.nextBasicAt=now;}E.step(s,e,s.nextActionAt);assert(e.done&&!e.win);assert(s.running&&s.restResume);assert.equal(s.heroHp,0);
const button=state=>renderBuildPicker(state).match(/<button[^>]*data-loadoutapply="0"[^>]*>/)[0];
assert(!button(s).includes('disabled'));assert(!button(s).includes('停止远征'));
const snapshot=JSON.stringify({deadline:s.restUntil,hp:s.heroHp,resume:s.restResume,running:s.running,route:s.expedition});
let raw;const tx=commitGameTransaction({setItem(k,v){raw=v}},s,n=>E.applyLoadout(n,0,!!e&&!e.done),{now:s.lastHealthClock});assert(tx.ok);assert.equal(tx.game.equip.weapon,null);assert.equal(JSON.stringify({deadline:tx.game.restUntil,hp:tx.game.heroHp,resume:tx.game.restResume,running:tx.game.running,route:tx.game.expedition}),snapshot);assert(!button(JSON.parse(raw)).includes('disabled'));assert.equal(E.startRoutedEncounter(tx.game,tx.game.restUntil-1),null);
for(const running of [true,false]){const battle=structuredClone(s);battle.restUntil=0;battle.running=running;battle.activeEncounter={done:false};assert(button(battle).includes('disabled'));assert(!E.applyLoadout(battle,0,true));}
assert(renderBuildPicker(s).match(/<button[^>]*data-loadoutapply="1"[^>]*>/)[0].includes('disabled'));
console.log('PASS sidebar quick loadout: real defeat enables saved swap, transaction preserves recovery intent/HP/deadline/route, reload, no early fight, active/paused battle and empty slot blocked');
