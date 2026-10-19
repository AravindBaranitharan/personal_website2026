import type { CSSProperties, ReactNode } from "react";
import type { Project } from "@/content/site";

type Tone = Project["tone"];

/** Ground and text colour per tone; every value is a palette token. */
const TONES: Record<Tone, { ground: string; text: string; meta: string }> = {
  pink: { ground: "bg-pink", text: "text-on-pink", meta: "text-on-pink" },
  night: { ground: "bg-night", text: "text-on-night", meta: "text-on-night-muted" },
  wash: { ground: "bg-wash-lilac", text: "text-ink-plum", meta: "text-ink-2" },
  band: { ground: "bg-band", text: "text-ink", meta: "text-ink-muted" },
};

/** Decorative artwork per tone, drawn in an 800×500 (16:10) frame that crops to fill any box. */
function Artwork({ tone }: { tone: Tone }): ReactNode {
  switch (tone) {
    case "pink":
      // Pink fill with an ink disc (the HorizontalTrack "rag." slide).
      return (
        <>
          <circle cx="610" cy="170" r="140" className="fill-ink" />
          <circle cx="610" cy="170" r="190" className="fill-none stroke-ink" strokeWidth="1.5" />
          <circle cx="430" cy="64" r="16" className="fill-pink-soft" />
        </>
      );
    case "night":
      // Night ground crossed by a pink-soft stripe (the "agents." slide), plus a thin lilac echo.
      return (
        <>
          <rect x="-60" y="196" width="940" height="60" className="fill-pink-soft" transform="rotate(-6 400 226)" />
          <rect x="-60" y="282" width="940" height="3" className="fill-lilac" transform="rotate(-6 400 283)" />
          <circle cx="690" cy="96" r="10" className="fill-pink" />
        </>
      );
    case "wash":
      // The wash glow with a registration crosshair (the "evals." slide).
      return (
        <>
          <circle cx="330" cy="230" r="260" className="fill-wash-pink" />
          <circle cx="700" cy="300" r="220" className="fill-wash-lavender" />
          <g className="fill-none stroke-ink-plum" strokeWidth="3">
            <circle cx="620" cy="160" r="40" />
            <path d="M620 80v160M540 160h160" />
          </g>
        </>
      );
    case "band":
      // Band ground with a mono grid, one highlighted cell and coordinates along the edge.
      return (
        <>
          <g className="stroke-ink" strokeOpacity="0.12" strokeWidth="1">
            {Array.from({ length: 9 }, (_, i) => (
              <path key={`v${i}`} d={`M${(i + 1) * 80} 0v500`} />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <path key={`h${i}`} d={`M0 ${(i + 1) * 80}h800`} />
            ))}
          </g>
          <rect x="560" y="80" width="160" height="80" className="fill-pink-soft" />
          <rect x="640" y="160" width="80" height="80" className="fill-ink" />
          <g className="fill-ink font-mono" fillOpacity="0.45" fontSize="13" letterSpacing="1">
            {Array.from({ length: 9 }, (_, i) => (
              <text key={`t${i}`} x={(i + 1) * 80 + 6} y="20">
                {String(i + 1).padStart(2, "0")}
              </text>
            ))}
          </g>
        </>
      );
  }
}

export type ProjectVisualProps = {
  project: Project;
  className?: string;
  /** Above the fold (hero of a case study). Off-screen visuals skip rendering work until they near the viewport. */
  priority?: boolean;
  /** Fill a positioned parent (StackCard media, MediaTile) instead of sizing itself at 16:10. */
  fill?: boolean;
  /** Optional mono line shown top-left, e.g. the project's role. */
  caption?: string;
};

/**
 * Designed placeholder for a project until real screenshots exist: a 16:10 tile in the palette,
 * keyed by `project.tone`, with the title set large and lowercase like the HorizontalTrack slides.
 */
export function ProjectVisual({ project, className, priority = false, fill = false, caption }: ProjectVisualProps) {
  const tone = TONES[project.tone];
  const style: CSSProperties = {
    containerType: "inline-size",
    ...(priority ? null : { contentVisibility: "auto" }),
  };

  return (
    <div
      role="img"
      aria-label={`${project.title}: cover image`}
      style={style}
      className={[
        "relative isolate select-none overflow-hidden",
        fill ? "absolute inset-0 h-full w-full" : "aspect-[16/10] w-full rounded-[var(--radius-lg)]",
        project.tone === "night" ? "ring-1 ring-inset ring-on-night/15" : "",
        tone.ground,
        tone.text,
        className ?? "",
      ].join(" ")}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <Artwork tone={project.tone} />
      </svg>

      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col justify-between"
        style={{ padding: "clamp(14px, 5cqi, 40px)" }}
      >
        <div className={`flex items-start justify-between gap-4 font-mono text-[11px] uppercase leading-[14px] tracking-[0.08em] ${tone.meta}`}>
          <span>{caption}</span>
          <span className="whitespace-nowrap">
            {project.org} · {project.year}
          </span>
        </div>
        <p
          className="m-0 max-w-[92%] font-extrabold lowercase leading-[0.86] tracking-[-0.055em] [overflow-wrap:anywhere]"
          style={{ fontSize: "clamp(26px, 9.5cqi, 120px)" }}
        >
          {project.title}.
        </p>
      </div>
    </div>
  );
}
