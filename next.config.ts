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
  // Cache static media in public/ so client navigations don't re-fetch them.
  // Files are kept for a day and revalidated in the background for a week, so a
  // replaced file (same name) still propagates without a year-long stale cache.
  async headers() {
    return [
      {
        source: "/:path*.(mov|webm|mp4|png|jpg|jpeg|gif|svg|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
