import { NodeIO } from '@gltf-transform/core';
import { dedup, prune, weld, simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const io = new NodeIO();
const report = [];
for (const name of ['desk', 'books', 'computer', 'phone']) {
  const doc = await io.read(`.asset-sources/${name}/${name}.${name === 'computer' ? 'glb' : 'gltf'}`);
  if (name === 'computer') {
    for (const node of doc.getRoot().listNodes()) if (['Plane', 'Circle'].includes(node.getName())) node.dispose();
  }
  for (const material of doc.getRoot().listMaterials()) {
    const color = material.getBaseColorFactor();
    const gray = color[0] * .2126 + color[1] * .7152 + color[2] * .0722;
    material.setBaseColorFactor([gray, gray, gray, color[3]]);
    material.setEmissiveFactor([0, 0, 0]);
    material.setMetallicFactor(Math.min(material.getMetallicFactor(), .35));
  }
  for (const texture of doc.getRoot().listTextures()) {
    const isColor = doc.getRoot().listMaterials().some(m => m.getBaseColorTexture() === texture);
    let pipeline = sharp(texture.getImage()).resize(512, 512, { fit: 'inside', withoutEnlargement: true });
    if (isColor) pipeline = pipeline.grayscale();
    texture.setImage(await pipeline.jpeg({ quality: 78 }).toBuffer()).setMimeType('image/jpeg');
  }
  await MeshoptSimplifier.ready;
  await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: .65, error: .001 }), dedup(), prune());
  await mkdir('public/models/optimized', { recursive: true });
  const data = await io.writeBinary(doc);
  await writeFile(`public/models/optimized/${name}.glb`, data);
  let triangles = 0;
  for (const node of doc.getRoot().listNodes()) for (const p of node.getMesh()?.listPrimitives() || []) triangles += (p.getIndices()?.getCount() || p.getAttribute('POSITION').getCount()) / 3;
  report.push({ name, bytes: data.length, triangles });
}
await writeFile('public/models/metrics.json', JSON.stringify(report, null, 2) + '\n');
console.log(report);
