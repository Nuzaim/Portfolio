/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box3, BoxGeometry, Color, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const origin = [9, 7.5, 12];
const target = [.8, 2, 0];
const labels = { experience: 'Laptop / Experience', projects: 'Server rack / Projects', knowledge: 'Exercise books / Knowledge', contact: 'Smartphone / Contact' };
const labelAnchors = [
  { section: 'experience', text: 'Experience', point: [-.35, 3.55, -.5], offset: [0, -45] },
  { section: 'projects', text: 'Projects', point: [4.3, 4.5, -1.15], offset: [0, -36] },
  { section: 'knowledge', text: 'Knowledge', point: [-1.95, 3.22, .32], offset: [-76, -26] },
  { section: 'contact', text: 'Contact', point: [.95, 2.76, .45], offset: [0, 60] },
];

function disposeModels(models) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  models.forEach(model => model.traverse(node => {
    if (!node.isMesh) return;
    geometries.add(node.geometry);
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
      materials.add(material);
      Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); });
    }
  }));
  geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); textures.forEach(item => item.dispose());
}

function Controls({ paused, reset, reduced, onFailure }) {
  const { camera, gl, invalidate, setFrameloop, size } = useThree();
  const controls = useMemo(() => new OrbitControls(camera), [camera]);
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    controls.domElement = gl.domElement;
    controls.connect();
    controls.enablePan = false;
    controls.minDistance = 6.5;
    controls.maxDistance = 28;
    controls.minPolarAngle = .3;
    controls.maxPolarAngle = Math.PI / 2 - .2;
    controls.addEventListener('change', invalidate);
    const visibility = () => { setVisible(!document.hidden); setFrameloop(document.hidden ? 'never' : 'demand'); if (!document.hidden) invalidate(); };
    const lost = event => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    gl.domElement.dataset.ready = 'true';
    document.addEventListener('visibilitychange', visibility);
    visibility();
    return () => { delete gl.domElement.dataset.ready; controls.dispose(); controls.removeEventListener('change', invalidate); gl.domElement.removeEventListener('webglcontextlost', lost); document.removeEventListener('visibilitychange', visibility); };
  }, [controls, gl, invalidate, setFrameloop, onFailure]);
  useEffect(() => {
    controls.enabled = !paused && visible;
    controls.enableDamping = !reduced && !paused;
    invalidate();
  }, [controls, paused, reduced, visible, invalidate]);
  useEffect(() => {
    const center = new Vector3(...target);
    const fit = Math.min(1.8, Math.max(1, 1.15 / (size.width / size.height)));
    camera.position.set(...origin).sub(center).multiplyScalar(fit).add(center);
    controls.target.copy(center); controls.update(); invalidate();
  }, [camera, controls, reset, invalidate, size.width, size.height]);
  useFrame(() => { if (controls.enabled) controls.update(); });
  return null;
}
Controls.propTypes = { paused: PropTypes.bool, reset: PropTypes.number, reduced: PropTypes.bool, onFailure: PropTypes.func };

function InteractiveLabels({ onUpdate }) {
  const { camera, size } = useThree();
  const point = useMemo(() => new Vector3(), []);
  const previous = useRef([]);
  useFrame(() => {
    const next = labelAnchors.map(({ section, text, point: anchor, offset }, index) => {
      point.set(...anchor).project(camera);
      const x = (point.x + 1) * size.width / 2, y = (-point.y + 1) * size.height / 2;
      const width = size.width < 768 ? 94 : 116;
      const labelX = Math.max(width / 2 + 8, Math.min(size.width - width / 2 - 8, x + offset[0]));
      const labelY = y + offset[1];
      const dx = labelX - x, dy = labelY - y;
      // Stop the leader at the label border, keeping the full route under 60px.
      const edge = Math.min(width / 2 / Math.abs(dx), 12 / Math.abs(dy));
      return { section, text, number: index + 1, x, y, labelX, labelY, endX: labelX - dx * edge, endY: labelY - dy * edge, visible: point.z > -1 && point.z < 1 };
    });
    const changed = next.some((item, index) => {
      const last = previous.current[index];
      return !last || last.visible !== item.visible || Math.abs(last.x - item.x) > .5 || Math.abs(last.y - item.y) > .5;
    });
    if (changed) { previous.current = next; onUpdate(next); }
  });
  return null;
}
InteractiveLabels.propTypes = { onUpdate: PropTypes.func.isRequired };

