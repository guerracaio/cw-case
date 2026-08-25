import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "./site";

/**
 * Monta a metadata de uma pagina publica.
 *
 * Centralizado para que canonical, Open Graph e title nunca divirjam entre
 * si, e para que as paginas satelite herdem o mesmo padrao.
 */
export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  /**
   * Tira a pagina do indice. Serve para conteudo que precisa estar publicado
   * e acessivel por link, mas nao deve competir na busca nem diluir o tema do
   * site. Uma pagina com noindex tambem nao entra no sitemap.
   */
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
          },
        },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
