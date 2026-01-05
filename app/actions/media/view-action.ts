"use server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/storage";

export async function getFileUrl(fileName: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.MINIO_BUCKET_NAME,
    Key: fileName,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}
