import type { ReactNode } from "react";
import type { Block } from "@/content/blog";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

// Inline markup: **bold**, *italic*, `code`, [label](href). Content is authored in blog.ts, never user input.
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export function Inline({ text }: { text: string }): ReactNode {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} className="rounded-[6px] bg-surface-sunk px-[0.35em] py-[0.1em] font-mono text-[0.86em]">
          {part.slice(1, -1)}
        </code>
      );
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const external = link[2].startsWith("http");
      return (
        <a
          key={i}
          href={link[2]}
          className="text-ink underline decoration-pink decoration-2 underline-offset-[3px] transition-colors hover:bg-pink-pale"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {link[1]}
        </a>
      );
    }
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

const prose = "m-0 text-[18px] leading-[1.6] text-ink-2";

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case "lead":
      return (
        <p key={key} className="m-0 text-[clamp(20px,2.1vw,24px)] font-medium leading-[1.45] tracking-[-0.01em] text-ink">
          <Inline text={block.text} />
        </p>
      );
    case "p":
      return (
        <p key={key} className={prose}>
          <Inline text={block.text} />
        </p>
      );
    case "h2":
      return (
        <h2
          key={key}
          id={block.id}
          className="group m-0 mt-[var(--space-7)] scroll-mt-[var(--space-8)] border-t border-line-strong pt-[var(--space-5)] text-[clamp(30px,3.6vw,44px)] font-bold lowercase leading-[0.98] tracking-[-0.035em] text-ink"
        >
          <a href={`#${block.id}`} className="no-underline">
            {block.text}
            <span className="ml-3 align-middle font-mono text-[14px] text-pink-ink opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
              #
            </span>
          </a>
        </h2>
      );
    case "h3":
      return (
        <h3 key={key} className="m-0 text-[22px] font-semibold tracking-[-0.02em]">
          {block.text}
        </h3>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag key={key} className="m-0 grid list-none gap-[var(--space-3)] p-0">
          {block.items.map((item, i) => (
            <li key={i} className={`${prose} grid grid-cols-[32px_minmax(0,1fr)] gap-[var(--space-2)]`}>
              <span className="pt-[5px] font-mono text-[12px] text-pink-ink" aria-hidden="true">
                {block.ordered ? String(i + 1).padStart(2, "0") : "▪"}
              </span>
              <span>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <figure key={key} className="m-0 border-l-4 border-pink py-[var(--space-2)] pl-[var(--space-5)]">
          <blockquote className="m-0">
            <p className="m-0 text-[clamp(22px,2.4vw,28px)] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
              <Inline text={block.text} />
            </p>
          </blockquote>
          {block.cite && <figcaption className="ar-mono ar-muted mt-[var(--space-3)]">{block.cite}</figcaption>}
        </figure>
      );
    case "callout":
      return (
        <aside key={key} className="grid gap-[var(--space-3)] rounded-[var(--radius-md)] bg-night p-[var(--space-6)] text-on-night">
          <p className="ar-mono m-0 text-lilac">{block.label}</p>
          <p className="m-0 text-[20px] leading-[1.45] [&_strong]:text-pink-strong">
            <Inline text={block.text} />
          </p>
        </aside>
      );
    case "stats":
      return (
        <div key={key} className="grid gap-[var(--space-5)] sm:grid-cols-3">
          {block.items.map((s) => (
            <div key={s.label} className="grid content-start gap-[var(--space-3)] border-t border-line-strong pt-[var(--space-4)]">
              <span className="text-[clamp(44px,5vw,64px)] font-bold leading-[0.9] tracking-[-0.04em] tabular-nums">{s.value}</span>
              <span className="text-[14px] leading-[1.4] text-ink-muted">{s.label}</span>
            </div>
          ))}
        </div>
      );
    case "steps":
      return (
        <ol key={key} className="m-0 grid list-none gap-0 p-0">
          {block.items.map((s) => (
            <li key={s.num} className="grid gap-[var(--space-2)] border-t border-line py-[var(--space-5)] sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-[var(--space-4)]">
              <span className="font-mono text-[13px] text-pink-ink">{s.num}</span>
              <div className="grid gap-[var(--space-2)]">
                <h3 className="m-0 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em]">{s.title}</h3>
                <p className={prose}>
                  <Inline text={s.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "diagram":
      return (
        // Breaks out of the reading column so the figure has room.
        <div key={key} className="md:-mx-[var(--space-8)]">
          <ArchitectureDiagram caption={block.caption} />
        </div>
      );
  }
}

export function PostBody({ blocks }: { blocks: Block[] }) {
  return <div className="grid gap-[var(--space-5)]">{blocks.map(renderBlock)}</div>;
}
