import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb, type Crumb } from "@/components/content/breadcrumb";
import { AiSummary } from "@/components/doc/ai-summary";
import { PartAnalise } from "@/components/doc/part-analise";
import { PartPadrao } from "@/components/doc/part-padrao";
import { PartRoadmap } from "@/components/doc/part-roadmap";
import {
  Callout,
  Code,
  Eyebrow,
  H3,
  PartHeading,
  Stat,
  Stats,
  TD,
  TH,
  TableWrap,
} from "@/components/doc/prose";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/site";

const TITLE = "Análise e roadmap SEO + AEO";
const DESCRIPTION =
  "Como o dataset foi analisado, por que a calculadora de preços foi a ferramenta escolhida e o que fazer nos primeiros 90 dias depois de publicá-la.";

/*
  Indexavel, mas fora do sitemap. Sao duas coisas diferentes, e a distincao e
  a decisao aqui.

  Esta pagina era `noindex`, para nao competir com a calculadora pelo tema do
  site. O custo apareceu depois: `noindex` nao serve so ao Google. Parte dos
  crawlers de IA le a diretiva e desiste da pagina, e este documento existe
  justamente para ser lido por quem chega pelo link — inclusive por um
  assistente. Uma pagina que se recusa a ser lida nao entrega o proprio
  conteudo.

  A prioridade do projeto continua sendo a rastreabilidade da calculadora. O
  que preserva isso agora e a ausencia do sitemap, somada a ausencia de link
  interno apontando para ca: sem nenhum dos dois caminhos, a busca praticamente
  nao descobre esta URL sozinha. E omissao, nao proibicao — a diferenca e que
  quem tem o endereco entra.
*/
export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: ROUTES.caseDoc,
});

const CRUMBS: Crumb[] = [
  { name: "Início", path: ROUTES.home },
  { name: TITLE, path: ROUTES.caseDoc },
];

type TocItem = {
  id: string;
  label: string;
  level: "part" | "sub";
};

const TOC: TocItem[] = [
  { id: "sumario-executivo", label: "Sumário executivo", level: "part" },
  { id: "parte-1", label: "Parte 1 · A análise", level: "part" },
  { id: "fonte-de-dados", label: "1.1 Fonte de dados", level: "sub" },
  { id: "ferramentas", label: "1.2 Ferramentas e divisão de trabalho", level: "sub" },
  { id: "etapas", label: "1.3 As seis etapas", level: "sub" },
  { id: "decisao", label: "1.4 A decisão e sua evidência", level: "sub" },
  { id: "limitacoes", label: "1.5 Limitações e vieses", level: "sub" },
  { id: "parte-2", label: "Parte 2 · O padrão de publicação", level: "part" },
  { id: "checklist-seo", label: "2.1 Checklist SEO", level: "sub" },
  { id: "checklist-aeo", label: "2.2 Checklist AEO", level: "sub" },
  { id: "medicao", label: "2.3 O que medir desde o início", level: "sub" },
  { id: "parte-3", label: "Parte 3 · O roadmap dos 90 dias", level: "part" },
  { id: "visao-geral", label: "3.1 Visão geral", level: "sub" },
  { id: "fase-1", label: "3.2 Fase 1 · Ativos e ferramenta", level: "sub" },
  { id: "fase-2", label: "3.3 Fase 2 · Expandir cobertura", level: "sub" },
  { id: "fase-3", label: "3.4 Fase 3 · Autoridade", level: "sub" },
  { id: "fase-4", label: "3.5 Fase 4 · CRO", level: "sub" },
  { id: "apendice", label: "Apêndice · Reproduzir", level: "part" },
];

/**
 * Indice do documento.
 *
 * Sao links reais, ancorados em ids que existem no HTML do primeiro response.
 * Nao ha destaque da secao corrente durante a rolagem: isso exigiria uma ilha
 * client so para um efeito decorativo, o que esta pagina nao justifica.
 */
