import type { MetadataRoute } from "next";
import { subjects } from "@/lib/mock-data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Subject configuration pages — one per subject
  const subjectPages: MetadataRoute.Sitemap = subjects.map((subject) => ({
    url: `${SITE_URL}/quiz/configure?subject=${subject.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...subjectPages];
}
