# v0.80 首领挑战令

- Permanent shop purchase API: `buyBossChallengeToken(save, quantity=1)`; each item costs exactly 1000 gold for every race and adds three pooled usable charges.
- Inventory stack key: `consumables.bossChallengeCharges`; positive charges occupy one item-bag stack, independent of 1000-stack material capacity.
- Activation API: `useBossChallengeToken(save, quantity=1)`; each activation converts one charge into one persistent generic `extraBossChallenges` credit. Credits accumulate, do not expire, and occupy no bag slot.
- An unfinished encounter, including paused combat, blocks activation. At camp or in a region without a boss, banking credits is allowed. Activation never starts a battle, changes cooldowns, heals, or advances clocks.
- Both values are optional for compatible old saves (missing means zero), safe integers in 0..1,000,000,000. Invalid input is rejected, not truncated.
- Natural-ready boss starts are free. During natural success cooldown, a real enabled boss at the actual current site can consume one credit, after successful new encounter creation only. Active-fight reentry, reload, pause, rejected entry and repeated rendering do not consume credits.
- Existing progression, territory, rest, dungeon-continuation and battle-delay gates remain authoritative. Credits neither unlock maps nor permit remote cooldown bypass.
- Auto-boss uses banked credits during success cooldown at its normal battle boundary; explicit stop and dungeon carry remain authoritative. The independent 30-minute defeat retry guard is not bypassed. Manual retry remains governed by ordinary rest/success cooldown: no success cooldown means free.
- Successful bonus fights retain ordinary rewards and reset normal 30-minute success cooldown. Failed bonus fights spend the attempt but grant no success cooldown/reward.
- All purchase/activation callers must use clone-save-adopt persistence. A failed save must discard the draft; no live resource mutation should be adopted.
- Status API: `bossChallengeStatus(save)` returns `{charges, extraChallenges, items}`, where items is the number of three-use-equivalent partially remaining tokens (`ceil(charges / 3)`). Display charges directly to avoid ambiguity.
- Eligibility helper: `canUseExtraBossChallenge(save, instanceId)` describes credit/location/type eligibility only; callers must still apply regular access/rest/combat gates.

Regression: `node extra-boss-challenges-tests.mjs`.
