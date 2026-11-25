// Modelo 3D procedural del Mitsubishi Movemaster EX RV-M1 (three.js, sin ficheros .glb).
// Las longitudes CINEMÁTICAS (brazo, antebrazo, altura del hombro, cabeceo→brida, herramienta) salen de config_rvm1.js;
// lo puramente estético (anchos, carcasas, colores) está en ASPECTO, para afinarlo con fotos y medidas del robot real.
//   const r = crearModeloRVM1(escena, config, aspecto, { fantasma });   r.actualizar({ q, apertura, tl, err }) → true si ha cambiado;  r.grupo
//   fantasma: true → robot semitransparente sin base ni sombras (pose del robot real en el modo SOMBRA).
// Convenio: cada articulación es un THREE.Group; el estado solo se lee (q en grados, apertura 0..1).
import * as THREE from '../../lib/three.module.min.js';

// ------------------------------------------------------------------ aspecto (mm, colores). AFINAR con fotos del robot.
export const ASPECTO = {
  colores: {
    crema: 0xe8e3d3,          // carcasas (marfil/crema claro)
    tapa: 0x3b3f45,           // tapas y motores (gris oscuro)
    base: 0x17181a,           // base negra
    aluminio: 0xb9bdc1,       // dedos de la pinza
    goma: 0x222325
  },
  base: { largo: 260, ancho: 220, alto: 55, centroX: -10, radio: 10 },           // caja baja; centroX = centro de la caja respecto al eje J1
  cintura: { radio: 80, alto: 50 },                                                 // tambor giratorio sobre la base
  hombro: { largo: 140, ancho: 150, retroceso: 20, placa: 20, motorRadio: 36, motorLargo: 95 }, // cuerpo del hombro y motor de J2
  brazo: { ancho: 62, alto: 80, coladera: 60, tapaInset: 10 },                     // sección rectangular; coladera = prolongación tras el hombro
  motorCodo: { radio: 30, largo: 70 },                                             // motor de J3 en la cola del brazo
  antebrazo: { ancho: 48, alto: 56, cola: 45 },
  motorMuneca: { largo: 60, alto: 60, ancho: 52 },                                 // motores J4/J5 en la cola del antebrazo
  muneca: { radio: 27, ancho: 64 },
  brida: { radio: 22 },
  pinza: { cuerpoLargo: 48, cuerpoAlto: 46, cuerpoAncho: 74, dedoAncho: 20, dedoGrosor: 8, carrera: 26 },
  etiqueta: 'MOVEMASTER EX'
};

const RAD = Math.PI / 180;

function material(color, rug, metal) { return new THREE.MeshStandardMaterial({ color, roughness: rug == null ? 0.55 : rug, metalness: metal || 0 }); }

// caja con aristas redondeadas, centrada (x = largo, y = alto, z = ancho)
function cajaR(largo, alto, ancho, r) {
  // el bisel de ExtrudeGeometry engorda el contorno: se descuenta para que la caja mida exactamente lo pedido
  const bev = Math.min(3, ancho / 6, largo / 6, alto / 6);
  largo -= 2 * bev; alto -= 2 * bev;
  r = Math.max(0.5, Math.min((r || 6) - bev, largo / 2 - 0.5, alto / 2 - 0.5));
  const s = new THREE.Shape();
  const x = -largo / 2, y = -alto / 2;
  s.moveTo(x + r, y); s.lineTo(x + largo - r, y); s.quadraticCurveTo(x + largo, y, x + largo, y + r);
  s.lineTo(x + largo, y + alto - r); s.quadraticCurveTo(x + largo, y + alto, x + largo - r, y + alto);
  s.lineTo(x + r, y + alto); s.quadraticCurveTo(x, y + alto, x, y + alto - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: ancho - 2 * bev, bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelSegments: 2, curveSegments: 6 });
  g.translate(0, 0, -(ancho - 2 * bev) / 2);
  return g;
}
// cilindro con el eje a lo largo de 'x' | 'y' | 'z', centrado
function cil(r, largo, eje, seg) {
  const g = new THREE.CylinderGeometry(r, r, largo, seg || 32);
  if (eje === 'x') g.rotateZ(Math.PI / 2);
  if (eje === 'z') g.rotateX(Math.PI / 2);
  return g;
}
function malla(geo, mat, x, y, z) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x || 0, y || 0, z || 0);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function texturaEtiqueta(texto) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = '#17181a'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#e9e6dc'; x.font = 'bold 78px "Helvetica Neue", Arial, sans-serif';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(texto, c.width / 2, c.height / 2 + 4);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

