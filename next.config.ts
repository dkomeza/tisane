import type { NextConfig } from "next";
const development = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: development,
  },
};

export default nextConfig;
