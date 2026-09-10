/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box3, Color, Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const origin = [7.6, 6.2, 9.2];
const target = [0, 1.7, 0];
const labels = { experience: 'Monitor / Experience', projects: 'Computer hardware / Projects', knowledge: 'Books / Knowledge', contact: 'Telephone / Contact' };

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
    controls.maxDistance = 16;
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
    const fit = Math.min(1.22, Math.max(1, .95 / (size.width / size.height)));
    camera.position.set(...origin).sub(center).multiplyScalar(fit).add(center);
    controls.target.copy(center); controls.update(); invalidate();
  }, [camera, controls, reset, invalidate, size.width, size.height]);
  useFrame(() => { if (controls.enabled) controls.update(); });
  return null;
}
Controls.propTypes = { paused: PropTypes.bool, reset: PropTypes.number, reduced: PropTypes.bool, onFailure: PropTypes.func };

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

function assemble(scenes) {
  const normalize = (object, width, position) => {
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());
    const scale = width / size.x;
    const centered = new Group();
    centered.add(object);
    object.position.add(new Vector3(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2));
    centered.scale.setScalar(scale); centered.position.set(...position);
    return { group: centered, height: size.y * scale };
  };
  scenes.forEach(scene => scene.traverse(node => {
    if (node.isMesh) {
      node.castShadow = true; node.receiveShadow = true;
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        if (node.name === 'Screen') { material.color.set('#222222'); material.emissive = new Color('#111111'); }
        if (node.name === 'Glass') { material.transparent = true; material.opacity = .07; material.depthWrite = false; }
        material.userData.baseEmissive = material.emissive?.getHex();
      }
    }
  }));
  const desk = normalize(scenes[0], 6, [0, 0, 0]);
  const computer = normalize(scenes[2], 2.05, [-.1, desk.height, -.05]).group;
  const monitor = new Group(), hardware = new Group();
  // Preserve the authored transforms while separating semantic hit targets.
  for (const node of [...scenes[2].children]) {
    if (['Main_Computer', 'Main Computer', 'Screen', 'Glass', 'Power_Button', 'Power Button', 'Button1', 'Button2'].includes(node.name)) monitor.add(node);
    else hardware.add(node);
  }
  monitor.position.copy(scenes[2].position);
  hardware.position.copy(scenes[2].position);
  computer.remove(scenes[2]);
  computer.add(monitor, hardware);
  const books = normalize(scenes[1], 1.25, [-1.98, desk.height, -.18]).group;
  const phone = normalize(scenes[3], .9, [1.93, desk.height, .32]).group;
  phone.rotation.y = -.22;
  return { desk: desk.group, computer, monitor, hardware, books, phone };
}

export default function Workspace({ paused, reset, onSelect, onFailure }) {
  const [models, setModels] = useState(null);
  const [hover, setHover] = useState(null);
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
    Promise.allSettled(['desk', 'books', 'computer', 'phone'].map(name => loader.loadAsync(`${import.meta.env.BASE_URL}models/optimized/${name}.glb`))).then(results => {
      loaded = results.filter(result => result.status === 'fulfilled').map(result => result.value.scene);
      if (cancelled || results.some(result => result.status === 'rejected')) { disposeModels(loaded); if (!cancelled) onFailure(); return; }
      const assembled = assemble(loaded);
      loaded = [assembled.desk, assembled.computer, assembled.books, assembled.phone];
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
    {!models ? <p className="loadingStatus" role="status">Unpacking the desk…<span>Loading four local 3D models</span></p> : <Canvas shadows dpr={[1, 1.5]} frameloop="demand" camera={{ position: origin, fov: 38, near: .1, far: 60 }} gl={{ antialias: true, powerPreference: 'low-power' }} fallback="Use Text view to read the portfolio.">
      <color attach="background" args={['#d2d2ce']} /><fog attach="fog" args={['#d2d2ce', 20, 40]} />
      <ambientLight intensity={1.3} /><hemisphereLight args={['#ffffff', '#757570', 1.2]} />
      <directionalLight position={[-4, 9, 5]} intensity={3} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-.0003} shadow-normalBias={.03} shadow-radius={3} />
      <Controls paused={paused} reset={reset} reduced={reduced} onFailure={onFailure} />
      <primitive object={models.desk} />
      <primitive object={models.computer}>
        <Model object={models.monitor} section="experience" {...{ onSelect, paused, gesture }} onHover={setHover} />
        <Model object={models.hardware} section="projects" {...{ onSelect, paused, gesture }} onHover={setHover} />
      </primitive>
      <Model object={models.books} section="knowledge" {...{ onSelect, paused, gesture }} onHover={setHover} />
      <Model object={models.phone} section="contact" {...{ onSelect, paused, gesture }} onHover={setHover} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.025, 0]} receiveShadow><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#c5c5c0" roughness={1} /></mesh>
    </Canvas>}
    {hover && !paused && <p className="objectLabel" role="status">{labels[hover]} <span>↗</span></p>}
  </div>;
}
Workspace.propTypes = { paused: PropTypes.bool.isRequired, reset: PropTypes.number.isRequired, onSelect: PropTypes.func.isRequired, onFailure: PropTypes.func.isRequired };
