"use client";

import { featuredProject, projectItems } from "@/content/site";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.2, 0.7, 0.2, 1],
    },
  },
};

const supportingProjects = projectItems.filter(
  (project) => project.id !== featuredProject.projectId,
);

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="border-y-2 border-black bg-brand-cream px-4 py-14 sm:py-20 md:px-8"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <motion.div
          className="mb-8 flex flex-col gap-3 sm:mb-12"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <p className="font-meta text-[11px] font-bold uppercase text-brand-warm-black sm:text-[12px]">
            Projects
          </p>
          <h2 className="font-display text-[clamp(2.5rem,9vw,7.8rem)] leading-[0.84] tracking-[-0.05em] text-brand-warm-black">
            CASE STUDIES
          </h2>
          <p className="font-meta max-w-3xl text-[12px] font-bold uppercase text-brand-warm-black/80 sm:text-[13px]">
            Selected builds where product strategy, visual systems, and execution
            quality move together.
          </p>
        </motion.div>

        <motion.a
          href={featuredProject.href}
          target="_blank"
          rel="noreferrer"
          className="group feature-depth block overflow-hidden rounded-[2rem] border-2 border-black bg-black text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
          whileHover={{ y: -6 }}
        >
          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            <div className="relative min-h-[19rem] border-b-2 border-black lg:border-b-0 lg:border-r-2">
              <Image
                src={featuredProject.image}
                alt={featuredProject.title}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute left-5 top-5 rounded-full border-2 border-black bg-brand-paper px-3 py-1 text-[10px] font-bold uppercase text-black sm:text-[11px]">
                {featuredProject.label}
              </div>
              <div className="badge-glow absolute bottom-5 left-5 rounded-xl bg-brand-orange px-3 py-2 text-[11px] font-bold uppercase text-black sm:text-[12px]">
                {featuredProject.year}
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-7 lg:p-8">
              <div>
                <h3 className="font-display text-[clamp(2rem,6vw,4rem)] leading-[0.86] tracking-[-0.04em]">
                  {featuredProject.title}
                </h3>
                <p className="font-meta mt-2 text-[11px] font-bold uppercase text-white/75 sm:text-[12px]">
                  Problem
                </p>
                <p className="font-meta mt-1 text-[12px] font-bold leading-relaxed text-white/90 sm:text-[13px]">
                  {featuredProject.problem}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-meta text-[11px] font-bold uppercase text-white/75 sm:text-[12px]">
                    Build
                  </p>
                  <p className="font-meta mt-1 text-[12px] font-bold leading-relaxed text-white/90 sm:text-[13px]">
                    {featuredProject.build}
                  </p>
                </div>
                <div>
                  <p className="font-meta text-[11px] font-bold uppercase text-white/75 sm:text-[12px]">
                    Result
                  </p>
                  <p className="font-meta mt-1 text-[12px] font-bold leading-relaxed text-white/90 sm:text-[13px]">
                    {featuredProject.result}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {featuredProject.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-white/30 bg-white/5 px-3 py-3"
                  >
                    <p className="font-meta text-[10px] font-bold uppercase text-white/70 sm:text-[11px]">
                      {metric.label}
                    </p>
                    <p className="font-meta mt-1 text-[13px] font-bold uppercase text-brand-orange sm:text-[15px]">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {featuredProject.stack.map((item) => (
                  <span
                    key={item}
                    className="font-meta rounded-full border border-white/35 px-3 py-1 text-[10px] font-bold uppercase sm:text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.a>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {supportingProjects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group tilt-hover overflow-hidden rounded-2xl border-2 border-black bg-black text-white"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                ease: [0.2, 0.7, 0.2, 1],
                delay: index * 0.06,
              }}
            >
              <div className="relative h-56 border-b-2 border-black sm:h-60">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 rounded-full border-2 border-black bg-brand-orange p-1 text-black transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="font-display text-[1.68rem] leading-[0.9] tracking-[-0.03em]">
                    {project.title}
                  </p>
                  <p className="font-meta mt-1 text-[11px] font-bold uppercase text-white/70">
                    {project.subTitle}
                  </p>
                </div>

                <p className="font-meta text-[12px] font-bold leading-relaxed text-white/85">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="font-meta rounded-full border border-white/30 px-2.5 py-1 text-[10px] font-bold uppercase"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
