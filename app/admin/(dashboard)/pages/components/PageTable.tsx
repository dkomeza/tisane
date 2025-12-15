"use client";

import React, { useMemo, useState } from "react";
import { PagesTableProps } from "../page";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GetPageGroupsResponse,
  PageGroup as PageGroupT,
} from "@/app/actions/pages/get-pages";
import { ResultData } from "@/lib/types/Result";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../../users/components/Checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import DeletePageDialog from "./DeletePageDialog";
import { Item } from "@/components/ui/item";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PageDataTableProps = {
  type: "data";
  data: ResultData<GetPageGroupsResponse>;
  tableProps: PagesTableProps;
};

type PageTableErrorProps = {
  type: "error";
  error: string;
};

type PageTableLoadingProps = {
  type: "loading";
};

type PageTableProps =
  | PageDataTableProps
  | PageTableErrorProps
  | PageTableLoadingProps;

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
    router.replace(`/admin/pages?${params.toString()}`);
  }

  function getPaginationHref(page: number) {
    if (page < 1) return undefined;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/admin/pages?${params.toString()}`;
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

type PageGroupProps = {
  group: PageGroupT;
  slugPrefix?: string;
  indentLevel?: number;
};
function PageGroup({
  group,
  slugPrefix = "",
  indentLevel = 0,
}: PageGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <tr key={group.page.id} className="border-t [&>td]:px-4 [&>td]:py-4">
        <td>
          <input
            type="checkbox"
            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
          />
        </td>
        <td
          className="flex items-center"
          style={{
            paddingLeft: `${indentLevel * 2 + 1}rem`,
          }}
        >
          {group.pages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "mr-2 p-0 w-8 h-8 [&>svg]:transition-transform",
                isExpanded ? "[&>svg]:rotate-90" : "[&>svg]:rotate-0"
              )}
            >
              <ChevronRight />
            </Button>
          )}
          {group.page.title}
        </td>
        <td className="whitespace-nowrap overflow-hidden text-ellipsis w-72">{`${slugPrefix}/${group.page.slug}`}</td>
        <td>{new Date(group.page.updatedAt).toLocaleDateString()}</td>
        <td>
          <div
            className={cn(
              "text-xs py-1 px-3 border rounded-full w-fit font-semibold",
              group.page.status === "published"
                ? "bg-green-300 dark:bg-green-300/90 text-green-900"
                : group.page.status === "draft"
                  ? "bg-yellow-300 dark:bg-yellow-300/90 text-yellow-900"
                  : "bg-blue-300 dark:bg-blue-300/90 text-blue-900"
            )}
          >
            {group.page.status}
          </div>
        </td>
        <td>
          <div
            className={cn(
              "text-xs py-1 px-3 border rounded-full w-fit font-semibold",
              group.page.visibility === "public"
                ? ""
                : group.page.visibility === "private"
                  ? "bg-black text-white"
                  : "bg-gray-300 dark:bg-gray-300/90 text-black"
            )}
          >
            {group.page.visibility !== "password_protected"
              ? group.page.visibility
              : "protected"}
          </div>
        </td>
        <td className="px-0 py-0 flex justify-end items-center pr-2">
          <Link
            href={
              slugPrefix
                ? `/${slugPrefix}/${group.page.slug}`
                : `/${group.page.slug}`
            }
            target="_blank"
          >
            <Button variant="ghost" size="icon">
              <Eye />
            </Button>
          </Link>
          <Link href={`/admin/pages/${group.page.id}`}>
            <Button variant="ghost" size="icon">
              <SquarePen />
            </Button>
          </Link>
          <DeletePageDialog page={group.page} />
        </td>
      </tr>
      {isExpanded &&
        group.pages.map((childPageGroup) => (
          <PageGroup
            key={childPageGroup.page.id}
            group={childPageGroup}
            slugPrefix={`${slugPrefix}/${group.page.slug}`}
            indentLevel={indentLevel + 1}
          />
        ))}
    </>
  );
}

function PageTable(props: PageTableProps) {
  const searchParams = useSearchParams();
  const loading = props.type === "loading";

  const footerData = useMemo(() => {
    if (props.type === "data") {
      return {
        page: parseInt(props.tableProps.page || "1"),
        perPage: parseInt(props.tableProps.perPage || "20"),
        total: props.data.count,
      };
    }
    return { page: 1, perPage: 10, total: 0 };
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
                <input
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              <th className="">Title</th>
              <th className="w-72">Slug</th>
              <th className="w-36">Last Modified</th>
              <th className="w-24">Status</th>
              <th className="w-24">Visibility</th>
              <th className="w-0"></th>
            </tr>
          </thead>
          <tbody>
            {props.type === "data"
              ? props.data.pages.map((pageGroup) => (
                  <PageGroup key={pageGroup.page.id} group={pageGroup} />
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

export default PageTable;
