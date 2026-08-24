/**
 * Conteudo da pagina da calculadora.
 *
 * Fica separado do layout por dois motivos: alimenta ao mesmo tempo o HTML
 * visivel e o JSON-LD (garantindo que o schema so descreva o que esta na
 * tela), e sera reaproveitado pelas paginas satelite quando elas entrarem.
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export type HowToStep = {
  name: string;
  text: string;
};

export const PAGE = {
  title: "Calculadora de preço de venda para produtos e serviços",
  description:
    "Calcule o preço de venda somando custo, despesas, impostos, taxa de pagamento e a margem de lucro que você quer. Veja a fórmula, um exemplo com números e o quanto sobra de lucro.",
  h1: "Calculadora de preço de venda",
  directAnswer:
    "O preço de venda é o valor que cobre o custo do produto ou serviço, as despesas, os impostos e a taxa do meio de pagamento, e ainda deixa a margem de lucro que você definiu. Para calcular, some os custos e divida esse total por 1 menos a soma dos percentuais que incidem sobre a venda. A calculadora abaixo faz essa conta e mostra quanto de cada real do preço vai para custo, imposto, taxa e lucro.",
} as const;

export const PRODUCT_FORMULA =
  "Preço de venda = (custo do produto + custos variáveis) / (1 - (despesas % + impostos % + taxa de pagamento % + margem %))";

export const SERVICE_HOUR_FORMULA =
  "Custo por hora = (custos fixos do mês + pró-labore desejado) / horas produtivas do mês";

export const SERVICE_FORMULA =
  "Preço do serviço = (custo por hora x horas do serviço + materiais) / (1 - (impostos % + taxa de pagamento % + margem %))";

export const HOW_TO_STEPS: HowToStep[] = [
  {
    name: "Some os custos diretos",
    text: "Junte quanto o produto custou para ser comprado ou produzido e tudo que sai a cada venda, como embalagem e frete. Em serviços, o custo direto é o custo por hora multiplicado pelas horas do trabalho, mais o material aplicado.",
  },
  {
    name: "Liste os percentuais que incidem sobre a venda",
    text: "Despesas operacionais, impostos e a taxa do meio de pagamento são calculados sobre o preço final, não sobre o custo. É por isso que somá-los ao custo dá um preço menor do que o necessário.",
  },
  {
    name: "Defina a margem de lucro",
    text: "Escolha quanto do preço final deve sobrar como lucro depois de tudo pago. Uma margem de 20% significa que R$ 20 de cada R$ 100 vendidos são lucro.",
  },
  {
    name: "Subtraia os percentuais de 100%",
    text: "Some despesas, impostos, taxa de pagamento e margem, e subtraia esse total de 100%. O resultado é a fatia do preço que sobra para pagar o custo.",
  },
  {
    name: "Divida o custo por essa fatia",
    text: "Dividir o custo total pelo resultado do passo anterior dá o preço de venda. Se a soma dos percentuais chegar a 100% ou mais, não existe preço possível: é preciso reduzir custos, taxas ou margem.",
  },
];

export const FAQ: FaqItem[] = [
  {
    question: "Qual é a fórmula do preço de venda?",
    answer:
      "A fórmula é: preço de venda = custo total dividido por (1 menos a soma dos percentuais que incidem sobre a venda). Com um custo de R$ 45 e percentuais somando 39,5%, o cálculo é R$ 45 / 0,605 = R$ 74,38.",
  },
  {
    question: "Como calcular o preço de venda com imposto?",
    answer:
      "O imposto entra como percentual sobre o preço de venda, junto com as despesas, a taxa de pagamento e a margem. Some todos esses percentuais, subtraia de 100% e divida o custo pelo resultado. Somar o imposto direto ao custo subestima o preço, porque o imposto é cobrado sobre o valor final da venda.",
  },
  {
    question: "Qual a diferença entre margem de lucro e markup?",
    answer:
      "A margem é o percentual do preço de venda que sobra como lucro. O markup é o multiplicador aplicado sobre o custo para chegar ao preço. Um produto de R$ 45 vendido a R$ 74,38 tem markup de 1,65 e margem de lucro de 20%.",
  },
  {
    question: "Como calcular o preço de um serviço?",
    answer:
      "Primeiro descubra seu custo por hora: some os custos fixos do mês e o quanto você quer receber, e divida pelas horas realmente vendáveis. Depois multiplique esse custo pelas horas do serviço, some o material aplicado e divida pelo mesmo fator de impostos, taxas e margem.",
  },
  {
    question: "Quanto cobrar por hora de trabalho?",
    answer:
      "Some os custos fixos mensais e o valor que você quer receber por mês, e divida pelas horas produtivas. Quem trabalha 8 horas por dia raramente tem 160 horas vendáveis: descontando prospecção, deslocamento e administração, o número real costuma ficar entre 100 e 130 horas, o que aumenta o custo de cada hora.",
  },
  {
    question: "Como calcular o preço por quilo?",
    answer:
      "Calcule o preço da produção inteira com a mesma fórmula e divida pelo peso final em quilos. O peso a usar é o do produto pronto, depois de perdas e cozimento, e não a soma dos ingredientes crus.",
  },
  {
    question: "Preciso incluir a taxa da maquininha no preço?",
    answer:
      "Sim. A taxa do meio de pagamento é descontada do valor recebido, então ela precisa estar dentro do preço como percentual sobre a venda. Se ela ficar de fora, o lucro real fica abaixo da margem planejada.",
  },
  {
    question: "Qual margem de lucro é ideal?",
    answer:
      "Não existe um número único: depende do giro, da concorrência e do tipo de operação. Produtos de alto volume e baixo valor costumam trabalhar com margens menores, enquanto serviços especializados sustentam margens maiores. O importante é que a margem cubra o risco do negócio e sobreviva a descontos.",
  },
];
