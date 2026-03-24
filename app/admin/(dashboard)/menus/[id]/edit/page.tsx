"use client";

import { useTransition, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MenuForm } from "../../components/MenuForm";
import { CreateMenuRequest } from "@/lib/schemas/MenusSchema";
import { updateMenu } from "@/app/actions/menus/update-menu";
import { getMenu } from "@/app/actions/menus/get-menu";
import { Menu } from "@/lib/schemas/MenusSchema";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMenu({ menuId: id }).then((res) => {
      if (res.success) {
        setMenu(res.data.menu);
      } else {
        toast.error(res.error || "Failed to fetch menu");
        router.push("/admin/menus");
      }
      setIsLoading(false);
    });
  }, [id, router]);

  function onSubmit(data: CreateMenuRequest) {
    startTransition(async () => {
      const res = await updateMenu({
        menuId: id,
        ...data,
      });

      if (res.success) {
        toast.success("Menu updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update menu");
      }
    });
  }

  if (isLoading) {
    return (
      <div className="h-full w-full overflow-hidden flex flex-col gap-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="flex-1 w-full rounded-xl" />
      </div>
    );
  }

  if (!menu) return null;

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Edit Menu</h1>
        <p className="text-lg font-light text-secondary-foreground/70">
          Edit {menu.title}
        </p>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <MenuForm
          defaultValues={{
            title: menu.title,
            slug: menu.slug,
            content: menu.content,
          }}
          onSubmit={onSubmit}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
}
