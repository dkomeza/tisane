import { notFound } from "next/navigation";
import EditPageClient from "./EditPageClient";
import { getPage } from "@/app/actions/pages/get-page";

export default async function EditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const response = await getPage({
    pageId: params.id,
  });

  if (!response.success) {
    console.error("Failed to fetch page:", response.error);
    notFound();
  }

  const { page } = response.data;

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