export function crearModeloRVM1(escena, config, aspecto, opc) {
  opc = opc || {};
  const A = aspecto || ASPECTO, G = config.geometria, C = A.colores;
  const fantasma = !!opc.fantasma;
  const mat = { crema: material(C.crema, 0.48), tapa: material(C.tapa, 0.5, 0.15), base: material(C.base, 0.6, 0.1), alu: material(C.aluminio, 0.35, 0.8), goma: material(C.goma, 0.9) };
  if (fantasma) for (const k of Object.keys(mat)) {
    const m = mat[k];
    m.transparent = true; m.opacity = 0.32; m.depthWrite = false;
    m.color.lerp(new THREE.Color(0x3d8bff), 0.55); m.emissive = new THREE.Color(0x0a2a66);
  }

  const raiz = new THREE.Group();
  raiz.scale.setScalar(0.001);            // mm → m
  escena.add(raiz);

  // ---------------- base fija (negra) con la etiqueta
  const B = A.base;
  const base = malla(cajaR(B.largo, B.alto, B.ancho, B.radio), mat.base, B.centroX, B.alto / 2, 0);
  if (!fantasma) raiz.add(base);
  const placa = new THREE.Mesh(new THREE.PlaneGeometry(B.ancho * 0.78, B.alto * 0.36), new THREE.MeshStandardMaterial({ map: texturaEtiqueta(A.etiqueta), roughness: 0.5 }));
  placa.rotation.y = Math.PI / 2;
  placa.position.set(base.position.x + B.largo / 2 + 0.6, B.alto * 0.5, 0);
  if (!fantasma) raiz.add(placa);
  // pies de goma
  if (!fantasma) for (const sx of [-1, 1]) for (const sz of [-1, 1]) raiz.add(malla(cil(10, 4, 'y'), mat.goma, base.position.x + sx * (B.largo / 2 - 18), 2, sz * (B.ancho / 2 - 18)));

  // ---------------- J1: cintura
  const j1 = new THREE.Group(); j1.position.y = B.alto; raiz.add(j1);
  const CI = A.cintura;
  j1.add(malla(cil(CI.radio, CI.alto, 'y', 48), mat.crema, 0, CI.alto / 2, 0));
  j1.add(malla(cil(CI.radio + 2, 6, 'y', 48), mat.tapa, 0, 3, 0));                      // junta oscura con la base

  // cuerpo del hombro: columna crema bajo el eje J2 y horquilla con dos placas
  const H = A.hombro, hEje = G.altura_hombro - B.alto;                                    // altura del eje J2 sobre la cintura
  const BR = A.brazo;
  const hueco = BR.ancho + 8;                                                              // separación entre placas
  const libre = 95;                                                                       // radio barrido por la cola del brazo bajo el eje
  const altoCol = hEje - CI.alto - libre;
  j1.add(malla(cajaR(H.largo, altoCol, H.ancho, 14), mat.crema, -H.retroceso, CI.alto + altoCol / 2, 0));
  for (const sz of [-1, 1]) {
    const zc = sz * (hueco / 2 + H.placa / 2);
    j1.add(malla(cajaR(H.largo * 0.8, libre + 6, H.placa, 10), mat.crema, -H.retroceso * 0.5, hEje - libre / 2 - 3, zc));
    j1.add(malla(cil(40, H.placa, 'z'), mat.crema, 0, hEje, zc));
    j1.add(malla(cil(24, 4, 'z'), mat.tapa, 0, hEje, sz * (hueco / 2 + H.placa + 2)));   // tapa del eje
  }
  // motor de J2 (horizontal, detrás del hombro, lado +Z) y su tapa trasera
  j1.add(malla(cil(H.motorRadio, H.motorLargo, 'z'), mat.tapa, -H.largo / 2 - H.retroceso + 10, CI.alto + altoCol * 0.62, H.ancho / 2 - H.motorLargo / 2 + 10));
  j1.add(malla(cajaR(18, altoCol * 0.7, H.ancho * 0.8, 6), mat.tapa, -H.largo / 2 - H.retroceso - 2, CI.alto + altoCol * 0.42, 0));

  // ---------------- J2: hombro (gira sobre Z de three = eje horizontal del plano del brazo)
  const j2 = new THREE.Group(); j2.position.y = hEje; j1.add(j2);
  const Lb = G.brazo;
  j2.add(malla(cajaR(Lb + BR.coladera, BR.alto, BR.ancho, 12), mat.crema, (Lb - BR.coladera) / 2, 0, 0));
  j2.add(malla(cil(BR.alto / 2, BR.ancho, 'z'), mat.crema, Lb, 0, 0));                  // extremo redondeado del codo
  for (const sz of [-1, 1]) {                                                             // tapas laterales grises
    j2.add(malla(cajaR(Lb - 70, BR.alto - 2 * BR.tapaInset, 3, 6), mat.tapa, Lb / 2 + 5, 0, sz * (BR.ancho / 2 + 1)));
    j2.add(malla(cil(20, 3, 'z'), mat.tapa, Lb, 0, sz * (BR.ancho / 2 + 1.5)));
  }
  const MC = A.motorCodo;                                                                 // motor de J3 en la cola del brazo
  j2.add(malla(cil(MC.radio, MC.largo, 'z'), mat.tapa, -BR.coladera + 12, 0, 0));

  // ---------------- J3: codo
  const j3 = new THREE.Group(); j3.position.x = Lb; j2.add(j3);
  const AB = A.antebrazo, La = G.antebrazo;
  const zAnt = BR.ancho / 2 + AB.ancho / 2 + 4;                                         // el antebrazo va junto al brazo (lado +Z)…
  // …pero la cinemática es plana: el antebrazo se dibuja centrado y se ensancha el codo para que parezca abrazar el brazo.
  j3.add(malla(cajaR(La + AB.cola, AB.alto, AB.ancho, 10), mat.crema, (La - AB.cola) / 2, 0, 0));
  j3.add(malla(cil(AB.alto / 2 + 4, BR.ancho + 16, 'z'), mat.crema, 0, 0, 0));
  for (const sz of [-1, 1]) j3.add(malla(cil(18, 3, 'z'), mat.tapa, 0, 0, sz * (BR.ancho / 2 + 9.5)));
  const MM = A.motorMuneca;
  j3.add(malla(cajaR(MM.largo, MM.alto, MM.ancho, 8), mat.tapa, -AB.cola - MM.largo / 2 + 8, 0, 0));

  // ---------------- J4: cabeceo
  const j4 = new THREE.Group(); j4.position.x = La; j3.add(j4);
  const MU = A.muneca;
  j4.add(malla(cil(MU.radio, MU.ancho, 'z'), mat.crema, 0, 0, 0));
  for (const sz of [-1, 1]) j4.add(malla(cil(MU.radio - 6, 4, 'z'), mat.tapa, 0, 0, sz * (MU.ancho / 2 + 1.5)));

  // ---------------- J5: giro (sobre el eje de la mano, X local)
  const j5 = new THREE.Group(); j4.add(j5);
  const dB = G.cabeceo_a_brida;
  j5.add(malla(cil(MU.radio - 4, dB - MU.radio, 'x'), mat.crema, MU.radio + (dB - MU.radio) / 2 - 4, 0, 0));
  j5.add(malla(cil(A.brida.radio, 8, 'x'), mat.tapa, dB - 4, 0, 0));

  // pinza de dos dedos: cuerpo y dedos (se abren a lo largo de Z local)
  const P = A.pinza;
  j5.add(malla(cajaR(P.cuerpoLargo, P.cuerpoAlto, P.cuerpoAncho, 6), mat.tapa, dB + P.cuerpoLargo / 2, 0, 0));
  const largoDedo = Math.max(20, G.herramienta_defecto - P.cuerpoLargo);
  const dedos = [-1, 1].map((sz) => {
    const d = new THREE.Group();
    d.add(malla(new THREE.BoxGeometry(largoDedo, P.dedoAncho, P.dedoGrosor), mat.alu, dB + P.cuerpoLargo + largoDedo / 2, 0, 0));
    d.add(malla(new THREE.BoxGeometry(12, P.dedoAncho, 3), mat.goma, dB + G.herramienta_defecto - 8, 0, -sz * (P.dedoGrosor / 2 + 1.5)));
    j5.add(d);
    return { g: d, sz };
  });

  // marca discreta del TCP (punta de herramienta según TL)
  const tcp = malla(new THREE.SphereGeometry(4, 16, 12), new THREE.MeshBasicMaterial({ color: 0xf2a900 }));
  tcp.castShadow = false;
  j5.add(tcp);

  if (fantasma) raiz.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; o.renderOrder = 2; } });

  let firma = '';
  function actualizar(e) {
    const f = e.q.map((v) => v.toFixed(3)).join(',') + '|' + e.apertura.toFixed(3) + '|' + e.tl + '|' + e.err;
    if (f === firma) return false;
    firma = f;
    j1.rotation.y = e.q[0] * RAD;
    j2.rotation.z = e.q[1] * RAD;
    j3.rotation.z = e.q[2] * RAD;
    j4.rotation.z = e.q[3] * RAD;
    j5.rotation.x = e.q[4] * RAD;
    const sep = P.dedoGrosor / 2 + 4 + e.apertura * P.carrera;
    for (const d of dedos) d.g.position.z = d.sz * sep;
    tcp.position.x = dB + e.tl;
    tcp.visible = Math.abs(e.tl - G.herramienta_defecto) > 0.5;      // solo se ve si TL no coincide con la punta dibujada
    return true;
  }

  return {
    grupo: raiz, actualizar, articulaciones: [j1, j2, j3, j4, j5],
    set visible(v) { raiz.visible = !!v; }, get visible() { return raiz.visible; }
  };
}
