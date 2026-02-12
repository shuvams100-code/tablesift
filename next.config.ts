import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  transpilePackages: ['pdfjs-dist'],
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
