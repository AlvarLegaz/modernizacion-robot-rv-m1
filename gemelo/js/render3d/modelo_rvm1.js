// Modelo 3D procedural del Mitsubishi Movemaster EX RV-M1 (three.js, sin ficheros .glb).
// Las longitudes CINEMÁTICAS (brazo, antebrazo, altura del hombro, cabeceo→brida, herramienta) salen de config_rvm1.js;
// lo puramente estético (anchos, carcasas, colores) está en ASPECTO, para afinarlo con fotos y medidas del robot real.
//   const r = crearModeloRVM1(escena, config, aspecto, { fantasma });   r.actualizar({ q, apertura, tl, err }) → true si ha cambiado;  r.grupo
//   fantasma: true → robot semitransparente sin base ni sombras (pose del robot real en el modo SOMBRA).
// Convenio: cada articulación es un THREE.Group; el estado solo se lee (q en grados, apertura 0..1).
import * as THREE from '../../lib/three.module.min.js';

// ------------------------------------------------------------------ aspecto (mm, colores). AFINAR con fotos del robot.
export const ASPECTO = {
  // Referencia: fotos del robot real (la amarillenta manda en los colores). Carcasas marfil cálido satinado.
  colores: {
    crema: 0xf0e4bb,          // carcasas (marfil/crema amarillento cálido)
    tapa: 0x4b4e53,           // anillos, tornillería y motores (gris oscuro)
    base: 0xb3aa92,           // placa y pedestal (beige grisáceo, algo más oscuro que las carcasas)
    aluminio: 0x2a2b2e,       // dedos de la pinza (negros)
    goma: 0x16171a,           // pinza, cable y pies (negro)
    texto: 0x2b2e33
  },
  // base en dos niveles: placa inferior cuadrada + pedestal prismático alto con cajetín de conectores atrás
  base: { largo: 270, ancho: 250, alto: 125, centroX: 0, radio: 10, placaAlto: 20, pedLargo: 190, pedAncho: 190, caja: { largo: 44, alto: 78, ancho: 100 } },
  cintura: { radio: 84, alto: 24 },                                                 // anillo de la cintura (gris oscuro) sobre el pedestal
  hombro: { largo: 150, ancho: 150, retroceso: 30, placa: 20, motorRadio: 36, motorLargo: 95, tambor: 56 }, // carcasa del hombro; tambor = tapa redonda lateral grande
  brazo: { ancho: 62, alto: 80, coladera: 60, tapaInset: 10 },                     // sección rectangular; coladera = prolongación tras el hombro
  motorCodo: { radio: 30, largo: 70 },                                             // motor de J3 en la cola del brazo
  antebrazo: { ancho: 48, alto: 56, cola: 45 },
  motorMuneca: { largo: 60, alto: 60, ancho: 52 },                                 // motores J4/J5 en la cola del antebrazo
  muneca: { radio: 27, ancho: 64 },
  brida: { radio: 22 },
  pinza: { cuerpoLargo: 48, cuerpoAlto: 46, cuerpoAncho: 74, dedoAncho: 20, dedoGrosor: 8, carrera: 26 },
  cable: { vueltas: 16, radioEspira: 9, grosor: 2.6 },                              // cable rizado negro del hombro a la base
  rotulos: { brazo: 'MOVEMASTER', brazoEx: 'EX', hombro: 'MITSUBISHI' }          // texto plano, sin logotipos
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

// Rótulo de texto plano (fondo transparente, tipografía neutra): partes = [[texto, '#color'], ...] en una línea
function texturaRotulo(partes, ancho, alto, fuente) {
  const c = document.createElement('canvas'); c.width = ancho; c.height = alto;
  const x = c.getContext('2d');
  x.font = fuente; x.textBaseline = 'middle'; x.textAlign = 'left';
  const total = partes.reduce((s, p) => s + x.measureText(p[0]).width, 0);
  let px = (ancho - total) / 2;
  for (const [txt, col] of partes) { x.fillStyle = col; x.fillText(txt, px, alto / 2 + 2); px += x.measureText(txt).width; }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
// plano con un rótulo, mirando hacia +Z local (para -Z se gira 180° sobre Y)
function planoRotulo(tex, w, h) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.6, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.castShadow = false; m.receiveShadow = false; m.renderOrder = 1;
  return m;
}
// cable rizado: espiral de radio r alrededor de una línea central (puntos de control), tubo negro
function cableRizado(puntos, vueltas, r, grosor) {
  const centro = new THREE.CatmullRomCurve3(puntos.map((p) => new THREE.Vector3(...p)));
  const n = vueltas * 24, pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, c = centro.getPoint(u), tg = centro.getTangent(u);
    const a = new THREE.Vector3().crossVectors(tg, new THREE.Vector3(0, 0, 1)); if (a.lengthSq() < 1e-6) a.set(1, 0, 0); a.normalize();
    const b = new THREE.Vector3().crossVectors(tg, a).normalize();
    const th = u * vueltas * Math.PI * 2;
    pts.push(c.clone().addScaledVector(a, Math.cos(th) * r).addScaledVector(b, Math.sin(th) * r));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n, grosor, 6, false);
}

