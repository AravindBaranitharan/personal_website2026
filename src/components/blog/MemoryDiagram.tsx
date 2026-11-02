import { Badge, DiagramFrame, Label, Meta, Title } from "./DiagramParts";

/**
 * Agentic memory: a write path and a read path around the context window, four stores, and the background
 * jobs that keep them small and true. Numbers match the walkthrough under it. 1200×760 canvas.
 */

const stores = [
  { title: "working", meta: ["scratchpad + plan", "this task only"], tag: "cleared at the end" },
  { title: "episodic", meta: ["what happened, when", "with outcomes"], tag: "append-only log" },
  { title: "semantic", meta: ["facts + preferences", "vector + graph"], tag: "upserted, versioned" },
  { title: "procedural", meta: ["skills + playbooks", "how to do things"], tag: "reviewed before use" },
];

const context = [
  { label: "system + task", width: 150, box: "fill-lilac", text: "fill-ink" },
  { label: "retrieved memories", width: 220, box: "fill-pink", text: "fill-on-pink" },
  { label: "recent turns", width: 268, box: "fill-none stroke-on-night-muted", text: "fill-on-night" },
  { label: "scratchpad", width: 110, box: "fill-none stroke-on-night-muted", text: "fill-on-night" },
];

export function MemoryDiagram({ caption }: { caption: string }) {
  return (
    <DiagramFrame
      id="mem"
      width={1200}
      height={760}
      title="Agentic memory architecture"
      caption={caption}
      figcaption="Fig. 1 · Memory as a write path, a read path and four stores. Numbers match the walkthrough below."
    >
      {/* ---------- Edges ---------- */}
      <g className="fill-none stroke-ink" strokeWidth="1.75">
        <path d="M440 150H322" markerEnd="url(#mem-arrow)" />
        <path d="M880 150H762" markerEnd="url(#mem-arrow)" />
        <path d="M180 262V328" markerEnd="url(#mem-arrow)" />
        <path d="M1020 328V262" markerEnd="url(#mem-arrow)" />
        <path d="M310 598V562" markerStart="url(#mem-arrow)" markerEnd="url(#mem-arrow)" />
        <path d="M890 598V562" markerEnd="url(#mem-arrow)" />
      </g>
      <Label x={381} y={138}>after each turn</Label>
      <Label x={821} y={138}>in budget</Label>
      <Label x={192} y={300} anchor="start">store</Label>
      <Label x={1032} y={300} anchor="start">retrieve</Label>
      <Label x={322} y={584} anchor="start">rewrite</Label>
      <Label x={902} y={584} anchor="start">prune</Label>

      {/* ---------- 01 Context window ---------- */}
      <rect x="440" y="40" width="320" height="220" rx="20" className="fill-night" />
      <Badge x={466} y={68} n="01" dark />
      <Title x={494} y={76} className="fill-on-night">context window</Title>
      <Meta x={466} y={106} className="fill-on-night-muted">all the model sees this turn</Meta>
      {context.map((row, i) => {
        const y = 124 + i * 30;
        return (
          <g key={row.label}>
            <rect x="466" y={y} width={row.width} height="24" rx="6" className={row.box} strokeWidth="1.25" />
            <text x={476} y={y + 16} className={`font-mono uppercase ${row.text}`} fontSize="10.5" letterSpacing="0.6">
              {row.label}
            </text>
          </g>
        );
      })}

      {/* ---------- 02 Write path ---------- */}
      <rect x="40" y="40" width="280" height="220" rx="20" className="fill-paper stroke-ink" strokeWidth="1.5" />
      <Badge x={66} y={68} n="02" />
      <Title x={94} y={76}>write</Title>
      <Meta x={60} y={112}>1 · observe the turn</Meta>
      <Meta x={60} y={136}>2 · extract facts + events</Meta>
      <Meta x={60} y={160}>3 · score importance</Meta>
      <Meta x={60} y={184}>4 · merge, don&apos;t duplicate</Meta>
      <rect x="60" y="206" width="140" height="30" rx="15" className="fill-pink" />
      <text x={130} y={225} textAnchor="middle" className="font-mono uppercase fill-on-pink" fontSize="11" letterSpacing="0.6">
        trust check
      </text>

      {/* ---------- 03 Read path ---------- */}
      <rect x="880" y="40" width="280" height="220" rx="20" className="fill-lilac" />
      <Badge x={906} y={68} n="03" />
      <Title x={934} y={76}>read</Title>
      <Meta x={900} y={112} className="fill-ink-2">1 · task → search query</Meta>
      <Meta x={900} y={136} className="fill-ink-2">2 · hybrid search</Meta>
      <Meta x={900} y={160} className="fill-ink-2">3 · rank: relevance,</Meta>
      <Meta x={928} y={180} className="fill-ink-2">recency, importance</Meta>
      <Meta x={900} y={204} className="fill-ink-2">4 · fit the token budget</Meta>

      {/* ---------- 04 Stores ---------- */}
      <rect x="40" y="330" width="1120" height="230" rx="20" className="fill-paper stroke-ink" strokeWidth="1.5" />
      <Badge x={66} y={358} n="04" />
      <Title x={94} y={366}>memory stores</Title>
      {stores.map((s, i) => {
        const x = 60 + i * 275;
        return (
          <g key={s.title}>
            <rect x={x} y="392" width="255" height="148" rx="12" className="fill-band" />
            <text x={x + 18} y={428} className="font-sans fill-ink" fontSize="20" fontWeight="600" letterSpacing="-0.4">
              {s.title}
            </text>
            <Meta x={x + 18} y={456}>{s.meta[0]}</Meta>
            <Meta x={x + 18} y={478}>{s.meta[1]}</Meta>
            <Meta x={x + 18} y={518} className="fill-pink-ink">{s.tag}</Meta>
          </g>
        );
      })}

      {/* ---------- 05 Consolidate ---------- */}
      <rect x="40" y="600" width="540" height="120" rx="20" className="fill-night" />
      <Badge x={66} y={628} n="05" dark />
      <Title x={94} y={636} className="fill-on-night">consolidate</Title>
      <Meta x={66} y={670} className="fill-on-night-muted">runs between sessions</Meta>
      <Meta x={66} y={692} className="fill-on-night-muted">summarise · dedupe · resolve conflicts</Meta>

      {/* ---------- 06 Forget ---------- */}
      <rect x="620" y="600" width="540" height="120" rx="20" className="fill-pink" />
      <Badge x={646} y={628} n="06" />
      <Title x={674} y={636} className="fill-on-pink">forget</Title>
      <Meta x={646} y={670} className="fill-on-pink">decay what&apos;s unused · expire stale facts</Meta>
      <Meta x={646} y={692} className="fill-on-pink">delete on request</Meta>
    </DiagramFrame>
  );
}
