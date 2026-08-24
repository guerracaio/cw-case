import type { ProductInput, ServiceInput } from "./types";

/**
 * Entradas do exemplo pratico publicado na pagina.
 *
 * O Server Component do exemplo passa estes valores pelas mesmas funcoes que
 * a calculadora usa, entao o exemplo indexado nunca diverge da ferramenta.
 */
export const PRODUCT_EXAMPLE: ProductInput = {
  unitCost: 40,
  variableCosts: 5,
  expenses: 10,
  taxes: 6,
  paymentFee: 3.5,
  margin: 20,
};

export const SERVICE_EXAMPLE: ServiceInput = {
  fixedCosts: 2500,
  ownerPay: 3500,
  productiveHours: 120,
  serviceHours: 2,
  materials: 30,
  taxes: 6,
  paymentFee: 3.5,
  margin: 20,
};
