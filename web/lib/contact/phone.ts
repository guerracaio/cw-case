/**
 * Telefone brasileiro: formatação e validação.
 *
 * Funções puras, sem React e sem biblioteca de máscara. Um campo de telefone
 * não justifica uma dependência client-side.
 */

/** Só os dígitos, limitados ao tamanho de um número com DDD. */
function digitsOf(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  // Número copiado do WhatsApp vem com o código do país ("+55 11 98765-4321").
  // Sem isto, o 55 seria lido como DDD e empurraria o número inteiro. A
  // checagem de comprimento protege o DDD 55 legítimo (Santa Maria/RS), que
  // nunca passa de 11 dígitos sozinho.
  if (digits.length > 11 && digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  return digits.slice(0, 11);
}

/**
 * Formata conforme a pessoa digita: "11" vira "(11", "1199999" vira
 * "(11) 99999". Aceita fixo de 10 dígitos e celular de 11.
 */
export function formatPhoneBR(raw: string): string {
  const digits = digitsOf(raw);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;

  const area = digits.slice(0, 2);
  const rest = digits.slice(2);

  // O ponto de corte muda com o tamanho: 5+4 no celular, 4+4 no fixo.
  const splitAt = rest.length > 8 ? 5 : 4;

  if (rest.length <= splitAt) return `(${area}) ${rest}`;

  return `(${area}) ${rest.slice(0, splitAt)}-${rest.slice(splitAt)}`;
}

/**
 * Aceita 10 dígitos (fixo) ou 11 (celular), sempre com DDD.
 *
 * DDDs brasileiros começam em 11, então um primeiro dígito menor que 1 ou um
 * DDD abaixo de 11 é erro de digitação, não número válido.
 */
export function isValidPhoneBR(raw: string): boolean {
  const digits = digitsOf(raw);

  if (digits.length !== 10 && digits.length !== 11) return false;
  if (Number(digits.slice(0, 2)) < 11) return false;

  // Celular no Brasil sempre começa com 9 depois do DDD.
  if (digits.length === 11 && digits[2] !== "9") return false;

  return true;
}

/** Formato E.164, o que um CRM ou API de WhatsApp espera receber. */
export function toE164BR(raw: string): string {
  return `+55${digitsOf(raw)}`;
}
