import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {},
  },
  images: {
    domains: ["api.dicebear.com"],
  },
};

export default nextConfig;
