/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import LaptopTerminal from './LaptopTerminal';
import KnowledgeBook from './KnowledgeBook';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box3, BoxGeometry, BufferGeometry, Float32BufferAttribute, CanvasTexture, Color, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, Vector3 } from 'three';
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

function Controls({ paused, reset, reduced, onFailure, onZoomChange, laptop, books, bookOpen, terminalOpen, onCameraReady }) {
  const { camera, gl, invalidate, setFrameloop, size } = useThree();
  const controls = useMemo(() => new OrbitControls(camera), [camera]);
  const initialDistance = useRef(0);
  const movement = useRef(null);
  const initialized = useRef(false);
  useEffect(() => {
    const updateZoom = () => onZoomChange(controls.getDistance() < initialDistance.current * .95);
    controls.addEventListener('change', updateZoom);
    return () => controls.removeEventListener('change', updateZoom);
  }, [controls, onZoomChange]);
  const [visible, setVisible] = useState(!document.hidden);
  const orbitAllowed = useRef(false);
  orbitAllowed.current = !terminalOpen && !bookOpen && !paused && visible;
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
    controls.enabled = !paused && !terminalOpen && visible && !movement.current;
    controls.enableDamping = !reduced && !paused;
    invalidate();
  }, [controls, paused, terminalOpen, bookOpen, reduced, visible, invalidate]);
  useEffect(() => {
    const center = new Vector3(...target);
    const up = new Vector3(0, 1, 0);
    const fit = Math.min(1.8, Math.max(1, 1.15 / (size.width / size.height)));
    const position = new Vector3(...origin).sub(center).multiplyScalar(fit).add(center);
    initialDistance.current = position.distanceTo(center);
    if (terminalOpen && laptop) {
      laptop.updateWorldMatrix(true, true);
      const lid = laptop.getObjectByName('lid');
      center.copy(lid.localToWorld(new Vector3(0, -.005, .1045)));
      up.set(0, 0, 1).transformDirection(lid.matrixWorld);
      const normal = new Vector3(0, -1, 0).transformDirection(lid.matrixWorld);
      const aspect = size.width / size.height;
      const distance = Math.max(.181 * 3.75, .288 * 3.75 / aspect) / (2 * Math.tan(camera.fov * Math.PI / 360)) * 1.35;
      position.copy(center).addScaledVector(normal, distance);
    }
    if (bookOpen && books) {
      books.updateWorldMatrix(true, true);
      const book = books.getObjectByName('knowledgeBook');
      const mobile = size.width < 768;
      center.copy(book.localToWorld(new Vector3(mobile ? 0 : -.088, .035, 0)));
      up.set(0, 0, -1).transformDirection(book.matrixWorld);
      const normal = new Vector3(0, 1, 0).transformDirection(book.matrixWorld);
      const span = mobile ? .18 : .36;
      const distance = Math.max(.145 * 3.75, span * 3.75 / (size.width / size.height)) / (2 * Math.tan(camera.fov * Math.PI / 360)) * 1.25;
      position.copy(center).addScaledVector(normal, distance);
    }
    onCameraReady(false);
    controls.enabled = false;
    // Retarget from the current pose, including when navigation interrupts a move.
    if (reduced || !initialized.current) {
      movement.current = null;
      camera.position.copy(position); camera.up.copy(up); controls.target.copy(center);
      camera.lookAt(center);
      if (!terminalOpen && !bookOpen) controls.update();
      controls.enabled = orbitAllowed.current;
      onCameraReady(true);
    } else {
      movement.current = { start: performance.now(), from: camera.position.clone(), fromTarget: controls.target.clone(), fromUp: camera.up.clone(), position, center, up };
    }
    initialized.current = true;
    onZoomChange(terminalOpen || bookOpen); invalidate();
  }, [camera, controls, reset, invalidate, size.width, size.height, onZoomChange, laptop, books, bookOpen, terminalOpen, reduced, onCameraReady]);
  useFrame(() => {
    const move = movement.current;
    if (move) {
      const progress = Math.min(1, (performance.now() - move.start) / 850);
      const eased = progress * progress * (3 - 2 * progress);
      camera.position.lerpVectors(move.from, move.position, eased);
      controls.target.lerpVectors(move.fromTarget, move.center, eased);
      camera.up.lerpVectors(move.fromUp, move.up, eased).normalize();
      camera.lookAt(controls.target);
      if (progress === 1) {
        movement.current = null;
        if (!terminalOpen && !bookOpen) controls.update();
        controls.enabled = orbitAllowed.current;
        onCameraReady(true);
      } else invalidate();
    } else if (controls.enabled) controls.update();
  });
  return null;
}
Controls.propTypes = { paused: PropTypes.bool, reset: PropTypes.number, reduced: PropTypes.bool, onFailure: PropTypes.func, onZoomChange: PropTypes.func.isRequired, laptop: PropTypes.object, books: PropTypes.object, bookOpen: PropTypes.bool, terminalOpen: PropTypes.bool, onCameraReady: PropTypes.func.isRequired };

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

