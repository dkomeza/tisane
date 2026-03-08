"use server";

import prisma from "@/lib/prisma";
import { s3Client } from "@/lib/storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

export async function createFolder(name: string, parentId?: string | null) {
  try {
    const folder = await prisma.mediaFolder.create({
      data: {
        name,
        parentId: parentId || null,
      },
    });
    revalidatePath("/admin/media");
    return { success: true, data: folder };
  } catch (error) {
    console.error("Create folder error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create folder",
    };
  }
}

export async function renameFolder(id: string, name: string) {
  try {
    const folder = await prisma.mediaFolder.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/admin/media");
    return { success: true, data: folder };
  } catch (error) {
    console.error("Rename folder error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to rename folder",
    };
  }
}

export async function moveFolder(id: string, newParentId: string | null) {
  // Prevent moving a folder into itself or its descendants
  if (newParentId) {
    let current = newParentId;
    while (current) {
      if (current === id) {
        return {
          success: false,
          error: "Cannot move a folder into itself or its descendant",
        };
      }
      const parent = await prisma.mediaFolder.findUnique({
        where: { id: current },
        select: { parentId: true },
      });
      if (!parent) break;
      current = parent.parentId || "";
    }
  }

  try {
    const folder = await prisma.mediaFolder.update({
      where: { id },
      data: { parentId: newParentId },
    });
    revalidatePath("/admin/media");
    return { success: true, data: folder };
  } catch (error) {
    console.error("Move folder error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to move folder",
    };
  }
}

// Recursively collect all media keys in a folder tree for S3 deletion
async function collectMediaKeys(
  folderId: string,
): Promise<{ id: string; key: string; bucket: string }[]> {
  const media = await prisma.media.findMany({
    where: { folderId },
    select: { id: true, key: true, bucket: true },
  });

  const subfolders = await prisma.mediaFolder.findMany({
    where: { parentId: folderId },
    select: { id: true },
  });

  const nestedMedia = await Promise.all(
    subfolders.map((sf) => collectMediaKeys(sf.id)),
  );

  return [...media, ...nestedMedia.flat()];
}

export async function deleteFolder(id: string) {
  try {
    // Collect all media to delete from S3
    const allMedia = await collectMediaKeys(id);

    // Delete all S3 objects
    await Promise.all(
      allMedia.map((m) =>
        s3Client
          .send(new DeleteObjectCommand({ Bucket: m.bucket, Key: m.key }))
          .catch((err) =>
            console.error(`Failed to delete S3 object ${m.key}:`, err),
          ),
      ),
    );

    // Cascade delete handles subfolders and media (via Prisma onDelete: Cascade for folders)
    // But media has onDelete: SetNull, so we need to explicitly delete media first
    if (allMedia.length > 0) {
      await prisma.media.deleteMany({
        where: { id: { in: allMedia.map((m) => m.id) } },
      });
    }

    await prisma.mediaFolder.delete({ where: { id } });

    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Delete folder error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete folder",
    };
  }
}

export async function getFolderTree() {
  try {
    const folders = await prisma.mediaFolder.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { media: true, children: true } },
      },
    });
    return { success: true, data: folders };
  } catch (error) {
    console.error("Get folder tree error:", error);
    return { success: false, data: [], error: "Failed to fetch folders" };
  }
}

export async function getFolderBreadcrumb(folderId: string) {
  try {
    const breadcrumb: { id: string; name: string }[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder: {
        id: string;
        name: string;
        parentId: string | null;
      } | null = await prisma.mediaFolder.findUnique({
        where: { id: currentId },
        select: { id: true, name: true, parentId: true },
      });
      if (!folder) break;
      breadcrumb.unshift({ id: folder.id, name: folder.name });
      currentId = folder.parentId;
    }

    return { success: true, data: breadcrumb };
  } catch (error) {
    console.error("Get breadcrumb error:", error);
    return { success: false, data: [] };
  }
}

export async function getFolderContentCounts(folderId: string) {
  const [mediaCount, folderCount] = await Promise.all([
    prisma.media.count({ where: { folderId } }),
    prisma.mediaFolder.count({ where: { parentId: folderId } }),
  ]);
  return { mediaCount, folderCount };
}
