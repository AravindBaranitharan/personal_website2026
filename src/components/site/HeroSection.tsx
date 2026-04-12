"use client";

import { profile } from "@/content/site";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.2, 0.7, 0.2, 1],
      staggerChildren: 0.1,
    },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] },
  },
};

function RotatingScrollIndicator() {
  return (
    <div className="float-slow relative flex h-[132px] w-[132px] items-center justify-center sm:h-36 sm:w-36">
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
            Scroll down * Scroll down * Scroll down * Scroll down *
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
      className="relative flex min-h-screen items-center border-b-2 border-black px-4 pb-10 pt-24 sm:pt-28 md:px-8 md:pb-14 md:pt-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 atmosphere-grid opacity-20" />
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-[#ffd5bd] blur-3xl" />
        <div className="absolute right-[-6rem] top-[35%] h-80 w-80 rounded-full bg-[#ff7640] blur-3xl" />
      </div>

      <motion.div
        className="mx-auto w-full max-w-[1440px]"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.div variants={revealItem} className="mx-auto w-full max-w-[1280px]">

          <h1 className="font-display text-center text-[clamp(2.8rem,9.2vw,9.6rem)] leading-[0.84] tracking-[-0.05em] text-black">
            {profile.firstName}
            <br />
            {profile.lastName}
          </h1>
          <p className="font-meta mx-auto mt-5 max-w-2xl text-center text-[12px] font-bold uppercase text-brand-warm-black sm:text-[13px]">
            Building product-grade web and AI experiences that feel fast,
            memorable, and conversion-ready.
          </p>
        </motion.div>

        <motion.div variants={revealItem} className="mt-8 border-t-2 border-black pt-7 sm:mt-10 sm:pt-8">
          <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-[1fr_auto_1fr]">
            <p className="font-meta text-center text-[12px] font-bold normal-case leading-relaxed text-brand-warm-black md:text-left md:text-[13px]">
              {profile.company}
              <br />
              {profile.email}
              <br />
              {profile.phone}
            </p>

            <div className="flex justify-center">
              <RotatingScrollIndicator />
            </div>

            <p className="font-meta text-center text-[12px] font-bold uppercase leading-relaxed text-brand-warm-black md:text-right md:text-[13px]">
              {profile.title}
              <br />
              {profile.subtitle}
              <br />
              Product Thinking + AI Execution
            </p>
          </div>

          <motion.div
            variants={revealItem}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
          >
            <motion.a
              href="#contact"
              className="font-meta button-depth inline-flex rounded-full border-2 border-black bg-black px-8 py-3 text-[11px] font-bold uppercase text-white transition duration-200 hover:bg-brand-paper hover:text-black"
              whileHover={{ x: 6, y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start A Project
            </motion.a>
            <motion.a
              href="#projects"
              className="font-meta button-depth inline-flex rounded-full border-2 border-black bg-brand-paper px-8 py-3 text-[11px] font-bold uppercase text-black transition duration-200 hover:bg-black hover:text-white"
              whileHover={{ x: 6, y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Case Studies
            </motion.a>
            <a
              href={profile.resumePath}
              target="_blank"
              rel="noreferrer"
              className="font-meta px-2 text-[11px] font-bold uppercase underline decoration-2 underline-offset-4 transition hover:text-brand-paper sm:text-[12px]"
            >
              Resume PDF
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}



