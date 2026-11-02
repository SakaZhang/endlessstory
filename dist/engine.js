import {equipmentDisplayName} from './equipment-display-name.js';
import {INFINITY_GAUNTLET_KEYS,isInfinityGauntletFusion,hasInfinityGauntletMaterial} from './infinity-gauntlet-content.js';
import {validCasinoState} from './casino-state.js';
import {noncombatRunning} from './noncombat-policy.js';
import {reforgeMaterialForLevel} from './reforge-materials.js';
import {beginLootReceipt,captureLoot,finishLootReceipt,validLootHistory} from './loot-history.js';
import {freshOtherworldState,validOtherworldState,normalizeOtherworldState,otherworldUnlocked,otherworldFloorStats,OTHERWORLD_PENDING_LIMIT,OTHERWORLD_MAX_FLOOR,OTHERWORLD_LOOT_POLICY} from './otherworld-state.js';
export {otherworldUnlocked,otherworldFloorStats,OTHERWORLD_MAX_FLOOR,OTHERWORLD_LOOT_POLICY} from './otherworld-state.js';
import {withSetEffects} from './set-effects.js';
import {materialFusionQualityWeights,materialFusionSlotBias,favorableQualityProbabilities} from './material-fusion-policy.js';
import {dungeonLootSnapshot,recordDungeonLootReceipt,validDungeonLootReceipts} from './dungeon-loot-receipts.js';
import {dungeonDamageMultiplier} from './dungeon-threat.js';
import {ordinaryAffixKeys} from './affix-slot-pools.js';
export {SLOT_AFFIX_POOLS} from './affix-slot-pools.js';
import {validSkillCondition} from './skill-conditions.js';
import {activeHealingMultiplier,talentRefundCost,TALENT_BALANCE_VERSION} from './talent-policy.js';
import {validInfinityGauntletState,settleInfinityRecipe} from './infinity-gauntlet-state.js';
import {validWorldEventState,worldEventsDue,advanceRandomWorldEvents} from './random-world-events.js';
export {worldEventsDue,RANDOM_WAR_RULES} from './random-world-events.js';
import {validStoryWarState,storyTerritoryAccess} from './story-war-bridge.js';
import {retreatFromWar} from './war-travel-boundary.js';
import {STORY_SCENES} from './story-event-registry.js';
import {freshDiplomacy,validDiplomacy,normalizeDiplomacy,territoryAccess,nodeAccess,applyWarStart,applyWarEnd,pruneRandomWarHistory,withWarReplay} from './war-diplomacy.js';
export {validDiplomacy,normalizeDiplomacy,territoryAccess,nodeAccess} from './war-diplomacy.js';
import {validReturnRingState,applyReturnRingVictory,returnRingRareBonus} from './return-ring-state.js';
import {NPC_EVENTS,npcEventIsModern,validNpcEventState,recordNpcEventVictory,recordNpcEventExploration} from './npc-events.js';
import {validStoryEventState,canStartStoryScenario,canStartStoryFieldEncounter,recordStoryScenarioResult,recordStoryEncounterVictory} from './story-event-controller.js';
import {storyScenarioNonlethal} from './story-scenario-registry.js';
import {storyScenarioForStart,attachStoryScenario,advanceStoryScenario,finalizeStoryScenario,validStoryScenarioState,storyScenarioMode} from './story-scenario-combat.js';
import {validPersonalArcRewardState} from './personal-arc-rewards.js';
export {claimPersonalArcReward,claimPersonalEventReward,personalArcRewardSlots,personalArcRewardStatus,PERSONAL_ARC_REWARDS,PERSONAL_EVENT_REWARDS} from './personal-arc-rewards.js';
import {validTaskRewardState} from './task-reward-transaction.js';
// Sealed production claim only; trusted registry factory is not an engine API.
export {claimTaskReward} from './task-reward-transaction.js';
import {dispatchRacialLegendaryEvent,racialLegendaryStatBonuses} from './racial-legendary-runtime.js';
import {rollGoblinExtraMaterial} from './race-loot.js';
import {racialGoldCost} from './race-economy.js';
export {racialGoldCost} from './race-economy.js';
import {EXPANSION_PACKS} from './race-packs.js';
import {getRacePack,getSkillTreeDefinition,getSkillMetadata,getRaceTuning,raceSockets,PLAYABLE_RACES} from './race-registry.js';
import {WORLD_MONSTERS as ALL_MONSTERS,monsterParameters,raceParameterSet,areaBudgetReady,raceGroupChance,eligibleMonsters} from './world-content.js';
import {POTION_CATALOG,POTION_BUFF_KEYS,POTION_RECIPE_CATALOG,POTION_IMPORT_MATERIALS,potionCatalogEffect,potionRecipeAllows} from './potion-catalog.js';
import {emitCombatDisplay} from './combat-display-bridge.js';
import {TREE_TUNING} from './skill-tree-tuning.js';
import {resolveTreePassives,derivePassiveStats,passiveReceivedHeal} from './skill-tree-passives.js';
import {DWARF_EXPANDED_DEFINITION as SKILL_TREE_DEFINITION} from './dwarf-skill-expansion.js';
import {validSkillTree,normalizeSkillTree,quoteSkillTreeChange,prepareSkillTreeChange} from './skill-tree-state.js';
export {DWARF_EXPANDED_DEFINITION as SKILL_TREE_DEFINITION} from './dwarf-skill-expansion.js';
export const skillTreeNode=id=>SKILL_TREE_DEFINITION.nodes.find(n=>n.id===id)??null;
import {validRegionNavigation,normalizeRegionNavigation,getRegionNavigation,recordNodeExplored,recordMaterialDiscovered,toggleFavoriteNode,setFavoriteNode} from './region-navigation-state.js';
export {validRegionNavigation,normalizeRegionNavigation,getRegionNavigation,toggleFavoriteNode,setFavoriteNode} from './region-navigation-state.js';
import {LEGENDARY_EQUIPMENT_DEFINITIONS,createLegendaryEquipment,validLegendaryEquipmentMetadata} from './legendary-equipment.js';
import {prepareLegendaryDrop} from './legendary-drop.js';
import {legendaryPoolProbability} from './luck-policy.js';
import {ordinarySecondRollProbability,lootOccurrenceProbability,divineProbability} from './luck-policy.js';
import {combinedFavorableRollChance,dwarfDivineChance,dwarfForgeOccurrenceChance,weightedDonorIndex} from './dwarf-forge-favor.js';
import {DWARF_FORGE_FAVOR_CONFIG} from './dwarf-forge-favor-config.js';
import {validEquipmentRuntime,normalizeEquipmentRuntime,applyEquipmentRuntimeChange} from './equipment-runtime.js';
export {validEquipmentRuntime,normalizeEquipmentRuntime,applyEquipmentRuntimeChange} from './equipment-runtime.js';
import {makeAffixSourceRange,affixOwnRange,validAffixSource,affixSourceLabel} from './affix-range.js';
import {deriveNewItemBudget,validItemBudgetMetadata} from './equipment-budget-adapter.js';
import {applyExperience,totalEarnedXp} from './character-progression.js';
import {dwarfBudgetReady} from './dwarf-content.js';
const DWARF_MONSTERS=ALL_MONSTERS;
export {configureDwarfParameters,dwarfBudgetReady} from './dwarf-content.js';
import {initializeDwarfActor} from './dwarf-effects.js';
import {WORLD_MATERIAL_REGISTRY as DWARF_MATERIAL_REGISTRY,rollWorldMaterials as rollMonsterMaterials,worldInventoryKey as toDwarfInventoryKey,getWorldMaterialPool as getDwarfMaterialPool} from './world-materials.js';
import {chooseFusionOrigin,fusionOriginTemplates,fusionOriginWeights} from './fusion-origin.js';
export {chooseFusionOrigin,fusionOriginWeights} from './fusion-origin.js';
import {GROWTH_SPECIAL_DEFS,validGrowthSpecial,growthBonuses,recordGrowthKills} from './special-affix-growth.js';
export {specialAffixProgress} from './special-affix-growth.js';
import {LUCKY_DICE_CODEX,luckyDiceStatBonuses} from './lucky-dice.js';
import {NEW_ORDINARY_AFFIX_DEFS,NEW_SPECIAL_DEFS,createBattleAffixState,validBattleAffixState,tryNirvana,tryReaperHit,lifestealRate,lifestealHeal,openingShelterShield,validDungeonAffixUsage} from './affix-expansion.js';
import {selectEquipmentTemplate,applyEquipmentTemplate,validEquipmentTemplateMetadata} from './equipment-templates.js';
export {EQUIPMENT_TEMPLATES,EQUIPMENT_TEMPLATE_BY_ID,RACE_WEAPON_POOLS,equipmentTemplateDisplay} from './equipment-templates.js';
import {validEnhancementMetadata,enhancedItemBase,attemptEnhancement} from './equipment-enhancement.js';
export {quoteEnhancement,FORMAL_ENHANCEMENT_CONFIG,DEVELOPMENT_ENHANCEMENT_CONFIG,enhancementLevel,enhancedItemBase,quoteDeveloperEnhancement,prepareDeveloperEnhancement,attemptDeveloperEnhancement} from './equipment-enhancement.js';
import {racialSurvivalGrowth} from './race-survival-balance.js';
import {pauseMulti,makeMultiUnit,validMultiProfile,validMultiEncounter,validFixtureAction,syncMultiTarget,selectMultiTarget,multiTargetRows,stepMulti,withMultiRng,multiItemId} from './multi-combat.js';
import {validMonsterLedger,recordEncounteredMonsters} from './monster-codex-schema.js';
import {RECOVERY_RECIPE_CONFIG,recoveryInputPlan,rollRecoverySupply} from './recovery-recipe-schema.js';
export {RECOVERY_RECIPE_CONFIG,recoveryInputPlan,recoverySourceEligible} from './recovery-recipe-schema.js';
import {rollEquipmentInputQuality,fusionDivineChance} from './fusion-input-schema.js';
export {equipmentFusionQualityDistribution,rollEquipmentInputQuality,fusionDivineChance} from './fusion-input-schema.js';
import {equipmentFingerprint,validBatchSelection,validBatchQuote} from './batch-sale-schema.js';
import {validCollectionLedger,addOwnedCollection,normalizeCollectionLedger} from './codex-collection-schema.js';
import {rollSourceSet,isMerchantEquipmentSellable,eligibleSetSource,setDropProbability} from './set-source-schema.js';
import {RARE_REWARD_RULES,freshRareRewardProgress,normalizeRareRewardProgress,validRareRewardProgress,rareRewardStorageBlocked} from './rare-reward-progress.js';
export {RARE_REWARD_RULES,setDropProbability};
export {rollSourceSet,isMerchantEquipmentSellable};
// The retained developer sandbox uses named fixture skills, not the retired level-unlock model.
const skillUnlocked=(_s,key)=>typeof key==='string'&&Object.hasOwn(SKILLS,key);
import {BAG_LIMITS,INVENTORY_SAVE_LIMIT,bagCounts,canReceiveEquipment,canReceiveMaterial,canReceiveItem,validLootFilters,normalizeInventoryState,setLootFilter,shouldDiscardLoot,emptyLootSummary,validLootSummary,mergeLootSummary} from './inventory-schema.js';
export {BAG_LIMITS,bagCounts,canReceiveEquipment,canReceiveMaterial,canReceiveItem,normalizeInventoryState,setLootFilter,shouldDiscardLoot} from './inventory-schema.js';
import {validDungeonCarry,captureDungeonPlayerState,applyDungeonPlayerState,restoreDungeonSkillShieldLayers} from './dungeon-player-state.js';
import {validEquipmentLevelMetadata,normalizeEquipmentLevels,rollDropEquipmentLevel,rollMaterialFusionLevel,rollEquipmentFusionLevel} from './equipment-level-schema.js';
export {normalizeEquipmentLevels,rollDropEquipmentLevel,rollMaterialFusionLevel,rollEquipmentFusionLevel,EQUIPMENT_LEVEL_SOURCES} from './equipment-level-schema.js';
import {AREAS,SITES,INSTANCES,PLANNED_INSTANCES,RACE_KEYS,areaLevelRange,resolveLegacySite,instanceCooldownMs,pickRoute,areaGearLevel} from './location-schema.js';
export {AREAS,SITES,INSTANCES,RACE_KEYS,areaLevelRange,resolveLegacySite,instanceCooldownMs,pickRoute,areaGearLevel} from './location-schema.js';
import {ELEMENT_KEYS,ELEMENT_AFFIX_DEFS,resolveElementDamage} from './element-schema.js';
export {ELEMENT_KEYS,resolveElementDamage} from './element-schema.js';
// v0.4 equipment foundation. Item families and equipment sockets are intentionally separate.
import {SCHEMA_VERSION} from './save-generation.js';
export {SCHEMA_VERSION} from './save-generation.js';
export const SLOTS = ['weapon','helm','armor','gloves','boots','ring','amulet','core'];
export const SOCKETS = ['weapon','helm','armor','gloves','boots','ring1','ring2','amulet'];
export const SOCKET_TYPE = Object.fromEntries([...SOCKETS,'core'].map(k=>[k,k.startsWith('ring')?'ring':k]));
export const CORE_SOCKET = {socket:'core',type:'core',race:'ashen',playable:true};
export const SLOTNAME = {weapon:'武器',helm:'头盔',armor:'护甲',gloves:'手套',boots:'靴子',ring:'戒指',ring1:'戒指左',ring2:'戒指右',amulet:'项链',core:'核心'};
export const RARITY = ['普通','稀有','优良','至臻'];
export const SET_SLOTS = ['helm','armor','gloves','boots'];
export const BUILD = [...EXPANSION_PACKS.flatMap(p=>p.sets.map(s=>({...s,originRace:p.id,skills:[],bonus:[s.two?.description,s.four?.description].filter(Boolean).join('；')||s.description||''}))),
 {id:'anvil',name:'碎砧',sub:'裂甲 · 重击',skills:['break','heavy','interrupt',null],bonus:'2件：对流血或破甲目标的物理技能直伤提高20%。4件：破隙追击持斧时，对流血目标的第二击伤害提高60%；持锤时，对破甲目标的条件追加伤害提高75%；其他武器对流血或破甲目标的基础伤害提高25%。'},
 {id:'rune',name:'炉纹',sub:'铭火 · 引燃',skills:['mark','ignite','interrupt',null],bonus:'2件：灼烧持续伤害提高30%。4件：炉焰迸发持斧时，灼烧施加概率增加25个百分点（最高100%）；持锤时，对灼烧目标的条件追加伤害提高70%；其他武器基础伤害提高30%。'},
 {id:'guard',name:'守冢',sub:'坚守 · 反击',skills:['guard','break','interrupt',null],bonus:'2件：技能产生的护盾量提高25%。4件：守势重击持斧时，防御提升效果提高50%；持锤且自身有护盾时，条件追加伤害提高60%；其他武器基础伤害提高25%。'}
].map(withSetEffects);
export const SKILLS={break:{name:'裂甲锤',icon:'⌁',cd:4,desc:'120%攻击伤害，削减目标25%护甲，持续6回合。'},heavy:{name:'重锻击',icon:'✦',cd:5,desc:'220%攻击伤害，破甲目标再提高25%。'},interrupt:{name:'断势',icon:'ϟ',cd:6,desc:'115%攻击伤害，打断本回合蓄力重击。'},mark:{name:'铭火',icon:'♨',cd:4,desc:'90%攻击的火元素伤害，附加5回合火焰灼烧；不受护甲影响。'},ignite:{name:'引燃',icon:'✧',cd:5,desc:'160%攻击的火元素伤害，灼烧目标额外80%攻击；不受护甲影响。'},guard:{name:'坚守',icon:'▣',cd:5,desc:'100%攻击伤害，3回合减伤40%并反击。'}};
Object.assign(SKILLS,{
 warcry:{name:'砧誓战吼',icon:'⚒',cd:7,desc:'攻击提高25%，持续3回合。碎砧2件延长1回合。'},
 ironcoat:{name:'铁衣铭文',icon:'▣',cd:7,desc:'护甲提高40%，持续3回合。守冢2件延长1回合。'},
 blunt:{name:'挫锋打击',icon:'⌁',cd:7,desc:'60%攻击伤害；敌方攻击降低20%，持续3回合。'},
 scorch:{name:'炉蚀刻印',icon:'♨',cd:7,desc:'50%攻击伤害；目标受到铭火、引燃与灼烧伤害提高25%，持续4回合。炉纹2件延长1回合。'},
 delay:{name:'迟滞符',icon:'⌛',cd:8,desc:'重击将至时使用：将本次重击延后1回合，敌人仍普通攻击。同一次重击最多延后一次。'},
 barrier:{name:'铸壁',icon:'▥',cd:8,desc:'获得20%最大生命护盾，持续3回合，不叠加。守冢4件同时获得2回合坚守反击。'},
 mend:{name:'回炉息',icon:'✚',cd:10,desc:'生命低于60%时恢复70%攻击+15生命，基础最多20%最大生命；复苏天赋追加恢复后，总量不超过35%最大生命。'},
 cleanse:{name:'净炉',icon:'✧',cd:7,desc:'仅在有灼烧或虚弱时释放，移除自身灼烧和虚弱。'}
});
export const LOCS=[
 {name:'失落驿道',en:'THE FORSAKEN ROAD',desc:'沿着车辙，追查消失的黑炉商队。',enemy:'灰旗劫掠者',boss:'灰旗首领 · 沃恩',hp:100,atk:9,armor:7,mat:'铁屑',tag:'金属',reward:3,bossGold:20},
 {name:'熄火矿井',en:'THE HOLLOW FORGE',desc:'熔炉已经冷却，矿井深处仍有锤声。',enemy:'失控矿傀',boss:'炉心守卫 · 断铸',hp:170,atk:14,armor:20,mat:'炉火晶',tag:'火焰',reward:5,bossGold:35},
 {name:'旧誓墓园',en:'THE OATHBOUND GRAVES',desc:'破碎盟约的见证者，沉睡于灰冠之下。',enemy:'失誓卫兵',boss:'守誓者 · 莫尔',hp:250,atk:20,armor:12,mat:'誓约残片',tag:'灵魂',reward:8,bossGold:55}
];
export const TALENTS={
 power:{name:'力量',desc:'每点攻击 +3。',icon:'heavy',cap:null},heart:{name:'体魄',desc:'每点生命 +20。',icon:'mend',cap:null},steel:{name:'坚韧',desc:'每点护甲 +3。',icon:'ironcoat',cap:null},
 precision:{name:'精准',desc:'每点命中 +5。',icon:'mark',cap:10},crit:{name:'锐意',desc:'每点暴击 +5。',icon:'interrupt',cap:10},critDamage:{name:'重创',desc:'每点暴伤 +8。',icon:'heavy',cap:null},
 penetration:{name:'破壁',desc:'每点物理穿甲 +2。',icon:'break',cap:null},element:{name:'元素亲和',desc:'每点元素技能增幅 +2；只增强元素伤害，不为物理攻击追加附伤。',icon:'fire',cap:null},elementResist:{name:'元素抗性',desc:'每点六系元素抗性各 +5；按对应元素降低伤害。',icon:'cleanse',cap:null},
 block:{name:'格挡训练',desc:'每点格挡 +4，概率减轻30%直接攻击伤害。',icon:'barrier',cap:10},shield:{name:'护盾塑形',desc:'已有技能或词条生成护盾时，每点额外 +4；不自动生成。',icon:'shield',cap:null},healing:{name:'复苏',desc:'所有种族主动技能的直接治疗：前10点每点 +4%，超过10点后额外加成=40%×超出点数÷(20+超出点数)，总加成低于80%。不增强持续治疗、药剂、吸血或护盾。',icon:'mend',cap:null},
 resolve:{name:'抗扰',desc:'每点缩短新受到的持续负面状态2%，最多20%；与被动乘算。持续伤害至少保留1跳；不改变下一次普攻减速。',icon:'ironcoat',cap:10},luck:{name:'幸运',desc:'小幅提高非套装掉落、融合品质及改造普通词条数值；并小幅提高合格战利品、套装、特殊词条与神赐机会；不改变战斗触发及强化成功率。',icon:'ring',cap:10}
};
export const MAX_FRUIT_TALENT_POINTS=3e9;
export function talentPointBudget(s){return s.level-1+(s.earnedFruitTalentPoints??0);}
export function useWisdomFruit(s,expectedQuantity,battleActive=false){
 if(noncombatRunning(s)||battleActive||s.activeEncounter&&!s.activeEncounter.done||!validTalents(s)||!validConsumables(s)||!Number.isSafeInteger(expectedQuantity)||expectedQuantity<1||s.consumables?.memoryFruit!==expectedQuantity||(s.earnedFruitTalentPoints??0)>MAX_FRUIT_TALENT_POINTS-3)return false;
 s.consumables.memoryFruit--;s.earnedFruitTalentPoints=(s.earnedFruitTalentPoints??0)+3;return true;
}
function validTalents(s){
 if(s.earnedFruitTalentPoints!==undefined&&(!Number.isSafeInteger(s.earnedFruitTalentPoints)||s.earnedFruitTalentPoints<0||s.earnedFruitTalentPoints>MAX_FRUIT_TALENT_POINTS||s.earnedFruitTalentPoints%3!==0))return false;
 if(s.bonusTalentPoints!==undefined||s.testGrants!==undefined||s.talentBalanceVersion!==undefined&&s.talentBalanceVersion!==TALENT_BALANCE_VERSION)return false;
 if(!s.talents||typeof s.talents!=='object'||Array.isArray(s.talents))return false;
 if(!['power','heart','steel'].every(k=>Number.isInteger(s.talents[k])&&s.talents[k]>=0))return false;
 return Object.entries(s.talents).every(([key,n])=>Object.hasOwn(TALENTS,key)&&Number.isSafeInteger(n)&&n>=0&&n<=(TALENTS[key].cap??talentPointBudget(s)))&&Object.values(s.talents).reduce((a,b)=>a+b,0)<=talentPointBudget(s);
}
export const CONSUMABLES={memoryFruit:{name:'灵慧之果',icon:'memoryfruit',description:'精灵地区特产；使用1枚永久增加3点可分配天赋点，不自动加点。',price:200},reforgeToken:{name:'重铸印记',icon:'reforgeToken',description:'完整重铸消耗1枚；保留旧结果也不返还。',price:120}};
// Charges are pooled uses: buying one token adds three; activating one banks one attempt.
export const BOSS_CHALLENGE_PRICE=1000,BOSS_CHALLENGE_USES=3,MAX_BOSS_CHALLENGES=1e9;
const validBossCount=n=>Number.isSafeInteger(n)&&n>=0&&n<=MAX_BOSS_CHALLENGES;
function validBossChallengeState(s){return (s.extraBossChallenges===undefined||validBossCount(s.extraBossChallenges))&&(s.consumables?.bossChallengeCharges===undefined||validBossCount(s.consumables.bossChallengeCharges));}
export function bossChallengeStatus(s){const charges=s.consumables?.bossChallengeCharges??0;return {charges,extraChallenges:s.extraBossChallenges??0,items:Math.ceil(charges/BOSS_CHALLENGE_USES)};}
// These mutations must be persisted by the caller's clone-save-adopt transaction.
export function buyBossChallengeToken(s,quantity=1){
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>Math.floor(MAX_BOSS_CHALLENGES/BOSS_CHALLENGE_USES)||!validSave(s))return false;
 const charges=quantity*BOSS_CHALLENGE_USES,cost=quantity*BOSS_CHALLENGE_PRICE;
 if(s.gold<cost||!canReceiveItem(s,'bossChallengeCharges',charges))return false;
 s.consumables??={memoryFruit:0};s.consumables.bossChallengeCharges=(s.consumables.bossChallengeCharges??0)+charges;s.gold-=cost;return true;
}
export function useBossChallengeToken(s,quantity=1){
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>MAX_BOSS_CHALLENGES||!validSave(s))return false;
 const {charges,extraChallenges}=bossChallengeStatus(s);
 if(charges<quantity||extraChallenges+quantity>MAX_BOSS_CHALLENGES)return false;
 // Banking an attempt is safe during combat; it must not touch encounter state or clocks.
 s.consumables.bossChallengeCharges-=quantity;s.extraBossChallenges=extraChallenges+quantity;return true;
}
export function canUseExtraBossChallenge(s,instanceId){
 const instance=PLANNED_INSTANCES[instanceId];
 return validBossChallengeState(s)&&(s.extraBossChallenges??0)>0&&instance?.enabled&&instance.kind==='boss'&&instance.siteId===s.siteId;
}
function validConsumables(s){return s.consumables===undefined||(s.consumables&&Number.isSafeInteger(s.consumables.memoryFruit)&&s.consumables.memoryFruit>=0&&s.consumables.memoryFruit<=1e9&&(s.consumables.reforgeToken===undefined||(Number.isSafeInteger(s.consumables.reforgeToken)&&s.consumables.reforgeToken>=0&&s.consumables.reforgeToken<=1e9))&&(s.consumables.refundCredits===undefined||(Number.isSafeInteger(s.consumables.refundCredits)&&s.consumables.refundCredits>=0&&s.consumables.refundCredits<=1e10)));}
export function normalizeTalents(s){
 if(!validTalents(s)||!validConsumables(s))return false;
 for(const key of Object.keys(TALENTS))s.talents[key]??=0;
 s.consumables??={memoryFruit:0};s.consumables.refundCredits??=0;s.consumables.reforgeToken??=0;return true;
}
export function availableTalentPoints(s){return talentPointBudget(s)-Object.values(s.talents).reduce((a,b)=>a+b,0);}
export function spendTalent(s,key,battleActive=false){
 if(noncombatRunning(s)||battleActive||s.activeEncounter&&!s.activeEncounter.done||!Object.hasOwn(TALENTS,key)||!validTalents(s)||!validConsumables(s)||availableTalentPoints(s)<=0||(TALENTS[key].cap!==null&&(s.talents[key]??0)>=TALENTS[key].cap))return false;
 normalizeTalents(s);s.talents[key]++;capHealth(s);return true;
}
export function getTalentRefundQuote(s,draft){
 if(!validTalents(s)||!validConsumables(s)||!draft||typeof draft!=='object'||Array.isArray(draft))return null;
 const rows=Object.entries(draft);if(!rows.length||!rows.every(([key,n])=>Object.hasOwn(TALENTS,key)&&Number.isSafeInteger(n)&&n>0&&n<=(s.talents[key]??0)))return null;
 return talentRefundCost(s,rows.reduce((n,[,v])=>n+v,0));
}
export function commitTalentRefund(s,draft,battleActive=false){
 if(noncombatRunning(s)||battleActive||s.activeEncounter&&!s.activeEncounter.done)return false;const quote=getTalentRefundQuote(s,draft);
 if(!quote||(s.consumables?.memoryFruit??0)<quote.fruitCost||!Number.isFinite(s.gold)||s.gold<quote.goldCost)return false;
 normalizeTalents(s);s.consumables.refundCredits=quote.creditsAfter;s.gold-=quote.goldCost;s.talentBalanceVersion=TALENT_BALANCE_VERSION;
 for(const [key,n] of Object.entries(draft))s.talents[key]-=n;capHealth(s);return true;
}
export const AFFIX_DEFS={
 atk:{name:'攻击',suffix:'',min:3,max:8},hp:{name:'生命',suffix:'',min:15,max:40},armor:{name:'护甲',suffix:'',min:2,max:6},
 hit:{name:'命中',suffix:'',min:5,max:12},crit:{name:'暴击',suffix:'',min:5,max:15},critDamage:{name:'暴伤',suffix:'',min:8,max:20},element:{name:'元素技能增幅',suffix:'',min:2,max:7},...ELEMENT_AFFIX_DEFS,...NEW_ORDINARY_AFFIX_DEFS
};
export const ACTIVE_AFFIX_KEYS=Object.freeze(['atk','hp','armor','hit','crit','critDamage',...Object.keys(ELEMENT_AFFIX_DEFS),...Object.keys(NEW_ORDINARY_AFFIX_DEFS)]);
// Roll color is derived from the original roll, never from divine gains.
export function affixRollInfo(a){
 const def=affixOwnRange(a,AFFIX_DEFS);if(!def)return null;
 const ratio=Math.max(0,Math.min(1,(a.value-def.min)/(def.max-def.min||1)));
 const tier=Math.min(3,Math.floor(ratio*4));
 return {min:def.min,max:def.max,raw:a.value,tier,sourceLabel:affixSourceLabel(a),color:['#e4e5e7','#69b9f0','#bc8cf2','#f07878'][tier]};
}
export function divineMultiplier(it){return it.divine?.id==='forge-favor'&&it.divine.model==='raw-v1'?1.1:1;}
export const SPECIALS={
 knowledge:{name:'求知',desc:'常规战斗胜利时50%概率额外获得一次基础战斗经验，不重复触发；异界除外。'},
 momentum:{name:'余势',desc:'直接攻击击杀后，下一次命中的普攻或主动伤害技能伤害 +100%（整次施放含多段；多重追加独立消耗新余势）。不叠加，败退清除，持续伤害和反击不触发。'},
 ...NEW_SPECIAL_DEFS,
 ...GROWTH_SPECIAL_DEFS
};
// Retired owned affixes stay readable without joining generation or the catalog.
Object.defineProperty(SPECIALS,'scavenger',{value:Object.freeze({name:'已移除词条',desc:'拾荒者已移除，不再产生效果。',enabled:false,retired:true}),enumerable:false});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
let serial=0;
const uid=()=>multiItemId()??`${Date.now().toString(36)}-${(++serial).toString(36)}-${Math.random().toString(36).slice(2,7)}`;
const rand=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const names={weapon:'战锤',helm:'铁盔',armor:'板甲',gloves:'护手',boots:'战靴',ring:'指环',amulet:'护符'};
const bases={weapon:{atk:12,armor:1,hp:5},helm:{atk:1,armor:4,hp:18},armor:{atk:1,armor:8,hp:18},gloves:{atk:3,armor:3,hp:8},boots:{atk:1,armor:4,hp:10},ring:{atk:3,armor:1,hp:8},amulet:{atk:2,armor:1,hp:14}};
function weighted(entries){let roll=Math.random()*entries.reduce((n,[,w])=>n+w,0);for(const [key,w] of entries){roll-=w;if(roll<0)return key;}return entries.at(-1)[0];}
export const ACTIVE_SPECIAL_KEYS=Object.freeze(Object.keys(SPECIALS).filter(k=>SPECIALS[k].enabled!==false));
// Only previously committed personal-arc reservations request this historical pool.
const RESERVED_SPECIAL_KEYS_V081=Object.freeze(['knowledge','scavenger','momentum','shelter','nirvana','reaper','multicast']);
const activeSpecialKeys=()=>ACTIVE_SPECIAL_KEYS;
function rollAffixes(slot,quality,sourceLevel,luck=0,forgeRace=null,legacyPool=false){const pool=[...(legacyPool?ACTIVE_AFFIX_KEYS:ordinaryAffixKeys(slot))];const count=quality===0?rand(0,1):quality+1,affixes=[];for(let i=0;i<count;i++){const key=pool.splice(rand(0,pool.length-1),1)[0],sourceRange=makeAffixSourceRange(AFFIX_DEFS[key],quality,{stat:key,sourceLevel});affixes.push({stat:key,value:forgeRace===null?luckyRoll(()=>rand(sourceRange.min,sourceRange.max),luck):forgeLuckyRoll(()=>rand(sourceRange.min,sourceRange.max),luck,forgeRace),sourceRange});}return affixes;}
export function item(slot,level=1,set=null,rarity=0,levelMetadata={}){
 if(!SLOTS.includes(slot))throw new Error('Unsupported item family');
 rarity=clamp(Math.floor(rarity),0,3);level=Math.max(1,Math.floor(level));
 if(set&&(!SET_SLOTS.includes(slot)||!BUILD.some(b=>b.id===set)))set=null;
 if(set)rarity=3;
 const originRace=levelMetadata.originRace??(set?BUILD.find(b=>b.id===set)?.originRace:null)??(slot==='core'?'ashen':'dwarf');if(!fusionOriginTemplates(originRace,{slot,setId:set}).length)throw new Error('Equipment origin has no registered template');
 const name=(set?BUILD.find(x=>x.id===set).name+'·':'旅铸·')+names[slot];
 const baseLevel=levelMetadata.baseLevel??level,levelSource=levelMetadata.levelSource??'generated';
 if(!validEquipmentLevelMetadata({baseLevel,levelSource}))throw new RangeError('Invalid equipment level provenance');
 const out={id:uid(),slot,set,rarity,level,baseLevel,levelSource,name,atk:0,armor:0,hp:0,affixes:rollAffixes(slot,rarity,level,levelMetadata.luck??0,levelMetadata.forgeRace??null,levelMetadata.legacyAffixPool===true),special:null,legendaryId:null,locked:false,bless:0};
 const specialChance=lootOccurrenceProbability(rarity===2?.1:.2,levelMetadata.luck??0);
 if(!set&&rarity>=2&&Math.random()<(levelMetadata.forgeRace?dwarfForgeOccurrenceChance(specialChance,levelMetadata.forgeRace,DWARF_FORGE_FAVOR_CONFIG):specialChance)){const pool=levelMetadata.legacySpecialPool===true?RESERVED_SPECIAL_KEYS_V081:activeSpecialKeys();out.special={id:pool[rand(0,pool.length-1)]};}
 let hash=2166136261;for(const ch of out.id){hash^=ch.charCodeAt(0);hash=Math.imul(hash,16777619)>>>0;}
 const template=selectEquipmentTemplate({slot,setId:set,originRace},()=>hash/2**32);const generated=template?applyEquipmentTemplate(out,template.id):out;Object.assign(generated,deriveNewItemBudget({slot,baseVariant:generated.baseVariant,level,quality:rarity}));return generated;
}
export function legendaryItem(legendaryId,level,metadata={}){return createLegendaryEquipment({id:uid(),legendaryId,level,baseLevel:metadata.baseLevel??level,levelSource:metadata.levelSource??'drop',affixDefs:Object.fromEntries(ACTIVE_AFFIX_KEYS.map(k=>[k,AFFIX_DEFS[k]])),rollValue:range=>luckyRoll(()=>rand(range.min,range.max),metadata.luck??0)});}
export function itemTotals(it,{development=false}={}){const m=divineMultiplier(it),base=enhancedItemBase(it,{development})??it;return {atk:base.atk*m,armor:base.armor*m,hp:base.hp*m};}
export function sellValue(it){return [2,4,8,16][it.rarity]+Math.floor(it.level/3);}
// Cost previews are deterministic and never consume random rolls.
export function getReforgeCost(it,mode,s=null){
 if(!it||!Number.isInteger(it.rarity)||it.rarity<0||it.rarity>3||!Array.isArray(it.affixes)||!it.affixes.length)return null;
 if(mode==='all')return {gold:0,materials:{},consumables:{reforgeToken:1}};
 if(mode==='replace')return {gold:0,materials:{},equipment:1};
 const material=reforgeMaterialForLevel(it.level);
 return mode==='value'&&material?{gold:racialGoldCost(s,10+5*it.rarity),materials:{[material.key]:material.quantity}}:null;
}
// Read-only quote binds the exact target, donor, level, price and q0 balance.
export function getReforgeQuote(s,itemId,mode,index=0,donorId){
 const it=s?.inventory?.find(i=>i.id===itemId),cost=getReforgeCost(it,mode,s);
 if(!cost)return null;
 const material=mode==='value'?reforgeMaterialForLevel(it.level):null;
 return {version:1,itemId,level:it.level,mode,index:mode==='all'?null:index,donorId:donorId??null,
  target:JSON.stringify(it),donor:mode==='replace'?JSON.stringify(s.inventory.find(i=>i.id===donorId)??null):null,
  cost,goldOwned:s.gold,materials:material?[{...material,owned:materialCount(s,material.key,0)}]:[],
  consumables:Object.fromEntries(Object.keys(cost.consumables??{}).map(k=>[k,s.consumables?.[k]??0]))};
}
export function eligibleReforgeDonors(s,targetId,index=0){
 const target=s?.inventory?.find(it=>it.id===targetId);
 if(!target||!validEquipment(target)||!Number.isInteger(index)||index<0||index>=target.affixes.length||s.pendingReforge)return [];
 const occupied=new Set(target.affixes.filter((a,i)=>i!==index).map(a=>a.stat));
 const legalDonor=it=>validEquipment(it)&&Array.isArray(it.affixes)&&new Set(it.affixes.map(a=>a?.stat)).size===it.affixes.length&&it.affixes.every(a=>validAffixSource(a,AFFIX_DEFS));
 return s.inventory.filter(it=>it.id!==targetId&&it.slot===target.slot&&legalDonor(it)&&!it.locked&&!Object.values(s.equip).includes(it.id)&&!isProtected(s,it.id)).map(it=>({item:it,affixes:it.affixes.filter(a=>Object.hasOwn(AFFIX_DEFS,a.stat)&&!occupied.has(a.stat))})).filter(x=>x.affixes.length);
}
export const REFORGE_DIVINE_CONFIG=Object.freeze({chance:0.03});
const sameReforgeData=(a,b)=>{
 if(a===b)return true;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&sameReforgeData(a[k],b[k]));
};
function reforgeCandidateItem(it,p){
 const candidate=structuredClone(it);candidate.affixes=structuredClone(p.newAffixes);
 // Special affixes belong to the owned item, including growth earned while a choice is pending.
 // Legacy paid candidates may contain a rerolled special; never apply that retired result.
 candidate.special=structuredClone(it.special??null);
 if(p.mode==='all'){if(p.newDivine===null)delete candidate.divine;else candidate.divine=structuredClone(p.newDivine);}
 else if(divineMultiplier(candidate)>1)candidate.divine.bonus.affixes=candidate.affixes.map(a=>({stat:a.stat,value:a.value/10}));
 return candidate;
}
// Returns the complete candidate, never the owned target or a mutable pending reference.
export function getPendingReforgeCandidate(s){
 if(!s?.pendingReforge||!validPendingReforge(s))return null;
 return reforgeCandidateItem(s.inventory.find(it=>it.id===s.pendingReforge.itemId),s.pendingReforge);
}
function canonicalReforgeDivine(it){const copy=structuredClone(it);delete copy.divine;applyForgeFavor(copy);return copy.divine;}
export function reforge(s,itemId,mode,index=0,donorId,expectedQuote){
 if(!s||!Array.isArray(s.inventory)||s.pendingReforge)return null;
 const it=s.inventory.find(i=>i.id===itemId),cost=getReforgeCost(it,mode,s);
 if(expectedQuote!==undefined&&!sameReforgeData(expectedQuote,getReforgeQuote(s,itemId,mode,index,donorId)))return null;
 if(!cost||!validEquipment(it)||!SLOTS.includes(it.slot)||it.affixes.length>Object.keys(AFFIX_DEFS).length||it.affixes.some(a=>!a||typeof a!=='object'))return null;
 if(divineMultiplier(it)>1&&(!it.divine.bonus||typeof it.divine.bonus!=='object'))return null;
 if(new Set(it.affixes.map(a=>a.stat)).size!==it.affixes.length||!it.affixes.every(a=>validAffixSource(a,AFFIX_DEFS)))return null;
 if(mode!=='all'&&(!Number.isInteger(index)||index<0||index>=it.affixes.length))return null;
 if(mode==='all'&&it.affixes.length>ordinaryAffixKeys(it.slot).length)return null;
 if(!Number.isFinite(s.gold)||s.gold<cost.gold||!validMaterials(s)||!validConsumables(s)||Object.entries(cost.materials).some(([key,n])=>materialCount(s,key,0)<n)||Object.entries(cost.consumables??{}).some(([key,n])=>(s.consumables?.[key]??0)<n))return null;
 const donor=mode==='replace'?eligibleReforgeDonors(s,itemId,index).find(x=>x.item.id===donorId):null;
 if(mode==='replace'&&!donor)return null;
 if(!validCodexCollection(s))return null;
 if(mode==='all'&&it.divine!==undefined&&!sameReforgeData(it.divine,canonicalReforgeDivine(it)))return null;
 const before=structuredClone(it.affixes),after=structuredClone(before);
 const roll=(stat,original)=>{const sourceRange=original?original.sourceRange:makeAffixSourceRange(AFFIX_DEFS[stat],it.legendaryId?4:it.rarity,{stat,sourceLevel:it.level}),range=original?affixOwnRange(original,AFFIX_DEFS):sourceRange;return {stat,value:forgeLuckyRoll(()=>rand(range.min,range.max),effectiveLuck(s),s.race),...(sourceRange?{sourceRange:structuredClone(sourceRange)}:{})};};
 if(mode==='value')after[index]=roll(after[index].stat,after[index]);
 else if(mode==='replace'){
  const chosen=donor.affixes[weightedDonorIndex(donor.affixes,AFFIX_DEFS,s.race,DWARF_FORGE_FAVOR_CONFIG,Math.random())];
  after[index]=structuredClone(chosen);
 }else{
  const pool=[...ordinaryAffixKeys(it.slot)];
  for(let i=0;i<after.length;i++)after[i]=roll(pool.splice(rand(0,pool.length-1),1)[0]);
 }
 const oldSpecial=structuredClone(it.special??null),newSpecial=structuredClone(oldSpecial);
 const divineSnapshot={};
 if(mode==='all'){
  const candidate=structuredClone(it);candidate.affixes=structuredClone(after);candidate.special=structuredClone(newSpecial);
  if(candidate.divine)candidate.divine=canonicalReforgeDivine(candidate);
  else if(Math.random()<dwarfDivineChance(divineProbability(REFORGE_DIVINE_CONFIG.chance,effectiveLuck(s)),s.race,DWARF_FORGE_FAVOR_CONFIG))applyForgeFavor(candidate);
  divineSnapshot.oldDivine=structuredClone(it.divine??null);divineSnapshot.newDivine=structuredClone(candidate.divine??null);
 }
 // Charge once, then persist the choice without modifying the target.
 normalizeMaterials(s);normalizeTalents(s);s.gold-=cost.gold;for(const [key,n] of Object.entries(cost.materials))s.materialStacks[materialKey(key)]-=n;for(const [key,n] of Object.entries(cost.consumables??{}))s.consumables[key]-=n;
 if(donor)normalizeCodexCollection(s);
 if(donor)s.inventory.splice(s.inventory.findIndex(x=>x.id===donor.item.id),1);
 const operationId='reforge-'+Date.now().toString(36)+'-'+(++serial).toString(36);
 s.pendingReforge={ruleVersion:10,targetLevel:it.level,operationId,itemId:it.id,mode,index:mode==='all'?null:index,oldAffixes:before,newAffixes:after,oldSpecial,newSpecial,cost,...divineSnapshot,...(donor?{donor:{id:donor.item.id,name:donor.item.name,slot:donor.item.slot,eligibleStats:donor.affixes.map(a=>a.stat),eligibleAffixes:structuredClone(donor.affixes),selectedAffix:structuredClone(after[index])}}:{})};
 return {item:it,operationId,mode,index:mode==='all'?null:index,cost,before:structuredClone(before),after:structuredClone(after),oldSpecial,newSpecial,pending:true};
}
export function validPendingReforge(s){
 const p=s.pendingReforge;if(p===undefined||p===null)return true;
 if(!p||typeof p!=='object'||Array.isArray(p)||typeof p.operationId!=='string'||p.operationId.length<1||p.operationId.length>160)return false;
 if(![6,7,8,9,10].includes(p.ruleVersion))return false;
 const it=s.inventory?.find(i=>i.id===p.itemId),currentCost=getReforgeCost(it,p.mode,s);
 // Paid legacy candidates retain their historical iron price; never charge again.
 const cost=p.ruleVersion<9&&p.mode==='value'&&currentCost?{...currentCost,materials:{'铁屑':1}}:currentCost;
 if(p.ruleVersion>=9&&p.targetLevel!==it?.level)return false;
 if(!it||!cost||!p.cost||p.cost.gold!==cost.gold||!p.cost.materials||Object.keys(p.cost.materials).length!==Object.keys(cost.materials).length||!Object.entries(cost.materials).every(([k,v])=>p.cost.materials[k]===v))return false;
 if((p.cost.equipment??0)!==(cost.equipment??0))return false;
 const expectedConsumables=cost.consumables??{},actualConsumables=p.cost.consumables??{};
 if(Object.keys(actualConsumables).length!==Object.keys(expectedConsumables).length||!Object.entries(expectedConsumables).every(([k,v])=>actualConsumables[k]===v))return false;
 {
  if(p.mode==='replace'){
   const d=p.donor;
   if(!d||typeof d.id!=='string'||!d.id||d.id===p.itemId||s.inventory.some(it=>it.id===d.id)||typeof d.name!=='string'||d.name.length>200||!SLOTS.includes(d.slot)||!Array.isArray(d.eligibleStats)||!d.eligibleStats.length||d.eligibleStats.length>4||new Set(d.eligibleStats).size!==d.eligibleStats.length||!d.eligibleStats.every(k=>Object.hasOwn(AFFIX_DEFS,k)&&!it.affixes.some((a,i)=>a.stat===k&&i!==p.index))||!d.eligibleStats.includes(p.newAffixes?.[p.index]?.stat))return false;
   {
    const legal=a=>a?.sourceRange!==undefined&&validAffixSource(a,AFFIX_DEFS);
    const same=(a,b)=>sameReforgeData(a,b);
    if(!Array.isArray(d.eligibleAffixes)||d.eligibleAffixes.length!==d.eligibleStats.length||!d.eligibleAffixes.every((a,i)=>legal(a)&&a.stat===d.eligibleStats[i])||!legal(d.selectedAffix)||!d.eligibleAffixes.some(a=>same(a,d.selectedAffix))||!same(d.selectedAffix,p.newAffixes?.[p.index]))return false;
   }
  }else if(p.donor!==undefined)return false;
  const legalSpecial=x=>x===null||(x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>['id','growthKills'].includes(k))&&Object.hasOwn(SPECIALS,x.id)&&validGrowthSpecial(x));
  if(!legalSpecial(p.oldSpecial)||!legalSpecial(p.newSpecial)||(p.oldSpecial?.id??null)!==(it.special?.id??null))return false;
  if(p.ruleVersion>=10){if(!sameReforgeData(p.oldSpecial,p.newSpecial))return false;}
  else if(p.mode==='all'&&!it.set&&it.rarity>=2&&!it.legendaryId){if(!p.newSpecial)return false;}
  else if((p.oldSpecial?.id??null)!==(p.newSpecial?.id??null))return false;
 }
 const legal=list=>Array.isArray(list)&&list.length===it.affixes.length&&new Set(list.map(a=>a?.stat)).size===list.length&&list.every(a=>a?.sourceRange!==undefined&&validAffixSource(a,AFFIX_DEFS));
 const equal=(a,b)=>sameReforgeData(a,b);
 if(!legal(p.oldAffixes)||!legal(p.newAffixes)||!p.oldAffixes.every((a,i)=>equal(a,it.affixes[i])))return false;
 if(p.mode==='all'){
  if(!Object.hasOwn(p,'oldDivine')||!Object.hasOwn(p,'newDivine')||!sameReforgeData(p.oldDivine,it.divine??null))return false;
  if(p.oldDivine!==null&&!sameReforgeData(p.oldDivine,canonicalReforgeDivine(it)))return false;
  const expected=structuredClone(it);expected.affixes=structuredClone(p.newAffixes);expected.special=structuredClone(p.newSpecial);
  if(p.newDivine!==null&&!sameReforgeData(p.newDivine,canonicalReforgeDivine(expected)))return false;
  if(p.oldDivine!==null&&p.newDivine===null)return false;
 }else if(p.oldDivine!==undefined||p.newDivine!==undefined)return false;
 if(p.mode==='all')return p.index===null&&p.newAffixes.every(a=>(p.ruleVersion>=8?ordinaryAffixKeys(it.slot):ACTIVE_AFFIX_KEYS).includes(a.stat)&&sameReforgeData(a.sourceRange,makeAffixSourceRange(AFFIX_DEFS[a.stat],it.legendaryId?4:it.rarity,p.ruleVersion>=7?{stat:a.stat,sourceLevel:it.level}:null)));
 if(!Number.isInteger(p.index)||p.index<0||p.index>=it.affixes.length||!p.newAffixes.every((a,i)=>i===p.index||equal(a,p.oldAffixes[i])))return false;
 return p.mode==='value'?p.newAffixes[p.index].stat===p.oldAffixes[p.index].stat&&sameReforgeData(p.newAffixes[p.index].sourceRange,p.oldAffixes[p.index].sourceRange):p.donor.eligibleStats.includes(p.newAffixes[p.index].stat);
}
export function resolveReforge(s,accept,expectedOperationId){
 const p=s?.pendingReforge;
 if(!p||typeof accept!=='boolean'||(expectedOperationId!==undefined&&expectedOperationId!==p.operationId)||!validPendingReforge(s))return null;
 const it=s.inventory.find(i=>i.id===p.itemId);
 if(accept&&Object.values(s.equip).includes(it.id)&&(noncombatRunning(s)||(s.activeEncounter&&!s.activeEncounter.done)))return null;
 if(accept){
  it.affixes=structuredClone(p.newAffixes);
  // Reforge never changes or restores a special: retain current earned growth verbatim.
  if(p.mode==='all'){if(p.newDivine===null)delete it.divine;else it.divine=structuredClone(p.newDivine);}
  else if(divineMultiplier(it)>1)it.divine.bonus.affixes=it.affixes.map(a=>({stat:a.stat,value:a.value/10}));
 }
 s.pendingReforge=null;capHealth(s);
 return {item:it,accepted:accept,operationId:p.operationId};
}
export function wardrobeIds(s){
 const ids=new Set();for(const loadout of Array.isArray(s.loadouts)?s.loadouts:[])if(loadout?.equip)for(const id of Object.values(loadout.equip))if(typeof id==='string')ids.add(id);return ids;
}
export function bagItems(s){const ids=wardrobeIds(s);return s.inventory.filter(it=>!ids.has(it.id));}
export function isProtected(s,id){return wardrobeIds(s).has(id)||s.pendingReforge?.itemId===id;}
function validSkillSlots(skills,conditions){
 if(!Array.isArray(skills)||![3,4].includes(skills.length)||!Array.isArray(conditions)||conditions.length!==skills.length)return false;
 const active=skills.filter(k=>k!==null);
 return new Set(active).size===active.length&&skills.every(k=>(skills.length===4&&k===null)||Object.hasOwn(SKILLS,k))&&conditions.every(validSkillCondition);
}
export function normalizeSkillSlots(s){
 const targets=[s,...(Array.isArray(s.loadouts)?s.loadouts.filter(Boolean):[])];
 if(!targets.every(t=>validSkillSlots(t.skills,t.conditions)))return false;
 for(const t of targets)if(t.skills.length===3){t.skills=[...t.skills,null];t.conditions=[...t.conditions,'always'];}
 return true;
}
function validLoadout(s,loadout){
 if(!loadout||typeof loadout.name!=='string'||loadout.name.length<1||loadout.name.length>20||!loadout.equip||Object.keys(loadout.equip).length!==raceSockets(s.race).length)return false;
 if(!raceSockets(s.race).every(k=>loadout.equip[k]===null||s.inventory.some(it=>it.id===loadout.equip[k]&&it.slot===SOCKET_TYPE[k])))return false;
 const ids=Object.values(loadout.equip).filter(Boolean);if(new Set(ids).size!==ids.length)return false;
 return validSkillSlots(loadout.skills,loadout.conditions)&&loadout.skills.every(k=>k===null||skillUnlocked(s,k));
}
function validLoadoutSlots(s){return s.loadouts===undefined||(Array.isArray(s.loadouts)&&s.loadouts.length===3&&s.loadouts.every(l=>l===null||validLoadout(s,l)));}
function projectedLoadouts(s,index,next){
 if(!Number.isInteger(index)||index<0||index>2||!validLoadoutSlots(s))return null;
 const slots=s.loadouts?[...s.loadouts]:[null,null,null];slots[index]=next;
 return slots;
}
export function saveLoadout(s,index,name=''){
 if(typeof name!=='string')return false;
 const snapshot={name:name.trim().slice(0,20)||`方案${index+1}`,equip:{...s.equip},skills:[...s.skills],conditions:[...s.conditions]};
 if(!validLoadout(s,snapshot))return false;
 if(snapshot.skills.length===3){snapshot.skills.push(null);snapshot.conditions.push('always');}
 const slots=projectedLoadouts(s,index,snapshot);if(!slots)return false;s.loadouts=slots;return true;
}
export function deleteLoadout(s,index){const slots=projectedLoadouts(s,index,null);if(!slots)return false;s.loadouts=slots;return true;}
export function applyLoadout(s,index,battleActive=false){
 if(noncombatRunning(s)||battleActive||!Number.isInteger(index)||index<0||index>2||!validLoadoutSlots(s))return false;
 const loadout=s.loadouts?.[index];if(!validLoadout(s,loadout))return false;
 const nextEquip={...loadout.equip};if(!applyEquipmentRuntimeChange(s,s.equip,nextEquip))return false;
 s.equip=nextEquip;s.skills=[...loadout.skills];s.conditions=[...loadout.conditions];if(s.skillTree){s.skillTree.selectedPreset=index;s.skillTree.revision++;}normalizeSkillSlots(s);capHealth(s);return true;
}
export function fresh(race='dwarf'){
 const pack=getRacePack(race);if(!pack)throw new RangeError('Unknown playable race');const sockets=raceSockets(race);
 // New characters begin unarmed. Owned equipment in existing saves is never migrated.
 const inventory=[];
 const s={version:SCHEMA_VERSION,learnedRecipes:['potion-healing'],talentBalanceVersion:TALENT_BALANCE_VERSION,diplomacy:freshDiplomacy(),race,hero:pack.heroName,atCamp:true,level:1,xp:0,gold:100,location:0,siteId:race+'.a01',expedition:{mode:'field',fieldId:race+'.a01.field',targetInstanceId:null,loop:false},build:'custom',inventory,equip:Object.fromEntries(sockets.map(socket=>[socket,null])),skills:[null,null,null,null],conditions:['always','always','always','always'],materialStacks:{'铁屑|0':5,'炉火晶|0':2,'誓约残片|0':1},offlineLuck:0,talents:Object.fromEntries(Object.keys(TALENTS).map(k=>[k,0])),consumables:{memoryFruit:0,refundCredits:0,reforgeToken:0},potionSlot:{key:null,auto:false,priority:'low',priorityVersion:1},kills:0,normalWins:[0,0,0],bossWins:[0,0,0],bossReady:[0,0,0],stock:3,loadouts:[null,null,null],chapters:[],chronicle:[race==='dwarf'?'灰冠历317年：你离开黑炉堡，踏上寻找失踪商队的路。':'灰冠历317年：你在'+pack.heroName+'的旅途中踏出了第一步。'],momentum:0,lastSeen:Date.now(),running:false};
 if(race!=='dwarf'){s.materialStacks={};s.chronicle=['你从'+pack.name+'的营地开始旅程。'];}
 normalizeSkillTree(s,getSkillTreeDefinition(s));s.skillTree.mode='active';
 return s;
}
export function equipItem(s,id,socket){
 const it=s.inventory.find(i=>i.id===id);if(!it)return false;
 if(!socket){if(it.slot==='ring'){socket=!s.equip.ring1?'ring1':!s.equip.ring2?'ring2':'ring1';}else socket=it.slot;}
 if(!raceSockets(s.race).includes(socket)||SOCKET_TYPE[socket]!==it.slot)return false;
 const nextEquip={...s.equip};for(const k of raceSockets(s.race))if(k!==socket&&nextEquip[k]===id){if(it.slot==='ring')nextEquip[k]=nextEquip[socket]??null;else return false;}
 nextEquip[socket]=id;if(!applyEquipmentRuntimeChange(s,s.equip,nextEquip))return false;s.equip=nextEquip;capHealth(s);return true;
}
export function baseStats(s){
 const ids=[...new Set(Object.values(s.equip).filter(Boolean))],gear=ids.map(id=>s.inventory.find(i=>i.id===id)).filter(Boolean),count={},specials={};
 const survivalGrowth=racialSurvivalGrowth(s.race);
 let atk=14+s.level*3+s.talents.power*3+potionBuffStrength(s,'strength'),armor=5+s.talents.steel*3,hp=120+s.talents.heart*20;
 const bonus=Object.fromEntries(Object.keys(AFFIX_DEFS).map(k=>[k,0]));
 for(const it of gear){const totals=itemTotals(it,{development:s.developmentEquipmentSandbox===true});atk+=totals.atk;armor+=totals.armor;hp+=totals.hp;if(it.set)count[it.set]=(count[it.set]||0)+1;if(it.special&&SPECIALS[it.special.id]?.enabled!==false)specials[it.special.id]=true;for(const a of it.affixes)bonus[a.stat]+=a.value*divineMultiplier(it);const growth=growthBonuses(it),dice=luckyDiceStatBonuses(it);for(const key of ['atk','luck','lifesteal'])bonus[key]+=growth[key];bonus.luck+=dice.luck;bonus.crit+=dice.crit;}
 bonus.hit+=(s.talents.precision??0)*5;bonus.crit+=(s.talents.crit??0)*5;bonus.critDamage+=(s.talents.critDamage??0)*8;bonus.element+=(s.talents.element??0)*2;
 // Preserve the existing gear/affix rounding, then retain fractional racial growth.
 // Only this per-level contribution differs: no final actor or equipment multiplier.
 atk=Math.round(atk+bonus.atk);armor=Math.round(armor+bonus.armor)+s.level*survivalGrowth.armor;hp=Math.round(hp+bonus.hp)+s.level*survivalGrowth.hp;
 const {dodgeRating,attackMultiplier}=racialLegendaryStatBonuses(s);atk*=attackMultiplier;
 const ratingFactor=r=>Math.max(0,r)/(100+Math.max(0,r));
 const elementAttack=Object.fromEntries(ELEMENT_KEYS.map(k=>[k,bonus.element+(bonus[k+'Atk']??0)+potionBuffStrength(s,k+'Atk')+(getRacePack(s.race)?.innate?.elementAttack?.[k]??0)]));
 const elementResistance=Object.fromEntries(ELEMENT_KEYS.map(k=>[k,(s.talents.elementResist??0)*5+(bonus[k+'Resist']??0)+potionBuffStrength(s,k+'Resist')+(getRacePack(s.race)?.innate?.elementResistance?.[k]??0)]));
 return {atk,armor,hp,dodgeRating,dodge:(getRaceTuning(s.race)?.attributeConfig?.dodgeCap??0)*ratingFactor(dodgeRating),penetration:(s.talents.penetration??0)*2,elementAttack,elementResistance,elementResist:.5*ratingFactor(elementResistance.fire),block:.35*ratingFactor((s.talents.block??0)*4),shieldBonus:(s.talents.shield??0)*4,healingBonus:100*(activeHealingMultiplier(s.talents.healing)-1),resolveReduction:(s.talents.resolve??0)*.02,luck:Math.min(1000,Math.max(0,(s.talents.luck??0)+bonus.luck+potionBuffStrength(s,'luck'))),lifesteal:bonus.lifesteal,lifestealRating:bonus.lifesteal,lifestealRate:lifestealRate(bonus.lifesteal),hit:clamp(.9+.1*ratingFactor(bonus.hit),.5,.995),crit:clamp(.05+.55*ratingFactor(bonus.crit),0,.6),critDamage:clamp(1.5+ratingFactor(bonus.critDamage),1.5,2.5),element:bonus.element,hitRating:bonus.hit,critRating:bonus.crit,critDamageRating:bonus.critDamage,count,specials,legend:false,bonus};
}
function treePolicy(s){return s.skillTree?.mode==='active'?getRaceTuning(s.race):null;}
export function treePassiveContext(s,policy=treePolicy(s)){
 const p=s.skillTree?.presets?.[s.skillTree.selectedPreset];if(!policy?.passiveConfig||!p)return null;
 const weapon=s.inventory.find(it=>it.id===s.equip.weapon);
 return resolveTreePassives({passive:p.passive,unlocked:p.unlocked,weaponType:weapon?.weaponType??'generic',config:policy.passiveConfig});
}
export function stats(s){
 const base=baseStats(s),context=treePassiveContext(s);if(!context)return base;
 const e=s.activeEncounter,layers=e&&!e.done?e.playerShieldLayers:null;
 return derivePassiveStats(base,context,{shieldLayers:layers,combatClock:layers?.clock??0,currentHp:s.heroHp??base.hp})?.stats??base;
}
export function reconcileSkillTreeHealth(s){if(!validSkillTree(s,getSkillTreeDefinition(s)))return false;capHealth(s);return true;}
export function effectiveLuck(s){return stats(s).luck;}
export function preset(s,id){const b=BUILD.find(x=>x.id===id);if(!b||b.skills.length!==4||!b.skills.every(k=>k===null||skillUnlocked(s,k)))return null;s.build=id;s.skills=[...b.skills];s.conditions=['always','always','charge','always'];return b;}
export const POTIONS=POTION_CATALOG;
export const RECIPES=POTION_RECIPE_CATALOG;
function validRecipes(s){return s.learnedRecipes===undefined||(Array.isArray(s.learnedRecipes)&&s.learnedRecipes.length<=Object.keys(RECIPES).length&&new Set(s.learnedRecipes).size===s.learnedRecipes.length&&s.learnedRecipes.every(id=>Object.hasOwn(RECIPES,id)));}
export function recipeKnown(s,id){return Object.hasOwn(RECIPES,id)&&Array.isArray(s.learnedRecipes)&&s.learnedRecipes.includes(id);}
export function normalizeRecipes(s){
 if(!validRecipes(s))return false;s.learnedRecipes??=[];
 if(!s.learnedRecipes.includes('potion-healing'))s.learnedRecipes.push('potion-healing');
 for(const offer of s.merchant?.offers??[])if(offer.type==='recipe'&&recipeKnown(s,offer.recipeId))offer.stock=0;
 return true;
}
export function learnRecipe(s,id){
 if(!Object.hasOwn(RECIPES,id)||!RECIPES[id].enabled||!validRecipes(s)||id==='potion-healing'||recipeKnown(s,id))return false;
 normalizeRecipes(s);s.learnedRecipes.push(id);for(const offer of s.merchant?.offers??[])if(offer.type==='recipe'&&offer.recipeId===id)offer.stock=0;return true;
}
export function eligibleRecoveryMaterials(s,quality){return materialEntries(s).filter(row=>row.quality===quality&&MATERIALS[row.material]?.functionalTags?.includes('recoveryBase'));}
export function quoteRecoveryRecipe(s,quality,inputs){
 if(s.pendingForgeClaim||!RECIPES['potion-healing'].enabled||!recipeKnown(s,'potion-healing')||!validRecipes(s)||!validMaterials(s)||!validPotions(s))return null;
 const raw=recoveryInputPlan(quality,inputs,MATERIALS),quote=raw?{...raw,gold:racialGoldCost(s,raw.gold)}:null;if(!quote||!Number.isFinite(s.gold)||s.gold<quote.gold)return null;
 for(const row of quote.inputs){const p=parseMaterialKey(row.key);if(!p||materialCount(s,p.material,p.quality)<row.quantity)return null;}
 return quote;
}
export function craftRecoveryRecipe(s,quote){
 if(!quote||typeof quote!=='object'||Array.isArray(quote)||Object.keys(quote).length!==5)return null;
 const actual=quoteRecoveryRecipe(s,quote.quality,quote.inputs);
 if(!actual||quote.recipeId!==actual.recipeId||quote.quantity!==actual.quantity||quote.gold!==actual.gold)return null;
 normalizeMaterials(s);normalizePotions(s);for(const row of actual.inputs)s.materialStacks[row.key]-=row.quantity;s.gold-=actual.gold;
 const key=potionKey('healing',actual.quality),result={kind:'potion',potionType:'healing',quality:actual.quality,name:POTIONS.healing.name,quantity:actual.quantity,key,recipeId:actual.recipeId};
 if(canReceiveItem(s,key,result.quantity))s.potionStacks[key]=(s.potionStacks[key]??0)+result.quantity;else s.pendingForgeClaim={kind:'potion',potion:result};
 return result;
}
export function eligiblePotionRecipeMaterials(s,id,role,quality){return materialEntries(s).filter(row=>row.quality===quality&&potionRecipeAllows(id,role,row.material));}
export function quotePotionRecipe(s,id,quality,{mainKey,auxKey,quantity=1}={}){
 const recipe=RECIPES[id];if(!recipe||id==='potion-healing'||!recipe.enabled||!recipeKnown(s,id)||s.pendingForgeClaim||!validRecipes(s)||!validMaterials(s)||!validPotions(s)||!Number.isInteger(quality)||quality<0||quality>3||!Number.isSafeInteger(quantity)||quantity<1||quantity>999)return null;
 const main=parseMaterialKey(mainKey),aux=parseMaterialKey(auxKey);if(!main||!aux||main.quality!==quality||aux.quality!==quality||!potionRecipeAllows(id,'main',main.material)||!potionRecipeAllows(id,'aux',aux.material))return null;
 const counts={};for(const row of [main,aux])counts[row.key]=(counts[row.key]??0)+quantity;
 const inputs=Object.entries(counts).sort(([a],[b])=>a.localeCompare(b)).map(([key,quantity])=>({key,quantity})),gold=racialGoldCost(s,recipe.craftGoldByQuality?.[quality]*quantity);
 if(!Number.isSafeInteger(gold)||gold<0||!Number.isFinite(s.gold)||s.gold<gold||inputs.some(row=>{const p=parseMaterialKey(row.key);return materialCount(s,p.material,p.quality)<row.quantity;}))return null;
 return {recipeId:id,quality,quantity,gold,mainKey:main.key,auxKey:aux.key,inputs};
}
export function craftPotionRecipe(s,quote){
 if(!quote||typeof quote!=='object'||Array.isArray(quote)||Object.keys(quote).length!==7)return null;
 const actual=quotePotionRecipe(s,quote.recipeId,quote.quality,quote);if(!actual||JSON.stringify(actual)!==JSON.stringify(quote))return null;
 normalizeMaterials(s);normalizePotions(s);for(const row of actual.inputs)s.materialStacks[row.key]-=row.quantity;s.gold-=actual.gold;
 const type=RECIPES[actual.recipeId].potionType,key=potionKey(type,actual.quality),result={kind:'potion',potionType:type,quality:actual.quality,name:POTIONS[type].name,quantity:actual.quantity,key,recipeId:actual.recipeId};
 if(canReceiveItem(s,key,result.quantity))s.potionStacks[key]=(s.potionStacks[key]??0)+result.quantity;else s.pendingForgeClaim={kind:'potion',potion:result};return result;
}
export function craftRecipe(s,id,selection,targetQuality=0){
 if(id==='potion-healing')return craftRecoveryRecipe(s,quoteRecoveryRecipe(s,targetQuality,selection));
 if(!Array.isArray(selection)||selection.length!==2)return null;
 return craftPotionRecipe(s,quotePotionRecipe(s,id,targetQuality,{mainKey:selection[0],auxKey:selection[1]}));
}
export const POTION_DURATION_MS=300000,POTION_COOLDOWN_MS=10000;
// Same-quality doses extend time; stronger doses replace both potency and time.
export const POTION_QUALITY_EFFECTS=[0,1,2,3].map(quality=>({heal:[.10,.15,.20,.25][quality],durationMs:300000,attack:10+5*quality,resistance:30+10*quality}));
function potionBuff(s,type){const b=s.potionBuffs?.[type];return b??{quality:0,endAt:0};}
function potionBuffStrength(s,type){const b=potionBuff(s,type);if(b.endAt<=(s.lastHealthClock??0))return 0;const effect=potionCatalogEffect(type,b.quality);return effect?(effect.attack||effect.elementAttack||effect.elementResistance||effect.luck||0):0;}
export function potionEffect(type,quality=0){return potionCatalogEffect(type,quality);}
export function potionKey(type,quality=0){return Object.hasOwn(POTIONS,type)&&Number.isInteger(quality)&&quality>=0&&quality<=3?`${type}|${quality}`:null;}
export function parsePotionKey(value){
 if(typeof value!=='string')return null;if(Object.hasOwn(POTIONS,value))return {type:value,quality:0,key:potionKey(value)};
 const parts=value.split('|');if(parts.length!==2||!['0','1','2','3'].includes(parts[1]))return null;const key=potionKey(parts[0],Number(parts[1]));return key?{type:parts[0],quality:Number(parts[1]),key}:null;
}
function validPotions(s){
 const count=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e9,time=n=>Number.isFinite(n)&&n>=0&&n<=1e15;
 const stacks=s.potions===undefined&&(s.potionStacks===undefined||(s.potionStacks&&typeof s.potionStacks==='object'&&!Array.isArray(s.potionStacks)&&Object.entries(s.potionStacks).every(([k,n])=>parsePotionKey(k)?.key===k&&count(n))));
 const selected=s.potionSlot?.key??null;
 return stacks&&(s.potionSlot===undefined||(s.potionSlot&&!Array.isArray(s.potionSlot)&&!Object.hasOwn(s.potionSlot,'type')&&(selected===null||parsePotionKey(selected)?.key===selected)&&typeof s.potionSlot.auto==='boolean'&&s.potionSlot.priorityVersion===1&&['low','high'].includes(s.potionSlot.priority)))&&(s.potionReadyAt===undefined||time(s.potionReadyAt))&&(s.potionFunctionCooldowns===undefined||(s.potionFunctionCooldowns&&typeof s.potionFunctionCooldowns==='object'&&!Array.isArray(s.potionFunctionCooldowns)&&Object.keys(s.potionFunctionCooldowns).length===POTION_BUFF_KEYS.length&&POTION_BUFF_KEYS.every(type=>time(s.potionFunctionCooldowns[type]))))&&(s.potionBuffs===undefined||(s.potionBuffs&&typeof s.potionBuffs==='object'&&!Array.isArray(s.potionBuffs)&&Object.keys(s.potionBuffs).every(type=>POTION_BUFF_KEYS.includes(type))&&POTION_BUFF_KEYS.every(type=>{const b=s.potionBuffs[type];return b===undefined||(b&&typeof b==='object'&&!Array.isArray(b)&&Number.isInteger(b.quality)&&b.quality>=0&&b.quality<=3&&time(b.endAt));})));
}
export function normalizePotions(s){
 if(!validPotions(s))return false;s.potionStacks??={};s.potionSlot??={key:null,auto:false,priority:'low',priorityVersion:1};s.potionReadyAt??=0;s.potionFunctionCooldowns??=Object.fromEntries(POTION_BUFF_KEYS.map(type=>[type,s.potionReadyAt]));s.potionBuffs??={};for(const type of POTION_BUFF_KEYS)s.potionBuffs[type]??={quality:0,endAt:0};return true;
}
// Healing keeps its original save field; old shared timers seed every function once.
// An unfinished encounter remains combat even while paused or not running.
export function potionCooldownUntil(s,key,battle=s.activeEncounter??null){
 const type=parsePotionKey(key)?.type;if(!type)return 0;
 if(type==='healing')return s.potionReadyAt??0;
 const cooldowns=s.potionFunctionCooldowns;if(!cooldowns)return s.potionReadyAt??0;
 const inCombat=(battle&&!battle.done)||(s.activeEncounter&&!s.activeEncounter.done);
 return inCombat?Math.max(0,...POTION_BUFF_KEYS.map(id=>cooldowns[id]??0)):(cooldowns[type]??0);
}
export function potionCount(s,type,quality=0){return s.potionStacks?.[potionKey(type,quality)]??0;}

