import { notes } from "@/content/site";

/** Chapter 8: the three signature lines over the DotGrid, rising in a stagger. */
export function Notes() {
  return (
    <section
      id="notes"
      aria-labelledby="notes-title"
      className="ar-section relative scroll-mt-20 overflow-hidden bg-band text-ink"
    >
      <canvas className="ar-dots" data-dots data-dot-spacing="20" data-dot-radius="130" aria-hidden="true" />

      <div className="ar-container relative z-[1] grid gap-[var(--space-8)]">
        <h2
          id="notes-title"
          className="m-0 text-[clamp(48px,8vw,112px)] font-bold leading-[0.88] tracking-[-0.045em]"
          data-appear="flip"
        >
          notes.
        </h2>

        <ol
          className="m-0 grid list-none gap-[var(--space-7)] p-0 md:grid-cols-3 md:gap-[var(--space-6)]"
          data-appear-group="rise"
        >
          {notes.map((note, i) => (
            <li key={note.quote} className="grid content-start gap-[var(--space-5)] border-t border-line-strong pt-[var(--space-5)]">
              <span className="ar-mono ar-muted" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <figure className="m-0 grid gap-[var(--space-4)]">
                <blockquote className="m-0">
                  <p className="m-0 max-w-[18ch] text-[clamp(28px,3vw,36px)] font-medium leading-[0.95] tracking-[-0.02em]">
                    &ldquo;{note.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="ar-mono ar-muted">{note.tag}</figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
