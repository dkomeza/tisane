"use client";

import { PageForm } from "@/app/admin/(dashboard)/pages/components/PageForm";
import { createPage } from "@/app/actions/pages/create-page";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CreatePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Create Page</h1>

      <PageForm
        isSubmitting={isPending}
        onSubmit={(data) => {
          startTransition(async () => {
            const result = await createPage(data);

            if (!result) {
              toast.error("Server did not return a response");
              return;
            }

            if (!result.success) {
              toast.error(result.error);
              return;
            }

            toast.success("Page created");
            router.push("/admin/pages");
          });
        }}
      />
    </>
  );
}
