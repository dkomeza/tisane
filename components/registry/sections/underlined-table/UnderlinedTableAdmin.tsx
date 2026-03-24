import { AdminBlockProps, Block } from "@/components/registry";
import { UnderlinedTableProps } from ".";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { UnderlinedTableColumn } from "./column";

export function UnderlinedTableAdmin({
  id,
  useStore,
}: AdminBlockProps<UnderlinedTableProps>) {
  const { getBlock, addBlock } = useStore();
  const block = getBlock(id) as Block<"underlined-table">;

  if (!block) return null;

  const columns = block.data.columns || [];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {columns.map((col) => {
          const AdminComp = UnderlinedTableColumn.AdminComponent as React.FC<
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            AdminBlockProps<any>
          >;
          return (
            <AdminComp
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              key={(col as any).id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              id={(col as any).id}
              data={col.data}
              useStore={useStore}
            />
          );
        })}
      </div>

      {columns.length < 3 && (
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={() => {
            addBlock(
              {
                id: nanoid(),
                type: "underlined-table-column",
                data: UnderlinedTableColumn.Schema.parse({}),
              },
              id,
              "columns",
            );
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Column ({columns.length}/3)
        </Button>
      )}
    </div>
  );
}
