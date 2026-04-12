import { getServiceBySlug, profile, serviceDetails } from "@/content/site";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return serviceDetails.map((service) => ({ slug: service.slug }));
}

export default async function ServiceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 text-white md:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="font-display text-2xl leading-none tracking-[-0.04em]"
          >
            {profile.initials}
          </Link>

          <div className="font-meta flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase sm:text-[11px]">
            <Link
              href="/#home"
              className="rounded-full border border-white/30 px-3 py-1 transition hover:bg-white hover:text-black"
            >
              Home
            </Link>
            <Link
              href="/#services"
              className="rounded-full border border-white/30 px-3 py-1 transition hover:bg-white hover:text-black"
            >
              Services
            </Link>
            <Link
              href="/#contact"
              className="rounded-full border border-white/30 px-3 py-1 transition hover:bg-white hover:text-black"
            >
              Contact
            </Link>
          </div>
        </div>

        <Link
          href="/#services"
          className="font-meta inline-flex items-center gap-2 text-[11px] font-bold uppercase text-white/80 transition hover:text-[#FF4D00] sm:text-[12px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>

        <article className="feature-depth mt-5 overflow-hidden rounded-[2rem] border-2 border-black bg-brand-cream text-brand-warm-black">
          <header className="surface-panel border-b-2 border-black px-5 py-8 sm:px-8 sm:py-10">
            <p className="font-meta text-[11px] font-bold uppercase text-black/80 sm:text-[12px]">
              Service {service.id}
            </p>
            <h1 className="font-display mt-3 text-[clamp(2.2rem,8vw,5.8rem)] leading-[0.86] tracking-[-0.05em] text-black">
              {service.title}
            </h1>
            <p className="font-meta mt-4 max-w-3xl text-[12px] font-bold uppercase text-black/85 sm:text-[13px]">
              {service.articleKicker}
            </p>
            <p className="font-meta mt-3 max-w-4xl text-[12px] font-bold leading-relaxed text-black/85 sm:text-[13px]">
              {service.articleLead}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-meta rounded-full border border-black/50 bg-black/5 px-3 py-1 text-[10px] font-bold uppercase text-black sm:text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="bg-brand-paper px-5 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border-2 border-black bg-white px-4 py-4">
                <p className="font-meta text-[10px] font-bold uppercase text-black/60 sm:text-[11px]">
                  Challenge
                </p>
                <p className="font-meta mt-2 text-[12px] font-bold leading-relaxed text-black/85 sm:text-[13px]">
                  {service.challenge}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-black bg-white px-4 py-4">
                <p className="font-meta text-[10px] font-bold uppercase text-black/60 sm:text-[11px]">
                  Delivery Model
                </p>
                <p className="font-meta mt-2 text-[12px] font-bold leading-relaxed text-black/85 sm:text-[13px]">
                  {service.deliveryModel}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-black bg-white px-4 py-4">
                <p className="font-meta text-[10px] font-bold uppercase text-black/60 sm:text-[11px]">
                  Built For
                </p>
                <p className="font-meta mt-2 text-[12px] font-bold leading-relaxed text-black/85 sm:text-[13px]">
                  Teams that want execution speed without sacrificing long-term
                  product quality.
                </p>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="font-display text-[clamp(1.8rem,5vw,3.2rem)] leading-[0.88] tracking-[-0.04em] text-black">
                EXECUTION BLUEPRINT
              </h2>
              <ol className="mt-4 grid gap-3 sm:gap-4">
                {service.phases.map((phase, index) => (
                  <li
                    key={phase.title}
                    className="rounded-2xl border-2 border-black bg-white px-4 py-4"
                  >
                    <p className="font-meta text-[10px] font-bold uppercase text-[#FF4D00] sm:text-[11px]">
                      Step {index + 1}
                    </p>
                    <p className="font-display mt-1 text-[1.35rem] leading-[0.92] text-black sm:text-[1.6rem]">
                      {phase.title}
                    </p>
                    <p className="font-meta mt-2 text-[12px] font-bold leading-relaxed text-black/85 sm:text-[13px]">
                      {phase.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-[clamp(1.7rem,4.5vw,2.8rem)] leading-[0.9] tracking-[-0.04em] text-black">
                  WHAT I DELIVER
                </h2>
                <ul className="mt-3 space-y-2">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="font-meta inline-flex items-start gap-2 text-[12px] font-bold leading-relaxed text-black/85 sm:text-[13px]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF4D00]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-[clamp(1.7rem,4.5vw,2.8rem)] leading-[0.9] tracking-[-0.04em] text-black">
                  OUTCOMES
                </h2>
                <ul className="mt-3 space-y-2">
                  {service.outcomes.map((item) => (
                    <li
                      key={item}
                      className="font-meta inline-flex items-start gap-2 text-[12px] font-bold leading-relaxed text-black/85 sm:text-[13px]"
                    >
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FF4D00]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <footer className="border-t-2 border-black bg-black px-5 py-6 text-white sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-meta text-[11px] font-bold uppercase text-white/80 sm:text-[12px]">
                Want this service for your product?
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/#contact"
                  className="font-meta button-depth inline-flex rounded-full border-2 border-white bg-white px-5 py-2 text-[10px] font-bold uppercase text-black transition hover:bg-black hover:text-white sm:text-[11px]"
                >
                  Start a conversation
                </Link>
                <Link
                  href={profile.resumePath}
                  target="_blank"
                  rel="noreferrer"
                  className="font-meta inline-flex rounded-full border-2 border-white px-5 py-2 text-[10px] font-bold uppercase text-white transition hover:bg-white hover:text-black sm:text-[11px]"
                >
                  View resume
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
