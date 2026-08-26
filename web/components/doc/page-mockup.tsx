import Image from "next/image";

/**
 * Miniatura da página publicada, dentro de um quadro de navegador.
 *
 * É um desenho, não um `iframe` da página real. Um iframe traria a página
 * inteira em escala de leitura — ilegível neste tamanho — e um segundo
 * documento com suas próprias fontes e scripts dentro de um slide que precisa
 * ser estático. Aqui o que importa é a forma: onde fica a ferramenta, onde
 * começa o conteúdo, e que o preço aparece antes do formulário.
 *
 * Os números são os mesmos do exemplo publicado (R$ 74,38 sobre custo de
 * R$ 45,00), então a miniatura não contradiz a página que ela representa.
 */
export function PageMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-400 bg-white">
      {/* barra do navegador */}
      <div className="flex items-center gap-2 border-b border-neutral-400 bg-neutral-200 px-3 py-2">
        <span className="size-1.5 rounded-full bg-neutral-400" />
        <span className="size-1.5 rounded-full bg-neutral-400" />
        <span className="size-1.5 rounded-full bg-neutral-400" />
        <span className="ml-2 truncate font-mono text-[9px] text-neutral-800">
          cw-case.vercel.app/ferramentas/calculadora-de-precos/
        </span>
      </div>

      <div className="px-4 pt-3 pb-4">
        {/* cabeçalho da página */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
          <Image
            src="/brand/logo-horizontal-black.png"
            alt=""
            width={64}
            height={13}
          />
          <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-[6px] font-medium">
            página não oficial · protótipo de case
          </span>
        </div>

        <p className="mt-3 text-[7px] text-purple-600">
          Início › Calculadora de preço de venda
        </p>
        <p className="mt-1 text-[13px] font-bold tracking-tight">
          Calculadora de preço de venda
        </p>
        <p className="mt-1.5 max-w-[85%] text-[7px] leading-relaxed text-neutral-800">
          O preço de venda é o valor que cobre o custo, as despesas, os impostos
          e a taxa do meio de pagamento, e ainda deixa a margem de lucro que
          você definiu.
        </p>

        {/* a ilha da calculadora */}
        <div className="mt-3 flex gap-2.5 rounded-lg border border-neutral-200 p-2.5">
          <div className="flex w-[44%] flex-col gap-1.5">
            <div className="flex gap-1">
              <span className="rounded-full bg-neutral-900 px-2 py-[3px] text-[6px] font-medium text-white">
                Produto
              </span>
              <span className="rounded-full bg-neutral-200 px-2 py-[3px] text-[6px] font-medium">
                Serviço
              </span>
            </div>
            {[
              "Custo unitário",
              "Impostos",
              "Taxa de pagamento",
              "Margem de lucro",
            ].map((label) => (
              <div key={label}>
                <p className="text-[6px] font-medium">{label}</p>
                <div className="mt-[2px] h-3 rounded border border-neutral-400" />
              </div>
            ))}
          </div>

          <div className="flex-1 rounded-lg bg-green-500 p-2">
            <p className="text-[6px] font-medium">Preço de venda sugerido</p>
            <p className="text-base font-bold tracking-tight tabular-nums">
              R$ 74,38
            </p>
            <dl className="mt-1.5 flex flex-col gap-1">
              {["Custo", "Impostos", "Taxa de pagamento", "Lucro"].map((l) => (
                <div
                  key={l}
                  className="flex justify-between border-t border-neutral-900/15 pt-1 text-[6px]"
                >
                  <dt>{l}</dt>
                  <dd aria-hidden="true" className="blur-[1.5px]">
                    R$ ••••
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 rounded-full bg-neutral-900 py-1 text-center text-[6px] font-medium text-white">
              Ver o detalhamento
            </p>
          </div>
        </div>

        {/* o conteúdo indexável, abaixo da ferramenta */}
        <div className="mt-3 flex flex-col gap-1.5">
          {[
            "Como calcular o preço de venda?",
            "Fórmula do preço de venda",
            "Exemplo prático",
            "Como calcular o preço de um serviço?",
            "Perguntas frequentes",
          ].map((h2) => (
            <p key={h2} className="text-[8px] font-bold">
              {h2}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
