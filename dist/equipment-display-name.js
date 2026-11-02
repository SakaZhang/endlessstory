import {EQUIPMENT_TEMPLATES,EQUIPMENT_TEMPLATE_BY_ID} from './equipment-templates.js';
import {EXPANSION_PACKS} from './race-packs.js';
// Presentation-only set names. Stored template identities and paid reward snapshots
// retain their exact historical names; no save or transaction fingerprint is rewritten.
const SET_DISPLAY_NAMES=Object.freeze({anvil:'碎砧',rune:'炉纹',guard:'守冢',...Object.fromEntries(EXPANSION_PACKS.flatMap(p=>p.sets.map(s=>[s.id,s.name])))});
// Approved 2026-11-02: explicit per-template names, not generated suffixes.
export const APPROVED_SET_PIECE_NAMES=Object.freeze({
 "dwarf_set_anvil_helm": "碎砧·裂岩盔",
 "dwarf_set_anvil_armor": "碎砧·重锻甲",
 "dwarf_set_anvil_gloves": "碎砧·断铆护手",
 "dwarf_set_anvil_boots": "碎砧·踏砧靴",
 "dwarf_set_rune_helm": "炉纹·刻火兜帽",
 "dwarf_set_rune_armor": "炉纹·铭炉衣",
 "dwarf_set_rune_gloves": "炉纹·引焰护手",
 "dwarf_set_rune_boots": "炉纹·烬纹靴",
 "dwarf_set_guard_helm": "守冢·誓卫盔",
 "dwarf_set_guard_armor": "守冢·镇石甲",
 "dwarf_set_guard_gloves": "守冢·碑纹护手",
 "dwarf_set_guard_boots": "守冢·守夜靴",
 "human_blood_oath_helm": "赤痕誓约·赤痕盔",
 "human_blood_oath_armor": "赤痕誓约·赤痕甲",
 "human_blood_oath_gloves": "赤痕誓约·赤痕护手",
 "human_blood_oath_boots": "赤痕誓约·赤痕靴",
 "human_royal_edge_helm": "王领锐锋·锐锋盔",
 "human_royal_edge_armor": "王领锐锋·锐锋甲",
 "human_royal_edge_gloves": "王领锐锋·锐锋护手",
 "human_royal_edge_boots": "王领锐锋·锐锋靴",
 "human_last_bastion_helm": "最后壁垒·壁垒盔",
 "human_last_bastion_armor": "最后壁垒·壁垒甲",
 "human_last_bastion_gloves": "最后壁垒·壁垒护手",
 "human_last_bastion_boots": "最后壁垒·壁垒靴",
 "elf_arrow_helm": "逐叶弦歌·叶纹额冠",
 "elf_arrow_armor": "逐叶弦歌·逐风长衣",
 "elf_arrow_gloves": "逐叶弦歌·挽弦护手",
 "elf_arrow_boots": "逐叶弦歌·踏叶行靴",
 "elf_prism_helm": "六相月庭·月银额冠",
 "elf_prism_armor": "六相月庭·流光长衣",
 "elf_prism_gloves": "六相月庭·引辉护手",
 "elf_prism_boots": "六相月庭·月影行靴",
 "elf_root_helm": "心木共鸣·枝纹额冠",
 "elf_root_armor": "心木共鸣·木纹长衣",
 "elf_root_gloves": "心木共鸣·心木护手",
 "elf_root_boots": "心木共鸣·踏根行靴",
 "goblin_spore_helm": "苦菌行者·菌纹兜帽",
 "goblin_spore_armor": "苦菌行者·藏菌轻甲",
 "goblin_spore_gloves": "苦菌行者·菌纹护手",
 "goblin_spore_boots": "苦菌行者·涉苔软靴",
 "goblin_ambush_helm": "余粮斥候·望路兜帽",
 "goblin_ambush_armor": "余粮斥候·藏粮轻甲",
 "goblin_ambush_gloves": "余粮斥候·探隙护手",
 "goblin_ambush_boots": "余粮斥候·潜行软靴",
 "goblin_snare_helm": "旧索匠·铜扣兜帽",
 "goblin_snare_armor": "旧索匠·缚索轻甲",
 "goblin_snare_gloves": "旧索匠·牵索护手",
 "goblin_snare_boots": "旧索匠·攀行软靴",
 "ashen.caldera.helm": "赤脉泄压·熔脉额冠",
 "ashen.caldera.armor": "赤脉泄压·导热矿甲",
 "ashen.caldera.gloves": "赤脉泄压·泄压护手",
 "ashen.caldera.boots": "赤脉泄压·余烬战靴",
 "ashen.strata.helm": "断层重构·叠岩额冠",
 "ashen.strata.armor": "断层重构·叠岩护甲",
 "ashen.strata.gloves": "断层重构·聚岩护手",
 "ashen.strata.boots": "断层重构·踏岩战靴",
 "ashen.prism.helm": "三相晶格·折光额冠",
 "ashen.prism.armor": "三相晶格·晶纹护甲",
 "ashen.prism.gloves": "三相晶格·共振护手",
 "ashen.prism.boots": "三相晶格·映晶战靴"
});
function setPieceName(setId,name){
 const prefix=SET_DISPLAY_NAMES[setId];if(!prefix||typeof name!=='string'||!name)return name;
 if(name.startsWith(prefix+'·'))return name;
 return prefix+'·'+(name.startsWith(prefix)?name.slice(prefix.length):name);
}
const KNOWN_SET_NAME_ALIASES=new Map();
for(const t of EQUIPMENT_TEMPLATES.filter(t=>t.kind==='set')){
 const display=APPROVED_SET_PIECE_NAMES[t.id]??setPieceName(t.setId,t.name);
 for(const alias of [t.name,setPieceName(t.setId,t.name),display])KNOWN_SET_NAME_ALIASES.set(alias,{display,setId:t.setId,slot:t.slot});
}
/** Exact equipment-name aliases only; never replace arbitrary prose or item types. */
export function equipmentNameFromReceipt(name){return KNOWN_SET_NAME_ALIASES.get(name)?.display??name;}
export function equipmentDisplayName(item){
 if(!item||typeof item!=='object')return '';
 const name=typeof item.name==='string'?item.name:'',setId=item.set??item.setId;
 if(item.legendaryId||!SET_DISPLAY_NAMES[setId])return name;
 const template=EQUIPMENT_TEMPLATE_BY_ID[item.templateId??item.id];
 if(template&&template.setId===setId&&template.slot===item.slot)return APPROVED_SET_PIECE_NAMES[template.id]??setPieceName(setId,template.name);
 // Legacy pieces can lack templateId; only exact aliases with matching identity
 // and slot are canonicalized. Unknown historical names remain intact.
 const alias=KNOWN_SET_NAME_ALIASES.get(name);
 if(alias&&alias.setId===setId&&alias.slot===item.slot)return alias.display;
 return setPieceName(setId,name);
}
