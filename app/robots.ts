import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const url = siteUrl();
  return indexable ? {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(url ? { sitemap: url + "/sitemap.xml" } : {}),
  } : { rules: { userAgent: "*", disallow: "/" } };
}
