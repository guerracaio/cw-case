import type { MetadataRoute } from "next";

import { ROUTES, absoluteUrl } from "@/lib/seo/site";

/**
 * Somente URLs canonicas, indexaveis e que respondem 200.
 * Sem redirects, sem noindex, sem parametros de tracking.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl(ROUTES.home),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl(ROUTES.calculator),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
