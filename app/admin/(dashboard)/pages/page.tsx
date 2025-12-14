import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import PageTable from "./components/PageTable";
import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getPageGroups, getPages } from "@/app/actions/pages/get-pages";
import { GetPagesRequest } from "@/lib/schemas/PagesSchema";

export type PagesTableProps = {
  page?: string;
  lastId?: string;
  perPage?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type PagesProps = {
  searchParams: Promise<PagesTableProps>;
};

async function PagesLoader(props: PagesTableProps) {
  const request: GetPagesRequest = {
    offset: props.page
      ? (parseInt(props.page) - 1) *
        (props.perPage ? parseInt(props.perPage) : 20)
      : 0,
    limit: props.perPage ? parseInt(props.perPage) : 20,
    lastId: props.lastId,
    sortBy: props.sortBy as "createdAt" | "updatedAt" | "title" | undefined,
    sortOrder: props.sortOrder,
  };

  const res = await getPageGroups(request);

  if (!res.success) {
    return <PageTable type="error" error={res.error || ""} />;
  }

  return <PageTable type="data" data={res.data} tableProps={props} />;
}

async function Pages({ searchParams }: PagesProps) {
  const params = await searchParams;
  const { session } = await authorize();

  if (!hasPermission(session, "content.read")) {
    redirect("/admin");
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold mb-2">Pages</h1>
          <p className="text-lg font-light text-secondary-foreground/70">
            Welcome to the pages management page. Here you can manage pages and
            their content.
          </p>
        </div>
        <Link href="/admin/pages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </Link>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <Suspense
          key={JSON.stringify(params)}
          fallback={<PageTable type="loading" />}
        >
          <PagesLoader {...params} />
        </Suspense>
      </div>
    </div>
  );
}

export default Pages;
