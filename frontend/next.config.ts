import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Repo root may have its own package-lock; keep Turbopack rooted on this app
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
