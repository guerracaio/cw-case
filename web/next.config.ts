import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // As URLs canonicas do roadmap terminam em "/". Manter uma unica forma
  // indexavel evita duplicacao: a variante sem barra redireciona com 308.
  trailingSlash: true,
};

export default nextConfig;
