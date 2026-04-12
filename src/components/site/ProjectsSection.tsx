import { projectItems } from "@/content/site";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="section-reveal section-delay-4 border-y-2 border-black bg-[#FF4D00] px-4 py-14 sm:py-20 md:px-8"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mb-7 flex flex-col gap-3 sm:mb-10">
          <p className="font-meta text-[11px] font-bold uppercase sm:text-[12px]">
            PROJECTS
          </p>
          <h2 className="font-display text-[clamp(2.4rem,10vw,7.5rem)] leading-[0.86] tracking-[-0.04em]">
            SELECTED WORK
          </h2>
          <p className="font-meta max-w-3xl text-[11px] font-bold uppercase sm:text-[12px]">
            A collection of projects where product thinking, performance, and
            modern interface design come together.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projectItems.map((project) => (
            <a
              key={project.id}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-2xl border-2 border-black bg-black text-white"
            >
              <div className="relative h-56 border-b-2 border-black sm:h-60">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 rounded-full border-2 border-black bg-[#FF4D00] p-1 text-black transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="font-display text-[1.65rem] leading-[0.9] tracking-[-0.03em]">
                    {project.title}
                  </p>
                  <p className="font-meta mt-1 text-[10px] font-bold uppercase text-white/70 sm:text-[11px]">
                    {project.subTitle}
                  </p>
                </div>

                <p className="font-meta text-[11px] font-bold uppercase text-white/80 sm:text-[12px]">
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

