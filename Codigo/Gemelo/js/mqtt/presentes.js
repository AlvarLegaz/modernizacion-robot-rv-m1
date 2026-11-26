// Presentes: quién está en línea en el broker. Se alimenta de los topics `online` (retenidos, con última voluntad «offline»):
//   rvm1/gemelo/<id>/online  y  rvm1/real/<id>/online      («online» | «offline»)
// El broker solo entrega los topics que la ACL de cada usuario permite leer (un alumno ve su gemelo y los robots reales).
//   const p = crearPresentes();   p.actualizar(topic, texto) → true si ha cambiado algo   p.lista(propio) → [{ destino, id, estado, propio }]
//   p.limpiar()   p.TOPIC → 'rvm1/+/+/online' (para suscribirse)
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const RE = /^rvm1\/(gemelo|real)\/([A-Za-z0-9_-]+)\/online$/;

  function crearPresentes() {
    const m = new Map();
    return {
      TOPIC: 'rvm1/+/+/online',
      actualizar(topic, texto) {
        const r = RE.exec(String(topic));
        if (!r) return false;
        const estado = String(texto).trim().replace(/^"|"$/g, '') === 'online' ? 'online' : 'offline';
        const k = r[1] + '/' + r[2];
        if (m.get(k) === estado) return false;
        m.set(k, estado);
        return true;
      },
      // propio = { destino:'gemelo', id:'07' }: el gemelo de esta página. Orden: robots reales, luego gemelos; en línea primero.
      lista(propio) {
        const out = [...m].map(([k, estado]) => { const [destino, id] = k.split('/'); return { destino, id, estado, propio: !!propio && propio.destino === destino && propio.id === id }; });
        const peso = (x) => (x.destino === 'real' ? 0 : 1) * 10 + (x.estado === 'online' ? 0 : 1);
        return out.sort((a, b) => peso(a) - peso(b) || a.id.localeCompare(b.id));
      },
      limpiar() { m.clear(); }
    };
  }

  const X = { crearPresentes };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.presentes = X; }
})();
