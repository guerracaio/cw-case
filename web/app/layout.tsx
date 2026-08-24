import type { Metadata } from "next";
import ReactDOM from "react-dom";
import Image from "next/image";
import Link from "next/link";

import { ROUTES, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Ferramentas de gestão para o seu negócio | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Ferramentas gratuitas da InfinitePay para quem vende produtos ou serviços.",
};

/*
  Apenas os pesos do conteudo acima da dobra entram em preload: Regular
  (corpo) e Bold (H1, forte candidato a LCP). Medium e usado em labels e
  botoes e carrega pelo proprio @font-face, sem competir com o LCP.
*/
const PRELOADED_FONTS = [
  "/fonts/CeraPro-Regular.woff2",
  "/fonts/CeraPro-Bold.woff2",
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Fontes exigem crossOrigin mesmo vindo do mesmo dominio: sem ele o preload
  // e descartado e o arquivo acaba baixado duas vezes.
  for (const href of PRELOADED_FONTS) {
    ReactDOM.preload(href, {
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    });
  }

  return (
    <html lang="pt-BR" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <header className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-5xl items-center px-4 py-4">
            <Link href={ROUTES.home} aria-label="InfinitePay, página inicial">
              <Image
                src="/brand/logo-horizontal-black.png"
                alt="InfinitePay"
                width={136}
                height={28}
                priority
              />
            </Link>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="mt-16 border-t border-neutral-200">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-neutral-800">
            <p>
              Os cálculos são estimativas baseadas nos valores que você informa
              e não substituem orientação contábil.
            </p>
            <p className="mt-2">
              {new Date().getFullYear()} {SITE_NAME}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
