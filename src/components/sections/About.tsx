import { about } from "@/content/site";

/** Chapter 2: Marquee opener, display title, TextReveal thesis, then the bio beside the facts. */
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

        {/* Words sharpen as it scrolls; distance tuned so it finishes inked while still on screen. */}
        <p className="ar-reveal max-md:text-[36px]! max-md:leading-[34px]!" data-reveal="" data-distance="900">
          {about.reveal}
        </p>

        <div className="grid gap-[var(--space-8)] md:grid-cols-12 md:gap-x-[var(--space-7)]">
          <div className="grid content-start gap-[var(--space-5)] md:col-span-7">
            {about.paragraphs.map((text) => (
              <p key={text} data-appear="rise" className="max-w-[52ch] text-[18px] leading-[25.2px]">
                {text}
              </p>
            ))}
          </div>

          <dl className="grid content-start grid-cols-1 gap-x-[var(--space-5)] sm:grid-cols-2 md:col-span-5" data-appear-group="rise">
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
      </div>
    </section>
  );
}
