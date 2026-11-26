#!/usr/bin/env python3
"""
Teach pendant gráfico para el Mitsubishi Movemaster EX RV-M1 (RS-232C),
con el aspecto y la lógica de manejo de un pendant industrial actual
(FANUC iPendant / KUKA smartPAD / ABB FlexPendant).

Alcance: SOLO jog de posiciones, en coordenadas articulares (JOINT) o
cartesianas (WORLD). Incluye lo imprescindible para poder hacerlo:
conexión, homing (NT) y reset de errores.

Manejo, como en un pendant real:
- HABILITACIÓN: la barra espaciadora conmuta habilitado/deshabilitado.
  Simplificación didáctica: en un pendant real el dispositivo de habilitación
  es de 3 posiciones y se mantiene pulsado. STOP y perder el foco deshabilitan.
- Jog: teclas −/+ de la derecha (ratón) o teclado Q/A, W/S, E/D, R/F, T/G.
- COORD: alterna JOINT / WORLD. WORLD solo tras referenciar (HOME).
- STEP/CONT: jog por paso (un incremento por pulsación) o continuo
  (mientras se mantiene la tecla).
- INCR / VEL: en STEP fija el tamaño del paso; en CONT la misma tecla pasa a
  ser VEL y fija la velocidad de jog (LENTA, MEDIA, RÁPIDA, MÁX).
- +% / −%: override de velocidad de la controladora (SP 0..9), que limita
  la velocidad real que se alcanza.
- La velocidad arranca baja (SP 2) al conectar y tras una parada.

Requiere Python 3.8+ y pyserial (pip install pyserial).
Debe estar en la misma carpeta que rvm1_control.py.

    python rvm1_pendant.py

AVISO: la seta STOP de pantalla solo deja de enviar órdenes y bloquea el jog
hasta RESET. El RV-M1 no puede abortar un movimiento por RS-232. La parada
de emergencia real es la seta física de la unidad de control.
"""

import queue
import threading
import tkinter as tk
from tkinter import ttk

try:
    from serial.tools import list_ports
except ImportError:
    list_ports = None

try:
    from rvm1_control import RVM1
except ImportError:
    RVM1 = None


# ==========================================================================
# Robot simulado (mismo interfaz que RVM1)
# ==========================================================================
class MockRVM1:
    HOME = [250.0, 0.0, 300.0, -90.0, 0.0]

    def __init__(self, *_, **__):
        self.pos = [0.0] * 5
        self.homed = False
        self.err = 0

    def close(self):
        pass

    def send(self, cmd):
        import math
        c = cmd.strip().upper()
        try:
            if c == "NT":
                self.pos = list(self.HOME)
                self.homed = True
            elif c == "RS":
                self.err = 0
            elif c.startswith("DS "):
                if not self.homed:
                    self.err = 2
                    return
                for i, d in enumerate(map(float, c[3:].split(","))):
                    self.pos[i] += d
            elif c.startswith("DJ "):
                j, d = c[3:].split(",")
                j, d = int(j), float(d)
                if j == 1:
                    a = math.radians(d)
                    x, y = self.pos[0], self.pos[1]
                    self.pos[0] = x * math.cos(a) - y * math.sin(a)
                    self.pos[1] = x * math.sin(a) + y * math.cos(a)
                elif j in (2, 3):
                    self.pos[2] += 2.0 * d
                elif j == 4:
                    self.pos[3] += d
                elif j == 5:
                    self.pos[4] += d
        except ValueError:
            self.err = 2

    def query(self, cmd, wait=0.0):
        c = cmd.strip().upper()
        if c == "WH":
            return ",".join(f"{v:+.1f}" for v in self.pos)
        if c == "ER":
            return str(self.err)
        return ""

    def run(self, cmd, check=True):
        self.send(cmd)
        return True

    def error(self):
        return self.err

    def where(self):
        return tuple(self.pos)


# ==========================================================================
# Hilo de comunicaciones
# ==========================================================================
class Worker(threading.Thread):
    def __init__(self, ui):
        super().__init__(daemon=True)
        self.ui = ui
        self.q = queue.Queue()

    def submit(self, fn, *args, callback=None, label=None):
        self.q.put((fn, args, callback, label))

    def pending(self):
        return self.q.qsize()

    def clear(self):
        try:
            while True:
                self.q.get_nowait()
        except queue.Empty:
            pass

    def run(self):
        while True:
            fn, args, cb, label = self.q.get()
            try:
                res = fn(*args)
                if label:
                    self.ui.after(0, self.ui.log, label)
                if cb:
                    self.ui.after(0, cb, res)
            except Exception as e:  # noqa: BLE001
                self.ui.after(0, self.ui.alarm, f"COMM: {e}")


