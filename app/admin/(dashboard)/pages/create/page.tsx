"use client";

import { PageForm } from "@/app/components/PageForm";
import { createPage } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Create Page</h1>
      <PageForm
        isSubmitting={isSubmitting}
        onSubmit={async (data) => {
          setIsSubmitting(true);
          const result = await createPage(data);
          setIsSubmitting(false);

          if (result.error) {
            toast.error(result.error);
          } else {
            toast.success("Page created");
            router.push("/admin/pages");
          }
        }}
      />
    </>
  );
}
