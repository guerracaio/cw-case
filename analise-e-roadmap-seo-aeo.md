# Análise e roadmap SEO + AEO

**Calculadora de preços de produtos e serviços**

Este documento cobre o caminho inteiro: como o dataset foi analisado, por que a calculadora de preços foi a ferramenta escolhida e o que fazer nos primeiros 90 dias depois de publicá-la.

> **Nota de escopo.** A análise usa um dataset fornecido no case, com concorrentes fictícios e janela de 6 meses. As limitações estão em [1.5](#15-limitações-e-vieses) e mudam o peso de mais de uma conclusão.

---

## Sumário

- [Sumário executivo](#sumário-executivo)
- **[Parte 1 · A análise](#parte-1--a-análise)**
  - [1.1 Fonte de dados](#11-fonte-de-dados)
  - [1.2 Ferramentas e divisão de trabalho](#12-ferramentas-e-divisão-de-trabalho)
  - [1.3 As seis etapas](#13-as-seis-etapas)
  - [1.4 A decisão e sua evidência](#14-a-decisão-e-sua-evidência)
  - [1.5 Limitações e vieses](#15-limitações-e-vieses)
- **[Parte 2 · O padrão de publicação](#parte-2--o-padrão-de-publicação)**
  - [2.1 Checklist SEO](#21-checklist-seo)
  - [2.2 Checklist AEO](#22-checklist-aeo)
  - [2.3 O que medir desde o início](#23-o-que-medir-desde-o-início)
- **[Parte 3 · O roadmap dos 90 dias](#parte-3--o-roadmap-dos-90-dias)**
  - [3.1 Visão geral](#31-visão-geral)
  - [3.2 Fase 1 · Construir os ativos de aquisição e a ferramenta](#32-fase-1--construir-os-ativos-de-aquisição-e-a-ferramenta)
  - [3.3 Fase 2 · Expandir cobertura SEO + AEO](#33-fase-2--expandir-cobertura-seo--aeo)
  - [3.4 Fase 3 · Ganhar autoridade e otimizar vencedores](#34-fase-3--ganhar-autoridade-e-otimizar-vencedores)
  - [3.5 Fase 4 · Focar em CRO](#35-fase-4--focar-em-cro)
- [Apêndice · Como reproduzir a análise](#apêndice--como-reproduzir-a-análise)

---

## Sumário executivo

**O achado.** Dentro de um universo de 1.558.773 buscas mensais, o cluster de *precificação, custos e margens* concentra uma demanda que pede uma ferramenta e recebe apenas artigos. No recorte de 21 keywords que uma calculadora de preços atenderia — 41.040 buscas/mês —, **97,9% do volume não tem ranking da InfinitePay** e **nenhuma calculadora de preço foi identificada** entre os concorrentes: uma única ferramenta explícita em 32 páginas relevantes. A dificuldade é baixa (KD mediano 6,0) e as páginas que ocupam as posições são fracas (UR mediano 11, 2 domínios de referência).

**A decisão.** Construir a **calculadora de preços de produtos e serviços** em `/ferramentas/calculadora-de-precos/`, como página que é ferramenta e documento indexável ao mesmo tempo. Ela venceu seis outras hipóteses num score que combina demanda, gap, aderência de formato, aderência de negócio e esforço — detalhado em [1.3](#etapa-6--avaliar-esforço-e-escolher).

**O tamanho da aposta e o ponto de largada.** As 21 keywords do escopo movimentam **5.342 visitas/mês estimadas** entre os concorrentes — cerca de **45% de todo o tráfego orgânico atual da InfinitePay** (12.000 visitas/mês). E o domínio chega com **DR 68**, acima de cinco dos seis concorrentes do recorte. Nenhum desses números é previsão de captura; juntos, dão a ordem de grandeza da oportunidade e a posição de largada.

**O plano.** Quatro fases em 90 dias: construir os ativos de aquisição e a ferramenta; expandir a cobertura para serviços e casos por profissão; ganhar autoridade e dobrar a aposta no que mostrar tração; e otimizar a conversão. Ao fim da Fase 2, **95,4% do volume do escopo tem uma URL dedicada**.

| | |
|---|---:|
| Volume do escopo | 41.040 buscas/mês |
| Tráfego estimado do escopo | 5.342 visitas/mês — 45% do tráfego atual do site |
| Gap SEO ponderado por volume | 97,9% |
| Gap funcional (formato) | 100% |
| KD mediano | 6,0 |
| DR do domínio-alvo | 68, contra 51,5 de DR mediano dos concorrentes |
| Páginas planejadas em 90 dias | 11 satélites + 1 ferramenta |
| Cobertura ao fim da Fase 2 | 95,4% do volume do escopo |

---

# Parte 1 · A análise

Esta parte registra **a pergunta de cada etapa, o que foi medido para respondê-la e a conclusão que abriu a etapa seguinte**, com os arquivos do repositório em que cada resposta está registrada. A estrutura segue a convenção do memorando de método da pesquisa aplicada — pergunta, medição, achado, decisão —, com uma seção de limitações no padrão de *datasheet* de dataset e um apêndice de reprodutibilidade. O objetivo é permitir auditar a conclusão sem refazer a análise.

### O caminho em uma página

| # | Etapa | Pergunta | Artefato gerado | O que decidiu |
|---:|---|---|---|---|
| 1 | Mapear demanda | Onde existe demanda de busca comprovada? | `01_mapa_mercado.md` | Volume bruto não serve como critério |
| 2 | Identificar utility intent | Quais demandas são de *fazer*, não de *aprender*? | `02_mapa_conteudo_utilitario_mercado.md` · `03_relatorio_fit_conteudo_utilitario.md` | Sobram mais candidatos do que capacidade de execução |
| 3 | Encontrar gaps competitivos | Quais estão mal atendidas pelos concorrentes? | Cruzamento de posições, DR, UR e KD | Gap alto isolado também engana |
| 4 | Priorizar oportunidade de SEO | Quais combinam demanda, utility fit e brecha? | `04_relatorio_shortlist_ferramentas.md` | Falta a dimensão de negócio |
| 5 | Validar business fit | Quais têm aderência ao negócio e lead bridge? | ICP + notas de business fit | Falta o custo de execução |
| 6 | Avaliar esforço e escolher | Qual tem a melhor relação potencial/dificuldade? | `05_relatorio_gap_calculadora_precos.md` | **Calculadora de preços** |

---

## 1.1 Fonte de dados

Três arquivos em [`dataset/`](dataset/), fornecidos no case e **versionados sem qualquer alteração**:

| Arquivo | Linhas | O que traz |
|---|---:|---|
| `organic-keywords.csv` | 409 | keyword, volume, KD, CPC, tráfego, melhor posição e URL por domínio, flags de intenção |
| `top-pages.csv` | 406 | URL, tráfego, keywords, UR, domínios de referência, top keyword por página |
| `organic-competitors.csv` | 14 | domínio, DR, keywords em comum, share, tráfego, páginas |

**A janela é de 6 meses.** O dataset é um recorte temporal, não a série histórica das keywords. Isso condiciona tudo o que vem abaixo e está detalhado em [1.5](#15-limitações-e-vieses).

### O domínio-alvo

O case fornece, além dos CSVs, o perfil orgânico de `infinitepay.io`:

| Métrica | Valor |
|---|---:|
| Domain Rating | 68 |
| Keywords orgânicas | ~1.900 |
| Páginas rankeando | 380 |
| Tráfego orgânico | 12.000 visitas/mês |

Três desdobramentos, e um deles corta contra a análise:

**A InfinitePay entra por cima.** DR 68 é maior que o de cinco dos seis concorrentes do recorte de precificação. A exceção é `contazen.com.br` (DR 71), que cobre uma única keyword de 320 buscas e captura 9 visitas/mês. Contra os três domínios que efetivamente sustentam o cluster — `lojafacil.com.br` (54), `contadorexpress.com.br` (49) e `giroloja.com.br` (38) —, a diferença vai de 14 a 30 pontos.

**Há autoridade não convertida.** 12.000 visitas orgânicas distribuídas em 380 páginas dão cerca de 32 visitas por página ao mês. É pouco para um DR 68: a autoridade existe e não está sendo convertida em tráfego na proporção que ela permitiria — condição que favorece a entrada de páginas novas em keywords de baixa dificuldade.

**A amostra é uma fatia fina do domínio.** O dataset traz 37 keywords e 37 páginas da InfinitePay: cerca de **2% das ~1.900 keywords** e 10% das 380 páginas reais. Isso não invalida o gap medido — ele é calculado dentro do recorte, keyword a keyword —, mas limita o que a ausência prova. Ver [1.5](#15-limitações-e-vieses), item 4.

---

## 1.2 Ferramentas e divisão de trabalho

A análise foi feita com assistência de IA em duas frentes distintas, com papéis diferentes.

**Codex — pipeline de dados.** Usado para agrupar, filtrar, ordenar, refinar e sumarizar o dataset, com o objetivo de encurtar o tempo entre a pergunta e o número que a responde. **Nenhum dado de entrada foi alterado:** os três CSVs estão no repositório exatamente como recebidos, e toda agregação é reprodutível pelos scripts. O que o assistente produziu foram os **scripts Python** em [`generators/`](generators/), que leem os CSVs e escrevem relatórios em Markdown em [`outputs/seo-demand-maps/`](outputs/seo-demand-maps/).

Essa separação é deliberada: o relatório é um artefato determinístico e regenerável, não um resumo que a IA escreveu de memória. Se a agregação estiver errada, o erro está no script e é inspecionável.

**Gemini — pesquisa de ICP.** O dataset traz apenas dados quantitativos de SEO; não traz nada sobre quem é o público nem sobre o negócio. Para avaliar business fit foi feito um *deep research* sobre PMEs no Brasil, usado para desenhar um ICP e responder, por hipótese de ferramenta, se a dor pertence ao público que a InfinitePay atende e se o resultado da ferramenta leva a uma conversa natural sobre o produto.

**O que continuou humano:** os cortes de escopo, o agrupamento dos clusters, a leitura da natureza do conteúdo na SERP, as notas de utility fit, business fit e esforço, e a decisão final. As notas são julgamento declarado — estão no código, versionadas, e mudá-las muda o ranking.

| Camada | Onde vive | Papel |
|---|---|---|
| Dados de entrada | `dataset/` | Intocado |
| Agregação e relatórios | `generators/` → `outputs/` | Determinístico, regenerável |
| Interpretação e notas | Constantes nos scripts + este documento | Julgamento declarado |

---

## 1.3 As seis etapas

### Etapa 1 · Mapear demanda

> **Pergunta:** onde existe demanda de busca comprovada?

**O que foi medido.** Consolidação de todas as keywords únicas observadas na InfinitePay e nos 14 concorrentes, agrupadas em clusters por macrotema. Por cluster: volume mensal **deduplicado por keyword** (uma keyword que aparece em vários domínios soma uma vez só), tráfego orgânico estimado pela soma de `sum_traffic` por keyword e domínio, contagem de domínios distintos e de URLs distintas que rankeiam para ao menos uma keyword do cluster.

O agrupamento é determinístico e auditável keyword a keyword em `cluster_assignments.json`.

**Artefato:** [`outputs/seo-demand-maps/01_mapa_mercado.md`](outputs/seo-demand-maps/01_mapa_mercado.md), gerado por `generators/generate_demand_maps.py`.

**O que os dados mostraram.** 1.558.773 buscas/mês, 303 keywords únicas, 26 clusters, 14 concorrentes, 406 páginas. E, no topo da lista, um problema: entre os dez maiores clusters estão **Marca Banco Quantum** (152.400), **Marca Pagsfera** (98.500) e **Marca Banco Aurora** (71.000) — demanda navegacional pelo nome de concorrentes, que nenhuma página da InfinitePay vai capturar. Somando os cinco clusters de marca do recorte, são **345.600 buscas/mês inendereçáveis**, 22% do universo.

**Conclusão que abriu a etapa 2.** Volume bruto não é critério de priorização: o maior número da tabela é o mais inútil. Antes de comparar oportunidades é preciso filtrar o universo pela natureza da intenção.

---

### Etapa 2 · Identificar utility intent

> **Pergunta:** quais demandas representam usuários querendo **fazer** algo, e não apenas aprender?

**O que foi medido.** Três camadas, em ordem:

1. **Exclusão de demanda de marca e navegacional** — removidos os cinco clusters de marca identificados na etapa 1.
2. **Sinal explícito de utilidade** — a parcela do volume de cada cluster que está em keywords contendo termos como *calculadora*, *simulador*, *gerador*, *planilha*, *modelo*, *tabela* ou *inventário*. É um indicador de superfície: mede como a pessoa escreve, não o que ela precisa.
3. **Nota de utility fit (1–5)** — se a intenção geral do cluster é atendida por uma **ferramenta na SERP** ou por um artigo, avaliada acima da palavra usada na busca. A pergunta é qual formato resolve a busca, não quão fácil seria construir ou usar a ferramenta depois. Cada cluster recebe o formato recomendado junto da nota: ferramenta como experiência principal, ferramenta + guia, ou editorial com apoio utilitário.

**Artefatos:** [`02_mapa_conteudo_utilitario_mercado.md`](outputs/seo-demand-maps/02_mapa_conteudo_utilitario_mercado.md) e [`03_relatorio_fit_conteudo_utilitario.md`](outputs/seo-demand-maps/03_relatorio_fit_conteudo_utilitario.md), com as notas em `utility_fit_assessment.json`, gerados por `generators/generate_utility_fit_report.py`.

**O que os dados mostraram.** O recorte caiu para 1.213.173 buscas/mês em 21 clusters e 288 keywords. Quatro clusters receberam nota 5:

| Cluster | Volume/mês | Sinal explícito | Nota |
|---|---:|---:|---:|
| Calculadoras pessoais e trabalhistas | 326.780 | 100% | 5 |
| Utilitários online | 189.300 | 100% | 5 |
| **Precificação, custos e margens** | **72.164** | **3%** | **5** |
| Documentos e modelos empresariais | 14.300 | 61% | 5 |

O achado que mudou o critério: **o sinal explícito engana nos dois sentidos.** *Precificação* marca apenas 3% e ainda assim é nota 5 — porque "quanto cobrar por um bolo" é uma tarefa de cálculo escrita em linguagem natural, sem a palavra "calculadora". Na direção oposta, *Fiscal e tributário* marca **76%** e fica em 4, porque a demanda é por consultar tabela e regra por código, regime e operação, não por calcular. Priorizar pela palavra usada na busca teria descartado o cluster vencedor.

**Conclusão que abriu a etapa 3.** Restaram mais clusters com alto utility fit do que capacidade de construir e manter. Utility fit é condição necessária, não critério de desempate. O próximo corte tinha de ser competitivo.

---

### Etapa 3 · Encontrar gaps competitivos

> **Pergunta:** quais dessas demandas estão mal atendidas pelos concorrentes?

**O que foi medido.** Análise de gap no sentido técnico — não "quem tem mais conteúdo", mas quanto do volume está em disputa e com que solidez está ocupado:

- **Cobertura do alvo por keyword** — presença ou ausência de `infinitepay.io` e a melhor posição observada (`best_position`).
- **Gap SEO ponderado por volume** — soma do volume das keywords sem ranking do alvo ÷ volume total do recorte. Ponderar por volume evita que uma cauda longa de keywords minúsculas mascare a cobertura do que importa.
- **Força do domínio concorrente** — `domain_rating` de `organic-competitors.csv`.
- **Força da página que rankeia** — cruzamento de `best_position_url` com `top-pages.csv` para obter **UR** e **domínios de referência** da URL específica. É a métrica que decide se dá para ultrapassar: um DR alto com UR 11 na página que rankeia significa autoridade de domínio que não está sustentando aquele resultado.
- **Dificuldade da keyword** — KD por keyword, com distribuição (mínimo, mediana, média ponderada por volume, máximo) em vez de média simples.
- **Gap funcional** — se existe ou não uma URL de **ferramenta** entre as páginas que rankeiam. Um cluster pode ter gap SEO baixo e gap de formato alto: todo mundo cobre o assunto, ninguém resolve a tarefa.

**Aqui está a inferência mais frágil da análise, e ela é declarada.** Os concorrentes são fictícios e as URLs não são acessíveis. A natureza do conteúdo na SERP — editorial ou ferramenta — foi **inferida** a partir do padrão do domínio, do slug da URL, do campo `page_type` e do título da top keyword de cada página. É leitura de indício, não verificação. Em um cenário real, abrir as SERPs seria etapa obrigatória antes de decidir.

**O que os dados mostraram.** No recorte de precificação: 6 concorrentes com DR entre 29 e 71 (mediana 51,5), mas as 32 páginas relevantes cruzadas com `top-pages.csv` têm **UR mediano 11 e 2 domínios de referência** — páginas fracas sustentadas por domínios razoáveis. KD mediano 6,0. E **uma única ferramenta explícita em 32 páginas**: a SERP observada é quase toda editorial.

**E o domínio-alvo chega por cima.** Com DR 68, a InfinitePay está 16,5 pontos acima do DR mediano do grupo e acima de cinco dos seis concorrentes. A combinação — KD mediano 6,0, páginas ocupantes com UR mediano 11 e um domínio-alvo mais forte que os incumbentes que sustentam o cluster — descreve uma demanda que não está protegida por autoridade. DR não garante posição; define de onde se parte. Aqui, o custo de entrada é essencialmente o custo de publicar bem.

**Conclusão que abriu a etapa 4.** Gap alto isolado também engana: clusters minúsculos costumam ter 100% de gap simplesmente porque ninguém se importa com eles. Demanda, utility fit e gap precisavam entrar na mesma conta — e a conta precisava ser feita sobre o **escopo de uma ferramenta concreta**, não sobre um cluster inteiro do mapa.

---

### Etapa 4 · Priorizar oportunidade de SEO

> **Pergunta:** quais oportunidades combinam melhor demanda, utility fit e brecha competitiva?

**O que foi medido.** Sete hipóteses de ferramenta foram definidas, cada uma com um **escopo explícito de keywords** — o recorte é o do produto que se pretende construir, não o do cluster. Uma calculadora de preços não atende "curva ABC de estoque" só porque as duas caem em *Gestão*.

Por hipótese: volume do escopo, volume em gap, gap SEO ponderado, número de concorrentes, DR médio dos concorrentes, KD médio das keywords e tráfego estimado. A fórmula de ordenação:

```
Opportunity = Demand × Gap SEO × Utility Fit × Business Fit ÷ Effort
```

Demand e Gap SEO vêm do dataset. **Utility Fit** (o formato que a intenção do cluster pede), **Business Fit** (a ligação entre o resultado da ferramenta e o produto) e **Effort** (o custo de construir e manter) são notas declaradas de 1 a 5, fixadas no código do gerador.

**Artefato:** [`04_relatorio_shortlist_ferramentas.md`](outputs/seo-demand-maps/04_relatorio_shortlist_ferramentas.md), gerado por `generators/generate_shortlist_report.py`.

**O que os dados mostraram.** Considerando apenas demanda, gap e utility fit, o topo ficou apertado: a calculadora de preços (41.040 buscas, 97,9% de gap) e o comparador de maquininhas (81.866 buscas, 40% de gap) chegam próximos por caminhos opostos — muito volume parcialmente ocupado contra menos volume quase inteiramente livre.

**Conclusão que abriu a etapa 5.** As três variáveis vindas do dataset não sabem nada sobre o negócio. Uma ferramenta pode ter demanda perfeita e gap perfeito para um público que não é cliente, ou entregar um resultado que não leva a lugar nenhum. Faltava a dimensão de aderência.

---

### Etapa 5 · Validar business fit

> **Pergunta:** quais oportunidades têm maior aderência ao negócio e melhor lead bridge?

**O que foi medido.** O dataset não traz dado qualitativo sobre público. Para não atribuir notas por intuição, foi feito um **deep research sobre PMEs no Brasil com o Gemini** e desenhado um ICP a partir dele — porte, natureza da operação, dores financeiras recorrentes e relação com meios de pagamento. Esse ICP foi então usado como régua para responder duas perguntas por hipótese:

1. **Aderência de público** — a dor pertence à PME que a InfinitePay atende, ou é de um público adjacente?
2. **Lead bridge** — o resultado da ferramenta leva naturalmente a uma conversa sobre o produto, ou exige um salto artificial do tipo "e por falar nisso, conheça nossa maquininha"?

A resposta virou a nota de **Business Fit (1–5)**, registrada por hipótese no gerador da shortlist.

**O que os dados mostraram.** A distribuição das notas separa três grupos:

| Nota | Hipóteses | Leitura |
|---:|---|---|
| 5 | Comparador de maquininhas | A ferramenta *é* a decisão de compra do produto |
| 3 | Calculadora de preços, Gerador de QR Code, Simulador de descontos, Planilha de vendas | Ponte natural: a taxa de pagamento é campo do próprio cálculo, mas a ferramenta não vende a maquininha |
| 1 | Simulador de antecipação, Diagnóstico de crédito | Produto adjacente; a ponte existe, mas é longa no recorte analisado |

**Conclusão que abriu a etapa 6.** Business fit sozinho elegeria o comparador de maquininhas por larga margem. Mas construir e **manter** um comparador é outra ordem de grandeza de trabalho — ele depende de uma tabela de taxas de terceiros que precisa continuar correta indefinidamente, sob pena de virar passivo. Sem o custo na conta, a priorização estaria incompleta.

---

### Etapa 6 · Avaliar esforço e escolher

> **Pergunta:** qual oportunidade oferece a melhor relação entre potencial e dificuldade de execução?

**O que foi medido.** Nota de **Effort (1–5)** por hipótese, considerando complexidade do modelo de cálculo, dependência de dado externo que exija manutenção contínua e superfície de manutenção depois de publicada. O esforço entra no denominador da fórmula.

**O que os dados mostraram.**

| # | Hipótese | Volume | Gap SEO | Utility | Business | Esforço | Opportunity |
|---:|---|---:|---:|---:|---:|---:|---:|
| **1** | **Calculadora de preços de produtos e serviços** | **41.040** | **97,9%** | **5** | **3** | **3** | **200.800** |
| 2 | Gerador de QR Code | 40.000 | 55,0% | 5 | 3 | 2 | 165.000 |
| 3 | Comparador de maquininhas | 81.866 | 40,0% | 4 | 5 | 4 | 163.880 |
| 4 | Planilha de vendas | 2.900 | 100,0% | 5 | 3 | 1 | 43.500 |
| 5 | Simulador de antecipação de recebíveis | 18.290 | 73,8% | 5 | 1 | 3 | 22.483 |
| 6 | Simulador de descontos | 1.610 | 45,3% | 5 | 3 | 2 | 5.475 |
| 7 | Diagnóstico de prontidão para crédito | 4.118 | 100,0% | 4 | 1 | 4 | 4.118 |

As duas derrotas explicam a escolha melhor do que a vitória:

- **O comparador de maquininhas** tem o dobro do volume e a melhor nota de negócio, e mesmo assim fica em terceiro. Perde por gap — 60% do volume já tem ranking da InfinitePay, então o volume adicional é menor do que parece — e por esforço, sendo a única hipótese cuja manutenção é permanente.
- **O gerador de QR Code** tem volume praticamente igual ao da calculadora e o menor esforço da faixa alta, mas 45% do volume já tem ranking da InfinitePay — sobram 22.000 buscas contra 40.160.

A calculadora vence por ser a única que combina **volume relevante com o volume quase inteiramente livre**, num formato que a SERP observada não oferece, a um esforço de construção contido.

---

## 1.4 A decisão e sua evidência

Antes de fechar, o escopo escolhido passou por um relatório dedicado, keyword a keyword: [`05_relatorio_gap_calculadora_precos.md`](outputs/seo-demand-maps/05_relatorio_gap_calculadora_precos.md), gerado por `generators/generate_pricing_gap_report.py`.

| Evidência | Resultado |
|---|---:|
| Keywords do escopo | 21 |
| Volume total | 41.040 |
| Gap SEO ponderado | 97,9% — 40.160 buscas sem ranking |
| Cobertura atual da InfinitePay | 1 keyword, posição 34, artigo (não ferramenta) |
| Gap funcional | 100% — nenhuma calculadora de preço no dataset |
| KD mediano | 6,0 — 92,9% do volume com KD ≤ 10 |
| Ferramenta explícita entre concorrentes | 1 página em 32 |

**A decomposição da demanda desenhou a arquitetura de páginas da Parte 3.** Não é a mesma coisa atacar produtos e atacar serviços: os subgrupos têm gaps diferentes e pedem fases diferentes.

| Subgrupo | Keywords | Volume | Participação | KD ponderado | Gap SEO | Atacado na |
|---|---:|---:|---:|---:|---:|---|
| Precificação geral de produtos | 9 | 25.150 | 61,3% | 5,5 | 96,5% | Fase 1 |
| Casos por profissão ou operação | 5 | 9.980 | 24,3% | 7,8 | 100,0% | Fase 2 |
| Precificação geral de serviços | 4 | 4.640 | 11,3% | 9,4 | 100,0% | Fase 2 |
| Modelos específicos de negócio | 3 | 1.270 | 3,1% | 2,6 | 100,0% | Residual |

**Por que uma calculadora, e não mais um artigo.** Quatro razões, todas verificáveis acima:

1. **A intenção é de cálculo.** "Quanto cobrar por um bolo" pede um número, não 1.800 palavras — e toda a cauda do cluster tem essa forma.
2. **A SERP não tem o formato.** Uma ferramenta explícita em 32 páginas relevantes. Competir em artigo é disputar o que já existe; em ferramenta, é estrear.
3. **A barreira é baixa, e a InfinitePay entra por cima.** KD mediano 6,0, páginas concorrentes com UR mediano 11 e DR 68 contra 51,5 de DR mediano no grupo. Não é preciso acumular autoridade para entrar: ela já existe e não está sendo usada aqui.
4. **A ponte com o produto é natural.** Taxa de pagamento é campo do próprio cálculo: a InfinitePay aparece dentro do resultado, não em um banner ao lado.

E a mesma URL trabalha duas vezes: como **ferramenta**, gera uso recorrente e link natural; como **documento** — fórmula, exemplo numérico, passos e FAQ em texto —, responde à SERP e é citável por answer engine. Um artigo faz só a segunda metade; um app em JavaScript, só a primeira.

---

## 1.5 Limitações e vieses

Registradas porque mudam o peso da conclusão, não como ressalva protocolar.

1. **Janela de 6 meses.** O dataset é um recorte temporal, não a série histórica. Sazonalidade não é observável: keywords como "quanto cobrar por um bolo" podem ter picos que a janela não mostra, e o volume mensal é a média do período. Uma decisão real deveria olhar 12–24 meses antes de fixar prioridade.

2. **Concorrentes fictícios e URLs inacessíveis.** Esta é a limitação mais relevante, porque atinge a afirmação mais forte da análise: o **gap funcional de 100%**. A natureza do conteúdo na SERP foi inferida de domínios, slugs, `page_type` e títulos, sem abrir uma única página. Em um cenário real, a validação da ausência de ferramenta na SERP é etapa obrigatória — e é a primeira coisa a refazer com dados reais.

3. **Volume não é clique.** Não há CTR por posição no dataset. As colunas de tráfego são estimativas do próprio export e **não foram usadas para dimensionar o gap** — só como contexto.

4. **`organic-keywords.csv` registra a melhor posição de cada domínio presente, não a SERP completa.** A ausência de um domínio na amostra não prova ausência na SERP real; prova ausência na amostra. Isso pesa mais agora que se conhece o tamanho real do domínio-alvo: a amostra traz 37 das ~1.900 keywords orgânicas da InfinitePay, cerca de 2%. O gap de 97,9% é medido dentro do recorte e deve ser lido assim.

5. **`top-pages.csv` é amostra parcial.** UR e domínios de referência descrevem apenas as páginas que o cruzamento alcançou — 32, no recorte de precificação.

6. **Utility Fit, Business Fit e Effort são julgamentos, não medições.** O score **ordena hipóteses; não prevê tráfego**. Alterar uma nota altera o ranking, e por isso as notas estão no código, versionadas e auditáveis, em vez de terem sido aplicadas mentalmente.

7. **O ICP vem de pesquisa generalista sobre PMEs brasileiras**, não de dado proprietário da InfinitePay. Em um cenário real seria substituído por dados de CRM, base ativa e entrevistas — o que provavelmente mudaria mais de uma nota de business fit.

---

# Parte 2 · O padrão de publicação

As três listas abaixo valem para **todas as onze páginas satélite e para a página da ferramenta**, em todas as fases. Elas estão aqui, e não dentro da Fase 1, porque não são tarefa de um mês: são a definição de pronto do projeto inteiro.

## 2.1 Checklist SEO

Para cada página:

- `robots.txt`, sitemap e HTTPS
- query primária definida
- intenção definida
- `title`
- H1
- URL
- headings
- meta description
- canonical
- conteúdo indexável
- links internos
- schema pertinente
- Core Web Vitals, especialmente mobile

## 2.2 Checklist AEO

Para cada página:

- responder perguntas diretamente
- usar headings em formato de perguntas reais
- criar definições curtas e objetivas
- incluir FAQs alinhadas às dúvidas reais de busca
- mostrar fórmulas explicitamente
- usar exemplos numéricos
- estruturar passos

## 2.3 O que medir desde o início

Sem os eventos no ar desde a Fase 1, a Fase 4 não tem em que trabalhar: otimizar um funil que ninguém instrumentou é adivinhar.

**O que acompanhar:** pageviews · navegação da página satélite para a ferramenta · início do preenchimento na calculadora · resultado gerado · captura do lead.

| Evento | Quando dispara |
|---|---|
| `page_view` | carregamento da página |
| `tool_click` | interação inicial com a ferramenta |
| `tool_start` | primeiro campo preenchido |
| `tool_complete` | resultado gerado |
| `lead_cta_click` | clique no CTA que abre o formulário |
| `lead_generated` | submissão válida do formulário |
| `site_cta_click` | clique em link que leva para fora do site |


---

# Parte 3 · O roadmap dos 90 dias

## 3.1 Visão geral

A estratégia parte do princípio de que **as páginas de aquisição atraem a demanda orgânica, enquanto a ferramenta concentra a ativação e a conversão em lead**. A sequência não é arbitrária: sem tráfego não há o que otimizar, e sem dado de tração a priorização vira palpite.

| Janela | Fase | Objetivo |
|---|---|---|
| Dias 1 a 30 | **Fase 1** | Construir os ativos de aquisição e a ferramenta |
| Dias 31 a 60 | **Fase 2** | Expandir cobertura SEO + AEO |
| Dias 61 a 90 | **Fase 3** | Ganhar autoridade e otimizar vencedores |
| Dias 61 a 90 | **Fase 4** | Focar em CRO — em paralelo com a Fase 3 |

As Fases 3 e 4 correm juntas porque atacam pontas opostas do mesmo funil: uma amplia a entrada, a outra trabalha a saída.

---

## 3.2 Fase 1 · Construir os ativos de aquisição e a ferramenta

**Dias 1 a 30.**

1. Definir a arquitetura de páginas satélite focadas em precificação de produtos.
2. Publicar a ferramenta.
3. Criar as primeiras páginas prioritárias por intenção e keyword.
4. Otimizar titles, headings, links internos e schema.
5. Modelar o conteúdo para estrutura AEO — respostas diretas, entidades e FAQs.
6. Criar os links entre as páginas satélite e a ferramenta.
7. Configurar GA4 (ou outra ferramenta de tracking), GSC e os eventos de conversão.

### Arquitetura publicada na fase

O subgrupo de **precificação geral de produtos** concentra 61,3% do volume do escopo com 96,5% de gap — por isso vem primeiro.

| # | URL | Keywords-alvo | Volume/mês | Estilo |
|---|---|---|---:|---|
| 1 | `/blog/precificacao/` | precificacao · precificacao de produtos | 18.700 | Editorial |
| 2 | `/blog/como-precificar-um-produto/` | como precificar um produto | 4.100 | Editorial |
| 3 | `/blog/formacao-preco-venda/` | formacao de preco de venda · preco de venda formula | 640 | Editorial |
| — | **`/ferramentas/calculadora-de-precos/`** | calculadora de preco de venda · como calcular preco de venda | **1.090** | **Ferramenta + informacional** |

**Total coberto na fase: 24.530 buscas/mês.**

Cada satélite leva CTA para a calculadora e link interno para as outras duas. A ferramenta é o destino de conversão do cluster inteiro; as satélites existem para alimentá-la.


---

## 3.3 Fase 2 · Expandir cobertura SEO + AEO

**Dias 31 a 60.**

1. Priorizar os gaps de cobertura remanescentes.
2. Publicar a segunda leva de páginas satélite, focada em precificação de serviços e casos por profissão.
3. Manter a estrutura de conteúdo AEO da [Parte 2](#parte-2--o-padrão-de-publicação).
4. Iniciar distribuição e prospecção de backlinks e menções.

### Segunda leva de satélites

Estes são os subgrupos com **100% de gap** — serviços e casos por profissão. Volume alto, KD entre 5 e 12 e nenhuma cobertura da InfinitePay.

| # | URL | Keywords-alvo | Volume/mês | Estilo |
|---|---|---|---:|---|
| 4 | `/blog/precificacao-de-servicos/` | precificacao de servicos · quanto cobrar por um servico | 2.500 | Editorial |
| 5 | `/blog/quanto-cobrar-por-hora-de-trabalho/` | quanto cobrar por hora de trabalho | 1.600 | Editorial |
| 6 | `/blog/calcular-preco-por-quilo/` | calcular preco por quilo | 540 | Editorial/utilitário |
| 7 | `/blog/quanto-cobrar-por-unha/` | quanto cobrar por unha | 3.100 | Editorial/utilitário |
| 8 | `/blog/quanto-cobrar-por-um-bolo/` | quanto cobrar por um bolo | 2.400 | Editorial/utilitário |
| 9 | `/blog/quanto-cobrar-por-corte-de-cabelo/` | quanto cobrar por corte de cabelo | 2.200 | Editorial/utilitário |
| 10 | `/blog/quanto-cobrar-por-marmita/` | quanto cobrar por marmita | 1.400 | Editorial/utilitário |
| 11 | `/blog/quanto-cobrar-por-frete-proprio/` | quanto cobrar por frete proprio | 880 | Editorial/utilitário |

**Total coberto na fase: 14.620 buscas/mês.** Somado à Fase 1, **39.150 das 41.040 buscas do escopo — 95,4% — passam a ter uma URL dedicada.**

A página #4 recebe link interno das páginas #5 a #11 e liga de volta à #1, formando o hub de serviços; todas levam CTA para a calculadora.

**O residual são 1.890 buscas** em cinco keywords sem URL própria: `como precificar produto artesanal` (720), `como definir o valor do meu produto` (480), `precificar produto importado` (290), `precificacao para revenda` (260) e `calcular preco de venda com imposto` (140). Volume baixo demais para página dedicada nesta janela — candidatas a seção dentro das satélites existentes ou a reavaliação na Fase 3.

### Iniciar a construção de autoridade

- Divulgar os ativos publicados (newsletter, redes sociais).
- Prospectar backlinks e menções.
- Buscar inclusão da calculadora em conteúdos e listas de recursos externos.

---

## 3.4 Fase 3 · Ganhar autoridade e otimizar vencedores

**Dias 61 a 90.** A partir daqui a priorização deixa de ser hipótese: o critério é o sinal.

1. **Identificar páginas com tração** — impressões crescendo, rankings entre as posições 1 e 20, aumento de cliques, primeiras referências em AI e answer engines.
2. **Priorizar vencedores** — maior combinação de demanda, posição atual, CTR, potencial de avanço e contribuição para o uso da ferramenta.
3. **Atualizar conteúdo** — melhorar a cobertura da intenção, adicionar exemplos, FAQs, dados e respostas faltantes, reforçar trechos que já aparecem para novas buscas.
4. **Melhorar CTR** — testar title, ajustar meta description, alinhar o resultado da SERP ao conteúdo real.
5. **Reforçar internal linking** — mais links internos para páginas com potencial, com âncoras mais descritivas.
6. **Intensificar autoridade externa** — ampliar backlinks, buscar menções de marca, divulgar a calculadora como recurso útil e priorizar páginas que já demonstraram tração.
7. **Revisar AEO** — melhorar respostas diretas, reforçar entidades e fontes, atualizar FAQs, tornar fórmulas, dados e exemplos mais citáveis.
8. **Reavaliar páginas fracas** — atualizar, reposicionar a intenção, consolidar com outra URL quando houver sobreposição, e parar de investir igualmente em páginas sem sinal de resposta.

O item 8 é o que evita desperdício: parar de investir em páginas que já tiveram tempo e não deram sinal é o que libera esforço para as que deram.

---

## 3.5 Fase 4 · Focar em CRO

**Dias 61 a 90, em paralelo com a Fase 3.**

1. **Identificar gargalos do funil** — página satélite → ferramenta, *tool start*, *tool completion*, CTA → formulário, formulário → lead.
2. **Testar CTAs** — copy, posicionamento, frequência e formato.
3. **Otimizar a lead bridge** — testar o momento da captura, o benefício oferecido e, acima de tudo, **evitar bloquear valor cedo demais**.
4. **Melhorar a UX da ferramenta** — reduzir etapas, simplificar campos, deixar cálculo e resultado mais claros, melhorar a experiência mobile.
5. **Otimizar o formulário** — reduzir campos desnecessários, melhorar labels e mensagens, testar captura progressiva quando fizer sentido.
6. **Executar testes A/B** — CTA, proposta de valor, layout, lead bridge e formulário.
7. **Avaliar a qualidade da conversão** — lead rate, conversão por página de origem e por tipo de intenção.
8. **Aplicar aprendizados** — escalar variações vencedoras, corrigir os pontos de maior abandono e priorizar as otimizações de maior impacto.

O item 3 é o que desenhou a captura de lead da ferramenta publicada: o preço sugerido é entregue de graça, e a contrapartida pelo contato é o detalhamento da composição do preço. Entregar a resposta, cobrar pelo aprofundamento.

---

## Apêndice · Como reproduzir a análise

Os relatórios são regeneráveis a partir dos CSVs intocados:

```bash
python generators/generate_demand_maps.py
python generators/generate_utility_fit_report.py
python generators/generate_shortlist_report.py
python generators/generate_pricing_gap_report.py
```

Os scripts produzem mais artefatos intermediários do que os cinco mantidos em `outputs/seo-demand-maps/`; os nomes dos arquivos finais receberam prefixo numérico manualmente, na ordem de leitura da análise.

Para auditar as classificações sem ler os scripts: `cluster_assignments.json` traz o cluster atribuído a cada keyword, e `utility_fit_assessment.json`, a nota de utility fit e o formato recomendado de cada cluster.

