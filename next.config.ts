import type { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";
const development = process.env.NODE_ENV !== "production";

const s3Endpoint = process.env.S3_PUBLIC_ENDPOINT
  ? new URL(process.env.S3_PUBLIC_ENDPOINT)
  : null;

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: development,
    remotePatterns: s3Endpoint
      ? ([
          {
            protocol: s3Endpoint.protocol.replace(":", ""),
            hostname: s3Endpoint.hostname,
            port: s3Endpoint.port,
            pathname: "/**",
          },
        ] as RemotePattern[])
      : undefined,
  },
};

export default nextConfig;