export function potionEntries(s){return Object.keys(POTIONS).flatMap(type=>[0,1,2,3].map(quality=>({key:potionKey(type,quality),type,quality,count:potionCount(s,type,quality)}))).filter(x=>x.count>0);}
export function equipPotion(s,key){const parsed=key===null?null:parsePotionKey(key);if((key!==null&&!parsed)||!normalizePotions(s))return false;s.potionSlot.key=parsed?.key??null;return true;}
export function setPotionAuto(s,enabled){if(typeof enabled!=='boolean'||!normalizePotions(s))return false;s.potionSlot.auto=enabled;return true;}
export function resolvePotionKey(s,now=Date.now(),priority=s.potionSlot?.priority??'low'){
 if(!['low','high'].includes(priority))return null;const selected=parsePotionKey(s.potionSlot?.key);if(!selected)return null;
 const clock=Math.max(now,s.lastHealthClock??0),buff=potionBuff(s,selected.type);
 const qualities=priority==='high'?[3,2,1,0]:[0,1,2,3];
 const quality=qualities.find(q=>potionCount(s,selected.type,q)>0&&(selected.type==='healing'||buff.endAt<=clock||q>=buff.quality));
 return quality===undefined?null:potionKey(selected.type,quality);
}
export function setPotionPriority(s,priority){if(!['low','high'].includes(priority)||!normalizePotions(s))return false;s.potionSlot.priority=priority;return true;}
export function drinkPotion(s,key=undefined,now=Date.now(),battle=s.activeEncounter??null){
 if(key===undefined)key=resolvePotionKey(s,now);

 const parsed=parsePotionKey(key);if(!parsed||!POTION_QUALITY_EFFECTS[parsed.quality]||!validPotions(s)||!normalizeHealth(s,now))return false;settleRest(s,now);
 const {type,quality}=parsed,effect=POTION_QUALITY_EFFECTS[quality],clock=s.lastHealthClock;if(s.restUntil>0||s.heroHp<=0||potionCooldownUntil(s,parsed.key,battle)>clock||potionCount(s,type,quality)<1)return false;
 const max=stats(s).hp;if(type==='healing'&&s.heroHp>=max)return false;
 const current=potionBuff(s,type),active=current.endAt>clock;if(type!=='healing'&&active&&quality<current.quality)return false;
 const end=type==='healing'?0:(active&&quality===current.quality?current.endAt:clock)+effect.durationMs;if(end>1e15||clock+POTION_COOLDOWN_MS>1e15)return false;
 normalizePotions(s);s.potionStacks[parsed.key]--;if(type==='healing')s.potionReadyAt=clock+POTION_COOLDOWN_MS;else s.potionFunctionCooldowns[type]=clock+POTION_COOLDOWN_MS;
 if(type==='healing'){const beforeHp=s.heroHp,context=treePassiveContext(s),amount=context?passiveReceivedHeal(context,{amount:max*effect.heal,currentHp:s.heroHp,maxHp:max}):Math.min(max-s.heroHp,max*effect.heal);s.heroHp=Math.min(max,s.heroHp+amount);if(battle&&!battle.done){battle.heroHp=s.heroHp;if(s.heroHp>beforeHp)emitCombatDisplay(battle,{kind:'heal',sourceId:'potion:'+parsed.key,skillId:null,element:null,hpDelta:s.heroHp-beforeHp});}}
 else s.potionBuffs[type]={quality,endAt:end};
 return true;
}
export function resolveHealingPotionKey(s,now=Date.now()){
 return resolvePotionKey({...s,potionSlot:{...s.potionSlot,key:'healing|0'}},now);
}
export function autoDrinkPotion(s,battle=s.activeEncounter??null,now=Date.now()){
 if(!s.potionSlot?.auto||s.heroHp>stats(s).hp*.4)return false;
 return drinkPotion(s,resolveHealingPotionKey(s,now),now,battle);
}
function capHealth(s){if(s.heroHp!==undefined){s.heroHp=Math.min(s.heroHp,stats(s).hp);if(s.activeEncounter&&!s.activeEncounter.done)s.activeEncounter.heroHp=Math.min(s.activeEncounter.heroHp,s.heroHp);}}
export const REST_DURATION_MS=5*60*1000;
export function validAreaProgress(s){
 if(s.areaProgress===undefined)return true;
 const progress=s.areaProgress;
 if(!progress||typeof progress!=='object'||Array.isArray(progress)||Object.keys(progress).length!==RACE_KEYS.length)return false;
 return RACE_KEYS.every(race=>{
  const p=progress[race];if(!p||!Array.isArray(p.unlocked)||!Array.isArray(p.cleared)||p.unlocked.length>10||p.cleared.length>10)return false;
  if(!p.unlocked.every((n,i)=>Number.isInteger(n)&&n===i+1)||!p.cleared.every((n,i)=>Number.isInteger(n)&&n===i+1))return false;
  if(p.cleared.some(n=>!p.unlocked.includes(n)))return false;
  if(race===s.race&&!p.unlocked.length)return false;
  // No unreleased race has an entry point yet. Opening one requires actual content.
  if(p.unlocked.length&&!Object.values(AREAS).some(a=>a.race===race))return false;
  return !p.unlocked.length?p.cleared.length===0:p.unlocked.length===Math.min(p.cleared.length+1,10);
 });
}
export function normalizeAreaProgress(s){
 if(!validAreaProgress(s))return false;
 s.areaProgress??=Object.fromEntries(RACE_KEYS.map(race=>[race,{unlocked:PLAYABLE_RACES.includes(race)?[1]:[],cleared:[]}]));
 for(const race of PLAYABLE_RACES)if(s.areaProgress[race]?.unlocked.length===0&&s.areaProgress[race].cleared.length===0)s.areaProgress[race].unlocked=[1];
 return true;
}
export function getAreaProgress(s,race=AREAS[s.siteId]?.race??s.race??'dwarf'){
 if(!RACE_KEYS.includes(race)||!validAreaProgress(s))return null;
 const stored=s.areaProgress?.[race],p=stored?.unlocked.length?stored:{unlocked:PLAYABLE_RACES.includes(race)?[1]:[],cleared:[]};
 return {unlocked:[...p.unlocked],cleared:[...p.cleared]};
}
export function getMerchantEquipmentLevelRange(s){
 if(!validAreaProgress(s))return null;
 const highest=Math.max(1,...RACE_KEYS.flatMap(r=>getAreaProgress(s,r).unlocked));
 return areaLevelRange(highest);
}
function recordDungeonAreaClear(s,e){
 const instance=INSTANCES[e.instanceId],area=AREAS[instance?.areaId],run=s.dungeonRun;
 if(!instance?.enabled||instance.kind!=='dungeon'||!area||e.areaId!==area.id||e.kind!=='dungeon'||e.dungeonStage!==3||!e.done||!e.win||s.activeEncounter!==e||run?.instanceId!==e.instanceId||run?.runId!==e.runId||run?.stage!==3||!normalizeAreaProgress(s))return false;
 const p=s.areaProgress[area.race],number=area.number;
 if(!p.unlocked.includes(number)||p.cleared.includes(number))return false;
 p.cleared.push(number);p.cleared.sort((a,b)=>a-b);
 if(number<10&&!p.unlocked.includes(number+1))p.unlocked.push(number+1);
 return true;
}
// Explicit content/event callers persist these mutations with clone-save-adopt.
// No live caller or scheduler starts a war until the story/event hook is approved.
export function startWar(s,event,now=Date.now()){return changeWar(s,next=>applyWarStart(next,event,now),now);}
export function startRandomWar(s,event,now=Date.now()){if(!event||typeof event!=='object'||Array.isArray(event)||Object.keys(event).length!==3||!['id','races','durationMs'].every(k=>Object.hasOwn(event,k)))return null;const {id,races,durationMs}=event;return startWar(s,{id,races,kind:'random',durationMs},now);}
export function advanceWorldEvents(s,now=Date.now()){
 if(!validSave(s))return null;const result=advanceRandomWorldEvents(s,now);if(!result)return null;
 stopBlockedWarActivity(s,now);pruneRandomWarHistory(s,now);return result;
}
export function endWar(s,id,now=Date.now()){return changeWar(s,next=>applyWarEnd(next,id,now),now);}
function changeWar(s,mutate,now){
 if(!validSave(s))return null;const next=structuredClone(s),result=mutate(next);
 if(!result||!validSave(next))return null;
 s.diplomacy=next.diplomacy;stopBlockedWarActivity(s,now);return result;
}
export function retreatWarTerritory(s,returnSiteId){
 if(s.otherworld?.active)return null;
 if(!validSave(s))return null;const next=structuredClone(s),result=retreatFromWar(next,returnSiteId);
 if(!result?.changed||!validSave(next))return null;Object.assign(s,next);return result;
}
function stopBlockedWarActivity(s,now=Date.now()){
 if(s.otherworld?.active)return false;
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return false;
 if(territoryAccess(s,AREAS[s.siteId]?.race,now).allowed&&nodeAccess(s,s.expedition?.fieldId,now).allowed)return false;
 s.running=false;s.restResume=false;s.dungeonRun=null;s.stopAfterBattle=false;s.stopAfterDungeon=false;return true;
}
export function plannedNodes(s,now=Date.now()){
 return Object.values(PLANNED_INSTANCES).map(n=>({...n,warLocked:!nodeAccess(s,n.id,now).allowed,accessReason:nodeAccess(s,n.id,now).reason,name:n.name,areaNumber:AREAS[n.areaId].number,levelRange:[...AREAS[n.areaId].levelRange],unlocked:getAreaProgress(s,AREAS[n.areaId].race)?.unlocked.includes(AREAS[n.areaId].number),budgetReady:areaBudgetReady(AREAS[n.areaId].number,AREAS[n.areaId].race),readyAt:s.instanceCooldowns?.[n.id]??0,fieldId:n.areaId+'.field'}));
}
export function validExpeditionState(s){
 const ex=s.expedition,cd=s.instanceCooldowns;
 if(s.autoBossRetryAt!==undefined&&(!s.autoBossRetryAt||typeof s.autoBossRetryAt!=='object'||Array.isArray(s.autoBossRetryAt)||!Object.entries(s.autoBossRetryAt).every(([id,t])=>PLANNED_INSTANCES[id]?.kind==='boss'&&Number.isFinite(t)&&t>=0&&t<=1e15+1800000)))return false;
 if(s.stopAfterDungeon!==undefined&&typeof s.stopAfterDungeon!=='boolean')return false;
 if(s.dungeonRun?.carry!==undefined&&(!validDungeonCarry(s.dungeonRun.carry,SKILLS)||s.dungeonRun.stage===1||s.activeEncounter))return false;
 if(cd!==undefined&&(!cd||typeof cd!=='object'||Array.isArray(cd)||!Object.entries(cd).every(([id,t])=>Object.hasOwn(PLANNED_INSTANCES,id)&&INSTANCES[id].kind!=='field'&&Number.isFinite(t)&&t>=0&&t<=1e15+1800000)))return false;
 if(s.dungeonRun!==undefined&&s.dungeonRun!==null&&(!s.dungeonRun||PLANNED_INSTANCES[s.dungeonRun.instanceId]?.kind!=='dungeon'||typeof s.dungeonRun.runId!=='string'||s.dungeonRun.runId.length>160||!Number.isInteger(s.dungeonRun.stage)||s.dungeonRun.stage<1||s.dungeonRun.stage>3||s.dungeonRun.affixUsage!==undefined&&!validDungeonAffixUsage(s.dungeonRun.affixUsage)))return false;
 if(ex!==undefined&&(!ex||typeof ex!=='object'||!['field','dungeon'].includes(ex.mode)||typeof ex.loop!=='boolean'||['autoDungeon','autoBoss'].some(k=>ex[k]!==undefined&&typeof ex[k]!=='boolean')||PLANNED_INSTANCES[ex.fieldId]?.kind!=='field'||(ex.targetInstanceId!==null&&PLANNED_INSTANCES[ex.targetInstanceId]?.kind!=='dungeon')))return false;
 return Object.values(PLANNED_INSTANCES).some(n=>n.siteId===s.siteId);
}
function normalizeDungeonAffixUsage(s){
 const run=s.dungeonRun;if(!run||run.affixUsage!==undefined)return;
 const e=s.activeEncounter?.kind==='dungeon'?s.activeEncounter:null,priorStage=run.stage>1;
 // A retained pre-ledger run cannot prove an earlier stage's unused proc.
 // Conservatively spent after stage one, without discarding the save or gear.
 run.affixUsage={shelterUsed:priorStage||!!(e?.shelterUsed??run.carry?.shelterUsed),nirvanaUsed:priorStage||!!e?.affixState?.nirvanaUsed};
 if(e){ensureEncounterAffixes(e);e.shelterUsed=run.affixUsage.shelterUsed;e.affixState.nirvanaUsed=run.affixUsage.nirvanaUsed;}
 if(run.carry)run.carry.shelterUsed=run.affixUsage.shelterUsed;
}
export function normalizeExpedition(s){
 if(s.version!==SCHEMA_VERSION||!validExpeditionState(s)||!normalizeDiplomacy(s)||!normalizeAreaProgress(s))return false;
 const site=resolveLegacySite(s.siteId??s.location);if(!site)return false;
 s.siteId??=site.id;
 s.expedition??={mode:'field',targetInstanceId:null,fieldId:site.id+(!!PLANNED_INSTANCES[site.id+'.field']?'.field':'-field'),loop:false};
 s.instanceCooldowns??={};normalizeDungeonAffixUsage(s);

 return true;
}
export function nextEncounterRoute(s,now=Date.now()){
 if(s.otherworld?.active)return validOtherworldState(s,validEquipment)&&otherworldUnlocked(s)&&s.otherworld.pendingEquipment.length<=OTHERWORLD_PENDING_LIMIT-2?{id:"otherworld",kind:"otherworld",floor:s.otherworld.floor}:null;
 // Automation follows the actual location, not a browsed map or a newly configured remote route.
 const ex=s.expedition,local=INSTANCES[ex?.fieldId]?.siteId===s.siteId;
 const policy={...ex,autoBoss:!!ex?.autoBoss&&local&&!s.story?.activeScene&&!s.stopAfterBattle&&!s.stopAfterDungeon};
 const cooldowns={...s.instanceCooldowns};
 // Extra attempts bypass only success cooldown; defeat auto-retry protection remains.
 if(policy.autoBoss)for(const id of Object.keys(cooldowns))if(canUseExtraBossChallenge(s,id))cooldowns[id]=0;
 for(const [id,at] of Object.entries(s.autoBossRetryAt??{}))cooldowns[id]=Math.max(cooldowns[id]??0,at);
 const route=validExpeditionState(s)?pickRoute(policy,cooldowns,now):null;
 return route&&nodeAccess(s,route.id,now).allowed&&nodeAccess(s,s.expedition.fieldId,now).allowed?route:null;
}
export function configureExpedition(s,config,now=Date.now()){
 if(s.otherworld?.active)return false;
 if(s.version!==SCHEMA_VERSION||s.running||(s.activeEncounter&&!s.activeEncounter.rewarded)||s.dungeonRun||!config)return false;
 if(INSTANCES[config.fieldId]?.contentVersion&&!getAreaProgress(s,AREAS[INSTANCES[config.fieldId].areaId].race)?.unlocked.includes(AREAS[INSTANCES[config.fieldId].areaId].number))return false;
 const candidate={mode:config.mode,targetInstanceId:config.targetInstanceId??null,fieldId:config.fieldId,loop:config.loop,...Object.fromEntries(['autoDungeon','autoBoss'].filter(k=>config[k]!==undefined).map(k=>[k,config[k]]))};
 if(!validExpeditionState({...s,expedition:candidate})||!nodeAccess(s,candidate.fieldId,now).allowed||(candidate.mode==='dungeon'&&(!INSTANCES[candidate.targetInstanceId]?.enabled||!nodeAccess(s,candidate.targetInstanceId,now).allowed)))return false;
 if(!normalizeExpedition(s))return false;s.expedition=candidate;return true;
}
// Caller persists the returned mutation using clone-save-adopt. Rejected navigation never changes state.
export function chooseAdventureNode(s,nodeId,{start=true,loop=false,fieldId=null}={},now=Date.now()){
 if(!Number.isFinite(now)||now<0||now>1e15||typeof start!=='boolean'||typeof loop!=='boolean'||typeof nodeId!=='string'||!Object.hasOwn(PLANNED_INSTANCES,nodeId)||!validSave(s))return null;
 const next=structuredClone(s);
 if(!normalizeExpedition(next)||next.running||(next.activeEncounter&&!next.activeEncounter.rewarded)||next.dungeonRun)return null;
 const time=Math.max(now,next.lastHealthClock??0),node=plannedNodes(next,time).find(x=>x.id===nodeId);
 if(!node?.enabled||node.warLocked||!node.unlocked||!node.budgetReady||(next.restUntil??0)>time||(node.readyAt>time&&!canUseExtraBossChallenge(next,node.id)))return null;
 const fallback=fieldId??node.fieldId,field=plannedNodes(next,time).find(x=>x.id===fallback);
 if(!field?.enabled||field.warLocked||field.kind!=='field'||!field.unlocked||!field.budgetReady)return null;
 const config={mode:node.kind==='dungeon'?'dungeon':'field',targetInstanceId:node.kind==='dungeon'?node.id:null,fieldId:node.kind==='field'?node.id:fallback,loop:node.kind==='dungeon'?loop:false,...Object.fromEntries(['autoDungeon','autoBoss'].filter(k=>next.expedition[k]!==undefined).map(k=>[k,next.expedition[k]]))};
 if(!configureExpedition(next,config,now))return null;
 let encounter=null;if(start){encounter=startInstanceEncounter(next,node.id,now);if(!encounter)return null;}
 if(!validSave(next))return null;
 for(const key of Object.keys(s))if(!Object.hasOwn(next,key))delete s[key];Object.assign(s,next);return {ok:true,nodeId,started:!!encounter,encounter:s.activeEncounter??null};
}
// Noncombat arrival uses the same ordinary territory/progression gates as an expedition.
// Arrival records a visited field only: no monster/material discovery, rewards, healing or unlock.
export function travelToArea(s,areaId,now=Date.now()){
 if(typeof areaId!=='string'||!Object.hasOwn(AREAS,areaId)||s.contentMigration?.legacyDrain)return null;
 const next=structuredClone(s),fieldId=areaId+'.field';
 if(!chooseAdventureNode(next,fieldId,{start:false},now))return null;
 next.siteId=areaId;next.location=AREAS[areaId].number-1;
 next.activeEncounter=null;next.atCamp=false;next.running=false;next.restResume=false;
 next.stopAfterBattle=false;next.stopAfterDungeon=false;
 if(!normalizeRegionNavigation(next))return null;
 if(!next.regionNavigation.exploredNodeIds.includes(fieldId))next.regionNavigation.exploredNodeIds.push(fieldId);
 if(!validSave(next))return null;
 for(const key of Object.keys(s))if(!Object.hasOwn(next,key))delete s[key];Object.assign(s,next);
 return {ok:true,siteId:areaId,fieldId};
}
export function setExpeditionAutomation(s,kind,enabled){
 // Selection changes future routing only; war/unlock/rest gates belong to actual entry.
 if(!['dungeon','boss'].includes(kind)||typeof enabled!=='boolean'||!normalizeExpedition(s))return false;
 s.expedition[kind==='boss'?'autoBoss':'autoDungeon']=enabled;
 // The new checkbox owns ordinary-repeat behavior once explicitly changed.
 if(kind==='dungeon')s.expedition.loop=enabled;
 return true;
}
export function setExpeditionLoop(s,enabled){
 if(typeof enabled!=='boolean'||(enabled&&!nodeAccess(s,s.expedition?.fieldId).allowed)||!normalizeExpedition(s))return false;
 s.expedition.loop=enabled;
 if(!enabled&&s.restUntil>0&&s.expedition.mode==='dungeon'){s.restResume=false;s.running=false;}
 return true;
}
// Tower operations are persisted by the caller's existing clone-save-adopt boundary.
const otherworldBoundary=s=>!(s.activeEncounter&&!s.activeEncounter.rewarded)&&!s.dungeonRun&&!s.story?.activeScene;
export function otherworldStatus(s){const o=s.otherworld??freshOtherworldState();return {...o,pendingEquipment:o.pendingEquipment.length,unlocked:otherworldUnlocked(s),maxFloor:OTHERWORLD_MAX_FLOOR,stats:otherworldFloorStats(o.floor),storageBlocked:o.pendingEquipment.length>OTHERWORLD_PENDING_LIMIT-2};}
export function enterOtherworld(s,now=Date.now()){
 if(!validSave(s)||!otherworldUnlocked(s)||!otherworldBoundary(s)||s.running||s.otherworld?.active||!Number.isSafeInteger(now)||now<0||now>1e15||(s.restUntil??0)>now||!normalizeOtherworldState(s))return false;
 if(s.otherworld.pendingEquipment.length>OTHERWORLD_PENDING_LIMIT-2)return false;
 normalizeRegionNavigation(s);s.otherworld.active=true;s.activeEncounter=null;s.atCamp=false;s.running=true;s.restResume=false;s.stopAfterBattle=false;s.stopAfterDungeon=false;return {ok:true,floor:s.otherworld.floor};
}
export function exitOtherworld(s,now=Date.now()){
 if(!validSave(s)||!s.otherworld?.active||!otherworldBoundary(s))return false;
 s.otherworld.active=false;s.activeEncounter=null;s.running=false;s.restResume=false;s.stopAfterBattle=false;s.stopAfterDungeon=false;return {ok:true,siteId:s.siteId};
}
export function setOtherworldFloor(s,floor){
 if(!validSave(s)||!otherworldUnlocked(s)||!otherworldBoundary(s)||!normalizeOtherworldState(s)||!otherworldFloorStats(floor)||floor>Math.min(OTHERWORLD_MAX_FLOOR,s.otherworld.highestCleared+1))return false;
 s.otherworld.floor=floor;return {ok:true,floor};
}
export function setOtherworldAutoAdvance(s,enabled){
 if(typeof enabled!=='boolean'||!validSave(s)||!otherworldUnlocked(s)||!normalizeOtherworldState(s))return false;s.otherworld.autoAdvance=enabled;return {ok:true,autoAdvance:enabled};
}
export function claimPendingOtherworldEquipment(s){
 if(!validSave(s)||!s.otherworld)return null;const o=s.otherworld,remain=[];let claimed=0;
 for(const it of o.pendingEquipment){if(canReceiveEquipment(s,it)){s.inventory.push(it);recordCollectedEquipment(s,it);claimed++;}else remain.push(it);}
 o.pendingEquipment=remain;return {claimed,pending:remain.length};
}
function startOtherworldEncounter(s,now){
 if(!validSave(s)||!s.otherworld?.active||!otherworldUnlocked(s)||!canStartEncounterHealth(s,now))return null;
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return s.activeEncounter.otherworld?s.activeEncounter:null;
 if(s.otherworld.pendingEquipment.length>OTHERWORLD_PENDING_LIMIT-2){s.running=false;s.restResume=false;return null;}
 try{applyExperience({...s},OTHERWORLD_LOOT_POLICY.xp);if(s.kills>=1e12)throw Error('Counter limit');}catch{s.running=false;s.restResume=false;return null;}
 const floor=s.otherworld.floor,p=otherworldFloorStats(floor),areaId=s.race+'.a01',instanceId=areaId+'.field',def=ALL_MONSTERS[areaId+'.normal.1'],st=stats(s),id='otherworld-'+Math.floor(now)+'-'+(++serial);
 const e={otherworld:{version:1,floor},contentVersion:'dwarf-m2-v1',location:0,siteId:areaId,areaId,instanceId,kind:'field',luck:st.luck,boss:false,heroHp:s.heroHp,round:0,warcry:0,ironcoat:0,barrier:0,barrierShield:0,heroBurn:0,heroBurnPower:0,weakness:0,guard:0,cd:{},shelterUsed:false,shield:0,done:false,rewarded:false,killSource:null,multiVersion:1,id,rngState:rand(0,0xffffffff),rngDraws:0,itemSerial:0,summonSerial:0,activeCastCount:0,enemies:[],typedDots:[],fieldGroup:false,rewardGold:OTHERWORLD_LOOT_POLICY.gold,rewardXp:OTHERWORLD_LOOT_POLICY.xp,rewardDefinitionId:def.id,skillResolver:'tree-v1'};
 const u=makeMultiUnit(id+'-enemy-0',0,instanceId,{enemy:'异界守卫',hp:p.hp,atk:p.atk,armor:p.armor},s.lastHealthClock,{});
 initializeDwarfActor(u,{...def,skills:[],trait:null,elementTags:[]},{...p,parameterSetId:'otherworld-v081',elementResistance:{}},s.lastHealthClock);u.name='异界守卫 · 第'+floor+'层';u.main=true;u.otherworldActor=true;u.control.cooldowns={};e.enemies.push(u);e.targetId=u.id;
 initializeEncounterAffixes(e,st);if(s.equipmentShieldCarry){e.playerShieldLayers=structuredClone(s.equipmentShieldCarry);delete s.equipmentShieldCarry;}
 if(e.playerShieldLayers){const offset=-(e.playerShieldLayers.clock??0);e.playerShieldLayers={...e.playerShieldLayers,clock:0,layers:e.playerShieldLayers.layers.map(l=>({...l,expiresAt:l.expiresAt===null?null:l.expiresAt+offset}))};}
 dispatchRacialLegendaryEvent(s,{type:'encounterStart',encounterId:e.id},{maxHp:st.hp,stats:st});syncMultiTarget(e);s.activeEncounter=e;s.atCamp=false;s.running=true;s.nextActionAt=s.lastHealthClock+1100;return e;
}
function rewardOtherworld(s,e,now){
 if(!validSave(s)||!s.otherworld?.active||s.activeEncounter!==e||!e.otherworld||!e.done||!e.win||e.rewarded||!e.enemies.every(u=>u.hp===0)||!validMultiEncounter(e,INSTANCES)||s.otherworld.pendingEquipment.length>OTHERWORLD_PENDING_LIMIT-2)return null;
 const o=s.otherworld;let xpPlan;try{xpPlan=applyExperience({...s},OTHERWORLD_LOOT_POLICY.xp);}catch{s.running=false;s.restResume=false;return null;}if(s.kills>=1e12){s.running=false;s.restResume=false;return null;}
 return withMultiRng(e,()=>{
  e.rewarded=true;e.lootSummary=emptyLootSummary();e.materialLoot=[];e.rewardNotes=[];
  // Only this dedicated pool runs: no ordinary material/quest/pity/cooldown hooks.
  const quality=Number(weighted(OTHERWORLD_LOOT_POLICY.rarities.map((q,i)=>[q,OTHERWORLD_LOOT_POLICY.qualityWeights[i]]))),slots=SLOTS.filter(k=>k!=='core'||s.race==='ashen');
  const drops=[item(slots[rand(0,slots.length-1)],OTHERWORLD_LOOT_POLICY.equipmentLevel,null,quality,{baseLevel:OTHERWORLD_LOOT_POLICY.equipmentLevel,levelSource:'drop',originRace:s.race,luck:e.luck??0})];
  if(Math.random()<OTHERWORLD_LOOT_POLICY.setChance){const set=BUILD[rand(0,BUILD.length-1)];drops.push(item(SET_SLOTS[rand(0,SET_SLOTS.length-1)],OTHERWORLD_LOOT_POLICY.equipmentLevel,set.id,3,{baseLevel:OTHERWORLD_LOOT_POLICY.equipmentLevel,levelSource:'drop',originRace:set.originRace??'dwarf',luck:e.luck??0}));}
  for(const it of drops){
   // Ordinary equipment obeys the existing quality filter; sets retain v0.79+ protection.
   if(!it.set&&shouldDiscardLoot(s,'equipment',it.rarity)){e.lootSummary.discarded.equipment++;captureBattleLoot(s,{kind:'equipment',item:it},'filtered');e.rewardNotes.push('品质过滤丢弃 · '+equipmentDisplayName(it));continue;}
   if(canReceiveEquipment(s,it)){s.inventory.push(it);recordCollectedEquipment(s,it);captureBattleLoot(s,{kind:'equipment',item:it},'received');e.rewardNotes.push(equipmentDisplayName(it));}
   else{o.pendingEquipment.push(it);captureBattleLoot(s,{kind:'equipment',item:it},'pending');e.rewardNotes.push('异界装备待领取 · '+equipmentDisplayName(it));}
  }
  s.level=xpPlan.level;s.xp=xpPlan.xp;e.acceptedXp=xpPlan.acceptedXp;s.kills++;
  o.highestCleared=Math.max(o.highestCleared,e.otherworld.floor);
  if(o.autoAdvance&&o.floor<OTHERWORLD_MAX_FLOOR)o.floor++;
  else if(o.autoAdvance&&o.floor===OTHERWORLD_MAX_FLOOR){s.running=false;e.rewardNotes.push('已到达安全数值边界；可选择已通关层数继续挑战。');}
  if(o.pendingEquipment.length>OTHERWORLD_PENDING_LIMIT-2){s.running=false;e.rewardNotes.push('异界待领取装备已满，请领取后继续。');}
  if(e.playerShieldLayers)s.equipmentShieldCarry={version:1,clock:e.playerShieldLayers.clock,layers:e.playerShieldLayers.layers.filter(layer=>layer.ownerItemId&&(layer.source==='reactor:'+layer.ownerItemId||layer.source==='legendary:'+layer.ownerItemId)).map(layer=>structuredClone(layer))};
  s.nextBattleAt=Math.max(now,s.lastHealthClock??0)+1800;s.nextActionAt=s.nextBattleAt;
  if(s.stopAfterBattle||s.stopAfterDungeon){s.running=false;s.stopAfterBattle=false;s.stopAfterDungeon=false;}
  s.activeEncounter=null;return drops[0];
 });
}

