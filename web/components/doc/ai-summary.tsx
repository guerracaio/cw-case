import type { ReactNode } from "react";

import {
  ClaudeLogo,
  GeminiLogo,
  OpenAiLogo,
  PerplexityLogo,
} from "@/components/doc/ai-logos";
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
 * O nome fica ao lado da marca, e nao no lugar dela: quatro simbolos soltos
 * obrigariam a pessoa a reconhecer cada um antes de escolher.
 */

const PROMPT = `Resuma e analise o conteúdo desta página: ${absoluteUrl(
  ROUTES.caseDoc,
)}`;

const QUERY = encodeURIComponent(PROMPT);

const ASSISTANTS: Array<{ name: string; href: string; logo: ReactNode }> = [
  {
    name: "Claude",
    href: `https://claude.ai/new?q=${QUERY}`,
    logo: <ClaudeLogo />,
  },
  {
    name: "ChatGPT",
    href: `https://chat.openai.com/?q=${QUERY}`,
    logo: <OpenAiLogo />,
  },
  {
    /*
      O Gemini nao entra pelo gemini.google.com/app: aquele endereco nao
      documenta parametro de prompt e costuma abrir a conversa em branco.
      O caminho que funciona e o AI Mode da busca, que roda em Gemini e
      aceita a pergunta na propria URL — `udm=50` e o que troca a SERP
      classica pelo modo de IA. E o mesmo caminho que a InfinitePay usa
      hoje nas proprias paginas.

      A URL de referencia trazia tambem `mstk` e `csuir`, que sao tokens de
      sessao de quem gerou o link, e `aep`, que identifica a superficie de
      entrada. Nada disso vale colado aqui: token de sessao alheia nao
      transfere, e o resto e ruido.
    */
    name: "Gemini",
    href: `https://www.google.com/search?udm=50&q=${QUERY}`,
    logo: <GeminiLogo />,
  },
  {
    name: "Perplexity",
    href: `https://www.perplexity.ai/search?q=${QUERY}`,
    logo: <PerplexityLogo />,
  },
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

      <ul className="mt-3 grid grid-cols-2 gap-2">
        {ASSISTANTS.map((assistant) => (
          <li key={assistant.name}>
            <a
              href={assistant.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-purple-0"
            >
              {assistant.logo}
              {assistant.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
