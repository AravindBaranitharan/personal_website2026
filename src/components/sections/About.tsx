import Image from "next/image";
import aboutPortrait from "@/assets/about-portrait.webp";
import { about, profile } from "@/content/site";

/**
 * Chapter 2: an editorial spread. Left: kicker, title, the TextReveal thesis, bio and facts.
 * Right: a sticky portrait (B&W, colour on hover) with a rotating badge and a location tag.
 */
export function About() {
  // "02 — About" → "about"; the Marquee repeats the chapter's name.
  const marqueeWord = (about.kicker.split("—").pop() ?? about.kicker).trim().toLowerCase();
  const ring = `${profile.role} · ${profile.company} · `.repeat(2);

  return (
    // Sits above the hero (which lags under parallax) so it visibly slides over it.
    <section id="about" aria-labelledby="about-title" className="relative z-[2] bg-paper">
      <div className="ar-marquee" data-ticker="" data-speed="80" data-hover-factor="0.25" aria-hidden="true">
        <div className="ar-marquee__track" data-ticker-track="">
          <span>{marqueeWord} .</span>
        </div>
      </div>

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

          <dl className="m-0 grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-2" data-appear-group="rise">
            {about.facts.map((fact) => (
              <div key={fact.label} className="ar-about__fact">
                <dt className="ar-mono ar-muted">{fact.label}</dt>
                <dd className="m-0 text-[20px] font-semibold leading-[1.2] tracking-[-0.01em]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: the portrait, held in view while the words scroll past */}
        <div className="md:col-span-5 md:self-start md:sticky md:top-[calc(var(--nav-height)+var(--space-8))]">
          <figure className="ar-about__frame m-0" data-appear="blur">
            <div className="ar-about__photo">
              <Image
                src={aboutPortrait}
                alt={`${profile.name} at his laptop, glancing over his shoulder`}
                sizes="(max-width: 767px) 92vw, 520px"
                placeholder="blur"
              />
              <span className="ar-about__tag">
                <span className="ar-pulse" aria-hidden="true" />
                {profile.workLocation}
              </span>
            </div>
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
            <figcaption className="ar-mono ar-muted mt-[var(--space-4)] flex justify-between gap-4">
              <span>{profile.name}</span>
              <span>{profile.role}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
