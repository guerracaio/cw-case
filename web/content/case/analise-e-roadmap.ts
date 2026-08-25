/**
 * Dados do documento do case.
 *
 * Estavam como constantes locais dentro de cada `part-*.tsx`. Saíram de lá
 * quando o modo Apresentação virou um segundo consumidor: dois lugares
 * renderizando os mesmos números a partir de duas cópias divergem na primeira
 * correção que alguém esquecer de replicar.
 *
 * É o mesmo princípio das funções de cálculo da calculadora — o exemplo
 * publicado sai da mesma fonte que a ferramenta usa.
 */

/** Etapa: número, nome, pergunta, conclusão, e se é a que decidiu. */
export type Etapa = readonly [string, string, string, string, boolean];

export const ETAPAS: readonly Etapa[] = [
  ["1", "Mapear demanda", "Onde existe demanda de busca comprovada?", "Volume bruto não serve como critério", false],
  ["2", "Identificar utility intent", "Quais demandas são de fazer, não de aprender?", "Sobram mais candidatos do que capacidade de execução", false],
  ["3", "Encontrar gaps competitivos", "Quais estão mal atendidas pelos concorrentes?", "Gap alto isolado também engana", false],
  ["4", "Priorizar oportunidade de SEO", "Quais combinam demanda, utility fit e brecha?", "Falta a dimensão de negócio", false],
  ["5", "Validar business fit", "Quais têm aderência ao negócio e lead bridge?", "Falta o custo de execução", false],
  ["6", "Avaliar esforço e escolher", "Qual tem a melhor relação potencial/dificuldade?", "Calculadora de preços", true],
] as const;

/** Hipótese: #, nome, volume, gap, utility, business, esforço, score, escolhida. */
export type Hipotese = readonly [
  string, string, string, string, string, string, string, string, boolean,
];

export const RANKING: readonly Hipotese[] = [
  ["1", "Calculadora de preços de produtos e serviços", "41.040", "97,9%", "5", "3", "3", "200.800", true],
  ["2", "Gerador de QR Code", "40.000", "55,0%", "5", "3", "2", "165.000", false],
  ["3", "Comparador de maquininhas", "81.866", "40,0%", "4", "5", "4", "163.880", false],
  ["4", "Planilha de vendas", "2.900", "100,0%", "5", "3", "1", "43.500", false],
  ["5", "Simulador de antecipação de recebíveis", "18.290", "73,8%", "5", "1", "3", "22.483", false],
  ["6", "Simulador de descontos", "1.610", "45,3%", "5", "3", "2", "5.475", false],
  ["7", "Diagnóstico de prontidão para crédito", "4.118", "100,0%", "4", "1", "4", "4.118", false],
] as const;

/** Subgrupo: nome, keywords, volume, participação, KD ponderado, gap, fase. */
export type Subgrupo = readonly [
  string, string, string, string, string, string, string,
];

export const SUBGRUPOS: readonly Subgrupo[] = [
  ["Precificação geral de produtos", "9", "25.150", "61,3%", "5,5", "96,5%", "Fase 1"],
  ["Casos por profissão ou operação", "5", "9.980", "24,3%", "7,8", "100,0%", "Fase 2"],
  ["Precificação geral de serviços", "4", "4.640", "11,3%", "9,4", "100,0%", "Fase 2"],
  ["Modelos específicos de negócio", "3", "1.270", "3,1%", "2,6", "100,0%", "Residual"],
] as const;

