import { nav } from "@/content/site";
import { NavPill } from "./NavPill";

/** Floating dark NavPill, centred, over a top BlurEdge. */
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
          <nav className="flex justify-center" aria-label="Main">
            <NavPill items={nav} />
          </nav>
        </div>
      </header>
    </>
  );
}
