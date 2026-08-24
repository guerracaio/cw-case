import type { ProductInput, ServiceInput } from "./types";

/**
 * Valores iniciais dos percentuais.
 *
 * Sao pontos de partida plausiveis e editaveis, escolhidos para que a
 * ferramenta ja mostre um resultado coerente assim que a pessoa informa o
 * custo. NAO representam as taxas da InfinitePay nem de nenhum meio de
 * pagamento especifico: a taxa e um campo generico, ajustado pela pessoa
 * conforme a realidade do proprio negocio.
 */
export const PRODUCT_DEFAULTS: ProductInput = {
  unitCost: 0,
  variableCosts: 0,
  expenses: 10,
  taxes: 6,
  paymentFee: 3.5,
  margin: 20,
};

export const SERVICE_DEFAULTS: ServiceInput = {
  fixedCosts: 0,
  ownerPay: 0,
  productiveHours: 160,
  serviceHours: 1,
  materials: 0,
  taxes: 6,
  paymentFee: 3.5,
  margin: 20,
};
