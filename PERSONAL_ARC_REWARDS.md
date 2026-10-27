# Personal arc reward transactions

Generation 6 is unchanged. `dist/personal-arc-rewards.js` is the sealed production service; all APIs are also exported by `engine.js`.

## Approved tiers

- Every non-final personal scene awards two existing Q0 healing potions, except the stage scenes below.
- Dwarf scene `.04`, human/elf/ashen `.03` award one existing reforge token instead. Goblin's six household moments retain their existing separate early-stage token; new continuation `.01`–`.03` award two Q0 healing potions each.
- A complete personal line awards exactly one ordinary Q3 non-set item, not legendary equipment. Available item-family choices are weapon, helm, armor, gloves, boots, ring and amulet, plus core for Ashen. Choices share the ordinary slot budgets, quality, four randomized affixes and normal special probability; no narrative branch has a stronger reward.
- The item level is the character's current level ±2, minimum 1, when its first claim reservation commits. Story acceptance/completion level does not determine it. The engine still accepts integer character levels 1–99999; reservations follow that current schema rather than inventing a migration/rejection at 100. Existing ordinary generation caps numeric budgets at level 100 while retaining displayed level/provenance. A reservation cannot exceed the current character level or have a timestamp later than the persisted save clock. Random ordinary templates determine base stat allocation using the existing equipment-budget model.

## UI contract

```js
const status = personalArcRewardStatus(game, arcId); // locked/ready/pending/claimed
const slots = personalArcRewardSlots(game);
const tx = claimPersonalArcReward(localStorage, game, arcId, chosenSlot, {now});
// Always preserve tx.game: even a failed grant may have committed its reservation.
// For stale-state / already-claimed, reload persisted current state instead of
// auto-saving this older snapshot. Persist outstanding gameplay BEFORE calling.
const small = claimPersonalEventReward(localStorage, game, eventId, {now});
```

`PERSONAL_ARC_REWARDS` provides race/finalSceneId/claimId. `PERSONAL_EVENT_REWARDS` provides event IDs, race, tier, claimId and fixed loot. The UI must not manufacture a registry, seed, item or completion flag. `validSave` checks final-scene provenance, pending item integrity and reward claim provenance against the real story controller's complete ordered history.

Full claims use three atomic storage boundaries:

1. Reserve `{slot,baseLevel,seed,reservedAt}`. No result is displayed if this write fails.
2. Deterministically create the ordinary item from the saved reservation and persist the full record **before capacity is checked**. If this write fails, reload reconstructs the exact same item.
3. Receive the saved item, update the normal collection ledger, remove the pending record and append the unique completion claim in one write. A full bag or failed write leaves the fixed result pending. Repeated clicks, reloads, level changes and changing slots cannot reroll it.

The caller's input is never mutated. Rewards bypass battle auto-discard without modifying its configuration. Forge pending claims are independent. Completion does not reserve an early level. Sold/discarded claimed rewards are never reissued. Unsafe/fractional/reversed timestamps are rejected before writes; live combat, dialogue, running/resting and dungeon runs block claims.

This follows the repository's synchronous localStorage current-snapshot precondition, not cross-tab compare-and-swap. The service does not claim multi-writer serialization. Unknown IDs perform no storage operations. A reservation write that fails has committed no claim and reveals no equipment result; there is no impossible guarantee of remembering a level across a failed durable write.
