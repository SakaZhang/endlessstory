import {noncombatRunning} from './noncombat-policy.js';
import {validSkillCondition} from './skill-conditions.js';
import {SAVE_KEY} from './save-generation.js';
// Current-generation skill-tree allocation and atomic draft transactions.
const clone=x=>structuredClone(x),plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9_.-]{1,100}$/.test(x)&&!['__proto__','constructor','prototype'].includes(x);


export function skillPointBudget(s){return Number.isSafeInteger(s?.level)&&s.level>=1?Math.min(99,s.level-1):null;}
export function validSkillTreeConfig(config){
 if(!plain(config)||!id(config.id)||!Array.isArray(config.nodes)||!config.nodes.length||config.nodes.length>100||new Set(config.nodes.map(n=>n?.id)).size!==config.nodes.length)return false;
 if(!Array.from(config.nodes).every(n=>plain(n)&&id(n.id)&&['active','passive'].includes(n.kind)&&Number.isInteger(n.cost)&&n.cost>=1&&n.cost<=99&&Array.isArray(n.requires)&&new Set(n.requires).size===n.requires.length&&Array.from(n.requires).every(id)))return false;
 const nodes=Object.fromEntries(config.nodes.map(n=>[n.id,n])),visiting=new Set(),visited=new Set();
 const visit=key=>{if(visiting.has(key)||!Object.hasOwn(nodes,key))return false;if(visited.has(key))return true;visiting.add(key);if(!nodes[key].requires.every(visit))return false;visiting.delete(key);visited.add(key);return true;};
 return config.nodes.every(n=>visit(n.id));
}
export function skillPresetCost(preset,config){if(!validSkillTreeConfig(config)||!Array.isArray(preset?.unlocked))return null;const map=new Map(config.nodes.map(n=>[n.id,n]));return preset.unlocked.every(k=>map.has(k))?preset.unlocked.reduce((n,k)=>n+map.get(k).cost,0):null;}
function validPreset(p,config,budget){
 if(!plain(p)||Object.keys(p).length!==5||typeof p.name!=='string'||!p.name.trim()||p.name.length>40||!Array.isArray(p.unlocked)||new Set(p.unlocked).size!==p.unlocked.length)return false;
 const nodes=new Map(config.nodes.map(n=>[n.id,n]));
 if(!Array.from(p.unlocked).every(k=>nodes.has(k)&&nodes.get(k).requires.every(r=>p.unlocked.includes(r)))||skillPresetCost(p,config)>budget)return false;
 for(const [key,kind,count] of [['active','active',4],['passive','passive',2]])if(!Array.isArray(p[key])||p[key].length!==count||new Set(p[key].filter(x=>x!==null)).size!==p[key].filter(x=>x!==null).length||!Array.from(p[key]).every(k=>k===null||(typeof k==='string'&&p.unlocked.includes(k)&&nodes.get(k)?.kind===kind)))return false;
 return Array.isArray(p.conditions)&&p.conditions.length===4&&Array.from(p.conditions).every(c=>validSkillCondition(c));
}
export function validSkillTree(s,config){
 if(s?.skillTree===undefined)return true;
 if(!validSkillTreeConfig(config)||skillPointBudget(s)===null)return false;
 const tree=s.skillTree;return plain(tree)&&Object.keys(tree).length===6&&tree.version===1&&tree.mode==='active'&&tree.configId===config.id&&Number.isSafeInteger(tree.revision)&&tree.revision>=0&&tree.revision<1e12&&Number.isInteger(tree.selectedPreset)&&tree.selectedPreset>=0&&tree.selectedPreset<3&&Array.isArray(tree.presets)&&tree.presets.length===3&&Array.from(tree.presets).every(p=>validPreset(p,config,skillPointBudget(s)));
}
export function normalizeSkillTree(s,config){
 if(!validSkillTreeConfig(config)||skillPointBudget(s)===null||!validSkillTree(s,config))return false;
 if(s.skillTree!==undefined)return true;
 s.skillTree={version:1,mode:'active',configId:config.id,revision:0,selectedPreset:0,presets:Array.from({length:3},(_,i)=>({name:'方案'+(i+1),unlocked:[],active:[null,null,null,null],passive:[null,null],conditions:['always','always','always','always']}))};return true;
}
const treeSnapshot=s=>JSON.stringify({level:s.level,skillTree:s.skillTree??null,skills:s.skills??null,conditions:s.conditions??null,loadouts:s.loadouts??null});
export function quoteSkillTreeChange(s,config,change){
 try{
 if(!validSkillTreeConfig(config)||!validSkillTree(s,config)||!plain(change)||noncombatRunning(s)||(s.activeEncounter&&!s.activeEncounter.done))return null;
 const next=clone(s);if(!normalizeSkillTree(next,config))return null;
 const tree=next.skillTree,index=change.index??tree.selectedPreset;if(!Number.isInteger(index)||index<0||index>2)return null;
 const p=tree.presets[index];
 if(change.type==='unlock'){if(typeof change.skillId!=='string'||p.unlocked.includes(change.skillId))return null;p.unlocked.push(change.skillId);}
 else if(change.type==='refund'){
  if(typeof change.skillId!=='string'||!p.unlocked.includes(change.skillId))return null;
  const removed=new Set([change.skillId]);let grew=true;
  while(grew){grew=false;for(const node of config.nodes)if(p.unlocked.includes(node.id)&&!removed.has(node.id)&&node.requires.some(k=>removed.has(k))){removed.add(node.id);grew=true;}}
  p.unlocked=p.unlocked.filter(k=>!removed.has(k));p.active=p.active.map(k=>removed.has(k)?null:k);p.passive=p.passive.map(k=>removed.has(k)?null:k);
 }
 else if(change.type==='reset'){p.unlocked=[];p.active=[null,null,null,null];p.passive=[null,null];p.conditions=['always','always','always','always'];}
 else if(change.type==='slots'){if(change.active!==undefined)p.active=clone(change.active);if(change.passive!==undefined)p.passive=clone(change.passive);if(change.conditions!==undefined)p.conditions=clone(change.conditions);}
 else if(change.type==='presets'){if(!Array.isArray(change.presets)||change.presets.length!==3)return null;tree.presets=clone(change.presets);if(change.selectedPreset!==undefined)tree.selectedPreset=change.selectedPreset;}
 else if(change.type==='select')tree.selectedPreset=index;
 else if(change.type==='rename')p.name=change.name;
 else return null;
 tree.revision++;if(!validSkillTree(next,config))return null;
 return {version:1,configId:config.id,before:treeSnapshot(s),after:clone(tree),change:clone(change)};
 }catch{return null;}
}
export function prepareSkillTreeChange(s,quote,config){
 try{
 if(!plain(quote)||quote.version!==1||quote.configId!==config?.id||quote.before!==treeSnapshot(s))return null;
 // Rebuild from intent; imported/tampered quote cannot inject a different allocation.
 const expected=quoteSkillTreeChange(s,config,quote.change);if(!expected||JSON.stringify(expected.after)!==JSON.stringify(quote.after))return null;
 const next=clone(s);next.skillTree=clone(expected.after);return {game:next,result:{preset:next.skillTree.selectedPreset,revision:next.skillTree.revision}};
 }catch{return null;}
}
export function commitSkillTreeChange(storage,s,quote,config,{key=SAVE_KEY}={}){
 const prepared=prepareSkillTreeChange(s,quote,config);if(!prepared)return {ok:false,reason:'stale-or-invalid',game:s};
 try{storage.setItem(key,JSON.stringify(prepared.game));return {ok:true,...prepared};}catch{return {ok:false,reason:'storage',game:s};}
}

