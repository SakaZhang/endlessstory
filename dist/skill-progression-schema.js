export const SKILL_UNLOCK_LEVELS=Object.freeze({break:1,mark:1,guard:1,interrupt:1,heavy:10,ignite:10,warcry:20,ironcoat:20,scorch:30,barrier:30,blunt:40,mend:40,delay:55,cleanse:55});
const keys=Object.keys(SKILL_UNLOCK_LEVELS);
const legacy=s=>!Object.hasOwn(s,'skillRulesVersion')&&!Object.hasOwn(s,'skillAccess');
export function validSkillProgression(s){
 if(legacy(s))return true;
 const a=s.skillAccess;
 return s.skillRulesVersion===1&&a&&typeof a==='object'&&!Array.isArray(a)&&Object.keys(a).length===2&&typeof a.legacyAll==='boolean'&&Array.isArray(a.notified)&&a.notified.length<=keys.length&&new Set(a.notified).size===a.notified.length&&a.notified.every(k=>Object.hasOwn(SKILL_UNLOCK_LEVELS,k)&&(a.legacyAll||s.level>=SKILL_UNLOCK_LEVELS[k]))&&(!a.legacyAll||a.notified.length===keys.length);
}
export function normalizeSkillProgression(s){
 if(!validSkillProgression(s))return false;
 if(legacy(s)){s.skillRulesVersion=1;s.skillAccess={legacyAll:true,notified:[...keys]};}
 return true;
}
export function skillUnlocked(s,key){
 return Object.hasOwn(SKILL_UNLOCK_LEVELS,key)&&validSkillProgression(s)&&(legacy(s)||s.skillAccess.legacyAll||s.level>=SKILL_UNLOCK_LEVELS[key]);
}
export function collectSkillUnlockKeys(s){
 if(!normalizeSkillProgression(s))return[];
 const found=keys.filter(k=>skillUnlocked(s,k)&&!s.skillAccess.notified.includes(k));
 s.skillAccess.notified.push(...found);return found;
}
