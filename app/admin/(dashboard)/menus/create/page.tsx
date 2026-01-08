"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MenuForm } from "../components/MenuForm";
import { CreateMenuRequest } from "@/lib/schemas/MenusSchema";
import { createMenu } from "@/app/actions/menus/create-menu";

export default function CreateMenuPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: CreateMenuRequest) {
    startTransition(async () => {
      const res = await createMenu(data);

      if (res.success) {
        toast.success("Menu created successfully");
        router.push("/admin/menus");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create menu");
      }
    });
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Create Menu</h1>
        <p className="text-lg font-light text-secondary-foreground/70">
          Create a new navigation menu.
        </p>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <MenuForm onSubmit={onSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
}
