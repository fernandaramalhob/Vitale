import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@vitale/ui",
    "@vitale/shared-types",
    "@vitale/shared-utils"
  ],
};

export default nextConfig;