// Map a DOM terminal onto the four projected corners of the laptop display.
function ScreenProjection({ laptop, surface, onUpdate }) {
  const { camera, size } = useThree();
  const last = useRef('');
  useFrame(() => {
    const object = surface || laptop.getObjectByName('lid');
    object.updateWorldMatrix(true, false);
    const corners = surface ? [[-.0825, .065, .0001], [.0825, .065, .0001], [.0825, -.065, .0001], [-.0825, -.065, .0001]] : [[-.144, -.0055, .195], [.144, -.0055, .195], [.144, -.0055, .014], [-.144, -.0055, .014]];
    const points = corners.map(corner => {
      const p = object.localToWorld(new Vector3(...corner)).project(camera);
      return [(p.x + 1) * size.width / 2, (1 - p.y) * size.height / 2];
    });
    const width = Math.max(1, Math.round(Math.hypot(points[1][0] - points[0][0], points[1][1] - points[0][1])));
    const height = Math.max(1, Math.round(Math.hypot(points[3][0] - points[0][0], points[3][1] - points[0][1])));
    const source = [[0, 0], [width, 0], [width, height], [0, height]];
    const rows = source.flatMap(([x, y], i) => {
      const [u, v] = points[i];
      return [[x, y, 1, 0, 0, 0, -u*x, -u*y, u], [0, 0, 0, x, y, 1, -v*x, -v*y, v]];
    });
    for (let i = 0; i < 8; i++) {
      let pivot = i; for (let j = i + 1; j < 8; j++) if (Math.abs(rows[j][i]) > Math.abs(rows[pivot][i])) pivot = j;
      [rows[i], rows[pivot]] = [rows[pivot], rows[i]];
      const divisor = rows[i][i]; if (Math.abs(divisor) < 1e-10) return;
      for (let k = i; k < 9; k++) rows[i][k] /= divisor;
      for (let j = 0; j < 8; j++) if (j !== i) { const factor = rows[j][i]; for (let k = i; k < 9; k++) rows[j][k] -= factor * rows[i][k]; }
    }
    const [a,b,c,d,e,f,g,h] = rows.map(row => row[8]);
    const transform = `matrix3d(${a},${d},0,${g},${b},${e},0,${h},0,0,1,0,${c},${f},0,1)`;
    if (last.current !== transform) { last.current = transform; onUpdate({ transform, width, height }); }
  });
  return null;
}
ScreenProjection.propTypes = { laptop: PropTypes.object, surface: PropTypes.object, onUpdate: PropTypes.func.isRequired };

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

