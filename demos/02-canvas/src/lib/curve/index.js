export default class BezierCurve {
  constructor(points) {
    this.points = points;
  }

  split(t1, t2) {
    if (t1 < 0) t1 = 0;
    if (t2 < 0) t2 = 0;

    if (t1 > 1) t1 = 1;
    if (t2 > 1) t2 = 1;

    const q = this.hull(this.points, t1);
    const q2 = this.hull([ q[9], q[8], q[6], q[3] ], t2);

    return [ q2[0], q2[4], q2[7], q2[9] ];
  }

  hull(curves, percent) {
    const a = pointInLine(curves[0], curves[1], percent);
    const b = pointInLine(curves[1], curves[2], percent);
    const c = pointInLine(curves[2], curves[3], percent);
    const d = pointInLine(a, b, percent);
    const e = pointInLine(b, c, percent);
    const f = pointInLine(d, e, percent);

    return [ curves[0], curves[1], curves[2], curves[3], a, b, c, d, e, f ];
  }
}

function pointInLine(a, b, t) {
  return {
    x: a.x - ((a.x - b.x) * t),
    y: a.y - ((a.y - b.y) * t),
  }
}
