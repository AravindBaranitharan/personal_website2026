import { socialLinks } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-reveal section-delay-6 border-t-2 border-black bg-[#FF4D00] px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-4 md:flex-row md:items-center">
        <p className="font-meta text-center text-[11px] font-bold uppercase sm:text-[12px] md:text-left">
          {year} ARAVIND BARANITHARAN. ALL RIGHTS RESERVED.
        </p>
        <div className="font-meta flex items-center gap-4 text-[11px] font-bold uppercase sm:gap-5 sm:text-[12px]">
          {socialLinks.map((item) => {
            const isExternal = item.href.startsWith("http");
            const href = item.icon === "email" ? "mailto:aravindbaranitharan@gmail.com" : item.href;
            const label = item.icon === "email" ? "Email" : item.label;

            return (
              <a
                key={item.label}
                className="transition hover:translate-x-1 hover:scale-110"
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