export function startRoutedEncounter(s,now=Date.now()){
 if(s.otherworld?.active)return startOtherworldEncounter(s,now);
 if(s.version!==SCHEMA_VERSION||s.skillTree?.mode!=='active'||!normalizeExpedition(s))return null;
 if(s.activeEncounter&&s.activeEncounter.multiVersion!==1)return null;
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return normalizeEncounterElements(s.activeEncounter);
 if(stopBlockedWarActivity(s,now))return null;
 if(s.dungeonRun)return startInstanceEncounter(s,s.dungeonRun.instanceId,now);
 const route=nextEncounterRoute(s,now);if(!route&&!nodeAccess(s,s.expedition?.fieldId,now).allowed){s.running=false;s.restResume=false;}const encounter=route?startInstanceEncounter(s,route.id,now):null;if(encounter&&route.kind==='boss'&&s.expedition.autoBoss)encounter.automaticBoss=true;return encounter;
}
export function normalizeEncounterElements(e){
 if(!e)return e;
 const tags=e.location===1?['earth','fire']:e.location===2?['dark']:[];
 if(e.heroBurnPower===undefined)e.heroBurnPower=e.heroBurn>0?Math.max(2,Math.round(e.atk*.05)):0;
 e.elementTags??=tags;
 e.elementResistance??=Object.fromEntries(ELEMENT_KEYS.map(k=>[k,tags.includes(k)?(e.boss?12:8):0]));
 return e;
}
function validEncounter(e){
 if(e===undefined||e===null)return true;
 if(!validMultiEncounter(e,INSTANCES))return false;
 const number=(n,max=1e12)=>Number.isFinite(n)&&n>=0&&n<=max;
 if(e.kind==='dungeon'&&(!Number.isInteger(e.dungeonStage)||e.dungeonStage<1||e.dungeonStage>3||typeof e.runId!=='string'||!e.runId||e.runId.length>160||e.boss))return false;
 if(e.affixState!==undefined&&(!validBattleAffixState(e.affixState)||e.affixState.battleId!==(e.id??e.affixBattleId)))return false;
 if(e.luck!==undefined&&(!Number.isFinite(e.luck)||e.luck<0||e.luck>1000))return false;
 if(e.activeCastCount!==undefined&&(!Number.isSafeInteger(e.activeCastCount)||e.activeCastCount<0))return false;
 if(e.lootSummary!==undefined&&!validLootSummary(e.lootSummary))return false;
 if(e.instanceId!==undefined&&(!Object.hasOwn(INSTANCES,e.instanceId)||e.kind!==INSTANCES[e.instanceId].kind||e.siteId!==INSTANCES[e.instanceId].siteId||e.areaId!==INSTANCES[e.instanceId].areaId||resolveLegacySite(e.contentVersion==='dwarf-m2-v1'?e.siteId:e.location)?.id!==e.siteId))return false;
 if(e.instanceId===undefined&&['siteId','areaId','kind'].some(k=>e[k]!==undefined))return false;
 if(e.elementTags!==undefined&&(!Array.isArray(e.elementTags)||e.elementTags.length>6||new Set(e.elementTags).size!==e.elementTags.length||!e.elementTags.every(k=>ELEMENT_KEYS.includes(k))))return false;
 if(e.elementResistance!==undefined&&(!e.elementResistance||typeof e.elementResistance!=='object'||Array.isArray(e.elementResistance)||Object.keys(e.elementResistance).length!==6||!ELEMENT_KEYS.every(k=>number(e.elementResistance[k]))))return false;
 if(e?.automaticBoss!==undefined&&(typeof e.automaticBoss!=='boolean'||!e.boss))return false;
 if(!e||typeof e!=='object'||Array.isArray(e)||!(e.contentVersion==='dwarf-m2-v1'?AREAS[e.areaId]?.number-1===e.location&&INSTANCES[e.instanceId]?.areaId===e.areaId:[0,1,2].includes(e.location))||typeof e.name!=='string'||e.name.length>100||typeof e.boss!=='boolean'||typeof e.done!=='boolean'||typeof e.rewarded!=='boolean')return false;
 if(!['hp','max','atk','armor','heroHp','round','burn','broken','guard','stun','shield'].every(k=>number(e[k])))return false;
 if(!e.cd||typeof e.cd!=='object'||Array.isArray(e.cd)||!Object.entries(e.cd).every(([k,n])=>Object.hasOwn(SKILLS,k)&&number(n,100)))return false;
 if(!['warcry','ironcoat','blunt','scorch','barrier','barrierShield','heroBurn','heroBurnPower','weakness','nextHeavy','luck'].every(k=>e[k]===undefined||number(e[k])))return false;
 if((e.win!==undefined&&typeof e.win!=='boolean')||(e.heavyDelayed!==undefined&&typeof e.heavyDelayed!=='boolean')||typeof e.shelterUsed!=='boolean')return false;
 if(![null,'active','burn','poison','counter','legendary'].includes(e.killSource))return false;
 return (e.rewardNotes===undefined||(Array.isArray(e.rewardNotes)&&e.rewardNotes.length<=20&&e.rewardNotes.every(t=>typeof t==='string'&&t.length<=300)))&&(e.materialLoot===undefined||(Array.isArray(e.materialLoot)&&e.materialLoot.length<=12&&e.materialLoot.every(l=>parseMaterialKey(l.key)?.key===l.key&&number(l.count,100))));
}
function validHealth(s){
 const keys=['heroHp','restUntil','lastHealthClock'];if(keys.every(k=>s[k]===undefined))return true;
 return Number.isFinite(s.heroHp)&&s.heroHp>=0&&s.heroHp<=1e12&&Number.isFinite(s.restUntil)&&s.restUntil>=0&&s.restUntil<=1e15+REST_DURATION_MS&&Number.isFinite(s.lastHealthClock)&&s.lastHealthClock>=0&&s.lastHealthClock<=1e15;
}
export function normalizeHealth(s,now=Date.now()){
 if(!Number.isFinite(now)||now<0||now>1e15||!validHealth(s))return false;
 const max=stats(s).hp;
 if(s.heroHp===undefined){s.heroHp=max;s.restUntil=0;s.lastHealthClock=now;}
 else{capHealth(s);s.lastHealthClock=Math.max(s.lastHealthClock,now);}
 return true;
}
export function settleRest(s,now=Date.now()){
 if(!normalizeHealth(s,now))return false;
 if(s.restUntil>0&&s.lastHealthClock>=s.restUntil){s.heroHp=stats(s).hp;s.restUntil=0;s.running=!!s.running&&!!s.restResume;s.restResume=false;s.nextActionAt=s.lastHealthClock;return true;}
 return false;
}
export function startRest(s,now=Date.now(),resume=false){
 if(!normalizeHealth(s,now))return false;
 if(s.restUntil>0)return false;
 resume=!!resume&&(s.otherworld?.active?otherworldUnlocked(s):nodeAccess(s,s.siteId+'.field',now).allowed);
 // An explicit camp withdrawal abandons only the current unfulfilled attempt.
 // Keep prior layers/receipts and protected quest tools; the retry gets a new ID.
 const pending=s.story?.activeScene,battle=s.activeEncounter,definition=STORY_SCENES[pending?.id];
 if(battle&&pending?.encounterId===battle.id&&definition?.encounter?.nodeId===battle.instanceId&&!s.story.encounters.some(r=>r.sceneId===pending.id)){
  pending.encounterId=null;
  if(battle.storyScenario&&Number.isFinite(battle.storyScenario.initialHeroHp))s.heroHp=battle.storyScenario.initialHeroHp;
 }
 s.atCamp=true;s.restUntil=s.lastHealthClock+REST_DURATION_MS;s.activeEncounter=null;s.dungeonRun=null;s.restResume=!!resume;s.running=!!resume;s.nextActionAt=s.restUntil;return true;
}
export function canStartEncounter(s,now=Date.now(),nodeId=s.siteId+'.field'){
 if(!nodeAccess(s,nodeId,now).allowed&&!(s.activeEncounter&&!s.activeEncounter.rewarded&&s.activeEncounter.instanceId===nodeId))return false;
 return canStartEncounterHealth(s,now);
}
function canStartEncounterHealth(s,now){
 if(!normalizeHealth(s,now))return false;settleRest(s,now);
 if(s.heroHp<=0&&s.restUntil===0)startRest(s,now);
 return s.restUntil===0&&s.heroHp>0&&s.lastHealthClock>=(s.nextBattleAt??0);
}
export function encounter(s,boss=false,now=Date.now()){
 if(s.version!==SCHEMA_VERSION)return null;
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return normalizeEncounterElements(s.activeEncounter);
 const site=resolveLegacySite(s.location);
 return boss?startInstanceEncounter(s,s.siteId+'.boss',now):startRoutedEncounter(s,now);
}
function initializeEncounterAffixes(e,st,run=null){
 e.affixBattleId=e.id??('battle-'+(++serial));e.affixState=createBattleAffixState(e.affixBattleId);e.growthKillIds=[];
 const usage=run?.affixUsage;if(usage)e.affixState.nirvanaUsed=usage.nirvanaUsed;
 const alreadyApplied=usage?.shelterUsed??false,grant=openingShelterShield({hasShelter:!!st.specials.shelter,maxHp:st.hp,flatBonus:st.shieldBonus,alreadyApplied});
 e.shelterUsed=alreadyApplied||!!st.specials.shelter;if(!alreadyApplied)e.shield=grant;
 if(usage)usage.shelterUsed=e.shelterUsed;
}
function ensureEncounterAffixes(e){e.affixBattleId??=e.id??('legacy-battle-'+(++serial));e.affixState??=createBattleAffixState(e.affixBattleId);}
function reviveEncounter(e,st,logs){const out=tryNirvana(e.affixState,{battleId:e.affixState.battleId,hasNirvana:!!st.specials.nirvana,hp:e.heroHp,maxHp:st.hp});if(!out)return false;e.affixState=out.state;if(out.revived){e.heroHp=out.hp;logs.push('涅槃 · 满血复活（本场已使用）');}return out.revived;}
// Authored nonlethal scene start. Caller must persist this candidate atomically.
export function startStoryScenario(s,scenarioId,now=Date.now()){
 if(!validSave(s)||!canStartStoryScenario(s,scenarioId)||!storyScenarioForStart(s,scenarioId)||!Number.isSafeInteger(now)||now<0||now>1e15)return null;
 const next=structuredClone(s),definition=storyScenarioForStart(next,scenarioId),initialHeroHp=next.heroHp??stats(next).hp,returnAtCamp=next.atCamp===true,priorMonsterLedger=structuredClone(next.monsterLedger);
 const e=startRegisteredStoryEncounter(next,definition.sceneId,now);
 if(!e||!attachStoryScenario(next,e,scenarioId,{initialHeroHp,returnAtCamp}))return null;
 if(priorMonsterLedger===undefined)delete next.monsterLedger;else next.monsterLedger=priorMonsterLedger;
 if(!validSave(next))return null;
 for(const key of Object.keys(s))if(!Object.hasOwn(next,key))delete s[key];Object.assign(s,next);return s.activeEncounter;
}
// Not a generic bypass parameter: only the controller's exact registered active
// scene, node, POV, dialogue choice and unclaimed objective can use this path.
function startRegisteredStoryEncounter(s,sceneId,now){
 const d=STORY_SCENES[sceneId],a=s.story?.activeScene,instance=d?.encounter&&PLANNED_INSTANCES[d.encounter.nodeId];
 if(!d||a?.id!==d.id||d.pov!==s.race||!instance?.enabled||instance.kind!=='field'||instance.siteId!==d.siteId||s.siteId!==d.siteId||!storyTerritoryAccess(s,sceneId).allowed||!canStartEncounterHealth(s,now)||!normalizeExpedition(s))return null;
 return startDwarfEncounter(s,instance,now,false);
}
export function startStoryFieldEncounter(s,sceneId,now=Date.now()){
 const d=STORY_SCENES[sceneId];
 if(!validSave(s)||!d||d.encounter?.kind!=='victory'||!canStartStoryFieldEncounter(s,d.encounter.nodeId)||s.story?.activeScene?.id!==sceneId||!Number.isSafeInteger(now)||now<0||now>1e15)return null;
 const next=structuredClone(s),e=startRegisteredStoryEncounter(next,sceneId,now);if(!e)return null;
 next.story.activeScene.encounterId=e.id;next.stopAfterBattle=true;
 if(!validSave(next))return null;Object.assign(s,next);return s.activeEncounter;
}
export function startInstanceEncounter(s,instanceId,now=Date.now()){
 if(s.otherworld?.active)return null;
 if(!validBossChallengeState(s)||!validRareRewardProgress(s,validEquipment)||rareRewardStorageBlocked(s))return null;
 const instance=PLANNED_INSTANCES[instanceId];if(s.version!==SCHEMA_VERSION||!instance?.enabled||!canStartEncounter(s,now,instanceId)||!normalizeExpedition(s))return null;
 if(s.activeEncounter&&!s.activeEncounter.rewarded)return s.activeEncounter.instanceId===instanceId?s.activeEncounter:null;
 if(s.dungeonRun&&s.dungeonRun.instanceId!==instanceId)return null;
 const cooling=instance.kind!=='field'&&!s.dungeonRun&&s.lastHealthClock<(s.instanceCooldowns[instanceId]??0);
 if(cooling&&!canUseExtraBossChallenge(s,instanceId))return null;
 const encounter=startDwarfEncounter(s,instance,now);
 // Deduct exactly once, only after a genuine new encounter exists. Resumes return above.
 if(encounter&&cooling)s.extraBossChallenges--;
 return encounter;
}

