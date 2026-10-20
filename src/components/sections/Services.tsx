import type { ReactNode } from "react";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { process, profile, services } from "@/content/site";

/*
 * Placeholder diagrams for each service's media slot. They draw in currentColor plus the pinks,
 * so the same art works on surface and night cards. Keyed by slug, with an index fallback.
 */
const ART: Record<string, ReactNode> = {
  // Retrieval: documents → re-ranked results → grounded answer
  "ai-llm-integrations": (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${36 + i * 14} ${52 + i * 14})`}>
          <rect width="96" height="124" rx="10" className="fill-current" fillOpacity={0.06} />
          <rect width="96" height="124" rx="10" fill="none" className="stroke-current" strokeOpacity={0.35} />
          <path d="M16 28h64M16 46h48M16 64h56" className="stroke-current" strokeOpacity={0.3} strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
      <path d="M176 130h28m-8-8 8 8-8 8" fill="none" className="stroke-current" strokeOpacity={0.5} strokeWidth={2} />
      <rect x="220" y="92" width="96" height="18" rx="9" className="fill-pink" />
      <rect x="220" y="122" width="72" height="18" rx="9" className="fill-lilac" />
      <rect x="220" y="152" width="48" height="18" rx="9" className="fill-pink-soft" />
      <circle cx="356" cy="130" r="22" className="fill-current" />
    </>
  ),
  // Agents: an orchestrator coordinating tools over A2A / MCP
  "agent-systems": (
    <>
      {[
        [96, 64],
        [304, 64],
        [96, 196],
        [304, 196],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path d={`M200 130L${x} ${y}`} className="stroke-current" strokeOpacity={0.3} strokeWidth={2} strokeDasharray="4 6" />
          <circle cx={x} cy={y} r="18" fill="none" className="stroke-current" strokeOpacity={0.6} strokeWidth={2} />
        </g>
      ))}
      <rect x="40" y="118" width="24" height="24" rx="4" className="fill-lilac" />
      <rect x="336" y="118" width="24" height="24" rx="4" className="fill-pink-soft" />
      <circle cx="200" cy="130" r="40" className="fill-pink" />
      <circle cx="200" cy="130" r="56" fill="none" className="stroke-pink" strokeOpacity={0.4} strokeWidth={2} />
    </>
  ),
  // Web app: a browser frame with the AI layer threaded through
  "custom-web-apps": (
    <>
      <rect x="40" y="36" width="320" height="188" rx="12" className="fill-current" fillOpacity={0.05} />
      <rect x="40" y="36" width="320" height="188" rx="12" fill="none" className="stroke-current" strokeOpacity={0.35} />
      <path d="M40 64h320" className="stroke-current" strokeOpacity={0.35} />
      {[58, 72, 86].map((cx) => (
        <circle key={cx} cx={cx} cy="50" r="4" className="fill-current" fillOpacity={0.4} />
      ))}
      <rect x="60" y="84" width="150" height="120" rx="8" className="fill-pink-soft" />
      <path d="M228 96h112M228 116h84M228 136h96" className="stroke-current" strokeOpacity={0.3} strokeWidth={6} strokeLinecap="round" />
      <rect x="228" y="168" width="80" height="28" rx="14" className="fill-pink" />
    </>
  ),
  // SaaS: a staged pipeline board
  "saas-product-build": (
    <>
      {[0, 1, 2, 3].map((col) => (
        <g key={col} transform={`translate(${40 + col * 82} 40)`}>
          <rect width="72" height="180" rx="8" className="fill-current" fillOpacity={0.06} />
          {Array.from({ length: 3 - (col % 3) }, (_, row) => (
            <rect
              key={row}
              x="8"
              y={12 + row * 40}
              width="56"
              height="30"
              rx="6"
              className={col === 2 && row === 0 ? "fill-pink" : "fill-current"}
              fillOpacity={col === 2 && row === 0 ? 1 : 0.18}
            />
          ))}
        </g>
      ))}
    </>
  ),
};
const FALLBACK_ART = Object.values(ART);

/** Chapter 3: "what I do.", StackCards that tilt up and pile, then the three-week process. */
export function Services() {
  const total = String(services.length).padStart(2, "0");

  return (
    <section id="services" aria-labelledby="services-title" className="relative z-[2] bg-band">
      <div className="ar-container ar-section">
        <header className="grid gap-[var(--space-5)]">
          <h2
            id="services-title"
            data-appear="flip"
            className="text-[clamp(48px,8vw,112px)] font-bold leading-[0.88] tracking-[-0.045em]"
          >
            what I do.
          </h2>
          <p data-appear="rise" className="max-w-[52ch] text-[18px] leading-[25.2px]">
            {profile.summary}
          </p>
        </header>

        {/* Each card sticks 16px lower than the last so the pile edges show; on phones a tall card pins once fully read. */}
        <div className="ar-stack mt-[var(--space-8)] md:pb-[20vh]">
          {services.map((service, i) => {
            const night = i % 2 === 1;
            return (
              <article
                key={service.slug}
                data-scrub="stack"
                aria-labelledby={`service-${service.slug}`}
                className={`ar-card ${night ? "ar-card--night ar-on-night" : ""}`}
                style={{ top: `calc(var(--space-6) + ${i * 16}px)` }}
              >
                <div className="ar-card__body">
                  <span className="ar-mono ar-muted">
                    {service.id} / {total}
                  </span>
                  <h3 id={`service-${service.slug}`} className="ar-card__title">
                    {service.title}
                  </h3>
                  <p className="ar-card__text">{service.summary}</p>
                  <ul className="ar-chips">
                    {service.tags.map((tag) => (
                      <li key={tag} className="ar-chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-[var(--space-2)] grid gap-[var(--space-2)] text-[15px] leading-[21px]">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-baseline gap-[var(--space-3)]">
                        <span className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-pink" aria-hidden="true" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
                {service.video ? (
                  <div className="ar-card__media relative aspect-[16/10] self-center overflow-hidden min-h-0!">
                    <LoopVideo {...service.video} />
                  </div>
                ) : (
                  <div className="ar-card__media grid place-items-center overflow-hidden p-[var(--space-4)]">
                    <svg
                      className="h-full max-h-[260px] w-full"
                      viewBox="0 0 400 260"
                      role="img"
                      aria-label={`${service.title}: illustration placeholder`}
                    >
                      {ART[service.slug] ?? FALLBACK_ART[i % FALLBACK_ART.length]}
                    </svg>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-[var(--space-9)] grid gap-[var(--space-7)]">
          <h3
            data-appear="rise"
            className="text-[clamp(36px,4.4vw,54px)] font-medium leading-[0.9] tracking-[-0.022em]"
          >
            how I work.
          </h3>
          <ol className="grid gap-[var(--space-4)] md:grid-cols-3" data-appear-group="rise" data-stagger="0.1">
            {process.map((step) => (
              <li
                key={step.step}
                data-appear="rise"
                className="grid content-start gap-[var(--space-3)] rounded-[var(--radius-md)] bg-surface p-[var(--space-6)]"
              >
                <span className="ar-mono text-pink-ink">{step.step}</span>
                <h4 className="text-[28px] font-medium leading-[30px] tracking-[-0.56px]">{step.title}</h4>
                <p className="max-w-[65ch] text-ink-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
