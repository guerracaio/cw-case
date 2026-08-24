# Diretrizes de Arquitetura de Rendering para SEO + AEO

## Objetivo

Este projeto deve priorizar:

- máxima rastreabilidade;
- máxima capacidade de indexação;
- excelente performance;
- HTML completo já no primeiro response;
- mínima dependência de JavaScript para conteúdo crítico;
- estrutura favorável a SEO, AEO, Featured Snippets e sistemas de busca generativa.

A regra central da arquitetura deve ser:

> **Static-first → Server-first → Client only when necessary.**

---

## Stack base

- Next.js
- React
- TypeScript
- Tailwind CSS
- App Router

React deve ser tratado como tecnologia base do Next.js, não como uma camada arquitetural separada.

---

## 1. Usar App Router

Utilizar a estrutura `app/` do Next.js.

Evitar iniciar novas páginas públicas com Pages Router.

Exemplo:

```text
app/
├── page.tsx
├── layout.tsx
├── sitemap.ts
├── robots.ts
└── precificacao/
    └── page.tsx
```

---

## 2. Server Components como padrão

Todo componente deve começar como **Server Component**.

Adicionar `"use client"` somente quando houver necessidade real, como:

- `useState`;
- `useEffect`;
- eventos de interação;
- browser APIs;
- componentes altamente interativos;
- cálculo local do usuário.

Regra de code review:

> **Todo `"use client"` deve ser justificável.**

Evitar colocar `"use client"` em páginas ou layouts inteiros sem necessidade.

---

## 3. Conteúdo SEO/AEO nunca pode depender de CSR

Conteúdo crítico deve existir no HTML inicial retornado pelo servidor.

Isso inclui:

- `H1`;
- `H2-H6`;
- textos editoriais;
- definições;
- respostas diretas;
- fórmulas;
- exemplos;
- tabelas;
- FAQs;
- breadcrumbs;
- links internos;
- CTAs;
- conteúdo relacionado.

Evitar:

```text
HTML vazio
↓
JavaScript
↓
fetch
↓
React renderiza o conteúdo
```

Preferir:

```text
Servidor
↓
HTML completo
↓
Crawler / usuário
↓
JavaScript adiciona interatividade
```

---

## 4. Static Rendering como primeira opção

Páginas públicas orientadas a SEO devem preferencialmente ser estáticas.

Exemplos:

- landing pages;
- páginas de keyword;
- artigos;
- glossários;
- páginas de categoria;
- páginas de perguntas;
- páginas de exemplos;
- páginas de comparação;
- conteúdo evergreen.

Priorizar geração estática sempre que o conteúdo não depender do request do usuário.

---

## 5. Usar revalidation/ISR para conteúdo atualizado

Quando o conteúdo muda periodicamente, usar revalidation em vez de transformar a página inteira em SSR.

Exemplos:

- benchmarks;
- taxas;
- preços;
- rankings;
- exemplos atualizados;
- estatísticas;
- conteúdo editorial revisado periodicamente.

Preferir:

```ts
export const revalidate = 3600;
```

ou estratégias equivalentes de cache/revalidation do Next.js.

---

## 6. SSR somente quando houver motivo real

Usar SSR/dynamic rendering apenas quando o conteúdo depender de:

- cookies;
- headers;
- autenticação;
- personalização por usuário;
- localização;
- request-time data;
- dados realmente em tempo real.

Não usar SSR por padrão em páginas SEO.

---

## 7. Client Components como ilhas de interatividade

A página deve continuar majoritariamente server-rendered.

Exemplo ideal:

```text
Page.tsx                 Server
├── Hero                 Server
├── Conteúdo SEO         Server
├── FormulaExplanation   Server
├── Calculator           Client
├── Examples             Server
├── FAQ                  Server
└── RelatedContent       Server
```

Se apenas a calculadora for interativa, somente ela deve ser Client Component.

Não transformar uma página inteira em aplicação client-side porque uma pequena parte precisa de interação.

---

## 8. Metadata gerada no servidor

Toda metadata crítica deve ser gerada server-side.

Usar:

- `metadata`;
- `generateMetadata()`.

Incluir:

- `<title>`;
- meta description;
- canonical;
- robots;
- Open Graph;
- Twitter/X Cards, quando aplicável.

Evitar metadata crítica adicionada apenas via JavaScript no cliente.

---

## 9. Structured Data no HTML inicial

JSON-LD deve estar presente no HTML retornado ao crawler.

Usar somente schemas compatíveis com o conteúdo real da página.

Possíveis tipos:

