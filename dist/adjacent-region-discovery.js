// Pure proposal only: caller owns persistence and authoritative acquisition events.
export function backfillDiscoveries(previous, acquiredRows, resolveId) {
  const discovered = Object.fromEntries(Object.entries(previous?.discovered ?? {}).filter(([id, yes]) => yes === true && resolveId(id) === id));
  for (const row of acquiredRows ?? []) {
    if (!Number.isSafeInteger(row.count) || row.count <= 0) continue;
    const id = resolveId(row.material);
    if (id) discovered[id] = true;
  }
  return {version: 1, discovered};
}
export const isDiscovered = (ledger, id) => ledger?.discovered?.[id] === true;
export function discoveredMaterials(ledger, sourceIds, catalog) {
  return [...new Set(sourceIds)].filter(id => isDiscovered(ledger,id) && Object.hasOwn(catalog,id)).map(id => ({id, name:catalog[id].name,icon:catalog[id].icon}));
}
