/**
 * Origem canonica do site. Uma unica fonte para metadata, canonical, sitemap
 * e JSON-LD, para que nunca divirjam entre si.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.infinitepay.io"
).replace(/\/$/, "");

export const SITE_NAME = "InfinitePay";

/** Caminhos canonicos, com barra final (ver trailingSlash no next.config). */
export const ROUTES = {
  home: "/",
  calculator: "/ferramentas/calculadora-de-precos/",
} as const;

export function absoluteUrl(path: string): string {
  return SITE_URL + path;
}
