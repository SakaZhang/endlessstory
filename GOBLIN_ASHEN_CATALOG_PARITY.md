# Goblin and Ashen ordinary-equipment parity

Base: `7f6d9417a437551054e3d95ca43bd9a8204e8498`.

Scope: append missing ordinary identities only. No changes to stats budgets, sets, legendary mechanics, story core, skills, or old item/art identities.

| Race | Native weapons | Helm | Armor | Gloves | Boots | Ring | Amulet | Common total | Extra ordinary core | Set pieces |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Goblin | 8 dagger + 8 sword | 6 | 6 | 6 | 6 | 6 | 6 | 52 | 0 | 12 |
| Ashen | 8 armguard + 8 hammer | 6 | 6 | 6 | 6 | 6 | 6 | 52 | 3 | 12 |

Goblin additions: `goblin_scatter_weapon_7` through `_16`, plus `goblin_scatter_{helm,armor,gloves,boots,amulet}_6`.

Ashen additions: explicit `ashen.scatter.38` through `.55`. The original indexed scatter array remains intact; its three ordinary cores remain `.34`, `.35`, `.36`, and the previously appended sixth ring remains `.37`. These cores do not count toward the ordinary seven-slot total. Legendary cores remain separate.

## Regression checks

`npm run test:goblin-ashen` validates:

- Exact per-slot and per-native-family counts; set/core exceptions.
- Every original equipment object, set and legend against the pre-change snapshot.
- Unchanged ordinary/core variant allocations, original 64px art, skills and legendary/story modules.
- Unique Chinese identities, real distinct 64px PNG paths and bytes, and nonempty transparent silhouettes.
- Every ordinary template reachable by actual drop-item generation and actual forge outputs; all 33 additions reached by seeded trader refreshes.
- Item stats exactly match the existing budget adapter; no new stat allocation family.

The snapshot in `fixtures/goblin-ashen-equipment-before-parity.json` was materialized from the base commit before editing. The test uses production registry, renderer routing, item generator, forge and trader APIs rather than a duplicated candidate table.

This branch is local only; no publication or deployment is performed.
