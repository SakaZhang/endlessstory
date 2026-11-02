import {storyCastSpeaker,knownStoryEvidenceCast} from './story-cast-registry.js';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Same delegated bounded recovery contract as the 30 regional portraits.
// Hero/priest assets are reused by URL; CSS zooms the head/shoulders without a second stale copy.
export function renderStoryCastPortrait(actor){
 if(!actor||actor.designOnly)return '';
 const label=esc(actor.name+' · '+actor.role),full=actor.existingFullActor,crop=actor.portraitCrop;
 const cropStyle=full&&crop?' style="--story-facing:'+Number(actor.facing??1)+';--story-image-size:'+(192/crop.size*100)+'%;--story-image-left:'+(-crop.x/crop.size*100)+'%;--story-image-top:'+(-crop.y/crop.size*100)+'%"':'';
 return `<span class="npcPortrait storyCastPortrait${full?' storyFullActor':''}" data-npc-portrait="true" data-npc-id="${esc(actor.id)}" role="img" aria-label="${label}"${cropStyle}><img class="npcPortraitImage" data-npc-portrait-image="true" src="${esc(actor.file)}" width="${full?192:96}" height="${full?192:96}" loading="lazy" decoding="async" alt="${label}" draggable="false"><span class="npcPortraitError" hidden>画像载入失败<br>点击重试</span></span>`;
}
export function renderStoryDialogue(scene,line,displayLine=null){
 const actor=storyCastSpeaker(scene,line),shown=displayLine??line,text=actor?shown.replace(/^[^：]+：/,actor.name+(actor.delivery?'（'+actor.delivery+'）':'')+'：'):shown;
 const identity=actor?`<div class="storySpeaker" data-story-speaker="${esc(actor.id)}">${renderStoryCastPortrait(actor)}<div><strong>${esc(actor.name)}</strong><small>${esc(actor.role)}${actor.delivery?' · '+esc(actor.delivery):''}</small></div></div>`:'';
 return `<blockquote class="storyDialogue${actor?' hasPortrait':''}" aria-live="polite">${identity}<p>${esc(text)}</p></blockquote>`;
}
export function renderKnownStoryEvidence(game){
 const rows=knownStoryEvidenceCast(game);if(!rows.length)return '';
 return '<aside class="storyEvidenceCast" aria-label="已知线索中的人物"><h4>已知线索中的人物</h4>'+rows.map(actor=>`<article class="storyEvidencePerson" data-story-evidence="${esc(actor.id)}">${renderStoryCastPortrait(actor)}<div><strong>${esc(actor.name)} · ${esc(actor.role)}</strong><p>${esc(actor.summary)}</p></div></article>`).join('')+'</aside>';
}
