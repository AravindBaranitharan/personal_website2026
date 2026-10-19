/**
 * Footer illustration: a pink sunset behind a city skyline, mountains, shimmering water and a pier with people
 * walking toward the horizon. Original artwork drawn in the site palette; motion lives in styles/footer.css.
 * Everything is fixed data (no randomness) so server and client render the same markup.
 */

const HORIZON = 384;
// Skyline heights are scaled so the sun rises well above the towers.
const SKY_SCALE = 0.62;

// Skyline: [x, width, height]; towers cluster under the sun, shorter blocks toward the edges.
const BUILDINGS: [number, number, number][] = [
  [470, 26, 34], [500, 22, 52], [526, 30, 44], [560, 24, 78], [588, 34, 62], [626, 22, 96], [652, 30, 118],
  [686, 18, 196], [708, 32, 132], [744, 26, 158], [774, 34, 104], [812, 28, 172], [844, 22, 126], [870, 36, 148],
  [910, 24, 182], [938, 30, 112], [972, 26, 92], [1002, 34, 128], [1040, 22, 74], [1066, 30, 58], [1100, 26, 40],
  [1130, 22, 30],
];

// Cloud streaks: [x, y, width, height, opacity]
const CLOUDS: [number, number, number, number, number][] = [
  [80, 120, 420, 10, 0.7], [180, 142, 260, 7, 0.5], [40, 196, 300, 8, 0.45], [1040, 104, 380, 10, 0.65],
  [1180, 128, 300, 7, 0.5], [1240, 214, 280, 8, 0.4], [600, 70, 240, 6, 0.35], [880, 176, 210, 6, 0.35],
];

// Water shimmer: [x, y, width]
const SHIMMER: [number, number, number][] = [
  [140, 412, 120], [320, 430, 90], [1180, 418, 140], [1360, 444, 100], [220, 478, 160], [1240, 492, 150],
  [90, 540, 130], [1400, 556, 120], [420, 520, 80], [1110, 532, 90],
];

// People on the pier: [x, y (feet), scale, coat colour, delay(s)]
const PEOPLE: [number, number, number, string, number][] = [
  [806, 452, 0.42, "#5a4fb0", 0],
  [826, 486, 0.58, "#3b2f63", 0.3],
  [770, 528, 0.78, "#8e2fc0", 0.15],
  [880, 596, 1.02, "#c46ad6", 0.45],
];

function Person({ x, y, s, coat, delay }: { x: number; y: number; s: number; coat: string; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ar-scene__walker" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx="0" cy="2" rx="16" ry="3.5" fill="#6c5bc4" opacity="0.25" />
        {/* legs */}
        <rect x="-8" y="-34" width="7" height="34" rx="3" fill="#2a2148" />
        <rect x="1" y="-34" width="7" height="34" rx="3" fill="#2a2148" />
        {/* coat */}
        <path d="M-13 -74c0-6 5-10 13-10s13 4 13 10v42h-26z" fill={coat} />
        {/* head + hair */}
        <circle cx="0" cy="-94" r="10" fill="#e9b9a0" />
        <path d="M-10 -96c0-8 5-12 10-12s10 4 10 12c-4-4-16-4-20 0z" fill="#2a2148" />
      </g>
    </g>
  );
}

