/**
 * Eventos de conversao definidos no roadmap de SEO + AEO.
 *
 * Observacao: o roadmap grafa "too_complete"; e um typo. Padronizamos
 * "tool_complete".
 *
 * "page_view" nao esta aqui de proposito: o container de GA4/GTM ja emite o
 * page_view sozinho. Criar uma ilha client so para dispara-lo adicionaria
 * JavaScript a uma pagina que precisa do minimo possivel.
 */
export type ConversionEvent =
  | "tool_click"
  | "tool_start"
  | "tool_complete"
  | "lead_cta_click"
  | "lead_generated";

export type EventPayload = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Empurra o evento para o dataLayer.
 *
 * O array e criado se ainda nao existir, entao eventos disparados antes de o
 * container carregar ficam na fila e sao processados quando ele sobe. Sem
 * container configurado, isso e apenas um array em memoria: nenhum script de
 * terceiro entra no caminho critico de renderizacao.
 */
export function track(event: ConversionEvent, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}
