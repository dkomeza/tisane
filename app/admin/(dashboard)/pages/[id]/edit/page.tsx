import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPageClient from "./EditPageClient";
import { getPage } from "@/app/actions/pages/get-page";

export default async function EditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const {page} = await getPage({
    pageId: params.id,
  });

  if (!page) {
    notFound();
  }

  return (
    <EditPageClient
      id={page.id}
      initialData={{
        pageId: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        seo_title: page.seo_title || undefined,
        seo_description: page.seo_description || undefined,
        content: page.content,
      }}
    />
  );
}
