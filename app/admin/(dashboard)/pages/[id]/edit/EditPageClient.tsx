"use client";

import { PageForm } from "@/app/admin/(dashboard)/pages/components/PageForm";
import { updatePage } from "@/app/actions/pages/update-page";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UpdatePageRequest } from "@/lib/schemas/PagesSchema";

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
      <h1 className="text-2xl font-bold mb-6">Edit Page</h1>
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
