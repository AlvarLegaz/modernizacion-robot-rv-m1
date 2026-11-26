// Ejes de coordenadas del robot (X rojo, Y verde, Z azul) en el origen de la base, como referencia visual de las posiciones WH/DS/MP.
// Convenio de three.js: X robot = x, Y robot = -z, Z robot = y (arriba). Unidades: metros.
//   const ejes = crearEjes(THREE, escena, { largo: 0.3 });   ejes.visible = false;   ejes.liberar()

export function crearEjes(THREE, escena, opc) {
  opc = opc || {};
  const L = opc.largo || 0.3;
  const grupo = new THREE.Group();
  const recursos = [];
  const guardar = (r) => { recursos.push(r); return r; };

  function etiqueta(texto, color) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    g.font = '700 46px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 6; g.strokeStyle = 'rgba(0,0,0,0.75)'; g.strokeText(texto, 32, 34);
    g.fillStyle = color; g.fillText(texto, 32, 34);
    const t = guardar(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(guardar(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })));
    s.scale.setScalar(0.06); s.renderOrder = 10;
    return s;
  }

  // dirección en la escena, color, rótulo
  const EJES = [
    [new THREE.Vector3(1, 0, 0), 0xe5484d, '#ff6369', 'X'],
    [new THREE.Vector3(0, 0, -1), 0x3dd68c, '#5ae6a4', 'Y'],
    [new THREE.Vector3(0, 1, 0), 0x3e8bff, '#6aa8ff', 'Z']
  ];
  for (const [dir, color, css, txt] of EJES) {
    const flecha = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), L, color, 0.05, 0.025);
    flecha.line.material.depthTest = false; flecha.cone.material.depthTest = false;
    flecha.line.renderOrder = flecha.cone.renderOrder = 9;
    flecha.line.raycast = flecha.cone.raycast = () => {};
    guardar(flecha.line.geometry); guardar(flecha.cone.geometry); guardar(flecha.line.material); guardar(flecha.cone.material);
    grupo.add(flecha);
    const e = etiqueta(txt, css); e.position.copy(dir).multiplyScalar(L + 0.06); grupo.add(e);
  }
  escena.add(grupo);

  return {
    grupo,
    set visible(v) { grupo.visible = !!v; if (opc.alCambiar) opc.alCambiar(); },
    get visible() { return grupo.visible; },
    liberar() { escena.remove(grupo); for (const r of recursos) if (r.dispose) r.dispose(); }
  };
}
