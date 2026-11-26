// Escena 3D base: renderizador, luces con sombras suaves, mesa de trabajo y cámara orbital propia (ratón y táctil).
// Solo LEE el estado; no conoce la controladora. Render bajo demanda: pedir() marca que hay que volver a pintar.
//   const e = crearEscena(contenedor, { vistaInicial: { az, el, dist, obj:[x,y,z] } });
//   e.escena, e.camara, e.pedir(), e.vistaInicial(), e.alAntesDeRender(fn), e.liberar()
// Unidades de la escena: metros. Eje Y de three.js = Z del robot (vertical).
import * as THREE from '../../lib/three.module.min.js';
import { crearNave } from './nave.js';

export function crearEscena(contenedor, opc) {
  opc = opc || {};
  const V0 = Object.assign({ az: 0.8, el: 0.38, dist: 1.6, obj: [0.1, 0.22, 0] }, opc.vistaInicial || {});
  const LIM = { distMin: 0.35, distMax: 4.0, elMin: -0.05, elMax: 1.5 };

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: !!opc.preservar });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label', opc.aria || 'Modelo 3D del robot');
  renderer.domElement.setAttribute('role', 'img');
  contenedor.appendChild(renderer.domElement);

  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x9aa3ab);
  const camara = new THREE.PerspectiveCamera(36, 1, 0.02, 20);

  // ---- luces: cielo/suelo + clave con sombra suave + relleno
  escena.add(new THREE.HemisphereLight(0xffffff, 0x8a8f96, 1.1));
  const clave = new THREE.DirectionalLight(0xffffff, 2.0);
  clave.position.set(1.2, 2.2, 1.4);
  clave.castShadow = true;
  clave.shadow.mapSize.set(2048, 2048);
  clave.shadow.radius = 6;
  clave.shadow.bias = -0.0004;
  clave.shadow.normalBias = 0.01;
  const sc = clave.shadow.camera; sc.left = -0.8; sc.right = 0.8; sc.top = 0.8; sc.bottom = -0.8; sc.near = 0.5; sc.far = 5;
  escena.add(clave);
  const relleno = new THREE.DirectionalLight(0xe8f0ff, 0.6);
  relleno.position.set(-1.5, 1.0, -0.8);
  escena.add(relleno);

  // ---- mesa de trabajo (tablero gris claro con canto oscuro) y suelo
  const M = opc.mesa || { ancho: 1.2, fondo: 0.8, grosor: 0.03, altura: 0.72 };
  const mesa = new THREE.Group();
  const tablero = new THREE.Mesh(new THREE.BoxGeometry(M.ancho, M.grosor, M.fondo), new THREE.MeshStandardMaterial({ color: 0xc9cdd1, roughness: 0.75 }));
  tablero.position.y = -M.grosor / 2; tablero.receiveShadow = true; mesa.add(tablero);
  const canto = new THREE.Mesh(new THREE.BoxGeometry(M.ancho + 0.004, 0.012, M.fondo + 0.004), new THREE.MeshStandardMaterial({ color: 0x3a3f45, roughness: 0.6 }));
  canto.position.y = -M.grosor - 0.006; mesa.add(canto);
  const matPata = new THREE.MeshStandardMaterial({ color: 0x5b6168, roughness: 0.5, metalness: 0.4 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const pata = new THREE.Mesh(new THREE.BoxGeometry(0.04, M.altura - M.grosor, 0.04), matPata);
    pata.position.set(sx * (M.ancho / 2 - 0.05), -M.grosor - (M.altura - M.grosor) / 2, sz * (M.fondo / 2 - 0.05));
    pata.castShadow = true; mesa.add(pata);
  }
  mesa.position.x = 0.15;    // el robot queda hacia el fondo-izquierda de la mesa, con sitio delante para piezas
  escena.add(mesa);
  // nave de taller (suelo, paredes, tuberías, rótulo): ver nave.js
  const nave = crearNave(THREE, escena, { yPiso: -M.altura, mesa: M, mesaX: mesa.position.x, alCambiar: () => pedir() });

  // ---- cámara orbital
  const orb = { az: V0.az, el: V0.el, dist: V0.dist, obj: new THREE.Vector3(...V0.obj) };
  function colocarCamara() {
    orb.el = Math.max(LIM.elMin, Math.min(LIM.elMax, orb.el));
    orb.dist = Math.max(LIM.distMin, Math.min(LIM.distMax, orb.dist));
    const c = Math.cos(orb.el);
    camara.position.set(orb.obj.x + orb.dist * c * Math.cos(orb.az), orb.obj.y + orb.dist * Math.sin(orb.el), orb.obj.z + orb.dist * c * Math.sin(orb.az));
    camara.lookAt(orb.obj);
    pedir();
  }
  function desplazar(dx, dy) {          // paneo en el plano de la pantalla (píxeles)
    const h = renderer.domElement.clientHeight || 1;
    const k = 2 * orb.dist * Math.tan((camara.fov * Math.PI) / 360) / h;
    const der = new THREE.Vector3().setFromMatrixColumn(camara.matrix, 0);
    const arr = new THREE.Vector3().setFromMatrixColumn(camara.matrix, 1);
    orb.obj.addScaledVector(der, -dx * k).addScaledVector(arr, dy * k);
    orb.obj.y = Math.max(-0.2, Math.min(1.0, orb.obj.y));
    colocarCamara();
  }

  const el = renderer.domElement;
  el.style.touchAction = 'none';
  const punteros = new Map();
  let gesto = null;
  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture(e.pointerId);
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY, boton: e.button, shift: e.shiftKey });
    gesto = null;
  });
  el.addEventListener('pointermove', (e) => {
    const p = punteros.get(e.pointerId); if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    if (punteros.size === 1) {
      if (p.boton === 2 || p.boton === 1 || p.shift) desplazar(dx, dy);
      else { orb.az += dx * 0.008; orb.el += dy * 0.006; colocarCamara(); }
    } else if (punteros.size === 2) {
      const [a, b] = [...punteros.values()];
      const d0 = Math.hypot(a.x - b.x, a.y - b.y);
      const m0 = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      p.x = e.clientX; p.y = e.clientY;
      const [a2, b2] = [...punteros.values()];
      const d1 = Math.hypot(a2.x - b2.x, a2.y - b2.y);
      const m1 = { x: (a2.x + b2.x) / 2, y: (a2.y + b2.y) / 2 };
      if (d1 > 0 && d0 > 0) { orb.dist *= d0 / d1; }
      desplazar(m1.x - m0.x, m1.y - m0.y);
      return;
    }
    p.x = e.clientX; p.y = e.clientY;
  });
  const soltar = (e) => { punteros.delete(e.pointerId); };
  el.addEventListener('pointerup', soltar);
  el.addEventListener('pointercancel', soltar);
  el.addEventListener('contextmenu', (e) => e.preventDefault());
  el.addEventListener('wheel', (e) => { e.preventDefault(); orb.dist *= Math.exp(e.deltaY * 0.0012); colocarCamara(); }, { passive: false });
  el.addEventListener('dblclick', () => vistaInicial());

  function vistaInicial() { orb.az = V0.az; orb.el = V0.el; orb.dist = V0.dist; orb.obj.set(...V0.obj); colocarCamara(); }

  // ---- tamaño y bucle de render bajo demanda
  let sucio = true, rafId = 0;
  const antes = [];
  function redimensionar() {
    const w = Math.max(1, contenedor.clientWidth), h = Math.max(1, contenedor.clientHeight);
    renderer.setSize(w, h, false);
    el.style.width = w + 'px'; el.style.height = h + 'px';
    camara.aspect = w / h;
    // en pantallas muy verticales se aleja un poco la cámara para que el robot quepa a lo ancho
    camara.fov = w / h < 0.9 ? 46 : 36;
    camara.updateProjectionMatrix();
    // setSize borra el lienzo: se pinta en el acto para no dejarlo vacío hasta el siguiente fotograma
    renderer.render(escena, camara);
    pedir();
  }
  function pedir() { sucio = true; }
  function bucle() {
    rafId = requestAnimationFrame(bucle);
    for (const f of antes) f();
    if (!sucio) return;
    sucio = false;
    renderer.render(escena, camara);
  }
  const ro = new ResizeObserver(redimensionar);
  ro.observe(contenedor);
  redimensionar(); colocarCamara(); bucle();

  return {
    THREE, escena, camara, renderer, pedir, vistaInicial, nave,
    alAntesDeRender(fn) { antes.push(fn); },
    renderizarYa() { renderer.render(escena, camara); },
    liberar() { cancelAnimationFrame(rafId); ro.disconnect(); renderer.dispose(); }
  };
}
