# Workspace asset credits

Downloaded September 10, 2026. Only the four optimized GLBs are loaded by the site.

| File | Author | Source | License |
| --- | --- | --- | --- |
| optimized/computer.glb | DMmotionarts | https://dmmotionarts.com/product/retro-computer-3d-model-free-download/ | Author permits personal/commercial use with attribution; do not resell unchanged or claim authorship |
| optimized/desk.glb | Ulan Cabanilla / Poly Haven | https://polyhaven.com/a/metal_office_desk | CC0 |
| optimized/books.glb | John Malcolm / Poly Haven | https://polyhaven.com/a/book_encyclopedia_set_01 | CC0 |
| optimized/phone.glb | Adrian C / Poly Haven | https://polyhaven.com/a/vintage_telephone_wall_clock | CC0 |

Poly Haven license: https://polyhaven.com/license

Modifications: removed the computer's background plane and empty Circle; simplified meshes with meshoptimizer (65% target, 0.001 error tolerance), welded vertices, deduplicated resources, and pruned unused data. Resized textures to at most 512px JPEG at quality 78 and converted base-color textures and material factors to grayscale. Removed optional computer material extensions, capped metallic factors, removed original emission, and added restrained screen emission at runtime. Scaled and positioned models into one composition. The telephone is an authored decorative telephone/clock model. The monitor and computer base/keyboard/mouse are separate selectable groups from the same authored computer asset.

See metrics.json for per-model sizes and triangle counts. Total: 4,691,292 bytes; 126,234 triangles (plus a two-triangle floor). No postprocessing or runtime external asset hosts.

## Rebuilding

The optimized assets are committed; rebuilding is optional. Download the computer ZIP using the source page's Download Now form. Extract its GLB to `.asset-sources/computer/computer.glb`. For each Poly Haven model, use the 1K glTF download and keep all relative texture and binary paths, saving the main glTF as `.asset-sources/desk/desk.gltf`, `.asset-sources/books/books.gltf`, or `.asset-sources/phone/phone.gltf`. Run `node scripts/optimize-models.mjs`. The original downloads are excluded from builds and version control.
