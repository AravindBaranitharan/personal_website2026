import Link from "next/link";
import { hero, marquee, profile } from "@/content/site";
import { HeroStage } from "./HeroStage";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

/**
 * Chapter 1. Full-screen hero after the reference: the name set huge behind a cut-out B&W portrait on a pink glow,
 * intro copy left, tagline right, © and scroll cue in the corners. Below it, on paper: the cycling line, CTAs,
 * stats and the stack ticker.
 */
export function Hero() {
  const { primary, secondary, resume } = hero.ctas;
  const letters = hero.word.toUpperCase().split("");

  return (
    <section id="top" aria-labelledby="hero-title" className="relative">
      <div className="ar-hero">
        <div className="ar-hero__glow" aria-hidden="true" />

        {/* Word: parallax wrapper (runtime) > pointer depth (HeroStage) > letters (load animation). */}
        <div className="ar-hero__word">
          <div data-parallax="0.55">
            <div data-hero-depth="word" style={{ willChange: "transform" }}>
              <h1 id="hero-title" className="ar-hero__title">
                <span className="sr-only">
                  {profile.name}, {profile.role}
                </span>
                {letters.map((letter, i) => (
                  <span key={i} className="ar-hero__letter" aria-hidden="true">
                    <span style={{ ["--i" as string]: i }}>{letter}</span>
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </div>

        <HeroStage alt={hero.portraitAlt} />

        <div className="ar-hero__grain" aria-hidden="true" />

        <p className="ar-hero__copy ar-hero__copy--left">
          {hero.greeting.before} <b>{hero.greeting.name}</b> {hero.greeting.after}
        </p>
        <p className="ar-hero__copy ar-hero__copy--right">{hero.tagline}</p>

        <div className="ar-hero__foot">
          <span>{hero.copyright}</span>
          <Link href="/#about">{hero.scrollLabel}</Link>
        </div>
      </div>

      {/* Below the fold: what I build, the calls to action and the numbers. */}
      <div className="relative z-[2] bg-paper">
        <div className="ar-container grid gap-[var(--space-7)] pt-[var(--space-8)] md:grid-cols-12 md:pt-[var(--space-9)]">
          <div className="grid content-start gap-[var(--space-6)] md:col-span-7">
            <p className="ar-mono ar-muted inline-flex flex-wrap items-center gap-x-4 gap-y-2" data-appear="rise">
              <span>{hero.eyebrow}</span>
              <span className="inline-flex items-center gap-2.5 text-ink-2">
                <span className="ar-pulse" aria-hidden="true" />
                {profile.availability}
              </span>
            </p>
            <p
              data-appear="flip"
              className="m-0 text-[clamp(48px,6.5vw,96px)] font-extrabold leading-[0.92] tracking-[-0.055em]"
            >
              {hero.cyclePrefix}{" "}
              <span className="ar-cycle text-pink" data-cycle={hero.cycle.join(", ")}>
                {hero.cycle[0]}
              </span>
            </p>
            <p data-appear="rise" className="m-0 max-w-[52ch] text-[18px] leading-[25.2px] text-ink-2">
              {hero.lead}
            </p>
            <div className="flex flex-wrap gap-3" data-appear-group="rise">
              <Link className="ar-btn ar-btn--primary" href={primary.href}>
                {primary.label} <ArrowIcon />
              </Link>
              <Link className="ar-btn ar-btn--secondary" href={secondary.href}>
                {secondary.label}
              </Link>
              <a className="ar-btn ar-btn--accent" href={resume.href} download>
                {resume.label}
              </a>
            </div>
          </div>

          <div className="ar-stats content-start md:col-span-5 md:flex-col md:justify-self-end" data-appear-group="rise">
            {hero.stats.map((stat) => (
              <div key={stat.value} className="ar-stat">
                <div className="ar-stat__value">
                  {stat.sign && <sup>{stat.sign}</sup>}
                  {stat.value}
                </div>
                <div className="ar-stat__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stack ticker. The runtime duplicates the chips, so screen readers get the list once instead. */}
        <div className="py-[var(--space-8)]">
          <ul className="sr-only" aria-label="Tools I work with">
            {marquee.stack.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
          <div className="ar-ticker" data-ticker="" data-speed="40" data-hover-factor="0.25" aria-hidden="true">
            <div data-ticker-track="">
              {marquee.stack.map((tool) => (
                <span key={tool} className="ar-chip">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
