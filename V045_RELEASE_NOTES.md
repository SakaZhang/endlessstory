# v0.45 — A04 live pixel presentation

Based on the released schema-3 v0.44.2 generation. No save migration, stat, loot, timing or combat-resolution changes.

Adds the four A04 monster identities and two region layers to normal live presentation (17 / 44 monster IDs across A01–A04, plus A02 juvenile variant). Default physical attacks stay neutral; only exact approved fire skill IDs select fire-strike art. Real shield values retain blue HP-bar overlay; displayed damage keeps the small pixel type glyph after its number. Death takes precedence over retained attack movement/effects; committed event deltas remain unchanged.

All later regions still use the explicitly unsupported legacy presentation, not substitute species. A05–A10 asset preparation is not included. Resource content namespaces and schema-3 automatic retirement of old development keys remain intact. Tests use native canvas and actual App DOM fixtures, not a browser-session claim.
