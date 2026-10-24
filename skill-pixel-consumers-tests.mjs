import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as E from './dist/engine.js';
import {SKILL_TREE_DEFINITION as D} from './dist/skill-tree-definition.js';
import {renderSkillTree} from './dist/skill-tree-ui.js';
import {renderQuickLoadouts} from './dist/quick-loadouts.js';
import {renderLoadouts} from './dist/loadout-ui.js';
import {renderLiveBattleHud} from './dist/live-battle-view.js';
const s=E.fresh();s.level=100;
const p=s.skillTree.presets[0];p.unlocked=D.nodes.map(n=>n.id);p.active=['fracture_strike','scatter_ash','furnace_wave','forge_breath'];p.passive=['forged_resilience','mountain_vitality'];
s.loadouts[0]={name:'图标测试',equip:structuredClone(s.equip),skills:structuredClone(s.skills),conditions:structuredClone(s.conditions)};
const fresh=E.fresh();
const before=JSON.stringify(s),oldRandom=Math.random;Math.random=()=>{throw Error('render consumed RNG');};
try{
const tree=renderSkillTree({draft:s,index:0,busy:false,blocked:false});
for(const n of D.nodes)assert(tree.includes(`data-skill-icon="${n.id}"`),n.id);
assert.equal((tree.match(/data-tree-slot="active"/g)||[]).length,4);assert.equal((tree.match(/data-tree-slot="passive"/g)||[]).length,2);
const quick=renderQuickLoadouts(s);assert(quick.includes('data-skill-icon="fracture_strike"'));assert.equal((quick.match(/data-skill-icon="empty"/g)||[]).length,2,'unsaved plans do not invent skills');
const plans=renderLoadouts(s,{wardrobeIds:()=>new Set(),bagItems:()=>[]});for(const id of [...p.active,...p.passive])assert(plans.includes(`data-skill-icon="${id}"`));
const hud=renderLiveBattleHud(s,{treeSkillCooldowns:{fracture_strike:3}});for(const id of [...p.active,...p.passive])assert(hud.includes(`data-skill-icon="${id}"`));assert(hud.includes('3回'));
const locked=renderSkillTree({draft:fresh,index:0,busy:false,blocked:false});assert.equal((locked.match(/class="skillPixelLock"/g)||[]).length,21);assert.equal((locked.match(/data-skill-icon="empty"/g)||[]).length,6);assert(locked.includes('未满足条件'));
assert.equal(JSON.stringify(s),before);
}finally{Math.random=oldRandom;}
for(const html of ['index.html','battle-preview.html']){const text=fs.readFileSync('dist/'+html,'utf8');for(const css of ['skill-pixel-icons.css','skill-pixel-consumers.css'])assert(text.includes(css));}
const css=fs.readFileSync('dist/skill-pixel-consumers.css','utf8');assert(css.includes('repeat(6,minmax(0,1fr))'));assert(css.includes('font-size:12px'));assert(!css.includes('opacity:.'));
console.log('PASS exact21 tree + 4/2 editor slots + saved/empty quickplans + loadout active/passive + actual live cooldown HUD; rendering state/RNG immutable; both HTML resource roots. Static layout assertions are not browser QA.');
