# v0.81 洗练材料等级档位

## Scope / unchanged rules

The production call graph is `app.modifyView → generatePreparedReforge → engine.reforge`.
There is no separate active `showReforge` implementation. The equipment workshop module
is enhancement-only and intentionally unchanged. `value` was the only reforge mode
consuming iron. Its quantity remains 1 and its rarity/racial gold formula is unchanged.
`all` still consumes only one reforge token; `replace` still consumes only the selected
eligible donor. Enhancement, potions, fusion, drops and old inventories are unchanged.

## Verified repeatable dwarf sources

All rows use **ordinary q0 only**, category 常规. Source evidence is executable in
`reforge-material-tiers-v081-tests.mjs`: checks actual `DWARF_MATERIAL_SOURCE_POOLS`
regular channels, positive hit probability/entry weight/q0 probability, and catalog
nonunique/nonstory metadata. These are not inferred merely from catalog descriptions.

| Item level | Area | Material | Verified field monster IDs (dwarf prefix) |
|---|---|---|---|
| 1–10 | A1 山麓矿道 | 铁屑 | a01.normal.1/2/3 |
| 11–20 | A2 岩蜥支洞 | 铁屑 | a02.normal.2/3 |
| 21–30 | A3 旧矿与石牌遗址 | 黑脉矿 | a03.normal.1/3 |
| 31–40 | A4 废炉外坡 | 炉灰盐 | a04.normal.1/2/3 |
| 41–50 | A5 冷泉与炉区交界 | 炉火晶 | a05.normal.1/2 |
| 51–60 | A6 地下炉池 | 炉灰盐 | a06.normal.1/2/3 |
| 61–70 | A7 银纹矿廊 | 银丝矿 | a07.normal.1/3 |
| 71–80 | A8 深脉裂谷 | 黑曜薄片 | a08.normal.1/2 |
| 81–90 | A9 晶脉深层 | 霜纹石英 | a09.normal.1/2 |
| 91–100 and >100 | A10 地心锻造遗址 | 深脉岩脂 | a10.normal.1/2/3 |

A2 repeats iron because its actual metal resource is iron. A10 has no ordinary
metal ore: its repeatable mineral is deep seam oil. No invented ore, special nucleus,
gem, unique, quest resource or foreign-race material is substituted.

## API and paid-candidate compatibility

- `reforgeMaterialForLevel(level)` returns immutable-table-derived name/key, q0,
  quantity, tier, actual source node and source area name. Pure; >100 clamps tier10.
- `getReforgeCost` preserves its old shape and only replaces value-mode material key.
- `getReforgeQuote(s,itemId,mode,index,donorId)` is read-only and RNG-free. Includes
  exact target/donor snapshots, target level, cost, gold/consumable balances and
  material name, quality, need, owned and source.
- `reforge(..., expectedQuote)` revalidates the displayed quote before any RNG or
  debit. The optional argument preserves existing non-UI callers; all callers still
  validate current target/cost/q0 resources atomically before consumption.
- The app captures its displayed quote and passes it to execution. Existing
  persist-before-adopt storage transaction and frozen-result retry are preserved.
- New paid pending records use ruleVersion9 and targetLevel. Rules6–8 retain their
  historical iron price for validation; no retroactive payment or inventory rewrite.
- Accept/discard/reload never charge again; raw item remains unchanged until accept.

## Verification

`node reforge-material-tiers-v081-tests.mjs`: 115 cases across five races, all band
endpoints and 101/120/1000, each testing value/full/donor operations; exact q0/no rare
substitution; read-only quote; paid reload/accept/discard; legacy6/7/8; stale target and
insufficient materials/gold no debit; failed storage no adoption.

Also passed: pending-reforge, reforge (3,000 ops), reforge-ui (now Lv30/source label +
quota/reload), inheritance (6,000 draws), divine, same-type, same-slot, inheritance UI,
divine UI, token UI, integrated workshop UI, workshop UI, equipment-level, equipment-
level UI, equipment-budget-adapter (1–100 budget remains clamped; display/source
levels remain supported), equipment-enhancement.

`reforge-v13-tests` reaches an unrelated obsolete merchant-memoryFruit expectation;
reported to the owning fruit task, not changed here. No browser/server/commit/publish
performed by this task. Frozen v0.80 was not edited.
