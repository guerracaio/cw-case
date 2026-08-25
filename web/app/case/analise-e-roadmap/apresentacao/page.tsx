import type { Metadata } from "next";
import Link from "next/link";

import { GeminiLogo, OpenAiLogo } from "@/components/doc/ai-logos";
import {
  Big,
  SHI,
  SNUM,
  STD,
  STH,
  Slide,
  SlideTable,
  TOTAL_SLIDES,
} from "@/components/doc/slide";
import {
  CHECKLIST_AEO,
  CHECKLIST_SEO,
  DOMINIO_ALVO,
  ETAPAS,
  EVENTOS,
  FASE_1_PAGINAS,
  FASE_2_PAGINAS,
  FASES,
  FONTES,
  FUNIL,
  LIMITACOES,
  NUMEROS,
  RANKING,
  SUBGRUPOS,
} from "@/content/case/analise-e-roadmap";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/site";

/*
  Modo Apresentação do documento — a mesma análise reduzida a números, tabelas
  e entidades visuais, um assunto por tela.

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
        eyebrow="Case técnico · Technical SEO &amp; AI Growth Builder"
        title="Análise e roadmap SEO + AEO"
        lede="Calculadora de preços de produtos e serviços. Onde está a oportunidade orgânica, por que esta ferramenta e o que fazer nos primeiros 90 dias."
      >
        <div className="grid grid-cols-2 gap-3 sm:max-w-2xl sm:gap-4">
          <div className="rounded-2xl bg-green-500 px-5 py-4 text-neutral-900 sm:px-6 sm:py-5">
            <p className="text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              41.040
            </p>
            <p className="mt-2 text-xs opacity-80 sm:text-sm">
              buscas/mês no escopo
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 sm:px-6 sm:py-5">
            <p className="text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              97,9%
            </p>
            <p className="mt-2 text-xs opacity-70 sm:text-sm">
              sem ranking da InfinitePay
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs text-white/60 sm:text-sm">
          {TOTAL_SLIDES} telas · role, ou use PageDown e as setas do rodapé ·{" "}
          <Link href={ROUTES.caseDoc} className="text-green-500 hover:underline">
            ler o documento completo
          </Link>
        </p>
      </Slide>

      {/* ------------------------ 02 · os números ------------------------ */}
      <Slide
        n={2}
        eyebrow="Sumário executivo"
        title="Os oito números que sustentam a decisão"
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
      </Slide>

      {/* -------------------------- 03 · a fonte -------------------------- */}
      <Slide
        n={3}
        eyebrow="1.1 · Fonte de dados"
        title="Três arquivos, versionados exatamente como recebidos"
        lede="A janela é de 6 meses: um recorte temporal, não a série histórica. Isso condiciona tudo o que vem depois."
      >
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

        <p className="mt-8 text-[11px] font-medium tracking-[0.14em] text-neutral-800 uppercase sm:text-xs">
          O domínio-alvo
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {DOMINIO_ALVO.map(([valor, rotulo]) => (
            <Big key={rotulo} value={valor} label={rotulo} tone="outline" />
          ))}
        </div>
      </Slide>

      {/* --------------------- 04 · divisão de trabalho --------------------- */}
      <Slide
        n={4}
        eyebrow="1.2 · Ferramentas e divisão de trabalho"
        title="Dados intocados, agregação reprodutível, julgamento declarado"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-neutral-200 p-5">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl bg-white text-neutral-900"
            >
              <OpenAiLogo className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-bold">Codex · pipeline</h3>
            <p className="mt-2 text-xs text-neutral-800 sm:text-sm">
              Produziu os <strong>scripts Python</strong> em{" "}
              <span className="font-mono">generators/</span>, que leem os CSVs e
              escrevem os relatórios.{" "}
              <strong>Nenhum dado de entrada foi alterado.</strong>
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-200 p-5">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl bg-white text-neutral-900"
            >
              <GeminiLogo className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-bold">Gemini · ICP</h3>
            <p className="mt-2 text-xs text-neutral-800 sm:text-sm">
              O dataset não traz nada sobre público nem negócio. Um{" "}
              <em>deep research</em> sobre PMEs no Brasil virou a régua das
              notas de business fit.
            </p>
          </div>

          <div className="rounded-2xl bg-purple-600 p-5 text-white">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl bg-white/15 text-sm font-bold"
            >
              eu
            </span>
            <h3 className="mt-4 text-base font-bold">O que continuou humano</h3>
            <p className="mt-2 text-xs text-white/80 sm:text-sm">
              Os cortes de escopo, o agrupamento dos clusters, a leitura da
              SERP, as notas de utility fit, business fit e esforço, e a decisão
              final.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-green-500 px-5 py-4 text-neutral-900">
          <p className="text-xs leading-relaxed sm:text-sm">
            O relatório é um artefato <strong>determinístico e regenerável</strong>
            , não um resumo que a IA escreveu de memória. Se a agregação
            estiver errada, o erro está no script — e é inspecionável.
          </p>
        </div>
      </Slide>

      {/* --------------------------- 05 · o funil --------------------------- */}
      <Slide
        n={5}
        eyebrow="1.3 · As seis etapas"
        title="De 1,5 milhão de buscas a uma ferramenta"
      >
        <div className="flex flex-col gap-2">
          {FUNIL.map((f, i) => {
            const last = i === FUNIL.length - 1;
            return (
              <div
                key={f.label}
                style={{ width: f.width }}
                className={`flex min-w-fit items-baseline justify-between gap-4 rounded-lg px-4 py-2.5 sm:px-5 sm:py-3 ${
                  last ? "bg-green-500" : "bg-neutral-200"
                }`}
              >
                <span
                  className={`text-xs sm:text-sm ${last ? "font-bold" : "font-medium"}`}
                >
                  {f.label}
                </span>
                <span className="text-sm font-bold tabular-nums sm:text-base">
                  {f.value}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-6 max-w-3xl text-xs text-neutral-800 sm:text-sm">
          <strong>O achado que mudou o critério está na etapa 2.</strong>{" "}
          Precificação marca só 3% de sinal explícito de utilidade — quase
          ninguém digita &ldquo;calculadora&rdquo; — e ainda assim é nota 5,
          porque &ldquo;quanto cobrar por um bolo&rdquo; é uma tarefa de cálculo
          escrita em linguagem natural.
        </p>
      </Slide>

      {/* --------------------------- 06 · etapas --------------------------- */}
      <Slide
        n={6}
        eyebrow="1.3 · As seis etapas"
        title="Cada etapa é uma pergunta, e a resposta abre a seguinte"
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
      </Slide>

      {/* -------------------------- 07 · o ranking -------------------------- */}
      <Slide
        n={7}
        eyebrow="1.4 · A decisão"
        title="Sete hipóteses de ferramenta, uma escolhida"
        lede="Opportunity = Demand × Gap SEO × Utility Fit × Business Fit ÷ Effort. Demand e Gap saem do dataset; as outras três são julgamento declarado."
      >
        <SlideTable>
          <thead>
            <tr>
              <th className={`${STH} w-8`}>#</th>
              <th className={STH}>Hipótese</th>
              <th className={`${STH} ${SNUM}`}>Volume</th>
              <th className={`${STH} ${SNUM}`}>Gap</th>
              <th className={`${STH} ${SNUM}`}>Util.</th>
              <th className={`${STH} ${SNUM}`}>Neg.</th>
              <th className={`${STH} ${SNUM}`}>Esf.</th>
              <th className={`${STH} ${SNUM}`}>Score</th>
            </tr>
          </thead>
          <tbody>
            {RANKING.map(
              ([n, nome, vol, gap, util, neg, esf, score, escolhida]) => (
                <tr key={n} className={escolhida ? SHI : undefined}>
                  <td className={STD}>{n}</td>
                  <td className={`${STD} text-neutral-900`}>{nome}</td>
                  <td className={`${STD} ${SNUM}`}>{vol}</td>
                  <td className={`${STD} ${SNUM}`}>{gap}</td>
                  <td className={`${STD} ${SNUM}`}>{util}</td>
                  <td className={`${STD} ${SNUM}`}>{neg}</td>
                  <td className={`${STD} ${SNUM}`}>{esf}</td>
                  <td className={`${STD} ${SNUM}`}>{score}</td>
                </tr>
              ),
            )}
          </tbody>
        </SlideTable>

        <p className="mt-5 max-w-3xl text-xs text-neutral-800 sm:text-sm">
          <strong>As duas derrotas explicam melhor que a vitória.</strong> O
          comparador de maquininhas tem o dobro do volume e a melhor nota de
          negócio, e perde por gap: 60% já rankeia. O gerador de QR Code empata
          em volume, mas 45% já é da casa.
        </p>
      </Slide>

      {/* ------------------------ 08 · decomposição ------------------------ */}
      <Slide
        n={8}
        eyebrow="1.4 · A decisão"
        title="A decomposição da demanda desenhou a arquitetura de páginas"
      >
        <SlideTable>
          <thead>
            <tr>
              <th className={STH}>Subgrupo do escopo</th>
              <th className={`${STH} ${SNUM}`}>Keywords</th>
              <th className={`${STH} ${SNUM}`}>Volume</th>
              <th className={`${STH} ${SNUM}`}>Participação</th>
              <th className={`${STH} ${SNUM}`}>KD pond.</th>
              <th className={`${STH} ${SNUM}`}>Gap SEO</th>
              <th className={STH}>Atacado na</th>
            </tr>
          </thead>
          <tbody>
            {SUBGRUPOS.map(([nome, kws, vol, part, kd, gap, fase]) => (
              <tr key={nome}>
                <td className={`${STD} text-neutral-900`}>{nome}</td>
                <td className={`${STD} ${SNUM}`}>{kws}</td>
                <td className={`${STD} ${SNUM}`}>{vol}</td>
                <td className={`${STD} ${SNUM}`}>{part}</td>
                <td className={`${STD} ${SNUM}`}>{kd}</td>
                <td className={`${STD} ${SNUM}`}>{gap}</td>
                <td className={STD}>{fase}</td>
              </tr>
            ))}
          </tbody>
        </SlideTable>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Big value="97,9%" label="de gap SEO ponderado por volume" tone="green" />
          <Big value="1 em 32" label="páginas concorrentes é ferramenta" tone="outline" />
          <Big value="pos. 34" label="é a única presença atual da InfinitePay" tone="outline" />
        </div>
      </Slide>

      {/* ------------------------- 09 · limitações ------------------------- */}
      <Slide
        n={9}
        eyebrow="1.5 · Limitações e vieses"
        title="O que o dataset não permite afirmar"
        lede="Registradas porque mudam o peso da conclusão, não como ressalva protocolar."
      >
        <SlideTable>
          <thead>
            <tr>
              <th className={`${STH} w-1/3`}>O que identifiquei</th>
              <th className={STH}>Como lidei</th>
            </tr>
          </thead>
          <tbody>
            {LIMITACOES.map((l) => (
              <tr key={l.o_que} className={l.principal ? SHI : undefined}>
                <td className={`${STD} text-neutral-900`}>{l.o_que}</td>
                <td className={STD}>{l.como}</td>
              </tr>
            ))}
          </tbody>
        </SlideTable>
      </Slide>

      {/* --------------------- 10 · padrão de publicação --------------------- */}
      <Slide
        n={10}
        eyebrow="Parte 2 · O padrão de publicação"
        title="A definição de pronto — para as onze satélites e para a ferramenta"
        lede="Não é tarefa de uma fase: vale em todas. Sem isso, cada fase reinventa o próprio critério de qualidade."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] text-neutral-800 uppercase">
              2.1 · Checklist SEO
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-neutral-800 lg:grid-cols-1 lg:gap-y-1">
              {CHECKLIST_SEO.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] text-neutral-800 uppercase">
              2.2 · Checklist AEO
            </p>
            <ul className="mt-3 flex flex-col gap-1.5 text-xs text-neutral-800">
              {CHECKLIST_AEO.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] text-neutral-800 uppercase">
              2.3 · O que medir desde o início
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {EVENTOS.map(([evento, quando], i) => (
                <li
                  key={evento}
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-1.5 text-xs ${
                    i === EVENTOS.length - 2
                      ? "bg-green-500 text-neutral-900"
                      : "bg-neutral-200 text-neutral-800"
                  }`}
                >
                  <span>{quando}</span>
                  <span className="font-mono text-[10px] whitespace-nowrap">
                    {evento}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Slide>

      {/* --------------------------- 11 · as fases --------------------------- */}
      <Slide
        n={11}
        eyebrow="3.1 · Visão geral do roadmap"
        title="Aquisição primeiro, conversão depois"
        lede="Sem tráfego não há o que otimizar, e sem dado de tração a priorização vira palpite. As Fases 3 e 4 correm juntas porque atacam pontas opostas do mesmo funil."
      >
        <div className="grid gap-3 lg:grid-cols-4">
          {FASES.map((f, i) => (
            <div
              key={f.nome}
              className={`flex flex-col rounded-2xl p-5 ${
                i === 3 ? "bg-green-500 text-neutral-900" : "bg-neutral-200"
              }`}
            >
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-medium ${
                  i === 3 ? "bg-neutral-900 text-white" : "bg-white"
                }`}
              >
                {f.janela}
              </span>
              <h3 className="mt-3 text-base font-bold">{f.nome}</h3>
              <p className="mt-1 text-xs sm:text-sm">{f.objetivo}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* ---------------------------- 12 · fase 1 ---------------------------- */}
      <Slide
        n={12}
        eyebrow="3.2 e 3.3 · A arquitetura publicada"
        title="Onze satélites e a ferramenta, por intenção e keyword"
      >
        <SlideTable>
          <thead>
            <tr>
              <th className={`${STH} w-8`}>#</th>
              <th className={STH}>URL</th>
              <th className={`${STH} ${SNUM}`}>Volume</th>
              <th className={STH}>Formato</th>
              <th className={STH}>Fase</th>
            </tr>
          </thead>
          <tbody>
            {FASE_1_PAGINAS.map(([n, url, , vol, formato, ferramenta]) => (
              <tr key={url} className={ferramenta ? SHI : undefined}>
                <td className={STD}>{n}</td>
                <td className={`${STD} font-mono text-[11px] text-neutral-900`}>
                  {url}
                </td>
                <td className={`${STD} ${SNUM}`}>{vol}</td>
                <td className={STD}>{formato}</td>
                <td className={STD}>Fase 1</td>
              </tr>
            ))}
            {FASE_2_PAGINAS.map(([n, url, , vol, formato]) => (
              <tr key={url}>
                <td className={STD}>{n}</td>
                <td className={`${STD} font-mono text-[11px] text-neutral-900`}>
                  {url}
                </td>
                <td className={`${STD} ${SNUM}`}>{vol}</td>
                <td className={STD}>{formato}</td>
                <td className={STD}>Fase 2</td>
              </tr>
            ))}
          </tbody>
        </SlideTable>
      </Slide>

      {/* --------------------------- 13 · fechamento --------------------------- */}
      <Slide
        n={13}
        tone="purple"
        eyebrow="Fechamento"
        title="95,4% do volume do escopo coberto ao fim da Fase 2"
        lede="39.150 das 41.040 buscas, em onze páginas satélite e a ferramenta — com os eventos no ar desde a Fase 1, porque otimizar um funil que ninguém instrumentou é adivinhar."
      >
        <div className="grid grid-cols-2 gap-3 sm:max-w-3xl lg:grid-cols-3">
          <div className="rounded-2xl bg-green-500 px-5 py-4 text-neutral-900">
            <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
              95,4%
            </p>
            <p className="mt-2 text-xs opacity-80 sm:text-sm">
              de cobertura ao fim da Fase 2
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
              11 + 1
            </p>
            <p className="mt-2 text-xs opacity-70 sm:text-sm">
              páginas satélite e a ferramenta
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
              DR 68
            </p>
            <p className="mt-2 text-xs opacity-70 sm:text-sm">
              contra 51,5 de mediana dos concorrentes
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            href={ROUTES.caseDoc}
            className="rounded-full bg-white px-5 py-2.5 font-medium text-neutral-900 hover:bg-neutral-200"
          >
            O documento completo
          </Link>
          <Link
            href={ROUTES.calculator}
            className="rounded-full bg-neutral-900 px-5 py-2.5 font-medium text-white hover:bg-neutral-800"
          >
            A ferramenta publicada
          </Link>
        </div>
      </Slide>
    </main>
  );
}