# ==========================================================================
# Estilo: carcasa oscura + pantalla clara, como los pendants actuales
# ==========================================================================
DESK = "#15171a"
HOUSING = "#3a3f46"
HOUSING_D = "#2c3036"
KEY = "#545b65"
KEY_HI = "#6b737e"
KEY_FG = "#f1f3f5"
SCREEN = "#eef1f4"
SCREEN_2 = "#ffffff"
INK = "#1d2733"
INK_MUTED = "#6a7684"
BAR = "#1f3b5a"
BAR_FG = "#ffffff"
ACCENT = "#f2a900"
GREEN = "#2fb463"
RED = "#d93025"
AMBER = "#e08a00"

F = "Segoe UI"
MONO = "Consolas"

INCREMENTS = [("PEQ", 0.1), ("MED", 1.0), ("GRA", 5.0), ("MUY", 10.0)]
CONT_PERIOD_MS = 200
# Velocidades de jog continuo: (nombre, ° por tick articular, mm por tick
# cartesiano). Con un tick cada 200 ms: 2.5/10/20/30 °/s y 5/25/50/100 mm/s,
# siempre por debajo de los 250 mm/s de T1. La velocidad real queda además
# limitada por SP: si la controladora no termina el paso, no se encola otro.
CONT_SPEEDS = [("LENTA", 0.5, 1.0), ("MEDIA", 2.0, 5.0),
               ("RÁPIDA", 4.0, 10.0), ("MÁX", 6.0, 20.0)]
VEL_DEFAULT = 1
SP_DEFAULT = 2
SP_WARN = 6

KEYMAP = {"q": (0, +1), "a": (0, -1), "w": (1, +1), "s": (1, -1),
          "e": (2, +1), "d": (2, -1), "r": (3, +1), "f": (3, -1),
          "t": (4, +1), "g": (4, -1)}