function TocList({ dense = false }: { dense?: boolean }) {
  return (
    <ol className={dense ? "flex flex-col gap-1" : "flex flex-col gap-0.5"}>
      {TOC.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={
              item.level === "part"
                ? `block ${dense ? "" : "border-l-2 border-neutral-200"} px-3 py-1 text-sm font-medium text-neutral-900 hover:underline`
                : `block ${dense ? "" : "border-l-2 border-neutral-200"} py-1 pr-3 ${dense ? "pl-4" : "pl-6"} text-sm text-neutral-800 hover:underline`
            }
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Atalho para o modo Apresentação.
 *
 * Fica acima do índice porque é uma escolha de formato, não um destino dentro
 * do texto: quem abre este documento para apresentá-lo decide isso antes de
 * começar a ler.
 */
function PresentationLink({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTES.caseDocPresentation}
      className={`flex items-center justify-between gap-3 rounded-xl bg-neutral-900 px-4 py-3 text-white hover:bg-neutral-800 ${className ?? ""}`}
    >
      <span>
        <span className="block text-[11px] font-medium tracking-[0.14em] text-green-500 uppercase">
          Modo apresentação
        </span>
        <span className="mt-0.5 block text-xs text-white/80">
          Só os números, tabelas e etapas
        </span>
      </span>
      <span aria-hidden="true" className="text-lg leading-none">
        →
      </span>
    </Link>
  );
}

export default function CaseDocPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-14">
        <aside className="hidden lg:block">
          <nav
            aria-label="Índice do documento"
            className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pb-10"
          >
            <PresentationLink className="mb-6" />
            <p className="mb-3 text-[11px] font-medium tracking-[0.14em] text-neutral-800 uppercase">
              Neste documento
            </p>
            <TocList />
            <AiSummary className="mt-6" />
          </nav>
        </aside>

        <article className="min-w-0">
          <Breadcrumb items={CRUMBS} />

          <header className="mt-8">
            <Eyebrow>Case técnico · Technical SEO &amp; AI Growth Builder</Eyebrow>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {TITLE}
            </h1>
            <p className="mt-3 text-xl font-medium text-neutral-800">
              Calculadora de preços de produtos e serviços
            </p>
            <p className="mt-5 text-lg text-neutral-800">
              Este documento cobre o caminho inteiro: como o dataset foi
              analisado, por que a calculadora de preços foi a ferramenta
              escolhida e o que fazer nos primeiros 90 dias depois de
              publicá-la.
            </p>

            <Callout label="Nota de escopo">
              <p>
                A análise usa um dataset fornecido no case, com concorrentes
                fictícios e janela de 6 meses. As limitações estão em{" "}
                <a href="#limitacoes" className="text-purple-600 hover:underline">
                  1.5
                </a>{" "}
                e mudam o peso de mais de uma conclusão.
              </p>
            </Callout>
          </header>

          {/*
            No celular o indice fica recolhido — sao 18 itens antes do texto
            comecar. O bloco de resumo por IA fica aberto: e uma escolha de uma
            linha, util justamente para quem nao vai rolar o documento inteiro.
          */}
          <details className="mt-8 rounded-xl border border-neutral-400 px-4 lg:hidden">
            <summary className="cursor-pointer py-3 text-sm font-medium">
              Neste documento
            </summary>
            <nav aria-label="Índice do documento" className="pb-4">
              <TocList dense />
            </nav>
          </details>

          <PresentationLink className="mt-4 lg:hidden" />

          <AiSummary className="mt-4 lg:hidden" />

          {/* --------------------- sumário executivo --------------------- */}

          <H3 id="sumario-executivo">Sumário executivo</H3>

          <p className="mt-4">
            <strong>O achado.</strong> Dentro de um universo de 1.558.773 buscas
            mensais, o cluster de <em>precificação, custos e margens</em>{" "}
            concentra uma demanda que pede uma ferramenta e recebe apenas
            artigos. No recorte de 21 keywords que uma calculadora de preços
            atenderia — 41.040 buscas/mês —,{" "}
            <strong>97,9% do volume não tem ranking da InfinitePay</strong> e{" "}
            <strong>nenhuma calculadora de preço foi identificada</strong> entre
            os concorrentes: uma única ferramenta explícita em 32 páginas
            relevantes. A dificuldade é baixa (KD mediano 6,0) e as páginas que
            ocupam as posições são fracas (UR mediano 11, 2 domínios de
            referência).
          </p>

          <p className="mt-4">
            <strong>A decisão.</strong> Construir a{" "}
            <strong>calculadora de preços de produtos e serviços</strong> em{" "}
            <Code>/ferramentas/calculadora-de-precos/</Code>, como página que é
            ferramenta e documento indexável ao mesmo tempo. Ela venceu seis
            outras hipóteses num score que combina demanda, gap, aderência de
            formato, aderência de negócio e esforço.
          </p>

          <p className="mt-4">
            <strong>O tamanho da aposta e o ponto de largada.</strong> As 21
            keywords do escopo movimentam{" "}
            <strong>5.342 visitas/mês estimadas</strong> entre os concorrentes —
            cerca de{" "}
            <strong>45% de todo o tráfego orgânico atual da InfinitePay</strong>{" "}
            (12.000 visitas/mês). E o domínio chega com <strong>DR 68</strong>,
            acima de cinco dos seis concorrentes do recorte. Nenhum desses
            números é previsão de captura; juntos, dão a ordem de grandeza da
            oportunidade e a posição de largada.
          </p>

          <p className="mt-4">
            <strong>O plano.</strong> Quatro fases em 90 dias: construir os
            ativos de aquisição e a ferramenta; expandir a cobertura para
            serviços e casos por profissão; ganhar autoridade e dobrar a aposta
            no que mostrar tração; e otimizar a conversão. Ao fim da Fase 2,{" "}
            <strong>95,4% do volume do escopo tem uma URL dedicada</strong>.
          </p>

          <Stats>
            <Stat value="41.040" label="buscas/mês no escopo" />
            <Stat
              value="5.342"
              label="visitas/mês estimadas no escopo — 45% do tráfego atual do site"
            />
            <Stat value="97,9%" label="de gap SEO ponderado por volume" />
            <Stat value="100%" label="de gap funcional — nenhuma calculadora" />
            <Stat value="6,0" label="de KD mediano" />
            <Stat
              value="DR 68"
              label="do domínio-alvo, contra 51,5 de DR mediano dos concorrentes"
            />
            <Stat value="11 + 1" label="páginas satélite e a ferramenta" />
            <Stat value="95,4%" label="de cobertura ao fim da Fase 2" />
          </Stats>

          <div className="mt-20">
            <PartAnalise />
          </div>

          <div className="mt-20">
            <PartPadrao />
          </div>

          <div className="mt-20">
            <PartRoadmap />
          </div>

          {/* --------------------------- apêndice --------------------------- */}

          <div className="mt-20">
            <PartHeading
              id="apendice"
              label="Apêndice"
              title="Como reproduzir a análise"
            />

            <p className="mt-6">
              Os relatórios são regeneráveis a partir dos CSVs intocados:
            </p>

            <pre className="mt-4 overflow-x-auto rounded-xl bg-neutral-200 p-4 text-sm text-neutral-900">
              <code>
                {`python generators/generate_demand_maps.py
python generators/generate_utility_fit_report.py
python generators/generate_shortlist_report.py
python generators/generate_pricing_gap_report.py`}
              </code>
            </pre>

            <p className="mt-4">
              Os scripts produzem mais artefatos intermediários do que os cinco
              mantidos em <Code>outputs/seo-demand-maps/</Code>; os nomes dos
              arquivos finais receberam prefixo numérico manualmente, na ordem
              de leitura da análise.
            </p>

            <p className="mt-4">
              Para auditar as classificações sem ler os scripts:{" "}
              <Code>cluster_assignments.json</Code> traz o cluster atribuído a
              cada keyword, e <Code>utility_fit_assessment.json</Code>, a nota
              de utility fit e o formato recomendado de cada cluster.
            </p>

            <TableWrap>
              <thead>
                <tr>
                  <th className={TH}>Script</th>
                  <th className={TH}>Relatório que produz</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}>
                    <Code>generate_demand_maps.py</Code>
                  </td>
                  <td className={TD}>
                    <Code>01_mapa_mercado.md</Code>
                  </td>
                </tr>
                <tr>
                  <td className={TD}>
                    <Code>generate_utility_fit_report.py</Code>
                  </td>
                  <td className={TD}>
                    <Code>02_mapa_conteudo_utilitario_mercado.md</Code> ·{" "}
                    <Code>03_relatorio_fit_conteudo_utilitario.md</Code>
                  </td>
                </tr>
                <tr>
                  <td className={TD}>
                    <Code>generate_shortlist_report.py</Code>
                  </td>
                  <td className={TD}>
                    <Code>04_relatorio_shortlist_ferramentas.md</Code>
                  </td>
                </tr>
                <tr>
                  <td className={TD}>
                    <Code>generate_pricing_gap_report.py</Code>
                  </td>
                  <td className={TD}>
                    <Code>05_relatorio_gap_calculadora_precos.md</Code>
                  </td>
                </tr>
              </tbody>
            </TableWrap>
          </div>
        </article>
      </div>
    </main>
  );
}
