"use client";

import { useRef, useState } from "react";

import { LeadForm } from "@/components/lead/lead-form";
import { useLeadUnlock } from "@/components/lead/use-lead-unlock";
import { buttonClass } from "@/components/ui/button";
import { track } from "@/lib/analytics/track";
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

const ROW_CLASS =
  "flex items-baseline justify-between gap-4 border-t border-neutral-900/15 py-2";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={ROW_CLASS}>
      <dt className="text-sm">{label}</dt>
      <dd className="text-sm font-medium tabular-nums">{value}</dd>
    </div>
  );
}

/**
 * Linhas que compõem o detalhamento, na ordem em que aparecem.
 *
 * A mesma função alimenta a versão real e a bloqueada, então as duas nunca
 * divergem em quantidade ou rótulo: o que a pessoa vê borrado é exatamente o
 * que ela recebe ao liberar.
 */
function detailRows(breakdown: PriceBreakdown): Array<[string, string]> {
  const rows: Array<[string, string]> = [];

  if (breakdown.hourlyCost !== undefined) {
    rows.push(["Custo por hora de trabalho", formatBRL(breakdown.hourlyCost)]);
  }

  rows.push(["Custo", formatBRL(breakdown.directCost)]);

  if (breakdown.expenses > 0) {
    rows.push(["Despesas operacionais", formatBRL(breakdown.expenses)]);
  }

  rows.push(["Impostos", formatBRL(breakdown.taxes)]);
  rows.push(["Taxa de pagamento", formatBRL(breakdown.paymentFee)]);
  rows.push(["Lucro", formatBRL(breakdown.profit)]);
  rows.push(["Markup sobre o custo", `${formatDecimal(breakdown.markup)}x`]);

  return rows;
}

/**
 * Prévia bloqueada.
 *
 * Os valores reais NÃO são renderizados: `blur` em CSS se remove no DevTools
 * em dois segundos, então o bloqueio não pode depender dele. O que vai para o
 * DOM são os rótulos verdadeiros e um marcador no lugar do número.
 *
 * Os rótulos ficam legíveis de propósito: para achar a troca justa, a pessoa
 * precisa saber o que vai receber. Uma área borrada genérica não convence.
 */
function LockedRows({ labels }: { labels: string[] }) {
  return (
    <div aria-hidden="true" className="mt-5 select-none">
      {labels.map((label) => (
        <div key={label} className={ROW_CLASS}>
          <dt className="text-sm">{label}</dt>
          <dd className="text-sm font-medium blur-[3px]">R$ ••••</dd>
        </div>
      ))}
    </div>
  );
}

/**
 * Painel de resultado.
 *
 * Verde limão da marca com texto preto: o verde da InfinitePay tem luminância
 * altíssima e só funciona como superfície, nunca como cor de texto.
 *
 * O preço fica visível nas três fases — bloqueado, formulário e liberado.
 * A contrapartida pelo contato é o detalhamento, nunca a resposta que a
 * pessoa veio buscar.
 */
export function ResultPanel({
  result,
  mode,
}: {
  result: ResultState;
  mode: string;
}) {
  const { unlocked, unlock } = useLeadUnlock();
  const [showForm, setShowForm] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

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
  const rows = detailRows(breakdown);

  function handleOpenForm() {
    track("lead_cta_click", { location: "result-panel", mode });
    setShowForm(true);
  }

  function handleUnlocked() {
    unlock();
    setShowForm(false);
    requestAnimationFrame(() => detailRef.current?.focus());
  }

  return (
    <div className="rounded-2xl bg-green-500 p-6 text-neutral-900">
      <p className="text-sm font-medium">Preço de venda sugerido</p>
      <p className="mt-1 text-4xl font-bold tabular-nums" aria-live="polite">
        {formatBRL(breakdown.price)}
      </p>

      {unlocked ? (
        <div ref={detailRef} tabIndex={-1} className="outline-none">
          <dl className="mt-5">
            {rows.map(([label, value]) => (
              <Row key={label} label={label} value={value} />
            ))}
          </dl>
        </div>
      ) : showForm ? (
        <div className="mt-5 border-t border-neutral-900/15 pt-4">
          <p className="text-sm">
            Informe seus dados para ver quanto do preço é custo, imposto, taxa
            e lucro.
          </p>
          <div className="mt-3">
            <LeadForm
              idPrefix="unlock"
              submitLabel="Ver o detalhamento"
              context={{ mode, price: Math.round(breakdown.price * 100) / 100 }}
              onSuccess={handleUnlocked}
            />
          </div>
        </div>
      ) : (
        <>
          <LockedRows labels={rows.map(([label]) => label)} />

          <p className="mt-4 text-sm">
            Veja para onde vai cada real do seu preço: quanto é custo, imposto,
            taxa de pagamento e lucro.
          </p>

          <button
            type="button"
            onClick={handleOpenForm}
            className={buttonClass("contrast", "mt-3 w-full")}
          >
            Ver o detalhamento
          </button>
        </>
      )}
    </div>
  );
}
