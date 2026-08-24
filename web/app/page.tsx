import Link from "next/link";

import { buttonClass } from "@/components/ui/button";
import { ROUTES } from "@/lib/seo/site";

/**
 * Home minima. Existe para que a ferramenta tenha um caminho de navegacao
 * real a partir da raiz e nao fique orfa para o crawler.
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">
        Ferramentas para quem vende
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-800">
        Ferramentas gratuitas da InfinitePay para organizar preço, margem e
        lucro do seu negócio.
      </p>

      <h2 className="mt-12 text-2xl font-bold">Calculadoras disponíveis</h2>
      <ul className="mt-4">
        <li>
          <Link href={ROUTES.calculator} className="underline">
            Calculadora de preço de venda
          </Link>
          <p className="mt-1 text-neutral-800">
            Descubra por quanto vender um produto ou serviço cobrindo custos,
            impostos, taxas e a margem de lucro que você quer.
          </p>
        </li>
      </ul>

      <p className="mt-8">
        <Link href={ROUTES.calculator} className={buttonClass("primary")}>
          Abrir a calculadora
        </Link>
      </p>
    </main>
  );
}
