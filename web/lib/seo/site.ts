/**
 * Onde ESTA aplicacao esta publicada.
 *
 * Uma unica fonte para metadata, canonical, sitemap, JSON-LD e imagem de
 * Open Graph, para que nunca divirjam entre si.
 *
 * A resolucao e em cascata:
 *
 *  1. NEXT_PUBLIC_SITE_URL, quando definida, vence sempre. E a saida para
 *     dominio proprio ou para qualquer hospedagem fora da Vercel.
 *  2. VERCEL_PROJECT_PRODUCTION_URL, preenchida automaticamente pela Vercel
 *     em build e em runtime. Aponta para o dominio de producao do projeto
 *     mesmo dentro de um preview deployment, que e o que se quer num
 *     canonical. Vem sem o protocolo.
 *  3. localhost, para desenvolvimento. E melhor que um dominio de producao
 *     como padrao: um canonical apontando para outro site durante o
 *     desenvolvimento passa despercebido justamente por parecer certo.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "InfinitePay";

/**
 * O site real da InfinitePay: o destino do CTA.
 *
 * Fica separado de SITE_URL de proposito. Sao coisas diferentes que por
 * acaso coincidiam enquanto o padrao era o dominio da InfinitePay; assim que
 * a aplicacao passou a se publicar em outro dominio, um CTA baseado em
 * SITE_URL apontaria para a propria pagina.
 */
export const INFINITEPAY_URL = "https://www.infinitepay.io";

/** Caminhos canonicos, com barra final (ver trailingSlash no next.config). */
export const ROUTES = {
  home: "/",
  calculator: "/ferramentas/calculadora-de-precos/",
  caseDoc: "/case/analise-e-roadmap/",
} as const;

export function absoluteUrl(path: string): string {
  return SITE_URL + path;
}
