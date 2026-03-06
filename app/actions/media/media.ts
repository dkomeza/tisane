"use server";

import { s3Client, s3Signer } from "@/lib/storage";
import prisma from "@/lib/prisma";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { refresh } from "next/cache";
const ALLOWED_PREFIXES = [
  "image/",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const URL_EXPIRATION_SECONDS = 3600; // 1 Hour

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
) {
  const isAllowed = ALLOWED_PREFIXES.some((prefix) =>
    contentType.startsWith(prefix),
  );
  if (!isAllowed) {
    throw new Error("Only images and documents are allowed");
  }

  const sanitizedFileName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${Date.now()}-${sanitizedFileName}`;

  try {
    const { url, fields } = await createPresignedPost(s3Signer, {
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

    return { success: true, url, fields, key };
  } catch (error) {
    console.error("Presigned URL error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function registerMediaInDb(
  key: string,
  type: string,
  size: number,
  width: number,
  height: number,
  folderId?: string | null,
  displayName?: string,
) {
  try {
    // Derive a display name from the key if not provided
    const name = displayName || key.replace(/^\d+-/, "");

    const media = await prisma.media.create({
      data: {
        key,
        url: "",
        name,
        mimeType: type,
        size: size,
        width: width,
        height: height,
        bucket: process.env.S3_BUCKET!,
        folderId: folderId || null,
      },
    });

    refresh();
    return { success: true, data: media };
  } catch (error) {
    console.error("DB Register error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getMediaList({
  page = 1,
  pageSize = 20,
  folderId = undefined as string | null | undefined,
} = {}) {
  const skip = (page - 1) * pageSize;

  // folderId === undefined means all media (no folder filter)
  // folderId === null means root media (not in any folder)
  // folderId === "some-id" means media in that specific folder
  const where = folderId !== undefined ? { folderId } : {};

  try {
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.media.count({ where }),
    ]);

    const itemsWithSignedUrls = await Promise.all(
      items.map(async (item) => {
        const command = new GetObjectCommand({
          Bucket: item.bucket,
          Key: item.key,
        });
        const signedUrl = await getSignedUrl(s3Signer, command, {
          expiresIn: URL_EXPIRATION_SECONDS,
        });
        return { ...item, url: signedUrl };
      }),
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

  if (!media) {
    console.error(`[Delete Action] Media record not found for ID: ${id}`);
    return { success: false, error: "Media record not found in database" };
  }

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: media.bucket,
        Key: media.key,
      }),
    );

    await prisma.media.delete({ where: { id } });

    return { success: true, id };
  } catch (err) {
    console.error("[Delete Action] CRITICAL FAILURE:", err);

    return {
      success: false,
      error: err instanceof Error ? err.message : "Delete operation failed",
    };
  }
}

export async function renameMedia(id: string, name: string) {
  try {
    const media = await prisma.media.update({
      where: { id },
      data: { name },
    });
    return { success: true, data: media };
  } catch (error) {
    console.error("Rename media error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to rename media",
    };
  }
}

export async function moveMedia(id: string, folderId: string | null) {
  try {
    const media = await prisma.media.update({
      where: { id },
      data: { folderId },
    });
    return { success: true, data: media };
  } catch (error) {
    console.error("Move media error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to move media",
    };
  }
}
