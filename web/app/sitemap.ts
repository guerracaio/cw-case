import type { MetadataRoute } from "next";

import { ROUTES, absoluteUrl } from "@/lib/seo/site";

/**
 * Somente URLs canonicas, indexaveis e que respondem 200.
 * Sem redirects, sem parametros de tracking.
 *
 * O documento do case (ROUTES.caseDoc) e indexavel e nao esta aqui de
 * proposito: nao ha por que oferece-lo a busca junto das paginas que
 * precisam ranquear. Ausencia no sitemap nao e diretiva — nao impede
 * indexacao, so nao a convida. Ver o comentario na propria pagina.
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
