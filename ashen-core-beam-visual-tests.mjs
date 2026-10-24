import assert from 'node:assert/strict';
import {createBattleSlicePresentation,presentationActorX} from './dist/battle-slice.js';
const positions={hero:{x:100,y:203},enemy:{x:350,y:203}},p=createBattleSlicePresentation(positions,{hero:{weaponType:'armguard'}});
const hit=(castId,skillId,element)=>({castId,sourceId:'hero',targetId:'enemy',kind:'hit',skillId,element,segmentIndex:0,hpDelta:-100,shieldDelta:0,outcome:'hit',crit:false});
p.enqueue([hit('beam','ashen-prism-beam','light'),hit('extra','ashen-prism-beam','light'),hit('basic','basic','physical')],0);
for(const at of [280,430,650]){p.advance(at);assert.equal(p.animations.get('hero').skillId,'ashen-prism-beam');assert.equal(presentationActorX(positions.hero,p.animations.get('hero'),at),100);}
p.enqueue([hit('next-basic','basic','physical')],1100);p.advance(1400);assert.equal(p.animations.get('hero').skillId,'ashen-prism-beam','next combat tick cannot overwrite still-visible multicast beam pose');assert.equal(presentationActorX(positions.hero,p.animations.get('hero'),1400),100);p.clear();assert.equal(p.effects.length,0);p.enqueue([hit('after-clear','basic','physical')],0);p.advance(300);assert.equal(p.animations.get('hero').skillId,'basic');
console.log('PASS beam stationary ranged pose, following basic presentation delayed, multicast and next-tick lock, clear resets presentation-only sequencing.');
