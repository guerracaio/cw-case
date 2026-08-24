import type { Metadata } from "next";

import { PriceCalculator } from "@/components/calculator/price-calculator";
import { Breadcrumb, type Crumb } from "@/components/content/breadcrumb";
import { Faq } from "@/components/content/faq";
import { Steps } from "@/components/content/steps";
import {
  ProductExample,
  ServiceExample,
} from "@/components/content/worked-example";
import { CtaLink } from "@/components/lead/cta-link";
import { LeadForm } from "@/components/lead/lead-form";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonClass } from "@/components/ui/button";
import {
  FAQ,
  HOW_TO_STEPS,
  PAGE,
  PRODUCT_FORMULA,
  SERVICE_FORMULA,
  SERVICE_HOUR_FORMULA,
} from "@/content/calculadora-de-precos";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  webApplicationSchema,
} from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTES, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = buildMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: ROUTES.calculator,
});

const CRUMBS: Crumb[] = [
  { name: "Início", path: ROUTES.home },
  { name: "Calculadora de preço de venda", path: ROUTES.calculator },
];

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 overflow-x-auto rounded-xl bg-neutral-200 p-4 text-sm text-neutral-900">
      {children}
    </p>
  );
}

export default function CalculadoraDePrecosPage() {
  return (
    <>
      <JsonLd
        schema={webApplicationSchema({
          name: PAGE.h1,
          description: PAGE.description,
          path: ROUTES.calculator,
        })}
      />
      <JsonLd schema={breadcrumbSchema(CRUMBS)} />
      <JsonLd
        schema={howToSchema({
          name: "Como calcular o preço de venda",
          description: PAGE.directAnswer,
          steps: HOW_TO_STEPS,
        })}
      />
      <JsonLd schema={faqSchema(FAQ)} />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Breadcrumb items={CRUMBS} />

        <article>
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{PAGE.h1}</h1>

          <p className="mt-4 max-w-3xl text-lg text-neutral-800">
            {PAGE.directAnswer}
          </p>

          <section aria-labelledby="ferramenta" className="mt-10">
            <h2 id="ferramenta" className="text-2xl font-bold">
              Calcule o preço do seu produto ou serviço
            </h2>
            <p className="mt-2 text-neutral-800">
              Preencha os custos e os percentuais que incidem sobre a venda. O
              resultado aparece na hora, com a decomposição de quanto vai para
              custo, imposto, taxa e lucro.
            </p>

            <div className="mt-6">
              <PriceCalculator />
            </div>
          </section>

          <section aria-labelledby="como-calcular" className="mt-14">
            <h2 id="como-calcular" className="text-2xl font-bold">
              Como calcular o preço de venda?
            </h2>
            <p className="mt-3 max-w-3xl text-neutral-800">
              Some todos os custos, some os percentuais que incidem sobre a
              venda, subtraia esse total de 100% e divida o custo pelo resultado.
              O erro mais comum é somar impostos e taxas ao custo: como eles são
              cobrados sobre o preço final, somá-los produz um preço menor do que
              o necessário para fechar a conta.
            </p>
            <Steps />
          </section>

          <section aria-labelledby="formula" className="mt-14">
            <h2 id="formula" className="text-2xl font-bold">
              Fórmula do preço de venda
            </h2>
            <p className="mt-3 max-w-3xl text-neutral-800">
              A fórmula divide o custo pela fatia do preço que sobra depois de
              todos os percentuais. Essa fatia é chamada de divisor.
            </p>
            <Formula>{PRODUCT_FORMULA}</Formula>
            <p className="mt-4 max-w-3xl text-neutral-800">
              Se despesas, impostos, taxa de pagamento e margem somarem 39,5%, o
              divisor é 0,605: cada real de preço tem 60,5 centavos disponíveis
              para cobrir o custo. Quando a soma dos percentuais chega a 100%, o
              divisor zera e não existe preço capaz de fechar a conta.
            </p>
          </section>

          <section aria-labelledby="exemplo" className="mt-14">
            <h2 id="exemplo" className="text-2xl font-bold">
              Exemplo prático
            </h2>
            <div className="mt-6">
              <ProductExample />
            </div>
          </section>

          <section aria-labelledby="servico" className="mt-14">
            <h2 id="servico" className="text-2xl font-bold">
              Como calcular o preço de um serviço?
            </h2>
            <p className="mt-3 max-w-3xl text-neutral-800">
              Em serviço não existe custo de compra: o custo é o seu tempo. O
              primeiro passo é descobrir quanto custa uma hora de trabalho,
              somando os custos fixos do mês ao pró-labore desejado e dividindo
              pelas horas realmente vendáveis.
            </p>
            <Formula>{SERVICE_HOUR_FORMULA}</Formula>
            <p className="mt-4 max-w-3xl text-neutral-800">
              Com o custo por hora em mãos, o preço do serviço sai da mesma
              lógica do produto.
            </p>
            <Formula>{SERVICE_FORMULA}</Formula>
            <ServiceExample />
          </section>

          <section aria-labelledby="faq" className="mt-14">
            <h2 id="faq" className="text-2xl font-bold">
              Perguntas frequentes
            </h2>
            <Faq />
          </section>
        </article>

        <section
          aria-labelledby="cta"
          className="mt-14 rounded-2xl bg-neutral-200 p-6 sm:p-8"
        >
          <h2 id="cta" className="text-2xl font-bold">
            Receba mais conteúdos sobre preço e gestão
          </h2>
          <p className="mt-3 max-w-3xl text-neutral-800">
            Deixe seu contato para receber materiais da InfinitePay sobre
            precificação, margem e organização financeira do seu negócio.
          </p>

          <div className="mt-6">
            <LeadForm />
          </div>

          <p className="mt-8 text-neutral-800">
            Quer receber suas vendas com taxas menores e ver esse lucro crescer?
          </p>
          <p className="mt-3">
            <CtaLink
              href={`${SITE_URL}/`}
              location="calculadora-rodape"
              className={buttonClass("secondary")}
            >
              Conhecer a InfinitePay
            </CtaLink>
          </p>
        </section>
      </main>
    </>
  );
}
