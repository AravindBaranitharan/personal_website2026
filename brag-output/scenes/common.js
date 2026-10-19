// Shared helpers for product loops. A scene defines window.SCENE = { duration, render(t) },
// where render sets every animated style from t alone (pure function of time) so frames can be captured in any order.
(function () {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = {
    out: (x) => 1 - Math.pow(1 - x, 3),
    inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    expo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    back: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    studio: (x) => cubicBezier(0.44, 0, 0.56, 1, x),
  };
  // cubic-bezier evaluator (x → y) by Newton iteration
  function cubicBezier(x1, y1, x2, y2, x) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    let u = x;
    for (let i = 0; i < 8; i++) { const xu = ((ax * u + bx) * u + cx) * u - x; const d = (3 * ax * u + 2 * bx) * u + cx; if (Math.abs(xu) < 1e-5 || !d) break; u -= xu / d; }
    return ((ay * u + by) * u + cy) * u;
  }
  /** Characters of `text` revealed for progress k (0..1). */
  const typed = (text, k) => text.slice(0, Math.round(text.length * clamp(k)));
  /** Set inline styles on an element (or selector). */
  const css = (el, styles) => { const n = typeof el === "string" ? document.querySelector(el) : el; if (n) Object.assign(n.style, styles); return n; };
  /** Standard enter: fade + rise for progress k. */
  const rise = (k, dist = 30) => ({ opacity: String(k), transform: `translate3d(0, ${(1 - k) * dist}px, 0)` });
  /** Loop fade for #content: 1 except during the last `tail` seconds, where it fades to 0 so the scene ends on its empty ground (the stage), matching frame 0. */
  const outro = (t, duration, tail = 0.5) => 1 - ease.inOut(seg(t, duration - tail, duration));
  window.B = { clamp, seg, lerp, ease, typed, css, rise, outro };
})();
