"use server";

import prisma from "@/lib/prisma";
import { pageSchema, PageFormValues } from "@/lib/schemas/EditCreateSchema";
import { revalidatePath } from "next/cache";

export type ActionState = {
    success?: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export async function createPage(data: PageFormValues): Promise<ActionState> {
    const parsed = pageSchema.safeParse(data);

    if (!parsed.success) {
        return {
            error: "Invalid data",
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.page.create({
            data: {
                title: parsed.data.title,
                slug: parsed.data.slug,
                status: parsed.data.status,
                seo_title: parsed.data.seoTitle,
                seo_description: parsed.data.seoDescription,
                content: parsed.data.content || "{}",
            },
        });

        revalidatePath("/admin/pages");
        return { success: true };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { error: "Slug already exists" };
        }
        return { error: "Failed to create page" };
    }
}

export async function updatePage(
    id: string,
    data: PageFormValues
): Promise<ActionState> {
    const parsed = pageSchema.safeParse(data);

    if (!parsed.success) {
        return {
            error: "Invalid data",
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.page.update({
            where: { id },
            data: {
                title: parsed.data.title,
                slug: parsed.data.slug,
                status: parsed.data.status,
                seo_title: parsed.data.seoTitle,
                seo_description: parsed.data.seoDescription,
                content: parsed.data.content || "{}",
            },
        });

        revalidatePath("/admin/pages");
        revalidatePath(`/admin/pages/${id}`);
        revalidatePath(`/admin/pages/${id}/edit`);

        return { success: true };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { error: "Slug already exists" };
        }
        return { error: "Failed to update page" };
    }
}
