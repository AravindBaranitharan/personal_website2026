import Image, { type StaticImageData } from "next/image";
import { speaking } from "@/content/site";
import audience from "@/assets/stage/audience.webp";
import copilotGroup from "@/assets/stage/copilot-group.webp";
import copilotTalk from "@/assets/stage/copilot-talk.webp";
import copilotTeam from "@/assets/stage/copilot-team.webp";
import felicitation from "@/assets/stage/felicitation.webp";
import hallway from "@/assets/stage/hallway.webp";
import openWeights from "@/assets/stage/open-weights.webp";
import talkPortrait from "@/assets/stage/talk-portrait.webp";
import talkWide from "@/assets/stage/talk-wide.webp";

const PHOTOS = {
  "talk-wide": talkWide,
  "open-weights": openWeights,
  "talk-portrait": talkPortrait,
  felicitation,
  hallway,
  "copilot-talk": copilotTalk,
  "copilot-team": copilotTeam,
  "copilot-group": copilotGroup,
} satisfies Record<string, StaticImageData>;

type Talk = (typeof speaking.also)[number];

/** A smaller talk: cover photo beside the details, then its photos as landscape polaroids. */
function TalkBlock({ talk, index }: { talk: Talk; index: number }) {
  return (
    <article className="grid gap-[var(--space-6)]" aria-labelledby={`talk-${index}-title`}>
      <TalkLabel index={index} event={talk.event} host={talk.host} />
      <div className="ar-stage__talkcard">
        <div className="ar-stage__cover" data-appear="rise">
          <Image
            src={PHOTOS[talk.cover.photo]}
            alt={talk.cover.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 900px) 760px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="grid content-start gap-[var(--space-5)]" data-appear="rise">
          <p className="ar-mono ar-muted m-0">{talk.when}</p>
          <h3
            id={`talk-${index}-title`}
            className="m-0 text-[clamp(32px,3.6vw,52px)] font-bold leading-[0.95] tracking-[-0.04em] text-ink"
          >
            {talk.talk}
          </h3>
          <p className="m-0 max-w-[52ch] text-[16px] leading-[1.55] text-ink-2">{talk.summary}</p>
          <ul className="ar-chips m-0 list-none p-0" aria-label={`${talk.talk} topics`}>
            {talk.tags.map((tag) => (
              <li key={tag} className="ar-chip">
                {tag}
              </li>
            ))}
          </ul>
          <ul className="m-0 grid list-none grid-cols-2 gap-[var(--space-3)] p-0">
            {talk.stats.map((stat) => (
              <li key={stat.label} className="ar-stage__stat">
                <p className="ar-stage__value ar-stage__value--sm m-0" aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
                  <span aria-hidden="true" data-count={stat.value}>
                    {stat.value}
                  </span>
                  <span aria-hidden="true">{stat.suffix}</span>
                </p>
                <p className="m-0 text-[13px] leading-[1.3] text-ink-2 md:text-[15px]">{stat.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="ar-stage__strip ar-stage__strip--wide m-0 list-none p-0" data-appear-group="rise" aria-label={`Photos from ${talk.event}`}>
        {talk.photos.map((p, i) => (
          <li key={p.photo}>
            <figure className="ar-stage__polaroid m-0" style={{ ["--tilt" as string]: `${TILTS[(i + 1) % TILTS.length]}deg` }}>
              <div className="ar-stage__photo ar-stage__photo--wide">
                <Image src={PHOTOS[p.photo]} alt={p.alt} fill placeholder="blur" sizes="(min-width: 900px) 640px, 80vw" className="object-cover" />
              </div>
              <figcaption className="ar-stage__caption">{p.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** "Talk 01 · Event · Host" with the pulsing dot, above each talk. */
function TalkLabel({ index, event, host }: { index: number; event: string; host: string }) {
  return (
    <p className="ar-stage__label m-0" data-appear="rise">
      <span className="ar-stage__live" aria-hidden="true" />
      <span className="ar-mono">Talk {String(index).padStart(2, "0")}</span>
      <span className="text-ink">
        {event} · {host}
      </span>
    </p>
  );
}

// Polaroid tilt, one per photo; they straighten on hover.
const TILTS = [-4, 3, -2, 4, -3];

/**
 * Chapter 6 (wash): talks. The featured one (Global AI Conference Chennai) gets the audience shot growing into the frame
 * on scroll with the talk card over it, the numbers, the talk's three beats and a strip of polaroids. Each talk in
 * `speaking.also` follows as a cover photo beside its details.
 */
export function Speaking() {
  return (
    <section id="speaking" aria-labelledby="speaking-title" className="ar-wash ar-section relative scroll-mt-20">
      <div className="ar-container grid gap-[var(--space-8)]">
        <header className="grid gap-[var(--space-6)] md:grid-cols-12 md:items-end">
          <div className="grid gap-[var(--space-4)] md:col-span-7">
            <p className="ar-mono ar-muted m-0" data-appear="rise">
              {speaking.kicker}
            </p>
            <h2
              id="speaking-title"
              className="m-0 text-[clamp(48px,8vw,112px)] font-bold leading-[0.88] tracking-[-0.045em]"
              data-appear="flip"
            >
              {speaking.title}
            </h2>
          </div>
          <div className="grid gap-[var(--space-4)] md:col-span-5" data-appear="rise">
            <p className="m-0 max-w-[48ch] text-[17px] leading-[1.5] text-ink-2">{speaking.intro}</p>
          </div>
        </header>

        <div className="grid gap-[var(--space-5)]">
          <TalkLabel index={1} event={speaking.event} host={speaking.host} />
          <p className="m-0 max-w-[60ch] text-[17px] leading-[1.5] text-ink-2" data-appear="rise">
            {speaking.summary}
          </p>
        </div>

        {/* Feature: the room, growing into place as it scrolls in, with the talk title over it. */}
        <figure className="ar-stage__hero m-0" data-scrub="zoom">
          <Image
            src={audience}
            alt={`Aravind presenting to a packed hall of more than ${speaking.stats[0].value} people at ${speaking.event}`}
            fill
            placeholder="blur"
            sizes="(min-width: 1440px) 1360px, 100vw"
            className="object-cover"
          />
          <figcaption className="ar-stage__card">
            <span className="ar-mono text-on-night-muted">Talk · live demo</span>
            <span className="ar-stage__talk">{speaking.talk}</span>
            <ul className="ar-chips m-0 list-none p-0" aria-label="Talk topics">
              {speaking.tags.map((tag) => (
                <li key={tag} className="ar-chip ar-stage__chip">
                  {tag}
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>

        {/* Numbers from the day; they count up as they scroll in. */}
        <ul className="m-0 grid list-none grid-cols-3 gap-[var(--space-3)] p-0 md:gap-[var(--space-4)]" data-appear-group="rise">
          {speaking.stats.map((stat) => (
            <li key={stat.label} className="ar-stage__stat">
              <p className="ar-stage__value m-0" aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
                <span aria-hidden="true" data-count={stat.value}>
                  {stat.value}
                </span>
                <span aria-hidden="true">{stat.suffix}</span>
              </p>
              <p className="m-0 text-[13px] leading-[1.3] text-ink-2 md:text-[15px]">{stat.label}</p>
            </li>
          ))}
        </ul>

        {/* The talk in three beats, then the answer. */}
        <div className="grid gap-[var(--space-5)]">
          <p className="m-0 max-w-[24ch] text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.05] tracking-[-0.03em] text-ink" data-appear="rise">
            {speaking.setup}
          </p>
          <ol className="m-0 grid list-none gap-[var(--space-4)] p-0 md:grid-cols-3" data-appear-group="rise">
            {speaking.beats.map((beat, i) => (
              <li key={beat.title} className="ar-stage__beat">
                <span className="ar-stage__num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="m-0 text-[21px] font-medium leading-[1.15] tracking-[-0.015em] text-ink">{beat.title}</h3>
                <p className="m-0 text-[15px] leading-[1.5] text-ink-muted">{beat.text}</p>
              </li>
            ))}
          </ol>
          <p className="ar-stage__answer m-0" data-appear="rise">
            {speaking.answer}
          </p>
        </div>

        {/* Polaroids: a tilted strip on desktop, a swipeable row on phones. */}
        <ul className="ar-stage__strip m-0 list-none p-0" data-appear-group="rise" aria-label="Photos from the talk">
          {speaking.photos.map((p, i) => (
            <li key={p.photo}>
              {/* The tilt sits on an inner element so the appear animation's transform on the <li> doesn't replace it. */}
              <figure className="ar-stage__polaroid m-0" style={{ ["--tilt" as string]: `${TILTS[i % TILTS.length]}deg` }}>
                <div className="ar-stage__photo">
                  <Image
                    src={PHOTOS[p.photo]}
                    alt={p.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 900px) 260px, 70vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="ar-stage__caption">{p.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {speaking.also.map((talk, i) => (
          <TalkBlock key={talk.event} talk={talk} index={i + 2} />
        ))}
      </div>
    </section>
  );
}
