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

  function handleLimitChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("perPage", value);
    params.set("page", "1"); // Reset to first page when changing limit
    router.replace(`/admin/pages?${params.toString()}`);
  }

  return (
    <div className="flex justify-between">
      <div className="text-sm text-secondary-foreground/70 mt-2">
        Showing{" "}
        <SkeletonText loading={props.loading} placeholder="1-9">
          {Math.min(props.perPage, props.total)}
        </SkeletonText>{" "}
        of{" "}
        <SkeletonText loading={props.loading} placeholder="99">
          {props.total}
        </SkeletonText>{" "}
        items
      </div>
      <div></div>
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
      <tr key={group.page.id} className="border-t">
        <td className="px-4 py-4">
          <input
            type="checkbox"
            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
          />
        </td>
        <td
          className="px-4 py-4 flex items-center"
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
        <td className="px-4 py-4">{`${slugPrefix}/${group.page.slug}`}</td>
        <td className="px-4 py-4">
          {new Date(group.page.createdAt).toLocaleDateString()}
        </td>
        <td className="flex justify-end items-center pr-2">
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
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 sticky top-0 bg-secondary w-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 sticky top-0 bg-secondary">Title</th>
              <th className="px-4 py-3 sticky top-0 bg-secondary w-64">Slug</th>
              <th className="px-4 py-3 sticky top-0 bg-secondary w-32 text-left">
                Created At
              </th>
              <th className="sticky top-0 bg-secondary w-0"></th>
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
