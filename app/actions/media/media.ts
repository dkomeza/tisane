"use server";

import { s3Client } from "@/lib/storage";
import prisma from "@/lib/prisma";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { refresh } from "next/cache";
const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
const ALLOWED_PREFIX = "image/";
const URL_EXPIRATION_SECONDS = 3600;

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  if (!file.type.startsWith(ALLOWED_PREFIX)) {
    throw new Error("Only image uploads are allowed");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("File exceeds 5GB limit");
  }

  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${Date.now()}-${sanitizedFileName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const media = await prisma.media.create({
      data: {
        key,
        url: "",
        mimeType: file.type,
        size: file.size,
        bucket: process.env.S3_BUCKET!,
      },
    });

    const command = new GetObjectCommand({
      Bucket: media.bucket,
      Key: media.key,
    });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: URL_EXPIRATION_SECONDS,
    });

    refresh();
    return {
      success: true,
      data: { ...media, url: signedUrl },
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file");
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
        const command = new GetObjectCommand({
          Bucket: item.bucket,
          Key: item.key,
        });

        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: URL_EXPIRATION_SECONDS,
        });

        return {
          ...item,
          url: signedUrl,
        };
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
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: media.bucket, Key: media.key })
    );

    await prisma.media.delete({ where: { id } });

    refresh();

    return { success: true, id };
  } catch (err) {
    console.error("Failed to delete media:", err);
    return { success: false, message: "Delete failed" };
  }
}
