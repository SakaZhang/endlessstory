// Root-reviewed first-release tuning after the finite actual-host matrix; not a claim of final global balance.
// No level input: skill ratios never rank up.
export const VERSION='dwarf-active-balance-test-v1';
export const STATUS='reviewed-initial-v036';
export const PERIODIC={burnTickMs:2000,bleedTickMs:2000,healingTickMs:2000};
export const POISON_CANDIDATE={fractionPerLayer:.02,immutablePercent:true,globalDamageMultiplierApplies:false,maxStacks:5,tickIntervalMs:3000,layerLifetimeMs:9000,shieldPolicy:'absorb-shield-before-hp',status:'reviewed-initial-timing'};
export const SETS={anvilTwoBonus:.20,anvilAxeExtraBonus:.60,anvilHammerConditionBonus:.75,anvilGenericBonus:.25,runeBurnBonus:.30,runeConsumeBonus:.70,runeGenericBonus:.30,runeBurnChanceBonus:.25,guardSkillShieldBonus:.25,guardShieldedBonus:.60,guardGenericBonus:.25,guardAxeDefenseBonus:.50};
export function skillConfigs(st){
 if(!st||!['atk','hp','armor'].every(k=>Number.isFinite(st[k])&&st[k]>=0)||st.hp<=0)throw new TypeError('finite nonnegative atk/armor and positive hp required');
 const A=st.atk,H=st.hp,D=st.armor;
 // Flat amounts are snapshotted from equipment/talent + equipped passive stats, excluding temporary skill buffs, never prior skill buffs.
 return {
 fracture_strike:{cooldownMs:4400,genericCoefficient:1.40,axeCoefficients:[.65,.90],hammerCoefficient:1.40,armorBreak:{amount:.18*A,durationMs:6600,timing:'after-hit'}},
 fault_sweep:{cooldownMs:7700,coefficient:.80,bleedPower:.10*A,attackDown:.12*A,durationMs:6000},
 breach_followup:{cooldownMs:6600,coefficient:1.60,extraCoefficient:.75,brokenBonus:.65},
 anvil_cry:{cooldownMs:13200,attackUp:.18*A,critUp:8,penetrationUp:.15*A,durationMs:6600},
 breaking_intercept:{cooldownMs:8800,coefficient:1.15,attackUp:.15*A,durationMs:1650},
 ember_brand:{cooldownMs:5500,coefficient:.85,burnPower:.13*A,durationMs:6000,axeDurationBonus:2000,fireResistDown:12},
 furnace_wave:{cooldownMs:7700,coefficient:.85,burnBonus:.75,burnPower:.13*A,burnChance:.45,durationMs:6000},
 cinder_barrage:{cooldownMs:7700,coefficient:.75,burnBonus:.60},
 furnace_etch:{cooldownMs:9900,armorDown:.20*A,fireResistDown:16,durationMs:6600,axeDurationMs:8800,hammerDurationMs:4400,hammerMultiplier:1.40},
 scatter_ash:{cooldownMs:11000,hitDown:10,armorDown:.14*A,durationMs:5500,poisonChance:.45},
 iron_vigil:{cooldownMs:13200,shield:.18*H,hammerMultiplier:1.35,durationMs:6600},
 bastion_blow:{cooldownMs:6600,coefficient:1.10,defenseCoefficient:.60,defenseContributionCap:.60*A,shieldBonus:.50,defenseUp:.20*D,durationMs:4400},
 repelling_wave:{cooldownMs:14300,coefficient:.50,durationMs:1100,hammerDurationBonus:550,dodgeUp:8},
 forge_breath:{cooldownMs:16500,heal:.14*H+(st.healingBonus??0),healingPower:.02*H,durationMs:6000,lifestealUp:8},
 purifying_bulwark:{cooldownMs:13200,shield:.10*H,durationMs:4400,attackUp:.12*A}
 };
}
export const HOST_CONTRACT={
 directCoefficients:'multiply host ATK then existing physical/elemental/crit resolver; do not add independent damage engine',
 flatSnapshot:'derive once from equipment/talent + equipped passive stats, excluding temporary skill buffs at cast; no level growth and no recursive self-amplification',
 rawAttributes:['attackUp','attackDown','armorDown','defenseUp','penetrationUp'],
 ratings:['critUp','dodgeUp','hitDown','fireResistDown','lifestealUp'],
 ratingWarning:'must use existing rating conversions, NOT +8 probability or +800%; host unit verification required before activation',
 periodic:'burn/bleed/HOT amount is raw per 2000ms tick; host adds tickIntervalMs, uses existing damage/heal resolver',
 counterCoefficient:.50,
 passives:'all six directions approved and wired; only the equipped two apply',
 poison:'axe scatter_ash uses time-based 2% maxHP layers, shield first, no global or elemental scaling',
 sets:'initial reviewed parameters; source kind skill versus equipment remains mandatory'
};
// New approved hit-down/dodge effects need an explicit rating mapping because old enemies always hit.
// Candidate applies once per direct enemy hit, not DOT/reflection. No new equipment affix is introduced.
export function enemyDirectHitChance({hitDown=0,dodgeUp=0}={}){
 if(![hitDown,dodgeUp].every(x=>Number.isFinite(x)&&x>=0))throw new TypeError('nonnegative ratings');
 const r=hitDown+dodgeUp;if(!Number.isFinite(r))throw new RangeError('rating overflow');
 return 1-.5*r/(100+r);
}
// All six directions approved; these magnitudes remain test candidates. Equipped two only.
export const PASSIVES={
 axe_fervor:{weapon:'axe',damageMultiplier:1.12,armorMultiplier:.90,excludeDamageKinds:['poison-percent-max-hp']},
 hammer_penetration:{weapon:'hammer',physicalPenetrationPerBaseAtk:.15},
 fire_affinity:{firePowerRating:16,fireResistanceRating:16},
 shield_reserve:{armorMultiplier:1.15,requiresAnyValidPositiveShield:true},
 mountain_vitality:{maxHpMultiplier:1.12,receivedHealingMultiplier:1.12,include:['skill','healOverTime','lifesteal','potion'],exclude:['shield']},
 forged_resilience:{negativeDurationMultiplier:.80,minimumPositive:true}
};
// Integration candidate: explicit schema, not an external mutable runtime file.
export const TREE_TUNING={
 configs:base=>{const all=skillConfigs(base);all.scatter_ash.poisonTiming={tickIntervalMs:3000,layerDurationMs:9000,maxLayers:5,refreshPolicy:'earliest-expiry',schedule:'per-layer',expiryTick:'inclusive'};return all;},
 counterCoefficient:HOST_CONTRACT.counterCoefficient,attributeConfig:{dodgeCap:.5},periodic:PERIODIC,passiveConfig:PASSIVES,setConfig:SETS,
 controlPolicy:{diminishingFactors:[1,.5,.25],recoveryWindow:6600,minDuration:550,refreshMode:'max'},
};
