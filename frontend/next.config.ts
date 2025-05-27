import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // Cambia el puerto si tu backend usa otro
      },
    ];
  },
};

export default nextConfig;
