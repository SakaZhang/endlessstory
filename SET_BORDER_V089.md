# v0.89 — single outer set frame

The user screenshot showed a green inventory tile outline plus the equipment PNG wrapper's inner green outline. This patch suppresses only the inner set-icon border when an existing equipment card supplies the outer frame. It covers the 17 current equipment container types and retained SVG fallbacks. A historical merchant nested icon-box also drops its redundant frame. Standalone set icons, ordinary and legendary borders, quality fills, selection/focus indicators, dimensions, item identities and all gameplay remain unchanged.

Validation:
- User-supplied image was materialized from Library and visually inspected.
- Production CSS and equipment renderers checked in the actual browser at 17 host contexts: green outer border, hidden inner set border, ordinary/standalone border unchanged, selected outline gold, retained SVG frame hidden, merchant inner box transparent.
- Actual app inventory and codex opened read-only; 16 displayed set icons in codex use a single outer container border. No import, equip, trade, progress or save data edits.
- Presentation, raster adapter/live App, all60 set names/legacy UI, enhancement/workshop, v088 set/divine tests and container source7 checks passed. This is a focused CSS regression, not a new full npm suite claim.
- Release cache graph and tamper checks run against the final build.
- Docker packaging files versioned only; no Docker login, image push or server update.
