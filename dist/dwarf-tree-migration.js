// Pure proposal only. Never called by loading a save or by fresh(). Activation is
// a release gate owned by the integrator, pending explicit migration approval.
import {SKILL_TREE_DEFINITION as OLD} from './skill-tree-definition.js';
import {DWARF_EXPANDED_DEFINITION as NEXT} from './dwarf-skill-expansion.js';
import {validSkillTree,skillPointBudget} from './skill-tree-state.js';
export function quoteDwarfTreeRedistribution(state){
 if(!state?.skillTree||state.skillTree.configId!==OLD.id||!validSkillTree(state,OLD)||state.running||state.dungeonRun||state.activeEncounter&&!state.activeEncounter.done)return null;
 const next=structuredClone(state.skillTree);next.configId=NEXT.id;next.revision++;
 next.presets=next.presets.map(p=>({...p,unlocked:[],active:[null,null,null,null],passive:[null,null],conditions:['always','always','always','always']}));
 const candidate={...state,skillTree:next};if(!validSkillTree(candidate,NEXT))return null;
 return {kind:'dwarf-skill-only-redistribution-v2',before:JSON.stringify(state.skillTree),after:next,earnedPoints:skillPointBudget(state),preserved:'all state outside skillTree; preset names and selected preset',requiresExplicitApproval:true};
}
export function applyApprovedDwarfTreeRedistribution(state,quote,{approved=false}={}){
 if(approved!==true||!quote)return null;const current=quoteDwarfTreeRedistribution(state);if(!current||JSON.stringify(current)!==JSON.stringify(quote))return null;
 const next=structuredClone(state);next.skillTree=structuredClone(current.after);return next;
}
