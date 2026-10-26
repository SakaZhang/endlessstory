import {CHIK_FAMILY_CHARACTERS,chikFamilyCast,chikFamilySpeaker} from './chik-family-registry.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderChikFamilyPortrait(id){
 if(!Object.hasOwn(CHIK_FAMILY_CHARACTERS,id))return '';
 const c=CHIK_FAMILY_CHARACTERS[id],label=esc(c.name+' · '+c.role);
 return `<span class="npcPortrait" data-npc-portrait="true" data-npc-id="${esc(c.id)}" role="img" aria-label="${label}"><img class="npcPortraitImage" data-npc-portrait-image="true" src="${esc(c.file)}" width="96" height="96" loading="lazy" decoding="async" alt="${label}" draggable="false"><span class="npcPortraitError" hidden>画像载入失败<br>点击重试</span></span>`;
}
// Reuses the existing npcPortrait markup contract, so the App's delegated
// bindNpcPortraitErrors(document) gives these images the SAME bounded recovery.
// Portrait clicks only retry art; no quest, reward, choice or save action exists.
export function renderChikFamilyCast(scene,line=null){
 const cast=chikFamilyCast(scene);if(!cast.length)return '';
 const speaker=chikFamilySpeaker(scene,line);
 return '<div class="storyFamilyCast" aria-label="本段出场的奇克家人">'+cast.map(c=>{
  return `<article class="storyFamilyMember${speaker?.id===c.id?' isSpeaking':''}" data-family-character="${esc(c.id)}"${speaker?.id===c.id?' aria-label="'+esc(c.name)+'正在说话"':''}>${renderChikFamilyPortrait(c.id)}<div><strong>${esc(c.name)}</strong><small>${esc(c.role)}</small><p>${esc(c.personality)}</p></div></article>`;
 }).join('')+'</div>';
}
