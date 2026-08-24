import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // As URLs canonicas do roadmap terminam em "/". Manter uma unica forma
  // indexavel evita duplicacao: a variante sem barra redireciona com 308.
  trailingSlash: true,

  // Em desenvolvimento o Next bloqueia requisicoes cross-origin aos assets do
  // dev server. Sem isto, abrir a aplicacao pelo IP da rede local (para testar
  // no celular, por exemplo) carrega o HTML mas falha nos assets.
  // Ajuste a faixa se a sua rede usar outra.
  allowedDevOrigins: ["192.168.0.*", "192.168.1.*", "10.0.0.*"],
};

export default nextConfig;
