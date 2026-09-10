import { NodeIO } from '@gltf-transform/core';
import { dedup, getBounds, prune } from '@gltf-transform/functions';
import { Color } from 'three';
import { mkdir } from 'node:fs/promises';

// Source GLBs: Kenney's CC0 kits; see public/models/CREDITS.md.
// Deliberately omit KHR_materials_unlit so the props receive scene lighting.
const io = new NodeIO();
const assets = [
  { source: 'kenney-plantSmall2', name: 'plant', height: .3, colors: { wood: '#c2b29c', plant: '#67836a' } },
  { source: 'kenney-lampRoundTable', name: 'lamp', height: .42, colors: { metal: '#454b48', lamp: '#eee2c7' } },
  { source: 'kenney-cup', name: 'mug', height: .095, colors: { colormap: '#e8dfd0' } },
];

await mkdir('public/models/decor', { recursive: true });
for (const { source, name, height, colors } of assets) {
  const doc = await io.read(`.asset-sources/decor/${source}.glb`);
  const scene = doc.getRoot().listScenes()[0];
  const { min, max } = getBounds(scene);
  const scale = height / (max[1] - min[1]);
  const root = doc.createNode(name).setScale([scale, scale, scale])
    .setTranslation([-(min[0] + max[0]) / 2 * scale, -min[1] * scale, -(min[2] + max[2]) / 2 * scale]);
  for (const child of scene.listChildren()) root.addChild(child);
  scene.addChild(root);
  for (const material of doc.getRoot().listMaterials()) {
    const color = colors[material.getName()];
    if (color) material.setBaseColorFactor([...new Color(color).toArray(), 1]);
    material.setRoughnessFactor(.85).setMetallicFactor(0);
  }
  await doc.transform(dedup(), prune());
  await io.write(`public/models/decor/${name}.glb`, doc);
  console.log(`${name}: ${height} m high`);
}
