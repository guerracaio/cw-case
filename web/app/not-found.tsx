import Link from "next/link";

import { ROUTES } from "@/lib/seo/site";

/**
 * 404 de verdade: o Next responde com status 404 nesta rota, em vez de
 * devolver 200 com uma mensagem de erro.
 */
export default function NotFound() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-4 text-neutral-800">
        O endereço que você abriu não existe ou foi movido.
      </p>
      <p className="mt-6">
        <Link href={ROUTES.calculator} className="underline">
          Ir para a calculadora de preço de venda
        </Link>
      </p>
    </main>
  );
}
