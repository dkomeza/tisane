import { S3Client } from "@aws-sdk/client-s3";

const envEndpoint = process.env.S3_INTERNAL_ENDPOINT;

const finalEndpoint = envEndpoint?.includes("minio")
  ? "http://127.0.0.1:9000"
  : envEndpoint || "http://127.0.0.1:9000";

export const s3Client = new S3Client({
  region: "us-east-1", // MinIO default
  endpoint: finalEndpoint, // e.g. http://minio:9000
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});
