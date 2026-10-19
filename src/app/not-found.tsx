import Link from "next/link";
import { MotionInit } from "@/components/chrome/MotionInit";

export default function NotFound() {
  return (
    <section className="ar-wash">
      <div className="ar-container grid min-h-[80svh] content-center gap-[var(--space-5)] pt-32 pb-[var(--space-9)]">
        <span className="ar-mono ar-muted">404 — Not found</span>
        <h1 className="m-0 text-[clamp(64px,12vw,180px)] font-extrabold leading-[0.84] tracking-[-0.055em]" data-appear="flip">
          lost the loop.
        </h1>
        <p className="m-0 max-w-[44ch] text-lg leading-[25px] text-ink-2">
          This page doesn&apos;t exist. The work, the notes and the contact form are all on the home page.
        </p>
        <div>
          <Link className="ar-btn ar-btn--primary" href="/">
            Back home
          </Link>
        </div>
      </div>
      <MotionInit />
    </section>
  );
}
