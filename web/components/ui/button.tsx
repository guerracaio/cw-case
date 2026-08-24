/**
 * Estilos de botao da marca.
 *
 * Exportado como funcao de classes, e nao como componente polimorfico, porque
 * os dois usos da pagina sao elementos diferentes: o CTA e um <a> real
 * (precisa ser rastreavel) e o envio do formulario e um <button type="submit">.
 */

const VARIANTS = {
  /** Roxo da marca sobre branco: o CTA primario. */
  primary: "bg-purple-600 text-white hover:bg-purple-600/90",
  /** Contorno neutro, para acoes secundarias. */
  secondary:
    "border border-neutral-900 text-neutral-900 hover:bg-neutral-200",
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
