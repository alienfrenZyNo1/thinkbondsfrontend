/**
 * Next.js configuration for e2e: skip ESLint during production builds
 * to avoid formatting-related build failures in CI/test harness.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Re-enable ESLint during builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Re-enable type checking during builds
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
