import {getSkillMetadata} from './race-registry.js';
import {raceIconAsset} from './race-art.js';
// Exact canonical skill identity registry. Pure markup; no game state or resource loading.
const registry={
  "fracture_strike": {
    "name": "裂岩击",
    "kind": "active"
  },
  "fault_sweep": {
    "name": "断层横扫",
    "kind": "active"
  },
  "breach_followup": {
    "name": "破隙追击",
    "kind": "active"
  },
  "ember_brand": {
    "name": "熔火烙印",
    "kind": "active"
  },
  "furnace_wave": {
    "name": "炉焰迸发",
    "kind": "active"
  },
  "cinder_barrage": {
    "name": "余烬连击",
    "kind": "active"
  },
  "iron_vigil": {
    "name": "铁幕守势",
    "kind": "active"
  },
  "bastion_blow": {
    "name": "守势重击",
    "kind": "active"
  },
  "repelling_wave": {
    "name": "震退波",
    "kind": "active"
  },
  "anvil_cry": {
    "name": "战炉怒吼",
    "kind": "active"
  },
  "breaking_intercept": {
    "name": "截势",
    "kind": "active"
  },
  "furnace_etch": {
    "name": "熔蚀刻印",
    "kind": "active"
  },
  "scatter_ash": {
    "name": "撒灰",
    "kind": "active"
  },
  "forge_breath": {
    "name": "回炉息",
    "kind": "active"
  },
  "purifying_bulwark": {
    "name": "净炉壁垒",
    "kind": "active"
  },
  "axe_fervor": {
    "name": "狂斧",
    "kind": "passive"
  },
  "hammer_penetration": {
    "name": "重锤穿甲",
    "kind": "passive"
  },
  "fire_affinity": {
    "name": "炉火亲和",
    "kind": "passive"
  },
  "shield_reserve": {
    "name": "铁壁余力",
    "kind": "passive"
  },
  "mountain_vitality": {
    "name": "山岩体魄",
    "kind": "passive"
  },
  "forged_resilience": {
    "name": "百锻韧性",
    "kind": "passive"
  }
};
export const SKILL_PIXEL_ICONS=Object.freeze(Object.fromEntries(Object.entries(registry).map(([id,row])=>[id,Object.freeze(row)])));
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderSkillPixelIcon(id,{size=32,decorative=true}={}){
 const row=typeof id==='string'?(getSkillMetadata(id)??SKILL_PIXEL_ICONS[id]):null;
 const px=size===64?64:32,label=row?.name??'空技能槽';
 const asset=raceIconAsset('skills',id,px)??(row?.icon&&!Object.hasOwn(SKILL_PIXEL_ICONS,id)?row.icon:null);
 if(asset)return `<span class="skillPixelIcon" data-skill-icon="${esc(id)}" data-skill-icon-size="${px}" ${decorative?'aria-hidden="true"':`role="img" aria-label="${esc(label)}"`} style="background-image:url('${esc(asset)}');background-size:contain;image-rendering:pixelated"></span>`;
 return `<span class="skillPixelIcon${row?'':' isEmpty'}" data-skill-icon="${row?id:'empty'}" data-skill-icon-size="${px}" ${decorative?'aria-hidden="true"':`role="img" aria-label="${esc(label)}"`}></span>`;
}
