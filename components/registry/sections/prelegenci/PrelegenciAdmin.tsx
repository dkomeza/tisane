import { AdminBlockProps, Block, createBlock } from "@/components/registry";
import { PrelegenciProps } from ".";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { PrelegenciSpeakerComponent, PrelegenciSpeakerProps } from "./speaker";
import { Typography } from "@/components/registry/typography/typography";

export function PrelegenciAdmin({
  id,
  useStore,
}: AdminBlockProps<PrelegenciProps>) {
  const { getBlock, addBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"prelegenci">;

  if (!block) return null;

  const speakers = block.data.speakers || [];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Typography Header */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
          Header
        </div>
        {block.data.header ? (
          <div className="relative group/header border border-border/40 rounded-lg bg-background p-2">
            <Typography.AdminComponent
              id={(block.data.header as Block).id}
              data={block.data.header.data}
              useStore={useStore}
            />
            <button
              type="button"
              onClick={() => {
                removeBlock((block.data.header as Block).id);
              }}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover/header:opacity-100 transition-opacity z-10"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed"
            type="button"
            onClick={() => {
              const newBlock = createBlock("typography");
              addBlock(newBlock, id, "header");
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Header
          </Button>
        )}
      </div>

      {/* Speakers */}
      <div className="flex flex-col gap-4">
        {speakers.map((col) => {
          const AdminComp =
            PrelegenciSpeakerComponent.AdminComponent as React.FC<
              AdminBlockProps<PrelegenciSpeakerProps>
            >;
          return (
            <AdminComp
              key={(col as Block).id}
              id={(col as Block).id}
              data={col.data}
              useStore={useStore}
            />
          );
        })}
      </div>

      <Button
        variant="outline"
        className="w-full border-dashed"
        type="button"
        onClick={() => {
          addBlock(
            {
              id: nanoid(),
              type: "prelegenci-speaker",
              data: PrelegenciSpeakerComponent.Schema.parse({}),
            },
            id,
            "speakers",
          );
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Speaker ({speakers.length})
      </Button>
    </div>
  );
}
