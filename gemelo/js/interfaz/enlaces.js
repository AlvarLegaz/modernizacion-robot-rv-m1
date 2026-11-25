// Enlaces del teach pendant. El pendant no sabe con quién habla; usa siempre este interfaz:
//   tipo, etiqueta, estado() → { conectado, referenciado, error, motivoError, sp, pose, valida, pinza, ocupado, pendientes, puntos[] }
//   home() reset() velocidad(sp) jogArticular(eje, grados) jogMundo(dx, dy, dz) pinza('abrir'|'cerrar')
//   guardarPunto(n) irAPunto(n) vaciar() alAviso(fn) cerrar()
//
// - Local: como rvm1_pendant.py conectado por RS-232C: envía texto RV-M1 a la controladora emulada, una orden cada vez,
//   y tras cada una pregunta ER (supuesto S1: ER responde al acabar). Puntos con HE n / MO n en la controladora.
// - MQTT: habla el contrato v0.3 (solo publica en `comandos`). El contrato v0.3 no tiene HE/MO, así que los puntos se
//   guardan en el propio pendant (posición de posicion/mundo) y "ir" se hace con mover_pose. Ver README.
'use strict';

const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);

export function crearEnlaceLocal(ctrl) {
  let cola = [], esperando = false, sp = null;
  const avisos = [];
  const aviso = (t, nivel) => avisos.forEach((f) => f(t, nivel || 'alarma'));

  function bombear() {
    if (esperando || !cola.length) return;
    const it = cola.shift();
    esperando = true;
    ctrl.enviar(it.linea);
    ctrl.enviar('ER', (r) => {
      esperando = false;
      const er = parseInt(r, 10);
      if (it.alFin) it.alFin(er);
      bombear();
    });
  }
  const enviar = (linea, alFin) => { cola.push({ linea, alFin }); bombear(); };

  return {
    tipo: 'local', etiqueta: 'LOCAL', destino: 'gemelo',
    estado() {
      const e = ctrl.estado();
      return {
        conectado: true, referenciado: e.referenciado, error: e.err, motivoError: e.motivoError, sp,
        pose: e.pose, valida: e.referenciado, pinza: e.pinza, ocupado: esperando || e.ocupado,
        pendientes: cola.length + (esperando ? 1 : 0), puntos: e.posiciones
      };
    },
    home: () => enviar('NT'),
    reset: () => enviar('RS'),
    velocidad: (n) => { sp = n; enviar('SP ' + n); },
    jogArticular: (eje, g) => enviar('DJ ' + eje + ',' + f1(g)),
    jogMundo: (dx, dy, dz) => enviar('DS ' + [dx, dy, dz].map(f1).join(',')),
    pinza: (a) => enviar(a === 'abrir' ? 'GO' : 'GC'),
    guardarPunto: (n) => { enviar('HE ' + n, (er) => { if (er === 0) aviso('Punto ' + n + ' guardado (HE ' + n + ').', 'info'); }); return true; },
    irAPunto: (n) => { enviar('MO ' + n); return true; },
    vaciar: () => { cola = []; },
    alAviso: (fn) => avisos.push(fn),
    cerrar() { cola = []; }
  };
}

