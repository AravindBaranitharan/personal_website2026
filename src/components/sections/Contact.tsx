import { contact, profile, socials } from "@/content/site";
import { ContactForm, CopyEmailButton } from "./ContactForm";

function Cross({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  return (
    <svg
      className={`ar-cross ar-cross--${corner}`}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="6" />
      <path d="M14 0v28M0 14h28" />
    </svg>
  );
}

/** Chapter 9: wash chapter with the giant "let's build.", direct details and the contact form. */
export function Contact() {
  const tel = `tel:${profile.phone.replace(/[^\d+]/g, "")}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="ar-chapter ar-wash ar-section scroll-mt-20 overflow-x-clip"
    >
      <Cross corner="tl" />
      <Cross corner="tr" />
      <Cross corner="bl" />
      <Cross corner="br" />

      <div className="ar-container grid gap-[var(--space-8)] pt-[var(--space-6)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[var(--space-7)]">
        <div className="grid min-w-0 content-start gap-[var(--space-6)]">
          <div className="grid gap-[var(--space-5)]">
            <p className="ar-mono ar-muted m-0" data-appear="rise">
              {contact.kicker}
            </p>
            <h2
              id="contact-title"
              className="m-0 text-[clamp(64px,12vw,180px)] font-extrabold leading-[0.84] tracking-[-0.055em]"
              data-appear="flip"
            >
              {contact.title}
            </h2>
            <p className="m-0 max-w-[52ch] text-[18px] leading-[1.45] text-ink-2" data-appear="rise">
              {contact.lead}
            </p>
          </div>

          <dl className="m-0 grid gap-[var(--space-5)]" data-appear-group="rise">
            <div className="grid gap-2">
              <dt className="ar-mono ar-muted">Email</dt>
              <dd className="m-0 flex flex-wrap items-center gap-x-[var(--space-4)] gap-y-[var(--space-2)]">
                <span className="min-w-0 select-all text-[clamp(20px,2.4vw,28px)] font-medium leading-[1.15] tracking-[-0.02em] [overflow-wrap:anywhere]">
                  {profile.email}
                </span>
                <CopyEmailButton email={profile.email} />
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-[var(--space-5)]">
              <div className="grid content-start gap-2">
                <dt className="ar-mono ar-muted">Phone</dt>
                <dd className="m-0 text-[16px]">
                  <a className="text-inherit underline decoration-1 underline-offset-4 hover:text-pink-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring" href={tel}>
                    {profile.phone}
                  </a>
                </dd>
              </div>
              <div className="grid content-start gap-2">
                <dt className="ar-mono ar-muted">Location</dt>
                <dd className="m-0 text-[16px]">{profile.location}</dd>
              </div>
            </div>
            <div className="grid gap-3">
              <dt className="ar-mono ar-muted">Elsewhere</dt>
              <dd className="m-0">
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a className="ar-pill-link" href={social.href} target="_blank" rel="noreferrer">
                        {social.label}
                        <span className="ar-sr"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div className="min-w-0 self-end" data-appear="rise">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