export const CHECKLIST_SEO: readonly string[] = [
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

export const CHECKLIST_AEO: readonly string[] = [
  "responder perguntas diretamente",
  "usar headings em formato de perguntas reais",
  "criar definições curtas e objetivas",
  "incluir FAQs alinhadas às dúvidas reais de busca",
  "mostrar fórmulas explicitamente",
  "usar exemplos numéricos",
  "estruturar passos",
];

export const EVENTOS: ReadonlyArray<readonly [string, string]> = [
  ["page_view", "carregamento da página"],
  ["tool_click", "interação inicial com a ferramenta"],
  ["tool_start", "primeiro campo preenchido"],
  ["tool_complete", "resultado gerado"],
  ["lead_cta_click", "clique no CTA que abre o formulário"],
  ["lead_generated", "submissão válida do formulário"],
  ["site_cta_click", "clique em link que leva para fora do site"],
];

/** Página satélite: ordem, URL, keywords-alvo, volume, formato, é a ferramenta. */
export type Pagina = readonly [string, string, string, string, string, boolean];

export const FASE_1_PAGINAS: readonly Pagina[] = [
  ["1", "/blog/precificacao/", "precificacao · precificacao de produtos", "18.700", "Editorial", false],
  ["2", "/blog/como-precificar-um-produto/", "como precificar um produto", "4.100", "Editorial", false],
  ["3", "/blog/formacao-preco-venda/", "formacao de preco de venda · preco de venda formula", "640", "Editorial", false],
  ["—", "/ferramentas/calculadora-de-precos/", "calculadora de preco de venda · como calcular preco de venda", "1.090", "Ferramenta + informacional", true],
] as const;

export const FASE_2_PAGINAS: ReadonlyArray<
  readonly [string, string, string, string, string]
> = [
  ["4", "/blog/precificacao-de-servicos/", "precificacao de servicos · quanto cobrar por um servico", "2.500", "Editorial"],
  ["5", "/blog/quanto-cobrar-por-hora-de-trabalho/", "quanto cobrar por hora de trabalho", "1.600", "Editorial"],
  ["6", "/blog/calcular-preco-por-quilo/", "calcular preco por quilo", "540", "Editorial/utilitário"],
  ["7", "/blog/quanto-cobrar-por-unha/", "quanto cobrar por unha", "3.100", "Editorial/utilitário"],
  ["8", "/blog/quanto-cobrar-por-um-bolo/", "quanto cobrar por um bolo", "2.400", "Editorial/utilitário"],
  ["9", "/blog/quanto-cobrar-por-corte-de-cabelo/", "quanto cobrar por corte de cabelo", "2.200", "Editorial/utilitário"],
  ["10", "/blog/quanto-cobrar-por-marmita/", "quanto cobrar por marmita", "1.400", "Editorial/utilitário"],
  ["11", "/blog/quanto-cobrar-por-frete-proprio/", "quanto cobrar por frete proprio", "880", "Editorial/utilitário"],
] as const;

export const FASE_3: ReadonlyArray<readonly [string, string]> = [
  ["Identificar páginas com tração", "impressões crescendo, rankings entre as posições 1 e 20, aumento de cliques, primeiras referências em AI e answer engines."],
  ["Priorizar vencedores", "maior combinação de demanda, posição atual, CTR, potencial de avanço e contribuição para o uso da ferramenta."],
  ["Atualizar conteúdo", "melhorar a cobertura da intenção, adicionar exemplos, FAQs, dados e respostas faltantes, reforçar trechos que já aparecem para novas buscas."],
  ["Melhorar CTR", "testar title, ajustar meta description, alinhar o resultado da SERP ao conteúdo real."],
  ["Reforçar internal linking", "mais links internos para páginas com potencial, com âncoras mais descritivas."],
  ["Intensificar autoridade externa", "ampliar backlinks, buscar menções de marca, divulgar a calculadora como recurso útil e priorizar páginas que já demonstraram tração."],
  ["Revisar AEO", "melhorar respostas diretas, reforçar entidades e fontes, atualizar FAQs, tornar fórmulas, dados e exemplos mais citáveis."],
  ["Reavaliar páginas fracas", "atualizar, reposicionar a intenção, consolidar com outra URL quando houver sobreposição, e parar de investir igualmente em páginas sem sinal de resposta."],
];

export const FASE_4: ReadonlyArray<readonly [string, string]> = [
  ["Identificar gargalos do funil", "página satélite → ferramenta, tool start, tool completion, CTA → formulário, formulário → lead."],
  ["Testar CTAs", "copy, posicionamento, frequência e formato."],
  ["Otimizar a lead bridge", "testar o momento da captura, o benefício oferecido e, acima de tudo, evitar bloquear valor cedo demais."],
  ["Melhorar a UX da ferramenta", "reduzir etapas, simplificar campos, deixar cálculo e resultado mais claros, melhorar a experiência mobile."],
  ["Otimizar o formulário", "reduzir campos desnecessários, melhorar labels e mensagens, testar captura progressiva quando fizer sentido."],
  ["Executar testes A/B", "CTA, proposta de valor, layout, lead bridge e formulário."],
  ["Avaliar a qualidade da conversão", "lead rate, conversão por página de origem e por tipo de intenção."],
  ["Aplicar aprendizados", "escalar variações vencedoras, corrigir os pontos de maior abandono e priorizar as otimizações de maior impacto."],
];

/**
 * Os números do sumário executivo. Também são os cartões do slide de abertura
 * da apresentação.
 */
export const NUMEROS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "41.040", label: "buscas/mês no escopo" },
  { value: "5.342", label: "visitas/mês estimadas no escopo — 45% do tráfego atual do site" },
  { value: "97,9%", label: "de gap SEO ponderado por volume" },
  { value: "100%", label: "de gap funcional — nenhuma calculadora" },
  { value: "6,0", label: "de KD mediano" },
  { value: "DR 68", label: "do domínio-alvo, contra 51,5 de DR mediano dos concorrentes" },
  { value: "11 + 1", label: "páginas satélite e a ferramenta" },
  { value: "95,4%", label: "de cobertura ao fim da Fase 2" },
];

/** Os três CSVs, como estão em `dataset/`. */
export const FONTES: ReadonlyArray<readonly [string, string, string]> = [
  ["organic-keywords.csv", "409", "keyword, volume, KD, CPC, tráfego, melhor posição e URL por domínio"],
  ["top-pages.csv", "406", "URL, tráfego, keywords, UR, domínios de referência"],
  ["organic-competitors.csv", "14", "domínio, DR, keywords em comum, share, tráfego, páginas"],
];

