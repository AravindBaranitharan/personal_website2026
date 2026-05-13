import { serviceItems } from "@/content/site";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
              <Link
                href={`/services/${service.slug}`}
                className="group block px-2 transition duration-300 hover:bg-white/[0.04] sm:px-4"
              >
                <div className="grid grid-cols-[42px_1fr_28px] items-start gap-3 py-6 sm:grid-cols-[56px_1fr_36px] sm:gap-4 sm:py-8 md:grid-cols-[80px_1fr_56px] md:items-center md:gap-8">
                  <span className="font-meta text-[11px] font-bold text-[#FF4D00] sm:text-[12px]">
                    {service.id}
                  </span>

                  <div className="space-y-3">
                    <h3 className="font-display-upper text-[clamp(1.8rem,9vw,5rem)] leading-[0.86] tracking-[-0.04em] transition duration-300 group-hover:translate-x-2">
                      {service.title}
                    </h3>
                    <p className="max-w-3xl font-body text-[13px] font-medium leading-relaxed text-white/75 sm:text-[14px]">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-meta rounded-full border border-white/50 bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase text-white sm:px-3 sm:text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ArrowUpRight
                    className="h-7 w-7 justify-self-end text-[#FF4D00] opacity-40 transition duration-300 group-hover:scale-110 group-hover:opacity-100 sm:h-10 sm:w-10 md:h-14 md:w-14"
                    strokeWidth={2.5}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