// Replace the source's already-open top notebook with an articulated hardback.
// The first 948 vertices contain the five lower books in this local asset.
function addBookHinge(scene) {
  const mesh = scene.getObjectByProperty('isMesh', true);
  const original = mesh.geometry;
  const source = original.index ? original.toNonIndexed() : original;
  const lowerBooks = new BufferGeometry();
  Object.entries(source.attributes).forEach(([name, attribute]) => {
    lowerBooks.setAttribute(name, new Float32BufferAttribute(attribute.array.slice(0, 948 * attribute.itemSize), attribute.itemSize));
  });
  mesh.geometry = lowerBooks;
  source.dispose();
  if (original !== source) original.dispose();

  const book = new Group();
  book.name = 'knowledgeBook';
  book.position.set(0, .11375, 0);
  book.rotation.y = -.08;
  const coverMaterial = new MeshStandardMaterial({ color: '#824c3e', roughness: .85 });
  const paperMaterial = new MeshStandardMaterial({ color: '#eeede9', roughness: 1 });
  const piece = (width, height, depth, material, position, parent = book) => {
    const part = new Mesh(new BoxGeometry(width, height, depth), material);
    part.position.set(...position); part.castShadow = true; part.receiveShadow = true;
    parent.add(part);
    return part;
  };
  piece(.18, .002, .145, coverMaterial, [0, .001, 0]);
  piece(.174, .012, .139, paperMaterial, [0, .008, 0]);
  piece(.003, .024, .145, coverMaterial, [-.089, .012, 0]);
  const hinge = new Group();
  hinge.name = 'bookHinge'; hinge.position.set(-.088, .023, 0);
  book.add(hinge);
  piece(.18, .002, .145, coverMaterial, [.088, 0, 0], hinge);
  piece(.174, .008, .139, paperMaterial, [.088, -.005, 0], hinge);
  // Thin edges give the page blocks visible layers as the cover opens.
  const pageEdgeMaterial = new MeshStandardMaterial({ color: '#c6c4bb', roughness: 1 });
  for (let i = 0; i < 5; i++) {
    piece(.173, .00025, .0004, pageEdgeMaterial, [0, .004 + i * .002, .0697]);
  }
  const page = document.createElement('canvas'); page.width = 256; page.height = 256;
  const context = page.getContext('2d');
  context.fillStyle = '#eeede9'; context.fillRect(0, 0, 256, 256);
  context.fillStyle = '#565650'; context.font = 'bold 20px monospace';
  context.fillText('KNOWLEDGE', 28, 45);
  context.fillStyle = '#b7b7af';
  for (let line = 0; line < 9; line++) context.fillRect(28, 75 + line * 16, line % 3 === 2 ? 135 : 194, 2);
  const pageMaterial = new MeshBasicMaterial({ map: new CanvasTexture(page), toneMapped: false });
  const pageFace = new Mesh(new PlaneGeometry(.165, .13), pageMaterial);
  pageFace.name = 'knowledgeRight';
  pageFace.rotation.x = -Math.PI / 2; pageFace.position.set(0, .0141, 0); book.add(pageFace);
  const inside = pageFace.clone();
  inside.name = 'knowledgeLeft';
  inside.rotation.x = Math.PI / 2; inside.rotation.z = Math.PI; inside.position.set(.088, -.0091, 0); hinge.add(inside);
  mesh.add(book);
}

function BookAnimation({ books, open, reduced }) {
  const { invalidate } = useThree();
  const movement = useRef(null);
  useEffect(() => {
    const hinge = books.getObjectByName('bookHinge');
    movement.current = { start: performance.now(), from: hinge.rotation.z, to: open ? Math.PI : 0 };
    invalidate();
  }, [books, open, reduced, invalidate]);
  useFrame(() => {
    const move = movement.current;
    if (!move) return;
    const progress = reduced ? 1 : Math.min(1, (performance.now() - move.start) / 750);
    const eased = progress * progress * (3 - 2 * progress);
    books.getObjectByName('bookHinge').rotation.z = move.from + (move.to - move.from) * eased;
    if (progress < 1) invalidate();
    else movement.current = null;
  });
  return null;
}
BookAnimation.propTypes = { books: PropTypes.object.isRequired, open: PropTypes.bool.isRequired, reduced: PropTypes.bool.isRequired };

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
  addBookHinge(booksScene);
  const desk = place(deskScene, [0, 0, 0]);
  const mat = new Mesh(new BoxGeometry(2.65, .018, 1.58), new MeshStandardMaterial({ color: '#8d9287', roughness: 1 }));
  mat.position.set(-.08, desk.height + .009, .18);
  mat.receiveShadow = true;
  const laptop = place(laptopScene, [-.35, desk.height + .018, -.12]).group;
  const preview = document.createElement('canvas'); preview.width = 800; preview.height = 500;
  const context = preview.getContext('2d');
  context.fillStyle = '#101a18'; context.fillRect(0, 0, 800, 500);
  context.fillStyle = '#8bddb0'; context.font = '24px monospace';
  ['nuzaim@workspace: ~', '', '$ experience', 'Software Engineer', 'Turbolab Technologies', '', '$ projects', 'Select laptop to explore →'].forEach((line, index) => context.fillText(line, 40, 55 + index * 48));
  const screen = new Mesh(new PlaneGeometry(.288, .181), new MeshBasicMaterial({ map: new CanvasTexture(preview), toneMapped: false }));
  screen.rotation.x = Math.PI / 2; screen.position.set(0, -.0048, .1045);
  laptop.getObjectByName('lid').add(screen);
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

