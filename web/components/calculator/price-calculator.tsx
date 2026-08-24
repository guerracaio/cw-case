"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  ResultPanel,
  type ResultState,
} from "@/components/calculator/result-panel";
import { Field } from "@/components/ui/field";
import { track } from "@/lib/analytics/track";
import {
  calculateProductPrice,
  calculateServicePrice,
} from "@/lib/pricing/calculate";
import { PRODUCT_DEFAULTS, SERVICE_DEFAULTS } from "@/lib/pricing/defaults";
import { formatFieldValue, parseAmount } from "@/lib/pricing/format";
import type { ProductInput, ServiceInput } from "@/lib/pricing/types";

const TOOL_ID = "calculadora-de-precos";

type Mode = "produto" | "servico";

/**
 * O formulário guarda strings, não números: o valor exibido é exatamente o que
 * a pessoa digitou, e a conversão pt-BR acontece só na hora de calcular.
 */
type ProductForm = Record<keyof ProductInput, string>;
type ServiceForm = Record<keyof ServiceInput, string>;

const PRODUCT_INITIAL: ProductForm = {
  unitCost: "",
  variableCosts: "",
  expenses: formatFieldValue(PRODUCT_DEFAULTS.expenses),
  taxes: formatFieldValue(PRODUCT_DEFAULTS.taxes),
  paymentFee: formatFieldValue(PRODUCT_DEFAULTS.paymentFee),
  margin: formatFieldValue(PRODUCT_DEFAULTS.margin),
};

const SERVICE_INITIAL: ServiceForm = {
  fixedCosts: "",
  ownerPay: "",
  productiveHours: formatFieldValue(SERVICE_DEFAULTS.productiveHours),
  serviceHours: formatFieldValue(SERVICE_DEFAULTS.serviceHours),
  materials: "",
  taxes: formatFieldValue(SERVICE_DEFAULTS.taxes),
  paymentFee: formatFieldValue(SERVICE_DEFAULTS.paymentFee),
  margin: formatFieldValue(SERVICE_DEFAULTS.margin),
};

const toNumber = (value: string): number => parseAmount(value) ?? 0;
const isBlank = (value: string): boolean => parseAmount(value) === null;

function modeButtonClass(active: boolean): string {
  return [
    "rounded-full px-5 py-2 text-sm font-medium transition-colors",
    active
      ? "bg-neutral-900 text-white"
      : "text-neutral-800 hover:bg-neutral-200",
  ].join(" ");
}

