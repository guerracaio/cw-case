/** Parte 2 do documento do case: o padrão de publicação. */

import { Code, H3, Note, PartHeading, TD, TH, TableWrap } from "./prose";

const CHECKLIST_SEO = [
  "robots.txt, sitemap e HTTPS",
  "query primária definida",
  "intenção definida",
  "title",
  "H1",
  "URL",
  "headings",
  "meta description",
  "canonical",
  "conteúdo indexável",
  "links internos",
  "schema pertinente",
  "Core Web Vitals, especialmente mobile",
];

const CHECKLIST_AEO = [
  "responder perguntas diretamente",
  "usar headings em formato de perguntas reais",
  "criar definições curtas e objetivas",
  "incluir FAQs alinhadas às dúvidas reais de busca",
  "mostrar fórmulas explicitamente",
  "usar exemplos numéricos",
  "estruturar passos",
];

const EVENTOS: Array<[string, string]> = [
  ["page_view", "carregamento da página"],
  ["tool_click", "interação inicial com a ferramenta"],
  ["tool_start", "primeiro campo preenchido"],
  ["tool_complete", "resultado gerado"],
  ["lead_cta_click", "clique no CTA que abre o formulário"],
  ["lead_generated", "submissão válida do formulário"],
  ["site_cta_click", "clique em link que leva para fora do site"],
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 marker:text-purple-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
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
