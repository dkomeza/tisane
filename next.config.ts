import type { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";
const development = process.env.NODE_ENV !== "production";

const s3Endpoint = process.env.S3_PUBLIC_ENDPOINT
  ? new URL(process.env.S3_PUBLIC_ENDPOINT)
  : null;

const remotePatterns: RemotePattern[] = [
  // Production: allow any s3.* subdomain over HTTPS
  {
    protocol: "https",
    hostname: "s3.*",
    pathname: "/**",
  },
  // Development: allow the specific S3 endpoint from env
  ...(development && s3Endpoint
    ? [
        {
          protocol: s3Endpoint.protocol.replace(":", "") as "http" | "https",
          hostname: s3Endpoint.hostname,
          port: s3Endpoint.port,
          pathname: "/**",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: development,
    remotePatterns,
  },
};

export default nextConfig;
