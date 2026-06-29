import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared hosting (CloudLinux) caps the number of processes/threads per account.
  // `next/image` optimization uses `sharp`, which spawns native/libuv threads per
  // request — on a constrained plan that exhausts the thread limit
  // (pthread_create: Resource temporarily unavailable). Our source images are
  // already optimized webp, so serve them directly instead of re-optimizing.
  images: { unoptimized: true },

  // Don't burn worker threads building source maps in production.
  productionBrowserSourceMaps: false,

  // Keep the static-generation worker pool tiny so the build/runtime stays well
  // under the host's process limit (default scales with visible CPU count).
  experimental: {
    cpus: 1,
    workerThreads: false,
  },

  // The hero frame images never change — cache them hard so a browser only ever
  // fetches each one once (no re-requests on repeat visits / client navigation).
  async headers() {
    return [
      {
        source: "/frames-t/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/frames-t-sm/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