function startDwarfEncounter(s,instance,now,recordLocalExploration=true){
 const treeCarry=s.dungeonRun?.carry;
 const area=AREAS[instance.areaId],story=STORY_SCENES[s.story?.activeScene?.id];
 // Only the private registered-scene launcher passes recordLocalExploration=false.
 // A story corridor never grants ordinary exploration access or area progress.
 const storyCorridor=recordLocalExploration===false&&story?.optional===false&&story.pov===s.race&&story.siteId===instance.siteId&&story.encounter?.nodeId===instance.id&&storyTerritoryAccess(s,story.id).storyOnly===true;
 if(!areaBudgetReady(area.number,area.race)||!getAreaProgress(s,area.race)?.unlocked.includes(area.number)&&!storyCorridor)return null;
 const stage=s.dungeonRun?.stage??1,rank=instance.kind==='boss'?'boss':instance.kind==='dungeon'&&stage===3?'elite':'normal',pool=eligibleMonsters(instance.id,rank);
 if(!pool.length)return null;
 const st=stats(s),id='m2-'+Math.floor(now)+'-'+(++serial),seed=rand(0,0xffffffff),e={contentVersion:'dwarf-m2-v1',location:area.number-1,siteId:instance.siteId,areaId:instance.areaId,instanceId:instance.id,kind:instance.kind,luck:st.luck,boss:instance.kind==='boss',heroHp:s.heroHp,round:0,warcry:0,ironcoat:0,barrier:0,barrierShield:0,heroBurn:0,heroBurnPower:0,weakness:0,guard:0,cd:{},shelterUsed:false,shield:0,done:false,rewarded:false,killSource:null,multiVersion:1,id,rngState:seed,rngDraws:0,itemSerial:0,summonSerial:0,activeCastCount:0,enemies:[],typedDots:[]};
 withMultiRng(e,()=>{
  const group=instance.kind==='field'&&Math.random()<raceGroupChance(area.race),count=group?rand(2,3):1; e.fieldGroup=group;
  for(let i=0;i<count;i++){
   const eligible=group?pool.filter(d=>d.trait?.type!=='followers'):pool,def=eligible[rand(0,eligible.length-1)],p=monsterParameters(def.id),followers=def.trait?.type==='followers';
   const shares=followers?def.trait.shares:[1];
   for(let j=0;j<shares.length;j++){
    const u=makeMultiUnit(id+'-enemy-'+e.enemies.length,e.location,instance.id,{enemy:def.name,hp:p.hp,atk:p.atk,armor:p.armor},s.lastHealthClock,{});
    // Apply only when creating a new dungeon actor; followers inherit their
    // normal authored shares. Hydrated encounters retain their saved power.
    const threat=dungeonDamageMultiplier(instance.kind,rank);
    const adjusted={...p,hp:p.hp*(group?1.5/count:1),atk:p.atk*(group?1.2/count:1)*threat,elementalPower:p.elementalPower*(group?1.2/count:1)*threat};
    initializeDwarfActor(u,def,adjusted,s.lastHealthClock,{share:shares[j],follower:j>0});if(j>0&&def.trait.followerMonsterId){u.followerMonsterId=def.trait.followerMonsterId;u.name=ALL_MONSTERS[u.followerMonsterId]?.name??def.trait.name;u.independentRewards=false;}u.main=e.enemies.length===0;e.enemies.push(u);
   }
   if(i===0){e.rewardGold=p.rewardGold;e.rewardXp=p.rewardXp;e.rewardDefinitionId=def.id;}
  }
 });
 if(instance.kind==='dungeon'){
  e.clearRewards=structuredClone(raceParameterSet(area.race)?.clearRewards?.[area.number]??null);
  if(!s.dungeonRun)s.dungeonRun={instanceId:instance.id,runId:'run-'+id,stage:1,affixUsage:{shelterUsed:false,nirvanaUsed:false}};
  e.dungeonStage=s.dungeonRun.stage;e.runId=s.dungeonRun.runId;
  if(s.dungeonRun.carry){applyDungeonPlayerState(e,s.dungeonRun.carry);delete s.dungeonRun.carry;}
  s.expedition={...s.expedition,mode:'dungeon',targetInstanceId:instance.id};
 }
 if(instance.kind==='field'&&s.expedition.mode!=='dungeon')s.expedition={...s.expedition,mode:'field',targetInstanceId:null,fieldId:instance.id,loop:false};
 if(instance.kind==='dungeon'&&!INSTANCES[s.expedition.fieldId]?.contentVersion)s.expedition.fieldId=area.id+'.field';
 if(s.skillTree?.mode==='active')e.skillResolver='tree-v1';initializeEncounterAffixes(e,st,instance.kind==='dungeon'?s.dungeonRun:null);if(s.equipmentShieldCarry){e.playerShieldLayers=structuredClone(s.equipmentShieldCarry);delete s.equipmentShieldCarry;}if(treeCarry&&!restoreDungeonSkillShieldLayers(e,treeCarry))return null;
 // Each fresh field encounter starts a new skill clock. Preserve carried shield
 // lifetime, not its previous encounter's absolute clock origin.
 if(e.skillResolver==='tree-v1'&&e.playerShieldLayers){const clock=e.treeEffects?.clock??e.treeCombatClock??0,offset=clock-e.playerShieldLayers.clock;e.playerShieldLayers={...e.playerShieldLayers,clock,layers:e.playerShieldLayers.layers.map(l=>({...l,expiresAt:l.expiresAt===null?null:l.expiresAt+offset}))};}
 e.targetId=e.enemies[0].id;dispatchRacialLegendaryEvent(s,{type:'encounterStart',encounterId:e.id},{maxHp:st.hp,stats:st});syncMultiTarget(e);s.location=e.location;s.siteId=instance.siteId;s.activeEncounter=e;s.atCamp=false;s.running=true;s.nextActionAt=s.lastHealthClock+1100;recordEncounteredMonsters(s,e);recordNodeExplored(s,e);if(recordLocalExploration){recordNpcEventExploration(s,e,now);startNpcObjectiveReceipt(s,e,now);}return e;
}
// Explicit developer entry: callers isolate the supplied save; no production random trigger.
export function startDeveloperGroup(s,options={},now=Date.now()){
 const {count=2,seed=1,profiles=[]}=options;
 if(!Number.isSafeInteger(now)||now<0||!Number.isSafeInteger(s.lastHealthClock??now)||![2,3].includes(count)||!Number.isInteger(seed)||seed<0||seed>0xffffffff||!Array.isArray(profiles)||profiles.length>count||!profiles.every(validMultiProfile)||options.scopeOverrides||s.activeEncounter&&!s.activeEncounter.rewarded||s.dungeonRun)return null;
 if(!canStartEncounter(s,now)||!normalizeExpedition(s))return null;
 const site=resolveLegacySite(s.location),instance=INSTANCES[site.id+'-field'],l=LOCS[s.location],st=stats(s),id='dev-'+Math.floor(now)+'-'+seed;
 const e={location:s.location,siteId:site.id,areaId:site.areaId,instanceId:instance.id,kind:'field',luck:st.luck,boss:false,heroHp:s.heroHp,round:0,warcry:0,ironcoat:0,barrier:0,barrierShield:0,heroBurn:0,heroBurnPower:0,weakness:0,guard:0,cd:{},shelterUsed:false,shield:0,done:false,rewarded:false,killSource:null,multiVersion:1,developmentFixture:true,id,rngState:seed,rngDraws:0,itemSerial:0,summonSerial:0,activeCastCount:0,enemies:[]};
 initializeEncounterAffixes(e,st);
 for(let i=0;i<count;i++){const u=normalizeEncounterElements(makeMultiUnit(id+'-enemy-'+i,s.location,instance.id,l,s.lastHealthClock,profiles[i]??{}));u.main=i===0;e.enemies.push(u);}
 e.targetId=e.enemies[0].id;syncMultiTarget(e);s.activeEncounter=e;s.atCamp=false;s.running=true;s.nextActionAt=s.lastHealthClock+1100;return e;
}
export function setMultiPaused(s,paused,now=Date.now()){return pauseMulti(s,paused,now);}
export function setCombatTarget(s,id){return s.activeEncounter?.multiVersion===1?selectMultiTarget(s.activeEncounter,id):false;}
export function combatTargets(e,now){return e?.multiVersion===1?multiTargetRows(e,now):[];}
export function queueDeveloperAction(s,action){const e=s.activeEncounter;if(e?.multiVersion!==1||!e.developmentFixture||e.done||e.fixtureAction||!validFixtureAction(action))return false;e.fixtureAction=structuredClone(action);return true;}
// Objective receipts are minted only in the genuine production encounter path.
// Unlike legacy victory counters, modern kill objectives count actual matching
// initial actors killed by an engine step, once per successful stage settlement.
const npcObjectiveReplayStates=new WeakSet();
function withNpcObjectiveReplay(s,run){npcObjectiveReplayStates.add(s);try{return run();}finally{npcObjectiveReplayStates.delete(s);}}
function npcObjectiveNodeAccess(s,nodeId,now){return nodeAccess(s,nodeId,npcObjectiveReplayStates.has(s)?now:undefined);}
function startNpcObjectiveReceipt(s,e,now){
 if(!Number.isSafeInteger(now)||now<0||now>1e15||!validNpcEventState(s)||s.developmentEquipmentSandbox||e.developmentFixture||e.storyScenario||!npcObjectiveNodeAccess(s,e.instanceId,now).allowed)return;
 const tasks={};for(const [id,entry]of Object.entries(s.npcEvents?.entries??{})){
  const o=NPC_EVENTS[id]?.taskObjective,p=s.npcObjectiveProgress?.entries?.[id];
  if(entry.status==='active'&&npcEventIsModern(s,id)&&((o?.kind==='kill'&&p.count<o.count&&o.nodeIds.includes(e.instanceId))||(o?.kind==='investigate'&&o.checkpoints.some(c=>c.challenge==='dungeon-clear'&&c.nodeId===e.instanceId&&!p.checkpoints.includes(c.id)&&(c.requiresCheckpointIds??[]).every(id=>p.checkpoints.includes(id)))))&&entry.acceptedAt<=now)tasks[id]={cycle:entry.cycle,acceptedAt:entry.acceptedAt};
 }
 if(Object.keys(tasks).length)e.npcObjectiveReceipt={version:1,startedAt:now,tasks,initialUnitIds:e.enemies.filter(u=>u.origin==='initial'&&!u.follower&&u.sourceInstanceId===e.instanceId).map(u=>u.id),defeatedUnitIds:[]};
}
function recordNpcObjectiveDefeats(s,e,living){
 const r=e.npcObjectiveReceipt;if(!r||e.developmentFixture||e.storyScenario)return;
 for(const u of e.enemies)if(living.has(u.id)&&u.hp===0&&r.initialUnitIds.includes(u.id)&&!r.defeatedUnitIds.includes(u.id))r.defeatedUnitIds.push(u.id);
}
function settleNpcObjectiveKills(s,e,now){
 const r=e.npcObjectiveReceipt,area=AREAS[e.areaId];
 if(!r||!validNpcEventState(s)||s.developmentEquipmentSandbox||s.activeEncounter!==e||!e.done||!e.win||!e.rewarded||e.developmentFixture||e.storyScenario||!npcObjectiveNodeAccess(s,e.instanceId,now).allowed||!(s.areaProgress?.[area?.race]?.unlocked??[1]).includes(area?.number)||r.startedAt>now)return false;
 let changed=false;
 for(const [id,receipt]of Object.entries(r.tasks)){
  const entry=s.npcEvents.entries[id],p=s.npcObjectiveProgress.entries[id],o=NPC_EVENTS[id].taskObjective;
  if(entry.status!=='active'||receipt.cycle!==entry.cycle||receipt.acceptedAt!==entry.acceptedAt||p.count>=o.count||p.receipts.includes(e.id))continue;
  if(o.kind==='investigate'){
   if(e.kind!=='dungeon'||!r.initialUnitIds.length||!r.initialUnitIds.every(id=>r.defeatedUnitIds.includes(id)))continue;
   const stageReceipt=e.runId+'|'+e.dungeonStage;
   if(p.receipts.includes(stageReceipt))continue;
   if(e.dungeonStage===1)p.receipts=[stageReceipt];
   else if(p.receipts.length===e.dungeonStage-1&&p.receipts.every((id,i)=>id===e.runId+'|'+(i+1)))p.receipts.push(stageReceipt);
   else continue;
   changed=true;if(e.dungeonStage!==3)continue;
   for(const point of o.checkpoints)if(point.challenge==='dungeon-clear'&&point.nodeId===e.instanceId&&!p.checkpoints.includes(point.id)&&(point.requiresCheckpointIds??[]).every(id=>p.checkpoints.includes(id))){p.checkpoints.push(point.id);p.count=p.checkpoints.length;changed=true;}
   continue;
  }
  const killed=e.enemies.filter(u=>r.defeatedUnitIds.includes(u.id)&&u.hp===0&&u.origin==='initial'&&!u.follower&&u.sourceInstanceId===e.instanceId&&o.nodeIds.includes(u.sourceInstanceId)&&o.monsterIds.includes(u.definitionId)&&ALL_MONSTERS[u.definitionId]?.nodes?.includes(e.instanceId));
  if(!killed.length)continue;p.count=Math.min(o.count,p.count+killed.length);p.receipts.push(e.id);changed=true;
 }
 return changed;
}
function rewardDwarf(s,e,now){
 if(!validRareRewardProgress(s,validEquipment)||rareRewardStorageBlocked(s)||s.activeEncounter!==e||!e.done||!e.win||e.rewarded||!e.enemies.every(u=>u.hp===0)||!validMultiEncounter(e,INSTANCES))return null;
 const run=s.dungeonRun,clear=e.kind==='dungeon'&&e.dungeonStage===3;
 if(e.kind==='dungeon'&&(!run||run.instanceId!==e.instanceId||run.runId!==e.runId||run.stage!==e.dungeonStage))return null;
 const priorClaims=claimPendingRareRewards(s);
 const lootBefore=e.kind==='dungeon'?dungeonLootSnapshot(s):null;
 normalizeCodexCollection(s);
 return withMultiRng(e,()=>{
  e.rewarded=true;e.lootSummary=emptyLootSummary();e.materialLoot=[];e.rewardNotes=[];
  if(priorClaims?.sets||priorClaims?.fruit)e.rewardNotes.push('此前待领奖励已入包：套装 '+priorClaims.sets+' / 灵慧之果 '+priorClaims.fruit);
  settleNpcObjectiveKills(s,e,now);recordNpcEventVictory(s,e);recordStoryEncounterVictory(s,e);
  const st=stats(s),multiple=e.fieldGroup?2:1,baseXp=e.rewardXp*multiple,knowledge=st.specials.knowledge&&Math.random()<.5,clearRewards=clear?e.clearRewards:null;
  s.kills++;s.gold+=e.rewardGold*multiple+(clearRewards?.gold??0);e.acceptedXp=gainXp(s,baseXp*(knowledge?2:1)+(clearRewards?.xp??0)).acceptedXp;if(knowledge&&e.acceptedXp>0)e.rewardNotes.push('求知：额外基础经验 +'+baseXp);
  const initial=e.enemies.filter(u=>u.origin==='initial'&&!u.follower),sources=[];
  for(let i=0;i<multiple;i++)sources.push(e.fieldGroup?initial[rand(0,initial.length-1)]:initial[0]);
  e.rewardRoundSources=e.fieldGroup?sources.map(u=>u.id):undefined;
  const materialRound=u=>{
   const result=rollMonsterMaterials(s,e,u,{random:Math.random,luck:e.luck??0,rareBonuses:{special:returnRingRareBonus(s,'material-special'),gem:returnRingRareBonus(s,'material-gem')},rollQuality:(weights,luck)=>luckyRoll(()=>rollQuality(weights),luck),owned:(save,id)=>[0,1,2,3].some(q=>materialCount(save,toDwarfInventoryKey(id),q)>0),receive:(save,row)=>{
    const key=materialKey(row.material,row.quality),received=receiveBattleLoot(save,{kind:'material',key,quantity:row.quantity},e.lootSummary);
    if(received)e.materialLoot.push({key,material:row.material,quality:row.quality,count:row.quantity,channel:row.channel,monsterId:row.monsterId,nodeId:row.nodeId});
    if(received&&rollGoblinExtraMaterial(save.race,row,MATERIALS[row.material],Math.random)&&receiveBattleLoot(save,{kind:'material',key,quantity:1},e.lootSummary)){e.materialLoot.push({key,material:row.material,quality:row.quality,count:1,channel:'racial-scavenging',monsterId:row.monsterId,nodeId:row.nodeId});e.rewardNotes.push('拾荒直觉：额外材料 +1');}return received;
   }});return result.ok;
  };
  for(const u of sources)materialRound(u);
  if(clearRewards)for(let i=0;i<(clearRewards.materialRounds??0);i++)materialRound(initial[0]);
  let first=null;for(const u of sources){const drop=rollDrop(s,e.boss,e.luck??0,e.instanceId,clear,e.lootSummary,clearRewards?.gearChance,e);if(drop){first??=drop;e.rewardNotes.push(drop.name);}}
  if(e.boss){const area=AREAS[e.areaId],receipt=prepareLegendaryDrop({settlementId:e.id,nodeId:e.instanceId,regionRace:area?.race,kind:e.kind,won:true},{probability:legendaryPoolProbability(e.luck??0,returnRingRareBonus(s,'boss-legendary')),random:Math.random,generateItem:({legendaryId})=>{const lv=rollDropEquipmentLevel(areaGearLevel(e.instanceId),area.levelRange);return legendaryItem(legendaryId,lv.level,{...lv,luck:e.luck??0});},validateItem:it=>validEquipment(it)});if(receipt){e.legendaryDropReceipt=receipt;if(receipt.item){const accepted=receiveBattleLoot(s,{kind:'equipment',item:structuredClone(receipt.item)},e.lootSummary);e.rewardNotes.push(accepted?'传说 · '+receipt.item.name:'传说未收取 · '+receipt.item.name);}}}
  const markChance=e.boss?.08:clear?(clearRewards?.markChance??.02):0;
  if(markChance>0&&Math.random()<lootOccurrenceProbability(markChance,e.luck??0)&&receiveBattleLoot(s,{kind:'consumable',key:'reforgeToken',quantity:1},e.lootSummary))e.rewardNotes.push('重铸印记 ×1');
  settleRareClearRewards(s,e,clear);
  settleInfinityRecipe(s,e,{instances:INSTANCES});
  applyReturnRingVictory(s,e,stats(s).hp);
  if(e.boss){s.instanceCooldowns[e.instanceId]=Math.max(now,s.lastHealthClock??0)+1800000;s.running=e.automaticBoss?!!s.running:!!s.expedition.autoBoss;}
  else if(e.kind==='dungeon'){
   if(clear){recordDungeonAreaClear(s,e);s.instanceCooldowns[e.instanceId]=Math.max(now,s.lastHealthClock??0)+300000;s.dungeonRun=null;e.rewardNotes.push('普通副本通关 · 冷却5分钟');if(!s.expedition.loop&&!s.expedition.autoDungeon&&!s.expedition.autoBoss)s.running=false;}
   else{run.carry=captureDungeonPlayerState(e);run.stage++;e.rewardNotes.push('副本进度 '+e.dungeonStage+'/3');}
  }
  for(const row of e.materialLoot)e.rewardNotes.push(MATERIAL_QUALITIES[row.quality]+' '+(MATERIALS[row.material]?.name??row.material)+' ×'+row.count);
  for(const action of ['discarded','overflow'])if(Object.values(e.lootSummary[action]).some(Boolean))e.rewardNotes.push((action==='discarded'?'品质过滤丢弃':'背包已满')+'：'+JSON.stringify(e.lootSummary[action]));
  if(rareRewardStorageBlocked(s)){s.running=false;e.rewardNotes.push('珍稀待领奖励已满，请清理背包并领取后继续远征');}
  recordDungeonLootReceipt(s,e,lootBefore,now);
  if(e.playerShieldLayers)s.equipmentShieldCarry={version:1,clock:e.playerShieldLayers.clock,layers:e.playerShieldLayers.layers.filter(layer=>layer.ownerItemId&&(layer.source==='reactor:'+layer.ownerItemId||layer.source==='legendary:'+layer.ownerItemId)).map(layer=>structuredClone(layer))};
  s.nextBattleAt=Math.max(now,s.lastHealthClock??0)+1800;s.nextActionAt=s.nextBattleAt;if(s.stopAfterBattle||(s.stopAfterDungeon&&!s.dungeonRun)){s.running=false;s.stopAfterBattle=false;s.stopAfterDungeon=false;}s.activeEncounter=null;return first;
 });
}
function rewardMulti(s,e,now){
 if(s.activeEncounter!==e||!e.done||!e.win||e.rewarded||!e.enemies.every(u=>u.hp===0)||!validMultiEncounter(e,INSTANCES))return null;
 return withMultiRng(e,()=>{
  e.rewarded=true;e.lootSummary=emptyLootSummary();e.materialLoot=[];e.rewardNotes=[];e.rewardRoundSources=[];
  const l=LOCS[e.location],st=stats(s),baseXp=(20+e.location*8)*2,knowledge=st.specials.knowledge&&Math.random()<.5;
  s.kills++;s.normalWins[e.location]++;s.gold+=l.reward*2;e.acceptedXp=gainXp(s,baseXp*(knowledge?2:1)).acceptedXp;if(knowledge&&e.acceptedXp>0)e.rewardNotes.push('求知：额外基础经验 +'+baseXp);
  let first=null;const initial=e.enemies.filter(u=>u.origin==='initial');
  for(let round=0;round<2;round++){
   const u=initial[Math.floor(Math.random()*initial.length)],source=INSTANCES[u.sourceInstanceId],loc=LOCS[u.location];e.rewardRoundSources.push(u.id);
   e.materialLoot.push(...earnedMaterials(s,loc.mat,1,false,e.luck??0,null,e.lootSummary));
   const count=rollRecoverySupply(source,AREAS[source.areaId],false);if(count)e.materialLoot.push(...earnedMaterials(s,'灰根草',count,false,e.luck??0,null,e.lootSummary));
   const drop=rollDrop(s,false,e.luck??0,u.sourceInstanceId,false,e.lootSummary);if(drop){first??=drop;e.rewardNotes.push('群怪战利品：'+drop.name);}
  }
  const merged=new Map();for(const row of e.materialLoot){const old=merged.get(row.key);if(old)old.count+=row.count;else merged.set(row.key,{...row});}e.materialLoot=[...merged.values()];
  for(const row of e.materialLoot)e.rewardNotes.push(MATERIAL_QUALITIES[row.quality]+' '+row.material+' ×'+row.count);
  for(const action of ['discarded','overflow'])if(Object.values(e.lootSummary[action]).some(Boolean))e.rewardNotes.push((action==='discarded'?'品质过滤丢弃':'背包已满')+'：'+JSON.stringify(e.lootSummary[action]));
  s.running=false;s.stopAfterBattle=false;s.nextBattleAt=Math.max(now,s.lastHealthClock??0)+1800;s.nextActionAt=s.nextBattleAt;s.activeEncounter=null;return first;
 });
}

