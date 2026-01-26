import math
from dataclasses import dataclass, field
from typing import List, Tuple, Dict
import matplotlib.pyplot as plt

# ===== AxiDraw =====
from pyaxidraw import axidraw

Point = Tuple[float, float]
Polyline = List[Point]

# ============================================================
# 1) L-SYSTEM EXPAND
# ============================================================

def lsystem(axiom: str, rules: Dict[str, str], levels: int) -> str:
    s = axiom
    for _ in range(levels):
        s = "".join(rules.get(c, c) for c in s)
    return s

# ============================================================
# 2) BEN VAN – RENDER CORE (1:1)
# ============================================================

@dataclass
class Param:
    value: float
    growth: float   # RATIO! pl. 0.003

@dataclass
class System:
    angle: Param
    size: Param
    offset_x: float = 0.0
    offset_y: float = 0.0
    rotation: float = 0.0   # degrees

@dataclass
class State:
    x: float
    y: float
    orientation: float     # degrees
    stepAngle: float       # degrees
    stepSize: float

def clone_state(s: State) -> State:
    return State(s.x, s.y, s.orientation, s.stepAngle, s.stepSize)

def render_benvan(cmds: str, system: System, canvas: float = 500.0) -> List[Polyline]:
    state = State(
        x=canvas / 2 + system.offset_x,
        y=canvas / 2 + system.offset_y,
        orientation=-90 + system.rotation,
        stepAngle=system.angle.value,
        stepSize=system.size.value,
    )

    stack: List[State] = []
    lines: List[Polyline] = []
    current: Polyline = [(state.x, state.y)]

    def flush():
        nonlocal current
        if len(current) > 1:
            lines.append(current)
        current = [(state.x, state.y)]

    for c in cmds:
        if c == "F":
            ang = math.radians(state.orientation % 360)
            state.x += math.cos(ang) * state.stepSize
            state.y += math.sin(ang) * state.stepSize
            current.append((state.x, state.y))

        elif c == "+":
            state.orientation += state.stepAngle
        elif c == "-":
            state.orientation -= state.stepAngle
        elif c == "|":
            state.orientation += 180

        elif c == "[":
            stack.append(clone_state(state))

        elif c == "]":
            flush()
            state = stack.pop()
            current = [(state.x, state.y)]

        elif c == "!":
            state.stepAngle *= -1

        elif c == "(":
            state.stepAngle *= (1 - system.angle.growth)
        elif c == ")":
            state.stepAngle *= (1 + system.angle.growth)

        elif c == "<":
            state.stepSize *= (1 + system.size.growth)
        elif c == ">":
            state.stepSize *= (1 - system.size.growth)

    flush()
    return lines

# ============================================================
# 3) MATPLOTLIB PREVIEW
# ============================================================

def preview(lines: List[Polyline]):
    plt.figure(figsize=(6, 6))
    for ln in lines:
        xs, ys = zip(*ln)
        plt.plot(xs, ys, "k", linewidth=0.6)
    plt.axis("equal")
    plt.axis("off")
    plt.show()

# ============================================================
# 4) FIT TO MM + AXIDRAW
# ============================================================

def fit_polylines_mm(
    polylines: List[Polyline],
    x0: float, y0: float,
    w: float, h: float,
    margin: float = 2.0
) -> List[Polyline]:

    xs = [p[0] for l in polylines for p in l]
    ys = [p[1] for l in polylines for p in l]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)

    bw, bh = maxx - minx, maxy - miny
    s = min((w - 2 * margin) / bw, (h - 2 * margin) / bh)

    cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
    tx, ty = x0 + w / 2, y0 + h / 2

    out: List[Polyline] = []
    for l in polylines:
        out.append([((px - cx) * s + tx, (py - cy) * s + ty) for px, py in l])
    return out

def draw_axidraw(lines_mm):
    ad = axidraw.AxiDraw()
    ad.interactive()
    if not ad.connect():
        raise SystemExit("AxiDraw nem elérhető")

    ad.options.units = 2  # mm
    ad.options.speed_pendown = 20
    ad.options.accel = 40
    ad.options.pen_pos_down = 40
    ad.options.pen_pos_up = 60

    ad.penup()

    EPS = 1e-6  # 0-mozgás szűrés

    for l in lines_mm:
        if not l or len(l) < 2:
            continue

        # start
        x0, y0 = l[0]
        ad.moveto(x0, y0)

        # csak akkor tegyük le a tollat, ha van tényleges mozgás
        drew_any = False
        lastx, lasty = x0, y0

        for (x, y) in l[1:]:
            if abs(x - lastx) < EPS and abs(y - lasty) < EPS:
                continue  # nulla hosszú szegmens -> pontot csinálna
            if not drew_any:
                ad.pendown()
                drew_any = True
            ad.lineto(x, y)
            lastx, lasty = x, y

        if drew_any:
            ad.penup()

    # végén biztosan toll fel
    ad.penup()
    ad.moveto(0, 0)
    ad.disconnect()

# ============================================================
# 5) FUTTATÁS – A TE PÉLDÁD
# ============================================================

if __name__ == "__main__":

    axiom = "L"
    old_rules = {
        "L": "SYS",
        "S": "F-[F-Y[S]]",
        "Y": "[|FF[-((>S]+Y]",
    }

    rules = { 
        "L": "SSSSS",
        "S": ">|+[F[S]]",
    }

    old_levels = 8
    levels = 100

    system = System(
        size=Param(value=200, growth=0.01),
        angle=Param(value=400, growth=0.05),
       
    )

    cmds = lsystem(axiom, rules, levels)
    lines = render_benvan(cmds, system)

    # --- előnézet ---
    preview(lines)

    # --- AXIDRAW ---
    lines_mm = fit_polylines_mm(
        lines,
        x0=10, y0=10,
        w=140, h=90,
        margin=2,
    )

    # draw_axidraw(lines_mm)
