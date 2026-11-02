import type { ReactNode } from "react";

// Shared SVG pieces for the blog's diagrams, so every figure uses the same type scale and palette.

export function Badge({ x, y, n, dark = false }: { x: number; y: number; n: string; dark?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="15" className={dark ? "fill-pink" : "fill-ink"} />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        className={`font-mono ${dark ? "fill-on-pink" : "fill-paper"}`}
        fontSize="11"
        letterSpacing="0.5"
      >
        {n}
      </text>
    </g>
  );
}

export function Title({ x, y, children, className = "fill-ink" }: { x: number; y: number; children: ReactNode; className?: string }) {
  return (
    <text x={x} y={y} className={`font-sans ${className}`} fontSize="24" fontWeight="700" letterSpacing="-0.6">
      {children}
    </text>
  );
}

export function Meta({ x, y, children, className = "fill-ink-muted" }: { x: number; y: number; children: ReactNode; className?: string }) {
  return (
    <text x={x} y={y} className={`font-mono uppercase ${className}`} fontSize="11.5" letterSpacing="0.6">
      {children}
    </text>
  );
}

export function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="font-mono uppercase fill-ink-2" fontSize="10.5" letterSpacing="0.6">
      {children}
    </text>
  );
}

/** The figure shell: banded card, faint grid, arrow markers (`${id}-arrow`, `${id}-arrow-pink`), sideways scroll on narrow screens. */
export function DiagramFrame({
  id,
  width,
  height,
  title,
  caption,
  figcaption,
  children,
}: {
  id: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  figcaption: string;
  children: ReactNode;
}) {
  return (
    <figure className="m-0 grid gap-[var(--space-3)]">
      <div className="overflow-x-auto rounded-[var(--radius-lg)] bg-band" data-lenis-prevent-horizontal="">
        <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full min-w-[760px]" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
          <title id={`${id}-title`}>{title}</title>
          <desc id={`${id}-desc`}>{caption}</desc>
          <defs>
            <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" className="fill-ink" />
            </marker>
            <marker id={`${id}-arrow-pink`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" className="fill-pink-ink" />
            </marker>
            <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0v40" className="fill-none stroke-ink" strokeOpacity="0.06" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill={`url(#${id}-grid)`} />
          {children}
        </svg>
      </div>
      <figcaption className="ar-mono ar-muted">{figcaption}</figcaption>
    </figure>
  );
}
