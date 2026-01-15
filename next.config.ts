import type { NextConfig } from "next";
const development = process.env.NODE_ENV !== "production";
const S3_PUBLIC_ENDPOINT = process.env.S3_PUBLIC_ENDPOINT;

if (!S3_PUBLIC_ENDPOINT) {
  throw new Error("Missing S3_PUBLIC_ENDPOINT environment variable");
}

const url = new URL(S3_PUBLIC_ENDPOINT);
const protocol = url.protocol.replace(":", "");
const hostname = url.hostname;
const port = url.port ? url.port : undefined;

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: development,
    remotePatterns: [
      {
        protocol: protocol as "http" | "https",
        hostname: hostname,
        port: port,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
