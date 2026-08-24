const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const decimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compact = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

/** O arredondamento monetario acontece so aqui, na apresentacao. */
export function formatBRL(value: number): string {
  return currency.format(value);
}

export function formatDecimal(value: number): string {
  return decimal.format(value);
}

/** 20 vira "20%", 3.5 vira "3,5%". */
export function formatPercent(value: number): string {
  return compact.format(value) + "%";
}

/**
 * Le um numero digitado em portugues.
 *
 * Havendo virgula, ela e o separador decimal e os pontos sao milhar
 * ("1.234,56"). Sem virgula, um ponto que separa grupos de tres digitos
 * tambem e milhar ("1.234" e mil duzentos e trinta e quatro, nao 1,234);
 * qualquer outro ponto e decimal ("1234.56", "40.5"), que e como muita gente
 * digita no teclado do celular.
 *
 * O sinal de menos e descartado: nenhum campo da calculadora (custo, horas,
 * percentual) admite valor negativo.
 */
const THOUSANDS_ONLY = /^\d{1,3}(\.\d{3})+$/;

export function parseAmount(raw: string): number | null {
  const cleaned = raw.trim().replace(/[^\d.,]/g, "");
  if (cleaned === "") return null;

  let normalized: string;
  if (cleaned.includes(",")) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (THOUSANDS_ONLY.test(cleaned)) {
    normalized = cleaned.replace(/\./g, "");
  } else {
    normalized = cleaned;
  }

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/** Numero como ele aparece dentro de um campo: 10 vira "10", 3.5 vira "3,5". */
export function formatFieldValue(value: number): string {
  return compact.format(value);
}
