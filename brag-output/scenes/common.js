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
  /**
   * Wrap window.SCENE in a title card: the card holds for `hold` seconds, wipes away into the scene,
   * and fades back in over the scene's outro, so the final frame matches frame 0 and the loop never shows a gap.
   */
  function titleCard(kicker, title, hold = 1.4) {
    const scene = window.SCENE, D = scene.duration;
    const card = document.createElement("div");
    card.className = "tcard";
    card.innerHTML = `<div class="tcard__kicker"><b></b>${kicker}</div><h1 class="tcard__title">${title}<i>.</i></h1><div class="tcard__bar"><span></span></div>`;
    document.querySelector(".stage").appendChild(card);
    const bar = card.querySelector(".tcard__bar span");
    window.SCENE = {
      duration: hold + D,
      poster: hold + (scene.poster ?? D * 0.7),
      render(t) {
        scene.render(clamp(t - hold, 0, D));
        const away = ease.inOut(seg(t, hold - 0.25, hold + 0.2));
        const back = ease.inOut(seg(t, hold + D - 0.45, hold + D));
        const k = Math.max(1 - away, back);
        card.style.opacity = String(k);
        card.style.transform = `translate3d(0, ${away * (1 - back) * -40}px, 0)`;
        bar.style.transform = `scaleX(${t < hold ? ease.out(seg(t, 0.15, hold - 0.25)) : 0})`; // empty again on the way back, matching frame 0
      },
    };
  }
  window.B = { clamp, seg, lerp, ease, typed, css, rise, outro, titleCard };
})();
