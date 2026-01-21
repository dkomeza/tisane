import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import MenuTable, { MenusTableProps } from "./components/MenuTable";
import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getMenus } from "@/app/actions/menus/get-menus";
import { GetMenusRequest } from "@/lib/schemas/MenusSchema";

type MenusProps = {
  searchParams: Promise<MenusTableProps>;
};

async function MenusLoader(props: MenusTableProps) {
  const request: GetMenusRequest = {
    offset: props.page
      ? (parseInt(props.page) - 1) *
        (props.perPage ? parseInt(props.perPage) : 20)
      : 0,
    limit: props.perPage ? parseInt(props.perPage) : 20,
    sortBy: props.sortBy as "createdAt" | "updatedAt" | "title" | undefined,
    sortOrder: props.sortOrder,
  };

  const res = await getMenus(request);

  if (!res.success) {
    return <MenuTable type="error" error={res.error || ""} />;
  }

  return <MenuTable type="data" data={res.data} tableProps={props} />;
}

async function Menus({ searchParams }: MenusProps) {
  const params = await searchParams;
  const { session } = await authorize();

  if (!hasPermission(session, "content.read")) {
    redirect("/admin");
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold mb-2">Menus</h1>
          <p className="text-lg font-light text-secondary-foreground/70">
            Manage your site navigation menus here.
          </p>
        </div>
        <Link href="/admin/menus/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Menu
          </Button>
        </Link>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <Suspense
          key={JSON.stringify(params)}
          fallback={<MenuTable type="loading" />}
        >
          <MenusLoader {...params} />
        </Suspense>
      </div>
    </div>
  );
}

export default Menus;
