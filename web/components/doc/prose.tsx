/**
 * Primitivas do documento do case.
 *
 * Server Components puros: nada aqui depende de hydration. A pagina e longa
 * e de leitura, entao o unico requisito e que todo o conteudo esteja no HTML
 * do primeiro response.
 *
 * As cores saem so dos tokens da marca (ver globals.css). A paleta padrao do
 * Tailwind esta zerada, entao qualquer cor fora do design system nem existe
 * como utilitario.
 */

import type { ReactNode } from "react";

/* ------------------------------ tipografia ------------------------------ */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-[0.13em] text-purple-600 uppercase">
      {children}
    </p>
  );
}

/**
 * Abertura de uma das tres partes. A linha grossa em cima e o unico divisor
 * forte do documento — marca troca de assunto, nao troca de secao.
 */
export function PartHeading({
  id,
  label,
  title,
}: {
  id: string;
  label: string;
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-6 border-t-2 border-neutral-900 pt-7">
      <Eyebrow>{label}</Eyebrow>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance">
        {title}
      </h2>
    </section>
  );
}

export function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="mt-14 scroll-mt-6 text-xl font-bold tracking-tight text-balance"
    >
      {children}
    </h3>
  );
}

export function H4({ children }: { children: ReactNode }) {
  return <h4 className="mt-10 text-lg font-bold">{children}</h4>;
}

/** Paragrafo de apoio: menor peso que o corpo, para leitura em diagonal. */
export function Note({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm text-neutral-800">{children}</p>;
}

/** Nome de arquivo, URL, keyword ou evento — dado literal, nao prosa. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-neutral-200 px-1 py-0.5 font-mono text-[0.86em]">
      {children}
    </code>
  );
}

/* ------------------------------ componentes ----------------------------- */

/** A pergunta que abre cada etapa. */
export function Question({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-r-xl border-l-[3px] border-purple-600 bg-neutral-200 px-5 py-3.5">
      <p className="text-[11px] font-medium tracking-[0.13em] text-purple-600 uppercase">
        Pergunta
      </p>
      <p className="mt-1 font-medium">{children}</p>
    </div>
  );
}

/**
 * Bloco destacado. `key` usa o verde forte da marca e carrega as conclusoes
 * que precisam ser lidas mesmo por quem folheia; `default` e cinza e serve
 * para contexto lateral.
 */
export function Callout({
  label,
  tone = "default",
  children,
}: {
  label?: string;
  tone?: "default" | "key";
  children: ReactNode;
}) {
  const surface =
    tone === "key" ? "bg-green-500 text-neutral-900" : "bg-neutral-200";
  const labelColor = tone === "key" ? "text-neutral-900/70" : "text-neutral-800";

  return (
    <div className={`mt-7 rounded-2xl px-6 py-5 ${surface}`}>
      {label ? (
        <p
          className={`text-[11px] font-medium tracking-[0.13em] uppercase ${labelColor}`}
        >
          {label}
        </p>
      ) : null}
      <div className={label ? "mt-2" : ""}>{children}</div>
    </div>
  );
}

export function Stats({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200">
      {children}
    </div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white px-5 py-5">
      <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="mt-2 text-sm text-neutral-800">{label}</p>
    </div>
  );
}

/**
 * Tabela larga rola dentro do proprio quadro. Sem isto, a pagina inteira
 * ganharia rolagem horizontal no celular.
 */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="mt-7 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

export const TH =
  "border-b border-neutral-400 px-3 pb-2.5 text-left text-[11px] font-medium tracking-[0.08em] whitespace-nowrap text-neutral-800 uppercase";

export const TD =
  "border-b border-neutral-200 px-3 py-2.5 align-top text-neutral-800";

export const NUM = "text-right tabular-nums whitespace-nowrap";

/**
 * Linha em destaque. O verde 100 sozinho e claro demais sobre branco — lia
 * como mancha. A barra em verde 500 na primeira celula resolve com o verde
 * forte da marca em dose pequena.
 */
export const HI_ROW =
  "[&>td]:bg-green-100 [&>td]:font-medium [&>td]:text-neutral-900 [&>td:first-child]:shadow-[inset_3px_0_0_var(--color-green-500)]";

/**
 * Bloco com icone. Aqui o icone e a marca do proprio assistente: a secao fala
 * de duas ferramentas nomeadas, e o simbolo delas identifica mais rapido do
 * que um desenho generico de "codigo" ou "pesquisa", que era o que estava
 * aqui antes.
 *
 * Em monocromia no preto do texto, e nao na cor de marca de cada um nem no
 * roxo da InfinitePay: as cores oficiais estao fora da paleta daqui, e pintar
 * marca alheia de roxo seria recolorir. Uma cor so e o uso que os proprios
 * guias costumam permitir sem aprovacao — e o preto e como a OpenAI publica
 * o arquivo.
 *
 * O `span` e `aria-hidden` porque o nome do assistente ja abre o paragrafo ao
 * lado: anunciar a marca de novo seria repeticao para quem usa leitor de tela.
 *
 * No celular o icone sobe: manter o recuo custaria largura de leitura.
 */
export function Role({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-xl bg-neutral-200 text-neutral-900 sm:mt-1"
      >
        {icon}
      </span>
      <div className="min-w-0 [&>p:first-child]:mt-0">{children}</div>
    </div>
  );
}

