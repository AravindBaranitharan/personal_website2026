import { profile } from "@/content/site";
import { ArrowDown } from "lucide-react";

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
            SCROLL DOWN * SCROLL DOWN * SCROLL DOWN * SCROLL DOWN *
          </textPath>
        </text>
      </svg>
      <ArrowDown className="absolute h-5 w-5" strokeWidth={2.5} />
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="home"
      className="section-reveal section-delay-1 flex min-h-screen items-end border-b-2 border-black px-4 pb-8 pt-[11.5rem] sm:pt-52 md:px-8 md:pb-12 md:pt-40"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mx-auto w-full max-w-[1280px]">
          <h1 className="font-display text-center text-[clamp(2.4rem,9vw,9rem)] leading-[0.86] tracking-[-0.04em] text-black">
            {profile.firstName}
            <br />
            {profile.lastName}
          </h1>
        </div>

        <div className="mt-6 border-t-2 border-black pt-6 sm:mt-8 sm:pt-8">
          <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-[1fr_auto_1fr]">
            <p className="font-meta text-center text-[11px] font-bold normal-case leading-relaxed sm:text-[12px] md:text-left">
              {profile.company}
              <br />
              {profile.email}
              <br />
              {profile.phone}
            </p>

            <div className="flex justify-center">
              <RotatingScrollIndicator />
            </div>

            <p className="font-meta text-center text-[11px] font-bold uppercase leading-relaxed sm:text-[12px] md:text-right">
              {profile.title}
              <br />
              {profile.subtitle}
              <br />
              INNOVATIVE PRODUCT DEVELOPMENT
            </p>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
            <a
              href="#contact"
              className="font-meta inline-flex rounded-full border-2 border-black bg-black px-8 py-3 text-[11px] font-bold uppercase text-white transition duration-200 hover:translate-x-2 hover:scale-105 hover:bg-white hover:text-black"
            >
              Start A Project
            </a>
            <a
              href={profile.resumePath}
              target="_blank"
              rel="noreferrer"
              className="font-meta inline-flex rounded-full border-2 border-black bg-white px-8 py-3 text-[11px] font-bold uppercase text-black transition duration-200 hover:translate-x-2 hover:scale-105 hover:bg-black hover:text-white"
            >
              View Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


