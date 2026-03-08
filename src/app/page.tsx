import { ArrowDown, ArrowUpRight, Github, Instagram, Linkedin, Mail } from "lucide-react";

const navLinks = [
  { label: "HOME", href: "#home" },
  { label: "SERVICES", href: "#services" },
  { label: "PROJECTS", href: "#work" },
  { label: "CONTACT", href: "#contact" },
];

const serviceItems = [
  {
    id: "01",
    title: "CUSTOM WEB APPS",
    tags: ["NEXT.JS", "TYPESCRIPT", "PERFORMANCE", "NODE", "REACT", "TAILWIND", "MONGO DB", "ANGULAR JS"],
  },
  {
    id: "02",
    title: "AI + LLM INTEGRATIONS",
    tags: ["PYTHON", "RAG SYSTEMS", "AUTOMATION", "GEN AI", "AI AGENTS"],
  },
  {
    id: "03",
    title: "SAAS BUILDER",
    tags: [],
  },
  {
    id: "04",
    title: "GEN AI DEVELOPMENT",
    tags: ["FINE TUNING", "CUSTOM GPT", "CHAT BOT", "AI AGENTS FOR BUSINESS"],
  },
];

const marqueePrimary =
  "WEB APPS • AI ENGINEER • MACHINE LEARNING • AGENTIC AI • WEB APPS • AI ENGINEER • MACHINE LEARNING • AGENTIC AI • ";
const marqueeSecondary =
  "SYSTEM THINKING • UX PRECISION • ENGINEERING • SAAS • OPEN CLAW • AI MENTOR • ";

