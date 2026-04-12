import { serviceItems } from "@/content/site";
import { ArrowUpRight } from "lucide-react";

export function ServicesSection() {
  return (
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
                href={service.href}
                target="_blank"
                rel="noreferrer"
                className="group block transition duration-200 hover:bg-white/5"
              >
                <div className="grid grid-cols-[42px_1fr_28px] items-start gap-3 py-6 sm:grid-cols-[56px_1fr_36px] sm:gap-4 sm:py-8 md:grid-cols-[80px_1fr_56px] md:items-center md:gap-8">
                  <span className="font-meta text-[11px] font-bold text-[#FF4D00] sm:text-[12px]">
                    {service.id}
                  </span>

                  <div className="space-y-3">
                    <h3 className="font-display text-[clamp(2rem,11vw,7rem)] leading-[0.86] tracking-[-0.04em] transition duration-200 group-hover:translate-x-4">
                      {service.title}
                    </h3>
                    <p className="max-w-3xl font-meta text-[11px] font-bold uppercase text-white/70 sm:text-[12px]">
                      {service.description}
                    </p>
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
  );
}

