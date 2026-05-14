"use client";

import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { SVGFollower } from "@/components/ui/svg-follower";
import { WavePath } from "@/components/ui/wave-path";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const CURSOR_COLORS = ["#FF4D00", "#FF8A00", "#FFD400", "#FFFFFF", "#1a1a1a"];

export function ApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(isFinePointer && !reducedMotion);

    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return (
    <section ref={sectionRef} id="approach" aria-label="The approach">
      {enabled && active && viewport.w > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[40] mix-blend-screen"
        >
          <div className="pointer-events-auto">
            <SVGFollower
              key={`${viewport.w}x${viewport.h}`}
              width={viewport.w}
              height={viewport.h}
              colors={CURSOR_COLORS}
              removeDelay={420}
            />
          </div>
        </div>
      )}
      <FlowArt aria-label="How I work">
        <FlowSection
          aria-label="Who I am and what I do"
          className="border-y-2 border-black"
          style={{ backgroundColor: "var(--brand-orange)", color: "#000" }}
        >
          <div id="about" className="absolute -top-24" aria-hidden="true" />
          <p className="font-meta text-[11px] font-bold uppercase tracking-[0.22em] sm:text-[12px]">
            01 — About
          </p>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t-2 border-black opacity-100" />
          <div>
            <h2 className="font-display-upper text-[clamp(2.4rem,min(8vw,13vh),7.5rem)] leading-[0.92] tracking-[-0.02em]">
              Who I Am?
              <span className="my-[clamp(0.35rem,1.2vh,0.9rem)] block font-body text-[0.2em] font-medium italic normal-case tracking-[0.32em] opacity-70">
                — and —
              </span>
              What I Do?
            </h2>
          </div>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t-2 border-black opacity-100" />
          <p className="font-body max-w-[58ch] text-[clamp(0.95rem,1.5vw,1.2rem)] font-medium leading-relaxed">
            AI Engineer at{" "}
            <span className="font-bold">Tata Consultancy Services</span> by day
            — production LLM systems, retrieval pipelines, and the evaluation
            infrastructure that keeps them honest. By craft, an independent
            product engineer shipping web and AI experiences end to end. One
            operator who owns the outcome.
          </p>
        </FlowSection>

        <FlowSection
          aria-label="Process"
          className="border-y-2 border-black"
          style={{ backgroundColor: "#000", color: "#fff" }}
        >
          <p className="font-meta text-[11px] font-bold uppercase tracking-[0.22em] text-white/80 sm:text-[12px]">
            02 — Process
          </p>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-white/60" />
          <div>
            <h2 className="font-display-upper text-[clamp(2.2rem,min(7vw,11.5vh),6.5rem)] leading-[0.9] tracking-tight">
              Tight
              <br />
              Loops.
              <br />
              Honest
              <br />
              Demos.
            </h2>
          </div>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-white/60" />
          <p className="font-body max-w-[58ch] text-[clamp(0.95rem,1.5vw,1.2rem)] font-medium leading-relaxed">
            Weekly demos. No throwaway prototypes. You see the product compound
            every Friday — not a slide deck, the real thing running on your
            domain.
          </p>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-white/60" />
          <div className="flex flex-wrap gap-[clamp(1rem,2vw,2.25rem)]">
            <div className="min-w-[180px] flex-1">
              <p className="font-meta mb-2 text-[12px] font-bold uppercase tracking-wider text-[#FF4D00]">
                Week 1 — Scope
              </p>
              <p className="font-body text-[clamp(0.85rem,1vw,0.95rem)] leading-relaxed text-white/80">
                Define the wedge. Cut anything that does not move a metric or
                a feeling.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <p className="font-meta mb-2 text-[12px] font-bold uppercase tracking-wider text-[#FF4D00]">
                Week 2 — Build
              </p>
              <p className="font-body text-[clamp(0.85rem,1vw,0.95rem)] leading-relaxed text-white/80">
                Production code from day one. UI, API, and the AI layer
                threaded together.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <p className="font-meta mb-2 text-[12px] font-bold uppercase tracking-wider text-[#FF4D00]">
                Week 3 — Ship
              </p>
              <p className="font-body text-[clamp(0.85rem,1vw,0.95rem)] leading-relaxed text-white/80">
                Deployed, instrumented, handed over with docs and a roadmap
                for what comes next.
              </p>
            </div>
          </div>
        </FlowSection>

        <FlowSection
          aria-label="Stack"
          className="border-y-2 border-black"
          style={{ backgroundColor: "var(--brand-orange-deep)", color: "#fff" }}
        >
          <p className="font-meta text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 sm:text-[12px]">
            03 — Stack
          </p>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-white/50" />
          <div>
            <h2 className="font-display-upper text-[clamp(2.2rem,min(7vw,11.5vh),6.5rem)] leading-[0.9] tracking-tight">
              What
              <br />
              I Build
              <br />
              With.
            </h2>
          </div>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-white/50" />
          <div className="grid gap-[clamp(1rem,2vw,2.25rem)] sm:grid-cols-2">
            <div>
              <p className="font-meta mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black sm:text-[12px]">
                AI &amp; ML
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "PyTorch",
                  "TensorFlow",
                  "scikit-learn",
                  "Hugging Face",
                  "OpenCV",
                  "NumPy",
                  "Pandas",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="font-meta rounded-full border-2 border-black bg-white/10 px-3 py-1 text-[11px] font-bold uppercase text-white sm:text-[12px]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-meta mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black sm:text-[12px]">
                LLM &amp; RAG
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "OpenAI",
                  "Anthropic",
                  "LangChain",
                  "LlamaIndex",
                  "Pinecone",
                  "Weaviate",
                  "ChromaDB",
                  "FAISS",
                  "Agents",
                  "Fine-tuning",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="font-meta rounded-full border-2 border-black bg-white/10 px-3 py-1 text-[11px] font-bold uppercase text-white sm:text-[12px]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-meta mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black sm:text-[12px]">
                Web &amp; Product
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Next.js",
                  "React",
                  "TypeScript",
                  "Node.js",
                  "FastAPI",
                  "Tailwind CSS",
                  "Framer Motion",
                  "GSAP",
                  "shadcn/ui",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="font-meta rounded-full border-2 border-black bg-white/10 px-3 py-1 text-[11px] font-bold uppercase text-white sm:text-[12px]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-meta mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black sm:text-[12px]">
                Data &amp; Infra
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "PostgreSQL",
                  "MongoDB",
                  "Redis",
                  "Docker",
                  "Vercel",
                  "AWS",
                  "GitHub Actions",
                  "REST",
                  "GraphQL",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="font-meta rounded-full border-2 border-black bg-white/10 px-3 py-1 text-[11px] font-bold uppercase text-white sm:text-[12px]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-white/50" />
          <p className="font-body max-w-[58ch] text-[clamp(0.95rem,1.5vw,1.2rem)] font-medium leading-relaxed">
            Boring stack on purpose. Stable foundations let the interesting
            work happen upstream — in the product, the model, and the
            judgement calls between them.
          </p>
        </FlowSection>

        <FlowSection
          aria-label="Experience"
          className="border-y-2 border-black"
          style={{ backgroundColor: "var(--brand-paper)", color: "#000" }}
        >
          <p className="font-meta text-[11px] font-bold uppercase tracking-[0.22em] sm:text-[12px]">
            04 — Experience
          </p>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-black/60" />
          <div>
            <h2 className="font-display-upper text-[clamp(2.2rem,min(7vw,11.5vh),6.5rem)] leading-[0.9] tracking-tight">
              The
              <br />
              Experience.
            </h2>
          </div>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-black/60" />
          <div className="flex flex-wrap gap-[clamp(1rem,2vw,2.25rem)]">
            <div className="min-w-[200px] flex-1">
              <p className="font-display-upper text-[clamp(2rem,4vw,3.25rem)] leading-[0.9] text-[#d84200]">
                2yrs+
              </p>
              <p className="font-meta mt-2 text-[11px] font-bold uppercase tracking-wider text-black/70 sm:text-[12px]">
                AI Engineer
              </p>
              <p className="font-body mt-2 text-[clamp(0.85rem,1vw,0.95rem)] leading-relaxed text-black/75">
                Shipping LLM systems, retrieval pipelines, and eval
                infrastructure for enterprise scale.
              </p>
            </div>
            <div className="min-w-[200px] flex-1">
              <p className="font-display-upper text-[clamp(2rem,4vw,3.25rem)] leading-[0.9] text-[#d84200]">
                10+
              </p>
              <p className="font-meta mt-2 text-[11px] font-bold uppercase tracking-wider text-black/70 sm:text-[12px]">
                Independent builds
              </p>
              <p className="font-body mt-2 text-[clamp(0.85rem,1vw,0.95rem)] leading-relaxed text-black/75">
                Web and AI products taken from rough sketches to deployed,
                instrumented launches.
              </p>
            </div>
            <div className="min-w-[200px] flex-1">
              <p className="font-display-upper text-[clamp(2rem,4vw,3.25rem)] leading-[0.9] text-[#d84200]">
                &lt;2s
              </p>
              <p className="font-meta mt-2 text-[11px] font-bold uppercase tracking-wider text-black/70 sm:text-[12px]">
                LLM response budget
              </p>
              <p className="font-body mt-2 text-[clamp(0.85rem,1vw,0.95rem)] leading-relaxed text-black/75">
                What I design for. Latency is a feature, not an afterthought.
              </p>
            </div>
          </div>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-black/60" />
          <p className="font-body max-w-[58ch] text-[clamp(0.95rem,1.5vw,1.2rem)] font-medium leading-relaxed">
            Production code, not screenshots. Every number above maps to
            something live — auditable in case studies or in repos.
          </p>
        </FlowSection>

        <FlowSection
          aria-label="Notes"
          className="border-y-2 border-black"
          style={{ backgroundColor: "var(--brand-cream)", color: "#000" }}
        >
          <p className="font-meta text-[11px] font-bold uppercase tracking-[0.22em] sm:text-[12px]">
            05 — Notes
          </p>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-black/60" />
          <div>
            <h2 className="font-display-upper text-[clamp(2.2rem,min(7vw,11.5vh),6.5rem)] leading-[0.9] tracking-tight">
              How I
              <br />
              Use AI.
            </h2>
          </div>

          <div className="flex justify-center py-[clamp(2rem,6vh,4rem)]">
            <WavePath className="text-black/70" />
          </div>

          <ul className="grid gap-[clamp(1rem,2.2vh,1.75rem)] sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex flex-col gap-3">
              <span aria-hidden="true" className="font-display-upper text-[clamp(2.2rem,4vw,3rem)] leading-none text-[#d84200]">
                &ldquo;
              </span>
              <blockquote className="font-body text-[clamp(0.95rem,1.4vw,1.15rem)] font-medium leading-relaxed text-black/85">
                Ship the loop, not the prompt.
              </blockquote>
              <p className="font-meta text-[10px] font-bold uppercase tracking-[0.22em] text-black/55 sm:text-[11px]">
                On building
              </p>
            </li>
            <li className="flex flex-col gap-3">
              <span aria-hidden="true" className="font-display-upper text-[clamp(2.2rem,4vw,3rem)] leading-none text-[#d84200]">
                &ldquo;
              </span>
              <blockquote className="font-body text-[clamp(0.95rem,1.4vw,1.15rem)] font-medium leading-relaxed text-black/85">
                Models hallucinate. Pipelines don&rsquo;t have to.
              </blockquote>
              <p className="font-meta text-[10px] font-bold uppercase tracking-[0.22em] text-black/55 sm:text-[11px]">
                On engineering
              </p>
            </li>
            <li className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
              <span aria-hidden="true" className="font-display-upper text-[clamp(2.2rem,4vw,3rem)] leading-none text-[#d84200]">
                &ldquo;
              </span>
              <blockquote className="font-body text-[clamp(0.95rem,1.4vw,1.15rem)] font-medium leading-relaxed text-black/85">
                Vibes scale to zero. Evals scale to production.
              </blockquote>
              <p className="font-meta text-[10px] font-bold uppercase tracking-[0.22em] text-black/55 sm:text-[11px]">
                On rigor
              </p>
            </li>
          </ul>
        </FlowSection>

        <FlowSection
          aria-label="Let's start"
          className="border-y-2 border-black"
          style={{ backgroundColor: "#000", color: "#fff" }}
        >
          <p className="font-meta text-[11px] font-bold uppercase tracking-[0.22em] text-white/80 sm:text-[12px]">
            06 — Let&apos;s start
          </p>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-white/40" />
          <div>
            <h2 className="font-display-upper text-[clamp(2.2rem,min(7vw,11.5vh),6.5rem)] leading-[0.9] tracking-tight text-[#FF4D00]">
              Ready
              <br />
              To
              <br />
              Build?
            </h2>
          </div>
          <hr className="my-[clamp(0.75rem,1.6vh,1.5rem)] border-none border-t border-white/40" />
          <p className="font-body max-w-[52ch] text-[clamp(0.95rem,1.5vw,1.2rem)] font-medium leading-relaxed text-white/85">
            Bring a problem worth solving. I&apos;ll bring the plan, the build,
            and the polish.
          </p>
          <div className="relative z-[50] flex flex-wrap items-center gap-3">
            <Link
              href="#contact"
              className="font-meta button-depth pointer-events-auto inline-flex items-center gap-2 rounded-full border-2 border-[#FF4D00] bg-[#FF4D00] px-7 py-3 text-[11px] font-bold uppercase text-black transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:text-black hover:shadow-none sm:text-[12px]"
            >
              Start a project
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="#projects"
              className="font-meta pointer-events-auto inline-flex rounded-full border-2 border-white/60 px-7 py-3 text-[11px] font-bold uppercase text-white transition hover:border-white hover:bg-white hover:text-black sm:text-[12px]"
            >
              See the work
            </Link>
          </div>
        </FlowSection>
      </FlowArt>
    </section>
  );
}
