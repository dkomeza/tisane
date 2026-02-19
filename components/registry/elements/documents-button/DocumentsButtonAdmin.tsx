import { AdminBlockProps, Block } from "@/components/registry";
import { DocumentsButtonProps } from "./index";

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
export function DocumentsButtonAdmin({
    id,
    useStore,
}: AdminBlockProps<DocumentsButtonProps>) {
    const { getBlock, updateBlock } = useStore();
    const block = getBlock(id) as Block<"documents-button">;

    if (!block) return null;

    return (
        <textarea
            className="w-full min-h-[100px] p-2 border rounded"
            value={block.data.example}
            onChange={(e) => updateBlock(id, { example: e.target.value })}
        ></textarea>
    );
}
