import {
  calculateProductPrice,
  calculateServicePrice,
} from "@/lib/pricing/calculate";
import { PRODUCT_EXAMPLE, SERVICE_EXAMPLE } from "@/lib/pricing/examples";
import { formatBRL, formatDecimal, formatPercent } from "@/lib/pricing/format";

/**
 * Exemplo prático, renderizado no servidor.
 *
 * Os números saem das MESMAS funções que a calculadora usa, então o exemplo
 * publicado e indexado nunca diverge da ferramenta. Se o exemplo deixar de
 * ser calculável, o build falha em vez de publicar uma tabela errada.
 */

function ratesOf(input: {
  expenses?: number;
  taxes: number;
  paymentFee: number;
  margin: number;
}) {
  const total =
    (input.expenses ?? 0) + input.taxes + input.paymentFee + input.margin;
  return { total, divisor: 1 - total / 100 };
}

function Table({
  caption,
  rows,
}: {
  caption: string;
  rows: Array<[string, string]>;
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-t border-neutral-200">
              <th scope="row" className="py-2 pr-4 text-neutral-800">
                {label}
              </th>
              <td className="py-2 text-right font-medium tabular-nums">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductExample() {
  const result = calculateProductPrice(PRODUCT_EXAMPLE);
  if (!result.ok) {
    throw new Error(
      `Exemplo de produto inválido: ${result.error}. Ajuste PRODUCT_EXAMPLE.`,
    );
  }

  const { breakdown } = result;
  const { total, divisor } = ratesOf(PRODUCT_EXAMPLE);

  return (
    <div>
      <h3 className="font-medium">Exemplo: preço de venda de um produto</h3>
      <p className="mt-2 text-neutral-800">
        Um produto que custa {formatBRL(PRODUCT_EXAMPLE.unitCost)} para ser
        comprado, com {formatBRL(PRODUCT_EXAMPLE.variableCosts)} de embalagem,
        em um negócio com {formatPercent(PRODUCT_EXAMPLE.expenses)} de despesas,{" "}
        {formatPercent(PRODUCT_EXAMPLE.taxes)} de impostos,{" "}
        {formatPercent(PRODUCT_EXAMPLE.paymentFee)} de taxa de pagamento e
        margem de lucro de {formatPercent(PRODUCT_EXAMPLE.margin)}.
      </p>
      <p className="mt-2 text-neutral-800">
        Os percentuais somam {formatPercent(total)}, então sobra{" "}
        {formatDecimal(divisor)} do preço para pagar o custo. A conta é{" "}
        {formatBRL(breakdown.directCost)} dividido por {formatDecimal(divisor)},
        que resulta em <strong className="text-purple-600">{formatBRL(breakdown.price)}</strong>.
      </p>

      <Table
        caption="Composição do preço de venda de um produto"
        rows={[
          ["Custo do produto", formatBRL(PRODUCT_EXAMPLE.unitCost)],
          ["Custos variáveis", formatBRL(PRODUCT_EXAMPLE.variableCosts)],
          ["Custo total", formatBRL(breakdown.directCost)],
          ["Despesas operacionais", formatBRL(breakdown.expenses)],
          ["Impostos", formatBRL(breakdown.taxes)],
          ["Taxa de pagamento", formatBRL(breakdown.paymentFee)],
          ["Lucro", formatBRL(breakdown.profit)],
          ["Preço de venda", formatBRL(breakdown.price)],
          ["Markup sobre o custo", `${formatDecimal(breakdown.markup)}x`],
        ]}
      />
    </div>
  );
}

export function ServiceExample() {
  const result = calculateServicePrice(SERVICE_EXAMPLE);
  if (!result.ok) {
    throw new Error(
      `Exemplo de serviço inválido: ${result.error}. Ajuste SERVICE_EXAMPLE.`,
    );
  }

  const { breakdown } = result;
  const { total, divisor } = ratesOf(SERVICE_EXAMPLE);
  const monthlyNeed = SERVICE_EXAMPLE.fixedCosts + SERVICE_EXAMPLE.ownerPay;

  return (
    <div className="mt-10">
      <h3 className="font-medium">Exemplo: preço de venda de um serviço</h3>
      <p className="mt-2 text-neutral-800">
        Um negócio com {formatBRL(SERVICE_EXAMPLE.fixedCosts)} de custos fixos
        por mês e {formatBRL(SERVICE_EXAMPLE.ownerPay)} de pró-labore precisa
        cobrir {formatBRL(monthlyNeed)} por mês. Dividindo por{" "}
        {formatDecimal(SERVICE_EXAMPLE.productiveHours)} horas produtivas, cada
        hora de trabalho custa{" "}
        <strong className="text-purple-600">{formatBRL(breakdown.hourlyCost ?? 0)}</strong>.
      </p>
      <p className="mt-2 text-neutral-800">
        Em um serviço de {formatDecimal(SERVICE_EXAMPLE.serviceHours)} horas com{" "}
        {formatBRL(SERVICE_EXAMPLE.materials)} de material, o custo direto é{" "}
        {formatBRL(breakdown.directCost)}. Com {formatPercent(total)} de
        impostos, taxa e margem, o preço fica em{" "}
        <strong className="text-purple-600">{formatBRL(breakdown.price)}</strong>.
      </p>

      <Table
        caption="Composição do preço de venda de um serviço"
        rows={[
          ["Custos fixos do mês", formatBRL(SERVICE_EXAMPLE.fixedCosts)],
          ["Pró-labore desejado", formatBRL(SERVICE_EXAMPLE.ownerPay)],
          [
            "Horas produtivas no mês",
            formatDecimal(SERVICE_EXAMPLE.productiveHours),
          ],
          ["Custo por hora", formatBRL(breakdown.hourlyCost ?? 0)],
          ["Custo direto do serviço", formatBRL(breakdown.directCost)],
          ["Impostos", formatBRL(breakdown.taxes)],
          ["Taxa de pagamento", formatBRL(breakdown.paymentFee)],
          ["Lucro", formatBRL(breakdown.profit)],
          ["Preço do serviço", formatBRL(breakdown.price)],
        ]}
      />

      <p className="mt-3 text-sm text-neutral-800">
        Divisor usado: {formatDecimal(divisor)}.
      </p>
    </div>
  );
}
