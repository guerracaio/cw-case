/**
 * Modelo de precificacao por markup divisor.
 *
 * Todos os percentuais incidem sobre o PRECO DE VENDA, nao sobre o custo.
 * E por isso que o preco e obtido dividindo o custo por (1 - soma dos
 * percentuais), e nao multiplicando o custo por uma margem.
 */

/** Percentuais aplicados sobre o preco de venda. */
export type PriceRates = {
  /** Despesas operacionais rateadas, em % do preco de venda. */
  expenses: number;
  /** Impostos sobre a venda, em % do preco de venda. */
  taxes: number;
  /** Taxa da forma de pagamento, em % do preco de venda. */
  paymentFee: number;
  /** Margem de lucro desejada, em % do preco de venda. */
  margin: number;
};

export type ProductInput = PriceRates & {
  /** Quanto o produto custa para ser comprado ou produzido. */
  unitCost: number;
  /** Embalagem, frete de compra e outros custos por unidade vendida. */
  variableCosts: number;
};

/**
 * No modo servico as despesas operacionais ja entram como custo fixo mensal,
 * entao nao ha percentual de despesas: elas viram parte do custo/hora.
 */
export type ServiceInput = Omit<PriceRates, "expenses"> & {
  /** Aluguel, energia, internet, software: o que o negocio gasta por mes. */
  fixedCosts: number;
  /** Quanto voce quer receber por mes pelo proprio trabalho. */
  ownerPay: number;
  /** Horas por mes realmente vendaveis, ja descontando o tempo nao faturavel. */
  productiveHours: number;
  /** Horas gastas neste servico especifico. */
  serviceHours: number;
  /** Material aplicado no servico. */
  materials: number;
};

export type PriceBreakdown = {
  /** Preco de venda sugerido. */
  price: number;
  /** Custo que entrou na conta, antes dos percentuais. */
  directCost: number;
  /** Valor em reais de cada percentual, dentro do preco final. */
  expenses: number;
  taxes: number;
  paymentFee: number;
  profit: number;
  /** Quantas vezes o preco e maior que o custo. */
  markup: number;
  /** Custo de cada hora de trabalho. Existe apenas no modo servico. */
  hourlyCost?: number;
};

export type PricingErrorCode =
  /** A soma dos percentuais chegou a 100% ou mais: nao sobra preco para o custo. */
  | "percentuais-invalidos"
  /** Custo ausente ou nao positivo. */
  | "custo-invalido"
  /** Horas produtivas no mes ausentes ou nao positivas. */
  | "horas-invalidas";

/**
 * Uniao discriminada: o erro faz parte do tipo de retorno, entao nao existe
 * caminho em que Infinity ou NaN chegue na tela sem ter sido tratado.
 */
export type PriceResult =
  | { ok: true; breakdown: PriceBreakdown }
  | { ok: false; error: PricingErrorCode };
