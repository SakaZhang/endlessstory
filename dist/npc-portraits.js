import {RACIAL_NPC_BY_ID} from './racial-npc-event-content.js';
import {NPC_PORTRAIT_REGISTRY} from './npc-portrait-registry.js';
import {bindRecoverableImages} from './asset-recovery.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const npcPortraitDescriptor=id=>Object.hasOwn(NPC_PORTRAIT_REGISTRY,id)?NPC_PORTRAIT_REGISTRY[id]:null;
// Image requests are limited to the rendered area's cast; there is no all-cast preload.
// A Ring posting reuses exactly the same NPC identity and asset URL.
export function renderNpcPortrait(id){
 const d=npcPortraitDescriptor(id),npc=RACIAL_NPC_BY_ID[id];if(!d||!npc)return '';
 const label=esc(npc.name+' · '+npc.role);
 return `<span class="npcPortrait" data-npc-portrait="true" data-npc-id="${esc(id)}" role="img" aria-label="${label}"><img class="npcPortraitImage" data-npc-portrait-image="true" src="${esc(d.file)}" width="96" height="96" loading="lazy" decoding="async" alt="${label}" draggable="false"><span class="npcPortraitError" hidden>画像载入失败<br>点击重试</span></span>`;
}
export function bindNpcPortraitErrors(host){return bindRecoverableImages(host,{imageSelector:'.npcPortraitImage',datasetKey:'npcPortraitImage',wrapperSelector:'[data-npc-portrait="true"]',errorSelector:'.npcPortraitError',label:'人物画像'});}