class Pendant(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("RV-M1 Teach Pendant")
        self.configure(bg=DESK)
        self.geometry("1100x740")
        self.minsize(1060, 720)

        self.robot = None
        self.worker = Worker(self)
        self.worker.start()

        # estado de máquina
        self.coord = "JOINT"           # JOINT | WORLD
        self.jogmode = "STEP"          # STEP | CONT
        self.incr_idx = 1
        self.vel_idx = VEL_DEFAULT
        self.sp = SP_DEFAULT
        self.enabled = False           # barra espaciadora mantenida
        self.homed = False
        self.estop = False             # STOP software enclavado
        self.last_er = None
        self._jog = None               # (axis, sign) activo
        self._jog_job = None
        self._held = set()             # teclas mantenidas (anti-autorepeat)
        self._release_jobs = {}

        self.simulate = tk.BooleanVar(value=(RVM1 is None
                                             or list_ports is None))
        self.port = tk.StringVar()
        self.baud = tk.StringVar(value="9600")

        self._build()
        self._bind_keys()
        self._refresh_ports()
        self._refresh_all()
        self.after(1500, self._poll)

    # ====================================================== construcción UI
    def _key(self, parent, text, cmd=None, w=7, h=2, bg=KEY, fg=KEY_FG,
             font=(F, 10, "bold")):
        b = tk.Button(parent, text=text, command=cmd, width=w, height=h,
                      bg=bg, fg=fg, activebackground=KEY_HI,
                      activeforeground=KEY_FG, relief="raised", bd=3,
                      font=font, cursor="hand2", highlightthickness=0)
        return b

    def _build(self):
        body = tk.Frame(self, bg=HOUSING, bd=0, highlightthickness=3,
                        highlightbackground=HOUSING_D)
        body.pack(fill="both", expand=True, padx=14, pady=14)

        # ---------- franja superior de la carcasa
        top = tk.Frame(body, bg=HOUSING)
        top.pack(fill="x", padx=14, pady=(10, 4))
        tk.Label(top, text="MOVEMASTER", bg=HOUSING, fg=ACCENT,
                 font=(F, 14, "bold")).pack(side="left")
        tk.Label(top, text="  RV-M1  ·  TEACH PENDANT", bg=HOUSING,
                 fg="#c9ced5", font=(F, 11)).pack(side="left")
        self.enable_led = tk.Canvas(top, width=16, height=16, bg=HOUSING,
                                    highlightthickness=0)
        self.enable_led.pack(side="right")
        self._enable_dot = self.enable_led.create_oval(2, 2, 14, 14,
                                                       fill="#555", outline="")
        tk.Label(top, text="ENABLE ", bg=HOUSING, fg="#c9ced5",
                 font=(F, 9, "bold")).pack(side="right")

        mid = tk.Frame(body, bg=HOUSING)
        mid.pack(fill="both", expand=True, padx=14, pady=4)

        # ---------- TECLAS FÍSICAS (se empaqueta primero: nunca se recorta)
        side = tk.Frame(mid, bg=HOUSING)
        side.pack(side="right", fill="y", padx=(14, 0))

        # ---------- PANTALLA
        bezel = tk.Frame(mid, bg="#111", padx=6, pady=6)
        bezel.pack(side="left", fill="both", expand=True)
        scr = tk.Frame(bezel, bg=SCREEN)
        scr.pack(fill="both", expand=True)

        # barra de estado (tipo FANUC / smartHMI)
        bar = tk.Frame(scr, bg=BAR)
        bar.pack(fill="x")
        self.st_mode = self._seg(bar, "MANUAL")
        self.st_coord = self._seg(bar, "JOINT")
        self.st_jog = self._seg(bar, "STEP 1.0")
        self.st_ovr = self._seg(bar, "SP 2")
        self.st_ref = self._seg(bar, "NO REF")
        self.st_conn = self._seg(bar, "OFFLINE", side="right")

        # línea de alarma
        self.alarm_var = tk.StringVar(value="")
        self.alarm_lbl = tk.Label(scr, textvariable=self.alarm_var,
                                  bg=SCREEN, fg=RED, anchor="w",
                                  font=(F, 10, "bold"), padx=10)
        self.alarm_lbl.pack(fill="x", pady=(4, 0))

        # conexión
        conn = tk.Frame(scr, bg=SCREEN)
        conn.pack(fill="x", padx=10, pady=(2, 4))
        tk.Label(conn, text="Puerto", bg=SCREEN, fg=INK_MUTED,
                 font=(F, 9)).pack(side="left")
        self.port_cb = ttk.Combobox(conn, textvariable=self.port, width=14)
        self.port_cb.pack(side="left", padx=4)
        ttk.Combobox(conn, textvariable=self.baud, width=6,
                     values=["2400", "4800", "9600"]).pack(side="left")
        tk.Checkbutton(conn, text="Simular", variable=self.simulate,
                       bg=SCREEN, activebackground=SCREEN,
                       font=(F, 9)).pack(side="left", padx=8)

        # panel de posición
        card = tk.Frame(scr, bg=SCREEN_2, highlightthickness=1,
                        highlightbackground="#cfd6de")
        card.pack(fill="x", padx=10, pady=4)
        self.pos_title = tk.Label(card, text="", bg=SCREEN_2, fg=INK,
                                  anchor="w", font=(F, 10, "bold"))
        self.pos_title.grid(row=0, column=0, columnspan=5, sticky="w",
                            padx=10, pady=(8, 2))
        self.pos_vals = []
        for i, n in enumerate(["X", "Y", "Z", "P", "R"]):
            tk.Label(card, text=n, bg=SCREEN_2, fg=INK_MUTED,
                     font=(F, 10, "bold")).grid(row=1, column=i, pady=(4, 0))
            v = tk.StringVar(value="  ----.-")
            tk.Label(card, textvariable=v, bg=SCREEN_2, fg=INK,
                     font=(MONO, 20, "bold"), width=8)\
                .grid(row=2, column=i, padx=4)
            self.pos_vals.append(v)
        tk.Label(card, text="mm", bg=SCREEN_2, fg=INK_MUTED, font=(F, 8))\
            .grid(row=3, column=0, columnspan=3, pady=(0, 8))
        tk.Label(card, text="°", bg=SCREEN_2, fg=INK_MUTED, font=(F, 8))\
            .grid(row=3, column=3, columnspan=2, pady=(0, 8))
        for i in range(5):
            card.grid_columnconfigure(i, weight=1)
        self.pos_note = tk.Label(scr, text="", bg=SCREEN, fg=INK_MUTED,
                                 anchor="w", font=(F, 8), padx=10)
        self.pos_note.pack(fill="x")

        # registro
        self.logbox = tk.Text(scr, height=5, bg="#f8fafb", fg="#3d4a58",
                              relief="flat", font=(MONO, 9),
                              highlightthickness=1,
                              highlightbackground="#cfd6de")
        self.logbox.pack(fill="both", expand=True, padx=10, pady=(6, 6))

        # etiquetas de softkeys en pantalla
        sk = tk.Frame(scr, bg="#d9dfe6")
        sk.pack(fill="x", side="bottom")
        self.softlabels = []
        for t in ("CONECTAR", "HOME", "RESET", "LEER POS", ""):
            lb = tk.Label(sk, text=t, bg="#d9dfe6", fg=INK,
                          font=(F, 9, "bold"), width=12, pady=4)
            lb.pack(side="left", expand=True, fill="x")
            self.softlabels.append(lb)

        # seta STOP
        es = tk.Frame(side, bg=HOUSING)
        es.pack(pady=(0, 8))
        self.es_canvas = tk.Canvas(es, width=96, height=96, bg=HOUSING,
                                   highlightthickness=0, cursor="hand2")
        self.es_canvas.pack()
        self.es_canvas.create_oval(4, 4, 92, 92, fill=ACCENT, outline="")
        self._es_cap = self.es_canvas.create_oval(18, 18, 78, 78, fill=RED,
                                                  outline="#8c1c14", width=3)
        self.es_canvas.create_text(48, 48, text="STOP", fill="white",
                                   font=(F, 11, "bold"))
        self.es_canvas.bind("<Button-1>", lambda e: self._estop())
        tk.Label(es, text="solo software", bg=HOUSING, fg="#c9ced5",
                 font=(F, 7)).pack()

        fn = tk.Frame(side, bg=HOUSING)
        fn.pack(pady=4)
        self.k_coord = self._key(fn, "COORD", self._cycle_coord, w=6)
        self.k_mode = self._key(fn, "STEP\nCONT", self._cycle_jogmode, w=6)
        self.k_incr = self._key(fn, "INCR", self._cycle_incr, w=6)
        self.k_coord.grid(row=0, column=0, padx=3, pady=3)
        self.k_mode.grid(row=0, column=1, padx=3, pady=3)
        self.k_incr.grid(row=0, column=2, padx=3, pady=3)
        self._key(fn, "−%", lambda: self._override(-1), w=6)\
            .grid(row=1, column=0, padx=3, pady=3)
        self._key(fn, "+%", lambda: self._override(+1), w=6)\
            .grid(row=1, column=2, padx=3, pady=3)
        self.ovr_lbl = tk.Label(fn, text="", bg=HOUSING, fg=KEY_FG,
                                font=(F, 10, "bold"))
        self.ovr_lbl.grid(row=1, column=1)

        jog = tk.Frame(side, bg=HOUSING_D, padx=6, pady=6)
        jog.pack(pady=(8, 0))
        self.jog_keys = []
        for i in range(5):
            row = []
            for c, sgn in enumerate((-1, +1)):
                b = self._key(jog, "", None, w=7, h=2,
                              font=(F, 10, "bold"))
                b.grid(row=i, column=c, padx=4, pady=3)
                b.bind("<ButtonPress-1>",
                       lambda e, ax=i, s=sgn: self._jog_press(ax, s))
                b.bind("<ButtonRelease-1>", lambda e: self._jog_release())
                row.append(b)
            self.jog_keys.append(row)

        # ---------- softkeys físicas bajo la pantalla
        sofk = tk.Frame(body, bg=HOUSING)
        sofk.pack(fill="x", padx=14, pady=(4, 6))
        acts = [self._toggle_connect, self._home, self._reset,
                self._read_pos, None]
        for i, a in enumerate(acts):
            self._key(sofk, f"F{i + 1}", a, w=9, h=1)\
                .pack(side="left", expand=True, padx=4)

        # ---------- ayuda en la carcasa
        tk.Label(body,
                 text="ESPACIO = habilitar / deshabilitar   ·   "
                      "Jog teclado: Q/A  W/S  E/D  R/F  T/G   ·   "
                      "La parada de emergencia real es la seta física.",
                 bg=HOUSING, fg="#aeb5be", font=(F, 8))\
            .pack(pady=(0, 8))

    def _seg(self, parent, text, side="left"):
        lb = tk.Label(parent, text=text, bg=BAR, fg=BAR_FG,
                      font=(F, 10, "bold"), padx=10, pady=5,
                      highlightthickness=1, highlightbackground="#2e5179")
        lb.pack(side=side)
        return lb

    # ====================================================== teclado
    def _bind_keys(self):
        self.bind_all("<KeyPress>", self._on_kp)
        self.bind_all("<KeyRelease>", self._on_kr)
        self.bind("<FocusOut>", lambda e: self._set_enable(False))

    def _on_kp(self, e):
        k = e.keysym.lower()
        if isinstance(e.widget, (tk.Entry, ttk.Combobox)) and k != "space":
            return
        if k in self._release_jobs:            # autorepeat: sigue pulsada
            self.after_cancel(self._release_jobs.pop(k))
            return
        if k in self._held:
            return
        self._held.add(k)
        if k == "space":
            # Simplificación didáctica: ESPACIO conmuta la habilitación (en un pendant real se mantiene pulsada)
            self._set_enable(not self.enabled)
            return "break"
        if k in KEYMAP:
            ax, s = KEYMAP[k]
            self._jog_press(ax, s)

    def _on_kr(self, e):
        k = e.keysym.lower()
        if k not in self._held:
            return
        # se confirma la liberación tras 60 ms (filtra el autorepeat de X11)
        self._release_jobs[k] = self.after(60, lambda: self._really_up(k))

    def _really_up(self, k):
        self._release_jobs.pop(k, None)
        self._held.discard(k)
        if k in KEYMAP and self._jog == KEYMAP[k]:
            self._jog_release()

    # ====================================================== estado / pantalla
    def log(self, msg):
        self.logbox.insert("end", msg + "\n")
        self.logbox.see("end")

    def alarm(self, msg):
        self.alarm_var.set(msg)
        if msg:
            self.log("ALARMA  " + msg)

    def _refresh_all(self):
        # barra de estado
        self.st_coord.config(text=self.coord)
        inc = INCREMENTS[self.incr_idx][1]
        vtxt = self._vel_text()
        self.st_jog.config(text=f"STEP {inc:g}" if self.jogmode == "STEP"
                           else f"CONT {vtxt}")
        warn = self.sp >= SP_WARN
        self.st_ovr.config(text=f"SP {self.sp}",
                           bg=AMBER if warn else BAR)
        self.ovr_lbl.config(text=f"SP {self.sp}",
                            fg=ACCENT if warn else KEY_FG)
        self.st_ref.config(text="REF OK" if self.homed else "NO REF",
                           bg=GREEN if self.homed else RED)
        on = self.robot is not None
        self.st_conn.config(text=("SIM" if isinstance(self.robot, MockRVM1)
                                  else "ONLINE") if on else "OFFLINE",
                            bg=GREEN if on else "#55606d")
        self.st_mode.config(text="STOP" if self.estop else "MANUAL",
                            bg=RED if self.estop else BAR)
        self.softlabels[0].config(text="DESCONECTAR" if on else "CONECTAR")

        # tecla COORD: WORLD bloqueado sin referenciar
        self.k_coord.config(text=f"COORD\n{self.coord}")
        self.k_mode.config(text="STEP" if self.jogmode == "STEP" else "CONT")
        if self.jogmode == "STEP":
            self.k_incr.config(text=f"INCR\n{inc:g}")
        else:
            self.k_incr.config(text=f"VEL\n{vtxt}")

        # rotulado de teclas de jog (estilo FANUC: −X (J1))
        for i, row in enumerate(self.jog_keys):
            j = f"J{i + 1}"
            if self.coord == "JOINT":
                txt = (f"−{j}", f"+{j}")
                bg = KEY
            elif i < 3:
                ax = "XYZ"[i]
                txt = (f"−{ax}\n({j})", f"+{ax}\n({j})")
                bg = KEY
            else:
                txt = (f"−{j}\nart.", f"+{j}\nart.")
                bg = "#4a5059"
            for b, t in zip(row, txt):
                b.config(text=t, bg=bg)

        # cabecera del panel de posición
        self.pos_title.config(text="Posición TCP  ·  WORLD")
        if not self.homed:
            self.pos_note.config(
                text="Robot NO referenciado: haz HOME (F2). "
                     "Solo se permite jog JOINT; la posición no es válida.",
                fg=RED)
        elif self.coord == "JOINT":
            self.pos_note.config(
                text="El RV-M1 solo informa de la posición cartesiana "
                     "del TCP (WH); no da ángulos articulares.",
                fg=INK_MUTED)
        else:
            self.pos_note.config(
                text="WORLD: X, Y, Z en línea recta (DS). J4 y J5 se mueven "
                     "como ejes: el RV-M1 no reorienta alrededor del TCP.",
                fg=INK_MUTED)

        # LED de habilitación
        self.enable_led.itemconfig(self._enable_dot,
                                   fill=GREEN if self.enabled else "#555")

    def _set_enable(self, on):
        if on == self.enabled:
            return
        self.enabled = on
        if not on:
            self._jog_release()
            self.worker.clear()
        self._refresh_all()

    # ====================================================== conexión
    def _refresh_ports(self):
        ports = [p.device for p in list_ports.comports()] if list_ports \
            else []
        self.port_cb["values"] = ports
        if ports and not self.port.get():
            self.port.set(ports[0])

    def _toggle_connect(self):
        if self.robot:
            self.worker.clear()
            self.robot.close()
            self.robot = None
            self.homed = False
            self.log("Desconectado.")
            self._refresh_all()
            return
        try:
            if self.simulate.get():
                self.robot = MockRVM1()
            else:
                if RVM1 is None:
                    self.alarm("Falta rvm1_control.py o pyserial.")
                    return
                self.robot = RVM1(self.port.get(), int(self.baud.get()))
        except Exception as e:  # noqa: BLE001
            self.robot = None
            self.alarm(f"No se pudo conectar: {e}")
            return
        self.homed = False
        self.coord = "JOINT"
        self._set_sp(SP_DEFAULT, quiet=True)
        self.alarm("")
        self.log("Conectado. Velocidad SP 2. Haz HOME (F2) para referenciar.")
        self._refresh_all()

    def _need_robot(self):
        if self.robot is None:
            self.alarm("Sin conexión (F1).")
            return False
        return True

    # ====================================================== funciones
    def _home(self):
        if not self._need_robot():
            return
        if self.estop:
            self.alarm("STOP activo: pulsa RESET (F3).")
            return
        self.log("> NT  (homing)")
        self.worker.submit(self.robot.run, "NT", False)
        self.worker.submit(self.robot.error, callback=self._home_done)

    def _home_done(self, er):
        self.last_er = er
        self.homed = er in (0, "0")
        if self.homed:
            self.alarm("")
            self.log("Referenciado.")
            self._read_pos()
        else:
            self.alarm(f"Homing fallido (ER={er}).")
        self._refresh_all()

    def _reset(self):
        self.estop = False
        self.es_canvas.itemconfig(self._es_cap, fill=RED)
        if self.robot:
            self.worker.submit(self.robot.run, "RS", False, label="> RS")
        self.alarm("")
        self._refresh_all()

    def _estop(self):
        self.estop = True
        self.enabled = False
        self.worker.clear()
        self._jog_release()
        self._set_sp(SP_DEFAULT, quiet=True)
        self.vel_idx = VEL_DEFAULT
        self.es_canvas.itemconfig(self._es_cap, fill="#8c1c14")
        self.alarm("STOP software: envíos detenidos. RESET (F3) para seguir.")
        self._refresh_all()

    def _cycle_coord(self):
        if self.coord == "JOINT":
            if not self.homed:
                self.alarm("WORLD no disponible: pulsa RESET (F3) y luego "
                           "HOME (F2) para referenciar.")
                return
            self.coord = "WORLD"
        else:
            self.coord = "JOINT"
        self.alarm("")
        self._refresh_all()

    def _cycle_jogmode(self):
        self.jogmode = "CONT" if self.jogmode == "STEP" else "STEP"
        self._refresh_all()

    def _cycle_incr(self):
        # STEP: tamaño del paso. CONT: velocidad de jog.
        if self.jogmode == "STEP":
            self.incr_idx = (self.incr_idx + 1) % len(INCREMENTS)
        else:
            self.vel_idx = (self.vel_idx + 1) % len(CONT_SPEEDS)
        self._refresh_all()

    def _cont_step(self, axis):
        _, deg, mm = CONT_SPEEDS[self.vel_idx]
        return mm if self.coord == "WORLD" and axis < 3 else deg

    def _vel_text(self):
        _, deg, mm = CONT_SPEEDS[self.vel_idx]
        k = 1000 / CONT_PERIOD_MS
        if self.coord == "WORLD":
            return f"{mm * k:g} mm/s"
        return f"{deg * k:g} °/s"

    def _set_sp(self, sp, quiet=False):
        self.sp = max(0, min(9, sp))
        if self.robot:
            self.worker.submit(self.robot.run, f"SP {self.sp}", False,
                               label=None if quiet else f"> SP {self.sp}")
        self._refresh_all()

    def _override(self, d):
        self._set_sp(self.sp + d)
        if self.sp >= SP_WARN:
            self.alarm(f"Override alto (SP {self.sp}) en modo manual.")
        elif self.alarm_var.get().startswith("Override"):
            self.alarm("")

    def _read_pos(self):
        if self.robot is not None:
            self.worker.submit(self.robot.where, callback=self._show_pos)

    def _show_pos(self, pos):
        if isinstance(pos, tuple) and len(pos) >= 5:
            for v, val in zip(self.pos_vals, pos):
                v.set(f"{val:+8.1f}")

    # ====================================================== jog
    def _jog_allowed(self):
        if self.estop:
            self.alarm("STOP activo: pulsa RESET (F3).")
            return False
        if not self.enabled:
            self.alarm("JOG: pendant no habilitado (pulsa ESPACIO).")
            return False
        if not self._need_robot():
            return False
        if self.coord == "WORLD" and not self.homed:
            self.alarm("WORLD requiere robot referenciado.")
            return False
        return True

    def _jog_cmd(self, axis, sign, size):
        d = sign * size
        if self.coord == "JOINT" or axis >= 3:
            return f"DJ {axis + 1},{d:.1f}"
        v = [0.0, 0.0, 0.0]
        v[axis] = d
        return f"DS {v[0]:.1f},{v[1]:.1f},{v[2]:.1f}"

    def _jog_press(self, axis, sign):
        if not self._jog_allowed():
            return
        if self.alarm_var.get().startswith("JOG"):
            self.alarm("")
        self._jog = (axis, sign)
        self._flash(axis, sign, True)
        if self.jogmode == "STEP":
            cmd = self._jog_cmd(axis, sign, INCREMENTS[self.incr_idx][1])
            self.worker.submit(self.robot.run, cmd, False, label=f"> {cmd}",
                               callback=lambda _r: self._read_pos())
        else:
            self._cont_tick()

    def _cont_tick(self):
        if self._jog is None or not self.enabled or self.estop:
            return
        if self.worker.pending() <= 1:
            ax, s = self._jog
            cmd = self._jog_cmd(ax, s, self._cont_step(ax))
            self.worker.submit(self.robot.run, cmd, False, label=f"> {cmd}")
        self._jog_job = self.after(CONT_PERIOD_MS, self._cont_tick)

    def _jog_release(self):
        if self._jog_job:
            self.after_cancel(self._jog_job)
            self._jog_job = None
        if self._jog is not None:
            ax, s = self._jog
            self._flash(ax, s, False)
            if self.jogmode == "CONT":
                self.worker.clear()
                self._read_pos()
        self._jog = None

    def _flash(self, axis, sign, on):
        b = self.jog_keys[axis][0 if sign < 0 else 1]
        b.config(relief="sunken" if on else "raised",
                 bg=ACCENT if on else
                 ("#4a5059" if self.coord == "WORLD" and axis >= 3 else KEY),
                 fg="#000" if on else KEY_FG)

    # ====================================================== sondeo
    def _poll(self):
        if self.robot is not None and self._jog is None \
                and self.worker.pending() == 0:
            self.worker.submit(self.robot.where, callback=self._show_pos)
            self.worker.submit(self.robot.error, callback=self._on_er)
        self.after(1500, self._poll)

    def _on_er(self, er):
        if er == self.last_er:
            return
        self.last_er = er
        if er in (1, "1"):
            self.alarm("ERROR MODO I (hardware): revisa LED interno y "
                       "pulsa RESET.")
            self.homed = False
        elif er in (2, "2"):
            self.alarm("ERROR MODO II (comando no ejecutable). RESET (F3).")
        self._refresh_all()


if __name__ == "__main__":
    Pendant().mainloop()
