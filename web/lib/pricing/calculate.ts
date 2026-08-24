import type {
  PriceBreakdown,
  PriceResult,
  ProductInput,
  ServiceInput,
} from "./types";

/** Fracao do preco que sobra para cobrir o custo, depois dos percentuais. */
function divisorFor(...rates: number[]): number {
  const total = rates.reduce((sum, rate) => sum + rate, 0);
  return 1 - total / 100;
}

function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function breakdownFor(args: {
  price: number;
  directCost: number;
  expenses: number;
  taxes: number;
  paymentFee: number;
  margin: number;
  hourlyCost?: number;
}): PriceBreakdown {
  const { price, directCost, expenses, taxes, paymentFee, margin } = args;

  return {
    price,
    directCost,
    expenses: (price * expenses) / 100,
    taxes: (price * taxes) / 100,
    paymentFee: (price * paymentFee) / 100,
    profit: (price * margin) / 100,
    markup: price / directCost,
    hourlyCost: args.hourlyCost,
  };
}

/**
 * Preco de venda de um produto.
 *
 *   preco = (custo unitario + custos variaveis)
 *           / (1 - (despesas% + impostos% + taxa% + margem%) / 100)
 */
export function calculateProductPrice(input: ProductInput): PriceResult {
  const { unitCost, variableCosts, expenses, taxes, paymentFee, margin } = input;

  const directCost = unitCost + variableCosts;
  if (!isPositive(directCost)) {
    return { ok: false, error: "custo-invalido" };
  }

  const divisor = divisorFor(expenses, taxes, paymentFee, margin);
  if (divisor <= 0) {
    return { ok: false, error: "percentuais-invalidos" };
  }

  return {
    ok: true,
    breakdown: breakdownFor({
      price: directCost / divisor,
      directCost,
      expenses,
      taxes,
      paymentFee,
      margin,
    }),
  };
}

/**
 * Preco de venda de um servico.
 *
 *   custo/hora = (custos fixos do mes + pro-labore) / horas produtivas
 *   preco      = (custo/hora * horas do servico + materiais)
 *                / (1 - (impostos% + taxa% + margem%) / 100)
 */
export function calculateServicePrice(input: ServiceInput): PriceResult {
  const {
    fixedCosts,
    ownerPay,
    productiveHours,
    serviceHours,
    materials,
    taxes,
    paymentFee,
    margin,
  } = input;

  if (!isPositive(productiveHours)) {
    return { ok: false, error: "horas-invalidas" };
  }

  const hourlyCost = (fixedCosts + ownerPay) / productiveHours;
  const directCost = hourlyCost * serviceHours + materials;
  if (!isPositive(directCost)) {
    return { ok: false, error: "custo-invalido" };
  }

  const divisor = divisorFor(taxes, paymentFee, margin);
  if (divisor <= 0) {
    return { ok: false, error: "percentuais-invalidos" };
  }

  return {
    ok: true,
    breakdown: breakdownFor({
      price: directCost / divisor,
      directCost,
      expenses: 0,
      taxes,
      paymentFee,
      margin,
      hourlyCost,
    }),
  };
}
