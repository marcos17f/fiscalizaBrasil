import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/prefeitos": ["./src/data/tse2024/*.json.gz"],
    "/api/vereadores": ["./src/data/tse2024/*.json.gz"],
    "/api/tse/candidato": ["./src/data/tse2024/*.json.gz"],
  },
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
