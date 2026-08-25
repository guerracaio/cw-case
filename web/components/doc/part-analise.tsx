/** Parte 1 do documento do case: a análise. */

import {
  ETAPAS,
  RANKING,
  SUBGRUPOS,
} from "@/content/case/analise-e-roadmap";

import { GeminiLogo, OpenAiLogo } from "./ai-logos";
import {
  Callout,
  Code,
  H3,
  H4,
  HI_ROW,
  NUM,
  Note,
  PartHeading,
  Question,
  Role,
  Stat,
  Stats,
  TD,
  TH,
  TableWrap,
} from "./prose";

export function PartAnalise() {
  return (
    <>
      <PartHeading id="parte-1" label="Parte 1" title="A análise" />

      <p className="mt-6">
        Esta parte registra <strong>a pergunta de cada etapa, o que foi medido
        para respondê-la e a conclusão que abriu a etapa seguinte</strong>, com
        os arquivos do repositório em que cada resposta está registrada. A
        estrutura segue a convenção do memorando de método da pesquisa
        aplicada — pergunta, medição, achado, decisão —, com uma seção de
        limitações no padrão de <em>datasheet</em> de dataset e um apêndice de
        reprodutibilidade. O objetivo é permitir auditar a conclusão sem
        refazer a análise.
      </p>

      <H4>O caminho em uma página</H4>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>#</th>
            <th className={TH}>Etapa</th>
            <th className={TH}>Pergunta</th>
            <th className={TH}>O que decidiu</th>
          </tr>
        </thead>
        <tbody>
          {ETAPAS.map(([n, etapa, pergunta, decidiu, hi]) => (
            <tr key={n} className={hi ? HI_ROW : undefined}>
              <td className={TD}>{n}</td>
              <td className={`${TD} font-medium text-neutral-900`}>{etapa}</td>
              <td className={TD}>{pergunta}</td>
              <td className={TD}>{decidiu}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      {/* ------------------------------- 1.1 ------------------------------- */}

      <H3 id="fonte-de-dados">1.1 Fonte de dados</H3>

      <p className="mt-4">
        Três arquivos em <Code>dataset/</Code>, fornecidos no case e{" "}
        <strong>versionados sem qualquer alteração</strong>.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>Arquivo</th>
            <th className={`${TH} ${NUM}`}>Linhas</th>
            <th className={TH}>O que traz</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD}>
              <Code>organic-keywords.csv</Code>
            </td>
            <td className={`${TD} ${NUM}`}>409</td>
            <td className={TD}>
              keyword, volume, KD, CPC, tráfego, melhor posição e URL por
              domínio, flags de intenção
            </td>
          </tr>
          <tr>
            <td className={TD}>
              <Code>top-pages.csv</Code>
            </td>
            <td className={`${TD} ${NUM}`}>406</td>
            <td className={TD}>
              URL, tráfego, keywords, UR, domínios de referência, top keyword
              por página
            </td>
          </tr>
          <tr>
            <td className={TD}>
              <Code>organic-competitors.csv</Code>
            </td>
            <td className={`${TD} ${NUM}`}>14</td>
            <td className={TD}>
              domínio, DR, keywords em comum, share, tráfego, páginas
            </td>
          </tr>
        </tbody>
      </TableWrap>

      <p className="mt-6">
        <strong>A janela é de 6 meses.</strong> O dataset é um recorte
        temporal, não a série histórica das keywords. Isso condiciona tudo o
        que vem abaixo e está detalhado em <a href="#limitacoes">1.5</a>.
      </p>

      <H4>O domínio-alvo</H4>

      <p className="mt-3">
        O case fornece, além dos CSVs, o perfil orgânico de{" "}
        <Code>infinitepay.io</Code>:
      </p>

      <Stats>
        <Stat value="68" label="Domain Rating" />
        <Stat value="~1.900" label="keywords orgânicas" />
        <Stat value="380" label="páginas rankeando" />
        <Stat value="12.000" label="visitas orgânicas/mês" />
      </Stats>

      <p className="mt-6">
        Três desdobramentos, e um deles corta contra a análise:
      </p>

      <p className="mt-4">
        <strong>A InfinitePay entra por cima.</strong> DR 68 é maior que o de
        cinco dos seis concorrentes do recorte de precificação. A exceção é{" "}
        <Code>contazen.com.br</Code> (DR 71), que cobre uma única keyword de
        320 buscas e captura 9 visitas/mês. Contra os três domínios que
        efetivamente sustentam o cluster — <Code>lojafacil.com.br</Code> (54),{" "}
        <Code>contadorexpress.com.br</Code> (49) e <Code>giroloja.com.br</Code>{" "}
        (38) —, a diferença vai de 14 a 30 pontos.
      </p>

      <p className="mt-4">
        <strong>Há autoridade não convertida.</strong> 12.000 visitas orgânicas
        distribuídas em 380 páginas dão cerca de 32 visitas por página ao mês.
        É pouco para um DR 68: a autoridade existe e não está sendo convertida
        em tráfego na proporção que ela permitiria — condição que favorece a
        entrada de páginas novas em keywords de baixa dificuldade.
      </p>

      <Callout tone="caveat" label="O que corta contra">
        <p>
          <strong>A amostra é uma fatia fina do domínio.</strong> O dataset traz
          37 keywords e 37 páginas da InfinitePay: cerca de{" "}
          <strong>2% das ~1.900 keywords</strong> e 10% das 380 páginas reais.
          Isso não invalida o gap medido — ele é calculado dentro do recorte,
          keyword a keyword —, mas limita o que a ausência prova. Ver{" "}
          <a href="#limitacoes">1.5</a>, item 4.
        </p>
      </Callout>

      {/* ------------------------------- 1.2 ------------------------------- */}

      <H3 id="ferramentas">1.2 Ferramentas e divisão de trabalho</H3>

      <p className="mt-4">
        A análise foi feita com assistência de IA em duas frentes distintas,
        com papéis diferentes.
      </p>

      <Role icon={<OpenAiLogo className="size-6" />}>
        <p>
          <strong>Codex — pipeline de dados.</strong> Usado para agrupar,
          filtrar, ordenar, refinar e sumarizar o dataset, com o objetivo de
          encurtar o tempo entre a pergunta e o número que a responde.{" "}
          <strong>Nenhum dado de entrada foi alterado:</strong> os três CSVs
          estão no repositório exatamente como recebidos, e toda agregação é
          reprodutível pelos scripts. O que o assistente produziu foram os{" "}
          <strong>scripts Python</strong> em <Code>generators/</Code>, que leem
          os CSVs e escrevem relatórios em Markdown em{" "}
          <Code>outputs/seo-demand-maps/</Code>.
        </p>
        <p className="mt-4">
          Essa separação é deliberada: o relatório é um artefato determinístico
          e regenerável, não um resumo que a IA escreveu de memória. Se a
          agregação estiver errada, o erro está no script e é inspecionável.
        </p>
      </Role>

      <Role icon={<GeminiLogo className="size-6" />}>
        <p>
          <strong>Gemini — pesquisa de ICP.</strong> O dataset traz apenas dados
          quantitativos de SEO; não traz nada sobre quem é o público nem sobre
          o negócio. Para avaliar business fit foi feito um{" "}
          <em>deep research</em> sobre PMEs no Brasil, usado para desenhar um
          ICP e responder, por hipótese de ferramenta, se a dor pertence ao
          público que a InfinitePay atende e se o resultado da ferramenta leva
          a uma conversa natural sobre o produto.
        </p>
      </Role>

      <p className="mt-8">
        <strong>O que continuou humano:</strong> os cortes de escopo, o
        agrupamento dos clusters, a leitura da natureza do conteúdo na SERP, as
        notas de utility fit, business fit e esforço, e a decisão final. As
        notas são julgamento declarado — estão no código, versionadas, e
        mudá-las muda o ranking.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>Camada</th>
            <th className={TH}>Onde vive</th>
            <th className={TH}>Papel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${TD} font-medium text-neutral-900`}>
              Dados de entrada
            </td>
            <td className={TD}>
              <Code>dataset/</Code>
            </td>
            <td className={TD}>Intocado</td>
          </tr>
          <tr>
            <td className={`${TD} font-medium text-neutral-900`}>
              Agregação e relatórios
            </td>
            <td className={TD}>
              <Code>generators/</Code> → <Code>outputs/</Code>
            </td>
            <td className={TD}>Determinístico, regenerável</td>
          </tr>
          <tr>
            <td className={`${TD} font-medium text-neutral-900`}>
              Interpretação e notas
            </td>
            <td className={TD}>Constantes nos scripts + este documento</td>
            <td className={TD}>Julgamento declarado</td>
          </tr>
        </tbody>
      </TableWrap>

      {/* ------------------------------- 1.3 ------------------------------- */}

      <H3 id="etapas">1.3 As seis etapas</H3>

      <H4>Etapa 1 · Mapear demanda</H4>
      <Question>Onde existe demanda de busca comprovada?</Question>

      <p className="mt-4">
        <strong>O que foi medido.</strong> Consolidação de todas as keywords
        únicas observadas na InfinitePay e nos 14 concorrentes, agrupadas em
        clusters por macrotema. Por cluster: volume mensal{" "}
        <strong>deduplicado por keyword</strong> (uma keyword que aparece em
        vários domínios soma uma vez só), tráfego orgânico estimado pela soma
        de <Code>sum_traffic</Code> por keyword e domínio, contagem de domínios
        distintos e de URLs distintas que rankeiam para ao menos uma keyword do
        cluster. O agrupamento é determinístico e auditável keyword a keyword
        em <Code>cluster_assignments.json</Code>.
      </p>

      <Note>
        <strong>Artefato:</strong>{" "}
        <Code>outputs/seo-demand-maps/01_mapa_mercado.md</Code>, gerado por{" "}
        <Code>generate_demand_maps.py</Code>.
      </Note>

      <p className="mt-4">
        <strong>O que os dados mostraram.</strong> 1.558.773 buscas/mês, 303
        keywords únicas, 26 clusters, 14 concorrentes, 406 páginas. E, no topo
        da lista, um problema: entre os dez maiores clusters estão{" "}
        <strong>Marca Banco Quantum</strong> (152.400),{" "}
        <strong>Marca Pagsfera</strong> (98.500) e{" "}
        <strong>Marca Banco Aurora</strong> (71.000) — demanda navegacional
        pelo nome de concorrentes, que nenhuma página da InfinitePay vai
        capturar. Somando os cinco clusters de marca do recorte, são{" "}
        <strong>345.600 buscas/mês inendereçáveis</strong>, 22% do universo.
      </p>

      <Callout tone="next" label="Conclusão que abriu a etapa 2">
        <p>
          Volume bruto não é critério de priorização: o maior número da tabela é
          o mais inútil. Antes de comparar oportunidades é preciso filtrar o
          universo pela natureza da intenção.
        </p>
      </Callout>

      <H4>Etapa 2 · Identificar utility intent</H4>
      <Question>
        Quais demandas representam usuários querendo <em>fazer</em> algo, e não
        apenas aprender?
      </Question>

      <p className="mt-4">
        <strong>O que foi medido.</strong> Três camadas, em ordem:
      </p>

      <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6 marker:text-purple-600">
        <li>
          <strong>Exclusão de demanda de marca e navegacional</strong> —
          removidos os cinco clusters de marca identificados na etapa 1.
        </li>
        <li>
          <strong>Sinal explícito de utilidade</strong> — a parcela do volume de
          cada cluster que está em keywords contendo termos como{" "}
          <em>calculadora</em>, <em>simulador</em>, <em>gerador</em>,{" "}
          <em>planilha</em>, <em>modelo</em>, <em>tabela</em> ou{" "}
          <em>inventário</em>. É um indicador de superfície: mede como a pessoa
          escreve, não o que ela precisa.
        </li>
        <li>
          <strong>Nota de utility fit (1–5)</strong> — se a intenção geral do
          cluster é atendida por uma <strong>ferramenta na SERP</strong> ou por
          um artigo, avaliada acima da palavra usada na busca. A pergunta é qual
          formato resolve a busca, não quão fácil seria construir ou usar a
          ferramenta depois. Cada cluster recebe o formato recomendado junto da
          nota.
        </li>
      </ol>

      <Note>
        <strong>Artefatos:</strong>{" "}
        <Code>02_mapa_conteudo_utilitario_mercado.md</Code> e{" "}
        <Code>03_relatorio_fit_conteudo_utilitario.md</Code>, com as notas em{" "}
        <Code>utility_fit_assessment.json</Code>, gerados por{" "}
        <Code>generate_utility_fit_report.py</Code>.
      </Note>

      <p className="mt-4">
        <strong>O que os dados mostraram.</strong> O recorte caiu para 1.213.173
        buscas/mês em 21 clusters e 288 keywords. Quatro clusters receberam nota
        5:
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>Cluster</th>
            <th className={`${TH} ${NUM}`}>Volume/mês</th>
            <th className={`${TH} ${NUM}`}>Sinal explícito</th>
            <th className={`${TH} ${NUM}`}>Nota</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD}>Calculadoras pessoais e trabalhistas</td>
            <td className={`${TD} ${NUM}`}>326.780</td>
            <td className={`${TD} ${NUM}`}>100%</td>
            <td className={`${TD} ${NUM}`}>5</td>
          </tr>
          <tr>
            <td className={TD}>Utilitários online</td>
            <td className={`${TD} ${NUM}`}>189.300</td>
            <td className={`${TD} ${NUM}`}>100%</td>
            <td className={`${TD} ${NUM}`}>5</td>
          </tr>
          <tr className={HI_ROW}>
            <td className={TD}>Precificação, custos e margens</td>
            <td className={`${TD} ${NUM}`}>72.164</td>
            <td className={`${TD} ${NUM}`}>3%</td>
            <td className={`${TD} ${NUM}`}>5</td>
          </tr>
          <tr>
            <td className={TD}>Documentos e modelos empresariais</td>
            <td className={`${TD} ${NUM}`}>14.300</td>
            <td className={`${TD} ${NUM}`}>61%</td>
            <td className={`${TD} ${NUM}`}>5</td>
          </tr>
        </tbody>
      </TableWrap>

      <p className="mt-6">
        O achado que mudou o critério:{" "}
        <strong>o sinal explícito engana nos dois sentidos.</strong>{" "}
        <em>Precificação</em> marca apenas 3% e ainda assim é nota 5 — porque
        &ldquo;quanto cobrar por um bolo&rdquo; é uma tarefa de cálculo escrita
        em linguagem natural, sem a palavra &ldquo;calculadora&rdquo;. Na
        direção oposta, <em>Fiscal e tributário</em> marca <strong>76%</strong>{" "}
        e fica em 4, porque a demanda é por consultar tabela e regra por código,
        regime e operação, não por calcular. Priorizar pela palavra usada na
        busca teria descartado o cluster vencedor.
      </p>

      <Callout tone="next" label="Conclusão que abriu a etapa 3">
        <p>
          Restaram mais clusters com alto utility fit do que capacidade de
          construir e manter. Utility fit é condição necessária, não critério de
          desempate. O próximo corte tinha de ser competitivo.
        </p>
      </Callout>

      <H4>Etapa 3 · Encontrar gaps competitivos</H4>
      <Question>
        Quais dessas demandas estão mal atendidas pelos concorrentes?
      </Question>

      <p className="mt-4">
        <strong>O que foi medido.</strong> Análise de gap no sentido técnico —
        não &ldquo;quem tem mais conteúdo&rdquo;, mas quanto do volume está em
        disputa e com que solidez está ocupado:
      </p>

      <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 marker:text-purple-600">
        <li>
          <strong>Cobertura do alvo por keyword</strong> — presença ou ausência
          de <Code>infinitepay.io</Code> e a melhor posição observada (
          <Code>best_position</Code>).
        </li>
        <li>
          <strong>Gap SEO ponderado por volume</strong> — soma do volume das
          keywords sem ranking do alvo ÷ volume total do recorte. Ponderar por
          volume evita que uma cauda longa de keywords minúsculas mascare a
          cobertura do que importa.
        </li>
        <li>
          <strong>Força do domínio concorrente</strong> —{" "}
          <Code>domain_rating</Code> de <Code>organic-competitors.csv</Code>.
        </li>
        <li>
          <strong>Força da página que rankeia</strong> — cruzamento de{" "}
          <Code>best_position_url</Code> com <Code>top-pages.csv</Code> para
          obter <strong>UR</strong> e <strong>domínios de referência</strong> da
          URL específica. É a métrica que decide se dá para ultrapassar: um DR
          alto com UR 11 na página que rankeia significa autoridade de domínio
          que não está sustentando aquele resultado.
        </li>
        <li>
          <strong>Dificuldade da keyword</strong> — KD por keyword, com
          distribuição (mínimo, mediana, média ponderada por volume, máximo) em
          vez de média simples.
        </li>
        <li>
          <strong>Gap funcional</strong> — se existe ou não uma URL de{" "}
          <strong>ferramenta</strong> entre as páginas que rankeiam. Um cluster
          pode ter gap SEO baixo e gap de formato alto: todo mundo cobre o
          assunto, ninguém resolve a tarefa.
        </li>
      </ul>

      <Callout tone="caveat" label="A inferência mais frágil da análise">
        <p>
          Os concorrentes são fictícios e as URLs não são acessíveis. A natureza
          do conteúdo na SERP — editorial ou ferramenta — foi{" "}
          <strong>inferida</strong> a partir do padrão do domínio, do slug da
          URL, do campo <Code>page_type</Code> e do título da top keyword de
          cada página. É leitura de indício, não verificação. Em um cenário
          real, abrir as SERPs seria etapa obrigatória antes de decidir.
        </p>
      </Callout>

      <p className="mt-6">
        <strong>O que os dados mostraram.</strong> No recorte de precificação: 6
        concorrentes com DR entre 29 e 71 (mediana 51,5), mas as 32 páginas
        relevantes cruzadas com <Code>top-pages.csv</Code> têm{" "}
        <strong>UR mediano 11 e 2 domínios de referência</strong> — páginas
        fracas sustentadas por domínios razoáveis. KD mediano 6,0. E{" "}
        <strong>uma única ferramenta explícita em 32 páginas</strong>: a SERP
        observada é quase toda editorial.
      </p>

      <p className="mt-4">
        <strong>E o domínio-alvo chega por cima.</strong> Com DR 68, a
        InfinitePay está 16,5 pontos acima do DR mediano do grupo e acima de
        cinco dos seis concorrentes. A combinação — KD mediano 6,0, páginas
        ocupantes com UR mediano 11 e um domínio-alvo mais forte que os
        incumbentes que sustentam o cluster — descreve uma demanda que não está
        protegida por autoridade. DR não garante posição; define de onde se
        parte. Aqui, o custo de entrada é essencialmente o custo de publicar
        bem.
      </p>

      <Callout tone="next" label="Conclusão que abriu a etapa 4">
        <p>
          Gap alto isolado também engana: clusters minúsculos costumam ter 100%
          de gap simplesmente porque ninguém se importa com eles. Demanda,
          utility fit e gap precisavam entrar na mesma conta — e a conta
          precisava ser feita sobre o{" "}
          <strong>escopo de uma ferramenta concreta</strong>, não sobre um
          cluster inteiro do mapa.
        </p>
      </Callout>

      <H4>Etapa 4 · Priorizar oportunidade de SEO</H4>
      <Question>
        Quais oportunidades combinam melhor demanda, utility fit e brecha
        competitiva?
      </Question>

      <p className="mt-4">
        <strong>O que foi medido.</strong> Sete hipóteses de ferramenta foram
        definidas, cada uma com um{" "}
        <strong>escopo explícito de keywords</strong> — o recorte é o do produto
        que se pretende construir, não o do cluster. Uma calculadora de preços
        não atende &ldquo;curva ABC de estoque&rdquo; só porque as duas caem em{" "}
        <em>Gestão</em>.
      </p>

      <p className="mt-4">
        Por hipótese: volume do escopo, volume em gap, gap SEO ponderado, número
        de concorrentes, DR médio dos concorrentes, KD médio das keywords e
        tráfego estimado. A fórmula de ordenação:
      </p>

      <p className="mt-4 overflow-x-auto rounded-xl bg-neutral-200 p-4 font-mono text-sm text-neutral-900">
        Opportunity = Demand × Gap SEO × Utility Fit × Business Fit ÷ Effort
      </p>

      <p className="mt-4">
        Demand e Gap SEO vêm do dataset. <strong>Utility Fit</strong> (o formato
        que a intenção do cluster pede), <strong>Business Fit</strong> (a
        ligação entre o resultado da ferramenta e o produto) e{" "}
        <strong>Effort</strong> (o custo de construir e manter) são notas
        declaradas de 1 a 5, fixadas no código do gerador.
      </p>

      <Note>
        <strong>Artefato:</strong>{" "}
        <Code>04_relatorio_shortlist_ferramentas.md</Code>, gerado por{" "}
        <Code>generate_shortlist_report.py</Code>.
      </Note>

      <p className="mt-4">
        <strong>O que os dados mostraram.</strong> Considerando apenas demanda,
        gap e utility fit, o topo ficou apertado: a calculadora de preços
        (41.040 buscas, 97,9% de gap) e o comparador de maquininhas (81.866
        buscas, 40% de gap) chegam próximos por caminhos opostos — muito volume
        parcialmente ocupado contra menos volume quase inteiramente livre.
      </p>

      <Callout tone="next" label="Conclusão que abriu a etapa 5">
        <p>
          As três variáveis vindas do dataset não sabem nada sobre o negócio.
          Uma ferramenta pode ter demanda perfeita e gap perfeito para um
          público que não é cliente, ou entregar um resultado que não leva a
          lugar nenhum. Faltava a dimensão de aderência.
        </p>
      </Callout>

      <H4>Etapa 5 · Validar business fit</H4>
      <Question>
        Quais oportunidades têm maior aderência ao negócio e melhor lead bridge?
      </Question>

      <p className="mt-4">
        <strong>O que foi medido.</strong> O dataset não traz dado qualitativo
        sobre público. Para não atribuir notas por intuição, foi feito um{" "}
        <strong>deep research sobre PMEs no Brasil com o Gemini</strong> e
        desenhado um ICP a partir dele — porte, natureza da operação, dores
        financeiras recorrentes e relação com meios de pagamento. Esse ICP foi
        então usado como régua para responder duas perguntas por hipótese:
      </p>

      <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6 marker:text-purple-600">
        <li>
          <strong>Aderência de público</strong> — a dor pertence à PME que a
          InfinitePay atende, ou é de um público adjacente?
        </li>
        <li>
          <strong>Lead bridge</strong> — o resultado da ferramenta leva
          naturalmente a uma conversa sobre o produto, ou exige um salto
          artificial do tipo &ldquo;e por falar nisso, conheça nossa
          maquininha&rdquo;?
        </li>
      </ol>

      <p className="mt-4">
        A resposta virou a nota de <strong>Business Fit (1–5)</strong>,
        registrada por hipótese no gerador da shortlist.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={`${TH} ${NUM}`}>Nota</th>
            <th className={TH}>Hipóteses</th>
            <th className={TH}>Leitura</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${TD} ${NUM} font-bold text-neutral-900`}>5</td>
            <td className={TD}>Comparador de maquininhas</td>
            <td className={TD}>
              A ferramenta <em>é</em> a decisão de compra do produto
            </td>
          </tr>
          <tr>
            <td className={`${TD} ${NUM} font-bold text-neutral-900`}>3</td>
            <td className={TD}>
              Calculadora de preços, Gerador de QR Code, Simulador de descontos,
              Planilha de vendas
            </td>
            <td className={TD}>
              Ponte natural: a taxa de pagamento é campo do próprio cálculo, mas
              a ferramenta não vende a maquininha
            </td>
          </tr>
          <tr>
            <td className={`${TD} ${NUM} font-bold text-neutral-900`}>1</td>
            <td className={TD}>
              Simulador de antecipação, Diagnóstico de crédito
            </td>
            <td className={TD}>
              Produto adjacente; a ponte existe, mas é longa no recorte
              analisado
            </td>
          </tr>
        </tbody>
      </TableWrap>

      <Callout tone="next" label="Conclusão que abriu a etapa 6">
        <p>
          Business fit sozinho elegeria o comparador de maquininhas por larga
          margem. Mas construir e <strong>manter</strong> um comparador é outra
          ordem de grandeza de trabalho — ele depende de uma tabela de taxas de
          terceiros que precisa continuar correta indefinidamente, sob pena de
          virar passivo. Sem o custo na conta, a priorização estaria incompleta.
        </p>
      </Callout>

      <H4>Etapa 6 · Avaliar esforço e escolher</H4>
      <Question>
        Qual oportunidade oferece a melhor relação entre potencial e dificuldade
        de execução?
      </Question>

      <p className="mt-4">
        <strong>O que foi medido.</strong> Nota de{" "}
        <strong>Effort (1–5)</strong> por hipótese, considerando complexidade do
        modelo de cálculo, dependência de dado externo que exija manutenção
        contínua e superfície de manutenção depois de publicada. O esforço entra
        no denominador da fórmula.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>#</th>
            <th className={TH}>Hipótese</th>
            <th className={`${TH} ${NUM}`}>Volume</th>
            <th className={`${TH} ${NUM}`}>Gap SEO</th>
            <th className={`${TH} ${NUM}`}>Utility</th>
            <th className={`${TH} ${NUM}`}>Business</th>
            <th className={`${TH} ${NUM}`}>Esforço</th>
            <th className={`${TH} ${NUM}`}>Opportunity</th>
          </tr>
        </thead>
        <tbody>
          {RANKING.map(([n, nome, vol, gap, u, b, e, opp, hi]) => (
            <tr key={n} className={hi ? HI_ROW : undefined}>
              <td className={TD}>{n}</td>
              <td className={TD}>{nome}</td>
              <td className={`${TD} ${NUM}`}>{vol}</td>
              <td className={`${TD} ${NUM}`}>{gap}</td>
              <td className={`${TD} ${NUM}`}>{u}</td>
              <td className={`${TD} ${NUM}`}>{b}</td>
              <td className={`${TD} ${NUM}`}>{e}</td>
              <td className={`${TD} ${NUM}`}>{opp}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <p className="mt-6">
        As duas derrotas explicam a escolha melhor do que a vitória:
      </p>

      <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 marker:text-purple-600">
        <li>
          <strong>O comparador de maquininhas</strong> tem o dobro do volume e a
          melhor nota de negócio, e mesmo assim fica em terceiro. Perde por gap
          — 60% do volume já tem ranking da InfinitePay, então o volume
          adicional é menor do que parece — e por esforço, sendo a única
          hipótese cuja manutenção é permanente.
        </li>
        <li>
          <strong>O gerador de QR Code</strong> tem volume praticamente igual ao
          da calculadora e o menor esforço da faixa alta, mas 45% do volume já
          tem ranking da InfinitePay — sobram 22.000 buscas contra 40.160.
        </li>
      </ul>

      <p className="mt-4">
        A calculadora vence por ser a única que combina{" "}
        <strong>volume relevante com o volume quase inteiramente livre</strong>,
        num formato que a SERP observada não oferece, a um esforço de construção
        contido.
      </p>

      {/* ------------------------------- 1.4 ------------------------------- */}

      <H3 id="decisao">1.4 A decisão e sua evidência</H3>

      <p className="mt-4">
        Antes de fechar, o escopo escolhido passou por um relatório dedicado,
        keyword a keyword: <Code>05_relatorio_gap_calculadora_precos.md</Code>,
        gerado por <Code>generate_pricing_gap_report.py</Code>.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>Evidência</th>
            <th className={TH}>Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD}>Keywords do escopo</td>
            <td className={`${TD} font-medium text-neutral-900`}>21</td>
          </tr>
          <tr>
            <td className={TD}>Volume total</td>
            <td className={`${TD} font-medium text-neutral-900`}>
              41.040 buscas/mês
            </td>
          </tr>
          <tr>
            <td className={TD}>Gap SEO ponderado</td>
            <td className={`${TD} font-medium text-neutral-900`}>
              97,9% — 40.160 buscas sem ranking
            </td>
          </tr>
          <tr>
            <td className={TD}>Cobertura atual da InfinitePay</td>
            <td className={TD}>
              1 keyword, posição 34, artigo (não ferramenta)
            </td>
          </tr>
          <tr>
            <td className={TD}>Gap funcional</td>
            <td className={`${TD} font-medium text-neutral-900`}>
              100% — nenhuma calculadora de preço no dataset
            </td>
          </tr>
          <tr>
            <td className={TD}>KD mediano</td>
            <td className={`${TD} font-medium text-neutral-900`}>
              6,0 — 92,9% do volume com KD ≤ 10
            </td>
          </tr>
          <tr>
            <td className={TD}>Ferramenta explícita entre concorrentes</td>
            <td className={TD}>1 página em 32</td>
          </tr>
        </tbody>
      </TableWrap>

      <p className="mt-6">
        <strong>
          A decomposição da demanda desenhou a arquitetura de páginas da Parte
          3.
        </strong>{" "}
        Não é a mesma coisa atacar produtos e atacar serviços: os subgrupos têm
        gaps diferentes e pedem fases diferentes.
      </p>

      <TableWrap>
        <thead>
          <tr>
            <th className={TH}>Subgrupo</th>
            <th className={`${TH} ${NUM}`}>Keywords</th>
            <th className={`${TH} ${NUM}`}>Volume</th>
            <th className={`${TH} ${NUM}`}>Participação</th>
            <th className={`${TH} ${NUM}`}>KD ponderado</th>
            <th className={`${TH} ${NUM}`}>Gap SEO</th>
            <th className={TH}>Atacado na</th>
          </tr>
        </thead>
        <tbody>
          {SUBGRUPOS.map(([nome, kw, vol, part, kd, gap, fase]) => (
            <tr key={nome}>
              <td className={TD}>{nome}</td>
              <td className={`${TD} ${NUM}`}>{kw}</td>
              <td className={`${TD} ${NUM}`}>{vol}</td>
              <td className={`${TD} ${NUM}`}>{part}</td>
              <td className={`${TD} ${NUM}`}>{kd}</td>
              <td className={`${TD} ${NUM}`}>{gap}</td>
              <td className={TD}>{fase}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <H4>Por que uma calculadora, e não mais um artigo</H4>

      <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6 marker:text-purple-600">
        <li>
          <strong>A intenção é de cálculo.</strong> &ldquo;Quanto cobrar por um
          bolo&rdquo; pede um número, não 1.800 palavras — e toda a cauda do
          cluster tem essa forma.
        </li>
        <li>
          <strong>A SERP não tem o formato.</strong> Uma ferramenta explícita em
          32 páginas relevantes. Competir em artigo é disputar o que já existe;
          em ferramenta, é estrear.
        </li>
        <li>
          <strong>A barreira é baixa, e a InfinitePay entra por cima.</strong>{" "}
          KD mediano 6,0, páginas concorrentes com UR mediano 11 e DR 68 contra
          51,5 de DR mediano no grupo. Não é preciso acumular autoridade para
          entrar: ela já existe e não está sendo usada aqui.
        </li>
        <li>
          <strong>A ponte com o produto é natural.</strong> Taxa de pagamento é
          campo do próprio cálculo: a InfinitePay aparece dentro do resultado,
          não em um banner ao lado.
        </li>
      </ol>

      <Callout tone="key" label="A mesma URL trabalha duas vezes">
        <p>
          Como <strong>ferramenta</strong>, gera uso recorrente e link natural.
          Como <strong>documento</strong> — fórmula, exemplo numérico, passos e
          FAQ em texto —, responde à SERP e é citável por answer engine. Um
          artigo faz só a segunda metade; um app em JavaScript, só a primeira.
        </p>
      </Callout>

      {/* ------------------------------- 1.5 ------------------------------- */}

      <H3 id="limitacoes">1.5 Limitações e vieses</H3>

      <p className="mt-4">
        Registradas porque mudam o peso da conclusão, não como ressalva
        protocolar.
      </p>

      <ol className="mt-4 flex list-decimal flex-col gap-3 pl-6 marker:text-purple-600">
        <li>
          <strong>Janela de 6 meses.</strong> O dataset é um recorte temporal,
          não a série histórica. Sazonalidade não é observável: keywords como
          &ldquo;quanto cobrar por um bolo&rdquo; podem ter picos que a janela
          não mostra, e o volume mensal é a média do período. Uma decisão real
          deveria olhar 12–24 meses antes de fixar prioridade.
        </li>
        <li>
          <strong>Concorrentes fictícios e URLs inacessíveis.</strong> Esta é a
          limitação mais relevante, porque atinge a afirmação mais forte da
          análise: o <strong>gap funcional de 100%</strong>. A natureza do
          conteúdo na SERP foi inferida de domínios, slugs,{" "}
          <Code>page_type</Code> e títulos, sem abrir uma única página. Em um
          cenário real, a validação da ausência de ferramenta na SERP é etapa
          obrigatória — e é a primeira coisa a refazer com dados reais.
        </li>
        <li>
          <strong>Volume não é clique.</strong> Não há CTR por posição no
          dataset. As colunas de tráfego são estimativas do próprio export e{" "}
          <strong>não foram usadas para dimensionar o gap</strong> — só como
          contexto.
        </li>
        <li>
          <strong>
            <Code>organic-keywords.csv</Code> registra a melhor posição de cada
            domínio presente, não a SERP completa.
          </strong>{" "}
          A ausência de um domínio na amostra não prova ausência na SERP real;
          prova ausência na amostra. Isso pesa mais agora que se conhece o
          tamanho real do domínio-alvo: a amostra traz 37 das ~1.900 keywords
          orgânicas da InfinitePay, cerca de 2%. O gap de 97,9% é medido dentro
          do recorte e deve ser lido assim.
        </li>
        <li>
          <strong>
            <Code>top-pages.csv</Code> é amostra parcial.
          </strong>{" "}
          UR e domínios de referência descrevem apenas as páginas que o
          cruzamento alcançou — 32, no recorte de precificação.
        </li>
        <li>
          <strong>
            Utility Fit, Business Fit e Effort são julgamentos, não medições.
          </strong>{" "}
          O score <strong>ordena hipóteses; não prevê tráfego</strong>. Alterar
          uma nota altera o ranking, e por isso as notas estão no código,
          versionadas e auditáveis, em vez de terem sido aplicadas mentalmente.
        </li>
        <li>
          <strong>
            O ICP vem de pesquisa generalista sobre PMEs brasileiras
          </strong>
          , não de dado proprietário da InfinitePay. Em um cenário real seria
          substituído por dados de CRM, base ativa e entrevistas — o que
          provavelmente mudaria mais de uma nota de business fit.
        </li>
      </ol>
    </>
  );
}
