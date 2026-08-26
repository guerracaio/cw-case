import type { ReactNode } from "react";

/**
 * Primitivas do modo Apresentação.
 *
 * Server Components puros, como o resto do documento: o modo inteiro é HTML e
 * CSS, sem uma linha de JavaScript no cliente.
 *
 * A navegação é `scroll-snap` mais links de âncora reais entre slides
 * vizinhos. Foi escolhido em vez de um carrossel controlado por estado por
 * três motivos concretos:
 *
 *  - funciona com o JavaScript desligado, que é a regra desta base;
 *  - a roda do mouse, o trackpad, PageDown, Home e End já fazem a coisa certa
 *    sem nenhum listener — o navegador resolve;
 *  - a URL de cada slide é compartilhável (`#slide-6`), o que importa quando
 *    a apresentação vira material de vídeo e alguém precisa apontar para um
 *    ponto específico.
 */

/** Quantos slides existem — usado no contador de cada rodapé. */
export const TOTAL_SLIDES = 10;

export function Slide({
  n,
  eyebrow,
  title,
  lede,
  children,
  tone = "light",
  cover = false,
  signature,
  above,
}: {
  n: number;
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
  tone?: "light" | "dark" | "purple";
  /**
   * Capa: título grande, conteúdo alinhado ao rodapé e a assinatura no lugar
   * do contador. Só o slide 1 usa.
   */
  cover?: boolean;
  /**
   * Substitui o contador à esquerda do rodapé e dispensa as setas: a capa
   * assina, o fechamento agradece. Nos slides do meio o rodapé é navegação.
   */
  signature?: string;
  /** Bloco acima do eyebrow — o logo, na capa. */
  above?: ReactNode;
}) {
  const surface = {
    light: "bg-white text-neutral-900",
    dark: "bg-neutral-900 text-white",
    purple: "bg-purple-600 text-white",
  }[tone];

  const eyebrowColor = tone === "light" ? "text-purple-600" : "text-green-500";
  const ledeColor = tone === "light" ? "text-neutral-800" : "text-white/80";
  const footRule = tone === "light" ? "border-neutral-200" : "border-white/20";
  const footText = tone === "light" ? "text-neutral-800" : "text-white/60";

  return (
    <section
      id={`slide-${n}`}
      aria-label={`Slide ${n} de ${TOTAL_SLIDES}: ${title}`}
      className={`flex min-h-[100svh] snap-start flex-col px-6 pt-10 pb-6 sm:px-12 sm:pt-14 lg:px-20 ${surface}`}
    >
      {/*
        Medida fixa, centrada. Sem ela o conteúdo acompanha a largura do
        monitor: numa tela larga a tabela do roadmap abre para 1800px e cada
        linha vira uma faixa que o olho não consegue seguir de ponta a ponta.

        72rem é a mesma medida dos slides do deck (1280 menos as margens), então
        os dois formatos leem com a mesma linha.
      */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        {above}

      {/*
        Na capa o bloco de texto desce para o rodapé — é o respiro que faz o
        título ler como abertura, e não como mais um slide de conteúdo.
      */}
      <div
        className={
          cover
            ? "flex min-h-0 flex-1 flex-col justify-end"
            : "contents"
        }
      >
        {eyebrow ? (
          <p
            className={`text-[11px] font-medium tracking-[0.14em] uppercase sm:text-xs ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
        ) : null}

        <h2
          className={
            cover
              ? "mt-3 max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              : "mt-2 max-w-5xl text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl"
          }
        >
          {title}
        </h2>

        {lede ? (
          <p
            className={`max-w-3xl ${cover ? "mt-5 text-base sm:text-lg" : "mt-3 text-sm sm:text-base"} ${ledeColor}`}
          >
            {lede}
          </p>
        ) : null}

        {/*
          `min-h-0` é o que permite a tabela rolar dentro do slide em vez de
          empurrar o rodapé para fora da tela: sem ele um filho flex assume a
          altura do conteúdo e o `overflow` do TableWrap nunca entra em ação.
        */}
        <div
          className={
            cover
              ? "mt-8"
              : "mt-6 flex min-h-0 flex-1 flex-col justify-center"
          }
        >
          {children}
        </div>
      </div>

        <SlideFoot
          n={n}
          rule={footRule}
          text={footText}
          signature={signature}
        />
      </div>
    </section>
  );
}

/**
 * Rodapé com a paginação e os links de vizinho.
 *
 * São `<a href="#slide-N">` de verdade, então funcionam sem script, aparecem
 * na navegação por teclado e podem ser copiados.
 */
function SlideFoot({
  n,
  rule,
  text,
  signature,
}: {
  n: number;
  rule: string;
  text: string;
  signature?: string;
}) {
  const prev = n > 1 ? `#slide-${n - 1}` : null;
  const next = n < TOTAL_SLIDES ? `#slide-${n + 1}` : null;
  const contador = `${String(n).padStart(2, "0")} / ${TOTAL_SLIDES}`;

  // Com assinatura o rodapé vira legenda: nome à esquerda, contador à direita.
  // As setas saem porque nas duas pontas elas não levam a lugar nenhum novo —
  // na capa os blocos já são os atalhos, e no fim não há próximo.
  if (signature) {
    return (
      <div
        className={`mt-6 flex shrink-0 items-center justify-between gap-4 border-t pt-3 text-[11px] font-medium tracking-[0.04em] sm:text-xs ${rule} ${text}`}
      >
        <span>{signature}</span>
        <span className="tabular-nums">{contador}</span>
      </div>
    );
  }

  return (
    <div
      className={`mt-6 flex shrink-0 items-center justify-between gap-4 border-t pt-3 text-[11px] font-medium tracking-[0.04em] sm:text-xs ${rule} ${text}`}
    >
      <span className="tabular-nums">{contador}</span>

      <span className="flex items-center gap-4">
        {prev ? (
          <a href={prev} className="hover:underline">
            ← anterior
          </a>
        ) : (
          <span className="opacity-40">← anterior</span>
        )}
        {next ? (
          <a href={next} className="hover:underline">
            próximo →
          </a>
        ) : (
          <span className="opacity-40">próximo →</span>
        )}
      </span>
    </div>
  );
}

/**
 * Número grande com rótulo. É a unidade de leitura do modo: o slide existe
 * para o número ser lido de longe, numa gravação de tela.
 */
export function Big({
  value,
  label,
  tone = "light",
}: {
  value: string;
  label: string;
  tone?: "light" | "green" | "outline";
}) {
  const surface = {
    light: "bg-neutral-200 text-neutral-900",
    green: "bg-green-500 text-neutral-900",
    outline: "border border-neutral-400 bg-white text-neutral-900",
  }[tone];

  return (
    <div className={`rounded-2xl px-5 py-4 sm:px-6 sm:py-5 ${surface}`}>
      <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-xs leading-snug opacity-80 sm:text-sm">{label}</p>
    </div>
  );
}

/**
 * Tabela do modo apresentação: mais compacta que a do documento e com rolagem
 * própria, para caber num slide sem empurrar o rodapé.
 */
export function SlideTable({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-0 overflow-auto">
      <table className="w-full border-collapse text-xs sm:text-sm">
        {children}
      </table>
    </div>
  );
}

export const STH =
  "sticky top-0 z-10 border-b border-neutral-400 bg-white px-2 pb-2 text-left text-[10px] font-medium tracking-[0.06em] whitespace-nowrap text-neutral-800 uppercase sm:px-3 sm:text-[11px]";

export const STD =
  "border-b border-neutral-200 px-2 py-2 align-top text-neutral-800 sm:px-3 sm:py-2.5";

export const SNUM = "text-right tabular-nums whitespace-nowrap";

/** Linha em destaque, no mesmo tratamento do documento. */
export const SHI =
  "[&>td]:bg-green-100 [&>td]:font-medium [&>td]:text-neutral-900 [&>td:first-child]:shadow-[inset_3px_0_0_var(--color-green-500)]";
