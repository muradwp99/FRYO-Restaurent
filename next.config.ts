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
};

export default nextConfig;
