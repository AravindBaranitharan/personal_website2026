import { ImageResponse } from "next/og";
import { getPost, posts } from "@/content/blog";
import { profile } from "@/content/site";

// The preview card WhatsApp, LinkedIn and X show when the post is shared.
export const alt = "Blog post by Aravind Baranitharan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post ? `${post.title.toLowerCase()}.` : "blog.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#0b0b0b",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Architecture motif: a ring of nodes in the site palette */}
        <div style={{ position: "absolute", right: -80, top: -80, width: 520, height: 520, borderRadius: 999, border: "2px dashed #ff2dab", display: "flex" }} />
        <div style={{ position: "absolute", right: 70, top: 70, width: 220, height: 220, borderRadius: 999, background: "#ff2dab", display: "flex" }} />
        <div style={{ position: "absolute", right: 380, top: 230, width: 44, height: 44, borderRadius: 999, background: "#d4ff3f", display: "flex" }} />
        <div style={{ position: "absolute", right: 300, top: 40, width: 28, height: 28, borderRadius: 999, background: "#d4ff3f", display: "flex" }} />

        <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: "#d4ff3f" }}>
          {profile.shortName} · blog
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 800, lineHeight: 0.9, letterSpacing: -6, maxWidth: 900 }}>{title}</div>
          {post && <div style={{ display: "flex", fontSize: 30, lineHeight: 1.3, color: "#c9c9c9", maxWidth: 900 }}>{post.dek}</div>}
        </div>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "#8d8d8d" }}>
          {profile.name} · AI Engineer
        </div>
      </div>
    ),
    size,
  );
}
