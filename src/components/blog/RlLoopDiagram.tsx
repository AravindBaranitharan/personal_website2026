import { Badge, DiagramFrame, Label, Meta, Title } from "./DiagramParts";

/**
 * One step of RL training for an agent: act, collect a group of rollouts, grade them, compare each to the
 * group average, update. Numbers match the walkthrough under it. 1200×760 canvas.
 */

const rollouts = [
  { steps: 5, pass: true },
  { steps: 7, pass: false },
  { steps: 4, pass: true },
  { steps: 8, pass: false },
];

export function RlLoopDiagram({ caption }: { caption: string }) {
  return (
    <DiagramFrame
      id="rl"
      width={1200}
      height={760}
      title="Reinforcement learning loop for an agent"
      caption={caption}
      figcaption="Fig. 1 · One round of RL for an agent. Numbers match the walkthrough below."
    >
      {/* ---------- Edges ---------- */}
      <g className="fill-none stroke-ink" strokeWidth="1.75">
        <path d="M280 126H358" markerEnd="url(#rl-arrow)" />
        <path d="M358 178H280" markerEnd="url(#rl-arrow)" />
        <path d="M740 150H858" markerEnd="url(#rl-arrow)" />
        <path d="M1010 260V418" markerEnd="url(#rl-arrow)" />
        <path d="M840 520H762" markerEnd="url(#rl-arrow)" />
        <path d="M440 520H362" markerEnd="url(#rl-arrow)" />
        <path d="M170 420V242" markerEnd="url(#rl-arrow)" />
      </g>
      <path d="M1000 620V666" className="fill-none stroke-pink-ink" strokeWidth="2" strokeDasharray="7 6" markerEnd="url(#rl-arrow-pink)" />

      <Label x={319} y={116}>action</Label>
      <Label x={319} y={200}>result</Label>
      <Label x={799} y={138}>trajectories</Label>
      <Label x={1022} y={344} anchor="start">score each one</Label>
      <Label x={801} y={508}>rewards</Label>
      <Label x={401} y={508}>signal</Label>
      <Label x={182} y={336} anchor="start">new policy</Label>
      <text x={1012} y={648} className="font-mono uppercase fill-pink-ink" fontSize="10.5" letterSpacing="0.6">
        audit the grader
      </text>

      {/* ---------- 01 Policy ---------- */}
      <rect x="40" y="60" width="240" height="180" rx="20" className="fill-pink" />
      <Badge x={66} y={86} n="01" />
      <Title x={60} y={146} className="fill-on-pink">policy</Title>
      <Meta x={60} y={176} className="fill-on-pink">the model being trained</Meta>
      <Meta x={60} y={198} className="fill-on-pink">picks the next action</Meta>

      {/* ---------- 02 Environment ---------- */}
      <rect x="360" y="40" width="380" height="220" rx="20" className="fill-night" />
      <Badge x={386} y={66} n="02" dark />
      <Title x={414} y={74} className="fill-on-night">environment</Title>
      <Meta x={386} y={108} className="fill-on-night-muted">where the agent acts</Meta>
      {[
        { x: 386, label: "task", sub: "prompt" },
        { x: 502, label: "tools", sub: "shell · web" },
        { x: 618, label: "state", sub: "files · db" },
      ].map((c) => (
        <g key={c.label}>
          <rect x={c.x} y="130" width="104" height="104" rx="12" className="fill-none stroke-on-night-muted" strokeWidth="1.25" />
          <text x={c.x + 52} y={178} textAnchor="middle" className="font-sans fill-on-night" fontSize="18" fontWeight="600" letterSpacing="-0.4">
            {c.label}
          </text>
          <text x={c.x + 52} y={202} textAnchor="middle" className="font-mono uppercase fill-on-night-muted" fontSize="10" letterSpacing="0.6">
            {c.sub}
          </text>
        </g>
      ))}

      {/* ---------- 03 Rollouts ---------- */}
      <rect x="860" y="40" width="300" height="220" rx="20" className="fill-paper stroke-ink" strokeWidth="1.5" />
      <Badge x={886} y={66} n="03" />
      <Title x={914} y={74}>rollouts</Title>
      <Meta x={886} y={106}>several attempts per task</Meta>
      {rollouts.map((r, row) => {
        const y = 136 + row * 28;
        return (
          <g key={row}>
            <path d={`M886 ${y}H${886 + (r.steps - 1) * 28}`} className="stroke-ink-soft" strokeWidth="1.25" />
            {Array.from({ length: r.steps }, (_, i) => (
              <circle key={i} cx={886 + i * 28} cy={y} r="4" className="fill-ink" />
            ))}
            <circle cx={1134} cy={y} r="9" className={r.pass ? "fill-lilac" : "fill-pink"} />
            <text x={1134} y={y + 4} textAnchor="middle" className="font-mono fill-ink" fontSize="11">
              {r.pass ? "✓" : "✗"}
            </text>
          </g>
        );
      })}

      {/* ---------- 04 Grader ---------- */}
      <rect x="840" y="420" width="320" height="200" rx="20" className="fill-lilac" />
      <Badge x={866} y={446} n="04" />
      <Title x={894} y={454}>grader</Title>
      <Meta x={866} y={488} className="fill-ink-2">tests · checkers · rubric</Meta>
      <Meta x={866} y={508} className="fill-ink-2">or a reward model</Meta>
      {rollouts.map((r, i) => (
        <g key={i}>
          <rect x={866 + i * 66} y="540" width="54" height="40" rx="10" className="fill-paper" />
          <text x={893 + i * 66} y={565} textAnchor="middle" className="font-mono fill-ink" fontSize="13">
            {r.pass ? "1.0" : "0.0"}
          </text>
        </g>
      ))}

      {/* ---------- 05 Advantage ---------- */}
      <rect x="440" y="420" width="320" height="200" rx="20" className="fill-paper stroke-ink" strokeWidth="1.5" />
      <Badge x={466} y={446} n="05" />
      <Title x={494} y={454}>advantage</Title>
      <Meta x={466} y={488}>reward minus group average</Meta>
      <path d="M466 570H734" className="stroke-ink" strokeWidth="1.25" strokeDasharray="4 4" />
      {rollouts.map((r, i) => (
        <rect key={i} x={490 + i * 64} y={r.pass ? 534 : 570} width="36" height="36" rx="4" className={r.pass ? "fill-pink" : "fill-ink-soft"} />
      ))}
      <text x={734} y={562} textAnchor="end" className="font-mono uppercase fill-ink-muted" fontSize="10.5" letterSpacing="0.6">
        avg
      </text>

      {/* ---------- 06 Update ---------- */}
      <rect x="40" y="420" width="320" height="200" rx="20" className="fill-night" />
      <Badge x={66} y={446} n="06" dark />
      <Title x={94} y={454} className="fill-on-night">update</Title>
      <Meta x={66} y={488} className="fill-on-night-muted">more of what beat the average</Meta>
      <Meta x={66} y={510} className="fill-on-night-muted">less of what fell short</Meta>
      <rect x="66" y="540" width="236" height="34" rx="17" className="fill-pink" />
      <text x={184} y={562} textAnchor="middle" className="font-mono uppercase fill-on-pink" fontSize="11" letterSpacing="0.6">
        kl leash to reference
      </text>

      {/* ---------- 07 Held-out evals ---------- */}
      <rect x="440" y="668" width="720" height="60" rx="16" className="fill-paper stroke-pink-ink" strokeWidth="1.5" strokeDasharray="7 6" />
      <Badge x={466} y={698} n="07" dark />
      <text x={494} y={705} className="font-sans fill-ink" fontSize="20" fontWeight="700" letterSpacing="-0.5">
        held-out evals
      </text>
      <Meta x={660} y={703}>score up but the real task worse? hacking.</Meta>
    </DiagramFrame>
  );
}
