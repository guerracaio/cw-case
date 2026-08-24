# CLAUDE.md

## O que é este projeto

Construir a **Calculadora de preços de produtos e serviços** da InfinitePay: uma página-ferramenta pública, em português do Brasil, que atrai demanda orgânica, entrega o cálculo de preço de venda e captura o lead.

A hipótese vem de uma análise de demanda já feita neste repositório: o cluster de precificação tem **41.040 buscas/mês** com **97,9% de gap SEO** e **nenhuma calculadora identificada** entre os concorrentes — a SERP é quase toda editorial. O produto ganha justamente por ser ferramenta *e* documento indexável ao mesmo tempo.

### Ordem de prioridade (não inverter)

1. **SEO + AEO** — rastreabilidade e indexação são o objetivo primário da página, não um acabamento.
2. **Captura de lead** — a página existe para converter tráfego orgânico em lead.
3. **Utilidade da ferramenta** — o cálculo precisa estar correto e ser fácil de usar.
4. **Fidelidade de marca** — visual estritamente dentro do design system InfinitePay.

Quando houver conflito entre uma decisão de UX/DX e a rastreabilidade da página, **a rastreabilidade vence**. Se achar que um caso específico justifica o contrário, levante antes de implementar.

---

## Escopo

**Dentro do escopo:** a página da ferramenta, em `/ferramentas/calculadora-de-precos/`, incluindo todo o conteúdo SEO/AEO que vive nela (resposta direta, fórmulas, exemplos, passos, FAQ).

**Fora do escopo (por ora):** as páginas satélite editoriais (`/blog/precificacao/`, `/blog/como-precificar-um-produto/`, `/blog/formacao-preco-venda/` e as de Fase 2). Elas estão no roadmap e a arquitetura deve deixar espaço para elas — links internos, componentes de conteúdo reutilizáveis, sitemap extensível — mas **não as crie sem pedido explícito**.

**Captura de lead:** implementar **apenas a interface e o contrato**. Formulário, validação client-side, estados de UI e a função de disparo dos eventos. **Não** criar Route Handler, banco, integração com CRM ou envio de e-mail. O submit deve chamar um adapter documentado (`submitLead`) que hoje resolve local e fica pronto para receber implementação real.

---

## Fontes de verdade

| Artefato | O que governa |
|---|---|
| [assets/diretrizes-rendering-seo-aeo.md](assets/diretrizes-rendering-seo-aeo.md) | Arquitetura de rendering. **Leitura obrigatória, seguir estritamente.** |
| [assets/Guia_de_Marca_InfinitePay.pdf](assets/Guia_de_Marca_InfinitePay.pdf) | Marca. O design system abaixo é a tradução dele para código. Material público, distribuído pela própria InfinitePay. |
| [assets/img/](assets/img/) | Arquivos de logo. |
| [Roadmap SEO + AEO](Roadmap%20SEO%20+%20AEO%20-%20Calculadora%20de%20preços%20de%20produtos%20e%20serviços.pdf) | URLs, keywords-alvo, eventos de tracking, fases. |
| [outputs/seo-demand-maps/](outputs/seo-demand-maps/) | Keywords, volumes, KD, concorrentes e o diagnóstico do gap. |

`dataset/`, `generators/` e `outputs/` são a camada de pesquisa. **Não editar** — são o insumo que justifica o produto, não código de aplicação.

---

## Stack e estrutura

Next.js (App Router) · React · TypeScript · Tailwind CSS.

O app vive em `web/`, isolado da camada de pesquisa:

```text
cw-case/
├── assets/ dataset/ generators/ outputs/   # pesquisa — não editar
└── web/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                        # home mínima → aponta para a ferramenta
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   ├── not-found.tsx
    │   └── ferramentas/
    │       └── calculadora-de-precos/
    │           └── page.tsx                # Server Component
    ├── components/
    │   ├── calculator/                     # única ilha "use client"
    │   ├── content/                        # blocos AEO (Server)
    │   ├── lead/                           # formulário (client) + contrato
    │   └── ui/                             # design system
    ├── lib/
    │   ├── pricing/                        # funções puras de cálculo
    │   ├── analytics/                      # eventos
    │   └── seo/                            # metadata + JSON-LD
    └── content/                            # conteúdo tipado (FAQ, exemplos, passos)
```

