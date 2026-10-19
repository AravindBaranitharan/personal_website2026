import { nav } from "@/content/site";
import { NavPill } from "./NavPill";

/** Dark NavPill, centred, over a top BlurEdge. It sits at the top of the page and scrolls away with the hero. */
export function Header() {
  return (
    <>
      <div className="ar-blur-edge ar-blur-edge--top" style={{ position: "absolute", zIndex: 40 }} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <header
        className="absolute inset-x-0 z-50"
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
