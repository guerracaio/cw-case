"use client";

import { track, type ConversionEvent } from "@/lib/analytics/track";

/**
 * CTA primario.
 *
 * E um <a href> real, e nao um handler de navegacao: precisa ser rastreavel
 * por crawler e funcionar sem JavaScript. O evento e um efeito colateral do
 * clique, nunca a forma de navegar.
 *
 * O evento e configuravel porque nem todo CTA pertence ao funil de lead: um
 * link que leva a pessoa para fora do site e "site_cta_click", nao
 * "lead_cta_click".
 */
export function CtaLink({
  href,
  children,
  className,
  location,
  event = "site_cta_click",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  location: string;
  event?: ConversionEvent;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(event, { location })}
    >
      {children}
    </a>
  );
}