/** O perfil orgânico do domínio-alvo, fornecido junto com os CSVs. */
export const DOMINIO_ALVO: ReadonlyArray<readonly [string, string]> = [
  ["68", "Domain Rating"],
  ["~1.900", "keywords orgânicas"],
  ["380", "páginas rankeando"],
  ["12.000", "visitas orgânicas/mês"],
];

/**
 * O afunilamento da análise, etapa a etapa. `width` é a largura da barra na
 * apresentação — proporcional ao que sobra, não ao volume absoluto, porque a
 * última barra some se for 41.040 sobre 1.558.773.
 */
export const FUNIL: ReadonlyArray<{
  label: string;
  value: string;
  width: string;
}> = [
  { label: "Universo mapeado · 26 clusters", value: "1.558.773 buscas/mês", width: "100%" },
  { label: "Sem demanda de marca · 21 clusters", value: "1.213.173", width: "78%" },
  { label: "Hipóteses de ferramenta com escopo próprio", value: "7", width: "50%" },
  { label: "Escolhida", value: "41.040", width: "28%" },
];

/** As ações da Fase 1, na ordem do roadmap. */
export const FASE_1: readonly string[] = [
  "Definir a arquitetura de páginas satélite focadas em precificação de produtos.",
  "Publicar a ferramenta.",
  "Criar as primeiras páginas prioritárias por intenção e keyword.",
  "Otimizar titles, headings, links internos e schema.",
  "Modelar o conteúdo para estrutura AEO — respostas diretas, entidades e FAQs.",
  "Criar os links entre as páginas satélite e a ferramenta.",
  "Configurar GA4, GSC e os eventos de conversão.",
];

/** As ações da Fase 2. */
export const FASE_2: readonly string[] = [
  "Priorizar os gaps de cobertura remanescentes.",
  "Publicar a segunda leva de satélites — serviços e casos por profissão.",
  "Manter a estrutura de conteúdo AEO da Parte 2.",
  "Iniciar distribuição e prospecção de backlinks e menções.",
];

/**
 * O roadmap inteiro numa estrutura só: janela, objetivo e o que fazer.
 *
 * As Fases 3 e 4 derivam os bullets do título de cada ação já declarada acima
 * — o documento mostra o detalhe, a apresentação mostra só o rótulo, e as
 * duas leem da mesma lista.
 */
export const ROADMAP: ReadonlyArray<{
  janela: string;
  nome: string;
  objetivo: string;
  acoes: readonly string[];
  paralelo: boolean;
}> = [
  {
    janela: "Dias 1 a 30",
    nome: "Fase 1",
    objetivo: "Construir os ativos de aquisição e a ferramenta",
    acoes: FASE_1,
    paralelo: false,
  },
  {
    janela: "Dias 31 a 60",
    nome: "Fase 2",
    objetivo: "Expandir cobertura SEO + AEO",
    acoes: FASE_2,
    paralelo: false,
  },
  {
    janela: "Dias 61 a 90",
    nome: "Fase 3",
    objetivo: "Ganhar autoridade e otimizar vencedores",
    acoes: FASE_3.map(([titulo]) => titulo),
    paralelo: false,
  },
  {
    janela: "Dias 61 a 90",
    nome: "Fase 4",
    objetivo: "Focar em CRO",
    acoes: FASE_4.map(([titulo]) => titulo),
    paralelo: true,
  },
];

/**
 * As limitações que mudam o peso da conclusão. A apresentação mostra as seis
 * em duas colunas — o que identifiquei e como lidei —, sem a prosa completa
 * que está no documento.
 */
export const LIMITACOES: ReadonlyArray<{
  o_que: string;
  como: string;
  principal: boolean;
}> = [
  {
    o_que: "Concorrentes fictícios, URLs inacessíveis",
    como: "Atinge a afirmação mais forte da análise — o gap funcional de 100%. A natureza do conteúdo na SERP foi inferida de domínio, slug, page_type e título, sem abrir uma página. É a primeira coisa a refazer com dados reais.",
    principal: true,
  },
  {
    o_que: "Janela de 6 meses",
    como: "Sazonalidade não é observável. O volume mensal é a média do período, nunca previsão. Uma decisão real olharia 12 a 24 meses.",
    principal: false,
  },
  {
    o_que: "A amostra é uma fatia fina do domínio",
    como: "37 das ~1.900 keywords orgânicas, cerca de 2%. Ausência na amostra não prova ausência na SERP — o gap de 97,9% é medido dentro do recorte.",
    principal: false,
  },
  {
    o_que: "Volume não é clique",
    como: "Não há CTR por posição no dataset. As estimativas de tráfego não foram usadas para dimensionar o gap, só como contexto.",
    principal: false,
  },
  {
    o_que: "Utility, Business e Effort são julgamento",
    como: "O score ordena hipóteses; não prevê tráfego. As notas estão no código, versionadas e auditáveis.",
    principal: false,
  },
  {
    o_que: "O ICP vem de pesquisa generalista",
    como: "Não é dado proprietário da InfinitePay. Num cenário real seria substituído por CRM, base ativa e entrevistas.",
    principal: false,
  },
];