const damage=(raw,armor)=>Math.max(1,Math.round(raw*100/(100+Math.max(0,armor))));
function finish(e,win,source){e.done=true;e.win=win;e.hp=Math.max(0,e.hp);e.heroHp=Math.max(0,e.heroHp);e.killSource=source;}
export function combatStatuses(e){
 if(!e)return[];
 const defs=[['warcry','warcry','砧誓战吼','hero'],['ironcoat','ironcoat','铁衣铭文','hero'],['guard','guard','坚守','hero'],['barrier','barrier','铸壁','hero'],['heroBurn','mark','灼烧','hero'],['weakness','blunt','虚弱','hero'],['broken','break','破甲','enemy'],['burn','mark','铭火','enemy'],['blunt','blunt','挫锋','enemy'],['scorch','scorch','炉蚀','enemy']];
 const out=defs.filter(([id])=>e[id]>0).map(([id,key,name,side])=>({key,name,turns:e[id],side}));
 for(const dot of e.typedDots??[]){const clock=e.pauseAt??e.enemies?.[0]?.control?.clock??0;out.push({key:'soul',name:({earth:'地蚀',water:'水蚀',fire:'灼烧',wind:'风蚀',light:'光蚀',dark:'暗蚀',physical:'流血'})[dot.type],remainingSeconds:Math.max(0,Math.ceil((dot.endAt-clock)/1000)),turns:0,side:'hero'});}
 for(const layer of e.playerShieldLayers?.layers??[])if(layer.source.startsWith('reactor:')&&layer.remaining>0)out.push({key:'fire',name:'余热护盾 '+Math.round(layer.remaining),remainingSeconds:layer.expiresAt===null?0:Math.max(0,(layer.expiresAt-e.playerShieldLayers.clock)/1000),turns:0,side:'hero'});
 if(e.heavyDelayed)out.push({key:'delay',name:'重击延后',turns:Math.max(1,e.nextHeavy-e.round),side:'enemy'});return out;
}
function stepImpl(s,e,now=Date.now(),treeSkills=null){
 if(s.version!==SCHEMA_VERSION||!e||e.multiVersion!==1||e!==s.activeEncounter||e.done||e.pauseAt!==undefined||!normalizeHealth(s,now)||s.restUntil>0)return[];
 ensureEncounterAffixes(e);normalizeDungeonAffixUsage(s);e.heroHp=Math.min(e.heroHp,stats(s).hp);s.heroHp=e.heroHp;const drank=autoDrinkPotion(s,e,now);
 const eventAt=s.lastHealthClock,basicOnly=e.multiVersion===1&&Number.isFinite(e.pendingBasicAt)&&e.pendingBasicAt<=eventAt&&e.pendingBasicAt<(e.nextRegularAt??Infinity),combatDeltaMs=basicOnly?(e.pendingBasicDelayMs??165):1100-(e.basicMicroElapsed??0);
 const turn={burnAtStart:e.heroBurn??0,burnTicked:false},logs=withMultiRng(e,()=>stepMulti(s,e,turn,{stats:treeSkills?baseStats:stats,SKILLS,skillUnlocked,resolveElementDamage,treeSkills,basicOnly,combatDeltaMs,now:s.lastHealthClock,makeSummon:(u,n)=>normalizeEncounterElements(makeMultiUnit(e.id+'-summon-'+n,u.location,u.sourceInstanceId,LOCS[u.location],s.lastHealthClock))}));
 if(e.kind==='dungeon'&&s.dungeonRun?.runId===e.runId)s.dungeonRun.affixUsage.nirvanaUsed=e.affixState.nirvanaUsed;
 if(!storyScenarioNonlethal(e))recordGrowthKills(s,e,e.enemies.filter(u=>u.hp===0).map(u=>u.id));
 // Every executed player round consumes one turn of temporary player statuses,
 // including an early lethal hit. Do not run skipped damage phases.
 if(!basicOnly)for(const field of ['guard','warcry','ironcoat','barrier','weakness'])e[field]=Math.max(0,(e[field]??0)-1);
 if(!basicOnly&&turn.burnAtStart>0&&!turn.burnTicked&&e.heroBurn>0)e.heroBurn--;
 if(!e.heroBurn)e.heroBurnPower=0;
 if(!e.barrier)e.barrierShield=0;
 if(e.multiVersion===1){e.lastCombatEventAt=eventAt;if(basicOnly)e.basicMicroElapsed=combatDeltaMs;else {delete e.basicMicroElapsed;e.nextRegularAt=eventAt+1100;}s.nextActionAt=Math.min(e.nextRegularAt??eventAt+1100,e.pendingBasicAt??Infinity);}else s.nextActionAt=eventAt+1100;if(drank)logs.unshift('自动饮用 · '+POTIONS.healing.name);s.heroHp=Math.max(0,Math.min(stats(s).hp,e.heroHp));
 const scenario=advanceStoryScenario(s,e);if(scenario){if(scenario.completed&&!recordStoryScenarioResult(s,e)){e.storyScenario.result='retry';e.rewardNotes=['剧情记录校验未通过，返回本场安全点；未推进剧情。'];}finalizeStoryScenario(s,e);logs.push(...e.rewardNotes);return logs;}
 if(s.heroHp<=0){
  // A loss is not a reward cooldown. Persist a separate bounded automatic retry
  // delay so reload/offline never creates a boss-death loop; manual challenges remain available.
  if(e.boss&&!e.developmentFixture&&(e.automaticBoss||s.expedition?.autoBoss)){s.autoBossRetryAt??={};s.autoBossRetryAt[e.instanceId]=Math.max(now,s.lastHealthClock??0)+1800000;}
  const resume=!e.developmentFixture&&!!s.running&&(!e.boss||e.automaticBoss||!!s.expedition?.autoBoss)&&!s.stopAfterBattle&&!s.stopAfterDungeon&&(e.kind!=='dungeon'||!!s.expedition?.loop||!!s.expedition?.autoDungeon||!!s.expedition?.autoBoss);startRest(s,now,resume);s.stopAfterBattle=false;s.stopAfterDungeon=false;}return logs;
}
function selectedTreeRules(s,parameters=getRaceTuning(s.race)){
 const p=s.skillTree?.presets?.[s.skillTree.selectedPreset];if(!p)return null;
 const weapon=s.inventory.find(it=>it.id===s.equip.weapon),configs=typeof parameters.configs==='function'?parameters.configs(stats(s)):parameters.configs;
 return {...parameters,configs,active:[...p.active],conditions:[...p.conditions],unlocked:[...p.unlocked],passive:[...p.passive],weaponType:weapon?.weaponType??'generic'};
}
export function step(s,e,now=Date.now()){if((s?.otherworld?.active||e?.otherworld||e?.enemies?.some(u=>u.otherworldActor!==undefined||u.parameterSetId==='otherworld-v081'))&&!validSave(s))return [];if(storyScenarioMode(e)==='tool')return [];if(s?.version!==SCHEMA_VERSION||s.skillTree?.mode!=='active'||!e||(!e.developmentFixture&&e.skillResolver!=='tree-v1'))return [];const living=new Set(e===s.activeEncounter&&!e.done&&e.npcObjectiveReceipt?e.enemies.filter(u=>u.hp>0).map(u=>u.id):[]);const result=stepImpl(s,e,now,e?.skillResolver==='tree-v1'&&s.skillTree?.mode==='active'?selectedTreeRules(s):null);if(living.size)recordNpcObjectiveDefeats(s,e,living);return result;}
export function gainXp(s,n){return applyExperience(s,n);}
export function enhanceEquipment(s,quote,random=Math.random){const result=attemptEnhancement(s,quote,random);if(result)capHealth(s);return result;}
export function luckChance(points){return ordinarySecondRollProbability(points)??0;}
function luckyRoll(draw,points){const first=draw();if(points>0&&Math.random()<luckChance(points))return Math.max(first,draw());return first;}
function forgeLuckyRoll(draw,points,race){const first=draw(),chance=combinedFavorableRollChance(luckChance(points),race,DWARF_FORGE_FAVOR_CONFIG);if(chance===null)throw new Error('Invalid forge benefit policy');if(chance>0&&Math.random()<chance)return Math.max(first,draw());return first;}
function rollQuality(weights=[65,28,6.5,.5]){return Number(weighted(weights.map((w,i)=>[i,w])));}
function rollDrop(s,boss,luck=0,instanceId=resolveLegacySite(s.location).id+'-field',clear=false,lootSummary=emptyLootSummary(),chanceOverride,encounter){
 const instance=INSTANCES[instanceId],area=AREAS[instance?.areaId];if(!instance||!area)return null;
 const dungeon=instance.kind==='dungeon';if(Math.random()>=lootOccurrenceProbability(chanceOverride??(boss?.65:clear?.35:.18),luck))return null;
 const dropSlots=SLOTS.filter(k=>k!=='core'||area.race==='ashen'),slot=dropSlots[rand(0,dropSlots.length-1)],set=null,quality=luckyRoll(()=>rollQuality(boss?[50,35,13,2]:dungeon?[55,34,10,1]:[65,28,6.5,.5]),luck);
 const rolled=rollDropEquipmentLevel(areaGearLevel(instanceId),area.levelRange);let it=item(slot,rolled.level,set,quality,{...rolled,luck,originRace:area.race});
 // Count generated gear before quality filters/capacity; only actual ordinary dungeon encounters.
 if(encounter?.kind==='dungeon'&&!encounter.otherworld&&eligibleSetSource({source:'drop',kind:'dungeon',areaNumber:area.number,race:area.race,clear:true})){
  const p=normalizeRareRewardProgress(s);
  if(p.dungeonDryStreak===RARE_REWARD_RULES.dungeonPity-1){
   const selected=rollSourceSet({source:'drop',kind:'dungeon',areaNumber:area.number,race:area.race,clear:true,luck,guaranteed:true});
   it=item(selected.slot,rolled.level,selected.set,selected.rarity,{...rolled,luck,originRace:area.race});p.dungeonDryStreak=0;p.pendingSets.push(it);
   claimPendingRareRewards(s);captureBattleLoot(s,{kind:'equipment',item:it},p.pendingSets.some(x=>x.id===it.id)?'pending':'received');encounter.rewardNotes.push((p.pendingSets.some(x=>x.id===it.id)?'套装待领取 · ':'套装 · ')+equipmentDisplayName(it));return null;
  }
  p.dungeonDryStreak++;
 }
 return receiveBattleLoot(s,{kind:'equipment',item:it},lootSummary)?it:null;
}
// Pending rewards retain the exact generated identity; quality filters never destroy them.
export function claimPendingRareRewards(s){
 if(!validRareRewardProgress(s,validEquipment)||!validCodexCollection(s)||!validConsumables(s))return null;
 const p=s.rareRewardProgress;if(!p)return {sets:0,fruit:0};
 let sets=0,fruit=0;const remain=[];
 for(const it of p.pendingSets){if(canReceiveEquipment(s,it)){s.inventory.push(it);recordCollectedEquipment(s,it);sets++;}else remain.push(it);}
 p.pendingSets=remain;
 const quantity=Math.min(p.pendingFruit,1e9-(s.consumables?.memoryFruit??0));
 if(quantity>0&&canReceiveItem(s,'memoryFruit',quantity)){normalizeTalents(s);s.consumables.memoryFruit+=quantity;p.pendingFruit-=quantity;fruit=quantity;}
 return {sets,fruit};
}
export const ELF_FRUIT_DROP_RATES=Object.freeze({field:.005,dungeon:.01,boss:.02});
export function wisdomFruitDropProbability(regionRace,kind,luck=0){return regionRace==='elf'&&Object.hasOwn(ELF_FRUIT_DROP_RATES,kind)?lootOccurrenceProbability(ELF_FRUIT_DROP_RATES[kind],luck):0;}
function settleRareClearRewards(s,e,clear){
 const area=AREAS[e.areaId];if(!area||e.otherworld)return;
 const p=normalizeRareRewardProgress(s),args={source:'drop',kind:e.kind,areaNumber:area.number,race:area.race,clear,luck:e.luck??0};
 let generated=null;
 if(eligibleSetSource(args)){
  const rolled=rollSourceSet(args);
  if(rolled){const lv=rollDropEquipmentLevel(areaGearLevel(e.instanceId),area.levelRange);generated=item(rolled.slot,lv.level,rolled.set,rolled.rarity,{...lv,luck:e.luck??0,originRace:area.race});p.pendingSets.push(generated);if(clear)p.dungeonDryStreak=0;}
 }
 // One specialty roll per won real elf-region encounter, not player race or clears.
 const chance=wisdomFruitDropProbability(area.race,e.kind,e.luck??0);
 const fruits=chance>0&&Math.random()<chance?1:0;
 p.pendingFruit+=fruits;
 const claimed=claimPendingRareRewards(s);
 if(generated)captureBattleLoot(s,{kind:'equipment',item:generated},p.pendingSets.some(it=>it.id===generated.id)?'pending':'received');
 if(fruits)captureBattleLoot(s,{kind:'consumable',key:'memoryFruit',quantity:fruits},claimed.fruit>=fruits?'received':'pending');
 if(generated)e.rewardNotes.push((p.pendingSets.some(it=>it.id===generated.id)?'套装待领取 · ':'套装 · ')+generated.name);
 if(fruits)e.rewardNotes.push('灵慧之果 '+(claimed.fruit>=fruits?'已入包':'待领取')+' ×'+fruits);
}
export function reward(s,e,now=Date.now()){
 if(!validLootHistory(s)||!e||e.rewarded)return null;
 const beforeGold=s.gold,area=AREAS[e.areaId],node=INSTANCES[e.instanceId];
 beginLootReceipt(s);let completed=false;
 try{const result=rewardWithoutHistory(s,e,now);completed=true;return result;}finally{
  finishLootReceipt(s,{id:e.id,at:Math.trunc(now),mode:e.otherworld?'otherworld':e.kind,node:node?.name??e.instanceId??'异界高塔',region:e.otherworld?'异界':area?.name??e.areaId??s.race,floor:e.otherworld?.floor??0,stage:e.dungeonStage??0,gold:Math.max(0,s.gold-beforeGold),xp:e.acceptedXp??0},completed&&e.rewarded===true);
 }
}
function rewardWithoutHistory(s,e,now=Date.now()){
 if(e?.otherworld)return rewardOtherworld(s,e,now);
 if(s.version!==SCHEMA_VERSION||!e||e.multiVersion!==1||e.storyScenario)return null;
 if(e.contentVersion==='dwarf-m2-v1'&&PLANNED_INSTANCES[e.instanceId]){
  const owned=s.activeEncounter===e,wasRewarded=e.rewarded,result=rewardDwarf(s,e,now);
  if(owned&&!wasRewarded&&e.rewarded&&!nodeAccess(s,e.instanceId,now).allowed){s.running=false;s.restResume=false;s.dungeonRun=null;s.stopAfterBattle=false;s.stopAfterDungeon=false;}
  return result;
 }
 if(e.developmentFixture===true)return rewardMulti(s,e,now);
 return null;
}
export function offline(s,now=Date.now()){
 if(s?.version!==SCHEMA_VERSION||!validLootHistory(s)||!validOtherworldState(s,validEquipment)||!validExpeditionState(s)||!validRareRewardProgress(s,validEquipment))return null;
 if(!Number.isFinite(now)||now<0||now>1e15)return null;
 const start=Math.max(s.lastSeen,s.lastHealthClock??s.lastSeen),end=Math.min(now,start+4*3600000),beforeGold=s.gold,beforeXp=totalEarnedXp(s);
 if(!normalizeHealth(s,start)||!normalizeMaterials(s)||!normalizePotions(s))return null;
 const worldEvents=advanceRandomWorldEvents(s,now);if(!worldEvents)return null;
 const beforeMaterials=new Map(materialEntries(s).map(x=>[x.key,x.count]));let time=start,kills=0,rests=0,rounds=0;const lootSummary=emptyLootSummary();
 // Do not spin on an unclaimed saturated reward queue after a reload.
 if(!s.otherworld?.active&&rareRewardStorageBlocked(s)){s.running=false;s.chronicle.unshift('珍稀待领奖励已满：远征暂停，请清理背包并领取后继续。');}
 if(s.otherworld?.active&&s.otherworld.pendingEquipment.length>OTHERWORLD_PENDING_LIMIT-2){s.running=false;s.restResume=false;s.chronicle.unshift('异界待领取装备已满：已暂停，请领取后继续。');}
 // Real combat turns, bounded to four hours. Camp waits jump to their deadline.
 withWarReplay(s,()=>withNpcObjectiveReplay(s,()=>{while(time<end&&s.running){
  if(s.restUntil>0){if(s.restUntil>end)break;time=Math.max(time,s.restUntil);settleRest(s,time);if(!s.running)break;continue;}
  if(s.nextBattleAt>time){time=Math.min(end,s.nextBattleAt);if(time>=end)break;}
  let e=s.activeEncounter;
  if(e?.done){if(e.win&&!e.rewarded){reward(s,e,time);if(!e.rewarded){s.running=false;s.restResume=false;break;}mergeLootSummary(lootSummary,e.lootSummary);kills++;}else s.activeEncounter=null;continue;}
  if(!e){e=startRoutedEncounter(s,time);if(!e){if(s.restUntil>0){rests++;continue;}break;}}
  const turnAt=Math.max(time,s.nextActionAt??(time+1100));if(turnAt>end)break;time=turnAt;
  const wasResting=s.restUntil>0;step(s,e,time);rounds++;if(!wasResting&&s.restUntil>0)rests++;
  if(e.done&&e.win){reward(s,e,time);if(!e.rewarded){s.running=false;s.restResume=false;break;}mergeLootSummary(lootSummary,e.lootSummary);kills++;}
  if(rounds>26200)break; // At most one delayed-basic micro-event per regular 1.1s round within 4h.
 }
 }));
 pruneRandomWarHistory(s,now);
 // Time beyond the reward cap may finish rest/expire buffs, never grants extra kills.
 settleRest(s,Math.max(now,start));s.lastSeen=Math.max(now,start);
 const materialLoot=materialEntries(s).map(x=>({...x,count:x.count-(beforeMaterials.get(x.key)??0)})).filter(x=>x.count>0),mat=materialLoot.reduce((n,x)=>n+x.count,0);
 const xp=totalEarnedXp(s)-beforeXp,gold=s.gold-beforeGold;
 if(now<=start)return null;
 s.chronicle.unshift('离线实战：完成'+kills+'场胜利，休息'+rests+'次，获得'+gold+'金币与'+mat+'份材料。');for(const action of ['discarded','overflow']){const n=Object.values(lootSummary[action]).reduce((a,b)=>a+b,0);if(n)s.chronicle.unshift((action==='discarded'?'离线品质过滤丢弃':'离线背包已满未收取')+'：装备'+lootSummary[action].equipment+'／材料'+lootSummary[action].materials+'／物品'+lootSummary[action].items);}s.chronicle=s.chronicle.slice(0,20);
 return {minutes:Math.floor(Math.max(0,end-start)/60000),gold,xp,mat,materialLoot,lootSummary,kills,rests,rounds,capped:now-start>4*3600000,worldEvents};
}
export const MATERIALS={
 ...POTION_IMPORT_MATERIALS,
 ...Object.fromEntries(Object.entries(DWARF_MATERIAL_REGISTRY).filter(([key])=>!['铁屑','炉火晶','誓约残片','灰根草'].includes(key)).map(([key,meta])=>[key,{...meta,price:meta.merchantBasePrice??0,merchantEnabled:meta.merchantAllowed===true}])),
 '铁屑':{icon:'iron',tags:['金属'],description:'旧驿道散落的铁料，融合时偏向厚重装备；不产出套装。',origin:'失落驿道',price:4},
 '炉火晶':{icon:'fire',tags:['火焰'],description:'矿炉余热凝成的晶体，融合时偏向饰品；不产出套装。',origin:'熄火矿井',price:7},
 '灰根草':{icon:'herb',tags:['草药'],functionalTags:['recoveryBase'],description:'黑炉荒野生长的耐寒草药，使随机融合更容易产出药剂。',origin:'黑炉诸地',price:5},
 '誓约残片':{icon:'soul',tags:['灵魂'],description:'旧誓遗物的碎片，融合时偏向饰品；不产出套装。',origin:'旧誓墓园',price:10}
};
export const MATERIAL_QUALITIES=['普通','稀有','优良','至臻'];
export function materialKey(material,quality=0){return Object.hasOwn(MATERIALS,material)&&Number.isInteger(quality)&&quality>=0&&quality<=3&&(!MATERIALS[material].qualityRange||MATERIALS[material].qualityRange.includes(quality))?`${material}|${quality}`:null;}
export function parseMaterialKey(value){
 if(typeof value!=='string')return null;
 if(Object.hasOwn(MATERIALS,value))return {material:value,quality:0,key:materialKey(value,0)};
 const parts=value.split('|');if(parts.length!==2||!['0','1','2','3'].includes(parts[1]))return null;
 const key=materialKey(parts[0],Number(parts[1]));return key?{material:parts[0],quality:Number(parts[1]),key}:null;
}
function validMaterials(s){
 const count=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e12;
 if(s.materialStacks!==undefined)return s.materials===undefined&&s.materialStacks&&typeof s.materialStacks==='object'&&!Array.isArray(s.materialStacks)&&Object.entries(s.materialStacks).every(([k,n])=>parseMaterialKey(k)?.key===k&&count(n));
 return s.materials&&typeof s.materials==='object'&&!Array.isArray(s.materials)&&Object.keys(s.materials).every(k=>Object.hasOwn(MATERIALS,k))&&['铁屑','炉火晶','誓约残片'].every(k=>count(s.materials[k]))&&count(s.materials['灰根草']??0);
}
export function normalizeMaterials(s){
 if(!validMaterials(s))return false;
 if(s.materialStacks===undefined){s.materialStacks=Object.fromEntries(Object.entries(s.materials).map(([kind,n])=>[materialKey(kind),n]));delete s.materials;}
 return true;
}
export function materialCount(s,material,quality=0){const key=materialKey(material,quality);if(!key)return 0;return s.materialStacks!==undefined?(s.materialStacks[key]??0):(quality===0?s.materials?.[material]??0:0);}
export function materialEntries(s){return Object.keys(MATERIALS).flatMap(material=>[0,1,2,3].map(quality=>({key:materialKey(material,quality),material,quality,count:materialCount(s,material,quality)}))).filter(row=>row.count>0);}
export const MERCHANT_QUALITY_MULTIPLIERS=Object.freeze([1,1.5,2.5,4]);
export const MERCHANT_PRICING_VERSION=2;
export function materialPrice(material,quality=0){return materialKey(material,quality)?Math.ceil(MATERIALS[material].price*MERCHANT_QUALITY_MULTIPLIERS[quality]):null;}
// Keep the ordinary-quality price unchanged; quality scales the whole level price.
export function merchantEquipmentPrice(it){
 if(!it||!Number.isSafeInteger(it.level)||it.level<1||!Number.isInteger(it.rarity)||it.rarity<0||it.rarity>3)return null;
 const price=Math.ceil((23+Math.floor(it.level/3)*4+it.level*3)*MERCHANT_QUALITY_MULTIPLIERS[it.rarity]);
 return Number.isSafeInteger(price)?price:null;
}
function addMaterial(s,material,quality,count){const key=materialKey(material,quality),before=s.materialStacks[key]??0,added=Math.max(0,Math.min(count,1e12-before));s.materialStacks[key]=before+added;if(added>0)recordMaterialDiscovered(s,material);return added;}
function captureBattleLoot(s,loot,outcome){
 const parsed=loot.kind==='material'?parseMaterialKey(loot.key):loot.kind==='potion'?parsePotionKey(loot.key):null;
 const name=loot.kind==='equipment'?loot.item?.name:loot.kind==='material'?(MATERIALS[parsed?.material]?.name??parsed?.material):loot.kind==='potion'?POTIONS[parsed?.type]?.name:CONSUMABLES[loot.key]?.name;
 captureLoot(s,{kind:loot.kind,name,quality:loot.kind==='equipment'?(loot.item?.legendaryId?4:loot.item?.rarity):parsed?.quality??0,quantity:loot.quantity??1,level:loot.kind==='equipment'?loot.item?.level:0,outcome});
}
export function receiveBattleLoot(s,loot,summary=emptyLootSummary()){
 const category=loot?.kind==='equipment'?'equipment':loot?.kind==='material'?'materials':'items',discarded=summary.discarded[category],overflow=summary.overflow[category];
 const result=receiveBattleLootWithoutHistory(s,loot,summary);
 if(result||summary.discarded[category]>discarded||summary.overflow[category]>overflow)captureBattleLoot(s,loot,result?'received':summary.discarded[category]>discarded?'filtered':'overflow');
 return result;
}
function receiveBattleLootWithoutHistory(s,loot,summary=emptyLootSummary()){
 if(!validMonsterLedger(s)||!validCodexCollection(s)||!loot||!['equipment','material','consumable','potion'].includes(loot.kind))return false;
 const qty=loot.quantity??1;if(!Number.isSafeInteger(qty)||qty<1)return false;
 const category=loot.kind==='equipment'?'equipment':loot.kind==='material'?'materials':'items';
 const quality=loot.kind==='equipment'?(loot.item?.legendaryId?4:loot.item?.rarity):loot.kind==='material'?parseMaterialKey(loot.key)?.quality:loot.kind==='potion'?parsePotionKey(loot.key)?.quality:undefined;
 if(!(loot.kind==='equipment'&&(loot.item?.locked||isProtected(s,loot.item?.id)))&&shouldDiscardLoot(s,category,quality)){summary.discarded[category]+=qty;return false;}
 if(loot.kind==='equipment'){if(!validEquipment(loot.item)||s.inventory.some(it=>it.id===loot.item.id))return false;if(qty!==1||!canReceiveEquipment(s,loot.item)){summary.overflow.equipment+=qty;return false;}s.inventory.push(loot.item);recordCollectedEquipment(s,loot.item);return true;}
 if(loot.kind==='material'){const parsed=parseMaterialKey(loot.key);if(!parsed)return false;normalizeMaterials(s);if(!canReceiveMaterial(s,parsed.key,qty)){summary.overflow.materials+=qty;return false;}addMaterial(s,parsed.material,parsed.quality,qty);return true;}
 if(loot.kind==='consumable'){if(!Object.hasOwn(CONSUMABLES,loot.key))return false;normalizeTalents(s);if(!canReceiveItem(s,loot.key,qty)){summary.overflow.items+=qty;return false;}s.consumables[loot.key]=(s.consumables[loot.key]??0)+qty;return true;}
 if(loot.kind==='potion'){const parsed=parsePotionKey(loot.key);if(!parsed||!normalizePotions(s))return false;if(!canReceiveItem(s,parsed.key,qty)){summary.overflow.items+=qty;return false;}s.potionStacks[parsed.key]=(s.potionStacks[parsed.key]??0)+qty;return true;}
 return false;
}
function validPendingForgeClaim(s){
 const p=s.pendingForgeClaim;if(p===undefined||p===null)return true;
 if(!p||typeof p!=='object'||Array.isArray(p))return false;
 if(p.kind==='equipment')return validEquipment(p.item)&&!s.inventory?.some(it=>it.id===p.item.id)&&!s.merchant?.offers?.some(o=>o.type==='equipment'&&o.stock===1&&o.item?.id===p.item.id);
 if(p.kind==='potion'){const r=p.potion,parsed=parsePotionKey(r?.key);return !!parsed&&r?.kind==='potion'&&(r.quantity===undefined||(Number.isInteger(r.quantity)&&r.quantity>=1&&r.quantity<=999))&&parsed.type===r.potionType&&parsed.quality===r.quality&&r.name===POTIONS[r.potionType]?.name;}
 return false;
}
export function claimForgeResult(s){
 const p=s.pendingForgeClaim;if(!p||!validCodexCollection(s)||!validPendingForgeClaim(s))return null;
 if(p.kind==='equipment'){if(!canReceiveEquipment(s,p.item))return null;s.inventory.push(p.item);recordCollectedEquipment(s,p.item);s.pendingForgeClaim=null;return p.item;}
 const r=p.potion,quantity=r.quantity??1;if(!validPotions(s)||!canReceiveItem(s,r.key,quantity))return null;normalizePotions(s);s.potionStacks[r.key]=(s.potionStacks[r.key]??0)+quantity;s.pendingForgeClaim=null;return {...r,quantity};
}
function earnedMaterials(s,material,count,boss=false,luck=0,weights=null,summary=emptyLootSummary()){
 normalizeMaterials(s);const loot=[];
 for(let i=0;i<count;i++){const quality=luckyRoll(()=>rollQuality(weights??(boss?[65,28,6.5,.5]:[80,17,2.8,.2])),luck);const added=receiveBattleLoot(s,{kind:'material',key:materialKey(material,quality),quality,quantity:1},summary);if(!added)continue;const entry=loot.find(x=>x.quality===quality);if(entry)entry.count++;else loot.push({key:materialKey(material,quality),material,quality,count:1});}
 return loot;
}
export const MERCHANT_STOCK={...Object.fromEntries(Object.entries(MATERIALS).map(([key,m])=>[key,m.stock??(m.rarity==='珍奇'?[1,2]:m.rarity==='少见'?[2,5]:[4,8])])),...Object.fromEntries(Object.entries(POTION_IMPORT_MATERIALS).map(([key,m])=>[key,m.stock])), '铁屑':[6,12],'炉火晶':[3,7],'誓约残片':[2,5],'灰根草':[4,8],'dwarf.blackvein_ore':[6,12],'dwarf.rock_lizard_sinew':[3,7]};
export function merchantMaterialKeys(){return Object.keys(MATERIALS).filter(k=>MATERIALS[k].merchantEnabled!==false&&!EXPANSION_PACKS.some(p=>p.materialAliases?.[k]));}
export const MERCHANT_CYCLE_MS=30*60*1000;
function validEquipment(i){try{const num=(n,max=1e12)=>Number.isFinite(n)&&n>=0&&n<=max;return Number.isSafeInteger(i.level)&&i.level>=1&&Number.isSafeInteger(i.baseLevel)&&i.baseLevel>=1&&(i.legendaryId||(typeof i.templateId==='string'&&typeof i.baseBudgetModel==='string'))&&validItemBudgetMetadata(i)&&(!i.legendaryId||validLegendaryEquipmentMetadata(i,AFFIX_DEFS))&&validEquipmentTemplateMetadata(i)&&validEnhancementMetadata(i)&&validEquipmentLevelMetadata(i)&&typeof i.id==='string'&&typeof i.name==='string'&&SLOTS.includes(i.slot)&&Number.isInteger(i.rarity)&&i.rarity>=0&&i.rarity<=3&&(!i.set||(BUILD.some(b=>b.id===i.set)&&SET_SLOTS.includes(i.slot)&&i.rarity===3))&&num(i.atk)&&num(i.hp)&&num(i.armor)&&num(i.level)&&i.bless===0&&Array.isArray(i.affixes)&&(i.rarity===0?i.affixes.length<=1:i.affixes.length===(LEGENDARY_EQUIPMENT_DEFINITIONS[i.legendaryId]?.ordinaryAffixCount??i.rarity+1))&&new Set(i.affixes.map(a=>a.stat)).size===i.affixes.length&&i.affixes.every(a=>(a.sourceRange!==undefined&&validAffixSource(a,AFFIX_DEFS)))&&(!i.special||(!i.set&&i.rarity>=2&&Object.hasOwn(SPECIALS,i.special.id)&&validGrowthSpecial(i.special)))&&(i.legendaryId===null||LEGENDARY_CODEX.some(def=>def.id===i.legendaryId&&def.implemented&&def.slot===i.slot&&!i.set))&&(i.divine===undefined||(i.divine?.id==='forge-favor'&&i.divine.name==='神赐·炉火眷顾'&&i.divine.model==='raw-v1'&&['atk','armor','hp'].every(k=>num(i.divine.bonus?.[k]))));}catch{return false;}}
function validMerchant(merchant,s=null){
 if(!merchant||merchant.version!==1||(merchant.pricingVersion!==undefined&&merchant.pricingVersion!==MERCHANT_PRICING_VERSION)||!Number.isFinite(merchant.generatedAt)||merchant.generatedAt<0||merchant.generatedAt>1e15||!Array.isArray(merchant.offers))return false;
 const rows=merchant.offers;
 const materialValid=o=>Object.hasOwn(MATERIALS,o.material)&&Object.hasOwn(MERCHANT_STOCK,o.material)&&Number.isInteger(o.quality??0)&&(o.quality??0)>=0&&(o.quality??0)<=3&&o.price===racialGoldCost(s,materialPrice(o.material,o.quality??0))&&Number.isInteger(o.stock)&&o.stock>=0&&o.stock<=MERCHANT_STOCK[o.material][1];
 {
  if(rows.length!==8||new Set(rows.map(o=>o?.offerId)).size!==8||!rows.every(o=>o&&typeof o.offerId==='string'))return false;
  const mats=rows.filter(o=>o.type==='material'),gear=rows.filter(o=>o.type==='equipment'),consumables=rows.filter(o=>o.type==='consumable'),recipes=rows.filter(o=>o.type==='recipe');
  if(mats.length<2||mats.length>3||mats.length+gear.length+consumables.length+recipes.length!==8||recipes.length>3||new Set(recipes.map(o=>o.recipeId)).size!==recipes.length||!recipes.every(o=>Object.hasOwn(RECIPES,o.recipeId)&&RECIPES[o.recipeId].enabled&&o.price===racialGoldCost(s,RECIPES[o.recipeId].price)&&Number.isSafeInteger(o.price)&&o.price>0&&[0,1].includes(o.stock))||consumables.length>2||new Set(consumables.map(o=>o.consumable)).size!==consumables.length||!consumables.every(o=>Object.hasOwn({memoryFruit:200,reforgeToken:120},o.consumable)&&o.price===racialGoldCost(s,({memoryFruit:200,reforgeToken:120})[o.consumable])&&[0,1].includes(o.stock))||new Set(mats.map(o=>o.material)).size!==mats.length||!mats.every(materialValid))return false;
  if(!gear.every(o=>validEquipment(o.item)&&!o.item.divine&&o.item.legendaryId===null&&[0,1].includes(o.stock)&&o.price===racialGoldCost(s,merchant.pricingVersion===MERCHANT_PRICING_VERSION?merchantEquipmentPrice(o.item):15+sellValue(o.item)*4+o.item.level*3))||new Set(gear.map(o=>o.item.id)).size!==gear.length)return false;
 }
 if(['cycleStart','nextRefreshAt','paidRefreshes','revision'].some(k=>merchant[k]===undefined))return false;
 return Number.isFinite(merchant.cycleStart)&&merchant.cycleStart>=0&&merchant.cycleStart<=1e15&&merchant.nextRefreshAt===merchant.cycleStart+MERCHANT_CYCLE_MS&&Number.isSafeInteger(merchant.paidRefreshes)&&merchant.paidRefreshes>=0&&merchant.paidRefreshes<=1e9&&Number.isSafeInteger(merchant.revision)&&merchant.revision>=0;
}
function rollMerchantOffers(s,revision){
 const [minGearLevel,maxGearLevel]=getMerchantEquipmentLevelRange(s);
 const pool=merchantMaterialKeys(),offers=[],count=rand(2,3);
 for(let i=0;i<count;i++){const material=weighted(pool.map(key=>[key,MATERIALS[key].weight??1]));pool.splice(pool.indexOf(material),1);const [min,max]=MERCHANT_STOCK[material];const quality=rollQuality([75,20,4.5,.5]);offers.push({type:'material',material,quality,price:materialPrice(material,quality),stock:rand(min,max)});}
 while(offers.length<8){const originRace=PLAYABLE_RACES[rand(0,PLAYABLE_RACES.length-1)],available=SLOTS.filter(slot=>slot!=='core'||originRace==='ashen'),slot=available[rand(0,available.length-1)],it=item(slot,rand(minGearLevel,maxGearLevel),null,rollQuality(),{levelSource:'merchant',originRace});offers.push({type:'equipment',item:it,price:merchantEquipmentPrice(it),stock:1});}
 // Permanent-power fruit is a regional battle specialty, no longer merchant stock.
 if(Math.random()<.10){const index=offers.findLastIndex(o=>o.type==='equipment');offers[index]={type:'consumable',consumable:'reforgeToken',price:120,stock:1};}
 const unknown=Object.keys(RECIPES).filter(id=>id!=='potion-healing'&&RECIPES[id].enabled&&!recipeKnown(s,id));
 if(unknown.length){const count=Math.min(unknown.length,rand(1,2));for(let i=0;i<count;i++){const id=unknown.splice(rand(0,unknown.length-1),1)[0],index=offers.findLastIndex(o=>o.type==='equipment');if(index>=0)offers[index]={type:'recipe',recipeId:id,price:RECIPES[id].price,stock:1};}}
 return offers.map((offer,index)=>({...offer,price:racialGoldCost(s,offer.price),offerId:`merchant-${revision}-${index}`}));
}
export function ensureMerchant(s,now=Date.now()){
 if(!validRecipes(s)||!normalizeAreaProgress(s))return null;
 if(!Number.isFinite(now)||now<0||now>1e15)return null;
 if(s.merchant===undefined){normalizeRecipes(s);s.merchant={version:1,pricingVersion:MERCHANT_PRICING_VERSION,offers:rollMerchantOffers(s,0),generatedAt:now,cycleStart:now,nextRefreshAt:now+MERCHANT_CYCLE_MS,paidRefreshes:0,revision:0};return s.merchant;}
 if(!validMerchant(s.merchant,s))return null;
 normalizeRecipes(s);const m=s.merchant;
 // Accept old saves, but never transact an old-price quote. Reprice only: no RNG,
 // stock resets, item mutations, timer changes, or changes to already-owned gear.
 if(m.pricingVersion!==MERCHANT_PRICING_VERSION){
  if(!Number.isSafeInteger(m.revision+1))return null;
  for(const offer of m.offers)if(offer.type==='equipment')offer.price=racialGoldCost(s,merchantEquipmentPrice(offer.item));
  m.pricingVersion=MERCHANT_PRICING_VERSION;m.revision++;
 }
 for(const offer of m.offers)if(offer.type==='material'||!offer.type)offer.quality??=0;
 if(now>=m.nextRefreshAt){
  const skipped=Math.floor((now-m.cycleStart)/MERCHANT_CYCLE_MS);
  m.cycleStart+=skipped*MERCHANT_CYCLE_MS;m.nextRefreshAt=m.cycleStart+MERCHANT_CYCLE_MS;
  m.revision++;m.offers=rollMerchantOffers(s,m.revision);m.generatedAt=now;m.paidRefreshes=0;
 }
 return m;
}
export function getMerchantRefreshCost(s){const n=s.merchant?.paidRefreshes??0;return racialGoldCost(s,20+10*n);}
export function paidRefreshMerchant(s,now=Date.now(),expectedRevision){
 const m=ensureMerchant(s,now);
 if(!m||!Number.isSafeInteger(expectedRevision)||m.revision!==expectedRevision||m.paidRefreshes>=1e9)return false;
 const cost=getMerchantRefreshCost(s);if(!Number.isFinite(s.gold)||s.gold<cost)return false;
 const offers=rollMerchantOffers(s,m.revision+1);s.gold-=cost;m.offers=offers;m.paidRefreshes++;m.revision++;m.generatedAt=now;return true;
}
export function buyMaterial(s,stackKey,qty,expectedRevision,now=Date.now()){
 const parsed=parseMaterialKey(stackKey);if(!Number.isSafeInteger(qty)||qty<=0||!parsed||!validMaterials(s))return false;
 const {material,quality}=parsed,m=ensureMerchant(s,now);if(!m||(expectedRevision!==undefined&&m.revision!==expectedRevision))return false;
 const offer=m.offers.find(o=>o.type==='material'&&o.material===material&&(o.quality??0)===quality);
 if(!offer||qty>offer.stock||!Number.isFinite(s.gold)||s.gold<offer.price*qty||!canReceiveMaterial(s,parsed.key,qty))return false;
 normalizeMaterials(s);s.gold-=offer.price*qty;addMaterial(s,material,quality,qty);offer.stock-=qty;return true;
}
export function purchaseEquipment(s,offerId,expectedRevision,now=Date.now()){
 const m=ensureMerchant(s,now);if(!m||!Number.isSafeInteger(expectedRevision)||m.revision!==expectedRevision)return false;
 const offer=m.offers.find(o=>o.type==='equipment'&&o.offerId===offerId);
 if(!validCodexCollection(s)||!isMerchantEquipmentSellable(offer)||offer.stock!==1||!canReceiveEquipment(s,offer.item)||!Number.isFinite(s.gold)||s.gold<offer.price||s.inventory.some(it=>it.id===offer.item.id))return false;
 s.gold-=offer.price;offer.stock=0;s.inventory.push(offer.item);recordCollectedEquipment(s,offer.item);return true;
}
export function purchaseConsumable(s,offerId,expectedRevision,now=Date.now()){
 const m=ensureMerchant(s,now);if(!m||!Number.isSafeInteger(expectedRevision)||m.revision!==expectedRevision)return false;
 const offer=m.offers.find(o=>o.type==='consumable'&&o.offerId===offerId);
 if(!offer||offer.stock!==1||offer.consumable!=='reforgeToken'||!validTalents(s)||!validConsumables(s)||!Number.isFinite(s.gold)||s.gold<offer.price||!canReceiveItem(s,offer.consumable,1))return false;
 normalizeTalents(s);s.gold-=offer.price;offer.stock=0;s.consumables[offer.consumable]++;return true;
}
export function purchaseRecipe(s,offerId,expectedRevision,now=Date.now()){
 if(!validRecipes(s))return false;const merchant=ensureMerchant(s,now);if(!merchant||!Number.isSafeInteger(expectedRevision)||merchant.revision!==expectedRevision)return false;
 const offer=merchant.offers.find(o=>o.type==='recipe'&&o.offerId===offerId);
 if(!offer||offer.recipeId==='potion-healing'||offer.stock!==1||recipeKnown(s,offer.recipeId)||!Number.isFinite(s.gold)||s.gold<offer.price)return false;
 if(!learnRecipe(s,offer.recipeId))return false;s.gold-=offer.price;offer.stock=0;return true;
}
export function fusionQualityWeights(selection){
 if(!Array.isArray(selection)||selection.length<1||selection.length>5)return null;const parsed=selection.map(parseMaterialKey);if(parsed.some(x=>!x))return null;
 return materialFusionQualityWeights(parsed.map(x=>x.quality));
}
export const FUSION_TAGS={
 '铁屑':{slots:{weapon:2,helm:1,armor:2,gloves:1,boots:1,ring:0,amulet:0}},
 '炉火晶':{slots:{weapon:1,helm:0,armor:0,gloves:1,boots:0,ring:2,amulet:2}},
 '灰根草':{slots:{weapon:0,helm:0,armor:0,gloves:0,boots:0,ring:0,amulet:0}},
 '誓约残片':{slots:{weapon:0,helm:1,armor:0,gloves:0,boots:1,ring:2,amulet:2}}
};
export function fusionWeights(selection){const slots=Object.fromEntries(SLOTS.map(k=>[k,2]));for(const key of selection){const parsed=parseMaterialKey(key),tag=parsed?(FUSION_TAGS[parsed.material]??{slots:materialFusionSlotBias(MATERIALS[parsed.material])}):null;if(!tag?.slots)continue;for(const slot of SLOTS)slots[slot]+=tag.slots[slot]??0;}return {slots};}
// Preview is read-only; share weights and favorable-roll policy with the actual draw.
export function previewMaterialFusion(s,selection){
 if(hasInfinityGauntletMaterial(selection)){const exact=isInfinityGauntletFusion(selection),crafted=!!s.infinityGauntlet?.crafted;return {kind:'infinity-gauntlet',complete:exact,crafted,blocked:!exact||crafted,gold:racialGoldCost(s,40)};}
 const weights=fusionQualityWeights(selection);if(!weights)return null;
 const parsed=selection.map(parseMaterialKey),chance=combinedFavorableRollChance(luckChance(effectiveLuck(s)),s.race,DWARF_FORGE_FAVOR_CONFIG);
 const qualityProbabilities=favorableQualityProbabilities(weights,chance);if(!qualityProbabilities)return null;
 const herbs=parsed.filter(p=>p.material==='灰根草').length,potionChance=herbs?.35+.5*herbs/selection.length:0;
 const slots=fusionWeights(selection).slots,eligible=Object.entries(slots).filter(([slot])=>slot!=='core'||s.race==='ashen'),total=eligible.reduce((sum,[,w])=>sum+w,0);
 return {qualityProbabilities,baseQualityProbabilities:weights.map(w=>w/100),minimumQuality:weights.findIndex(w=>w>0),potionChance,equipmentChance:1-potionChance,slotProbabilities:Object.fromEntries(eligible.map(([slot,w])=>[slot,w/total])),gold:racialGoldCost(s,40)};
}
export function eligibleFusionEquipment(s){
 return s.inventory.filter(it=>validEquipment(it)&&!it.locked&&!Object.values(s.equip).includes(it.id)&&!isProtected(s,it.id));
}
export function forge(s,selection){
 if(hasInfinityGauntletMaterial(selection)){
  if(!isInfinityGauntletFusion(selection)||!validSave(s)||s.developmentEquipmentSandbox||s.infinityGauntlet?.crafted||s.pendingForgeClaim||s.running||s.activeEncounter&&!s.activeEncounter.done||!Number.isFinite(s.gold)||s.gold<racialGoldCost(s,40)||INFINITY_GAUNTLET_KEYS.some(key=>{const p=parseMaterialKey(key);return materialCount(s,p.material,p.quality)<1;}))return null;
  const level=rollMaterialFusionLevel(s.level),it=level&&legendaryItem('infinity-gauntlet',level.level,level);if(!it)return null;
  normalizeMaterials(s);for(const key of INFINITY_GAUNTLET_KEYS)s.materialStacks[key]--;s.gold-=racialGoldCost(s,40);
  s.infinityGauntlet??={version:1,recipeLearned:true,crafted:false,craftedItemId:null};s.infinityGauntlet.crafted=true;s.infinityGauntlet.craftedItemId=it.id;
  if(canReceiveEquipment(s,it)){s.inventory.push(it);recordCollectedEquipment(s,it);}else s.pendingForgeClaim={kind:'equipment',item:it};return it;
 }
 if(!validCodexCollection(s)||!Array.isArray(selection)||selection.length<1||selection.length>5||!Number.isFinite(s.gold)||s.gold<racialGoldCost(s,40)||s.pendingForgeClaim||!validMaterials(s))return null;
 const counts={},parsed=[],gear=[],ids=new Set(),inputs=[],materials=[],eligible=new Map(eligibleFusionEquipment(s).map(it=>[it.id,it]));
 for(const input of selection){
  if(typeof input==='string'){const entry=parseMaterialKey(input);if(!entry)return null;parsed.push(entry);materials.push(entry.key);inputs.push({kind:'material',quality:entry.quality});counts[entry.key]=(counts[entry.key]||0)+1;}
  else{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==2||input.kind!=='equipment'||typeof input.id!=='string'||ids.has(input.id)||!eligible.has(input.id))return null;const it=eligible.get(input.id);ids.add(it.id);gear.push(it);inputs.push({kind:'equipment',quality:it.rarity});}
 }
 if(parsed.some(({material,quality,key})=>materialCount(s,material,quality)<counts[key]))return null;
 if(gear.length&&!fusionOriginWeights({heroRace:s.race,equipment:gear}))return null;
 const n=selection.length,qualityWeights=gear.length?null:fusionQualityWeights(materials),herbs=parsed.filter(p=>p.material==='灰根草').length;
 if(!gear.length&&herbs&&!validPotions(s))return null;
 if(!gear.length&&herbs&&Math.random()<.35+.5*herbs/n){
  const quality=forgeLuckyRoll(()=>rollQuality(qualityWeights),effectiveLuck(s),s.race),type=weighted([['healing',60],['strength',25],['fireResist',15]]),key=potionKey(type,quality);
  normalizeMaterials(s);normalizePotions(s);Object.entries(counts).forEach(([key,v])=>s.materialStacks[key]-=v);s.gold-=racialGoldCost(s,40);
  const result={kind:'potion',potionType:type,quality,name:POTIONS[type].name,quantity:1,key};
  if(canReceiveItem(s,key))s.potionStacks[key]=(s.potionStacks[key]??0)+1;else s.pendingForgeClaim={kind:'potion',potion:result};return result;
 }
 const originRace=chooseFusionOrigin({heroRace:s.race,equipment:gear});if(originRace===null)return null;
 const weights=fusionWeights(materials),slot=weighted(Object.entries(weights.slots).filter(([slot])=>slot!=='core'||originRace==='ashen')),quality=gear.some(it=>it.legendaryId)?3:forgeLuckyRoll(()=>gear.length?rollEquipmentInputQuality(inputs):rollQuality(qualityWeights),effectiveLuck(s),s.race);
 const level=gear.length?rollEquipmentFusionLevel(gear):rollMaterialFusionLevel(s.level);
 const it=item(slot,level.level,null,quality,{...level,originRace,luck:effectiveLuck(s),forgeRace:s.race});if(Math.random()<dwarfDivineChance(divineProbability(fusionDivineChance(inputs),effectiveLuck(s)),s.race,DWARF_FORGE_FAVOR_CONFIG))applyForgeFavor(it);
 // Record actual owned inputs before their one-time consumption.
 if(gear.length)normalizeCodexCollection(s);
 normalizeMaterials(s);Object.entries(counts).forEach(([key,v])=>s.materialStacks[key]-=v);s.inventory=s.inventory.filter(it=>!ids.has(it.id));s.gold-=racialGoldCost(s,40);
 if(canReceiveEquipment(s,it)){s.inventory.push(it);recordCollectedEquipment(s,it);}else s.pendingForgeClaim={kind:'equipment',item:it};return it;
}
export function applyForgeFavor(it){
 if(it.divine)return false;
 // Raw bases and raw rolls stay unchanged. Bonus is presentation metadata only;
 // aggregation uses the marker once, with fractional gains preserved until totals.
 const bonus={};for(const key of ['atk','armor','hp'])bonus[key]=it[key]/10;
 bonus.affixes=it.affixes.map(a=>({stat:a.stat,value:a.value/10}));
 it.divine={id:'forge-favor',name:'神赐·炉火眷顾',model:'raw-v1',bonus};return true;
}
export const LEGENDARY_CODEX=[{id:'infinity-gauntlet',name:'无限手套',slot:'gloves',icon:'gloves',implemented:true,lore:'五颗异色宝石被嵌进同一只护手，托座上还留着五种不同的锻造痕迹。握紧手掌时，原本互不相容的微光沿着指节相连，短暂地汇成一道亮线。',affix:'无限',effect:'每成功释放5次主动技能，对当前目标造成其最大生命50%的伤害；普通敌人与首领比例相同。普攻、被动与多段命中不额外计数，卸下清空累计。',acquisition:'在熔炉融合中放入五族至臻宝石各1颗，固定获得；无需配方。每档仅一次，失去后无法重造。',attributes:'4条可调整普通词条与固定专属'},{id:'return-ring',name:'归途之环',slot:'ring',icon:'ring',implemented:true,lore:'五件旧物沿着指环内侧相接，接缝没有被磨平。每一道细小的棱角，都让人想起送出它的人，以及那段曾停下脚步的路。',affix:'归途',effect:'装备时经验获取 +20%，双戒指槽不重复叠加，卸下后失效。每次战斗胜利恢复15%最大生命，最高恢复至生命上限，包含普通副本阶段胜利。首领传说、稀有材料与无限宝石的有效掉落率增加3个百分点；不改变来源和持有上限。',acquisition:'剧情学习配方后，以五族旧物制作；每档仅一次。',attributes:'4条可洗练普通词条与固定专属'},...EXPANSION_PACKS.flatMap(p=>p.legendaries.map(d=>({...d,implemented:true,lore:d.lore??d.description??'',affix:d.exclusiveName??d.exclusiveId,effect:d.exclusiveDescription??d.exclusive?.description??d.effect??d.description??'',acquisition:d.questOnly?'第五章主线剧情（唯一）':p.name+'地区首领额外掉落，可重复获得',attributes:d.ordinaryAffixCount===0?'仅基础属性与固定专属，无随机普通词条':'4条随机普通词条与固定专属',icon:d.icon??d.slot}))),{id:'first-forge-oathhammer',name:'王统·初炉誓锤',slot:'weapon',icon:'firstforge',implemented:true,lore:'每一代矮人王继承此锤时，都会重新锻造它，并刻下自己的名字。旧王的誓言留在锤身，新王的名字融入炉火。',affix:'祖王回响',effect:'普攻或主动伤害技能每5次出手，向当前目标追加140%攻击的单体重击，穿透30%护甲。',acquisition:'矮人地区首领额外掉落，可重复获得。',attributes:'4条随机普通词条与固定专属；基础和普通词条区间高于同等级至臻。',tuning:'回响可暴击、实际生命伤害可吸血，不触发死神、多重或累计。'},{id:'everburning-reactor',name:'不熄之炉',slot:'amulet',icon:'fire',implemented:true,lore:'这座微型炉藏在厚实的金属外壳里，贴近耳边时，能听见极轻的鼓风声。炉芯收拢战斗留下的余热，再从狭窄的排口吐出火光；火光散去后，仍有一层温热护在身前。',affix:'余热循环',effect:'每12秒实际战斗时间自动向全体释放75%攻击火焰脉冲，并获得8%最大生命加通用护盾增幅的护盾，持续3秒战斗时间；同源护盾刷新不叠加。',acquisition:'矮人地区首领额外掉落，可重复获得。',attributes:'4条随机普通词条与固定专属；基础和普通词条区间高于同等级至臻。',tuning:'实际卸下清空充能并移除自身护盾。'},LUCKY_DICE_CODEX];
export const SET_CODEX=BUILD.map(b=>({id:b.id,name:b.name,icon:b.id,parts:[...SET_SLOTS],bonus:b.bonus,effects:b.effects}));
function validCodexCollection(s){return validCollectionLedger(s,SET_CODEX,LEGENDARY_CODEX);}
export function normalizeCodexCollection(s){return normalizeCollectionLedger(s,SET_CODEX,LEGENDARY_CODEX,validEquipment);}
export function recordCollectedEquipment(s,it){
 const owned=s.inventory?.find(candidate=>candidate.id===it?.id);if(!owned||!validEquipment(owned)||!normalizeCodexCollection(s))return false;
 return addOwnedCollection(s.codexCollection,owned,SET_CODEX,LEGENDARY_CODEX);
}
export function codexSetState(s,id){
 const entry=SET_CODEX.find(x=>x.id===id);if(!entry)return null;
 const parts=validCodexCollection(s)?[...(s.codexCollection?.sets[id]??[])]:[];
 return {discovered:parts.length>0,parts,complete:parts.length===entry.parts.length};
}
export function codexState(s,id){
 const entry=LEGENDARY_CODEX.find(x=>x.id===id);if(!entry)return null;
 if(!entry.implemented)return {collected:false,status:'设计预览 · 未收集'};
 const collected=validCodexCollection(s)&&s.codexCollection?.legendaries.includes(id)===true;
 return {collected,status:collected?'已收集':'未收集'};
}
export function validSave(s){
 try{const num=(n,max=1e12)=>Number.isFinite(n)&&n>=0&&n<=max;
 if(!validCasinoState(s)||!validOtherworldState(s,validEquipment)||!validBossChallengeState(s)||!validDungeonLootReceipts(s)||!validLootHistory(s)||!validPersonalArcRewardState(s)||!validTaskRewardState(s)||!validDiplomacy(s)||!validWorldEventState(s)||!validStoryWarState(s)||!validNpcEventState(s)||!validReturnRingState(s)||!validInfinityGauntletState(s)||!validStoryEventState(s)||!validStoryScenarioState(s))return false;
 if(!validSkillTree(s,getSkillTreeDefinition(s))||s.skillTree?.mode!=='active')return false;
 if(s.activeEncounter?.skillResolver!==undefined&&(s.activeEncounter.skillResolver!=='tree-v1'||s.skillTree?.mode!=='active'||s.activeEncounter.multiVersion!==1))return false;
 if(s.supportGrantEligible!==undefined||s.testGrants!==undefined||s.bonusTalentPoints!==undefined||s.skillRulesVersion!==undefined||s.skillAccess!==undefined)return false;
 if(s.developmentEquipmentSandbox!==undefined&&s.developmentEquipmentSandbox!==true)return false;
 if(s.version!==SCHEMA_VERSION||!PLAYABLE_RACES.includes(s.race)||s.hero!==getRacePack(s.race)?.heroName||!Number.isInteger(s.level)||s.level<1||s.level>=100000||!num(s.xp)||!num(s.gold)||!Number.isInteger(s.location)||s.location<0||!(Object.values(PLANNED_INSTANCES).some(x=>AREAS[x.areaId].number-1===s.location&&s.siteId===x.siteId)))return false;
 if(s.atCamp!==undefined&&typeof s.atCamp!=='boolean')return false;
 if(s.activeEncounter?.pauseAt!==undefined&&s.running)return false;
 if(s.activeEncounter?.kind==='dungeon'&&(!s.dungeonRun||s.activeEncounter.runId!==s.dungeonRun.runId||s.activeEncounter.dungeonStage!==s.dungeonRun.stage||s.dungeonRun.affixUsage!==undefined&&(s.activeEncounter.affixState?.nirvanaUsed!==s.dungeonRun.affixUsage.nirvanaUsed||s.activeEncounter.shelterUsed!==s.dungeonRun.affixUsage.shelterUsed)))return false;
 if(s.contentMigration!==undefined)return false;
 if(s.activeEncounter&&(s.activeEncounter.multiVersion!==1||(!s.activeEncounter.developmentFixture&&(s.activeEncounter.contentVersion!=='dwarf-m2-v1'||s.activeEncounter.skillResolver!=='tree-v1'))))return false;
 if(!validRareRewardProgress(s,validEquipment)||!validRegionNavigation(s)||!validEquipmentRuntime(s)||!validMonsterLedger(s)||!validCodexCollection(s)||!validLootFilters(s)||!validPendingForgeClaim(s)||!validAreaProgress(s)||!validExpeditionState(s)||!Array.isArray(s.inventory)||s.inventory.length>INVENTORY_SAVE_LIMIT||!s.inventory.every(validEquipment)||s.inventory.filter(i=>i.legendaryId==='ashen-primal-core').length>1||!validPendingReforge(s))return false;
 if(s.merchant?.offers?.some(o=>o.type==='equipment'&&o.stock===1&&s.inventory.some(it=>it.id===o.item?.id)))return false;
 if((s.nextActionAt!==undefined&&(!Number.isFinite(s.nextActionAt)||s.nextActionAt<0||s.nextActionAt>1e15))||(s.restResume!==undefined&&typeof s.restResume!=='boolean')||(s.nextBattleAt!==undefined&&(!Number.isFinite(s.nextBattleAt)||s.nextBattleAt<0||s.nextBattleAt>1e15))||!validRecipes(s)||!validEncounter(s.activeEncounter)||!validPotions(s)||!validHealth(s)||!validLoadoutSlots(s)||(s.merchant!==undefined&&!validMerchant(s.merchant,s)))return false;
 if(new Set(s.inventory.map(i=>i.id)).size!==s.inventory.length||!s.equip||Object.keys(s.equip).length!==raceSockets(s.race).length||!raceSockets(s.race).every(k=>s.equip[k]===null||s.inventory.some(i=>i.id===s.equip[k]&&i.slot===SOCKET_TYPE[k])))return false;
 const equipped=Object.values(s.equip).filter(Boolean);if(new Set(equipped).size!==equipped.length)return false;
 return validSkillSlots(s.skills,s.conditions)&&s.skills.every(k=>k===null||skillUnlocked(s,k))&&validMaterials(s)&&(s.offlineLuck===undefined||num(s.offlineLuck,1000))&&validTalents(s)&&validConsumables(s)&&['bossWins','bossReady','normalWins'].every(k=>Array.isArray(s[k])&&s[k].length===3&&s[k].every(n=>num(n,1e15)))&&Array.isArray(s.chapters)&&s.chapters.every(n=>Number.isInteger(n)&&n>=0&&n<3)&&Array.isArray(s.chronicle)&&s.chronicle.length<=100&&s.chronicle.every(t=>typeof t==='string'&&t.length<2000)&&num(s.kills)&&num(s.stock,3)&&num(s.lastSeen,1e15)&&[0,1].includes(s.momentum)&&typeof s.running==='boolean';
 }catch{return false;}
}





