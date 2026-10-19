import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { MotionInit } from "@/components/chrome/MotionInit";
import { ProjectVisual } from "@/components/sections/ProjectVisual";
import { ArrowUpRight, WorkTable } from "@/components/sections/Work";
import { getProject, projects, type Project } from "@/content/site";

// Every slug is prerendered by generateStaticParams. The whole case study reads `params` and commits with the route
// (motion is wired by <MotionInit /> once this page hydrates), so this route opts out of instant-nav validation
// instead of streaming its body behind a Suspense fallback.
export const instant = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, url: `/work/${project.slug}`, type: "article" },
    twitter: { title: project.title, description: project.summary },
  };
}

// Page labels. site.ts has no case-study labels yet (see the report).
const LABELS = {
  back: "All work",
  problem: "Problem",
  build: "Build",
  result: "Result",
  links: "Links",
  next: "next projects.",
  nextKicker: "Keep reading",
};

/** The other projects, starting with the one after this in content order, so the first row is "next". */
function onward(current: Project) {
  const i = projects.findIndex((p) => p.slug === current.slug);
  return [...projects.slice(i + 1), ...projects.slice(0, i)];
}

function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      data-appear="rise"
      className="grid gap-[var(--space-4)] border-t border-line pt-[var(--space-6)] md:grid-cols-12 md:gap-x-[var(--space-5)]"
    >
      <h2 id={id} className="ar-mono ar-muted m-0 md:col-span-3">
        {label}
      </h2>
      <div className="grid gap-[var(--space-6)] md:col-span-9">{children}</div>
    </section>
  );
}

const bodyLg = "m-0 max-w-[60ch] text-[18px] leading-[25.2px]";

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const metrics = project.metrics.slice(0, 3);

  return (
    <>
      <article aria-labelledby="case-title" className="bg-paper text-ink">
        <div className="ar-container pb-[var(--space-8)] pt-[calc(var(--nav-height)+var(--space-9))] md:pb-[var(--space-9)]">
          <Link href="/#work" className="ar-bracket">
            {LABELS.back}
          </Link>

          <header className="mt-[var(--space-8)] grid gap-[var(--space-5)]">
            <p className="ar-mono ar-muted m-0">
              {project.org} · {project.role} · {project.year}
            </p>
            <h1
              id="case-title"
              data-appear="flip"
              className="m-0 text-[clamp(48px,8vw,112px)] font-bold lowercase leading-[0.88] tracking-[-0.045em] [overflow-wrap:anywhere]"
            >
              {project.title}.
            </h1>
            <p className="m-0 max-w-[52ch] text-[18px] leading-[25.2px]" data-appear="rise">
              {project.summary}
            </p>
            <ul className="ar-chips" data-appear-group="rise" aria-label="Stack">
              {project.stack.map((item) => (
                <li key={item} className="ar-chip">
                  {item}
                </li>
              ))}
            </ul>
          </header>

          <div className="mt-[var(--space-8)]" data-appear="blur">
            <ProjectVisual project={project} priority caption={project.role} />
          </div>

          <div className="mt-[var(--space-9)] grid gap-[var(--space-8)]">
            <Section id="case-problem" label={LABELS.problem}>
              <p className={bodyLg}>{project.problem}</p>
            </Section>

            <Section id="case-build" label={LABELS.build}>
              <p className={bodyLg}>{project.build}</p>
            </Section>

            <Section id="case-result" label={LABELS.result}>
              {metrics.length > 0 && (
                <div className="ar-stats" data-appear-group="rise">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="ar-stat" style={{ maxWidth: 320 }}>
                      <div className="ar-stat__value" style={{ fontSize: "clamp(40px, 5.4vw, 64px)", whiteSpace: "nowrap" }}>
                        {metric.value}
                      </div>
                      <div className="ar-stat__label">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}
              <p className={bodyLg}>{project.result}</p>
            </Section>

            {project.links.length > 0 && (
              <Section id="case-links" label={LABELS.links}>
                <div className="flex flex-wrap gap-[var(--space-3)]">
                  {project.links.map((link, i) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`ar-btn ${i === 0 ? "ar-btn--primary" : "ar-btn--secondary"}`}
                    >
                      {link.label}
                      <span className="sr-only"> ({project.title}, opens in a new tab)</span>
                      <ArrowUpRight />
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </article>

      {/* The page's only dark band: the rest of the work, next project first. */}
      <section aria-labelledby="case-next-title" className="ar-on-night">
        <div className="ar-container ar-section grid gap-[var(--space-6)]">
          <header className="grid gap-[var(--space-3)]">
            <p className="ar-mono ar-muted m-0">{LABELS.nextKicker}</p>
            <h2
              id="case-next-title"
              data-appear="flip"
              className="m-0 text-[clamp(40px,6vw,80px)] font-bold lowercase leading-[0.88] tracking-[-0.045em]"
            >
              {LABELS.next}
            </h2>
          </header>
          <WorkTable items={onward(project)} label="Next projects" headingId="case-next-title" />
        </div>
      </section>
      <MotionInit />
    </>
  );
}
