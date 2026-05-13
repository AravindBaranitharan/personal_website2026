import { navLinks, socialLinks } from "@/content/site";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  email: Mail,
} as const;

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:pt-4 md:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="relative flex items-center justify-end">
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

          <div className="flex shrink-0 items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = iconMap[social.icon];
              const isExternal = social.href.startsWith("http");

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-black text-white transition duration-200 hover:translate-x-1 hover:scale-110 hover:bg-white hover:text-black sm:h-10 sm:w-10"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <nav className="mt-3 flex justify-center md:hidden">
          <div className="nav-depth-shadow rounded-full border-2 border-black bg-black px-2 py-1 sm:px-2.5">
            <ul className="flex items-center gap-1">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-meta inline-flex rounded-full px-2.5 py-1.5 text-[11px] font-bold text-white transition duration-200 hover:bg-white hover:text-black sm:px-3 sm:text-[12px]"
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
  );
}