`next.config`: `trailingSlash: true` — as URLs canônicas do roadmap terminam em `/`.

Idioma: `<html lang="pt-BR">`, todo conteúdo em português do Brasil. Código, identificadores, nomes de arquivo e commits em inglês.

---

## Regras de rendering (resumo executivo)

O documento completo é [assets/diretrizes-rendering-seo-aeo.md](assets/diretrizes-rendering-seo-aeo.md). O que nunca pode ser violado:

1. **A página é estática.** Sem `dynamic`, sem SSR, sem `cookies()`/`headers()`. Static Rendering é a primeira escolha; revalidation só se algum dado passar a mudar periodicamente.
2. **Server Component é o padrão.** Todo `"use client"` precisa de justificativa escrita no PR. A página nunca é `"use client"`.
3. **Todo conteúdo indexável no HTML do primeiro response.** H1, headings, resposta direta, fórmulas, exemplos numéricos, passos, FAQ, links internos e CTAs. Nada disso pode depender de hydration, `useEffect`, fetch client-side, clique, scroll ou accordion aberto.
4. **Apenas a calculadora e o formulário de lead são client.** São ilhas pequenas e localizadas dentro de uma página server-rendered.
5. **Metadata e JSON-LD server-rendered**, via `metadata`/`generateMetadata()` e `<script type="application/ld+json">` no HTML inicial.
6. **Links internos são `<Link>`/`<a>` reais.** Nunca `onClick` + `router.push` para navegação rastreável.
7. **HTML semântico** (`main`, `article`, `section`, `header`, `nav`, `footer`, `table`, `ol`) com hierarquia de headings correta. Heading nunca é escolhido por tamanho de fonte.
8. **JS client mínimo.** Sem bibliotecas pesadas para o que a plataforma já resolve. Sem lib de máscara/formulário/estado global sem necessidade demonstrada.
9. **404 real** para rota inexistente — nunca 200 com mensagem de erro. Redirects no servidor, 301/308.
10. **Core Web Vitals são requisito de aceite**, não meta futura: LCP, INP, CLS. `next/font` para fontes, `next/image` com dimensões e `alt` descritivo, sem prioridade em imagem decorativa.

### Teste que decide se a página está pronta

Desligue o JavaScript no navegador (ou leia o HTML bruto da resposta) e recarregue. Se um crawler que não executa JS não conseguir entender **o que a página faz, qual a fórmula, como calcular passo a passo e quais as respostas das FAQs**, a página não está pronta. A calculadora pode não funcionar sem JS — o *conteúdo* não pode faltar.

```powershell
npm run build; if ($?) { npm start }
# em outro terminal:
(Invoke-WebRequest http://localhost:3000/ferramentas/calculadora-de-precos/).Content
```

Verificar nesse HTML: H1, headings, resposta direta, fórmula, exemplo numérico, passos, todas as perguntas **e respostas** da FAQ, canonical, JSON-LD.

---

## Conteúdo SEO/AEO da página

**URL:** `/ferramentas/calculadora-de-precos/`
**Keywords-alvo:** `calculadora de preco de venda`, `como calcular preco de venda`, `preco de venda formula`, `precificacao`.
**Formato:** ferramenta no topo, conteúdo informacional logo abaixo.

### Estrutura obrigatória

Todo bloco de conteúdo segue o padrão AEO **pergunta → resposta direta → explicação → exemplo → detalhamento**:

```text
H1  Calculadora de preço de venda
    ├─ Resposta direta (1–3 frases, antes da dobra, texto puro no HTML)
    ├─ [ilha client] Calculadora
H2  Como calcular o preço de venda?          → passos numerados <ol>
H2  Fórmula do preço de venda                → fórmula explícita, legível como texto
H2  Exemplo prático                          → números reais, em <table>
H2  Como precificar um serviço               → custo/hora
H2  Perguntas frequentes                     → <h3> em forma de pergunta real + resposta imediata
H2  [CTA de lead]
```

Regras de escrita:

