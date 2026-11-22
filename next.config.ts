import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fiscalizabrasil.org",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "divulgacandcontas.tse.jus.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.camara.leg.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.senado.leg.br",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
