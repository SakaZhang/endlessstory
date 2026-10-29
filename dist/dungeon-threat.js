// Encounter-context damage only. Shared regional monster tables also feed the
// low-consumption fields, so never multiply their definitions or saved actors.
export const DUNGEON_DAMAGE_MULTIPLIERS=Object.freeze({normal:6,elite:3});
export function dungeonDamageMultiplier(kind,rank){return kind==='dungeon'?(DUNGEON_DAMAGE_MULTIPLIERS[rank]??1):1;}
