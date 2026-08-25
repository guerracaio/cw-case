import { ROUTES, absoluteUrl } from "@/lib/seo/site";

/**
 * Atalhos para pedir um resumo do documento a uma IA.
 *
 * O documento e longo. Em vez de resumi-lo por conta propria, a pagina
 * entrega o proprio endereco ja embutido num prompt: quem prefere ouvir a
 * versao curta antes de ler abre o assistente que ja usa.
 *
 * Sao links HTML reais, montados em build time. Nada aqui precisa de
 * JavaScript no cliente.
 *
 * Os nomes aparecem por extenso em vez de logotipo. Sao marcas registradas de
 * terceiros: redesenha-las de memoria produziria uma reproducao imprecisa, e
 * quatro circulos sem rotulo obrigariam a pessoa a adivinhar qual e qual.
 */

const PROMPT = `Resuma e analise o conteúdo desta página: ${absoluteUrl(
  ROUTES.caseDoc,
)}`;

const QUERY = encodeURIComponent(PROMPT);

const ASSISTANTS: Array<{ name: string; href: string }> = [
  { name: "Claude", href: `https://claude.ai/new?q=${QUERY}` },
  { name: "ChatGPT", href: `https://chat.openai.com/?q=${QUERY}` },
  { name: "Gemini", href: `https://gemini.google.com/app?q=${QUERY}` },
  { name: "Perplexity", href: `https://www.perplexity.ai/search?q=${QUERY}` },
];

export function AiSummary({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="resumo-ia"
      className={`rounded-xl bg-neutral-200 p-4 ${className ?? ""}`}
    >
      <h2
        id="resumo-ia"
        className="text-[11px] font-medium tracking-[0.14em] text-neutral-800 uppercase"
      >
        Resumir com IA
      </h2>

      <p className="mt-2 text-xs text-neutral-800">
        Abre o assistente com o endereço desta página já no prompt.
      </p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {ASSISTANTS.map((assistant) => (
          <li key={assistant.name}>
            <a
              href={assistant.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-purple-0"
            >
              {assistant.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
