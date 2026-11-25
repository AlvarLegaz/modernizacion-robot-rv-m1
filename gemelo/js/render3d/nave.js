// Nave de taller alrededor de la mesa del robot: suelo de resina gris, paredes de panel sándwich con zócalo,
// tuberías de servicios, pasillo amarillo y rótulo «Mantenimiento electrónico» (mismo aspecto que la nave del simulador de planta real).
// Todo procedural salvo el logo (img/logo-politecnico.png). Solo geometría y materiales: no conoce el robot.
//   const nave = crearNave(THREE, escena, { yPiso, mesa:{ancho,fondo}, mesaX, alCambiar });   nave.liberar()
// Unidades: metros. yPiso = altura del suelo.

function lienzoRuido(n, base, manchas, contraste, semilla, rayas) {
  const c = document.createElement('canvas'); c.width = c.height = n;
  const g = c.getContext('2d');
  let s = semilla >>> 0;
  const azar = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  g.fillStyle = base; g.fillRect(0, 0, n, n);
  for (let i = 0; i < manchas; i++) {
    const x = azar() * n, y = azar() * n, r = 6 + azar() * n * 0.16, d = (azar() - 0.5) * 2 * contraste;
    g.fillStyle = d > 0 ? `rgba(255,255,255,${(d / 255).toFixed(3)})` : `rgba(0,0,0,${(-d / 255).toFixed(3)})`;
    for (const [dx, dy] of [[0, 0], [n, 0], [-n, 0], [0, n], [0, -n]]) { g.beginPath(); g.arc(x + dx, y + dy, r, 0, Math.PI * 2); g.fill(); }
  }
  g.lineWidth = 1;
  for (let i = 0; i < (rayas || 0); i++) {
    const x = azar() * n, y = azar() * n, l = 6 + azar() * 22, a = azar() * Math.PI;
    g.strokeStyle = `rgba(255,255,255,${(0.04 + azar() * 0.06).toFixed(3)})`; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  return c;
}

export function crearNave(THREE, escena, opc) {
  opc = opc || {};
  const Y0 = opc.yPiso != null ? opc.yPiso : -0.72;
  const M = opc.mesa || { ancho: 1.2, fondo: 0.8 };
  const L = 6.0, H = 3.4, h = L / 2;               // nave de 6 × 6 m y 3,4 m de alto
  const grupo = new THREE.Group(); escena.add(grupo);
  const recursos = [];
  const guardar = (r) => { recursos.push(r); return r; };
  const sinRayo = (m) => { m.raycast = () => {}; return m; };
  const textura = (cv, rx, ry) => {
    const t = guardar(new THREE.CanvasTexture(cv));
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  };

  // Suelo de resina epoxi gris con baldosa de ruido de 1,5 m
  const matSuelo = guardar(new THREE.MeshStandardMaterial({
    map: textura(lienzoRuido(256, '#4a545b', 150, 18, 11, 70), L / 1.5, L / 1.5), roughness: 0.62, metalness: 0.0 }));
  const suelo = new THREE.Mesh(guardar(new THREE.PlaneGeometry(L, L)), matSuelo);
  suelo.rotation.x = -Math.PI / 2; suelo.position.y = Y0; suelo.receiveShadow = true; grupo.add(suelo);

  // Paredes de panel sándwich blanco con nervios verticales y una junta cada 1,1 m
  const cv = lienzoRuido(256, '#c9cfd3', 40, 7, 5, 0), g = cv.getContext('2d');
  for (let x = 8; x < 256; x += 16) { g.fillStyle = 'rgba(0,0,0,0.09)'; g.fillRect(x, 0, 2, 256); g.fillStyle = 'rgba(255,255,255,0.14)'; g.fillRect(x + 2, 0, 1, 256); }
  g.fillStyle = 'rgba(0,0,0,0.28)'; g.fillRect(0, 0, 3, 256);
  const matPared = guardar(new THREE.MeshStandardMaterial({ map: textura(cv, L / 1.1, 1), roughness: 0.55, metalness: 0.1 }));
  const matZocalo = guardar(new THREE.MeshStandardMaterial({ color: 0x6f7b84, roughness: 0.4, metalness: 0.7 }));
  const matTubo = guardar(new THREE.MeshStandardMaterial({ color: 0x9aa3ab, roughness: 0.45, metalness: 0.6 }));
  const Yc = Y0 + H / 2;
  const paredes = [
    { rotY: 0, x: 0, z: -h },                 // fondo, mira a +z
    { rotY: Math.PI, x: 0, z: h },            // frente, mira a -z
    { rotY: Math.PI / 2, x: -h, z: 0 },       // izquierda, mira a +x
    { rotY: -Math.PI / 2, x: h, z: 0 }        // derecha, mira a -x
  ];
  for (const p of paredes) {
    const w = new THREE.Mesh(guardar(new THREE.PlaneGeometry(L, H)), matPared);
    w.rotation.y = p.rotY; w.position.set(p.x, Yc, p.z); w.receiveShadow = true; grupo.add(w);
    const lado = new THREE.Group(); lado.rotation.y = p.rotY; lado.position.set(p.x, 0, p.z); grupo.add(lado);
    const zoc = sinRayo(new THREE.Mesh(guardar(new THREE.BoxGeometry(L, 0.3, 0.03)), matZocalo)); zoc.position.set(0, Y0 + 0.15, 0.015); lado.add(zoc);
    // tuberías de servicios (vapor, aire, agua) con bandas de color
    [[2.3, 0xc0392b], [2.12, 0x2e86de], [1.94, 0x27ae60]].forEach(([y, banda]) => {
      const t = sinRayo(new THREE.Mesh(guardar(new THREE.CylinderGeometry(0.03, 0.03, L - 0.4, 12)), matTubo));
      t.rotation.z = Math.PI / 2; t.position.set(0, Y0 + y, 0.12); lado.add(t);
      const matBanda = guardar(new THREE.MeshStandardMaterial({ color: banda, roughness: 0.5 }));
      for (let x = -L / 2 + 0.6; x < L / 2 - 0.4; x += 1.6) {
        const b = sinRayo(new THREE.Mesh(guardar(new THREE.CylinderGeometry(0.034, 0.034, 0.08, 12)), matBanda));
        b.rotation.z = Math.PI / 2; b.position.set(x + 0.4, Y0 + y, 0.12); lado.add(b);
        const m = sinRayo(new THREE.Mesh(guardar(new THREE.BoxGeometry(0.02, 0.02, 0.12)), matZocalo)); m.position.set(x, Y0 + y - 0.04, 0.06); lado.add(m);
      }
    });
    if (p.rotY === 0 || p.rotY === Math.PI / 2) {
      // rótulo «Mantenimiento electrónico» en la pared del fondo (el logo se pinta al cargar)
      const lz = document.createElement('canvas'); lz.width = 1536; lz.height = 340;
      const c = lz.getContext('2d'), tx = guardar(new THREE.CanvasTexture(lz)); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
      const pintar = (logo) => {
        c.fillStyle = '#f4f6f7'; c.fillRect(0, 0, 1536, 340); c.fillStyle = '#f68b11'; c.fillRect(0, 326, 1536, 14);
        if (logo) { const alto = 190, ancho = alto * (logo.naturalWidth || 166) / (logo.naturalHeight || 60); c.drawImage(logo, 50, 60, ancho, alto); }
        c.fillStyle = '#5a5758'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.font = '800 98px system-ui, sans-serif';
        c.fillText('MANTENIMIENTO', 640, 120); c.fillText('ELECTRÓNICO', 640, 235);
        tx.needsUpdate = true;
      };
      pintar(null);
      if (typeof Image !== 'undefined') {
        const logo = new Image(); logo.onload = () => { pintar(logo); if (opc.alCambiar) opc.alCambiar(); };
        logo.src = new URL('../../img/logo-politecnico.png', import.meta.url).href;
      }
      const dx = p.rotY === 0 ? -1.3 : 1.3;      // hacia la esquina que ve la cámara inicial
      const R = { ancho: 2.4, alto: 0.53, y: Y0 + 0.85 };
      const rot = sinRayo(new THREE.Mesh(guardar(new THREE.PlaneGeometry(R.ancho, R.alto)), guardar(new THREE.MeshBasicMaterial({ map: tx }))));
      rot.position.set(dx, R.y, 0.02); lado.add(rot);
      const marco = sinRayo(new THREE.Mesh(guardar(new THREE.BoxGeometry(R.ancho + 0.04, R.alto + 0.04, 0.01)), matZocalo)); marco.position.set(dx, R.y, 0.012); lado.add(marco);
    }
  }

  // Pasillo marcado en amarillo alrededor de la mesa
  const matAmarillo = guardar(new THREE.MeshStandardMaterial({ color: 0xd6b11e, roughness: 0.7 }));
  const ax = M.ancho / 2 + 0.45, az = M.fondo / 2 + 0.45, gr = 0.05, cx = opc.mesaX != null ? opc.mesaX : 0.15;
  for (const [w, d, x, z] of [[2 * ax, gr, cx, -az], [2 * ax, gr, cx, az], [gr, 2 * az, cx - ax, 0], [gr, 2 * az, cx + ax, 0]]) {
    const m = sinRayo(new THREE.Mesh(guardar(new THREE.PlaneGeometry(w, d)), matAmarillo)); m.rotation.x = -Math.PI / 2; m.position.set(x, Y0 + 0.002, z); m.receiveShadow = true; grupo.add(m);
  }

  return {
    liberar() { escena.remove(grupo); for (const r of recursos) if (r.dispose) r.dispose(); }
  };
}
