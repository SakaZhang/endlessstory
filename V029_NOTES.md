# v0.29 — inherit donor ordinary-affix raw values

- Replacement consumes its selected eligible donor and randomly selects one eligible ordinary affix. Both type and raw number transfer unchanged; there is no target-range value roll or lucky value roll. One selection RNG draw remains.
- Donor base attributes, enhancement, divine status and special/unique effects do not transfer. The target retains identity, quality, base, enhancement and its own effects; its existing divine bonus derives once from the adopted raw value.
- Existing duplicate-type rules remain: all types already present on the target, including the selected slot, are excluded. A possible same-type replacement rule is still a separate discussion, not silently enabled here.
- New replacement candidates use pending ruleVersion3 with eligible raw-affix and selected-affix evidence. Historical paid rule2/legacy candidates remain valid and retain their previously rolled exact result, without a migration roll or second charge. Value reroll/full reforge and costs are unchanged.
- Donor UI previews show raw numbers and their existing roll colours, with clear divine transfer boundaries. Paid old/new choice remains; keeping old still consumes the sacrifice.

## Verification
- Seeded6000 selection: armor2005 / crit1929 / hp2066, exactly6000 RNG calls despite alternating luck.
- High-value donor into low-quality target, exact raw copy, divine once, protected/malformed donor rejection, stable reload and old paid candidate compatibility.
- Actual-app mock-DOM tests: initial-save failure preserves donor/resources/old target; accept-save failure preserves the exact pending choice and old combat stats; successful retries commit once. Navigation/reload/double clicks and retain/adopt covered.
- Production ordinary-affix ranges are currently shared across qualities; this patch does not invent stronger legendary ranges or implement legendary sources.
- Full log: /workspace/shared/v029-review/final-tests.txt. No real-browser UI pass.
