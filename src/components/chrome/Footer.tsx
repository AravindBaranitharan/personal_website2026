import Link from "next/link";
import type { ReactNode } from "react";
import { footer, profile, socials } from "@/content/site";
import { FooterScene } from "./FooterScene";

const ICONS: Record<string, ReactNode> = {
  GitHub: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.39.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  ),
  LinkedIn: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.83v1.57h.06c.53-1 1.84-2.07 3.79-2.07 4.05 0 4.8 2.67 4.8 6.13v5.87h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4V9.75Z" />
  ),
  Instagram: (
    <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1ZM17.98 7.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.73 0 3.05.01 4.13.06 2.77.13 4.07 1.44 4.2 4.2.05 1.08.06 1.4.06 4.14s-.01 3.06-.06 4.14c-.13 2.75-1.42 4.07-4.2 4.2-1.08.05-1.4.06-4.13.06s-3.06-.01-4.14-.06c-2.78-.13-4.07-1.45-4.2-4.2C3.61 15.06 3.6 14.74 3.6 12s.01-3.06.06-4.14c.13-2.76 1.43-4.07 4.2-4.2C8.94 3.61 9.27 3.6 12 3.6ZM12 2c-2.72 0-3.06.01-4.13.06-3.63.17-5.65 2.18-5.81 5.81C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.14c.17 3.62 2.18 5.64 5.81 5.8 1.07.05 1.41.06 4.13.06s3.06-.01 4.14-.06c3.62-.16 5.65-2.18 5.8-5.8.05-1.08.06-1.42.06-4.14s-.01-3.06-.06-4.13c-.16-3.62-2.17-5.65-5.8-5.81C15.06 2.01 14.72 2 12 2Z" />
  ),
  Email: (
    <path d="M3 5.5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm1 2.1v9.4h16V7.6l-8 5.2-8-5.2Zm1.6-.6L12 11.1 18.4 7H5.6Z" />
  ),
};

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("http")) {
    return (
      <a className="ar-foot__link" href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  if (href.startsWith("mailto:") || href.endsWith(".pdf")) {
    return (
      <a className="ar-foot__link" href={href}>
        {children}
      </a>
    );
  }
  return (
    <Link className="ar-foot__link" href={href}>
      {children}
    </Link>
  );
}

/** Closing chapter (also the Contact anchor): brand, tagline and socials beside link columns, then a sunset scene. */
export function Footer() {
  const iconLinks = [...socials, { label: "Email", href: `mailto:${profile.email}` }];

  return (
    <footer id="contact" className="ar-foot" aria-label="Contact">
      <div className="ar-container ar-foot__top">
        <div className="ar-foot__brand" data-appear="rise">
          <Link href="/" className="ar-foot__name">
            {profile.name}
          </Link>
          <p className="ar-foot__tagline">{footer.tagline}</p>
          <p className="ar-foot__contact">
            <span className="select-all">{profile.email}</span>
            <span>{profile.phone}</span>
          </p>
          <ul className="ar-foot__icons" aria-label="Elsewhere">
            {iconLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    {ICONS[s.label]}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="ar-foot__cols" aria-label="Footer" data-appear-group="rise">
          {footer.columns.map((col) => (
            <div key={col.title} className="ar-foot__col">
              <p className="ar-foot__title">{col.title}</p>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="ar-container">
        <div className="ar-foot__bar">
          <span>© 2026 {profile.name}. All rights reserved.</span>
        </div>
      </div>

      <FooterScene />
    </footer>
  );
}
