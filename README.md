# Calculadora de preços de produtos e serviços

Entrega de case técnico para a vaga de **Technical SEO & AI Growth Builder** na **CloudWalk, Inc.**

Página-ferramenta construída como **mockup de alta fidelidade**: uma calculadora de preço de venda para produtos e serviços, desenhada para ser altamente rastreável e otimizada para SEO e AEO, com captura de lead.

O repositório reúne duas camadas: a **análise** que justifica a escolha da ferramenta e a **aplicação** em si.

## Entregáveis

| | |
|---|---|
| **Aplicação publicada** | [cw-case.vercel.app/ferramentas/calculadora-de-precos](https://cw-case.vercel.app/ferramentas/calculadora-de-precos/) |
| **Vídeo de apresentação** | _link a incluir_ — apresentação do resultado para a liderança de growth |
| **Roadmap SEO + AEO** | [PDF](Roadmap%20SEO%20%2B%20AEO%20-%20Calculadora%20de%20pre%C3%A7os%20de%20produtos%20e%20servi%C3%A7os.pdf) — as quatro fases dos primeiros 90 dias |
| **Apresentação da análise** | _arquivo a incluir_ — como a ferramenta foi escolhida a partir dos dados |

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

## Como a página é construída

A regra é **static-first → server-first → client só quando necessário**. As diretrizes completas estão em [assets/diretrizes-rendering-seo-aeo.md](assets/diretrizes-rendering-seo-aeo.md); o resumo operacional, no [CLAUDE.md](CLAUDE.md).

- **Todas as rotas são estáticas** (`○ Static` no output do build). Nenhum SSR, nenhum `dynamic`.
- **Todo o conteúdo indexável está no HTML do primeiro response**: H1, headings, resposta direta, fórmulas, exemplos numéricos, passos e as FAQs com pergunta *e* resposta. A página é compreensível para um crawler que não execute JavaScript.
- **A interatividade é uma ilha**: apenas a calculadora, o formulário de lead e o CTA são Client Components.
- **As fórmulas vivem em funções puras** ([web/lib/pricing/](web/lib/pricing/)) que o Server Component do exemplo prático importa em build time — o exemplo publicado nunca diverge do que a ferramenta calcula.
- **Structured Data** (`WebApplication`, `BreadcrumbList`, `HowTo`, `FAQPage`) é gerado a partir do mesmo dado que a página renderiza, então o schema só descreve conteúdo visível.


## O que é mockup

Esta entrega cobre a página da ferramenta. Não são reais:

- **Captura de lead** — o formulário (nome, e-mail e WhatsApp) funciona na tela e libera o detalhamento do preço, mas [`submitLead`](web/components/lead/submit-lead.ts) não persiste nada. Não há Route Handler, banco nem CRM. O ponto de integração está marcado no arquivo.
- **Analytics** — [`track()`](web/lib/analytics/track.ts) empurra os eventos do roadmap (`tool_click`, `tool_start`, `tool_complete`, `lead_cta_click`, `lead_generated`) para o `dataLayer`, mas nenhum container GA4/GTM é carregado. Sem container, é um array em memória: dá para inspecionar em `window.dataLayer` no console.
- **Páginas satélite** — as páginas editoriais de blog previstas no roadmap não fazem parte desta entrega.

---