export function crearModeloRVM1(escena, config, aspecto, opc) {
  opc = opc || {};
  const A = aspecto || ASPECTO, G = config.geometria, C = A.colores;
  const fantasma = !!opc.fantasma;
  // acabado satinado (rugosidad media), no brillante
  const mat = { crema: material(C.crema, 0.62), tapa: material(C.tapa, 0.6, 0.1), base: material(C.base, 0.7), alu: material(C.aluminio, 0.5, 0.1), goma: material(C.goma, 0.8) };
  if (fantasma) for (const k of Object.keys(mat)) {
    const m = mat[k];
    m.transparent = true; m.opacity = 0.32; m.depthWrite = false;
    m.color.lerp(new THREE.Color(0x3d8bff), 0.55); m.emissive = new THREE.Color(0x0a2a66);
  }

  const raiz = new THREE.Group();
  raiz.scale.setScalar(0.001);            // mm → m
  escena.add(raiz);

  // ---------------- base fija en dos niveles: placa inferior cuadrada y pedestal prismático con cajetín trasero de conectores
  const B = A.base;
  if (!fantasma) {
    raiz.add(malla(cajaR(B.largo, B.placaAlto, B.ancho, 8), mat.base, B.centroX, B.placaAlto / 2, 0));
    const altoPed = B.alto - B.placaAlto;
    raiz.add(malla(cajaR(B.pedLargo, altoPed, B.pedAncho, 14), mat.base, B.centroX, B.placaAlto + altoPed / 2, 0));
    const cj = B.caja;                                                                // cajetín de conectores (detrás, lado -X)
    const xcj = B.centroX - B.pedLargo / 2 - cj.largo / 2 + 6, ycj = B.placaAlto + cj.alto / 2 + 6;
    raiz.add(malla(cajaR(cj.largo, cj.alto, cj.ancho, 6), mat.base, xcj, ycj, 0));
    for (const sz of [-1, 1]) {                                                       // conectores (cilindros negros)
      raiz.add(malla(cil(9, 10, 'x', 16), mat.goma, xcj - cj.largo / 2 - 3, ycj + 10, sz * 26));
      raiz.add(malla(cil(6, 10, 'x', 16), mat.tapa, xcj - cj.largo / 2 - 3, ycj - 16, sz * 26));
    }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {                             // tornillos de la placa y pies de goma
      raiz.add(malla(cil(7, 3, 'y', 12), mat.tapa, B.centroX + sx * (B.largo / 2 - 16), B.placaAlto + 1, sz * (B.ancho / 2 - 16)));
      raiz.add(malla(cil(10, 4, 'y'), mat.goma, B.centroX + sx * (B.largo / 2 - 18), 2, sz * (B.ancho / 2 - 18)));
    }
  }

  // ---------------- J1: cintura (anillo gris oscuro sobre el pedestal)
  const j1 = new THREE.Group(); j1.position.y = B.alto; raiz.add(j1);
  const CI = A.cintura;
  j1.add(malla(cil(CI.radio, CI.alto, 'y', 48), mat.tapa, 0, CI.alto / 2, 0));
  j1.add(malla(cil(CI.radio - 8, 6, 'y', 48), mat.crema, 0, CI.alto + 3, 0));            // asiento de la carcasa del hombro

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
    // tambor: tapa lateral redonda grande en el eje del hombro (aro gris oscuro y tapa crema)
    const zt = sz * (hueco / 2 + H.placa);
    j1.add(malla(cil(H.tambor + 3, 4, 'z', 48), mat.tapa, 0, hEje, zt + sz * 2));
    j1.add(malla(cil(H.tambor, 10, 'z', 48), mat.crema, 0, hEje, zt + sz * 7));
    j1.add(malla(cil(18, 3, 'z', 24), mat.tapa, 0, hEje, zt + sz * 13));
  }
  // «MITSUBISHI» pequeño en el cuerpo del hombro, junto al tambor (texto plano)
  const texMit = texturaRotulo([[A.rotulos.hombro, '#c8102e']], 512, 64, '700 44px "Helvetica Neue", Arial, sans-serif');
  for (const sz of [-1, 1]) {
    const r = planoRotulo(texMit, 60, 7.5); r.position.set(-H.retroceso - H.largo * 0.27, CI.alto + altoCol * 0.55, sz * (H.ancho / 2 + 0.8));
    if (sz < 0) r.rotation.y = Math.PI; j1.add(r);
  }
  // cable rizado negro: baja por detrás del hombro hasta el cajetín de la base (gira con la cintura)
  if (!fantasma) {
    const xc = -H.largo / 2 - H.retroceso - 6, CB = A.cable;
    const cable = malla(cableRizado([[xc, CI.alto + altoCol * 0.35, 20], [xc - 22, CI.alto - 10, 24], [xc - 34, -50, 20], [-B.pedLargo / 2 - B.caja.largo - 6, -50, 26]], CB.vueltas, CB.radioEspira, CB.grosor), mat.goma);
    j1.add(cable);
  }
  // motor de J2 (horizontal, detrás del hombro, lado +Z) y su tapa trasera
  j1.add(malla(cil(H.motorRadio, H.motorLargo, 'z'), mat.tapa, -H.largo / 2 - H.retroceso + 10, CI.alto + altoCol * 0.62, H.ancho / 2 - H.motorLargo / 2 + 10));
  j1.add(malla(cajaR(18, altoCol * 0.7, H.ancho * 0.8, 6), mat.tapa, -H.largo / 2 - H.retroceso - 2, CI.alto + altoCol * 0.42, 0));

  // ---------------- J2: hombro (gira sobre Z de three = eje horizontal del plano del brazo)
  const j2 = new THREE.Group(); j2.position.y = hEje; j1.add(j2);
  const Lb = G.brazo;
  j2.add(malla(cajaR(Lb + BR.coladera, BR.alto, BR.ancho, 12), mat.crema, (Lb - BR.coladera) / 2, 0, 0));
  j2.add(malla(cil(BR.alto / 2, BR.ancho, 'z'), mat.crema, Lb, 0, 0));                  // extremo redondeado del codo
  // «MOVEMASTER EX» a lo largo del lateral del brazo, cerca del codo (texto plano; EX en azul)
  const texBrazo = texturaRotulo([[A.rotulos.brazo + ' ', '#2b2e33'], [A.rotulos.brazoEx, '#1f4fb4']], 1024, 96, '800 76px "Helvetica Neue", Arial, sans-serif');
  for (const sz of [-1, 1]) {
    j2.add(malla(cil(20, 3, 'z'), mat.tapa, Lb, 0, sz * (BR.ancho / 2 + 1.5)));       // tapa del codo
    const r = planoRotulo(texBrazo, 150, 14); r.position.set(Lb * 0.6, 0, sz * (BR.ancho / 2 + 1.2));
    if (sz < 0) r.rotation.y = Math.PI; j2.add(r);
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
  j5.add(malla(cajaR(P.cuerpoLargo, P.cuerpoAlto, P.cuerpoAncho, 6), mat.goma, dB + P.cuerpoLargo / 2, 0, 0));                  // pinza: caja negra
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
