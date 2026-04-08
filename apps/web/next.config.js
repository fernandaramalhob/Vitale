/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@vitale/ui",
    "@vitale/shared-types",
    "@vitale/shared-utils"
  ],
};

module.exports = nextConfig;
