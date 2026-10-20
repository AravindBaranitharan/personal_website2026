/* aravind. motion runtime. Recreates plainthing.studio's Framer effects (measured with REA) in plain JS.
   Wire elements with data- attributes, then call Aravind.motion.init(root). No dependencies; Lenis is optional. */
(function () {
  'use strict';
  var w = window, d = document;
  var mq = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = !!(mq && mq.matches);
  var finePointer = w.matchMedia ? w.matchMedia('(hover: hover) and (pointer: fine)').matches : true;

  var EASE = {
    studio: [0.44, 0, 0.56, 1], glide: [0.12, 0.23, 0.5, 1], exit: [0.5, 0, 0.88, 0.77],
    ui: [0.27, 0, 0.51, 1], overshoot: [0.44, 0, 0, 1.23], cycle: [0.11, 0.72, 0, 1]
  };
  function bez(a) { return 'cubic-bezier(' + a.join(',') + ')'; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function num(el, name, def) { var v = el.getAttribute(name); return v == null || v === '' ? def : parseFloat(v); }

  /* ---------- scroll context: nearest [data-scroller] or the window ---------- */
  var jobs = [], queued = false, watched = [];
  function scrollerOf(el) { return el.closest('[data-scroller]'); }
  function frameOf(sc) {
    if (!sc) return { top: 0, height: w.innerHeight, width: w.innerWidth };
    var r = sc.getBoundingClientRect(); return { top: r.top, height: r.height, width: r.width };
  }
  function box(el) {
    var f = frameOf(scrollerOf(el)), r = el.getBoundingClientRect();
    return { top: r.top - f.top, bottom: r.bottom - f.top, height: r.height, width: r.width, vh: f.height };
  }
  function run() { queued = false; for (var i = 0; i < jobs.length; i++) jobs[i](); }
  function tick() { if (!queued) { queued = true; requestAnimationFrame(run); } }
  function watch(el) {
    var target = scrollerOf(el) || w;
    if (watched.indexOf(target) < 0) { watched.push(target); target.addEventListener('scroll', tick, { passive: true }); }
  }
  w.addEventListener('resize', tick);

  /* ---------- transform state ---------- */
  var ID = { x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, opacity: 1, blur: 0 };
  function apply(el, s, persp) {
    var t = (persp ? 'perspective(' + persp + 'px) ' : '') +
      'translate3d(' + (s.x || 0).toFixed(2) + 'px,' + (s.y || 0).toFixed(2) + 'px,0)';
    if (s.rotateX) t += ' rotateX(' + s.rotateX.toFixed(2) + 'deg)';
    if (s.rotate) t += ' rotate(' + s.rotate.toFixed(2) + 'deg)';
    if (s.scale != null && s.scale !== 1) t += ' scale(' + s.scale.toFixed(4) + ')';
    el.style.transform = t;
    if (s.opacity != null) el.style.opacity = s.opacity.toFixed(3);
    if (s.blur != null) el.style.filter = s.blur > 0.05 ? 'blur(' + s.blur.toFixed(2) + 'px)' : '';
  }
  function mix(a, b, t) {
    var o = {}, k;
    for (k in ID) { var av = a[k] != null ? a[k] : ID[k], bv = b[k] != null ? b[k] : ID[k]; o[k] = lerp(av, bv, t); }
    return o;
  }

  /* ---------- 1. Appear: enter states copied from the source ---------- */
  var APPEAR = {
    rise:  { from: { opacity: 0, y: 40 } },
    flip:  { from: { opacity: 0, rotateX: -50, y: 50 }, persp: 1200 },
    tilt:  { from: { opacity: 0, rotateX: -30, y: 80 }, persp: 1200 },
    pop:   { from: { opacity: 0, rotateX: -50, y: 70, scale: 0.7 }, persp: 1200 },
    blur:  { from: { opacity: 0, blur: 10, y: 10 } },
    zoom:  { from: { opacity: 0, scale: 0.6 } }
  };
  var appeared = [];
  function prepAppear(el) {
    var p = APPEAR[el.getAttribute('data-appear')] || APPEAR.rise;
    el.style.transition = 'none';
    apply(el, mix(ID, p.from, 1), p.persp);
    el.style.willChange = 'transform, opacity, filter';
    return p;
  }
  function playAppear(el, p) {
    var dur = num(el, 'data-duration', 1), delay = num(el, 'data-delay', 0), e = bez(EASE.studio);
    el.style.transition = ['transform', 'opacity', 'filter'].map(function (k) { return k + ' ' + dur + 's ' + e + ' ' + delay + 's'; }).join(',');
    requestAnimationFrame(function () { requestAnimationFrame(function () { apply(el, ID, p.persp); }); });
  }
  function appear(el) {
    if (reduced) return;
    var p = prepAppear(el);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var rb = en.rootBounds, enough = en.intersectionRatio >= 0.5 || (rb && en.intersectionRect.height >= rb.height * 0.25);
        if (en.isIntersecting && enough) { io.disconnect(); playAppear(el, p); }
      });
    }, { root: scrollerOf(el), threshold: [0, 0.25, 0.5] });
    io.observe(el);
    appeared.push(el);
  }
  function stagger(group) {
    var step = num(group, 'data-stagger', 0.1), base = num(group, 'data-delay', 0);
    Array.prototype.forEach.call(group.children, function (c, i) {
      if (!c.hasAttribute('data-appear')) c.setAttribute('data-appear', group.getAttribute('data-appear-group') || 'rise');
      c.setAttribute('data-delay', String(base + i * step));
    });
  }

  /* ---------- 2. Scroll scrubs: stack, exit, zoom, track, fan, parallax ---------- */
  function scrubStack(el) {
    var base = parseFloat(getComputedStyle(el).top) || 0, stick = base;
    el.style.transformOrigin = '50% 0';
    el.parentElement.style.perspective = '1200px';
    return function () {
      if (getComputedStyle(el).position !== 'sticky') { el.style.transform = ''; return; }
      /* A card taller than the screen (phones) pins once its bottom reaches the screen edge, so all of it is read
         before the next card slides over. */
      var vh = frameOf(scrollerOf(el)).height, fit = Math.min(base, Math.round(vh - el.offsetHeight - 16));
      if (fit !== stick) { stick = fit; el.style.top = fit + 'px'; }
      var b = box(el), span = Math.max(1, b.vh - stick);
      var enter = clamp((b.vh - b.top) / span, 0, 1);
      var next = el.nextElementSibling, cover = 0;
      if (next) { var nb = box(next); cover = clamp((b.vh - nb.top) / span, 0, 1); }
      apply(el, { rotateX: -30 * (1 - enter), scale: 1 - 0.1 * cover, opacity: 1 });
    };
  }
  function scrubExit(el) {
    return function () {
      var b = box(el), t = clamp(-b.top / Math.max(1, b.height), 0, 1);
      apply(el, mix(ID, { opacity: 0, rotateX: -40, y: 150 }, t), 1200);
    };
  }
  function scrubZoom(el) {
    return function () {
      var b = box(el), t = clamp((b.vh - b.top) / (b.vh * 0.75), 0, 1);
      apply(el, { scale: lerp(0.6, 1, t) });
    };
  }
  function scrubTrack(section) {
    var pin = section.querySelector('[data-track-pin]'), row = section.querySelector('[data-track-row]');
    if (!pin || !row) return null;
    /* The row slides the full distance (last tile fully in view), then holds for `hold` px of scroll
       before the section releases, so the reader sees the end before moving on. */
    var hold = 0, lastWidth = -1;
    function size() {
      var vh = frameOf(scrollerOf(section)).height, travel = Math.max(0, row.scrollWidth - pin.clientWidth + 60);
      hold = Math.round(vh * 0.35);
      section.style.height = (travel + vh + hold) + 'px'; pin.style.height = vh + 'px';
      lastWidth = row.scrollWidth;
      return travel;
    }
    var travel = size(); w.addEventListener('resize', function () { travel = size(); });
    return function () {
      /* Re-measure if the row's content width changed (fonts, images, or tiles added after load). */
      if (row.scrollWidth !== lastWidth) travel = size();
      var b = box(section), t = clamp(-b.top / Math.max(1, b.height - b.vh - hold), 0, 1);
      apply(row, { x: lerp(30, -travel, t) });
    };
  }
  function scrubFan(group) {
    var cards = Array.prototype.slice.call(group.children), n = cards.length, mid = (n - 1) / 2;
    var rots = [-7, 4, -3, 6, -5];
    cards.forEach(function (c, i) { c.style.zIndex = String(n - i); });
    return function () {
      var b = box(group), t = clamp((b.vh * 0.95 - b.top) / (b.vh * 0.6), 0, 1);
      var spread = num(group, 'data-spread', Math.min(260, b.width / Math.max(1, n)));
      cards.forEach(function (c, i) {
        var off = i - mid;
        apply(c, { x: off * spread * t, y: Math.abs(off) * 24 * t, rotate: rots[i % rots.length] * (1 - 0.6 * t) });
      });
    };
  }
  function scrubParallax(el) {
    var speed = num(el, 'data-parallax', 0.8);
    return function () {
      var sc = scrollerOf(el), y = sc ? sc.scrollTop : w.scrollY;
      apply(el, { y: y * (1 - speed) });
    };
  }
  var SCRUB = { stack: scrubStack, exit: scrubExit, zoom: scrubZoom, track: scrubTrack, fan: scrubFan };
  function scrub(el, fn) {
    if (!fn) return;
    if (reduced) { if (el.getAttribute('data-scrub') === 'track') fn(); return; }
    watch(el); jobs.push(fn); fn();
  }

  /* ---------- 3. TextReveal: per-word blur/opacity scrub (plainthing's "Text scroll") ---------- */
  function textReveal(el) {
    if (el.__arReveal) return;
    el.__arReveal = true;
    var words = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var parts = node.textContent.split(/(\s+)/), frag = d.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; }
          var s = d.createElement('span'); s.textContent = p; s.className = 'ar-word'; frag.appendChild(s); words.push(s);
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) { node.classList.add('ar-word'); words.push(node); }
    });
    if (reduced) return;
    var distance = num(el, 'data-distance', 1500), n = words.length;
    words.forEach(function (s) { s.style.transition = 'filter .2s ease-out, opacity .2s ease-out, transform .2s ease-out'; });
    watch(el);
    jobs.push(function () {
      var b = box(el), prog = clamp((b.vh - b.top - b.height * 0.25) / Math.max(1, distance - b.height), 0, 1);
      for (var i = 0; i < n; i++) {
        var k = clamp((prog - i / n) * n, 0, 1);
        apply(words[i], { opacity: lerp(0.1, 1, k), blur: 5 * (1 - k), y: 20 * (1 - k) });
      }
    });
    tick();
  }

  /* ---------- 4. StaggeredCycle: characters slide up through a mask, word by word ---------- */
  function cycle(el) {
    var list = (el.getAttribute('data-cycle') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!list.length) return;
    var hold = num(el, 'data-interval', 2500), charDur = 750, staggerAmt = num(el, 'data-stagger', 0.7);
    el.textContent = '';
    var sizer = d.createElement('span'); sizer.className = 'ar-cycle__sizer'; sizer.setAttribute('aria-hidden', 'true');
    sizer.textContent = list.reduce(function (a, b) { return b.length > a.length ? b : a; });
    var live = d.createElement('span'); live.className = 'ar-cycle__live';
    var sr = d.createElement('span'); sr.className = 'ar-sr'; sr.textContent = list.join(', ');
    el.appendChild(sizer); el.appendChild(live); el.appendChild(sr);
    function build(word) {
      var wrap = d.createElement('span'); wrap.className = 'ar-cycle__word'; wrap.setAttribute('aria-hidden', 'true');
      var chars = word.split('');
      chars.forEach(function (ch, i) {
        var m = d.createElement('span'); m.className = 'ar-cycle__mask';
        var c = d.createElement('span'); c.className = 'ar-cycle__char'; c.textContent = ch === ' ' ? ' ' : ch;
        c.__k = chars.length > 1 ? i / (chars.length - 1) : 0;
        m.appendChild(c); wrap.appendChild(m);
      });
      return wrap;
    }
    function move(wrap, y, delayFactor) {
      Array.prototype.forEach.call(wrap.querySelectorAll('.ar-cycle__char'), function (c) {
        var delay = (charDur / 1000) * 2 * delayFactor * c.__k * staggerAmt;
        c.style.transition = 'transform ' + charDur + 'ms ' + bez(EASE.cycle) + ' ' + delay.toFixed(3) + 's';
        c.style.transform = 'translateY(' + y + ')';
      });
    }
    var i = 0, cur = build(list[0]); live.appendChild(cur);
    if (reduced || list.length < 2) return;
    setInterval(function () {
      var old = cur; i = (i + 1) % list.length; cur = build(list[i]);
      Array.prototype.forEach.call(cur.querySelectorAll('.ar-cycle__char'), function (c) { c.style.transform = 'translateY(150%)'; });
      live.appendChild(cur);
      requestAnimationFrame(function () { requestAnimationFrame(function () { move(old, '-150%', 0.3); move(cur, '0%', 0.4); }); });
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, charDur * 2.2);
    }, hold);
  }

  /* ---------- 5. Ticker: infinite row, slows on hover, faded edges ---------- */
  function ticker(el) {
    var track = el.querySelector('[data-ticker-track]') || el.firstElementChild;
    if (!track) return;
    var speed = num(el, 'data-speed', 60), hoverFactor = num(el, 'data-hover-factor', 0.25), dir = el.getAttribute('data-direction') === 'right' ? 1 : -1;
    var base = track.innerHTML, guard = 0;
    while (track.scrollWidth < el.clientWidth * 2 && guard++ < 12) track.insertAdjacentHTML('beforeend', base);
    track.insertAdjacentHTML('beforeend', track.innerHTML);
    if (reduced) return;
    var x = 0, factor = 1, target = 1, last = performance.now();
    el.addEventListener('mouseenter', function () { target = hoverFactor; });
    el.addEventListener('mouseleave', function () { target = 1; });
    (function frame(now) {
      var dt = Math.min(64, now - last) / 1000; last = now;
      factor += (target - factor) * 0.08;
      var half = track.scrollWidth / 2;
      x += dir * speed * factor * dt;
      if (dir < 0 && x <= -half) x += half;
      if (dir > 0 && x >= 0) x -= half;
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      requestAnimationFrame(frame);
    })(last);
    if (dir > 0) x = -track.scrollWidth / 2;
  }

  /* ---------- 6. Cursor: 16px dot, exclusion blend, springs to the pointer, grows on targets ---------- */
  function cursor(area) {
    if (reduced || !finePointer) return null;
    var host = area === d.body ? d.body : area;
    var dot = d.createElement('div'); dot.className = 'ar-cursor'; dot.setAttribute('aria-hidden', 'true');
    var label = d.createElement('span'); dot.appendChild(label);
    if (host !== d.body) { dot.style.position = 'absolute'; if (getComputedStyle(host).position === 'static') host.style.position = 'relative'; }
    host.appendChild(dot); host.classList.add('ar-has-cursor');
    var tx = -100, ty = -100, x = -100, y = -100, vx = 0, vy = 0, s = 1, vs = 0, ts = 1;
    var k = 246, c = 25; /* bounce 0.2 over 0.4s */
    host.addEventListener('pointermove', function (e) {
      var r = host === d.body ? { left: 0, top: 0 } : host.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      var hit = e.target.closest && e.target.closest('a, button, [data-cursor]');
      ts = hit ? 3.5 : 1; label.textContent = hit && hit.getAttribute('data-cursor') ? hit.getAttribute('data-cursor') : '';
      dot.classList.toggle('is-label', !!label.textContent);
    });
    host.addEventListener('pointerleave', function () { ts = 0; });
    host.addEventListener('pointerenter', function () { ts = 1; });
    var last = performance.now();
    (function frame(now) {
      var dt = Math.min(32, now - last) / 1000; last = now;
      vx += (k * (tx - x) - c * vx) * dt; x += vx * dt;
      vy += (k * (ty - y) - c * vy) * dt; y += vy * dt;
      vs += (k * (ts - s) - c * vs) * dt; s += vs * dt;
      dot.style.transform = 'translate3d(' + (x - 8).toFixed(1) + 'px,' + (y - 8).toFixed(1) + 'px,0) scale(' + Math.max(0, s).toFixed(3) + ')';
      requestAnimationFrame(frame);
    })(last);
    return dot;
  }

  /* ---------- 7. DotGrid: canvas dots pushed away by the pointer, with inertia ---------- */
  function dotGrid(canvas) {
    var ctx = canvas.getContext('2d'); if (!ctx) return;
    var size = num(canvas, 'data-dot-size', 1), gap = num(canvas, 'data-dot-spacing', 20), radius = num(canvas, 'data-dot-radius', 130), inertia = num(canvas, 'data-dot-inertia', 0.4);
    var dots = [], mx = -1e3, my = -1e3, W = 0, H = 0;
    function color() { return getComputedStyle(canvas).color; }
    function resize() {
      var r = canvas.getBoundingClientRect(), dpr = w.devicePixelRatio || 1;
      W = r.width; H = r.height; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = []; for (var y = gap; y < H - gap / 2; y += gap) for (var x = gap; x < W - gap / 2; x += gap) dots.push({ x: x, y: y, ox: x, oy: y, vx: 0, vy: 0 });
    }
    function draw() { ctx.clearRect(0, 0, W, H); ctx.fillStyle = color(); dots.forEach(function (p) { ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2); ctx.fill(); }); }
    function step() {
      dots.forEach(function (p) {
        var dx = mx - p.x, dy = my - p.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) { var f = (radius - dist) / radius, a = Math.atan2(dy, dx); p.vx += (p.x - Math.cos(a) * f * 20 - p.x) * inertia; p.vy += (p.y - Math.sin(a) * f * 20 - p.y) * inertia; }
        p.vx *= 0.9; p.vy *= 0.9; p.x += p.vx; p.y += p.vy;
        var rx = p.ox - p.x, ry = p.oy - p.y; if (Math.sqrt(rx * rx + ry * ry) > 1) { p.x += rx * 0.03; p.y += ry * 0.03; }
      });
    }
    resize(); w.addEventListener('resize', function () { resize(); draw(); });
    var host = canvas.parentElement;
    host.addEventListener('pointermove', function (e) { var r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    host.addEventListener('pointerleave', function () { mx = my = -1e3; });
    if (reduced) { draw(); return; }
    (function frame() { step(); draw(); requestAnimationFrame(frame); })();
  }

  /* ---------- 8. ImageGrid: next image revealed by tiles radiating from the centre ---------- */
  function imageGrid(el) {
    var imgs = Array.prototype.slice.call(el.querySelectorAll('img'));
    if (imgs.length < 2) return;
    var cols = num(el, 'data-cols', 5), rows = num(el, 'data-rows', 4), hold = num(el, 'data-interval', 2500), dur = 1000, staggerAmt = 0.6;
    imgs.forEach(function (im, i) { im.style.opacity = i === 0 ? '1' : '0'; });
    if (reduced) return;
    var i = 0;
    setInterval(function () {
      var next = (i + 1) % imgs.length, layer = d.createElement('div'); layer.className = 'ar-grid-tiles';
      var maxD = Math.sqrt(Math.pow((cols - 1) / 2, 2) + Math.pow((rows - 1) / 2, 2)) || 1;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var t = d.createElement('span');
        t.style.backgroundImage = 'url("' + imgs[next].currentSrc + '")';
        t.style.backgroundSize = (cols * 100) + '% ' + (rows * 100) + '%';
        t.style.backgroundPosition = (cols > 1 ? c / (cols - 1) * 100 : 0) + '% ' + (rows > 1 ? r / (rows - 1) * 100 : 0) + '%';
        t.style.left = (c / cols * 100) + '%'; t.style.top = (r / rows * 100) + '%'; t.style.width = (100 / cols + 0.2) + '%'; t.style.height = (100 / rows + 0.2) + '%';
        var dist = Math.sqrt(Math.pow(c - (cols - 1) / 2, 2) + Math.pow(r - (rows - 1) / 2, 2)) / maxD;
        t.style.transition = 'transform ' + dur * (1 - staggerAmt) + 'ms ' + bez(EASE.studio) + ' ' + (dist * staggerAmt * dur).toFixed(0) + 'ms, opacity ' + dur * (1 - staggerAmt) + 'ms ' + bez(EASE.studio) + ' ' + (dist * staggerAmt * dur).toFixed(0) + 'ms';
        layer.appendChild(t);
      }
      el.appendChild(layer);
      requestAnimationFrame(function () { requestAnimationFrame(function () { layer.classList.add('is-in'); }); });
      setTimeout(function () { imgs[i].style.opacity = '0'; imgs[next].style.opacity = '1'; i = next; layer.remove(); }, dur + 60);
    }, hold);
  }

  /* ---------- 9. Intro: wordmark rises, then the curtain lifts (plainthing's loader, shortened) ---------- */
  function intro(el, done) {
    if (reduced) { el.classList.add('is-gone'); if (done) done(); return; }
    el.classList.remove('is-gone', 'is-leaving', 'is-on');
    void el.offsetWidth;
    el.classList.add('is-on');
    setTimeout(function () { el.classList.add('is-leaving'); }, 1700);
    setTimeout(function () { el.classList.add('is-gone'); if (done) done(); }, 2300);
  }

  /* ---------- 10. Smooth scroll (uses Lenis when the page has loaded it) ---------- */
  function smoothScroll() {
    if (reduced || !w.Lenis) return null;
    var lenis = new w.Lenis({ duration: 1 });
    lenis.on('scroll', tick);
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    return lenis;
  }

  /* ---------- 11. Count-up: numbers roll up to their value when half in view ---------- */
  function countUp(el) {
    var target = num(el, 'data-count', NaN);
    if (isNaN(target) || reduced) return;
    var dur = num(el, 'data-duration', 1.6) * 1000, decimals = (String(target).split('.')[1] || '').length;
    el.textContent = (0).toFixed(decimals);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || en.intersectionRatio < 0.5) return;
        io.disconnect();
        var t0 = performance.now();
        (function frame(now) {
          var t = clamp((now - t0) / dur, 0, 1), k = 1 - Math.pow(2, -10 * t); /* ease-out expo */
          el.textContent = (target * (t >= 1 ? 1 : k)).toFixed(decimals);
          if (t < 1) requestAnimationFrame(frame);
        })(t0);
      });
    }, { root: scrollerOf(el), threshold: [0, 0.5, 1] });
    io.observe(el);
  }

  /* ---------- init: wire everything under a root ---------- */
  var wired = {};
  function each(root, sel, fn) {
    var seen = wired[sel] || (wired[sel] = typeof WeakSet === 'function' ? new WeakSet() : { has: function () { return false; }, add: function () {} });
    Array.prototype.forEach.call(root.querySelectorAll(sel), function (el) { if (seen.has(el)) return; seen.add(el); fn(el); });
  }
  function init(root) {
    root = root || d;
    each(root, '[data-appear-group]', stagger);
    each(root, '[data-appear]', appear);
    each(root, '[data-scrub]', function (el) { var make = SCRUB[el.getAttribute('data-scrub')]; if (make) scrub(el, make(el)); });
    each(root, '[data-parallax]', function (el) { scrub(el, scrubParallax(el)); });
    each(root, '[data-reveal]', textReveal);
    each(root, '[data-cycle]', cycle);
    each(root, '[data-ticker]', ticker);
    each(root, 'canvas[data-dots]', dotGrid);
    each(root, '[data-image-grid]', imageGrid);
    each(root, '[data-cursor-area]', cursor);
    each(root, '[data-count]', countUp);
    d.documentElement.classList.add('ar-ready');
    tick();
  }
  function replay(root) {
    root = root || d;
    Array.prototype.forEach.call(root.querySelectorAll('[data-appear]'), function (el) { var p = prepAppear(el); setTimeout(function () { playAppear(el, p); }, 80); });
  }

  w.Aravind = {
    version: '1.2.0',
    motion: {
      init: init, replay: replay, appear: appear, textReveal: textReveal, cycle: cycle, ticker: ticker,
      cursor: cursor, dotGrid: dotGrid, imageGrid: imageGrid, intro: intro, smoothScroll: smoothScroll, countUp: countUp,
      ease: EASE, reduced: reduced
    }
  };
})();
