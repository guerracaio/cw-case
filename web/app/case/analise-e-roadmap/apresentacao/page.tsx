import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { GeminiLogo, OpenAiLogo } from "@/components/doc/ai-logos";
import { CheckIcon } from "@/components/doc/prose";
import {
  Big,
  SHI,
  SNUM,
  STD,
  STH,
  Slide,
  SlideTable,
} from "@/components/doc/slide";
import {
  CHECKLIST_AEO,
  CHECKLIST_SEO,
  DOMINIO_ALVO,
  ETAPAS,
  EVENTOS,
  FASE_1_PAGINAS,
  FASE_2_PAGINAS,
  FONTES,
  NUMEROS,
  ROADMAP,
} from "@/content/case/analise-e-roadmap";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/site";

/*
  Modo Apresentação do documento — a mesma análise reduzida a números, tabelas
  e entidades visuais, um assunto por tela.

  A ordem segue o roteiro da gravação, não a do documento: capa e decisão
  primeiro, depois o dataset, as etapas, os números, o padrão, o roadmap, a
  arquitetura e por fim a ferramenta. Quem apresenta abre com a conclusão; quem
  lê o documento chega nela pelo caminho.

  Canonical apontando para o documento, e não para si mesma. As duas URLs
  carregam o mesmo conteúdo em dois formatos; o canonical consolida o sinal na
  versão completa, que é a que responde a uma busca. Por isso também não entra
  no sitemap: é uma apresentação, não uma página que disputa a SERP.

  Sem `noindex`: a lição da própria página do documento é que a diretiva não
  fala só com o Google, e um assistente que receba este link precisa conseguir
  ler o que está aqui.
*/
export const metadata: Metadata = {
  ...buildMetadata({
    title: "Apresentação · Análise e roadmap SEO + AEO",
    description:
      "Os números, tabelas e etapas da análise em formato de apresentação: uma tela por assunto.",
    path: ROUTES.caseDocPresentation,
  }),
  alternates: { canonical: ROUTES.caseDoc },
};

/** Rótulo de seção dentro de um slide. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.14em] text-neutral-800 uppercase">
      {children}
    </p>
  );
}

/**
 * Lista de verificação com a marca de conferido no lugar do ponto — o mesmo
 * tratamento do documento. O ícone diz algo verdadeiro sobre a lista: são
 * checklists item a item, não enumerações quaisquer.
 */