- `Article`;
- `BreadcrumbList`;
- `FAQPage`, apenas quando aplicável e compatível com as diretrizes atuais dos mecanismos de busca;
- `HowTo`, quando aplicável;
- schemas específicos da entidade/conteúdo.

Structured Data deve representar conteúdo visível e verdadeiro.

Não usar schema apenas para tentar gerar rich results artificialmente.

---

## 10. Conteúdo importante não pode depender de interação

Conteúdo essencial não deve depender de:

- clique;
- hover;
- scroll;
- accordion aberto;
- modal;
- tabs carregadas client-side;
- botão "ver mais";
- chamada client-side após interação.

Accordions e tabs podem ser usados visualmente, desde que o conteúdo já exista no HTML.

---

## 11. Evitar fetch client-side para conteúdo indexável

Não usar `useEffect()` para buscar conteúdo que deveria ser indexado.

Evitar:

```ts
useEffect(() => {
  fetch('/api/content')
})
```

para conteúdo editorial ou SEO.

Preferir buscar os dados no servidor durante a renderização.

---

## 12. HTML semântico

Usar HTML semanticamente correto.

Priorizar:

- `<main>`;
- `<article>`;
- `<section>`;
- `<header>`;
- `<nav>`;
- `<aside>`;
- `<footer>`;
- `<figure>`;
- `<table>`;
- `<ol>`;
- `<ul>`.

Manter hierarquia correta de headings:

```text
H1
├── H2
│   ├── H3
│   └── H3
└── H2
```

Evitar headings usados apenas por estilo visual.

---

## 13. Links internos devem existir como links HTML reais

Links SEO devem usar elementos navegáveis reais.

Preferir:

```tsx
<Link href="/precificacao-de-produtos">
  Precificação de produtos
</Link>
```

Evitar navegação baseada exclusivamente em:

```tsx
onClick={() => router.push(...)}
```

para links que precisam ser rastreados.

---

## 14. URLs devem ser estáveis e rastreáveis

URLs públicas devem ser:

- permanentes;
- descritivas;
- curtas;
- legíveis;
- sem parâmetros desnecessários.

Exemplo:

```text
/precificacao/
/precificacao-de-produtos/
/precificacao-de-servicos/
/margem-de-lucro/
```

Evitar:

```text
/page?id=3928&type=4
```

quando houver alternativa semântica.

---

## 15. Sitemap nativo

Gerar `sitemap.xml` pelo Next.js.

O sitemap deve conter apenas URLs:

- canônicas;
- indexáveis;
- relevantes;
- com status HTTP 200.

Não incluir:

- redirects;
- páginas `noindex`;
- URLs duplicadas;
- parâmetros de tracking;
- páginas privadas.

---

## 16. Robots.txt explícito

Gerar `robots.txt` de forma controlada.

Garantir que assets necessários para renderização não sejam bloqueados.

Não bloquear CSS ou JS essenciais para entendimento da página.

---

## 17. Canonical obrigatório quando houver risco de duplicação

Toda página indexável deve ter canonical consistente.

Principalmente quando houver:

- query strings;
- filtros;
- tracking parameters;
- variações de URL;
- conteúdo acessível por múltiplos caminhos.

---

## 18. Evitar hydration excessiva

Reduzir ao máximo o JavaScript enviado ao cliente.

Objetivo:

```text
HTML máximo
JavaScript mínimo
```

Manter Client Components pequenos e localizados.

Evitar bibliotecas client-side pesadas para funcionalidades simples.

---

## 19. Dynamic imports apenas para conteúdo não crítico

Componentes pesados podem ser carregados sob demanda quando não forem essenciais para SEO.

Exemplos:

- charts;
- editores;
- widgets;
- animações;
- dashboards;
- recursos secundários.

Nunca lazy-loadar conteúdo textual crítico para indexação.

---

## 20. Imagens otimizadas

Usar `next/image` quando apropriado.

Garantir:

- dimensões definidas;
- `alt` descritivo;
- formatos modernos;
- lazy loading abaixo da dobra;
- prioridade somente para imagens críticas acima da dobra.

Não sacrificar LCP carregando imagens decorativas como prioridade.

---

## 21. Core Web Vitals como requisito

Monitorar especialmente:

- LCP;
- INP;
- CLS.

Evitar:

- JS excessivo;
- fontes pesadas;
- layout shifts;
- imagens sem dimensão;
- terceiros desnecessários;
- hydration ampla.

---

## 22. Fontes

Preferir `next/font`.

Objetivos:

- evitar requests externos desnecessários;
- reduzir layout shift;
- melhorar performance;
- controlar preload.

---

## 23. Conteúdo AEO deve ser estruturalmente extraível

Organizar conteúdo em blocos claros.

Padrão recomendado:

