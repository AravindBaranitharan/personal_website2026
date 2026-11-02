import type { ReactNode } from "react";

/**
 * The long-horizon agent architecture, drawn in the palette. Numbers match the walkthrough under it.
 * Drawn on a 1200×760 canvas; below ~760px wide the figure scrolls sideways instead of shrinking the text.
 */

function Badge({ x, y, n, dark = false }: { x: number; y: number; n: string; dark?: boolean }) {
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

function Title({ x, y, children, className = "fill-ink" }: { x: number; y: number; children: ReactNode; className?: string }) {
  return (
    <text x={x} y={y} className={`font-sans ${className}`} fontSize="24" fontWeight="700" letterSpacing="-0.6">
      {children}
    </text>
  );
}

function Meta({ x, y, children, className = "fill-ink-muted" }: { x: number; y: number; children: ReactNode; className?: string }) {
  return (
    <text x={x} y={y} className={`font-mono uppercase ${className}`} fontSize="11.5" letterSpacing="0.6">
      {children}
    </text>
  );
}

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="font-mono uppercase fill-ink-2" fontSize="10.5" letterSpacing="0.6">
      {children}
    </text>
  );
}

export function ArchitectureDiagram({ caption }: { caption: string }) {
  return (
    <figure className="m-0 grid gap-[var(--space-3)]">
      <div className="overflow-x-auto rounded-[var(--radius-lg)] bg-band" data-lenis-prevent-horizontal="">
        <svg
          viewBox="0 0 1200 760"
          className="block h-auto w-full min-w-[760px]"
          role="img"
          aria-labelledby="arch-title arch-desc"
        >
          <title id="arch-title">Long-horizon agent architecture</title>
          <desc id="arch-desc">{caption}</desc>
          <defs>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" className="fill-ink" />
            </marker>
            <marker id="arch-arrow-pink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" className="fill-pink-ink" />
            </marker>
            <pattern id="arch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0v40" className="fill-none stroke-ink" strokeOpacity="0.06" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="1200" height="760" fill="url(#arch-grid)" />

          {/* ---------- Edges (drawn first so boxes sit on top) ---------- */}
          <g className="fill-none stroke-ink" strokeWidth="1.75">
            {/* goal → planner */}
            <path d="M282 112H356" markerEnd="url(#arch-arrow)" />
            {/* planner → ledger */}
            <path d="M582 112H636" markerEnd="url(#arch-arrow)" />
            {/* ledger → orchestrator: next ready task */}
            <path d="M760 234C760 290 660 300 600 318" markerEnd="url(#arch-arrow)" />
            {/* orchestrator → workers */}
            <path d="M612 362C660 362 670 330 716 330" markerEnd="url(#arch-arrow)" />
            <path d="M614 388H716" markerEnd="url(#arch-arrow)" />
            <path d="M612 414C660 414 670 446 716 446" markerEnd="url(#arch-arrow)" />
            {/* workers → verifier */}
            <path d="M922 388H976" markerEnd="url(#arch-arrow)" />
            {/* verifier pass → ledger */}
            <path d="M1070 330V140H946" markerEnd="url(#arch-arrow)" />
            {/* verifier → checkpointer */}
            <path d="M1100 446V556" markerEnd="url(#arch-arrow)" />
            {/* orchestrator ↔ memory */}
            <path d="M520 480V556" markerStart="url(#arch-arrow)" markerEnd="url(#arch-arrow)" />
          </g>
          {/* verifier fail → orchestrator: retry or replan */}
          <path
            d="M1010 446C1000 520 700 520 590 462"
            className="fill-none stroke-pink-ink"
            strokeWidth="2"
            strokeDasharray="7 6"
            markerEnd="url(#arch-arrow-pink)"
          />
          {/* governor ⇢ orchestrator: limits and gates */}
          <path d="M282 388H424" className="fill-none stroke-ink" strokeWidth="1.75" strokeDasharray="4 5" markerEnd="url(#arch-arrow)" />

          {/* Edge labels */}
          <Label x={790} y={266} anchor="start">next ready task</Label>
          <Label x={1080} y={236} anchor="start">pass</Label>
          <Label x={1080} y={252} anchor="start">mark done</Label>
          <Label x={1112} y={506} anchor="start">persist</Label>
          <Label x={354} y={378}>budgets · gates</Label>
          <Label x={532} y={524} anchor="start">read / write</Label>
          <text x={800} y={532} textAnchor="middle" className="font-mono uppercase fill-pink-ink" fontSize="10.5" letterSpacing="0.6">
            fail + reason → retry or replan
          </text>

          {/* ---------- 01 Goal contract ---------- */}
          <rect x="40" y="40" width="242" height="164" rx="20" className="fill-pink" />
          <Badge x={66} y={66} n="01" />
          <Title x={60} y={118} className="fill-on-pink">goal contract</Title>
          <Meta x={60} y={146} className="fill-on-pink">objective · constraints</Meta>
          <Meta x={60} y={166} className="fill-on-pink">definition of done</Meta>
          <Meta x={60} y={186} className="fill-on-pink">budget</Meta>

          {/* ---------- 02 Planner ---------- */}
          <rect x="358" y="60" width="224" height="104" rx="20" className="fill-paper stroke-ink" strokeWidth="1.5" />
          <Badge x={384} y={86} n="02" />
          <Title x={378} y={128}>planner</Title>
          <Meta x={378} y={150}>decompose · replan</Meta>

          {/* ---------- 02 Task ledger ---------- */}
          <rect x="638" y="40" width="306" height="194" rx="20" className="fill-night" />
          <Title x={662} y={80} className="fill-on-night">task ledger</Title>
          <Meta x={662} y={102} className="fill-on-night-muted">graph of tasks + acceptance checks</Meta>
          <g strokeWidth="1.5" className="stroke-on-night-muted fill-none">
            <path d="M690 160 750 136M690 160 750 184M774 136 834 160M774 184 834 160M858 160 906 160" />
          </g>
          <circle cx="678" cy="160" r="12" className="fill-lilac" />
          <circle cx="762" cy="136" r="12" className="fill-lilac" />
          <circle cx="762" cy="184" r="12" className="fill-pink" />
          <circle cx="846" cy="160" r="12" className="fill-none stroke-on-night" strokeWidth="1.5" />
          <circle cx="918" cy="160" r="12" className="fill-none stroke-on-night" strokeWidth="1.5" />
          <circle cx="667" cy="214" r="5" className="fill-lilac" />
          <Meta x={678} y={218} className="fill-on-night-muted">done</Meta>
          <circle cx="730" cy="214" r="5" className="fill-pink" />
          <Meta x={741} y={218} className="fill-on-night-muted">running</Meta>
          <circle cx="818" cy="214" r="4.5" className="fill-none stroke-on-night" strokeWidth="1.25" />
          <Meta x={829} y={218} className="fill-on-night-muted">waiting</Meta>

          {/* ---------- 03 Orchestrator ---------- */}
          <circle cx="520" cy="388" r="92" className="fill-paper stroke-ink" strokeWidth="1.5" />
          <circle cx="520" cy="388" r="78" className="fill-none stroke-pink" strokeWidth="2" strokeDasharray="3 7" />
          <Badge x={520} y={322} n="03" dark />
          <text x={520} y={394} textAnchor="middle" className="font-sans fill-ink" fontSize="22" fontWeight="700" letterSpacing="-0.6">
            orchestrator
          </text>
          <text x={520} y={418} textAnchor="middle" className="font-mono uppercase fill-ink-muted" fontSize="10.5" letterSpacing="0.6">
            pick · assemble
          </text>
          <text x={520} y={434} textAnchor="middle" className="font-mono uppercase fill-ink-muted" fontSize="10.5" letterSpacing="0.6">
            dispatch
          </text>

          {/* ---------- 04 Workers ---------- */}
          <Badge x={734} y={290} n="04" />
          {[
            { y: 308, label: "worker · code" },
            { y: 366, label: "worker · research" },
            { y: 424, label: "worker · tools" },
          ].map((w) => (
            <g key={w.label}>
              <rect x="718" y={w.y} width="204" height="44" rx="12" className="fill-paper stroke-ink" strokeWidth="1.5" />
              <text x={738} y={w.y + 27} className="font-mono uppercase fill-ink" fontSize="12" letterSpacing="0.6">
                {w.label}
              </text>
            </g>
          ))}

          {/* ---------- 05 Verifier ---------- */}
          <rect x="978" y="330" width="182" height="116" rx="20" className="fill-lilac" />
          <Badge x={1004} y={356} n="05" />
          <Title x={998} y={400}>verifier</Title>
          <Meta x={998} y={420} className="fill-ink-2">tests · schemas</Meta>
          <Meta x={998} y={436} className="fill-ink-2">llm judge</Meta>

          {/* ---------- 08 Governor ---------- */}
          <rect x="40" y="288" width="242" height="200" rx="20" className="fill-paper stroke-ink" strokeWidth="1.5" />
          <Badge x={66} y={314} n="08" />
          <Title x={60} y={364}>governor</Title>
          <Meta x={60} y={392}>token + time budgets</Meta>
          <Meta x={60} y={414}>loop detection</Meta>
          <g>
            <rect x="60" y="432" width="160" height="32" rx="16" className="fill-pink" />
            <text x={140} y={452} textAnchor="middle" className="font-mono uppercase fill-on-pink" fontSize="11" letterSpacing="0.6">
              human gate
            </text>
          </g>

          {/* ---------- 06 Memory ---------- */}
          <rect x="40" y="558" width="720" height="162" rx="20" className="fill-paper stroke-ink" strokeWidth="1.5" />
          <Badge x={66} y={584} n="06" />
          <Title x={94} y={592}>memory</Title>
          {[
            { x: 60, title: "working", meta: ["this step only", "fresh every call"] },
            { x: 290, title: "episodic log", meta: ["append-only", "what happened + why"] },
            { x: 520, title: "semantic store", meta: ["facts + decisions", "retrieved on demand"] },
          ].map((m) => (
            <g key={m.title}>
              <rect x={m.x} y="612" width="220" height="90" rx="12" className="fill-band" />
              <text x={m.x + 16} y={642} className="font-sans fill-ink" fontSize="18" fontWeight="600" letterSpacing="-0.4">
                {m.title}
              </text>
              <Meta x={m.x + 16} y={666}>{m.meta[0]}</Meta>
              <Meta x={m.x + 16} y={686}>{m.meta[1]}</Meta>
            </g>
          ))}

          {/* ---------- 07 Checkpointer ---------- */}
          <rect x="800" y="558" width="360" height="162" rx="20" className="fill-night" />
          <Badge x={826} y={584} n="07" dark />
          <Title x={854} y={592} className="fill-on-night">checkpointer</Title>
          <Meta x={820} y={634} className="fill-on-night-muted">state saved after every step</Meta>
          <Meta x={820} y={656} className="fill-on-night-muted">crash → resume, not restart</Meta>
          <g>
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={820 + i * 36} y="676" width="28" height="22" rx="4" className={i < 6 ? "fill-lilac" : "fill-none stroke-on-night-muted"} strokeWidth="1.25" />
            ))}
          </g>
        </svg>
      </div>
      <figcaption className="ar-mono ar-muted">Fig. 1 · The proposed architecture. Numbers match the walkthrough below.</figcaption>
    </figure>
  );
}
