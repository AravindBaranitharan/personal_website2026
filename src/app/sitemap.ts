import type { MetadataRoute } from "next";
import { profile, projects } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${profile.siteUrl}/work/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.8 : 0.5,
    })),
  ];
}