export default function Workspace({ paused, reset, onSelect, onFailure, onZoomChange, terminalSection, bookSection, onTerminalClose }) {
  const bookOpen = Boolean(bookSection);
  const [bookLeftStyle, setBookLeftStyle] = useState(null);
  const [bookRightStyle, setBookRightStyle] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [displaySection, setDisplaySection] = useState(terminalSection);
  const [screenStyle, setScreenStyle] = useState(null);
  const [models, setModels] = useState(null);
  const [hover, setHover] = useState(null);
  const [labelPositions, setLabelPositions] = useState([]);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (terminalSection) { setDisplaySection(terminalSection); return; }
    const timeout = setTimeout(() => setDisplaySection(null), reduced ? 0 : 280);
    return () => clearTimeout(timeout);
  }, [terminalSection, reduced]);
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
      <Controls books={models.books} bookOpen={bookOpen} onCameraReady={setCameraReady} laptop={models.laptop} terminalOpen={Boolean(terminalSection)} paused={paused} reset={reset} reduced={reduced} onFailure={onFailure} onZoomChange={onZoomChange} />
      <InteractiveLabels onUpdate={setLabelPositions} />
      {displaySection && <ScreenProjection laptop={models.laptop} onUpdate={setScreenStyle} />}
      {bookOpen && <><ScreenProjection surface={models.books.getObjectByName('knowledgeLeft')} onUpdate={setBookLeftStyle} /><ScreenProjection surface={models.books.getObjectByName('knowledgeRight')} onUpdate={setBookRightStyle} /></>}
      <primitive object={models.desk} />
      <primitive object={models.mat} />
      <primitive object={models.plant} />
      <primitive object={models.lamp} />
      <primitive object={models.mug} />
      <primitive object={models.chair} />
      <Model object={models.laptop} section="experience" {...{ onSelect, paused: paused || Boolean(terminalSection) || bookOpen, gesture }} onHover={setHover} />
      <Model object={models.serverRack} section="projects" {...{ onSelect, paused: paused || Boolean(terminalSection) || bookOpen, gesture }} onHover={setHover} />
      <BookAnimation books={models.books} open={bookOpen} reduced={reduced} />
      <Model object={models.books} section="knowledge" {...{ onSelect, paused: paused || Boolean(terminalSection) || bookOpen, gesture }} onHover={setHover} />
      <Model object={models.phone} section="contact" {...{ onSelect, paused: paused || Boolean(terminalSection) || bookOpen, gesture }} onHover={setHover} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.025, 0]} receiveShadow><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#c5c5c0" roughness={1} /></mesh>
    </Canvas>}
    {!paused && !terminalSection && !bookOpen && <div className="sceneAnnotations" aria-hidden="true">
      <svg className="sceneLeaders">{labelPositions.filter(item => item.visible).map(({ section, x, y, endX, endY }) => <g key={section}><line x1={x} y1={y} x2={endX} y2={endY} /><circle cx={x} cy={y} r="2" /></g>)}</svg>
      {labelPositions.filter(item => item.visible).map(({ section, text, number, labelX, labelY }) => <span key={section} className="sceneObjectLabel" style={{ transform: `translate(${labelX}px, ${labelY}px)` }}><small>{String(number).padStart(2, '0')}</small>{text}<b>↗</b></span>)}
    </div>}
    {hover && !paused && !terminalSection && !bookOpen && <p className="objectLabel" role="status">{labels[hover]} <span>↗</span></p>}
    {bookOpen && models && bookLeftStyle && bookRightStyle && <KnowledgeBook active={cameraReady} leftStyle={bookLeftStyle} rightStyle={bookRightStyle} onClose={onTerminalClose} />}
    {displaySection && models && screenStyle && <LaptopTerminal active={Boolean(terminalSection) && cameraReady} section={displaySection} onClose={onTerminalClose} onSelect={onSelect} style={screenStyle} />}
  </div>;
}
Workspace.propTypes = { bookSection: PropTypes.bool, terminalSection: PropTypes.string, onTerminalClose: PropTypes.func.isRequired, paused: PropTypes.bool.isRequired, reset: PropTypes.number.isRequired, onSelect: PropTypes.func.isRequired, onFailure: PropTypes.func.isRequired, onZoomChange: PropTypes.func.isRequired };