function Model({ object, section, onSelect, onHover, paused, gesture }) {
  const [hovered, setHovered] = useState(false);
  const { invalidate } = useThree();
  useEffect(() => {
    object.traverse(node => {
      if (!node.isMesh) return;
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        material.emissive?.set(hovered && !paused ? '#303030' : material.userData.baseEmissive || '#000000');
      }
    });
    invalidate();
  }, [object, hovered, paused, invalidate]);
  return <primitive object={object} onPointerOver={section && !paused ? event => { event.stopPropagation(); setHovered(true); onHover(section); } : undefined}
    onPointerMove={section && !paused ? event => { event.stopPropagation(); setHovered(true); onHover(section); } : undefined}
    onPointerOut={() => { setHovered(false); onHover(current => current === section ? null : current); }}
    onClick={section && !paused ? event => {
      event.stopPropagation();
      if (!gesture.current.moved && event.delta <= 5) { setHovered(false); onHover(null); onSelect(section); }
    } : undefined} />;
}
Model.propTypes = { object: PropTypes.object.isRequired, section: PropTypes.string, onSelect: PropTypes.func, onHover: PropTypes.func, paused: PropTypes.bool, gesture: PropTypes.object };

function assemble({ desk: deskScene, laptop: laptopScene, serverRack: serverRackScene, books: booksScene, phone: phoneScene, plant: plantScene, lamp: lampScene, mug: mugScene, chair: chairScene }) {
  // Polyfork assets are authored in metres; preserve their relative dimensions.
  // A 1.6 m desk spans six scene units.
  const worldScale = 6 / 1.6;
  const place = (object, position, rotation = [0, 0, 0]) => {
    object.rotation.set(...rotation);
    object.updateMatrixWorld(true);
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());
    const centered = new Group();
    centered.add(object);
    object.position.add(new Vector3(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2));
    centered.scale.setScalar(worldScale); centered.position.set(...position);
    return { group: centered, height: size.y * worldScale };
  };
  [deskScene, laptopScene, serverRackScene, booksScene, phoneScene, plantScene, lampScene, mugScene, chairScene].forEach(scene => scene.traverse(node => {
    if (node.isMesh) {
      node.castShadow = true; node.receiveShadow = true;
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        if (node.name === 'Screen') { material.color.set('#222222'); material.emissive = new Color('#111111'); }
        if (node.name === 'Glass') { material.transparent = true; material.opacity = .07; material.depthWrite = false; }
        material.userData.baseEmissive = material.emissive?.getHex();
      }
    }
  }));
  // Keep the book covers distinct, with quieter colours that suit the workspace.
  booksScene.traverse(node => {
    const colors = node.geometry?.getAttribute('color');
    if (!colors) return;
    const color = new Color();
    for (let i = 0; i < colors.count; i++) {
      color.fromBufferAttribute(colors, i);
      const neutral = .2126 * color.r + .7152 * color.g + .0722 * color.b;
      color.lerp(new Color(neutral, neutral, neutral), .45);
      colors.setXYZ(i, color.r, color.g, color.b);
    }
    colors.needsUpdate = true;
  });
  const desk = place(deskScene, [0, 0, 0]);
  const mat = new Mesh(new BoxGeometry(2.65, .018, 1.58), new MeshStandardMaterial({ color: '#8d9287', roughness: 1 }));
  mat.position.set(-.08, desk.height + .009, .18);
  mat.receiveShadow = true;
  const laptop = place(laptopScene, [-.35, desk.height + .018, -.12]).group;
  const serverRack = place(serverRackScene, [4.3, 0, -1.15]).group;
  const books = place(booksScene, [-1.95, desk.height, .32], [0, -.12, 0]).group;
  // Rotate before measuring bounds so the screen faces up and the back rests
  // on the desktop, regardless of the model's original upright pivot.
  const phone = place(phoneScene, [.95, desk.height + .021, .45], [-Math.PI / 2, 0, -.18]).group;
  const plant = place(plantScene, [2.08, desk.height, -.7], [0, .35, 0]).group;
  const lamp = place(lampScene, [-2.2, desk.height, -.85], [0, Math.PI / 2, 0]).group;
  const mug = place(mugScene, [1.82, desk.height, .64], [0, -.6, 0]).group;
  // The source faces the opposite direction; turn it toward the desk.
  const chair = place(chairScene, [0, 0, 2.1], [0, Math.PI, 0]).group;
  return { desk: desk.group, mat, laptop, serverRack, books, phone, plant, lamp, mug, chair };
}

