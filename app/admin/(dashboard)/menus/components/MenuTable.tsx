"use client";

import React, { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { GetMenusResponse, Menu } from "@/lib/schemas/MenusSchema";
import { ResultData } from "@/lib/types/Result";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DeleteMenuDialog from "./DeleteMenuDialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";

export type MenusTableProps = {
  page?: string;
  perPage?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type MenuDataTableProps = {
  type: "data";
  data: ResultData<GetMenusResponse>;
  tableProps: MenusTableProps;
};

type MenuTableErrorProps = {
  type: "error";
  error: string;
};

type MenuTableLoadingProps = {
  type: "loading";
};

type MenuTableProps =
  | MenuDataTableProps
  | MenuTableErrorProps
  | MenuTableLoadingProps;

type TableFooterProps = {
  loading?: boolean;
  page: number;
  perPage: number;
  total: number;
};

function SkeletonText({
  loading,
  placeholder = "██",
  children,
}: {
  loading?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <Skeleton className="text-transparent inline-block">
        {placeholder}
      </Skeleton>
    );
  }
  return <>{children}</>;
}

function TableFooter(props: TableFooterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pages = Math.ceil(props.total / props.perPage);

  function handleLimitChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("perPage", value);
    params.set("page", "1"); // Reset to first page when changing limit
    router.replace(`/admin/menus?${params.toString()}`);
  }

  function getPaginationHref(page: number) {
    if (page < 1) return undefined;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/admin/menus?${params.toString()}`;
  }

  return (
    <div className="flex justify-between">
      <div className="text-sm text-secondary-foreground/70 mt-2">
        Showing{" "}
        <SkeletonText loading={props.loading} placeholder="1-9">
          {Math.min((props.page - 1) * props.perPage + 1, props.total)}-
          {Math.min(props.page * props.perPage, props.total)}
        </SkeletonText>{" "}
        of{" "}
        <SkeletonText loading={props.loading} placeholder="99">
          {props.total}
        </SkeletonText>{" "}
        items
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={getPaginationHref(props.page - 1) || "#"}
                {...(props.page <= 1 && {
                  "aria-disabled": true,
                  tabIndex: -1,
                })}
                className={cn(
                  props.page <= 1 && "pointer-events-none opacity-50"
                )}
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>
            {props.loading ? (
              <>
                {[...Array(3)].map((_, index) => (
                  <PaginationItem key={index}>
                    <Skeleton className="text-transparent">
                      <PaginationEllipsis />
                    </Skeleton>
                  </PaginationItem>
                ))}
              </>
            ) : (
              <>
                {[1, 2, 3].map(
                  (page) =>
                    page <= pages && (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={getPaginationHref(page) || "#"}
                          aria-current={
                            props.page === page ? "page" : undefined
                          }
                          className={cn(
                            props.page === page
                              ? "bg-primary text-primary-foreground"
                              : "",
                            "hover:bg-primary/10"
                          )}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                )}
                {pages > 6 && <PaginationEllipsis />}
                {[pages - 2, pages - 1, pages].map(
                  (page) =>
                    page > 3 && (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={getPaginationHref(page) || "#"}
                          aria-current={
                            props.page === page ? "page" : undefined
                          }
                          className={cn(
                            props.page === page
                              ? "bg-primary text-primary-foreground"
                              : "",
                            "hover:bg-primary/10"
                          )}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                )}
              </>
            )}
            <PaginationItem>
              <PaginationNext
                href={getPaginationHref(props.page + 1) || "#"}
                {...(props.page * props.perPage >= props.total && {
                  "aria-disabled": true,
                  tabIndex: -1,
                })}
                className={cn(
                  props.page * props.perPage >= props.total &&
                    "pointer-events-none opacity-50"
                )}
              >
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="flex gap-2 items-center">
        <p>Rows per page:</p>

        <Select
          defaultValue={searchParams.get("perPage") || "20"}
          onValueChange={handleLimitChange}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function MenuGroup({ menu }: { menu: Menu }) {
  return (
    <>
      <tr key={menu.id} className="border-t [&>td]:px-4 [&>td]:py-4">
        <td>
          <Checkbox disabled />
        </td>
        <td className="flex items-center font-medium">{menu.title}</td>
        <td className="whitespace-nowrap overflow-hidden text-ellipsis w-72 text-muted-foreground">
          {menu.slug}
        </td>
        <td className="text-muted-foreground">
          {new Date(menu.updated_at).toLocaleDateString()}
        </td>
        <td className="px-0 py-0 flex justify-end items-center pr-2 gap-2">
          <Link href={`/admin/menus/${menu.id}/edit`}>
            <Button variant="ghost" size="icon">
              <SquarePen className="w-4 h-4" />
            </Button>
          </Link>
          <DeleteMenuDialog menu={menu} />
        </td>
      </tr>
    </>
  );
}

function MenuTable(props: MenuTableProps) {
  const searchParams = useSearchParams();
  const loading = props.type === "loading";

  const footerData = useMemo(() => {
    if (props.type === "data") {
      return {
        page: parseInt(props.tableProps.page || "1"),
        perPage: parseInt(props.tableProps.perPage || "20"),
        total: props.data.total,
      };
    }
    return { page: 1, perPage: 20, total: 0 };
  }, [props]);

  if (props.type === "error") {
    return (
      <div className="flex flex-col flex-1">
        <p className="text-red-500">Error: {props.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-4 overflow-hidden">
      <div className="flex-1 border rounded-lg overflow-scroll">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="[&>th]:text-left [&>th]:border-b [&>th]:border-b-border [&>th]:font-medium [&>th]:px-4 [&>th]:py-3 sticky top-0 bg-secondary">
              <th className="w-4">
                <Checkbox disabled />
              </th>
              <th className="">Title</th>
              <th className="w-72">Slug</th>
              <th className="w-36">Last Modified</th>
              <th className="w-24 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.type === "data"
              ? props.data.menus.map((menu) => (
                  <MenuGroup key={menu.id} menu={menu} />
                ))
              : Array.from({
                  length: parseInt(searchParams.get("perPage") || "20"),
                }).map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-4">
                      <Skeleton className="text-transparent inline">
                        ██████████████
                      </Skeleton>
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="text-transparent inline">
                        █████████
                      </Skeleton>
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="text-transparent inline">
                        ████-██-██
                      </Skeleton>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <TableFooter
        loading={loading}
        page={footerData.page}
        perPage={footerData.perPage}
        total={footerData.total}
      />
    </div>
  );
}

export default MenuTable;
