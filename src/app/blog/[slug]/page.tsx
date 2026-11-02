import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionInit } from "@/components/chrome/MotionInit";
import { Feedback } from "@/components/blog/Feedback";
import { DisplayText, PostBody } from "@/components/blog/PostBody";
import { ShareBar } from "@/components/blog/ShareBar";
import { getConcepts, getPost, posts } from "@/content/blog";
import { profile } from "@/content/site";

// Every slug is prerendered. The article is static; ratings and comments load in the browser from /api/blog/[slug].
export const instant = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = `${post.title[0].toUpperCase()}${post.title.slice(1)}`;
  return {
    title,
    description: post.dek,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description: post.dek,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published,
      authors: [profile.name],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description: post.dek },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${profile.siteUrl}/blog/${post.slug}`;
  const concepts = getConcepts(post);
  const shareTitle = `${post.title[0].toUpperCase()}${post.title.slice(1)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: shareTitle,
    description: post.dek,
    datePublished: post.published,
    author: { "@type": "Person", name: profile.name, url: profile.siteUrl },
    url,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <article aria-labelledby="post-title" className="bg-paper text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="ar-wash">
          <div className="ar-container grid gap-[var(--space-5)] pb-[var(--space-8)] pt-[calc(var(--nav-height)+var(--space-9))]">
            <Link href="/blog" className="ar-bracket">
              All posts
            </Link>
            <p className="ar-mono ar-muted m-0 mt-[var(--space-6)]">
              <time dateTime={post.published}>{dateFormat.format(new Date(post.published))}</time> · {post.readingMinutes} min read · {profile.name}
            </p>
            <h1
              id="post-title"
              data-appear="flip"
              className="m-0 max-w-[14ch] text-[clamp(56px,10vw,152px)] font-extrabold lowercase leading-[0.86] tracking-[-0.055em] [overflow-wrap:anywhere]"
            >
              <DisplayText text={post.title} />.
            </h1>
            <p className="m-0 max-w-[48ch] text-[clamp(18px,1.8vw,22px)] leading-[1.45]" data-appear="rise">
              {post.dek}
            </p>
            <ul className="ar-chips m-0 list-none p-0" aria-label="Topics">
              {post.tags.map((tag) => (
                <li key={tag} className="ar-chip">
                  {tag}
                </li>
              ))}
            </ul>
            <div className="mt-[var(--space-3)] flex flex-wrap items-center gap-[var(--space-3)]">
              <ShareBar title={shareTitle} dek={post.dek} url={url} />
              <a href="#feedback" className="ar-bracket ml-[var(--space-2)]">
                Rate &amp; discuss
              </a>
            </div>
          </div>
        </header>

        <div className="ar-container grid gap-[var(--space-8)] py-[var(--space-8)] md:py-[var(--space-9)] lg:grid-cols-12">
          {/* Contents: sticky on wide screens */}
          <nav aria-label="In this post" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-[var(--space-8)] grid gap-[var(--space-3)]">
              <p className="ar-mono ar-muted m-0">In this post</p>
              <ol className="m-0 grid list-none gap-[var(--space-2)] p-0">
                {concepts.map((c, i) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`} className="group grid grid-cols-[28px_minmax(0,1fr)] text-[14px] leading-[1.35] text-ink-2 no-underline hover:text-ink">
                      <span className="font-mono text-[11px] leading-[19px] text-ink-soft group-hover:text-pink-ink">{String(i + 1).padStart(2, "0")}</span>
                      <span>{c.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="grid min-w-0 gap-[var(--space-8)] lg:col-span-8 lg:col-start-5">
            <div className="max-w-[68ch]">
              <PostBody blocks={post.blocks} />
            </div>

            <footer className="grid gap-[var(--space-4)] rounded-[var(--radius-md)] bg-night p-[var(--space-6)] text-on-night">
              <p className="ar-mono m-0 text-lilac">Found this useful?</p>
              <p className="m-0 max-w-[36ch] text-[clamp(24px,2.6vw,32px)] font-medium leading-[1.1] tracking-[-0.02em]">
                Send it to someone building agents, then tell me what I got wrong.
              </p>
              <div className="ar-on-night flex flex-wrap items-center gap-[var(--space-3)] bg-transparent">
                <ShareBar title={shareTitle} dek={post.dek} url={url} compact />
              </div>
            </footer>
          </div>
        </div>
      </article>

      <Feedback slug={post.slug} concepts={concepts} />
      <MotionInit />
    </>
  );
}
