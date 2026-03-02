/**
 * Component: Underlined Table
 */

import {
  BlockProps,
  CMSComponent,
  DBComponent,
  DBComponentSchema,
  COMPONENT_REGISTRY,
  Block,
} from "@/components/registry";
import z from "zod";
import { UnderlinedTableAdmin } from "./UnderlinedTableAdmin";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/registry/typography/heading";
import { LayoutTemplate } from "lucide-react";

export type UnderlinedTableProps = {
  columns?: DBComponent<"underlined-table-column">[];
};

export const UnderlinedTable: CMSComponent<
  "underlined-table",
  UnderlinedTableProps
> = {
  id: "underlined-table" as const,
  label: "Underlined Table",

  ClientComponent: UnderlinedTableClient,
  AdminComponent: UnderlinedTableAdmin,
  PreviewComponent: UnderlinedTablePreview,

  Schema: z.object({
    columns: z
      .array(z.lazy(() => DBComponentSchema))
      .max(3)
      .default([]) as z.ZodType<
      DBComponent<"underlined-table-column">[] | undefined
    >,
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function UnderlinedTableClient({ data }: BlockProps<UnderlinedTableProps>) {
  const columns = data.columns || [];

  return (
    <div className="w-full flex flex-col md:table md:table-fixed">
      <div className="hidden md:table-header-group">
        <div className="md:table-row">
          {columns.map((col, idx) => {
            const widthClass =
              col.data.width === "1/2"
                ? "w-1/2"
                : col.data.width === "1/3"
                  ? "w-1/3"
                  : "w-2/3";
            const hasContent = !!col.data.header || !!col.data.content;
            const borderClass = hasContent
              ? "border-b border-brand-purple-400"
              : "";

            return (
              <div
                key={(col as Block).id || idx}
                className={cn(
                  "md:table-cell pr-8 pb-2 text-left align-bottom font-normal text-nowrap overflow-hidden text-ellipsis",
                  widthClass,
                  borderClass,
                )}
              >
                {col.data.header && (
                  <Heading.ClientComponent
                    id={(col.data.header as Block).id}
                    data={col.data.header.data}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col md:table-row-group gap-8 md:gap-0">
        <div className="flex flex-col md:table-row gap-8 md:gap-0">
          {columns.map((col, idx) => {
            const ContentComp = col.data.content
              ? COMPONENT_REGISTRY[
                  col.data.content.type as keyof typeof COMPONENT_REGISTRY
                ]
              : null;
            const hasContent = !!col.data.header || !!col.data.content;
            const borderClassMobile = hasContent
              ? "border-b border-brand-purple-400"
              : "";

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ClientComp = ContentComp?.ClientComponent as any;

            return (
              <div
                key={(col as Block).id || idx}
                className="flex flex-col md:table-cell pt-0 md:pt-8 align-top md:pr-8 overflow-hidden"
              >
                {/* Mobile Header (rendered inline on mobile) */}
                <div
                  className={cn(
                    "md:hidden pb-2 mb-6 block",
                    borderClassMobile,
                    { hidden: !hasContent },
                  )}
                >
                  {col.data.header && (
                    <Heading.ClientComponent
                      id={(col.data.header as Block).id}
                      data={col.data.header.data}
                    />
                  )}
                </div>
                {/* Content */}
                <div className="flex flex-col gap-6 md:gap-8">
                  {ClientComp && (
                    <ClientComp
                      id={(col.data.content as Block).id}
                      data={col.data.content!.data}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {/* Filler column to absorb remaining width */}
          <div className="hidden md:table-cell" />
        </div>
      </div>
    </div>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function UnderlinedTablePreview() {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-brand-purple-300 bg-black/50 text-white rounded gap-2">
      <LayoutTemplate className="w-8 h-8 opacity-50" />
      <span className="text-xs font-medium">Underlined Table</span>
    </div>
  );
}
