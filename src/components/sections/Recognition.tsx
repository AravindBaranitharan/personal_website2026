import { recognition } from "@/content/site";

type Item = (typeof recognition)[number];

/** One recognition note, as in the FanCards preview. `pink` marks the single pink-soft card. */
function Card({ item, pink, lift = false }: { item: Item; pink: boolean; lift?: boolean }) {
  return (
    <article
      className={`grid gap-2 rounded-[var(--radius-md)] p-[18px] ${lift ? "shadow-[var(--shadow-lift)]" : ""} ${
        pink ? "bg-pink-soft text-on-pink" : "bg-surface text-ink"
      }`}
    >
      <p className={`ar-mono m-0 ${pink ? "" : "ar-muted"}`}>{item.kicker}</p>
      <h3 className="m-0 text-[22px] font-medium leading-[1.05] tracking-[-0.02em]">{item.title}</h3>
      <p className={`m-0 text-[13px] leading-[18px] ${pink ? "text-ink-2" : "text-ink-muted"}`}>{item.meta}</p>
    </article>
  );
}

/** Chapter 7: recognition as a tilted pile that fans out on scroll; a plain stack below 720px. */
export function Recognition() {
  const pinkIndex = recognition.length - 1;

  return (
    <section
      aria-labelledby="recognition-title"
      className="ar-section relative scroll-mt-20 overflow-x-clip bg-band text-ink"
    >
      <div className="ar-container grid gap-[var(--space-8)]">
        <h2
          id="recognition-title"
          className="m-0 text-[clamp(48px,8vw,112px)] font-bold leading-[0.88] tracking-[-0.045em]"
          data-appear="flip"
        >
          recognition.
        </h2>

        {/* Desktop with JS and motion: the fan. The runtime drives each card's transform, so cards carry no appear
            attribute. Without JS or with reduced motion the pile would never spread, so the stack below shows instead. */}
        <div className="hidden py-[var(--space-6)] [.js_&]:min-[721px]:motion-safe:block">
          <ul className="ar-fan m-0 list-none p-0" data-scrub="fan">
            {recognition.map((item, i) => (
              <li key={item.title}>
                <Card item={item} pink={i === pinkIndex} lift />
              </li>
            ))}
          </ul>
        </div>

        {/* Phones (and the no-JS / reduced-motion fallback): a plain stack, two columns when there is room. */}
        <ul className="m-0 grid list-none gap-[var(--space-3)] p-0 min-[721px]:grid-cols-2 [.js_&]:min-[721px]:motion-safe:hidden" data-appear-group="rise">
          {recognition.map((item, i) => (
            <li key={item.title}>
              <Card item={item} pink={i === pinkIndex} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
