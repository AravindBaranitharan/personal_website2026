import Link from "next/link";
import { contact, nav, profile, socials } from "@/content/site";

/** Closing chapter: wash card with white pill links over the giant wordmark (design system: FooterWordmark). */
export function Footer() {
  const links = [
    ...socials,
    { label: "Resume", href: profile.resumePath },
    ...nav,
  ];

  return (
    <footer id="contact" className="ar-footer ar-wash mt-[var(--space-8)]" aria-label="Contact">
      <div className="ar-container grid gap-[var(--space-7)] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-[var(--space-5)]" data-appear="rise">
          <p className="m-0 max-w-[18ch] text-[clamp(32px,4.4vw,54px)] font-medium leading-[0.95] tracking-[-0.03em]">
            {contact.footerLine}
          </p>
          <div className="grid gap-1 text-[15px]">
            <span className="select-all">{profile.email}</span>
            <span className="ar-muted">{profile.phone}</span>
            <span className="ar-muted">
              {profile.location} · {profile.workLocation}
            </span>
          </div>
        </div>
        <ul className="m-0 grid list-none grid-cols-2 content-start gap-2 p-0 sm:grid-cols-3 md:justify-end md:justify-self-end">
          {links.map((link) => {
            const external = link.href.startsWith("http");
            return (
              <li key={link.label}>
                {external ? (
                  <a className="ar-pill-link w-full justify-center" href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <Link className="ar-pill-link w-full justify-center" href={link.href}>
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="ar-container mt-[var(--space-6)] flex flex-wrap justify-between gap-2 text-[13px]">
        <span className="ar-muted">© 2026 {profile.name}</span>
        <span className="ar-muted">Built with Next.js · Motion measured from plainthing.studio</span>
      </div>
      <span className="ar-footer__word" aria-hidden="true">
        {profile.shortName}
      </span>
    </footer>
  );
}