- Headings são perguntas reais de busca, não rótulos genéricos.
- A resposta objetiva vem **imediatamente** depois do heading, antes de qualquer contexto.
- Definições curtas e autocontidas — precisam fazer sentido citadas fora da página.
- Fórmulas aparecem como texto legível, não só como imagem ou LaTeX renderizado por JS.
- Exemplos com números concretos em reais.
- Nada de "veja abaixo", "como explicamos acima" — cada bloco é extraível isoladamente.

O conteúdo mora em `web/content/` como dado tipado (TS), renderizado por Server Components. Isso mantém texto separado de layout e permite reuso nas páginas satélite depois.

### Structured Data

No HTML inicial, refletindo **apenas conteúdo visível e verdadeiro**:

- `WebApplication` (ou `SoftwareApplication`) para a ferramenta — categoria `FinanceApplication`, `offers` gratuito.
- `BreadcrumbList` — coerente com o breadcrumb visível.
- `FAQPage` — somente com as perguntas e respostas realmente na página.
- `HowTo` — para os passos de "como calcular", se os passos estiverem visíveis.

Nunca marcar o que não está na tela. Rich result de FAQ hoje é restrito no Google, mas o schema segue valendo para answer engines — manter, sem prometer rich result.

### Metadata

`title`, `description`, `canonical`, `robots`, Open Graph e Twitter Card via `metadata` na page. Canonical sempre aponta para `/ferramentas/calculadora-de-precos/` limpa.

Se o estado da calculadora for compartilhável por query string, essas variações **não** entram no sitemap, o canonical continua na URL limpa e nenhum parâmetro de tracking gera URL indexável.

### sitemap.ts e robots.ts

Nativos do Next. Sitemap só com URLs canônicas, indexáveis, 200. Robots não bloqueia CSS/JS necessários para renderizar a página.

---

## A calculadora

### Arquitetura

A lógica de cálculo vive em **funções puras** em `web/lib/pricing/`, sem React e sem `"use client"`. Isso permite:

- a ilha client importá-las para o cálculo interativo;
- o **Server Component do exemplo prático importar as mesmas funções** para gerar os números do exemplo em build time.

Assim o exemplo publicado nunca diverge do que a ferramenta calcula. Esse é o padrão esperado — não duplicar fórmula em dois lugares.

### Modelo de cálculo

Dois modos: **produto** e **serviço**. Ambos usam markup divisor sobre percentuais do preço de venda.

```text
Produto
  preço = (custo unitário + custos variáveis) / (1 − (despesas% + impostos% + taxa de pagamento% + margem%))

Serviço
  custo/hora = (custos fixos mensais + pró-labore) / horas produtivas no mês
  preço      = (custo/hora × horas do serviço + materiais) / (1 − (impostos% + taxa de pagamento% + margem%))
```

Tratar explicitamente: soma de percentuais ≥ 100% (divisor ≤ 0) é entrada inválida, com mensagem clara — não `Infinity` na tela. Arredondamento monetário só na apresentação. Formatação com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

Além do preço, o resultado deve mostrar a **decomposição** (custo, impostos, taxas, margem, lucro em R$) — é o que dá credibilidade à ferramenta e gera o conteúdo citável.

### UX

Mobile-first — a maior parte do tráfego dessas keywords é mobile. Menos campos possível, valores padrão sensatos, resultado visível sem clique em "calcular" (recalcular ao digitar), sem etapa desnecessária.

**O resultado do cálculo nunca fica atrás do formulário de lead.** A captura acontece depois do valor entregue (ex.: salvar/enviar o resultado, receber a planilha). Bloquear valor cedo demais derruba a conversão e o sinal de qualidade da página.

---

## Captura de lead (só interface)

Formulário client mínimo. Validação no client, estados de loading/erro/sucesso, acessível (label real, `aria-describedby` para erro, foco gerenciado).

O submit chama um adapter único:

```ts
// web/components/lead/submit-lead.ts
export type Lead = {
  name: string
  email: string
  phone?: string
  source: string        // ex.: 'calculadora-de-precos'
  context?: Record<string, string | number>  // modo, faixa de preço etc.
}

export async function submitLead(lead: Lead): Promise<{ ok: boolean }> {
  // Sem persistência nesta fase. Implementação real (Route Handler → CRM)
  // entra aqui sem tocar em nenhum componente.
}
```

