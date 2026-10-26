import {chikFamilyCast,chikFamilySpeaker} from './chik-family-registry.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Reuses the existing npcPortrait markup contract, so the App's delegated
// bindNpcPortraitErrors(document) gives these images the SAME bounded recovery.
// Portrait clicks only retry art; no quest, reward, choice or save action exists.
export function renderChikFamilyCast(scene,line=null){
 const cast=chikFamilyCast(scene);if(!cast.length)return '';
 const speaker=chikFamilySpeaker(scene,line);
 return '<div class="storyFamilyCast" aria-label="本段出场的奇克家人">'+cast.map(c=>{
  const label=esc(c.name+' · '+c.role);
  return `<article class="storyFamilyMember${speaker?.id===c.id?' isSpeaking':''}" data-family-character="${esc(c.id)}"${speaker?.id===c.id?' aria-label="'+esc(c.name)+'正在说话"':''}><span class="npcPortrait" data-npc-portrait="true" data-npc-id="${esc(c.id)}" role="img" aria-label="${label}"><img class="npcPortraitImage" data-npc-portrait-image="true" src="${esc(c.file)}" width="96" height="96" loading="lazy" decoding="async" alt="${label}" draggable="false"><span class="npcPortraitError" hidden>画像载入失败<br>点击重试</span></span><div><strong>${esc(c.name)}</strong><small>${esc(c.role)}</small><p>${esc(c.personality)}</p></div></article>`;
 }).join('')+'</div>';
}
