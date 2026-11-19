import type { MetadataRoute } from "next";
import { completedProjects } from "@/lib/content";
import { indexable, siteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  if (!origin || !indexable) return [];
  return ["/", "/services", "/projects", "/about", "/contact",
    ...completedProjects.map((item) => "/projects/" + item.slug)].map((path) => ({ url: origin + path }));
}
