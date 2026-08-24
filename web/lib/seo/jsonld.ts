import type { FaqItem, HowToStep } from "@/content/calculadora-de-precos";
import { INFINITEPAY_URL, SITE_NAME, absoluteUrl } from "./site";

/**
 * Builders de Structured Data.
 *
 * Todos recebem exatamente o mesmo dado que a pagina renderiza. Nao existe
 * schema descrevendo algo que nao esta visivel: e a regra que separa marcacao
 * legitima de marcacao inventada para forcar rich result.
 */

/**
 * A InfinitePay como entidade. A `url` e a do site dela, nao a do dominio
 * onde esta aplicacao esta publicada: sao coisas diferentes, e declarar o
 * dominio do deploy aqui afirmaria que a organizacao vive nele.
 */
const organization = {
  "@type": "Organization",
  name: SITE_NAME,
  url: INFINITEPAY_URL,
};

export function webApplicationSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    publisher: organization,
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function howToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    inLanguage: "pt-BR",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