export function FooterScene() {
  // Pier planks: perspective-spaced lines between the two edges.
  const planks = Array.from({ length: 16 }, (_, i) => {
    const k = Math.pow((i + 1) / 16, 1.8);
    const y = HORIZON + (600 - HORIZON) * k;
    const half = 12 + (240 - 12) * k;
    return { y: Math.round(y * 10) / 10, x1: Math.round((800 - half) * 10) / 10, x2: Math.round((800 + half) * 10) / 10 };
  });

  return (
    <div className="ar-scene" aria-hidden="true">
      <svg viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice" role="presentation">
        <defs>
          <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdf6fb" stopOpacity="0" />
            <stop offset="0.35" stopColor="#fbe7f6" />
            <stop offset="0.62" stopColor="#f6cdef" />
            <stop offset="0.64" stopColor="#f3c0ea" />
          </linearGradient>
          <radialGradient id="sc-sun" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0" stopColor="#ffe6f4" />
            <stop offset="0.55" stopColor="#f6b2e6" />
            <stop offset="1" stopColor="#e88ad9" />
          </radialGradient>
          <radialGradient id="sc-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd2ef" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffd2ef" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sc-city" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a78de" />
            <stop offset="0.7" stopColor="#c28fe6" />
            <stop offset="1" stopColor="#e9a7e1" />
          </linearGradient>
          <linearGradient id="sc-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efc6ef" />
            <stop offset="0.45" stopColor="#c7bdf4" />
            <stop offset="1" stopColor="#a3a9f0" />
          </linearGradient>
          <linearGradient id="sc-pier" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7dcf1" />
            <stop offset="1" stopColor="#fff7fb" />
          </linearGradient>
          <filter id="sc-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0 0.45  0 0 0 0.55 0" />
          </filter>
          <clipPath id="sc-above">
            <rect x="0" y="0" width="1600" height={HORIZON} />
          </clipPath>
        </defs>

        {/* sky */}
        <rect width="1600" height={HORIZON} fill="url(#sc-sky)" />

        {/* sun + glow, clipped at the horizon */}
        <g clipPath="url(#sc-above)">
          <circle className="ar-scene__glow" cx="800" cy="330" r="300" fill="url(#sc-glow)" />
          <circle cx="800" cy="330" r="168" fill="url(#sc-sun)" />
        </g>

        {/* clouds */}
        <g className="ar-scene__clouds">
          {CLOUDS.map(([x, y, w, h, o], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={h / 2} fill={i % 3 === 0 ? "#ffffff" : "#f8d2ef"} opacity={o} />
          ))}
        </g>

        {/* far and near mountains */}
        <path
          d={`M0 ${HORIZON}L0 300L90 270L170 296L260 248L350 290L430 262L520 300L560 ${HORIZON}ZM1040 ${HORIZON}L1080 296L1160 254L1250 286L1340 240L1430 278L1520 252L1600 282L1600 ${HORIZON}Z`}
          fill="#dcc8f6"
        />
        <path
          d={`M0 ${HORIZON}L0 336L110 312L210 340L300 318L390 346L470 330L540 ${HORIZON}ZM1060 ${HORIZON}L1130 334L1220 312L1310 342L1400 316L1500 340L1600 322L1600 ${HORIZON}Z`}
          fill="#b9a5ee"
        />

        {/* skyline */}
        <g>
          {BUILDINGS.map(([x, w, h]) => (
            <rect key={x} x={x} y={HORIZON - h * SKY_SCALE} width={w} height={h * SKY_SCALE} fill="url(#sc-city)" />
          ))}
          {/* spire on the tallest tower */}
          <rect x="694" y={HORIZON - 196 * SKY_SCALE - 34} width="2" height="34" fill="#8a78de" />
        </g>

        {/* water */}
        <rect y={HORIZON} width="1600" height={600 - HORIZON} fill="url(#sc-water)" />
        <rect y={HORIZON - 1} width="1600" height="5" fill="#ffe4f6" opacity="0.9" />
        {/* skyline reflection */}
        <g opacity="0.35" transform={`translate(0 ${HORIZON * 2}) scale(1 -1)`}>
          {BUILDINGS.map(([x, w, h]) => (
            <rect key={x} x={x} y={HORIZON - h * SKY_SCALE * 0.6} width={w} height={h * SKY_SCALE * 0.6} fill="#9d86e2" />
          ))}
        </g>
        {/* sun reflection */}
        <g className="ar-scene__shimmer" fill="#ffd9f1">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={800 - (140 - i * 14)} y={HORIZON + 10 + i * 13} width={(140 - i * 14) * 2} height="3" rx="1.5" opacity={0.7 - i * 0.08} />
          ))}
        </g>
        <g className="ar-scene__shimmer ar-scene__shimmer--b" fill="#ffffff">
          {SHIMMER.map(([x, y, w], i) => (
            <rect key={i} x={x} y={y} width={w} height="2.5" rx="1.25" opacity="0.45" />
          ))}
        </g>

        {/* pier */}
        <polygon points={`548,600 568,600 790,${HORIZON} 788,${HORIZON}`} fill="#8f80e0" />
        <polygon points={`1032,600 1052,600 812,${HORIZON} 810,${HORIZON}`} fill="#8f80e0" />
        <polygon points={`568,600 1032,600 810,${HORIZON} 790,${HORIZON}`} fill="url(#sc-pier)" />
        <g stroke="#ecc9ea" strokeWidth="1.5">
          {planks.map((p) => (
            <line key={p.y} x1={p.x1} y1={p.y} x2={p.x2} y2={p.y} />
          ))}
        </g>

        {/* people walking toward the horizon */}
        {PEOPLE.map(([x, y, s, coat, delay]) => (
          <Person key={x} x={x} y={y} s={s} coat={coat} delay={delay} />
        ))}

        {/* grain over the whole scene */}
        <rect width="1600" height="600" filter="url(#sc-grain)" opacity="0.35" style={{ mixBlendMode: "soft-light" }} />
      </svg>
    </div>
  );
}
