import { AdminBlockProps, Block } from "@/components/registry";
import { DocumentsButtonProps } from "./index";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { MediaSelector } from "@/components/registry/items/image/MediaSelector";
import { ButtonAdmin } from "../button/ButtonAdmin";

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
export function DocumentsButtonAdmin({
    id,
    useStore,
}: AdminBlockProps<DocumentsButtonProps>) {
    const { getBlock, updateBlock, removeBlock } = useStore();
    const block = getBlock(id) as Block<"documents-button"> | null;

    if (!block) return null;

    return (
        <div className="flex flex-col gap-5">
            <div className="p-4 rounded-xl border border-gray-100 space-y-4">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                    <FileText className="w-3 h-3" />
                    Document
                </label>
                <MediaSelector
                    onSelect={(media) => updateBlock(id, { mediaId: media.id })}
                    trigger={
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent text-white border-gray-300"
                        >
                            {block.data.mediaId ? "Change Document" : "Select Document"}
                        </Button>
                    }
                />
                {block.data.mediaId && (
                    <p className="text-[10px] text-gray-400 italic">
                        Document ID: {block.data.mediaId}
                    </p>
                )}
            </div>

            <ButtonAdmin
                id={id}
                data={block.data}
                updateBlock={updateBlock}
                removeBlock={removeBlock}
            />
        </div>
    );
}
