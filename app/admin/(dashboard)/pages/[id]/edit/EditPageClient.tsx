"use client";

import { PageForm } from "@/app/admin/(dashboard)/pages/components/PageForm";
import { updatePage } from "@/app/actions/pages/update-page";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UpdatePageRequest } from "@/lib/schemas/PagesSchema";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function EditPageClient({
  id,
  initialData,
}: {
  id: string;
  initialData: UpdatePageRequest;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <Link href="/admin/pages">Pages</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>
            {initialData.title ? initialData.title : "New Page"}
          </BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6 mt-4">
        <h1 className="text-3xl font-bold">
          {initialData.title ? initialData.title : "Edit Page"}
        </h1>
        <p className="font-light text-muted-foreground">
          Update the details of your page below. Remember to save your changes
        </p>
      </div>

      <PageForm
        defaultValues={initialData}
        isSubmitting={isSubmitting}
        onSubmit={async (data) => {
          setIsSubmitting(true);
          const result = await updatePage({ pageId: id, ...data });
          setIsSubmitting(false);

          if (!result.success) {
            toast.error(result.error);
          } else {
            toast.success("Page updated");
            router.push("/admin/pages");
          }
        }}
      />
    </>
  );
}
