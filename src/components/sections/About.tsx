import { about, profile, socials } from "@/content/site";

/**
 * Chapter 2: an editorial spread. Left: kicker, title, the TextReveal thesis and bio.
 * Right: a sticky "Currently" card (role, availability, facts, focus, links) with a rotating badge.
 */
export function About() {
  const ring = `${profile.role} · ${profile.company} · `.repeat(2);

  return (
    // Sits above the hero (which lags under parallax) so it visibly slides over it.
    <section id="about" aria-labelledby="about-title" className="relative z-[2] bg-paper">

      <div className="ar-container ar-section grid gap-[var(--space-8)] md:grid-cols-12 md:gap-x-[var(--space-7)]">
        {/* Left: the words */}
        <div className="grid content-start gap-[var(--space-7)] md:col-span-7">
          <header className="grid gap-[var(--space-4)]">
            <p className="ar-mono ar-muted" data-appear="rise">
              {about.kicker}
            </p>
            <h2
              id="about-title"
              data-appear="flip"
              className="text-[clamp(48px,8vw,112px)] font-bold lowercase leading-[0.88] tracking-[-0.045em]"
            >
              {about.title}
            </h2>
          </header>

          {/* Words sharpen as it scrolls; distance tuned so it finishes inked while still on screen. */}
          <p className="ar-reveal max-w-[18ch]! max-md:text-[34px]! max-md:leading-[34px]!" data-reveal="" data-distance="900">
            {about.reveal}
          </p>

          <div className="grid gap-[var(--space-5)] border-l-2 border-pink pl-[var(--space-5)]">
            {about.paragraphs.map((text) => (
              <p key={text} data-appear="rise" className="m-0 max-w-[54ch] text-[18px] leading-[27px] text-ink-2">
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* Right: what I'm doing now, held in view while the words scroll past */}
        <div className="md:col-span-5 md:self-start md:sticky md:top-[calc(var(--nav-height)+var(--space-8))]">
          <aside className="ar-about__card ar-wash" data-appear="blur" aria-label="Currently">
            <div className="ar-about__badge" aria-hidden="true">
              <svg viewBox="0 0 132 132">
                <defs>
                  <path id="about-ring" d="M66 66m-50 0a50 50 0 1 1 100 0a50 50 0 1 1 -100 0" />
                </defs>
                <text>
                  <textPath href="#about-ring">{ring}</textPath>
                </text>
              </svg>
              <b>a.</b>
            </div>

            <p className="ar-mono ar-muted m-0">Currently</p>
            <p className="m-0 max-w-[14ch] text-[clamp(28px,2.6vw,36px)] font-medium leading-[1.02] tracking-[-0.025em] text-ink">
              {profile.role} at {profile.company}
            </p>
            <p className="ar-mono m-0 inline-flex items-center gap-2.5 text-ink-2">
              <span className="ar-pulse" aria-hidden="true" />
              {profile.availability}
            </p>

            <dl className="m-0 grid">
              {about.facts.map((fact) => (
                <div key={fact.label} className="ar-about__fact">
                  <dt className="ar-mono text-ink-2">{fact.label}</dt>
                  <dd className="m-0 text-[16px] font-semibold leading-[1.3] text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-3">
              <a className="ar-btn ar-btn--primary" href={profile.resumePath} download>
                Download resume
              </a>
              {socials
                .filter((s) => s.label !== "Instagram")
                .map((s) => (
                  <a key={s.label} className="ar-pill-link" href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
