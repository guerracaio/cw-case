export type Lead = {
  name: string;
  email: string;
  /** WhatsApp em E.164 (+5511999999999). */
  phone: string;
  /** De onde o lead veio, por exemplo "calculadora-de-precos". */
  source: string;
  /** Contexto util para qualificar o lead: modo usado, faixa de preco etc. */
  context?: Record<string, string | number>;
};

export type SubmitLeadResult = { ok: true } | { ok: false; error: string };

/**
 * Contrato de captura de lead.
 *
 * A pagina e um mockup de alta fidelidade: o fluxo completo funciona na tela,
 * mas o lead nao e persistido. Nao ha Route Handler, banco, fila nem CRM.
 * A integracao real entra exatamente aqui, sem que nenhum componente precise
 * mudar; o resto da aplicacao so conhece esta assinatura.
 */
export async function submitLead(lead: Lead): Promise<SubmitLeadResult> {
  // >>> PONTO DE INTEGRACAO <<<
  // Substituir por POST /api/lead (ou chamada direta ao CRM) mantendo o
  // mesmo retorno. Enquanto isso, o lead nao e persistido em lugar nenhum.
  if (process.env.NODE_ENV !== "production") {
    console.info("[lead] capturado (sem persistencia)", lead);
  }

  return { ok: true };
}
