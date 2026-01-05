import { S3Client } from "@aws-sdk/client-s3";

const globalConfig = {
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
};

export const s3Client = new S3Client({
  ...globalConfig,
  endpoint: process.env.S3_ENDPOINT, 
});

export const s3Signer = new S3Client({
  ...globalConfig,
  endpoint: process.env.S3_PUBLIC_ENDPOINT, 
});