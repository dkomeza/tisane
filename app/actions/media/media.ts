"use server";

import { s3Client } from "@/lib/storage";
import prisma from "@/lib/prisma";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { revalidatePath } from "next/cache";

const ALLOWED_PREFIX = "image/";
const MAX_SIZE = 50 * 1024 * 1024;
const URL_EXPIRATION_SECONDS = 3600;

export async function getPresignedUploadUrl(filename: string, contentType: string) {
  if (!contentType.startsWith(ALLOWED_PREFIX)) {
    throw new Error("Only image uploads are allowed");
  }

  const sanitizedFileName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${Date.now()}-${sanitizedFileName}`;

  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Conditions: [
        ["content-length-range", 0, MAX_SIZE],
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        "Content-Type": contentType,
      },
      Expires: 600,
    });

    let publicUrl = url;
    if (process.env.S3_PUBLIC_BASE_URL && url.includes("minio")) {
       publicUrl = url.replace("http://minio:9000", "http://localhost:9000");
        // publicUrl = url.replace(process.env.S3_INTERNAL_ENDPOINT!, process.env.S3_PUBLIC_BASE_URL);
    }

    return { success: true, url: publicUrl, fields, key };
  } catch (error: any) {
    console.error("Presigned URL error:", error);
    return { success: false, error: error.message };
  }
}

export async function registerMediaInDb(key: string, type: string, size: number) {
  try {
    const media = await prisma.media.create({
      data: {
        key,
        url: "",
        mimeType: type,
        size: size,
        bucket: process.env.S3_BUCKET!,
      },
    });

    revalidatePath("/admin/media");
    return { success: true, data: media };
  } catch (error: any) {
    console.error("DB Register error:", error);
    return { success: false, error: error.message };
  }
}

export async function getMediaList({ page = 1, pageSize = 20 } = {}) {
  const skip = (page - 1) * pageSize;

  try {
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.media.count(),
    ]);

    const itemsWithSignedUrls = await Promise.all(
      items.map(async (item) => {
        const command = new GetObjectCommand({ Bucket: item.bucket, Key: item.key });
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: URL_EXPIRATION_SECONDS });
        return { ...item, url: signedUrl };
      })
    );

    return {
      items: itemsWithSignedUrls,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return { items: [], total: 0, page, pageSize, totalPages: 0 };
  }
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return { success: false, message: "Media not found" };

  try {
    await s3Client.send(new DeleteObjectCommand({ Bucket: media.bucket, Key: media.key }));
    await prisma.media.delete({ where: { id } });
    revalidatePath("/admin/media");
    return { success: true, id };
  } catch (err) {
    console.error("Failed to delete media:", err);
    return { success: false, message: "Delete failed" };
  }
}