Não criar `app/api/`, banco, fila ou integração externa sem pedido explícito.

---

## Tracking

Eventos definidos no roadmap, disparados por `web/lib/analytics/`:

| Evento | Quando |
|---|---|
| `page_view` | carregamento da página |
| `tool_click` | interação inicial com a ferramenta |
| `tool_start` | primeiro campo preenchido |
| `tool_complete` | resultado gerado |
| `lead_cta_click` | clique no CTA de captura |
| `lead_generated` | submissão válida do formulário |

> O roadmap grafa `too_complete`; é typo. Usar `tool_complete` e registrar a divergência ao entregar.

A camada de analytics é uma função tipada única (`track(event, payload)`) que empurra para `dataLayer` e degrada em no-op se não houver container configurado. **Nenhum script de terceiro deve entrar no caminho crítico de renderização** — carregar com a estratégia adequada do `next/script` e medir o impacto em LCP/INP antes e depois.

---

## Design System InfinitePay

Traduzido do guia de marca. **Seguir estritamente** — não inventar cor, fonte, sombra ou raio fora do que está aqui.

### Cores

```ts
// tokens — nomes iguais aos do guia de marca
purple:  { 600: '#6E08F2', 200: '#A880FF', 0:   '#DCCCFF' }
green:   { 500: '#BAFF1A', 300: '#D9FF80', 100: '#F6FFE0' }
yellow:  { 500: '#FF9D00', 200: '#FFD899', 100: '#FFEBCC' }
neutral: { 900: '#121212', 800: '#323232', 400: '#C7C7C7', 200: '#EEEEEE' }
white:   '#FFFFFF'
```

**Proporção de uso** (o guia é explícito): branco 40% · preto/neutro 30% · roxo 15% · verde 10% · laranja 5%. A página é predominantemente branca e preta, com roxo e verde como acentos. Uma tela dominada por roxo ou verde está fora da marca.

**Laranja (`yellow-*`) é restrito.** O guia reserva a família para produtos específicos (Nitro, infiniteStreaming) e exige aprovação prévia do time de Brand. **Não usar nesta página** — nem em CTA, nem em destaque, nem em estado de alerta.

**Contraste — regras rígidas:**

| Uso | Certo | Errado |
|---|---|---|
| Texto sobre branco | `neutral-900` / `neutral-800` | `green-500` ou `purple-200` como cor de texto |
| Texto sobre `purple-600` | branco | `neutral-800` |
| Texto sobre `green-500` / `green-300` | `neutral-900` | branco |
| Bordas e divisores | `neutral-200` / `neutral-400` | verde ou roxo claro |

`green-500` é altíssima luminância: serve como **fundo** de destaque ou preenchimento, nunca como cor de texto sobre claro. Alvo de contraste: WCAG AA no mínimo, AAA para corpo de texto.

### Hierarquia de aplicação

Derivada de material publicado da própria InfinitePay (blocos de taxas do site), não inventada:

| Elemento | Tratamento |
|---|---|
| Ação primária | `bg-green-500` + texto `neutral-900`, pill (`rounded-full`) |
| Ação secundária | `bg-neutral-200` + texto `neutral-900`, pill, **sem contorno** |
| Cards e superfícies | `bg-neutral-200` preenchido, `rounded-2xl`, sem borda |
| Destaque de valor em texto | `text-purple-600` (o papel do "GRÁTIS" nos cards de taxa) |
| Links, breadcrumb, numeração | `text-purple-600` |
| Divisórias internas | `border-neutral-200` / `border-neutral-400` |
| Superfície de resultado | `bg-green-100` — o verde forte fica reservado à ação primária |

**Roxo não é cor de botão.** Ele destaca texto, link e ícone. **Verde forte é a ação**, e por isso só pode existir um `green-500` disputando atenção por seção: dois botões primários juntos anulam a hierarquia — o segundo vira `secondary`.

Uma tela dominada por roxo ou verde está fora da marca: o fundo é branco, o texto é preto, e os acentos são pontuais.

### Tipografia

A marca usa **Cera Pro**. Os arquivos licenciados estão em `assets/fonts/` (`.otf`) e são convertidos para `.woff2` em `web/app/fonts/`, carregados com `next/font/local` — self-hosted, sem request externo, com preload controlado.

