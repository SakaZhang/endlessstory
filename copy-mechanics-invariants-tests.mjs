import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

// Pin the reviewed v0.77 baseline: later commits must not silently move the goalposts.
const BASELINE='8d08d0b73f6e765749526b51785880d2a46132a6';
const root=dirname(fileURLToPath(import.meta.url));
const git=(...args)=>execFileSync('git',args,{cwd:root,maxBuffer:32*1024*1024});
const temp=mkdtempSync(join(tmpdir(),'long-road-copy-invariants-'));
const changedCopy=[];
const rules=[];
const allow=(file,patterns)=>rules.push(...patterns.map(pattern=>({file,pattern})));
// These are content-schema paths, not a blanket exemption for string values.
// In particular IDs, condition expressions, flags, effect kinds, item keys, RNG
// channels, source node IDs, and every numeric/boolean value remain comparable.
const raceFile=/^races\/(human|elf|goblin|ashen)\/(equipment|skills|content|world|areas|materials|monsters)\.js$/;
allow(raceFile,[
 /^[^/]+\/[^/]+\/(description|lore|pixelAppearance|exclusiveDescription|sourceNote|sourcePolicy|uses|use|hiddenUsage)$/,
 /^[^/]+\/[^/]+\/(two|four|exclusive)\/description$/,
 /^tree\/nodes\/\d+\/description$/,
 /^monsters\/[^/]+\/skills\/\d+\/description$/,
]);
allow(/^(equipment-templates|human-dwarf-equipment-additions|dwarf-material-catalog)\.js$/,[
 /^[^/]+\/[^/]+\/(description|lore|pixelAppearance|sourceNote|sourcePolicy|uses|use|hiddenUsage)$/,
]);
allow(/^racial-npc-event-content\.js$/,[
 /^(RACIAL_NPC_EVENTS|RACIAL_EVENT_BY_ID)\/[^/]+\/(title|description|dialogue|completion)$/,
 /^(RACIAL_NPC_EVENTS|RACIAL_EVENT_BY_ID)\/[^/]+\/choices\/\d+\/(label|dialogue|outcome)$/,
 /^(RACIAL_NPC_EVENTS|RACIAL_EVENT_BY_ID)\/[^/]+\/decline\/(label|dialogue)$/,
 /^(RACIAL_NPCS|RACIAL_NPC_BY_ID)\/[^/]+\/(role|appearance|voice|plotRelation)$/,
]);
allow(/^npc-objective-content\.js$/,[
 /^NPC_OBJECTIVE_CONTENT\/[^/]+\/(taskDescription|taskDialogue|taskCompletion)$/,
 /^NPC_OBJECTIVE_CONTENT\/[^/]+\/taskObjective\/description$/,
 /^NPC_OBJECTIVE_CONTENT\/[^/]+\/taskObjective\/checkpoints\/\d+\/(label|description|evidence|actionLabel)$/,
]);
allow(/^personal-story-content\.js$/,[
 /^PERSONAL_ARC_CONTENT\/\d+\/(title|intro|lateIntro)$/,
 /^PERSONAL_ARC_CONTENT\/\d+\/choices\/\d+\/(label|outcome)$/,
 /^PERSONAL_ARC_CONTENT\/\d+\/choices\/\d+\/(actions|lateActions)\/\d+\/(prompt|result)$/,
 /^PERSONAL_ARC_CONTENT\/\d+\/choices\/\d+\/(actions|lateActions)\/\d+\/options\/\d+\/label$/,
]);
allow(/^(story-event-registry|story-finale-scenes|personal-story-registry)\.js$/,[
 /^[^/]+\/[^/]+\/(title|npc|lines|completion|description|lateIntro)$/,
 /^[^/]+\/[^/]+\/choices\/\d+\/(label|dialogue|outcome)$/,
 /^[^/]+\/[^/]+\/choices\/\d+\/(actions|lateActions)\/\d+\/(prompt|result)$/,
 /^[^/]+\/[^/]+\/choices\/\d+\/(actions|lateActions)\/\d+\/options\/\d+\/label$/,
]);
allow(/^(return-ring-content|chik-family-events)\.js$/,[
 /^(RETURN_RING_EVENTS|CHIK_FAMILY_EVENTS)\/\d+\/(title|description|dialogue|completion|actionLabel|rewardContext)$/,
 /^CHIK_FAMILY_EVENTS\/\d+\/choices\/\d+\/(label|dialogue|outcome)$/,
]);
allow(/^skill-tree-descriptions\.js$/,[/^SKILL_TREE_DESCRIPTIONS\/[^/]+\/(base|axe|hammer)$/]);
allow(/^dwarf-skill-expansion\.js$/,[
 /^DWARF_EXPANDED_DESCRIPTIONS\/[^/]+\/(base|axe|hammer)$/,
 /^DWARF_EXPANDED_SKILLS\/[^/]+\/description\/(base|axe|hammer)$/,
 /^DWARF_ADDED_PASSIVE_METADATA\/[^/]+\/description$/,
]);
allow(/^engine\.js$/,[
 /^LEGENDARY_CODEX\/\d+\/(lore|effect|acquisition|attributes|tuning|description|exclusiveDescription|pixelAppearance)$/,
 /^LEGENDARY_CODEX\/\d+\/exclusive\/description$/,
 /^MATERIALS\/[^/]+\/(description|sourceNote|sourcePolicy|uses|use|hiddenUsage)$/,
 /^BUILD\/\d+\/(bonus|description)$/,
 /^BUILD\/\d+\/(two|four)\/description$/,
 /^TALENTS\/[^/]+\/desc$/,
]);
allow(/^(story-event-registry|story-finale-scenes|personal-story-registry)\.js$/,[/^(STORY_SCENES|FINALE_SCENES|PERSONAL_STORY_SCENES)\/[^/]+\/objective$/, /^(STORY_SCENES|FINALE_SCENES|PERSONAL_STORY_SCENES)\/[^/]+\/knowledge\/\d+\/text$/]);
allow(/^return-ring-content\.js$/,[
 /^RETURN_RING_DEFINITION\/exclusiveDescription$/,
 /^RETURN_RING_EVENTS\/\d+\/(taskDescription|taskDialogue)$/,
 /^RETURN_RING_EVENTS\/\d+\/taskObjective\/checkpoints\/\d+\/(label|description|evidence|actionLabel)$/,
]);
// Exact user-authorized v0.78 additions. Never derive permission from mutable
// production data or re-record the old baseline. Everything else stays pinned.
const EARLY_LUCK=['dwarf.ashroot','human.mat.02','elf.dew_crown','goblin.mat.01','ashen.salt_shell'];
const AUXILIARIES=[
 ['human.mat.03','potion-earthResist'],['goblin.mat.06','potion-strength'],
 ['goblin.mat.11','potion-strength'],['goblin.mat.02','potion-earthResist'],
 ['human.mat.08','potion-earthResist'],['dwarf.silverthread_ore','potion-earthResist'],
 ['elf.root_silver','potion-earthResist'],['dwarf.obsidian_flake','potion-fireResist'],
 ['ashen.cold_ash_sand','potion-fireResist']
];
assert.deepEqual(JSON.parse(readFileSync(join(root,'content/luck-potion-early-materials.json'))).materials.map(m=>m.id),EARLY_LUCK);
assert.deepEqual(JSON.parse(readFileSync(join(root,'content/material-recipe-expansion.json'))).mappings.map(m=>[m.material,m.recipe]),AUXILIARIES);
const clone=v=>Array.isArray(v)?v.map(clone):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,clone(x)])):v;
function authorizedBaseline(original,file){
 const out=clone(original);
 // Approved presentation-only 2/4-piece rows. Pin structure and thresholds;
 // descriptions alone are visible copy, never the numerical set tuning.
 if(file==='engine.js'){
  assert.deepEqual(out.BUILD.map(b=>b.id),['human_blood_oath','human_royal_edge','human_last_bastion','elf_arrow','elf_prism','elf_root','goblin_spore','goblin_ambush','goblin_snare','ashen.caldera','ashen.strata','ashen.prism','anvil','rune','guard']);
  for(const set of out.BUILD){assert(!Object.hasOwn(set,'effects'));set.effects=[{pieces:2,description:''},{pieces:4,description:''}];}
 }
 if(file==='return-ring-content.js'){
  assert.deepEqual(out.RETURN_RING_EVENTS.map(e=>[e.race,e.areaId]),[['dwarf','dwarf.a05'],['human','human.a04'],['elf','elf.a04'],['goblin','goblin.a06'],['ashen','ashen.a06']]);
  for(const e of out.RETURN_RING_EVENTS){
   const id='npc.return-ring.'+e.race;
   assert.equal(e.id,id);assert(!Object.hasOwn(e,'taskObjective'));
   e.objectiveVersion=2;
   e.taskObjective={kind:'investigate',count:3,checkpoints:[
    {id:id+'.trace',areaId:e.areaId},
    {id:id+'.clear',areaId:e.areaId,nodeId:e.areaId+'.dungeon',challenge:'dungeon-clear',requiresCheckpointIds:[id+'.trace']},
    {id:id+'.recover',areaId:e.areaId,requiresCheckpointIds:[id+'.clear']}
   ]};
  }
 }
 // Only these catalog exports contain canonical material functionalTags.
 const exportsByFile={
  'dwarf-material-catalog.js':['DWARF_MATERIALS','DWARF_MATERIAL_REGISTRY'],
  'races/human/materials.js':['HUMAN_MATERIALS'],
  'races/human/content.js':['materials'],
  'races/elf/content.js':['materials'],
  'races/goblin/materials.js':['materials'],
  'races/ashen/world.js':['materials'],
  'engine.js':['MATERIALS']
 };
 for(const key of exportsByFile[file]??[])for(const m of Object.values(out[key]??{})){
  const id=m.catalogId??m.id;
  if(EARLY_LUCK.includes(id)){
   assert(Array.isArray(m.functionalTags),`Missing original tags: ${file}/${key}/${id}`);
   assert(!m.functionalTags.includes('luckBase')&&!m.functionalTags.includes('luckAux'));
   m.functionalTags.push('luckBase','luckAux');
  }
 }
 if(file==='potion-catalog.js'){
  for(const role of out.POTION_RECIPE_CATALOG['potion-luck'].roles)role.materialIds.push(...EARLY_LUCK);
  for(const [id,recipe]of AUXILIARIES)out.POTION_RECIPE_CATALOG[recipe].roles.find(r=>r.role==='aux').materialIds.push(id);
 }
 return out;
}
const protectedSegments=new Set(['conditions','effects','rewards','taskRewards','modifiers','requires','trigger','parameters','materialAssociations','materialPools']);
function isCopy(file,path){
 // This exact UI leaf is the only exception inside a protected `effects` path.
 // Array length, pieces, all extra fields and every other effects path stay pinned.
 if(file==='engine.js'&&/^BUILD\/\d+\/effects\/[01]\/description$/.test(path))return true;
 return !path.split('/').some(x=>protectedSegments.has(x))&&rules.some(r=>r.file.test(file)&&r.pattern.test(path));}
