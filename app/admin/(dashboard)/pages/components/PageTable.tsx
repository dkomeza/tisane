"use client";

import React, { useMemo } from "react";
import { pages } from "@/src/db/schema/pages";
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

type PageTableData = Omit<typeof pages.$inferSelect, "content">;

type PageDataTableProps = {
  type: "data";
  data: PageTableData[];
  total: number;
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

function PageTable(props: PageTableProps) {
  const loading = props.type === "loading";

  const footerData = useMemo(() => {
    if (props.type === "data") {
      return {
        page: parseInt(props.tableProps.page || "1"),
        perPage: parseInt(props.tableProps.perPage || "20"),
        total: props.total,
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
          <thead className="">
            <tr className="">
              <th className="px-4 py-3 sticky top-0 bg-secondary">Title</th>
              <th className="px-4 py-3 sticky top-0 bg-secondary">Slug</th>
              <th className="px-4 py-3 sticky top-0 bg-secondary">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {props.type === "data"
              ? props.data.map((page) => (
                  <tr key={page.id} className="border-t">
                    <td className="px-4 py-4">{page.title}</td>
                    <td className="px-4 py-4">{page.slug}</td>
                    <td className="px-4 py-4">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              : Array.from({ length: 20 }).map((_, index) => (
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
