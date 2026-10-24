# Same-race truthful neutral appearance

Base: eb787ec85bb226cb14ce1a35482070d1b1471898. No gameplay or save changes.

`native-contact.png` shows each race's two unchanged native weapon idle frames, then neutral idle, strike, hurt and death at native 192×192 resolution. All neutral sprites use anchor [96,176]. Three new four-state sheets were generated using the built-in imagegen tool, not programmatically painted. Deterministic canvas extraction crops each 2×2 cell to meaningful alpha (>32) bounds, preserves alpha inside that crop, nearest-neighbor scales to the original race's living silhouette height, and places the feet at baseline 176. Each frame records exact nonzero-alpha extrema plus independently measured solid (>128) bounds. Tiny near-transparent outskirts beyond the meaningful crop are excluded to prevent false size/foot alignment. The sheet originals are retained here.

Ashen uses its existing armguard idle/strike/hurt/death PNGs unchanged: visually inspected, these show the same mineral body, orange core, teal drape and empty gauntlet fists, no external held hammer or other weapon. Its neutral manifest has no weaponFamily. This is appearance fallback, not foreign-weapon-specific animation.

## Prompt set (built-in imagegen; transparent output)

All three edit prompts: preserve the attached existing character identity, exact approved clothing, chibi pixel style and facing. Remove all external held weapons. Produce a transparent 2×2 sheet of full-body idle with empty hands, forward empty-fist strike, hurt recoil and collapsed death. Equal square cells with wide separation, consistent character size; no text, borders, ground, shadows or extra props. No sword, shield, bow, arrow, staff or dagger.

- Human reference: `dist/races/human/assets/hero-idle-0.png`. Preserve orange-brown hair, silver steel pauldrons and greaves, navy/gold tunic, belt, red cape and right-facing stance. Remove sword AND shield.
- Elf reference: `dist/races/elf/assets/hero-bow-0.png`. Preserve short mint-silver hair, pointed ears, youthful face, white/gold/green robe, brown boots, gold shoulders, green sash and right-facing stance. Remove bow, arrows and quiver.
- Goblin reference: `dist/races/goblin/assets/hero-dagger-0.png`. Preserve green face/long ears, ragged brown hood and bone ornaments, patched leather, belt, boots, backpack and trinkets; left-facing stance. Remove dagger and any external held weapon.

## Evidence boundary

`race-neutral-hero-tests.mjs` exercises actual valid saves, real E.step events and mock-canvas/loader routes. `race-art-alpha-bounds-tests.mjs` decodes all 1,108 unique racial PNGs and validates alpha bounds. This is NOT browser QA. Native weapons' original asset files are untouched. Legacy full generation-3 save fixture remains unavailable and is not fabricated.
