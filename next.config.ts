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
    ],
  },
};

export default nextConfig;