- **Declare apenas os pesos que a página realmente usa.** Cada peso vira um `<link rel="preload">` no `<head>` e entra no caminho do LCP. Hoje são dois: Medium (500) e Bold (700).
- **Pesos em uso:** Regular (400) no corpo, Medium (500) em labels e botões, Bold (700) em títulos. Só Regular e Bold entram em preload — são os pesos do conteúdo acima da dobra.
- **Cuidado ao converter:** `assets/fonts/Cera Pro Regular.ttf` é um arquivo truncado, com 72 glifos e nenhum acento. O Regular válido é `cera-pro-regular.otf` (777 glifos). Confira a cobertura de glifos antes de usar qualquer arquivo novo.
- Itálico não entra: o guia não prevê.
- A família fica atrás da variável CSS `--font-sans`, então trocar a fonte é uma mudança de um arquivo.

Conversão de `.otf` para `.woff2` (as libs vão no scratchpad, nunca no projeto):

```powershell
python -m pip install --target <scratchpad>/pylibs fonttools brotli
```

Títulos em Medium/Bold, corpo em Regular ou Medium. Escala tipográfica e espaçamento: usar a escala do Tailwind, sem valores mágicos soltos.

### Logo

⚠️ **Os nomes dos arquivos em `assets/img/` estão trocados em relação ao conteúdo.** O que vale é:

| Arquivo | Layout real | Wordmark | Usar em |
|---|---|---|---|
| `01-vertical-preto.png` | **horizontal** | preto | fundo claro — header, uso padrão |
| `02-vertical-branco.png` | **horizontal** | branco | fundo escuro/roxo |
| `02-horizontal-preto.png` | **vertical** | preto | fundo claro, espaço estreito |
| `01-horizontal-branco.png` | **vertical** | branco | fundo escuro, espaço estreito |

O símbolo (disco escuro + anel com gradiente verde→amarelo) e o logotipo têm relação fixa de posição e tamanho. Podem ser separados apenas em casos como ícone de app.

**Permitido:** logo preto sobre branco; logo branco sobre `neutral-900`; logo branco sobre `purple-600`; logo preto sobre `green-500`/`green-300`.

**Proibido:** distorcer, redesenhar ou recolorir qualquer parte (inclusive o anel); aplicar sobre foto ou imagem; aplicar sobre laranja, vermelho ou qualquer cor fora do sistema; usar o anel sem o disco escuro; qualquer fundo que reduza a legibilidade.

Servir via `next/image` com dimensões explícitas e `alt="InfinitePay"`. No header, o logo é link para a home e não deve causar CLS.

---

## Comandos

```powershell
cd web
npm install
npm run dev          # desenvolvimento
npm run build        # build de produção — deve passar sem erro de type
npm start            # serve o build, para inspecionar o HTML real
npm run lint
```

---

## Checklist antes de considerar qualquer página pronta

- [ ] Conteúdo principal presente no HTML do primeiro response (verificado com JS desligado).
- [ ] Página compreensível para crawler que não executa JavaScript.
- [ ] Nenhum `"use client"` sem justificativa; ilhas pequenas e isoladas.
- [ ] Hierarquia de headings semanticamente correta, headings como perguntas reais.
- [ ] Resposta direta imediatamente após cada heading relevante.
- [ ] Fórmula, exemplo numérico e passos visíveis em texto.
- [ ] FAQ com perguntas **e respostas** no HTML, sem depender de accordion aberto.
- [ ] Metadata completa (title, description, canonical, robots, OG).
- [ ] JSON-LD válido, server-rendered, refletindo só conteúdo visível.
- [ ] Sitemap e robots coerentes.
- [ ] Links internos como links HTML reais.
- [ ] Core Web Vitals dentro do aceitável, especialmente em mobile.
- [ ] Cálculo correto, incluindo entradas inválidas; formatação pt-BR.
- [ ] Eventos de tracking disparando nos pontos definidos.
- [ ] Design dentro dos tokens e proporções da marca; sem laranja; contraste AA/AAA.

---

## Princípio final

> A página deve ser construída primeiro como documento HTML indexável e depois enriquecida como aplicação interativa. Nunca o contrário.
