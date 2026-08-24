"use client";

import { formatBRL, formatDecimal } from "@/lib/pricing/format";
import type { PriceBreakdown, PricingErrorCode } from "@/lib/pricing/types";

const ERROR_MESSAGES: Record<PricingErrorCode, string> = {
  "percentuais-invalidos":
    "Os percentuais somam 100% ou mais do preço. Nesse cenário não existe preço possível: reduza a margem, os impostos, as despesas ou a taxa de pagamento.",
  "custo-invalido": "Informe um custo maior que zero para ver o preço.",
  "horas-invalidas":
    "Informe quantas horas produtivas você tem no mês para calcular o custo por hora.",
};

export type ResultState =
  | { state: "empty" }
  | { state: "error"; error: PricingErrorCode }
  | { state: "ready"; breakdown: PriceBreakdown };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-neutral-900/15 py-2">
      <dt className="text-sm">{label}</dt>
      <dd className="text-sm font-medium tabular-nums">{value}</dd>
    </div>
  );
}

/**
 * Painel de resultado.
 *
 * Verde limao da marca com texto preto: o verde da InfinitePay tem luminancia
 * altissima e so funciona como superficie, nunca como cor de texto.
 *
 * E a unica superficie em green-500 da pagina. O CTA primario tambem usa esse
 * verde, mas fica em outra secao, longe daqui: dois green-500 disputando
 * atencao na mesma dobra quebrariam a hierarquia.
 */
export function ResultPanel({ result }: { result: ResultState }) {
  if (result.state === "empty") {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-400 p-6 text-center text-sm text-neutral-800">
        Preencha os custos para ver o preço de venda sugerido.
      </div>
    );
  }

  if (result.state === "error") {
    return (
      <div
        role="alert"
        className="rounded-2xl bg-neutral-200 p-6 text-sm text-neutral-900"
      >
        {ERROR_MESSAGES[result.error]}
      </div>
    );
  }

  const { breakdown } = result;

  return (
    <div className="rounded-2xl bg-green-500 p-6 text-neutral-900">
      <p className="text-sm font-medium">Preço de venda sugerido</p>
      <p
        className="mt-1 text-4xl font-bold tabular-nums"
        aria-live="polite"
      >
        {formatBRL(breakdown.price)}
      </p>

      <dl className="mt-5">
        {breakdown.hourlyCost !== undefined ? (
          <Row
            label="Custo por hora de trabalho"
            value={formatBRL(breakdown.hourlyCost)}
          />
        ) : null}
        <Row label="Custo" value={formatBRL(breakdown.directCost)} />
        {breakdown.expenses > 0 ? (
          <Row label="Despesas operacionais" value={formatBRL(breakdown.expenses)} />
        ) : null}
        <Row label="Impostos" value={formatBRL(breakdown.taxes)} />
        <Row label="Taxa de pagamento" value={formatBRL(breakdown.paymentFee)} />
        <Row label="Lucro" value={formatBRL(breakdown.profit)} />
        <Row label="Markup sobre o custo" value={formatDecimal(breakdown.markup) + "x"} />
      </dl>
    </div>
  );
}
