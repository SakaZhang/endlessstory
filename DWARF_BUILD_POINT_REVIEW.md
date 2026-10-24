# Dwarf point review: early usable vs complete flexible hybrid

Do not call 36 points a level45 minimum. Level1=0; level30=29; level45=44; level51=50. Unlocking unused nodes never increases an equipped skill's damage or rank. All presets still choose4 active and2 passive; species innate remains separate.

## Cheap focused candidates (not proven globally optimal)

Exact transitive prerequisites included:
- Axe steel: fault_sweep / breach_followup / anvil_cry / forge_breath; axe_fervor + mountain_vitality: **20pts**.
- Hammer steel: fracture_strike / breach_followup / ore_rally / forge_breath; hammer_penetration + mountain_vitality: **24pts**.
- Fire: ember_brand / furnace_etch / cinder_barrage / forge_breath; fire_affinity + ember_temper: **21pts**.
- Guard: iron_vigil / bastion_blow / purifying_bulwark / forge_breath; shield_reserve + mountain_vitality: **20pts**.

These are early viable focused kits. No artificial point gate or unrelated mandatory chain has been added to delay them.

## Representative progression allocations

|Points / earned level|Newly allocated choices|Total available choices|Example equipped4+2|
|---|---|---|---|
|29 / Lv30|steel six active path (fracture,fault,intercept,breach,ore,crag), axe_fervor, mountain_vitality, forge_breath|7A /2P|fracture,crag,ore,forge; axe_fervor,mountain|
|44 / Lv45|+iron_vigil,repelling_wave,bastion_blow,shield_reserve,anvil_cry|11A /3P|iron,bastion,repel,forge; shield_reserve,mountain|
|50 / Lv51|+purifying_bulwark,forged_resilience|12A /4P|purify,iron,bastion,forge; resilience,mountain|

At44 the same allocation can choose the early steel offense kit, swap to shield-conditioned guard, add all-target control, or use the common attack buff. At50 it can additionally swap into two-debuff hammer cleanse and shorter negative durations. The extra points buy real tactical alternatives—not six automatically equipped actives, hidden stats, or mandatory filler.

## Actual production-host finite evidence

`TREE_HOST_ROOT=<integrator checkout> node dwarf-build-choice-tests.mjs`:
- Each allocation validates at exactly29/44/50 points against the expanded definition; choices7/11/12 active and2/3/4 passive.
-29pt axe fracture executes actual two independent hits via multi-combat.
-44pt guard fixture uses **one** guard set context, not impossible stacked sets. With guard4 vs no set and otherwise identical build: surviving shield155.75 vs95 after the tested enemy actions; shield-conditioned bastion actualHP damage250 vs220.
-50pt hammer cleanse clears actual burn and weakness in the first action; the44pt selected guard kit does not cleanse them.
-Same equipped early kit with29 vs50 unlocked allocation deals identical damage/cast count, proving unused purchases are not stealth power ranks.

This is deterministic scenario evidence, not a global best-build search or a full game-progression balance claim. Costs remain99 total. No player allocation reset or deployment was performed.