```text
Pergunta
↓
Resposta direta
↓
Explicação
↓
Exemplo
↓
Detalhamento
```

Exemplo:

```text
H1: Como calcular o preço de venda?

Resposta direta:
O preço de venda pode ser calculado somando custos,
despesas, impostos e margem de lucro.

H2: Fórmula do preço de venda

[fórmula]

H2: Exemplo prático

[exemplo]

H2: Perguntas frequentes

[FAQ]
```

Priorizar respostas objetivas logo após headings relevantes.

---

## 24. Evitar conteúdo oculto desnecessariamente

Não esconder conteúdo relevante com:

- `display: none`;
- renderização condicional client-side;
- componentes que só montam após interação;
- conteúdo injetado depois do carregamento.

Elementos colapsáveis são aceitáveis desde que o conteúdo esteja presente no DOM/HTML.

---

## 25. Estados de erro devem preservar rastreabilidade

Tratar corretamente:

- `404`;
- `410`;
- redirects;
- páginas inexistentes;
- conteúdo removido.

Nunca retornar HTTP 200 para páginas inexistentes apenas exibindo uma mensagem de erro.

---

## 26. Redirects devem acontecer no servidor

Redirects permanentes devem usar HTTP adequado.

Preferir:

- `301`;
- `308`.

Evitar redirects dependentes de JavaScript no navegador.

---

## 27. Não criar SPA para páginas SEO

Evitar arquitetura:

```text
SPA
↓
HTML shell
↓
JavaScript
↓
API
↓
conteúdo
```

para páginas públicas cuja aquisição depende de busca orgânica.

Next.js deve ser usado como framework server-first, não apenas como wrapper para uma SPA React.

---

## 28. Matriz de decisão de rendering

| Tipo de conteúdo | Rendering recomendado |
|---|---|
| Landing page SEO | Static |
| Página editorial | Static |
| Página de keyword | Static |
| Conteúdo evergreen | Static |
| FAQ | Static / Server Component |
| Exemplos | Static / Server Component |
| Comparações | Static / Server Component |
| Dados atualizados periodicamente | Static + Revalidation |
| Calculadora | Client Component isolado |
| Resultado calculado pelo usuário | Client |
| Conteúdo personalizado | SSR / Client |
| Dados em tempo real | SSR |
| Dashboard autenticado | Dynamic / Client conforme necessidade |

---

## 29. Ordem de prioridade para decidir rendering

Para cada página ou componente, seguir esta ordem:

### 1. Pode ser estático?

Se sim, usar Static Rendering.

### 2. Precisa mudar periodicamente?

Usar Static + Revalidation.

### 3. Precisa do request do usuário?

Usar SSR/dynamic rendering.

### 4. Precisa de interação no navegador?

Transformar somente essa parte em Client Component.

---

## 30. Regra arquitetural final

A implementação deve seguir:

```text
Next.js App Router
        ↓
Static Rendering sempre que possível
        ↓
Revalidation quando necessário
        ↓
React Server Components por padrão
        ↓
HTML semântico completo
        ↓
Conteúdo SEO + AEO no HTML inicial
        ↓
Client Components pequenos e isolados
        ↓
Interatividade
```

---

# Regras não negociáveis

1. Conteúdo indexável não pode depender de `useEffect`.
2. Página pública SEO não deve ser `"use client"`.
3. Server Components são o padrão.
4. Static Rendering é a primeira escolha.
5. SSR deve ser uma exceção justificada.
6. JavaScript client-side deve ser minimizado.
7. H1, headings, textos, links e FAQs devem existir no HTML inicial.
8. Structured Data deve ser server-rendered.
9. Metadata deve ser server-rendered.
10. Links internos devem ser links HTML rastreáveis.
11. Interatividade deve ser isolada em Client Components.
12. O projeto não deve funcionar como SPA para páginas públicas SEO.

---

# Critério de aceite

Uma página pública orientada a SEO/AEO só deve ser considerada pronta quando:

- o conteúdo principal estiver presente no HTML inicial;
- a página for navegável sem depender de hydration para conteúdo;
- headings estiverem semanticamente corretos;
- links internos forem rastreáveis;
- metadata estiver correta;
- canonical estiver definido quando necessário;
- structured data estiver válido;
- sitemap e robots estiverem coerentes;
- JavaScript client-side estiver restrito ao necessário;
- Core Web Vitals estiverem dentro de níveis aceitáveis;
- o conteúdo continuar compreensível para um crawler que não execute JavaScript.

---

# Princípio final

> **A página deve ser construída primeiro como documento HTML indexável e depois enriquecida como aplicação interativa. Nunca o contrário.**
