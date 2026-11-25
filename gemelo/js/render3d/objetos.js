// Objetos de la escena de prácticas: cubo y mesita (posiciones de js/modelo/config_escena.js, estado de js/modelo/mundo.js).
// Coordenadas del robot (mm) → escena (m): x → x, y → -z, z → y (arriba). Solo lee el estado.
//   const o = crearObjetos(THREE, escena, ESC);   o.actualizar(estadoMundo) → true si el cubo se ha movido;   o.liberar()
export function crearObjetos(THREE, escena, ESC) {
  const grupo = new THREE.Group(); escena.add(grupo);
  const mm = 0.001;
  const M = ESC.mesita, L = ESC.cubo.lado;

  const mesita = new THREE.Mesh(new THREE.BoxGeometry(M.largo * mm, M.alto * mm, M.ancho * mm),
    new THREE.MeshStandardMaterial({ color: M.color, roughness: 0.65 }));
  mesita.position.set(M.x * mm, M.alto * mm / 2, -M.y * mm);
  mesita.castShadow = mesita.receiveShadow = true; grupo.add(mesita);

  const cubo = new THREE.Mesh(new THREE.BoxGeometry(L * mm, L * mm, L * mm),
    new THREE.MeshStandardMaterial({ color: ESC.cubo.color, roughness: 0.5 }));
  cubo.castShadow = cubo.receiveShadow = true; grupo.add(cubo);
  const borde = new THREE.LineSegments(new THREE.EdgesGeometry(cubo.geometry), new THREE.LineBasicMaterial({ color: 0x7a2a0a }));
  cubo.add(borde);

  let firma = '';
  return {
    cubo, mesita,
    actualizar(est) {
      const c = est.cubo, f = c.x.toFixed(2) + ',' + c.y.toFixed(2) + ',' + c.z.toFixed(2);
      if (f === firma) return false;
      firma = f;
      cubo.position.set(c.x * mm, c.z * mm, -c.y * mm);
      return true;
    },
    liberar() { escena.remove(grupo); grupo.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); }
  };
}
