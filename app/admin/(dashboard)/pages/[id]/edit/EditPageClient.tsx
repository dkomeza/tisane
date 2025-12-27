"use client";

import { PageForm } from "@/app/components/PageForm";
import { updatePage } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageFormValues } from "@/lib/schemas/EditCreateSchema";

export default function EditPageClient({ id, initialData }: { id: string, initialData: PageFormValues }) {
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
                    const result = await updatePage(id, data);
                    setIsSubmitting(false);

                    if (result.error) {
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