// Draft editing is local-only. The caller discards the returned draft on cancel.
function rebuildDraft(before,changes,config){
 try{
  const base=JSON.parse(before);if(!plain(base)||!Array.isArray(changes)||changes.length>1000)return null;
  if(base.skillTree===null)delete base.skillTree;
  if(treeSnapshot(base)!==before||!validSkillTree(base,config))return null;
  const working=clone(base);if(!normalizeSkillTree(working,config))return null;
  let affectedNames=[],refundedPoints=0;
  for(const change of changes){
   if(!plain(change)||!['unlock','refund','reset','slots','select','rename','presets'].includes(change.type))return null;
   const index=change.index??working.skillTree.selectedPreset,prior=working.skillTree.presets[index];if(!prior)return null;
   const oldUnlocked=[...prior.unlocked];const q=quoteSkillTreeChange(working,config,change);if(!q)return null;working.skillTree=q.after;
   const removed=oldUnlocked.filter(k=>!working.skillTree.presets[index].unlocked.includes(k));
   affectedNames=removed.map(k=>config.nodes.find(n=>n.id===k)?.name??k);
   refundedPoints=removed.reduce((sum,k)=>sum+config.nodes.find(n=>n.id===k).cost,0);
  }
  // One persisted transaction, independent of how many local edits occurred.
  working.skillTree.revision=(base.skillTree?.revision??0)+1;
  if(!validSkillTree(working,config))return null;
  return {preview:working.skillTree,affectedNames,refundedPoints};
 }catch{return null;}
}
export function beginSkillTreeDraft(s,config){
 if(!validSkillTreeConfig(config)||!validSkillTree(s,config)||noncombatRunning(s)||s.activeEncounter&&!s.activeEncounter.done)return null;
 const before=treeSnapshot(s),built=rebuildDraft(before,[],config);return built?{version:1,configId:config.id,before,changes:[],...built}:null;
}
export function editSkillTreeDraft(draft,config,change){
 if(!plain(draft)||draft.version!==1||draft.configId!==config?.id||!validSkillTreeConfig(config))return null;
 const current=rebuildDraft(draft.before,draft.changes,config);if(!current||JSON.stringify(current.preview)!==JSON.stringify(draft.preview))return null;
 const changes=[...clone(draft.changes),clone(change)],built=rebuildDraft(draft.before,changes,config);return built?{version:1,configId:config.id,before:draft.before,changes,...built}:null;
}
export function quoteSkillTreeDraft(s,draft,config,{confirm=false}={}){
 if(confirm!==true||!plain(draft)||draft.version!==1||draft.configId!==config?.id||draft.before!==treeSnapshot(s)||noncombatRunning(s)||s.activeEncounter&&!s.activeEncounter.done)return null;
 const built=rebuildDraft(draft.before,draft.changes,config);if(!built||JSON.stringify(built.preview)!==JSON.stringify(draft.preview))return null;
 return {version:1,kind:'skill-tree-draft',configId:config.id,before:draft.before,changes:clone(draft.changes),after:clone(built.preview),confirmed:true};
}
export function prepareSkillTreeDraft(s,quote,config){
 try{
  if(!plain(quote)||quote.kind!=='skill-tree-draft'||quote.version!==1||quote.confirmed!==true||quote.configId!==config?.id||quote.before!==treeSnapshot(s)||noncombatRunning(s)||s.activeEncounter&&!s.activeEncounter.done)return null;
  const built=rebuildDraft(quote.before,quote.changes,config);if(!built||JSON.stringify(built.preview)!==JSON.stringify(quote.after))return null;
  const game=clone(s);game.skillTree=clone(built.preview);return {game,result:{preset:game.skillTree.selectedPreset,revision:game.skillTree.revision}};
 }catch{return null;}
}
export function commitSkillTreeDraft(storage,s,quote,config,{key=SAVE_KEY}={}){
 const prepared=prepareSkillTreeDraft(s,quote,config);if(!prepared)return {ok:false,reason:'stale-or-invalid',game:s};
 try{storage.setItem(key,JSON.stringify(prepared.game));return {ok:true,...prepared};}catch{return {ok:false,reason:'storage',game:s};}
}


// Bulk UI payload is only an intent over an authenticated original tree fingerprint.
// baseState is beginSkillTreeDraft(...).before, not an entire state to adopt.
export function draftSkillTreePresetPayload(s,config,{baseState,presets,selectedPreset,activate=false,confirm=false}={}){
 const fingerprint=typeof baseState==='string'?baseState:plain(baseState)?treeSnapshot(baseState):null;
 if(fingerprint!==treeSnapshot(s)||activate!==false||typeof confirm!=='boolean')return null;
 let draft=beginSkillTreeDraft(s,config);if(!draft)return null;
 draft=editSkillTreeDraft(draft,config,{type:'presets',presets,selectedPreset});if(!draft)return null;
 return draft;
}
