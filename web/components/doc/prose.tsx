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


/* --------------------------------- icones -------------------------------- */

/*
  Icones de estrutura, nao de enfeite: cada um marca um TIPO de bloco que se
  repete ao longo do documento. A pagina e longa e de leitura corrida, e sem
  eles os blocos so se distinguem lendo o rotulo — o olho nao acha nada
  folheando.
  
  Todos herdam a cor de quem os contem (`currentColor`) e sao `aria-hidden`:
  ao lado de cada um ja existe um rotulo em texto que diz a mesma coisa.
  Repetir isso no leitor de tela seria ruido.

  Tracado, e nao preenchimento: em 14 ou 16px o contorno segura melhor o peso
  do texto ao lado do que uma mancha solida.
*/
const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Seta: esta conclusao levou a proxima etapa. */
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg {...STROKE} className={className}>
      <path d="M4 12h14" />
      <path d="m13 7 5 5-5 5" />
    </svg>
  );
}

/** Triangulo de atencao: o que enfraquece o argumento. */
function AlertIcon({ className }: { className?: string }) {
  return (
    <svg {...STROKE} className={className}>
      <path d="M12 4 21 19.5H3z" />
      <path d="M12 10v4" />
      <path d="M12 17.2h.01" />
    </svg>
  );
}

/** Brilho: a conclusao que carrega a decisao. */
function SparkIcon({ className }: { className?: string }) {
  return (
    <svg {...STROKE} className={className}>
      <path d="M12 3.5 13.9 9 19.5 11 13.9 13 12 18.5 10.1 13 4.5 11 10.1 9z" />
    </svg>
  );
}

/** Circulo com i: contexto lateral. */
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg {...STROKE} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11.5v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

/** Circulo com ?: a pergunta que abre a etapa. */
function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg {...STROKE} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.7 9.4a2.4 2.4 0 1 1 2.9 2.7c-.5.1-.8.6-.8 1.2v.5" />
      <path d="M12 16.6h.01" />
    </svg>
  );
}

/** Marca de conferido: item de checklist. */
export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg {...STROKE} className={className}>
      <path d="m4.5 12.5 5 5L19.5 6.5" />
    </svg>
  );
}

/* ------------------------------ componentes ----------------------------- */

/** A pergunta que abre cada etapa. */
export function Question({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-r-xl border-l-[3px] border-purple-600 bg-neutral-200 px-5 py-3.5">
      <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.13em] text-purple-600 uppercase">
        <QuestionIcon className="size-3.5 shrink-0" />
        Pergunta
      </p>
      <p className="mt-1 font-medium">{children}</p>
    </div>
  );
}

/**
 * Bloco destacado. O `tone` diz que PAPEL o bloco cumpre no texto, e dele
 * saem a superficie e o icone — nao e escolha de cor solta:
 *
 *  - `next`   as cinco conclusoes que abrem a etapa seguinte. Sao uma
 *             corrente, e a seta e o roxo em dose baixa deixam a corrente
 *             visivel de longe, sem precisar ler os rotulos.
 *  - `caveat` o que enfraquece o argumento. Sem laranja: o guia reserva a
 *             familia e proibe nesta pagina, entao o peso vem da barra preta
 *             a esquerda e do triangulo, nao da cor.
 *  - `key`    a conclusao que carrega a decisao. Verde forte, o maior peso
 *             visual disponivel, reservado a dois blocos no documento inteiro.
 *  - `default` contexto lateral.
 */
export function Callout({
  label,
  tone = "default",
  children,
}: {
  label?: string;
  tone?: "default" | "key" | "caveat" | "next";
  children: ReactNode;
}) {
  const style = {
    default: {
      surface: "rounded-2xl bg-neutral-200",
      label: "text-neutral-800",
      icon: "text-purple-600",
      Icon: InfoIcon,
    },
    next: {
      // Rotulo em preto, seta em roxo. Roxo-600 sobre roxo-0 da 4,7:1 —
      // passa em AA e para por ai, e este rotulo tem 11px em caixa alta.
      // Em preto sobe para 12,6:1; o roxo fica na seta, onde 3:1 basta.
      surface: "rounded-2xl bg-purple-0",
      label: "text-neutral-900",
      icon: "text-purple-600",
      Icon: ArrowIcon,
    },
    caveat: {
      // Canto reto do lado da barra: arredondado, o filete preto encurta e
      // some nas pontas.
      surface: "rounded-r-2xl border-l-[3px] border-neutral-900 bg-neutral-200",
      label: "text-neutral-900",
      icon: "text-neutral-900",
      Icon: AlertIcon,
    },
    key: {
      surface: "rounded-2xl bg-green-500 text-neutral-900",
      label: "text-neutral-900/70",
      icon: "text-neutral-900",
      Icon: SparkIcon,
    },
  }[tone];

  const { Icon } = style;

  return (
    <div className={`mt-7 px-6 py-5 ${style.surface}`}>
      {label ? (
        <p
          className={`flex items-center gap-1.5 text-[11px] font-medium tracking-[0.13em] uppercase ${style.label}`}
        >
          <Icon className={`size-3.5 shrink-0 ${style.icon}`} />
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