// Unique crafted identities keep their permanent manufacturing ledger after loss.
export function isUniqueCraftedEquipment(it){return ['return-ring','infinity-gauntlet'].includes(it?.legendaryId);}
export function disposeEquipment(s,id,action){
 if(!['sell','discard'].includes(action)||!validSave(s))return null;
 const it=s.inventory.find(it=>it.id===id);
 if(!it||it.locked||Object.values(s.equip).includes(id)||isProtected(s,id)||action==='discard'&&!isUniqueCraftedEquipment(it))return null;
 const gold=action==='sell'?sellValue(it):0;
 if(!Number.isFinite(s.gold+gold)||s.gold+gold>1e12||!normalizeCodexCollection(s))return null;
 s.inventory=s.inventory.filter(it=>it.id!==id);s.gold+=gold;
 return {id,action,gold};
}
function batchSaleEligible(s,it,slot,qualities){
 return !isUniqueCraftedEquipment(it)&&it.slot===slot&&qualities.includes(it.legendaryId?4:it.rarity)&&!it.locked&&!Object.values(s.equip).includes(it.id)&&!isProtected(s,it.id);
}
export function quoteBatchSale(s,slot,qualities){
 if(!validBatchSelection(slot,qualities,SLOTS)||!validSave(s))return null;
 const entries=s.inventory.filter(it=>batchSaleEligible(s,it,slot,qualities)).map(it=>({id:it.id,fingerprint:equipmentFingerprint(it),value:sellValue(it)}));
 const quote={version:1,slot,qualities:[...qualities].sort((a,b)=>a-b),entries,count:entries.length,total:entries.reduce((n,e)=>n+e.value,0)};
 return validBatchQuote(quote,SLOTS)?quote:null;
}
export function executeBatchSale(s,quote){
 if(!validBatchQuote(quote,SLOTS)||quote.count===0||!validSave(s)||s.gold+quote.total>1e12||!Number.isFinite(s.gold+quote.total))return null;
 for(const entry of quote.entries){const it=s.inventory.find(x=>x.id===entry.id);if(!it||!batchSaleEligible(s,it,quote.slot,quote.qualities)||sellValue(it)!==entry.value||equipmentFingerprint(it)!==entry.fingerprint)return null;}
 // Capture current-held legacy history only after the entire quote passes.
 if(!normalizeCodexCollection(s))return null;
 const ids=quote.entries.map(e=>e.id),sold=new Set(ids);s.inventory=s.inventory.filter(it=>!sold.has(it.id));s.gold+=quote.total;
 return {ok:true,ids,count:quote.count,total:quote.total,gold:quote.total};
}