export default function Workspace({ paused, reset, onSelect, onFailure }) {
  const [models, setModels] = useState(null);
  const [hover, setHover] = useState(null);
  const [labelPositions, setLabelPositions] = useState([]);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const gesture = useRef({ moved: false, points: new Set(), x: 0, y: 0 });
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    let cancelled = false;
    let loaded = [];
    const loader = new GLTFLoader();
    const assets = [
      ['desk', 'models/polyfork/sit-stand-desk.glb'],
      ['laptop', 'models/polyfork/laptop.glb'],
      ['serverRack', 'models/polyfork/server-rack.glb'],
      ['books', 'models/polyfork/exercise-books.glb'],
      ['phone', 'models/polyfork/smartphone.glb'],
      ['plant', 'models/decor/plant.glb'],
      ['lamp', 'models/decor/lamp.glb'],
      ['mug', 'models/decor/mug.glb'],
      ['chair', 'models/decor/chairDesk.glb']
    ];
    Promise.allSettled(assets.map(([, path]) => loader.loadAsync(`${import.meta.env.BASE_URL}${path}`))).then(results => {
      loaded = results.filter(result => result.status === 'fulfilled').map(result => result.value.scene);
      if (cancelled || results.some(result => result.status === 'rejected')) { disposeModels(loaded); if (!cancelled) onFailure(); return; }
      const scenes = Object.fromEntries(results.map((result, index) => [assets[index][0], result.value.scene]));
      const assembled = assemble(scenes);
      loaded = Object.values(assembled);
      setModels(assembled);
    }).catch(() => { disposeModels(loaded); if (!cancelled) onFailure(); });
    return () => { cancelled = true; disposeModels(loaded); };
  }, [onFailure]);
  const pointerDown = event => {
    const state = gesture.current;
    state.points.add(event.pointerId);
    if (state.points.size === 1) { state.x = event.clientX; state.y = event.clientY; state.moved = false; }
    else state.moved = true;
  };
  return <div className={`workspace ${hover && !paused ? 'isHovering' : ''}`} onPointerDownCapture={pointerDown}
    onPointerMoveCapture={event => { const state = gesture.current; if (state.points.size && Math.hypot(event.clientX - state.x, event.clientY - state.y) > 5) state.moved = true; }}
    onPointerUpCapture={event => gesture.current.points.delete(event.pointerId)}
    onPointerCancelCapture={event => { gesture.current.points.delete(event.pointerId); gesture.current.moved = true; }}>
    {!models ? <p className="loadingStatus" role="status">Unpacking the office…<span>Arranging the workspace</span></p> : <Canvas shadows dpr={[1, 1.5]} frameloop="demand" camera={{ position: origin, fov: 38, near: .1, far: 60 }} gl={{ antialias: true, powerPreference: 'low-power' }} fallback="Use Text view to read the portfolio.">
      <color attach="background" args={['#d2d2ce']} /><fog attach="fog" args={['#d2d2ce', 20, 40]} />
      <ambientLight intensity={1.5} /><hemisphereLight args={['#ffffff', '#757570', 1.2]} />
      <directionalLight position={[-3, 12, 6]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-.0003} shadow-normalBias={.015} shadow-radius={4} />
      <Controls paused={paused} reset={reset} reduced={reduced} onFailure={onFailure} />
      <InteractiveLabels onUpdate={setLabelPositions} />
      <primitive object={models.desk} />
      <primitive object={models.mat} />
      <primitive object={models.plant} />
      <primitive object={models.lamp} />
      <primitive object={models.mug} />
      <primitive object={models.chair} />
      <Model object={models.laptop} section="experience" {...{ onSelect, paused, gesture }} onHover={setHover} />
      <Model object={models.serverRack} section="projects" {...{ onSelect, paused, gesture }} onHover={setHover} />
      <Model object={models.books} section="knowledge" {...{ onSelect, paused, gesture }} onHover={setHover} />
      <Model object={models.phone} section="contact" {...{ onSelect, paused, gesture }} onHover={setHover} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.025, 0]} receiveShadow><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#c5c5c0" roughness={1} /></mesh>
    </Canvas>}
    {!paused && <div className="sceneAnnotations" aria-hidden="true">
      <svg className="sceneLeaders">{labelPositions.filter(item => item.visible).map(({ section, x, y, endX, endY }) => <g key={section}><line x1={x} y1={y} x2={endX} y2={endY} /><circle cx={x} cy={y} r="2" /></g>)}</svg>
      {labelPositions.filter(item => item.visible).map(({ section, text, number, labelX, labelY }) => <span key={section} className="sceneObjectLabel" style={{ transform: `translate(${labelX}px, ${labelY}px)` }}><small>{String(number).padStart(2, '0')}</small>{text}<b>↗</b></span>)}
    </div>}
    {hover && !paused && <p className="objectLabel" role="status">{labels[hover]} <span>↗</span></p>}
  </div>;
}
Workspace.propTypes = { paused: PropTypes.bool.isRequired, reset: PropTypes.number.isRequired, onSelect: PropTypes.func.isRequired, onFailure: PropTypes.func.isRequired };
