// Approved policy: each of six one-off family moments grants two ordinary
// healing potions; completing all six earns one separate reforge token claim.
// This small chapter is NOT the entire Goblin personal arc: no Q3 gear here.
export const CHIK_FAMILY_REWARD_POLICY=Object.freeze({
 id:'chik-family-rewards-v1',approved:true,status:'approved-fixed-budget',
 approval:'Sentinel_b133fec785f081918605bf0e95a3c8ff',fullArcRewardImplemented:false
});
export const CHIK_FAMILY_EVENT_IDS=Object.freeze(['family.kalo.footsteps','family.mirei.missing-grain','family.dobu.cracked-bowl','family.kalo.first-load','family.mirei.saved-share','family.dobu.trophy']);
const supply=Object.freeze([Object.freeze({kind:'potion',key:'healing|0',quantity:2})]);
export const CHIK_FAMILY_EVENT_REWARDS=Object.freeze(Object.fromEntries(CHIK_FAMILY_EVENT_IDS.map(id=>[id,supply])));
// Existing receiveBattleLoot shapes only. No callbacks, RNG, new item identity,
// DOM-supplied reward, stat gain, child-employer gold or inventory cost.
export const CHIK_FAMILY_MILESTONE=Object.freeze({
 id:'family.milestone.six-moments',title:'家人小事 · 阶段补给',
 requiresEventIds:CHIK_FAMILY_EVENT_IDS,
 rewards:Object.freeze([Object.freeze({kind:'consumable',key:'reforgeToken',quantity:1})]),
 description:'六件小事做完，整理家用物件时留出的一枚重铸印记也收好了。奇克可以用它修整装备。',
 pendingDescription:'这是已经整理好的阶段补给，不需要再做一遍家事。行囊放不下时保留待领取，整理后再来领取。'
});
