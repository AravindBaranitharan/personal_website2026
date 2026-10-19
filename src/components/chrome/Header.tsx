import Link from "next/link";
import { nav, profile } from "@/content/site";
import { NavPill } from "./NavPill";

/** Floating NavPill over a top BlurEdge (design system: NavPill, BlurEdge, Pulse). */
export function Header() {
  return (
    <>
      <div className="ar-blur-edge ar-blur-edge--top" style={{ position: "fixed", zIndex: 40 }} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <header
        className="fixed inset-x-0 z-50"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + var(--space-4))" }}
      >
        <div className="ar-container">
          <nav className="grid grid-cols-[1fr_auto_1fr] items-center gap-4" aria-label="Main">
            <Link className="ar-nav__mark col-start-1 justify-self-start max-md:hidden" href="/" aria-label={`${profile.name}, home`}>
              {profile.shortName}
            </Link>
            <div className="col-start-2">
              <NavPill items={nav} />
            </div>
            <span className="ar-mono ar-muted col-start-3 hidden items-center gap-2.5 justify-self-end lg:inline-flex">
              <span className="ar-pulse" aria-hidden="true" />
              {profile.availability}
            </span>
          </nav>
        </div>
      </header>
    </>
  );
}
