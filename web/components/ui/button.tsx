/**
 * Estilos de botao da marca.
 *
 * Exportado como funcao de classes, e nao como componente polimorfico, porque
 * os dois usos da pagina sao elementos diferentes: o CTA e um <a> real
 * (precisa ser rastreavel) e o envio do formulario e um <button type="submit">.
 */

const VARIANTS = {
  /** Verde da marca com texto preto: a acao primaria. */
  primary: "bg-green-500 text-neutral-900 hover:bg-green-300",
  /** Cinza claro com texto preto: acoes secundarias, sem contorno. */
  secondary: "bg-neutral-200 text-neutral-900 hover:bg-neutral-400",
  /**
   * Preto sobre superficie colorida. O botao primario e verde e sumiria
   * dentro do painel de resultado, que tambem e verde.
   */
  contrast: "bg-neutral-900 text-white hover:bg-neutral-800",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

export function buttonClass(
  variant: ButtonVariant = "primary",
  extra = "",
): string {
  return [
    "inline-flex items-center justify-center rounded-full px-6 py-3",
    "text-base font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant],
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}
