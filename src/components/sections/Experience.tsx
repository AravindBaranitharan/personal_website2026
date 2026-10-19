import { experience, skills } from "@/content/site";

/** Chapter 6: "experience ." marquee, roles as expandable IndexRows, then skills as chip groups. */
export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="ar-section relative scroll-mt-20 overflow-x-clip bg-paper text-ink"
    >
      <div className="ar-marquee" data-ticker data-speed="80" data-hover-factor="0.25" aria-hidden="true">
        <div className="ar-marquee__track" data-ticker-track aria-hidden="true">
          <span>experience .</span>
        </div>
      </div>

      <div className="ar-container mt-[var(--space-8)] grid gap-[var(--space-8)]">
        <h2
          id="experience-title"
          className="m-0 text-[clamp(48px,8vw,112px)] font-bold leading-[0.88] tracking-[-0.045em]"
          data-appear="flip"
        >
          experience.
        </h2>

        <ol className="ar-index" data-appear-group="rise">
          {experience.map((item, i) => (
            <li key={`${item.org}-${item.period}`} className="border-b border-line">
              <details className="group">
                <summary className="ar-row cursor-pointer list-none border-b-0! [&::-webkit-details-marker]:hidden">
                  <span className="ar-row__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ar-row__title">{item.role}</span>
                  <span className="ar-row__meta">
                    <span className="block">{item.org}</span>
                    <span className="block">
                      {item.period} · {item.place}
                    </span>
                  </span>
                  <span className="ar-btn ar-btn--secondary ar-btn--sm" aria-hidden="true">
                    <span className="group-open:hidden">Details</span>
                    <span className="hidden group-open:inline">Close</span>
                  </span>
                </summary>
                <ul className="m-0 grid max-w-[65ch] list-none gap-3 pb-[var(--space-6)] pl-[56px] text-[16px] leading-[1.5] text-ink-2 min-[721px]:pl-[72px]">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="relative pl-5 before:absolute before:left-0 before:text-pink-ink before:content-['—']"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>

        <div className="grid border-t border-line" data-appear-group="rise">
          {skills.map((group) => (
            <div
              key={group.group}
              className="grid gap-[var(--space-3)] border-b border-line py-[var(--space-5)] md:grid-cols-[200px_minmax(0,1fr)] md:items-start md:gap-[var(--space-5)]"
            >
              <h3 className="ar-mono ar-muted m-0 md:pt-[6px]">{group.group}</h3>
              <ul className="ar-chips m-0 list-none p-0">
                {group.items.map((skill) => (
                  <li key={skill} className="ar-chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
