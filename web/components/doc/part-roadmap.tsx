/** Parte 3 do documento do case: o roadmap dos 90 dias. */

import {
  Callout,
  Code,
  H3,
  H4,
  HI_ROW,
  NUM,
  PartHeading,
  TD,
  TH,
  TableWrap,
} from "./prose";

import {
  FASE_1_PAGINAS,
  FASE_2_PAGINAS,
  FASE_3,
  FASE_4,
} from "@/content/case/analise-e-roadmap";

function NumberedSteps({
  items,
}: {
  items: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <ol className="mt-4 flex list-decimal flex-col gap-3 pl-6 marker:text-purple-600">
      {items.map(([titulo, detalhe]) => (
        <li key={titulo}>
          <strong>{titulo}</strong> — {detalhe}
        </li>
      ))}
    </ol>
  );
}

export function PartRoadmap() {
  return (
    <>
      <PartHeading
        id="parte-3"
        label="Parte 3"
        title="O roadmap dos 90 dias"
      />

      <H3 id="visao-geral">3.1 Visão geral</H3>

      <p className="mt-4">
        A estratégia parte do princípio de que{" "}
        <strong>
          as páginas de aquisição atraem a demanda orgânica, enquanto a
          ferramenta concentra a ativação e a conversão em lead
        </strong>
        . A sequência não é arbitrária: sem tráfego não há o que otimizar, e sem
        dado de tração a priorização vira palpite.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>Janela</th>
            <th className={TH}>Fase</th>
            <th className={TH}>Objetivo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD}>Dias 1 a 30</td>
            <td className={`${TD} font-bold text-neutral-900`}>Fase 1</td>
            <td className={TD}>
              Construir os ativos de aquisição e a ferramenta
            </td>
          </tr>
          <tr>
            <td className={TD}>Dias 31 a 60</td>
            <td className={`${TD} font-bold text-neutral-900`}>Fase 2</td>
            <td className={TD}>Expandir cobertura SEO + AEO</td>
          </tr>
          <tr>
            <td className={TD}>Dias 61 a 90</td>
            <td className={`${TD} font-bold text-neutral-900`}>Fase 3</td>
            <td className={TD}>Ganhar autoridade e otimizar vencedores</td>
          </tr>
          <tr>
            <td className={TD}>Dias 61 a 90</td>
            <td className={`${TD} font-bold text-neutral-900`}>Fase 4</td>
            <td className={TD}>
              Focar em CRO — em paralelo com a Fase 3
            </td>
          </tr>
        </tbody>
      </TableWrap>

      <p className="mt-6">
        As Fases 3 e 4 correm juntas porque atacam pontas opostas do mesmo
        funil: uma amplia a entrada, a outra trabalha a saída.
      </p>

      {/* ------------------------------ Fase 1 ----------------------------- */}

      <H3 id="fase-1">
        3.2 Fase 1 · Construir os ativos de aquisição e a ferramenta
      </H3>

      <p className="mt-3 text-lg text-neutral-800">Dias 1 a 30.</p>

      <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6 marker:text-purple-600">
        <li>
          Definir a arquitetura de páginas satélite focadas em precificação de
          produtos.
        </li>
        <li>Publicar a ferramenta.</li>
        <li>Criar as primeiras páginas prioritárias por intenção e keyword.</li>
        <li>Otimizar titles, headings, links internos e schema.</li>
        <li>
          Modelar o conteúdo para estrutura AEO — respostas diretas, entidades e
          FAQs.
        </li>
        <li>Criar os links entre as páginas satélite e a ferramenta.</li>
        <li>
          Configurar GA4 (ou outra ferramenta de tracking), GSC e os eventos de
          conversão.
        </li>
      </ol>

      <H4>Arquitetura publicada na fase</H4>

      <p className="mt-3">
        O subgrupo de <strong>precificação geral de produtos</strong> concentra
        61,3% do volume do escopo com 96,5% de gap — por isso vem primeiro.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>#</th>
            <th className={TH}>URL</th>
            <th className={TH}>Keywords-alvo</th>
            <th className={`${TH} ${NUM}`}>Volume/mês</th>
            <th className={TH}>Estilo</th>
          </tr>
        </thead>
        <tbody>
          {FASE_1_PAGINAS.map(([n, url, kw, vol, estilo, hi]) => (
            <tr key={url} className={hi ? HI_ROW : undefined}>
              <td className={TD}>{n}</td>
              <td className={TD}>
                <Code>{url}</Code>
              </td>
              <td className={TD}>{kw}</td>
              <td className={`${TD} ${NUM}`}>{vol}</td>
              <td className={TD}>{estilo}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <p className="mt-6">
        <strong>Total coberto na fase: 24.530 buscas/mês.</strong> Cada satélite
        leva CTA para a calculadora e link interno para as outras duas. A
        ferramenta é o destino de conversão do cluster inteiro; as satélites
        existem para alimentá-la.
      </p>

      {/* ------------------------------ Fase 2 ----------------------------- */}

      <H3 id="fase-2">3.3 Fase 2 · Expandir cobertura SEO + AEO</H3>

      <p className="mt-3 text-lg text-neutral-800">Dias 31 a 60.</p>

      <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6 marker:text-purple-600">
        <li>Priorizar os gaps de cobertura remanescentes.</li>
        <li>
          Publicar a segunda leva de páginas satélite, focada em precificação de
          serviços e casos por profissão.
        </li>
        <li>
          Manter a estrutura de conteúdo AEO da{" "}
          <a href="#parte-2">Parte 2</a>.
        </li>
        <li>Iniciar distribuição e prospecção de backlinks e menções.</li>
      </ol>

      <H4>Segunda leva de satélites</H4>

      <p className="mt-3">
        Estes são os subgrupos com <strong>100% de gap</strong> — serviços e
        casos por profissão. Volume alto, KD entre 5 e 12 e nenhuma cobertura da
        InfinitePay.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>#</th>
            <th className={TH}>URL</th>
            <th className={TH}>Keyword-alvo</th>
            <th className={`${TH} ${NUM}`}>Volume/mês</th>
            <th className={TH}>Estilo</th>
          </tr>
        </thead>
        <tbody>
          {FASE_2_PAGINAS.map(([n, url, kw, vol, estilo]) => (
            <tr key={url}>
              <td className={TD}>{n}</td>
              <td className={TD}>
                <Code>{url}</Code>
              </td>
              <td className={TD}>{kw}</td>
              <td className={`${TD} ${NUM}`}>{vol}</td>
              <td className={TD}>{estilo}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Callout tone="key" label="Cobertura acumulada">
        <p>
          <strong>Total coberto na fase: 14.620 buscas/mês.</strong> Somado à
          Fase 1, <strong>39.150 das 41.040 buscas do escopo — 95,4% —</strong>{" "}
          passam a ter uma URL dedicada.
        </p>
      </Callout>

      <p className="mt-6">
        A página #4 recebe link interno das páginas #5 a #11 e liga de volta à
        #1, formando o hub de serviços; todas levam CTA para a calculadora.
      </p>

      <p className="mt-4">
        <strong>O residual são 1.890 buscas</strong> em cinco keywords sem URL
        própria: <Code>como precificar produto artesanal</Code> (720),{" "}
        <Code>como definir o valor do meu produto</Code> (480),{" "}
        <Code>precificar produto importado</Code> (290),{" "}
        <Code>precificacao para revenda</Code> (260) e{" "}
        <Code>calcular preco de venda com imposto</Code> (140). Volume baixo
        demais para página dedicada nesta janela — candidatas a seção dentro das
        satélites existentes ou a reavaliação na Fase 3.
      </p>

      <H4>Iniciar a construção de autoridade</H4>

      <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 marker:text-purple-600">
        <li>Divulgar os ativos publicados (newsletter, redes sociais).</li>
        <li>Prospectar backlinks e menções.</li>
        <li>
          Buscar inclusão da calculadora em conteúdos e listas de recursos
          externos.
        </li>
      </ul>

      {/* ------------------------------ Fase 3 ----------------------------- */}

      <H3 id="fase-3">3.4 Fase 3 · Ganhar autoridade e otimizar vencedores</H3>

      <p className="mt-3 text-lg text-neutral-800">
        Dias 61 a 90. A partir daqui a priorização deixa de ser hipótese: o
        critério é o sinal.
      </p>

      <NumberedSteps items={FASE_3} />

      <p className="mt-6">
        O item 8 é o que evita desperdício: parar de investir em páginas que já
        tiveram tempo e não deram sinal é o que libera esforço para as que
        deram.
      </p>

      {/* ------------------------------ Fase 4 ----------------------------- */}

      <H3 id="fase-4">3.5 Fase 4 · Focar em CRO</H3>

      <p className="mt-3 text-lg text-neutral-800">
        Dias 61 a 90, em paralelo com a Fase 3.
      </p>

      <NumberedSteps items={FASE_4} />

      <p className="mt-6">
        O item 3 é o que desenhou a captura de lead da ferramenta publicada: o
        preço sugerido é entregue de graça, e a contrapartida pelo contato é o
        detalhamento da composição do preço. Entregar a resposta, cobrar pelo
        aprofundamento.
      </p>
    </>
  );
}
