# Calculadora de preços de produtos e serviços

Página-ferramenta construída como **mockup de alta fidelidade**: uma calculadora de preço de venda para produtos e serviços, desenhada para ser altamente rastreável e otimizada para SEO e AEO, com captura de lead.

O repositório reúne duas camadas: a **pesquisa** que justifica a escolha da ferramenta e a **aplicação** em si.

---

## Por que esta ferramenta

A análise de demanda em [outputs/seo-demand-maps/](outputs/seo-demand-maps/) identificou, no cluster de precificação:

- **41.040 buscas/mês** no recorte analisado;
- **97,9% de gap SEO** — 40.160 buscas sem ranking da InfinitePay;
- **nenhuma calculadora** entre os 6 concorrentes observados: a SERP é quase toda editorial.

A oportunidade é publicar uma página que seja ferramenta **e** documento indexável ao mesmo tempo. O diagnóstico completo está em [05_relatorio_gap_calculadora_precos.md](outputs/seo-demand-maps/05_relatorio_gap_calculadora_precos.md).

---

## Estrutura

```text
cw-case/
├── assets/       # diretrizes de rendering, guia de marca, logos
├── dataset/      # exports de keywords, concorrentes e páginas
├── generators/   # scripts Python que produzem os relatórios
├── outputs/      # mapas de demanda e relatórios gerados
├── web/          # a aplicação Next.js
└── CLAUDE.md     # regras de arquitetura, conteúdo e design system
```

`dataset/`, `generators/` e `outputs/` são a camada de pesquisa — o insumo que justifica o produto, não código de aplicação.

---

## Rodando local

Requer **Node.js 20.9+** (testado no 22.13) e npm.

```bash
cd web
npm install
npm run dev
```

Abra **http://localhost:3000/ferramentas/calculadora-de-precos/**

Outros comandos, todos a partir de `web/`:

| Comando | O que faz |
|---|---|
| `npm run dev` | desenvolvimento, com hot reload |
| `npm run build` | build de produção; deve passar sem erro de tipo |
| `npm start` | serve o build — use este para inspecionar o HTML real |
| `npx eslint .` | linter |
| `npx tsc --noEmit` | checagem de tipos |

### Variável de ambiente

Opcional. Define a origem usada em canonical, Open Graph e sitemap:

```bash
cp .env.example .env.local
# NEXT_PUBLIC_SITE_URL=https://www.infinitepay.io
```

Sem ela, o padrão é `https://www.infinitepay.io`.

### A fonte da marca

**Cera Pro é comercial e não está versionada aqui** (ver [.gitignore](.gitignore)) — mantê-la em um repositório público seria redistribuição.

A aplicação **constrói e funciona normalmente sem ela**, caindo no fallback do sistema. Para ver a marca fiel, coloque os dois arquivos em `web/public/fonts/`:

```text
web/public/fonts/CeraPro-Medium.woff2
web/public/fonts/CeraPro-Bold.woff2
```

Se você tiver os originais em `.otf`/`.ttf`, a conversão é:

```bash
pip install fonttools brotli
python -c "from fontTools.ttLib import TTFont; f=TTFont('Cera Pro Medium.otf'); f.flavor='woff2'; f.save('CeraPro-Medium.woff2')"
```

> Apenas os pesos realmente usados devem ser adicionados: cada peso vira um preload no `<head>` e entra no caminho do LCP.

---

## Como a página é construída

A regra é **static-first → server-first → client só quando necessário**. As diretrizes completas estão em [assets/diretrizes-rendering-seo-aeo.md](assets/diretrizes-rendering-seo-aeo.md); o resumo operacional, no [CLAUDE.md](CLAUDE.md).

- **Todas as rotas são estáticas** (`○ Static` no output do build). Nenhum SSR, nenhum `dynamic`.
- **Todo o conteúdo indexável está no HTML do primeiro response**: H1, headings, resposta direta, fórmulas, exemplos numéricos, passos e as FAQs com pergunta *e* resposta. A página é compreensível para um crawler que não execute JavaScript.
- **A interatividade é uma ilha**: apenas a calculadora, o formulário de lead e o CTA são Client Components.
- **As fórmulas vivem em funções puras** ([web/lib/pricing/](web/lib/pricing/)) que o Server Component do exemplo prático importa em build time — o exemplo publicado nunca diverge do que a ferramenta calcula.
- **Structured Data** (`WebApplication`, `BreadcrumbList`, `HowTo`, `FAQPage`) é gerado a partir do mesmo dado que a página renderiza, então o schema só descreve conteúdo visível.

### Verificando

O teste que decide se a página está pronta é ler o HTML bruto:

```bash
npm run build && npm start
curl -s http://localhost:3000/ferramentas/calculadora-de-precos/
```

No HTML devem estar presentes: `<h1>`, todos os headings, a fórmula em texto, a tabela do exemplo, os passos, todas as perguntas **e respostas**, o canonical e os blocos `application/ld+json`.

---

## O que é mockup

Esta entrega cobre a página da ferramenta. Não são reais:

- **Captura de lead** — o formulário funciona na tela, mas [`submitLead`](web/components/lead/submit-lead.ts) não persiste nada. Não há Route Handler, banco nem CRM. O ponto de integração está marcado no arquivo.
- **Analytics** — [`track()`](web/lib/analytics/track.ts) empurra os eventos do roadmap (`tool_click`, `tool_start`, `tool_complete`, `lead_cta_click`, `lead_generated`) para o `dataLayer`, mas nenhum container GA4/GTM é carregado. Sem container, é um array em memória: dá para inspecionar em `window.dataLayer` no console.
- **Páginas satélite** — as páginas editoriais de blog previstas no roadmap não fazem parte desta entrega.

---

## Deploy

Apenas `web/` vai para produção — é o root do projeto Next.js. Em plataformas como a Vercel, aponte o *root directory* para `web`.

Lembre-se de que **as fontes não estão no repositório**: sem elas, o build funciona mas a página renderiza com a fonte de fallback.