function textOnly(v){return typeof v==='string'||Array.isArray(v)&&v.every(textOnly);}
function project(v,file,path){
 if(isCopy(file,path)&&v!=null){assert(textOnly(v),`Copy exemption cannot hide structured mechanics: ${file}:${path}`);return '<visible-copy>';}
 if(typeof v==='function')return '<function:'+v.toString()+'>';
 if(Array.isArray(v))return v.map((x,i)=>project(x,file,path+'/'+i));
 if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().filter(k=>{const p=path?path+'/'+k:k;if(!isCopy(file,p))return true;assert(v[k]==null||textOnly(v[k]),`Structured data in copy field: ${file}:${p}`);return false;}).map(k=>[k,project(v[k],file,path?path+'/'+k:k)]));
 return v;
}
const modules=[
 'racial-npc-event-content','npc-objective-content','personal-story-content','story-event-registry','story-finale-scenes','personal-story-registry',
 'personal-arc-rewards','story-scenario-registry','story-c08-scenarios','story-finale-scenarios',
 'potion-catalog','return-ring-content','infinity-gauntlet-content','chik-family-events','skill-tree-descriptions','dwarf-skill-expansion',
 'equipment-templates','human-dwarf-equipment-additions','dwarf-material-catalog',
 ...['human','elf','goblin','ashen'].flatMap(r=>['equipment','skills','content','world','areas','materials','monsters','parameters','legendary','legends','runtime','story-core'].map(f=>`races/${r}/${f}`))
].map(f=>f+'.js').filter(f=>existsSync(join(root,'dist',f)));
try{
 // Only JS dependencies are extracted; no save, browser storage, network or assets.
 for(const file of git('ls-tree','-r','--name-only',BASELINE,'--','dist').toString().trim().split('\n').filter(f=>f.endsWith('.js'))){const dest=join(temp,file);mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,git('show',`${BASELINE}:${file}`));}
 writeFileSync(join(temp,'package.json'),'{"type":"module"}');
 let compared=0;
 for(const file of modules){
  const before=await import(pathToFileURL(join(temp,'dist',file)));
  const after=await import(pathToFileURL(join(root,'dist',file)));
  const a=project(after,file,''),b=project(authorizedBaseline(before,file),file,''); const differences=[]; function diff(a,b,p=''){if(Object.is(a,b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],p+'/'+k);}else differences.push(p+' '+JSON.stringify(b)+' => '+JSON.stringify(a));}diff(a,b);assert.equal(differences.length,0,`Mechanics drift in ${file}:\n${differences.slice(0,15).join('\n')}`);compared++;
  const rejectMutation=(label,mutate)=>{const corrupt=clone(after);mutate(corrupt);assert.throws(()=>assert.deepEqual(project(corrupt,file,''),b),assert.AssertionError,`Unauthorized mutation must fail: ${file}: ${label}`);};
  if(file==='return-ring-content.js'){
   rejectMutation('event ID',m=>m.RETURN_RING_EVENTS[0].id+='-changed');
   rejectMutation('reward quantity',m=>m.RETURN_RING_EVENTS[0].rewards[0].quantity=2);
   rejectMutation('reward material ID',m=>m.RETURN_RING_EVENTS[0].rewards[0].key='灰根草|3');
   rejectMutation('old material requirements',m=>m.RETURN_RING_EVENTS[0].materials.push({key:'灰根草|0',quantity:1}));
   rejectMutation('story prerequisite',m=>m.RETURN_RING_EVENTS[0].requiresStoryFlag='');
   rejectMutation('old objective quantity',m=>m.RETURN_RING_EVENTS[0].objective.count=2);
   rejectMutation('new objective quantity',m=>m.RETURN_RING_EVENTS[0].taskObjective.count=2);
   rejectMutation('checkpoint prerequisite',m=>m.RETURN_RING_EVENTS[0].taskObjective.checkpoints[2].requiresCheckpointIds=[]);
   rejectMutation('field cannot replace dungeon',m=>m.RETURN_RING_EVENTS[0].taskObjective.checkpoints[1].nodeId='dwarf.a05.field');
  }
  if(file==='npc-objective-content.js'){
   const id=Object.keys(after.NPC_OBJECTIVE_CONTENT).find(id=>after.NPC_OBJECTIVE_CONTENT[id].taskObjective.materials?.length);
   assert(id,'Need an existing collection contract for the negative control');
   rejectMutation('existing material quantity',m=>m.NPC_OBJECTIVE_CONTENT[id].taskObjective.materials[0].quantity++);
  }
  if(file==='races/elf/content.js'){
   rejectMutation('additional functional tag',m=>m.materials['elf.dew_crown'].functionalTags.push('strengthBase'));
   rejectMutation('missing approved functional tag',m=>m.materials['elf.dew_crown'].functionalTags.pop());
   rejectMutation('nonapproved material functional tag',m=>m.materials['elf.green_shale'].functionalTags.push('luckBase'));
  }
  if(file==='potion-catalog.js'){
   rejectMutation('recipe input count',m=>m.POTION_RECIPE_CATALOG['potion-luck'].roles[0].unitsPerBottle=2);
   rejectMutation('unapproved auxiliary',m=>m.POTION_RECIPE_CATALOG['potion-earthResist'].roles[1].materialIds.push('human.mat.17'));
  }
  if(JSON.stringify(before)!==JSON.stringify(after))changedCopy.push(file);
 }
 // Engine functions legitimately contain revised log copy; compare the public
 // numeric catalogs, and legendary mechanics separately, not function text here.
 const before=await import(pathToFileURL(join(temp,'dist/engine.js'))),after=await import(pathToFileURL(join(root,'dist/engine.js')));
 for(const key of ['LEGENDARY_CODEX','TALENTS','MATERIALS','BUILD','CONSUMABLES'])if(key in before){assert.deepEqual(project(after[key],'engine.js',key),project(authorizedBaseline(before,'engine.js')[key],'engine.js',key),`Engine catalog drift: ${key}`);}
 // New presentation metadata must not open a hole in the mechanical projection.
 const expectedBuild=project(authorizedBaseline(before,'engine.js').BUILD,'engine.js','BUILD');
 for(const [label,mutate] of [
  ['set activation threshold',m=>m[0].effects[0].pieces=1],
  ['extra set tier',m=>m[0].effects.push({pieces:6,description:'extra'})],
  ['missing set tier',m=>m[0].effects.pop()],
  ['mechanics hidden beside description',m=>m[0].effects[0].multiplier=2],
  ['structured description',m=>m[0].effects[0].description={multiplier:2}],
  ['existing set numerical tuning',m=>m.find(x=>x.id==='elf_arrow').two.damageMultiplier=2]
 ]){const corrupt=clone(after.BUILD);mutate(corrupt);assert.throws(()=>assert.deepEqual(project(corrupt,'engine.js','BUILD'),expectedBuild),assert.AssertionError,label);}
 // Mutation sentinels prove representative mechanics strings cannot be hidden.
 for(const [f,p]of [['racial-npc-event-content.js','RACIAL_NPC_EVENTS/0/conditions/accessPolicy'],['racial-npc-event-content.js','RACIAL_NPC_EVENTS/0/choices/0/effects/0/flag'],['npc-objective-content.js','NPC_OBJECTIVE_CONTENT/event/taskRewards/0/key'],['races/elf/skills.js','skills/elf.skill/weaponType'],['races/elf/equipment.js','legendaries/0/exclusiveId']])assert.notEqual(project('old',f,p),project('new',f,p),p);
 console.log(`PASS copy + bounded authorized revision invariants: ${compared} modules + engine catalogs vs ${BASELINE.slice(0,12)}; ${changedCopy.length} changed content modules. IDs, gates, objectives, rewards, effects, numeric budgets and legendary functions preserved except exact approved ring objectives / recipe additions / presentation-only set rows (2/4 thresholds pinned).`);
 console.log('Boundary: does not prove new prose accurately describes mechanics, DOM behavior, non-exported function closures, or visual correctness; use gameplay/UI tests and review alongside this check.');
}finally{rmSync(temp,{recursive:true,force:true});}
