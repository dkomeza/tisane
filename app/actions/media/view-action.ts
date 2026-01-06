"use server";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Signer } from "@/lib/storage";
import prisma from "@/lib/prisma";

export async function getFileUrl(fileName: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
    });

    const url = await getSignedUrl(s3Signer, command, { expiresIn: 3600 });

    return { success: true, url };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return { success: false, error: "Could not generate URL" };
  }
}

export async function getMedia(fileID: string) {
  try {
    const media = await prisma.media.findUnique({
      where: { id: fileID },
    });

    if (!media) return null;

    media.url = (await getFileUrl(media.key)).url || "";

    return media;
  } catch (error) {
    console.error("Error fetching media from DB:", error);
    return null;
  }
}
