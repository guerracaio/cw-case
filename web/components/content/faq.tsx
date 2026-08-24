import { FAQ } from "@/content/calculadora-de-precos";

/**
 * FAQ em <details> nativo.
 *
 * O conteudo existe no HTML mesmo fechado e nao depende de JavaScript para
 * abrir. O <h3> dentro do <summary> preserva a hierarquia de headings, que e
 * o que faz cada resposta ser extraivel isoladamente.
 *
 * O <summary> e explicitamente `flex`, e nao o `list-item` que o Preflight
 * aplica: com `display: list-item` e um heading inline dentro, o Safari no
 * iOS calcula a altura errada e a resposta vaza por cima da proxima pergunta.
 * O marcador nativo e removido em globals.css, porque `list-style` sozinho
 * nao apaga o triangulo do WebKit.
 *
 * A resposta fica num <div> proprio, e nao solta como irmao do <summary>:
 * um unico no de bloco e o que o details espera receber como conteudo.
 */
export function Faq() {
  return (
    <div className="mt-6 border-b border-neutral-200">
      {FAQ.map((item) => (
        <details
          key={item.question}
          className="group border-t border-neutral-200"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-4">
            <h3 className="font-medium">{item.question}</h3>
            <span
              aria-hidden="true"
              className="shrink-0 text-xl leading-none text-purple-600 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="pb-4">
            <p className="text-neutral-800">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
