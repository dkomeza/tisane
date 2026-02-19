import { BlockProps } from "@/components/registry";
import { DocumentsButtonProps } from "./index";

/**
 * This is the client-side component that will be rendered in the application.
 */
export function DocumentsButtonClient({ data }: BlockProps<DocumentsButtonProps>) {
    return <div>{data.example}</div>;
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
export function DocumentsButtonPreview() {
    return <div>DocumentsButton Preview</div>;
}