export function crearEnlaceMqtt(cliente, opc) {
  opc = opc || {};
  const avisos = [];
  const aviso = (t, nivel) => avisos.forEach((f) => f(t, nivel || 'alarma'));
  const clave = 'rvm1.puntos.' + cliente.destino + '.' + cliente.id;
  let puntos = [];
  try { puntos = JSON.parse(localStorage.getItem(clave) || '[]'); } catch (e) { puntos = []; }
  const guardar = () => { try { localStorage.setItem(clave, JSON.stringify(puntos)); } catch (e) { /* sin almacenamiento */ } };
  const sinAck = new Map();        // id → t de envío (vigilancia de "sin respuesta")
  let sp = null, ultimoAvisoSilencio = 0;

  cliente.alCambio((ev) => {
    if (ev.tipo !== 'ack') return;
    const a = ev.datos;
    sinAck.delete(a.id);
    const cmd = ev.comando ? ev.comando.cmd : '';
    if (a.estado === 'rechazado') aviso('Rechazado ' + cmd + ': ' + a.motivo + (a.motivo === 'no_referenciado' ? ' (haz HOME)' : a.motivo === 'error_activo' ? ' (RESET y, si fue modo I, HOME)' : ''));
    else if (a.estado === 'error') aviso('ERROR tras ' + cmd + ': ER=' + a.er + (a.er === 1 ? ' (modo I, hardware)' : ' (modo II, comando)'));
  });

  const enviar = (cmd, args) => { const id = cliente.enviar(cmd, args); sinAck.set(id, Date.now()); return id; };

  return {
    tipo: 'mqtt', destino: cliente.destino,
    etiqueta: cliente.destino === 'real' ? 'REAL MQTT' : 'GEMELO MQTT',
    estado() {
      const a = cliente.actuadores, p = cliente.posicion;
      const t = Date.now();
      for (const [id, t0] of sinAck) {
        if (t - t0 > 2000) {
          sinAck.delete(id);
          if (t - ultimoAvisoSilencio > 3000) { ultimoAvisoSilencio = t; aviso('Sin respuesta de rvm1/' + cliente.destino + '/' + cliente.id + ' (¿gemelo/placa sin conectar o sin permiso en el broker?).'); }
        }
      }
      return {
        conectado: !!(opc.transporte && opc.transporte.conectado) && cliente.online === 'online',
        referenciado: !!(a && a.referenciado), error: a ? a.error : 0, motivoError: null, sp,
        pose: p ? { x: p.x, y: p.y, z: p.z, p: p.pitch, r: p.roll } : null, valida: !!(p && p.valida),
        pinza: a ? a.pinza : 'desconocida', ocupado: !!(a && a.ocupado),
        pendientes: cliente.pendientes(), puntos: puntos.slice()
      };
    },
    home: () => enviar('home'),
    reset: () => enviar('reset'),
    velocidad: (n) => { sp = n; enviar('velocidad', { sp: n }); },
    jogArticular: (eje, g) => enviar('jog_articular', { eje, grados: Math.round(g * 10) / 10 }),
    jogMundo: (dx, dy, dz) => enviar('jog_mundo', { dx, dy, dz }),
    pinza: (accion) => enviar('pinza', { accion }),
    guardarPunto(n) {
      const p = cliente.posicion;
      if (!p || !p.valida) { aviso('No hay posición válida para guardar (haz HOME).'); return false; }
      puntos = puntos.filter((x) => x.n !== n);
      puntos.push({ n, pose: { x: p.x, y: p.y, z: p.z, p: p.pitch, r: p.roll } });
      puntos.sort((u, v) => u.n - v.n);
      guardar();
      aviso('Punto ' + n + ' guardado en el pendant (el contrato v0.3 no tiene HE).', 'info');
      return true;
    },
    irAPunto(n) {
      const pt = puntos.find((x) => x.n === n);
      if (!pt) { aviso('Punto ' + n + ' no definido.'); return false; }
      enviar('mover_pose', { x: pt.pose.x, y: pt.pose.y, z: pt.pose.z, pitch: pt.pose.p, roll: pt.pose.r });
      return true;
    },
    vaciar() { if (cliente.pendientes() > 0) { enviar('parar'); } cliente.olvidarPendientes(); },
    alAviso: (fn) => avisos.push(fn),
    cerrar() {}
  };
}

// Modo SINCRONIZADO: el pendant solo muestra el robot real (posicion/mundo y actuadores de rvm1/real/<id>); no envía nada.
export function crearEnlaceEspejo(observador) {
  const avisos = [];
  const no = () => { avisos.forEach((f) => f('Modo SINCRONIZADO: solo visualización del robot real. Para moverlo, destino REAL (permiso de profesor).', 'alarma')); return false; };
  return {
    tipo: 'espejo', destino: 'espejo', etiqueta: 'ESPEJO REAL ' + observador.idReal,
    estado() {
      const o = observador.estado(), a = o.actuadores;
      return {
        conectado: o.online === 'online', referenciado: !!(a && a.referenciado), error: a ? a.error : 0, motivoError: null, sp: a ? a.velocidad : null,
        pose: o.pose, valida: o.valida, pinza: a ? a.pinza : 'desconocida', ocupado: !!(a && a.ocupado), pendientes: 0, puntos: []
      };
    },
    home: no, reset: no, velocidad: () => {}, jogArticular: no, jogMundo: no, pinza: no, guardarPunto: no, irAPunto: no,
    vaciar() {}, alAviso: (fn) => avisos.push(fn), cerrar() {}
  };
}
