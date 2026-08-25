/** Parte 2 do documento do case: o padrão de publicação. */

import {
  CHECKLIST_AEO,
  CHECKLIST_SEO,
  EVENTOS,
} from "@/content/case/analise-e-roadmap";

import { CheckIcon, Code, H3, Note, PartHeading, TD, TH, TableWrap } from "./prose";

/*
  Checklist com marca de conferido no lugar do ponto. Aqui o icone diz algo
  verdadeiro sobre a lista: sao dois checklists de verificacao, item a item,
  e nao enumeracoes quaisquer. Sao tambem as duas unicas listas seguidas da
  Parte 2 — com pontos, viravam vinte linhas iguais.

  Em duas colunas a partir do tablet: os itens sao curtos, e uma coluna so
  deixava a metade direita da pagina vazia por vinte linhas.
*/
function Checklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <CheckIcon className="mt-[0.3em] size-3.5 shrink-0 text-purple-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PartPadrao() {
  return (
    <>
      <PartHeading
        id="parte-2"
        label="Parte 2"
        title="O padrão de publicação"
      />

      <p className="mt-6">
        As três listas abaixo valem para{" "}
        <strong>
          todas as onze páginas satélite e para a página da ferramenta
        </strong>
        , em todas as fases. Elas estão aqui, e não dentro da Fase 1, porque não
        são tarefa de um mês: são a definição de pronto do projeto inteiro.
      </p>

      <H3 id="checklist-seo">2.1 Checklist SEO</H3>
      <p className="mt-4">Para cada página:</p>
      <Checklist items={CHECKLIST_SEO} />

      <H3 id="checklist-aeo">2.2 Checklist AEO</H3>
      <p className="mt-4">Para cada página:</p>
      <Checklist items={CHECKLIST_AEO} />

      <H3 id="medicao">2.3 O que medir desde o início</H3>

      <p className="mt-4">
        Sem os eventos no ar desde a Fase 1, a Fase 4 não tem em que trabalhar:
        otimizar um funil que ninguém instrumentou é adivinhar.
      </p>

      <p className="mt-4">
        <strong>O que acompanhar:</strong> pageviews · navegação da página
        satélite para a ferramenta · início do preenchimento na calculadora ·
        resultado gerado · captura do lead.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>Evento</th>
            <th className={TH}>Quando dispara</th>
          </tr>
        </thead>
        <tbody>
          {EVENTOS.map(([evento, quando]) => (
            <tr key={evento}>
              <td className={TD}>
                <Code>{evento}</Code>
              </td>
              <td className={TD}>{quando}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Note>
        Os eventos são disparados por uma camada tipada única, que degrada para
        no-op quando não há container de analytics configurado.
      </Note>
    </>
  );
}
