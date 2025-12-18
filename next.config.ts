import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React Strict Mode to prevent Daily.co duplicate instance errors
  // React Strict Mode intentionally double-mounts components in development
  // which conflicts with Daily.co's singleton pattern
  reactStrictMode: false,
};

export default nextConfig;
