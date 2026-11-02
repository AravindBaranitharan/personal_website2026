import type { Metadata } from "next";
import Link from "next/link";
import { MotionInit } from "@/components/chrome/MotionInit";
import { blog, posts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: blog.lead,
  alternates: { canonical: "/blog" },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => b.published.localeCompare(a.published));

  return (
    <>
      <section aria-labelledby="blog-title" className="ar-wash">
        <div className="ar-container grid gap-[var(--space-5)] pb-[var(--space-8)] pt-[calc(var(--nav-height)+var(--space-9))]">
          <p className="ar-mono ar-muted m-0">{blog.kicker}</p>
          <h1 id="blog-title" data-appear="flip" className="m-0 text-[clamp(72px,14vw,200px)] font-extrabold leading-[0.84] tracking-[-0.06em]">
            {blog.title}
          </h1>
          <p className="m-0 max-w-[48ch] text-[18px] leading-[1.5]" data-appear="rise">
            {blog.lead}
          </p>
        </div>
      </section>

      <section aria-label="Posts" className="bg-paper">
        <div className="ar-container ar-section">
          <ol className="ar-index" data-appear-group="rise">
            {sorted.map((post, i) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="ar-row">
                  <span className="ar-row__num">{String(sorted.length - i).padStart(2, "0")}</span>
                  <span className="grid gap-[var(--space-2)]">
                    <span className="ar-row__title not-italic lowercase">{post.title}.</span>
                    <span className="max-w-[60ch] text-[15px] leading-[1.45] text-ink-muted">{post.dek}</span>
                  </span>
                  <span className="ar-row__meta">
                    <time dateTime={post.published}>{dateFormat.format(new Date(post.published))}</time>
                    <br />
                    {post.readingMinutes} min read
                  </span>
                  <span className="ar-btn ar-btn--secondary ar-btn--sm" aria-hidden="true">
                    Read
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <MotionInit />
    </>
  );
}
