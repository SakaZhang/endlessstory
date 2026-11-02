import {OTHERWORLD_MAX_FLOOR} from './otherworld-state.js';
const maxMilestones=Math.floor(OTHERWORLD_MAX_FLOOR/50);
const oldPendingMilestone=s=>{const e=s?.activeEncounter,h=s.otherworld?.highestCleared??0,f=e?.otherworld?.floor;return e?.done===true&&e.win===true&&Number.isInteger(f)&&f===h+1&&f%50===0?f/50:null;};
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
// Optional extension: historical clears establish the baseline, never a retroactive reward.
export function validDivineStones(s){
 const d=s?.divineStones;if(d===undefined)return true;
 const highest=s.otherworld?.highestCleared??0;
 if(!exact(d,['version','baseline','claimed','spent'])||d.version!==1||!Number.isInteger(d.baseline)||d.baseline<0||d.baseline>Math.max(Math.floor(highest/50),oldPendingMilestone(s)??0)||d.baseline>maxMilestones||!Array.isArray(d.claimed)||d.claimed.length>maxMilestones||!Number.isInteger(d.spent)||d.spent<0||d.spent>d.claimed.length)return false;
 return d.claimed.length===Math.max(0,Math.floor(highest/50)-d.baseline)&&d.claimed.every((floor,i)=>Number.isInteger(floor)&&floor===50*(d.baseline+i+1));
}
export function normalizeDivineStones(s){
 if(!validDivineStones(s))return false;
 s.divineStones??={version:1,baseline:Math.max(Math.floor((s.otherworld?.highestCleared??0)/50),oldPendingMilestone(s)??0),claimed:[],spent:0};
 return s.divineStones;
}
export function divineStoneBalance(s){const d=s?.divineStones;return validDivineStones(s)&&d?d.claimed.length-d.spent:0;}
// Called before highestCleared advances, once inside a validated win transaction.
export function awardDivineStone(s,floor){
 const d=normalizeDivineStones(s),highest=s.otherworld?.highestCleared??0;
 if(!d||!Number.isInteger(floor)||floor<50||floor>OTHERWORLD_MAX_FLOOR||floor%50!==0||floor<=highest||floor<=d.baseline*50||d.claimed.includes(floor))return false;
 d.claimed.push(floor);return true;
}
