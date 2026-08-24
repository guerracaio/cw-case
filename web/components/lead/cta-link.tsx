"use client";

import { track } from "@/lib/analytics/track";

/**
 * CTA primario.
 *
 * E um <a href> real, e nao um handler de navegacao: precisa ser rastreavel
 * por crawler e funcionar sem JavaScript. O evento e um efeito colateral do
 * clique, nunca a forma de navegar.
 */
export function CtaLink({
  href,
  children,
  className,
  location,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  location: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track("lead_cta_click", { location })}
    >
      {children}
    </a>
  );
}
