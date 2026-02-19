import { AdminBlockProps, Block } from "@/components/registry";
import { DocumentsButtonProps } from "./index";
import { ButtonAdmin } from "../button/ButtonAdmin";
import { DocumentAdminItem } from "./DocumentAdminItem";

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

    const handleSelectMedia = (media: any) => {
        updateBlock(id, { mediaId: media.id });
    };

    const handleRemoveMedia = () => {
        updateBlock(id, { mediaId: "" });
    };

    return (
        <div className="flex flex-col gap-5">
            <DocumentAdminItem
                mediaId={block.data.mediaId}
                onSelect={handleSelectMedia}
                onRemove={handleRemoveMedia}
            />

            <ButtonAdmin
                id={id}
                data={block.data}
                updateBlock={updateBlock}
                removeBlock={removeBlock}
            />
        </div>
    );
}
