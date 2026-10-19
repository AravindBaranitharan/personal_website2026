import Link from "next/link";
import { marquee, notes, profile, projects, type Project } from "@/content/site";
import { ProjectVisual } from "./ProjectVisual";

// Chapter labels. site.ts has no `work` block yet; these mirror the blueprint (see the report).
const WORK = {
  kicker: "04 — Work",
  title: "selected work.",
  moreTitle: "More projects",
  indexTitle: "All projects",
  cta: "Read the case study",
};

/** The signature ↗ arrow (Lucide arrow-up-right at 1.5px); rotates 45° on hover via .ar-btn. */
export function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

const caseHref = (project: Project) => `/work/${project.slug}`;

/** Newest first; Array.prototype.sort is stable, so same-year projects keep their content order. */
const byYearDesc = (list: Project[]) => [...list].sort((a, b) => Number(b.year) - Number(a.year));

/**
 * WorkTable (design system): dense mono index on night. Each row is a link to the case study.
 * Must sit inside a night ground. The role column hides under 640px.
 */
export function WorkTable({ items, label, headingId }: { items: Project[]; label: string; headingId?: string }) {
  const cols = "max-sm:grid-cols-[minmax(0,1fr)_64px]!";
  return (
    <div className="ar-work">
      <div className={`ar-work__head ${cols}`} aria-hidden="true">
        <span>Project</span>
        <span className="max-sm:hidden">Role</span>
        <span>Year</span>
      </div>
      <ul
        className="m-0 list-none p-0"
        data-appear-group="rise"
        {...(headingId ? { "aria-labelledby": headingId } : { "aria-label": label })}
      >
        {items.map((project) => (
          <li key={project.slug}>
            <Link href={caseHref(project)} className={cols} data-cursor="View">
              <span className="truncate">{project.title}</span>
              <span className="truncate max-sm:hidden">{project.role}</span>
              <span>{project.year}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Featured project as a StackCard on the night ground (white card, plainthing's dark-chapter card). */
function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const titleId = `work-${project.slug}-title`;
  const metrics = project.metrics.slice(0, 2);
  return (
    <article
      className="ar-card max-[720px]:static!"
      data-scrub="stack"
      aria-labelledby={titleId}
      // Each card sticks 16px lower than the one before so the pile's edges show.
      style={{ top: `calc(var(--nav-height) + var(--space-6) + ${index * 16}px)` }}
    >
      <div className="ar-card__body">
        <span className="ar-mono ar-muted">
          {project.role} · {project.year}
        </span>
        <h3 id={titleId} className="ar-card__title">
          {project.title}
        </h3>
        <p className="ar-card__text">{project.summary}</p>
        <p className="m-0 max-w-[46ch] text-[15px] leading-[21px]">
          <span className="ar-mono ar-muted mb-1 block">Result</span>
          {project.result}
        </p>
        <ul className="ar-chips" aria-label={`${project.title} stack`}>
          {project.stack.map((item) => (
            <li key={item} className="ar-chip">
              {item}
            </li>
          ))}
        </ul>
        {metrics.length > 0 && (
          <div className="ar-stats" style={{ gap: "var(--space-5) var(--space-7)" }}>
            {metrics.map((metric) => (
              <div key={metric.label} className="ar-stat">
                <div className="ar-stat__value" style={{ fontSize: "clamp(32px, 3.4vw, 48px)", whiteSpace: "nowrap" }}>
                  {metric.value}
                </div>
                <div className="ar-stat__label">{metric.label}</div>
              </div>
            ))}
          </div>
        )}
        <div className="pt-[var(--space-2)]">
          <Link className="ar-btn ar-btn--primary" href={caseHref(project)}>
            {WORK.cta}
            <span className="sr-only">: {project.title}</span>
            <ArrowUpRight />
          </Link>
        </div>
      </div>
      <div className="ar-card__media relative overflow-hidden max-[720px]:aspect-[16/10]">
        <ProjectVisual project={project} fill />
      </div>
    </article>
  );
}

/** Chapter 4 (night): Marquee, opener, featured StackCards, HorizontalTrack of the rest, WorkTable, Tape out. */
export function Work() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const word = WORK.kicker.split("—").pop()?.trim().toLowerCase() ?? "work";
  const tapeLine = notes[0]?.quote.replace(/\.$/, "") ?? "";
  const tapeSkills = marquee.primary.slice(0, 4);

  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-night text-on-night">
      {/* Marquee opener; decorative because the h2 below names the chapter. Opposite direction to About's. */}
      <div className="pt-[var(--space-8)] md:pt-[var(--space-9)]">
        <div
          className="ar-marquee"
          data-ticker=""
          data-speed="80"
          data-hover-factor="0.25"
          data-direction="right"
          aria-hidden="true"
        >
          <div className="ar-marquee__track" data-ticker-track="">
            <span>{word} .</span>
          </div>
        </div>
      </div>

      <div className="ar-container">
        <header className="grid gap-[var(--space-4)] pb-[var(--space-8)] pt-[var(--space-7)]">
          <p className="ar-mono text-on-night-muted" data-appear="rise">
            {WORK.kicker}
          </p>
          <h2
            id="work-title"
            data-appear="flip"
            className="text-[clamp(48px,8vw,112px)] font-bold lowercase leading-[0.88] tracking-[-0.045em]"
          >
            {WORK.title}
          </h2>
        </header>

        {/* Featured: StackCards pile under the header pill. Below 720px they stop sticking. */}
        <div className="ar-stack pb-[var(--space-8)]">
          {featured.map((project, i) => (
            <FeaturedCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>

      {/* HorizontalTrack: vertical scroll drives the row sideways. The runtime sets this element's height. */}
      {rest.length > 0 && (
        <div data-scrub="track" role="region" aria-labelledby="work-more-title">
          <div className="ar-track-pin motion-reduce:overflow-x-auto!" data-track-pin="">
            <h3
              id="work-more-title"
              className="ar-mono absolute left-[calc(var(--space-5)+30px)] top-[calc(var(--nav-height)+var(--space-8))] m-0 text-on-night-muted [@media(max-height:520px)]:sr-only"
            >
              {WORK.moreTitle} — {rest.length}
            </h3>
            <ul className="ar-track-row m-0 list-none" data-track-row="">
              {rest.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={caseHref(project)}
                    data-cursor="View"
                    aria-label={`${project.title}, ${project.role}, ${project.year}: read the case study`}
                    className="ar-hover-tilt block rounded-[var(--radius-lg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    style={{ width: "clamp(260px, 30vw, 440px)" }}
                  >
                    <figure className="ar-tile m-0 w-full" style={{ aspectRatio: "16 / 10" }}>
                      <ProjectVisual project={project} fill caption={project.role} />
                    </figure>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* WorkTable: every project, newest first. */}
      <div className="ar-container pb-[var(--space-8)] pt-[var(--space-8)] md:pb-[var(--space-9)]">
        <div className="mb-[var(--space-5)] flex items-baseline justify-between gap-4">
          <h3 id="work-index-title" className="ar-mono m-0 text-on-night-muted">
            {WORK.indexTitle}
          </h3>
          <span className="ar-mono text-on-night-muted">{projects.length}</span>
        </div>
        <WorkTable items={byYearDesc(projects)} label={WORK.indexTitle} headingId="work-index-title" />
      </div>

      {/* Tape: two crossing strips carry the reader out of the dark chapter onto paper. */}
      <div
        className="ar-tape-stage"
        aria-hidden="true"
        style={{ background: "linear-gradient(to bottom, var(--night) 50%, var(--paper) 50%)" }}
      >
        <div className="ar-tape ar-tape--a" data-ticker="" data-speed="24">
          <div className="flex shrink-0 gap-[var(--space-6)]" data-ticker-track="">
            <span>{tapeLine}</span>
            <span>{profile.role}</span>
            <span>{tapeLine}</span>
            <span>{profile.role}</span>
          </div>
        </div>
        <div className="ar-tape ar-tape--b" data-ticker="" data-speed="24" data-direction="right">
          <div className="flex shrink-0 gap-[var(--space-6)]" data-ticker-track="">
            {[...tapeSkills, ...tapeSkills].map((skill, i) => (
              <span key={`${skill}-${i}`}>{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
