import { about, profile } from "@/content/site";

const CORNERS = ["tl", "tr", "bl", "br"] as const;

/** Registration crosshair, the system's only ornament (design system: Chapter). */
function Crosshair({ corner }: { corner: (typeof CORNERS)[number] }) {
  return (
    <svg
      className={`ar-cross ar-cross--${corner}`}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="6" />
      <path d="M14 0v28M0 14h28" />
    </svg>
  );
}

/** Chapter 2: Marquee opener, display title, TextReveal thesis, bio, facts and a framed B&W portrait slot. */
export function About() {
  // "02 — About" → "about"; the Marquee repeats the chapter's name.
  const marqueeWord = (about.kicker.split("—").pop() ?? about.kicker).trim().toLowerCase();

  return (
    // Sits above the hero (which lags at 80% under parallax) so it visibly slides over it.
    <section id="about" aria-labelledby="about-title" className="relative z-[2] bg-paper">
      <div className="ar-marquee" data-ticker="" data-speed="80" data-hover-factor="0.25" aria-hidden="true">
        <div className="ar-marquee__track" data-ticker-track="">
          <span>{marqueeWord} .</span>
        </div>
      </div>

      <div className="ar-container ar-section grid gap-[var(--space-8)]">
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

        <div className="grid gap-[var(--space-8)] md:grid-cols-12 md:gap-x-[var(--space-5)]">
          <div className="grid content-start gap-[var(--space-8)] md:col-span-7">
            {/* Words sharpen as it scrolls; distance tuned so it finishes inked while still on screen. */}
            <p className="ar-reveal max-md:text-[36px]! max-md:leading-[34px]!" data-reveal="" data-distance="900">
              {about.reveal}
            </p>

            <div className="grid gap-[var(--space-5)]">
              {about.paragraphs.map((text) => (
                <p key={text} data-appear="rise" className="max-w-[52ch] text-[18px] leading-[25.2px]">
                  {text}
                </p>
              ))}
            </div>

            <dl className="grid grid-cols-1 gap-x-[var(--space-5)] sm:grid-cols-2" data-appear-group="rise">
              {about.facts.map((fact) => (
                <div
                  key={fact.label}
                  data-appear="rise"
                  className="grid gap-[var(--space-2)] border-t border-line py-[var(--space-4)]"
                >
                  <dt className="ar-mono ar-muted">{fact.label}</dt>
                  <dd className="text-[16px] font-semibold leading-[22.4px]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* A framed wash card, not a full-bleed wash, so the hero keeps the only big glow. */}
          <div className="md:col-span-5 md:self-start">
            <div className="ar-chapter ar-wash p-[var(--space-8)] max-md:px-[var(--space-7)]">
              {CORNERS.map((corner) => (
                <Crosshair key={corner} corner={corner} />
              ))}
              <div data-appear="blur" className="mx-auto w-full max-w-[360px]">
                <figure className="ar-tile" role="img" aria-label={`Black-and-white portrait of ${profile.name} (placeholder)`}>
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500" aria-hidden="true">
                    <circle className="fill-ink/10" cx="200" cy="190" r="78" />
                    <path className="fill-ink/10" d="M56 500c0-128 64-196 144-196s144 68 144 196Z" />
                  </svg>
                  <span className="ar-tile__caption">B&amp;W portrait · 4:5</span>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
