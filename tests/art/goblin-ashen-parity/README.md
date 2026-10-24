# Goblin / Ashen ordinary slot-parity art

33 distinct transparent raster icons, created with the built-in image generator.

- `generation.json`: exact final prompts, original generated paths, tool and transparency setting.
- `sources/`: retained final generated PNGs, one per item (four rejected initial silhouettes superseded).
- `goblin-contact.png`, `ashen-contact.png`: final art at native 64px and 3× nearest-neighbor size.
- `corrections-contact.png`: final corrected dagger / blunt-hammer family proof.
- `../../../goblin-ashen-parity-art-source-manifest.json`: source/output SHA256, dimensions, alpha bounds/counts and prompts.

Reproduce final icons and race contacts from repository root:

```sh
node tools/package-goblin-ashen-parity.mjs
```

Packaging only performs whole-source nearest-neighbor resizing to 64×64 and retains alpha. No painting, recoloring or silhouette editing. All previous assets remain untouched. All 33 final silhouettes were visually reviewed, including compact Goblin daggers 7/9 and blunt Ashen hammers 45/46.
