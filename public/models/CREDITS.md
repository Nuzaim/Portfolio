# Workspace asset credits

Downloaded September 10, 2026. The site loads five local Polyfork GLBs and three adapted Kenney GLBs.

| File | Author | Source | License |
| --- | --- | --- | --- |
| polyfork/sit-stand-desk.glb | Polyfork | https://polyfork.dev/asset/sit-stand-desk-3ff7b8 | Free remixable asset; see source page |
| polyfork/laptop.glb | Polyfork | https://polyfork.dev/asset/laptop-e775ba | Commercial license; preview GLB |
| polyfork/server-rack.glb | Polyfork | https://polyfork.dev/asset/small-server-rack-8ae0a4 | Commercial license; preview GLB |
| polyfork/exercise-books.glb | Polyfork | https://polyfork.dev/asset/exercise-book-stack-266d9d | Free remixable asset; see source page |
| polyfork/smartphone.glb | Polyfork | https://polyfork.dev/asset/smartphone-5f05e5 | Free asset; commercial license |
| decor/plant.glb | Kenney | https://kenney.nl/assets/furniture-kit (`plantSmall2.glb`) | CC0 1.0 |
| decor/lamp.glb | Kenney | https://kenney.nl/assets/furniture-kit (`lampRoundTable.glb`) | CC0 1.0 |
| decor/mug.glb | Kenney | https://kenney.nl/assets/food-kit (`cup.glb`) | CC0 1.0 |

Kenney props are adapted to muted sage, stone, graphite, and warm ceramic colors. Their heights are normalized to 30 cm (plant), 42 cm (lamp), and 9.5 cm (mug). The desk mat is original scene geometry. License: https://creativecommons.org/publicdomain/zero/1.0/.

Poly Haven license: https://polyhaven.com/license

The five Polyfork files are kept local so the workspace remains usable offline. The low-poly GLBs are placed at authored real-world scale: the sit-stand desk is the composition anchor, the laptop is the Experience target, the server rack is the Projects target, the exercise books are the Knowledge target, and the smartphone is the Contact target.

The older optimized computer, desk, books, and telephone files remain in the folder as unused legacy assets; only the files in the table are loaded. No postprocessing or runtime external asset hosts are used.

## Rebuilding

For the decorations, download the official Kenney archives linked in [the research notes](../../docs/model-research.md). Copy the selected models to `.asset-sources/decor/kenney-plantSmall2.glb`, `kenney-lampRoundTable.glb`, and `kenney-cup.glb`, and retain the Food Kit's `Textures/colormap.png` alongside the cup. Run `node scripts/prepare-decor.mjs` to recolor, normalize, and pack the local GLBs. The exported files embed any required textures.

The optimized assets are committed; rebuilding is optional. Download the computer ZIP using the source page's Download Now form. Extract its GLB to `.asset-sources/computer/computer.glb`. For each Poly Haven model, use the 1K glTF download and keep all relative texture and binary paths, saving the main glTF as `.asset-sources/desk/desk.gltf`, `.asset-sources/books/books.gltf`, or `.asset-sources/phone/phone.gltf`. Run `node scripts/optimize-models.mjs`. The original downloads are excluded from builds and version control.
