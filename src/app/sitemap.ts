import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { profile, projects } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${profile.siteUrl}/work/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.8 : 0.5,
    })),
    { url: `${profile.siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${profile.siteUrl}/blog/${post.slug}`,
      lastModified: post.published,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
