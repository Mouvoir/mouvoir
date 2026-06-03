import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without it, Turbopack can infer a
  // parent directory as the root and then fail to resolve modules (e.g.
  // tailwindcss) that live in this project's node_modules.
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    proxyClientMaxBodySize: "250mb",
    serverActions: {
      bodySizeLimit: "250mb",
    },
  },
};

export default nextConfig;