function Checks({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 text-xs text-neutral-800 sm:text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <CheckIcon className="mt-[0.3em] size-3 shrink-0 text-purple-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Os quatro blocos, e o slide em que cada um começa. */
const BLOCOS = [
  { label: "A análise", href: "#slide-2" },
  { label: "O padrão de publicação", href: "#slide-5" },
  { label: "O roadmap", href: "#slide-6" },
  { label: "A ferramenta", href: "#slide-8" },
];

export default function ApresentacaoPage() {
  return (
    /*
      `fixed inset-0` cobre o header e o rodapé do layout global. Eles seguem
      no HTML — o que importa para quem lê a página sem renderizar CSS —, mas
      não aparecem na gravação, onde cada slide precisa da tela inteira.

      O snap vive neste contêiner, e não no documento, porque a raiz é do
      layout: mudá-la afetaria todas as outras páginas.
    */
    <main className="fixed inset-0 z-50 h-[100svh] snap-y snap-mandatory overflow-y-auto overscroll-contain bg-white">
      {/* ---------------------------- 01 · capa ---------------------------- */}
      <Slide
        n={1}
        tone="dark"
        cover
        above={
          <Image
            src="/brand/logo-horizontal-white.png"
            alt="InfinitePay"
            width={146}
            height={30}
            priority
          />
        }
        eyebrow="Case técnico · Technical SEO & AI Growth Builder"
        title="Calculadora de preços de produtos e serviços"
        lede="A ferramenta escolhida, os dados que levaram até ela e o plano dos primeiros 90 dias."
      >
        {/*
          Os quatro blocos da apresentação. São links de âncora para o slide em
          que cada bloco começa — visualmente idênticos a rótulos, mas levam a
          algum lugar, que é o que a capa precisa oferecer no lugar das setas.
        */}
        <nav aria-label="Blocos da apresentação" className="flex flex-wrap gap-2">
          {BLOCOS.map((b, i) => (
            <a
              key={b.label}
              href={b.href}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                i === 0
                  ? "bg-green-500 text-neutral-900 hover:bg-green-300"
                  : "bg-white/12 text-white hover:bg-white/20"
              }`}
            >
              {b.label}
            </a>
          ))}
        </nav>
      </Slide>

      {/* -------------------- 02 · o dataset e o pipeline -------------------- */}
      <Slide
        n={2}
        eyebrow="A fonte"
        title="Três CSVs intocados, e uma agregação que se regenera"
        lede="Os arquivos estão no repositório exatamente como recebidos. A janela é de 6 meses: um recorte temporal, não a série histórica."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <SlideTable>
              <thead>
                <tr>
                  <th className={STH}>arquivo em dataset/</th>
                  <th className={`${STH} ${SNUM}`}>linhas</th>
                  <th className={STH}>o que traz</th>
                </tr>
              </thead>
              <tbody>
                {FONTES.map(([arquivo, linhas, traz]) => (
                  <tr key={arquivo}>
                    <td className={`${STD} font-mono text-neutral-900`}>
                      {arquivo}
                    </td>
                    <td className={`${STD} ${SNUM}`}>{linhas}</td>
                    <td className={STD}>{traz}</td>
                  </tr>
                ))}
              </tbody>
            </SlideTable>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {DOMINIO_ALVO.map(([valor, rotulo]) => (
                <Big key={rotulo} value={valor} label={rotulo} tone="outline" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-200 p-5 sm:p-6">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl bg-white text-neutral-900"
            >
              <OpenAiLogo className="size-5" />
            </span>

            <h3 className="mt-4 text-base font-bold sm:text-lg">
              Codex como pipeline de dados
            </h3>

            <p className="mt-2 text-xs text-neutral-800 sm:text-sm">
              Usado para <strong>agrupar, filtrar, ordenar e sumarizar</strong> o
              dataset — encurtar o tempo entre a pergunta e o número que a
              responde.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium sm:text-xs">
              <span className="rounded-full bg-white px-3 py-1 font-mono">
                dataset/*.csv
              </span>
              <span aria-hidden="true" className="text-purple-600">
                →
              </span>
              <span className="rounded-full bg-white px-3 py-1 font-mono">
                generators/*.py
              </span>
              <span aria-hidden="true" className="text-purple-600">
                →
              </span>
              <span className="rounded-full bg-green-500 px-3 py-1 font-mono text-neutral-900">
                outputs/*.md
              </span>
            </div>

            <p className="mt-4 text-xs text-neutral-800 sm:text-sm">
              O que ele produziu foram os <strong>scripts Python</strong>, não os
              números. Cada relatório em Markdown é regenerável a partir dos
              CSVs — <strong>nenhum dado de entrada foi alterado</strong>.
            </p>

            <p className="mt-3 text-xs text-neutral-800 sm:text-sm">
              A separação é deliberada: o relatório é artefato determinístico,
              não um resumo que a IA escreveu de memória. Se a agregação
              estiver errada, o erro está no script — e é inspecionável.
            </p>

            <div className="mt-4 flex items-center gap-3 border-t border-neutral-400 pt-4">
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-neutral-900"
              >
                <GeminiLogo className="size-4" />
              </span>
              <p className="text-xs text-neutral-800">
                O Gemini entrou só onde o dataset é mudo: um{" "}
                <em>deep research</em> sobre PMEs no Brasil virou o ICP usado
                para as notas de business fit.
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* --------------------------- 03 · as etapas --------------------------- */}
      <Slide
        n={3}
        eyebrow="O método"
        title="Seis etapas — cada uma é uma pergunta, e a resposta abre a seguinte"
      >
        <SlideTable>
          <thead>
            <tr>
              <th className={`${STH} w-8`}>#</th>
              <th className={STH}>Etapa</th>
              <th className={STH}>Pergunta</th>
              <th className={STH}>O que a resposta decidiu</th>
            </tr>
          </thead>
          <tbody>
            {ETAPAS.map(([n, nome, pergunta, conclusao, decidiu]) => (
              <tr key={n} className={decidiu ? SHI : undefined}>
                <td className={STD}>{n}</td>
                <td className={`${STD} font-medium text-neutral-900`}>{nome}</td>
                <td className={STD}>{pergunta}</td>
                <td className={STD}>{conclusao}</td>
              </tr>
            ))}
          </tbody>
        </SlideTable>

        <p className="mt-5 max-w-4xl text-xs text-neutral-800 sm:text-sm">
          <strong>O achado que mudou o critério está na etapa 2.</strong>{" "}
          Precificação marca só 3% de sinal explícito de utilidade — quase
          ninguém digita &ldquo;calculadora&rdquo; — e ainda assim é nota 5,
          porque &ldquo;quanto cobrar por um bolo&rdquo; é uma tarefa de cálculo
          escrita em linguagem natural. Priorizar pela palavra usada na busca
          teria descartado o cluster vencedor.
        </p>
      </Slide>

      {/* --------------------- 04 · os números da decisão --------------------- */}
      <Slide
        n={4}
        eyebrow="A evidência"
        title="Os números que sustentaram a escolha"
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {NUMEROS.map((n, i) => (
            <Big
              key={n.value + n.label}
              value={n.value}
              label={n.label}
              tone={i === 0 ? "green" : "light"}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <p className="text-xs text-neutral-800 sm:text-sm">
            <strong>O escopo.</strong> 21 keywords, 41.040 buscas/mês. A
            cobertura atual da InfinitePay é uma keyword, na posição 34, e é um
            artigo — não uma ferramenta. Uma única ferramenta explícita aparece
            em 32 páginas concorrentes relevantes.
          </p>
          <p className="text-xs text-neutral-800 sm:text-sm">
            <strong>A posição de largada.</strong> DR 68 contra 51,5 de mediana
            no grupo, com as páginas ocupantes em UR mediano 11. A demanda não
            está protegida por autoridade: o custo de entrada é essencialmente o
            custo de publicar bem.
          </p>
        </div>
      </Slide>

      {/* ---------------------- 05 · o padrão e a medição ---------------------- */}
      <Slide
        n={5}
        eyebrow="Parte 2 · O padrão de publicação"
        title="A definição de pronto — para as onze satélites e para a ferramenta"
        lede="Estas listas não são tarefa de um mês. Elas valem em todas as fases, e é por isso que ficam entre a análise e o roadmap: sem elas, cada fase reinventa o próprio critério de qualidade."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {/*
            O checklist de SEO tem 13 itens curtos. Em coluna única ele fica
            quase o dobro da altura dos outros dois e desalinha o slide; em
            duas subcolunas os três cards terminam juntos.
          */}
          <div className="rounded-2xl bg-neutral-200 p-5 sm:p-6">
            <Label>2.1 · Checklist SEO</Label>
            <div className="mt-4 grid gap-x-6 sm:grid-cols-2">
              <Checks items={CHECKLIST_SEO.slice(0, 7)} />
              <Checks items={CHECKLIST_SEO.slice(7)} />
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-200 p-5 sm:p-6">
            <Label>2.2 · Checklist AEO</Label>
            <div className="mt-4">
              <Checks items={CHECKLIST_AEO} />
            </div>
          </div>

          {/*
            O card inteiro era verde. Passou a cinza com uma única linha verde:
            o destaque é o evento que fecha o funil, e dois verdes na mesma
            dobra anulam um ao outro.

            `site_cta_click` sai da lista e vira nota — ele existe justamente
            por NÃO pertencer ao funil de lead.
          */}
          <div className="rounded-2xl bg-neutral-200 p-5 sm:p-6">
            <Label>2.3 · O que medir desde o início</Label>
            <ul className="mt-4 flex flex-col gap-1.5">
              {EVENTOS.filter(([e]) => e !== "site_cta_click").map(
                ([evento, quando]) => {
                  const fim = evento === "lead_generated";
                  return (
                    <li
                      key={evento}
                      className={`flex items-center justify-between gap-3 rounded-full px-3.5 py-2 text-xs ${
                        fim
                          ? "bg-green-500 font-medium text-neutral-900"
                          : "bg-white text-neutral-900"
                      }`}
                    >
                      <span>{quando}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] whitespace-nowrap ${
                          fim
                            ? "bg-neutral-900 text-white"
                            : "bg-purple-0 text-purple-600"
                        }`}
                      >
                        {evento}
                      </span>
                    </li>
                  );
                },
              )}
            </ul>

            <p className="mt-4 text-xs text-neutral-800">
              <strong className="text-neutral-900">
                Os eventos entram na Fase 1, não na Fase 4.
              </strong>{" "}
              Otimizar um funil que ninguém instrumentou é adivinhar.
            </p>

            <p className="mt-2 text-xs text-neutral-800">
              Mais <span className="font-mono">site_cta_click</span> para
              cliques que levam para fora do site — um clique de saída não
              pertence ao funil de lead.
            </p>
          </div>
        </div>
      </Slide>

      {/* ---------------------------- 06 · o roadmap ---------------------------- */}
      <Slide
        n={6}
        eyebrow="Parte 3 · Os 90 dias"
        title="Aquisição primeiro, conversão depois"
        lede="Sem tráfego não há o que otimizar, e sem dado de tração a priorização vira palpite. As Fases 3 e 4 correm juntas porque atacam pontas opostas do mesmo funil."
      >
        <SlideTable>
          <thead>
            <tr>
              <th className={`${STH} w-32`}>Janela</th>
              <th className={`${STH} w-56`}>Fase e objetivo</th>
              <th className={STH}>O que fazer</th>
            </tr>
          </thead>
          <tbody>
            {ROADMAP.map((fase) => (
              <tr key={fase.nome} className={fase.paralelo ? SHI : undefined}>
                <td className={`${STD} whitespace-nowrap`}>
                  {fase.janela}
                  {fase.paralelo ? (
                    <span className="mt-1 block text-[10px] opacity-70">
                      em paralelo
                    </span>
                  ) : null}
                </td>
                <td className={STD}>
                  <strong className="block text-neutral-900">
                    {fase.nome}
                  </strong>
                  <span className="mt-0.5 block">{fase.objetivo}</span>
                </td>
                <td className={STD}>
                  <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                    {fase.acoes.map((acao) => (
                      <li
                        key={acao}
                        className="relative pl-4 before:absolute before:top-[0.5em] before:left-0 before:size-1.5 before:rounded-full before:bg-purple-600"
                      >
                        {acao}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </SlideTable>
      </Slide>

      {/* ------------------------- 07 · a arquitetura ------------------------- */}
      <Slide
        n={7}
        eyebrow="Fases 1 e 2 · A arquitetura publicada"
        title="Onze satélites e a ferramenta, definidas por intenção e keyword"
        lede="Cada satélite leva CTA para a calculadora e link interno para as outras. A ferramenta é o destino de conversão do cluster inteiro."
      >
        <SlideTable>
          <thead>
            <tr>
              <th className={`${STH} w-8`}>#</th>
              <th className={STH}>URL</th>
              <th className={STH}>Keywords-alvo</th>
              <th className={`${STH} ${SNUM}`}>Volume</th>
              <th className={STH}>Formato</th>
              <th className={STH}>Fase</th>
            </tr>
          </thead>
          <tbody>
            {FASE_1_PAGINAS.map(([n, url, kws, vol, formato, ferramenta]) => (
              <tr key={url} className={ferramenta ? SHI : undefined}>
                <td className={STD}>{n}</td>
                <td className={`${STD} font-mono text-[11px] text-neutral-900`}>
                  {url}
                </td>
                <td className={`${STD} font-mono text-[10px]`}>{kws}</td>
                <td className={`${STD} ${SNUM}`}>{vol}</td>
                <td className={STD}>{formato}</td>
                <td className={STD}>1</td>
              </tr>
            ))}
            {FASE_2_PAGINAS.map(([n, url, kws, vol, formato]) => (
              <tr key={url}>
                <td className={STD}>{n}</td>
                <td className={`${STD} font-mono text-[11px] text-neutral-900`}>
                  {url}
                </td>
                <td className={`${STD} font-mono text-[10px]`}>{kws}</td>
                <td className={`${STD} ${SNUM}`}>{vol}</td>
                <td className={STD}>{formato}</td>
                <td className={STD}>2</td>
              </tr>
            ))}
          </tbody>
        </SlideTable>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Big value="24.530" label="buscas cobertas ao fim da Fase 1" tone="outline" />
          <Big value="95,4%" label="do volume do escopo ao fim da Fase 2 — 39.150 de 41.040" tone="green" />
          <Big value="1.890" label="buscas residuais, em modelos específicos de negócio" tone="outline" />
        </div>
      </Slide>

      {/* --------------------------- 08 · a página --------------------------- */}
      <Slide
        n={8}
        eyebrow="A ferramenta"
        title="Por que esta URL, este título e esta ordem"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-neutral-200 p-5 sm:p-6">
            <Label>A URL</Label>
            <p className="mt-3 font-mono text-xs font-bold text-neutral-900 sm:text-sm">
              /ferramentas/calculadora-de-precos/
            </p>
            <p className="mt-3 text-xs text-neutral-800 sm:text-sm">
              O diretório <span className="font-mono">/ferramentas/</span> abre
              espaço para as próximas sem reorganizar nada. Slug curto, sem stop
              word, sem data. A barra final é a forma canônica e o formato sem
              barra responde 308.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-200 p-5 sm:p-6">
            <Label>O título</Label>
            <p className="mt-3 text-sm font-bold text-neutral-900 sm:text-base">
              Calculadora de preço de venda
            </p>
            <p className="mt-3 text-xs text-neutral-800 sm:text-sm">
              O H1 é a keyword-alvo como ela é digitada — singular, sem
              adjetivo. O <span className="font-mono">&lt;title&gt;</span>{" "}
              estende para &ldquo;para produtos e serviços&rdquo;, cobrindo os
              dois modos sem competir consigo mesmo.
            </p>
          </div>

          <div className="rounded-2xl bg-green-500 p-5 text-neutral-900 sm:p-6">
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase opacity-70">
              A ordem
            </p>
            <p className="mt-3 text-sm font-bold sm:text-base">
              Ferramenta no topo, conteúdo abaixo
            </p>
            <p className="mt-3 text-xs sm:text-sm">
              Quem veio pelo cálculo resolve na primeira dobra. Quem veio pela
              dúvida encontra fórmula, passos, exemplo numérico e FAQ logo em
              seguida — e cada H2 é uma pergunta real de busca, não um rótulo.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-neutral-900 p-5 text-white sm:p-6">
          <p className="text-xs sm:text-sm">
            <strong>A mesma URL trabalha duas vezes.</strong> Como{" "}
            <strong>ferramenta</strong>, gera uso recorrente, tempo de
            permanência e link natural. Como <strong>documento</strong> —
            fórmula, exemplo numérico, passos e FAQ em texto —, responde à SERP e
            é citável por answer engine. Um artigo faz só a segunda metade; um
            app em JavaScript, só a primeira.
          </p>
        </div>
      </Slide>

      {/* ------------------------ 09 · SEO técnico e AEO ------------------------ */}
      <Slide
        n={9}
        eyebrow="A ferramenta"
        title="O teste que decide se a página está pronta"
        lede="Desligue o JavaScript e recarregue. Se um crawler que não executa JS não entende o que a página faz, qual é a fórmula, como calcular passo a passo e quais são as respostas das FAQs, a página não está pronta."
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <Label>A regra de decisão</Label>
            <ol className="mt-3 flex flex-col gap-2 text-xs text-neutral-800 sm:text-sm">
              <li>
                <strong className="text-neutral-900">Static-first.</strong>{" "}
                Todas as rotas são estáticas. Sem SSR, sem{" "}
                <span className="font-mono">dynamic</span>, sem{" "}
                <span className="font-mono">cookies()</span>.
              </li>
              <li>
                <strong className="text-neutral-900">Server-first.</strong>{" "}
                Server Component é o padrão. A página nunca é{" "}
                <span className="font-mono">&quot;use client&quot;</span>.
              </li>
              <li>
                <strong className="text-neutral-900">
                  Client só onde precisa.
                </strong>{" "}
                Uma ilha: a calculadora e o formulário de lead.
              </li>
            </ol>

            <div className="mt-4 rounded-2xl bg-green-500 p-5 text-neutral-900">
              <p className="text-sm font-bold">A fórmula existe uma vez só</p>
              <p className="mt-2 text-xs sm:text-sm">
                O cálculo vive em funções puras que a ilha client importa{" "}
                <em>e</em> o Server Component do exemplo prático também, em build
                time. O exemplo publicado nunca diverge do que a ferramenta
                calcula.
              </p>
            </div>
          </div>

          <div>
            <Label>No HTML do primeiro response</Label>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs">
              {[
                "H1 e hierarquia de headings",
                "Resposta direta antes da dobra",
                "Fórmula como texto legível",
                "Exemplo numérico em tabela",
                "Passos em lista ordenada",
                "FAQ com pergunta e resposta",
                "Links internos como links reais",
                "Canonical, robots e Open Graph",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-neutral-200 px-3 py-1.5 text-neutral-900"
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-4 text-xs text-neutral-800 sm:text-sm">
              <strong>Nada disso depende de hydration</strong>, de{" "}
              <span className="font-mono">useEffect</span>, de fetch no client,
              de clique, de scroll ou de accordion aberto. O FAQ usa{" "}
              <span className="font-mono">&lt;details&gt;</span> nativo: fechado
              na tela, presente no HTML.
            </p>

            <div className="mt-5">
              <Label>Structured data server-rendered</Label>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs">
                {["WebApplication", "BreadcrumbList", "HowTo", "FAQPage"].map(
                  (s) => (
                    <span
                      key={s}
                      className="rounded-full bg-purple-0 px-3 py-1.5 font-mono text-purple-600"
                    >
                      {s}
                    </span>
                  ),
                )}
              </div>
              <p className="mt-3 text-xs text-neutral-800 sm:text-sm">
                O conteúdo mora em <span className="font-mono">content/</span>{" "}
                como dado tipado, e o schema sai da mesma fonte que o texto na
                tela — então é impossível marcar o que não está visível.
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* ------------------------- 10 · a lead bridge ------------------------- */}
      <Slide
        n={10}
        tone="purple"
        eyebrow="A ferramenta"
        title="Entregar a resposta, cobrar pelo aprofundamento"
        lede="Quem chegou buscando “quanto cobrar” recebe o preço sem pedágio. A contrapartida pelo contato é o detalhamento — quanto do preço é custo, imposto, taxa e lucro."
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="rounded-2xl bg-green-500 p-5 text-neutral-900">
            <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-medium text-white">
              bloqueado
            </span>
            <p className="mt-3 text-[11px] font-medium">
              Preço de venda sugerido
            </p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">
              R$ 74,38
            </p>
            <dl className="mt-3 flex flex-col gap-1.5 text-[11px]">
              {["Custo", "Impostos", "Lucro"].map((l) => (
                <div
                  key={l}
                  className="flex justify-between border-t border-neutral-900/15 pt-1.5"
                >
                  <dt>{l}</dt>
                  <dd aria-hidden="true" className="blur-[2px]">
                    R$ ••••
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 rounded-full bg-neutral-900 py-2 text-center text-[11px] font-medium text-white">
              Ver o detalhamento
            </p>
          </div>

          <div className="rounded-2xl bg-green-500 p-5 text-neutral-900">
            <span className="inline-flex rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-medium text-white">
              liberado
            </span>
            <p className="mt-3 text-[11px] font-medium">
              Preço de venda sugerido
            </p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">
              R$ 74,38
            </p>
            <dl className="mt-3 flex flex-col gap-1.5 text-[11px] tabular-nums">
              {[
                ["Custo", "R$ 45,00"],
                ["Impostos", "R$ 4,46"],
                ["Lucro", "R$ 14,88"],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex justify-between border-t border-neutral-900/15 pt-1.5"
                >
                  <dt>{l}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-center text-[11px] font-medium opacity-75">
              markup 1,65x sobre o custo
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs text-white/80 sm:text-sm">
              <strong className="text-white">
                O preço nunca fica atrás do formulário.
              </strong>{" "}
              Bloquear a resposta derruba a conversão e o sinal de qualidade da
              página. Não pedir nada desperdiça o único momento em que a pessoa
              tem motivo para se identificar.
            </p>
            <p className="text-xs text-white/80 sm:text-sm">
              <strong className="text-white">O bloqueio é nomeado</strong> — os
              rótulos ficam legíveis, só os valores somem — e{" "}
              <strong className="text-white">não depende de CSS</strong>:
              enquanto bloqueado, os valores reais não entram no DOM.
            </p>

            <div className="mt-auto flex flex-wrap gap-3 text-sm">
              <Link
                href={ROUTES.calculator}
                className="rounded-full bg-green-500 px-5 py-2.5 font-medium text-neutral-900 hover:bg-green-300"
              >
                A ferramenta publicada
              </Link>
              <Link
                href={ROUTES.caseDoc}
                className="rounded-full bg-neutral-900 px-5 py-2.5 font-medium text-white hover:bg-neutral-800"
              >
                O documento completo
              </Link>
            </div>
          </div>
        </div>
      </Slide>
    </main>
  );
}
