import {extendStoryBattleBackgrounds} from './story-battle-backgrounds.js';
// Dedicated authored identities; never substitute playable heroes or local fauna.
export const STORY_ACTOR_ART=Object.freeze({
 'invasion-leader':Object.freeze({name:'入侵首领',kind:'界外入侵',file:'story-assets/invasion-leader.png',height:130,facing:'left',anchor:[96,182],alphaBBox:[17,11,181,182],solidBBox:[17,12,181,181]}),
 'high-priest':Object.freeze({name:'大祭司',kind:'剧情人物',file:'story-assets/high-priest.png',height:98,alphaBBox:[22,20,173,175],solidBBox:[51,21,147,175]}),
 'seal-core':Object.freeze({name:'封印核心',kind:'封印核心',file:'story-assets/seal-core.png',height:88,alphaBBox:[46,19,148,173],solidBBox:[47,20,148,172]}),
 'invasion-wave':Object.freeze({name:'界外入侵涌影',kind:'界外入侵',file:'story-assets/outsider-vanguard.png',height:104,alphaBBox:[8,23,184,176],solidBBox:[8,23,184,176]})
});
export function extendStoryActorManifest(manifest){
 manifest.storyActorSprites??={};
 for(const [id,a]of Object.entries(STORY_ACTOR_ART)){
  const key='story-actor-'+id;manifest.storyActorSprites[id]=key;
  manifest.sprites[key]={frameSize:[192,192],anchor:a.anchor??[96,176],facing:a.facing??'right',frames:[{id:key,file:'../'+a.file,durationMs:150,solidBBox:a.solidBBox}],animations:{idle:[key],attack:[key],hurt:[key]},healthBarAnchor:[96,8]};
 }
 return extendStoryBattleBackgrounds(manifest);
}
export function storyActorPresentationScale(sprite,id){const a=STORY_ACTOR_ART[id],box=sprite?.frames?.[0]?.solidBBox;return a&&box?a.height/(box[3]-box[1]+1):1;}