export function PriceCalculator() {
  const [mode, setMode] = useState<Mode>("produto");
  const [product, setProduct] = useState<ProductForm>(PRODUCT_INITIAL);
  const [service, setService] = useState<ServiceForm>(SERVICE_INITIAL);

  const interacted = useRef(false);
  const started = useRef(false);
  const completed = useRef(false);

  const isProduct = mode === "produto";

  const productResult = useMemo(
    () =>
      calculateProductPrice({
        unitCost: toNumber(product.unitCost),
        variableCosts: toNumber(product.variableCosts),
        expenses: toNumber(product.expenses),
        taxes: toNumber(product.taxes),
        paymentFee: toNumber(product.paymentFee),
        margin: toNumber(product.margin),
      }),
    [product],
  );

  const serviceResult = useMemo(
    () =>
      calculateServicePrice({
        fixedCosts: toNumber(service.fixedCosts),
        ownerPay: toNumber(service.ownerPay),
        productiveHours: toNumber(service.productiveHours),
        serviceHours: toNumber(service.serviceHours),
        materials: toNumber(service.materials),
        taxes: toNumber(service.taxes),
        paymentFee: toNumber(service.paymentFee),
        margin: toNumber(service.margin),
      }),
    [service],
  );

  // Enquanto nenhum custo foi informado o painel fica neutro, em vez de acusar
  // erro por algo que a pessoa ainda nem teve chance de preencher.
  const isEmpty = isProduct
    ? isBlank(product.unitCost) && isBlank(product.variableCosts)
    : isBlank(service.fixedCosts) && isBlank(service.ownerPay);

  const activeResult = isProduct ? productResult : serviceResult;

  const resultState: ResultState = isEmpty
    ? { state: "empty" }
    : activeResult.ok
      ? { state: "ready", breakdown: activeResult.breakdown }
      : { state: "error", error: activeResult.error };

  useEffect(() => {
    if (completed.current) return;
    if (resultState.state !== "ready") return;

    completed.current = true;
    track("tool_complete", { tool: TOOL_ID, mode });
  }, [resultState.state, mode]);

  function registerInteraction() {
    if (interacted.current) return;
    interacted.current = true;
    track("tool_click", { tool: TOOL_ID, mode });
  }

  function registerStart() {
    if (started.current) return;
    started.current = true;
    track("tool_start", { tool: TOOL_ID, mode });
  }

  function updateProduct(key: keyof ProductForm, value: string) {
    registerStart();
    setProduct((current) => ({ ...current, [key]: value }));
  }

  function updateService(key: keyof ServiceForm, value: string) {
    registerStart();
    setService((current) => ({ ...current, [key]: value }));
  }

  return (
    <div
      onPointerDown={registerInteraction}
      onFocusCapture={registerInteraction}
      className="rounded-2xl border border-neutral-200 p-5 sm:p-8"
    >
      <div
        role="group"
        aria-label="Tipo de precificação"
        className="inline-flex rounded-full border border-neutral-200 p-1"
      >
        <button
          type="button"
          aria-pressed={isProduct}
          onClick={() => setMode("produto")}
          className={modeButtonClass(isProduct)}
        >
          Produto
        </button>
        <button
          type="button"
          aria-pressed={!isProduct}
          onClick={() => setMode("servico")}
          className={modeButtonClass(!isProduct)}
        >
          Serviço
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="grid gap-4 sm:grid-cols-2">
          {isProduct ? (
            <>
              <Field
                id="unit-cost"
                label="Custo do produto"
                unitLabel="reais"
                prefix="R$"
                value={product.unitCost}
                onChange={(value) => updateProduct("unitCost", value)}
                hint="Quanto você paga para comprar ou produzir uma unidade."
              />
              <Field
                id="variable-costs"
                label="Custos variáveis"
                unitLabel="reais"
                prefix="R$"
                value={product.variableCosts}
                onChange={(value) => updateProduct("variableCosts", value)}
                hint="Embalagem, frete e o que mais sai a cada venda."
              />
              <Field
                id="expenses"
                label="Despesas operacionais"
                unitLabel="por cento"
                suffix="%"
                value={product.expenses}
                onChange={(value) => updateProduct("expenses", value)}
                hint="Contas do mês como percentual do faturamento."
              />
              <Field
                id="taxes"
                label="Impostos"
                unitLabel="por cento"
                suffix="%"
                value={product.taxes}
                onChange={(value) => updateProduct("taxes", value)}
              />
              <Field
                id="payment-fee"
                label="Taxa de pagamento"
                unitLabel="por cento"
                suffix="%"
                value={product.paymentFee}
                onChange={(value) => updateProduct("paymentFee", value)}
                hint="Percentual descontado pelo meio de pagamento."
              />
              <Field
                id="margin"
                label="Margem de lucro"
                unitLabel="por cento"
                suffix="%"
                value={product.margin}
                onChange={(value) => updateProduct("margin", value)}
              />
            </>
          ) : (
            <>
              <Field
                id="fixed-costs"
                label="Custos fixos do mês"
                unitLabel="reais"
                prefix="R$"
                value={service.fixedCosts}
                onChange={(value) => updateService("fixedCosts", value)}
                hint="Aluguel, energia, internet, software."
              />
              <Field
                id="owner-pay"
                label="Pró-labore desejado"
                unitLabel="reais"
                prefix="R$"
                value={service.ownerPay}
                onChange={(value) => updateService("ownerPay", value)}
                hint="Quanto você quer receber por mês pelo seu trabalho."
              />
              <Field
                id="productive-hours"
                label="Horas produtivas no mês"
                unitLabel="horas"
                value={service.productiveHours}
                onChange={(value) => updateService("productiveHours", value)}
                hint="Só as horas realmente vendáveis, sem deslocamento e administração."
              />
              <Field
                id="service-hours"
                label="Horas deste serviço"
                unitLabel="horas"
                value={service.serviceHours}
                onChange={(value) => updateService("serviceHours", value)}
              />
              <Field
                id="materials"
                label="Materiais"
                unitLabel="reais"
                prefix="R$"
                value={service.materials}
                onChange={(value) => updateService("materials", value)}
                hint="Material aplicado neste serviço."
              />
              <Field
                id="service-taxes"
                label="Impostos"
                unitLabel="por cento"
                suffix="%"
                value={service.taxes}
                onChange={(value) => updateService("taxes", value)}
              />
              <Field
                id="service-payment-fee"
                label="Taxa de pagamento"
                unitLabel="por cento"
                suffix="%"
                value={service.paymentFee}
                onChange={(value) => updateService("paymentFee", value)}
              />
              <Field
                id="service-margin"
                label="Margem de lucro"
                unitLabel="por cento"
                suffix="%"
                value={service.margin}
                onChange={(value) => updateService("margin", value)}
              />
            </>
          )}
        </div>

        <ResultPanel result={resultState} mode={mode} />
      </div>
    </div>
  );
}
