// Deliberately unapproved. The user asked for a reward design, not arbitrary
// amounts. Keep the six authored events gated until root supplies an approved
// fixed budget. This is not a user-controlled switch or a public claim endpoint.
export const CHIK_FAMILY_REWARD_POLICY=Object.freeze({
 id:'chik-family-rewards-v1',approved:false,status:'awaiting-user-approved-budget'
});
// Approved records must use existing receiveBattleLoot shapes only, e.g.
// ordinary material or potion rows. No callbacks, RNG, new item identities or
// rewards assembled from DOM values. All rows enter the existing atomic claim.
export const CHIK_FAMILY_EVENT_REWARDS=Object.freeze({});