function RotatingScrollIndicator() {
  return (
    <div className="relative flex h-[132px] w-[132px] items-center justify-center sm:h-36 sm:w-36">
      <svg
        viewBox="0 0 144 144"
        className="spin-indicator h-[132px] w-[132px] sm:h-36 sm:w-36"
      >
        <defs>
          <path
            id="scroll-circle"
            d="M72,72 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"
          />
        </defs>
        <text className="font-meta fill-current text-[9px] font-bold uppercase">
          <textPath href="#scroll-circle" startOffset="0%">
            SCROLL DOWN • SCROLL DOWN • SCROLL DOWN • SCROLL DOWN •
          </textPath>
        </text>
      </svg>
      <ArrowDown className="absolute h-5 w-5" strokeWidth={2.5} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-brand-orange text-brand-black">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:pt-4 md:px-8">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="relative flex items-center justify-between">
            <a
              href="#home"
              className="font-display shrink-0 text-xl leading-none tracking-[-0.04em] sm:text-2xl"
            >
              AB
            </a>

            <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
              <div className="nav-depth-shadow rounded-full border-2 border-black bg-black px-2 py-1">
                <ul className="flex items-center gap-1">
                  {navLinks.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="font-meta inline-flex rounded-full px-4 py-2 text-[12px] font-bold text-white transition duration-200 hover:translate-x-1 hover:scale-110 hover:bg-white hover:text-black"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <a
                href="https://github.com/AravindBaranitharan"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-black text-white transition duration-200 hover:translate-x-1 hover:scale-110 hover:bg-white hover:text-black sm:h-10 sm:w-10"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/aravind-baranitharan-b4b273227/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-black text-white transition duration-200 hover:translate-x-1 hover:scale-110 hover:bg-white hover:text-black sm:h-10 sm:w-10"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/7s_mortal_ig/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-black text-white transition duration-200 hover:translate-x-1 hover:scale-110 hover:bg-white hover:text-black sm:h-10 sm:w-10"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                aria-label="Email"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-black text-white transition duration-200 hover:translate-x-1 hover:scale-110 hover:bg-white hover:text-black sm:h-10 sm:w-10"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav className="mt-3 flex justify-center md:hidden">
            <div className="nav-depth-shadow rounded-full border-2 border-black bg-black px-1.5 py-1 sm:px-2">
              <ul className="flex items-center gap-0.5 sm:gap-1">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="font-meta inline-flex rounded-full px-2 py-1 text-[9px] font-bold text-white transition duration-200 hover:translate-x-1 hover:scale-110 hover:bg-white hover:text-black sm:px-2.5 sm:py-1.5 sm:text-[10px]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <section
        id="home"
        className="section-reveal section-delay-1 flex min-h-screen items-end border-b-2 border-black px-4 pb-8 pt-[11.5rem] sm:pt-52 md:px-8 md:pb-12 md:pt-40"
      >
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mx-auto w-full max-w-[1280px]">
            <h1 className="font-display text-center text-[clamp(2.4rem,9vw,9rem)] leading-[0.86] tracking-[-0.04em] text-black">
              ARAVIND
              <br />
              BARANITHARAN
            </h1>
          </div>

          <div className="mt-6 border-t-2 border-black pt-6 sm:mt-8 sm:pt-8">
            <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-[1fr_auto_1fr]">
              <p className="font-meta text-center text-[11px] font-bold normal-case leading-relaxed sm:text-[12px] md:text-left">
                AI ENGINEER AT Tata Consultancy Services
                <br />
                aravindbaranitharan@gmail.com
                <br />
                6379319612
              </p>

              <div className="flex justify-center">
                <RotatingScrollIndicator />
              </div>

              <p className="font-meta text-center text-[11px] font-bold uppercase leading-relaxed sm:text-[12px] md:text-right">
                AI ENGINEER
                <br />
                SOFTWARE DEVELOPER
                <br />
                INNOVATIVE PRODUCT DEVELOPMENT
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="section-reveal section-delay-2 relative -skew-y-2 overflow-hidden border-y-2 border-black bg-black py-8 sm:py-10"
      >
        <div className="skew-y-2 space-y-2">
          <div className="marquee">
            <div className="marquee-track font-display text-[clamp(2.4rem,10vw,10rem)] leading-[0.86] text-[#FF4D00]">
              <span className="pr-10">{marqueePrimary}</span>
              <span aria-hidden="true" className="pr-10">
                {marqueePrimary}
              </span>
            </div>
          </div>
          <div className="marquee">
            <div className="marquee-track marquee-track--reverse font-display text-[clamp(2.3rem,10vw,10rem)] leading-[0.86] text-white/80">
              <span className="pr-10">{marqueeSecondary}</span>
              <span aria-hidden="true" className="pr-10">
                {marqueeSecondary}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="section-reveal section-delay-3 bg-black px-4 py-14 text-white sm:py-20 md:px-8"
      >
        <div className="mx-auto w-full max-w-[1440px]">
          <p className="font-meta text-[11px] font-bold uppercase text-white/70 sm:text-[12px]">
            SERVICES
          </p>

          <ul className="mt-6 border-t border-white/20">
            {serviceItems.map((service) => (
              <li key={service.id} className="border-b border-white/20">
                <a
                  href="https://github.com/AravindBaranitharan?tab=repositories"
                  target="_blank"
                  rel="noreferrer"
                  className="group block transition duration-200 hover:bg-white/5"
                >
                  <div className="grid grid-cols-[42px_1fr_28px] items-start gap-3 py-6 sm:grid-cols-[56px_1fr_36px] sm:gap-4 sm:py-8 md:grid-cols-[80px_1fr_56px] md:items-center md:gap-8">
                    <span className="font-meta text-[11px] font-bold text-[#FF4D00] sm:text-[12px]">
                      {service.id}
                    </span>

                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="font-display text-[clamp(2rem,11vw,7rem)] leading-[0.86] tracking-[-0.04em] transition duration-200 group-hover:translate-x-4">
                        {service.title}
                      </h3>
                      {service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-meta rounded-full border border-white/30 px-2.5 py-1 text-[10px] font-bold uppercase text-white sm:px-3 sm:text-[11px]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <ArrowUpRight
                      className="h-7 w-7 justify-self-end text-[#FF4D00] opacity-0 transition duration-200 group-hover:rotate-45 group-hover:opacity-100 sm:h-10 sm:w-10 md:h-14 md:w-14"
                      strokeWidth={2.5}
                    />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="contact"
        className="section-reveal section-delay-4 border-y-2 border-black bg-[#FF4D00] px-4 py-20 sm:py-24 md:px-8"
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center text-center">
          <h2 className="font-display text-[clamp(3rem,14vw,14rem)] leading-[0.86] tracking-[-0.04em] text-black">
            LET&apos;S BUILD
          </h2>
          <a
            href="mailto:aravindbaranitharan@gmail.com"
            className="font-meta mt-7 inline-flex rounded-full border-2 border-black bg-black px-8 py-3 text-[11px] font-bold uppercase text-white transition duration-200 hover:translate-x-4 hover:scale-110 sm:mt-8 sm:px-10 sm:py-4 sm:text-[12px]"
          >
            START A PROJECT
          </a>
        </div>
      </section>

      <footer className="section-reveal section-delay-5 border-t-2 border-black bg-[#FF4D00] px-4 py-6 md:px-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-4 md:flex-row md:items-center">
          <p className="font-meta text-center text-[11px] font-bold uppercase sm:text-[12px] md:text-left">
            2026 ARAVIND BARANITHARAN. ALL RIGHTS RESERVED.
          </p>
          <div className="font-meta flex items-center gap-4 text-[11px] font-bold uppercase sm:gap-5 sm:text-[12px]">
            <a
              className="transition hover:translate-x-1 hover:scale-110"
              href="https://github.com/AravindBaranitharan"
              target="_blank"
              rel="noreferrer"
            >
              GITHUB
            </a>
            <a
              className="transition hover:translate-x-1 hover:scale-110"
              href="https://www.linkedin.com/in/aravind-baranitharan-b4b273227/"
              target="_blank"
              rel="noreferrer"
            >
              LINKEDIN
            </a>
            <a
              className="transition hover:translate-x-1 hover:scale-110"
              href="https://www.instagram.com/7s_mortal_ig/"
              target="_blank"
              rel="noreferrer"
            >
              INSTAGRAM
            </a>
            <a
              className="transition hover:translate-x-1 hover:scale-110"
              href="mailto:aravindbaranitharan@gmail.com"
            >
              EMAIL
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


























