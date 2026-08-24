import { FAQ } from "@/content/calculadora-de-precos";

/**
 * FAQ em <details> nativo.
 *
 * O conteudo existe no HTML mesmo fechado e nao depende de JavaScript para
 * abrir. O <h3> dentro do <summary> preserva a hierarquia de headings, que e
 * o que faz cada resposta ser extraivel isoladamente.
 */
export function Faq() {
  return (
    <div className="mt-6 border-b border-neutral-200">
      {FAQ.map((item) => (
        <details
          key={item.question}
          className="border-t border-neutral-200 py-2"
        >
          <summary className="cursor-pointer list-none py-2">
            <h3 className="inline font-medium">{item.question}</h3>
          </summary>
          <p className="pb-3 text-neutral-800">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
