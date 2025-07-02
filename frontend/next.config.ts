import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  async rewrites() {
    return isDev
      ? [
          {
            source: "/api/:path*",
            destination: "http://localhost:5000/api/:path*",
          },
          {
            source: "/uploads/:path*",
            destination: "http://localhost:5000/uploads/:path*",
          },
        ]
      : [];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
