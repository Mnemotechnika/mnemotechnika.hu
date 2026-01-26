import math
from dataclasses import dataclass
from typing import List, Tuple, Dict

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
            if not stack:
                raise ValueError("Stack underflow: ']' verem nélkül.")
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

        else:
            pass

    flush()
    return lines

# ============================================================
# 3) FIT TO MM
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
    if bw == 0 or bh == 0:
        raise ValueError("Degenerált rajz (0 méret).")

    s = min((w - 2 * margin) / bw, (h - 2 * margin) / bh)

    cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
    tx, ty = x0 + w / 2, y0 + h / 2

    out: List[Polyline] = []
    for l in polylines:
        out.append([((px - cx) * s + tx, (py - cy) * s + ty) for px, py in l])
    return out

# ============================================================
# 4) AXIDRAW DRAW (no dots at end)
# ============================================================

def draw_axidraw(
    lines_mm: List[Polyline],
    speed_pendown: int = 20,
    accel: int = 40,
    pen_pos_down: int = 40,
    pen_pos_up: int = 60,
    home_at_end: bool = True,
):
    ad = axidraw.AxiDraw()
    ad.interactive()
    if not ad.connect():
        raise SystemExit("AxiDraw nem elérhető (USB).")

    ad.options.units = 2  # mm
    ad.options.speed_pendown = speed_pendown
    ad.options.accel = accel
    ad.options.pen_pos_down = pen_pos_down
    ad.options.pen_pos_up = pen_pos_up

    ad.penup()

    EPS = 1e-6

    for l in lines_mm:
        if not l or len(l) < 2:
            continue

        x0, y0 = l[0]
        ad.moveto(x0, y0)

        drew_any = False
        lastx, lasty = x0, y0

        for (x, y) in l[1:]:
            if abs(x - lastx) < EPS and abs(y - lasty) < EPS:
                continue
            if not drew_any:
                ad.pendown()
                drew_any = True
            ad.lineto(x, y)
            lastx, lasty = x, y

        if drew_any:
            ad.penup()

    ad.penup()
    if home_at_end:
        ad.moveto(0, 0)
    ad.disconnect()

# ============================================================
# 5) MAIN – itt állítod a szabályt/paramétert
# ============================================================

if __name__ == "__main__":

    axiom = "L"
    rules = {
        "L": "SSSSSS",
        "S": ">|+[F[S]]|",
    }
    levels = 100

    system = System(
        size=Param(value=200.0, growth=0.01),
        angle=Param(value=-3179, growth=0.05),
        offset_x=0.0,
        offset_y=0.0,
        rotation=0.0,
    )

    cmds = lsystem(axiom, rules, levels)
    lines = render_benvan(cmds, system, canvas=500.0)

    lines_mm = fit_polylines_mm(
        lines,
        x0=10, y0=10,
        w=140, h=90,
        margin=2.0,
    )

    draw_axidraw(
        lines_mm,
        speed_pendown=40,
        accel=40,
        pen_pos_down=30,
        pen_pos_up=50,
        home_at_end=True,
    )