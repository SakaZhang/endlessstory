# Background footing repair

Built-in imagegen precise-object edits (not CSS or vector scenery):
- A03: preserve amber mushroom cavern; raise rocky earth floor to support the hero at baseline.
- A06: preserve cyan cavern/water village; add detailed continuous plank causeway across lower battle band.
- A09: preserve purple chasm and distant rope bridges; replace diagonal foreground with broad lateral stone/timber deck.
- A10: preserve blue root cavern and amber tree architecture; add continuous root-inlaid stone ledge.

All prompts specified a seamless 16:9 pixel-art scene, no characters/text/UI/borders; solid ground at 75–86% image height, for 203px normal and 227px front-row feet in a 270px frame. Source outputs are recorded in asset-build.py. Packaged nearest-neighbour at 480×270.

Reviewed all ten existing native field captures. Other six scenes already have usable stone/earth floor; corrected their atlas extraction to actual row boundaries (white separators at source y180–182,364–366,560–562,747–749), eliminating bottom strips without repainting their scenery. No gameplay/stat edits.
