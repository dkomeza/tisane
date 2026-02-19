"use client";

import { useEffect, useState } from "react";
import { BlockProps } from "@/components/registry";
import { DocumentsButtonProps } from "./index";
import { getMedia } from "@/app/actions/media/view-action";
import { Media } from "@/lib/prisma";
import { ButtonClient } from "../button/ButtonClient";

/**
 * This is the client-side component that will be rendered in the application.
 */
export function DocumentsButtonClient(props: BlockProps<DocumentsButtonProps>) {
    const { data } = props;
    const [media, setMedia] = useState<Media | null>();

    useEffect(() => {
        if (!data.mediaId) {
            setMedia(null);
            return;
        }

        let isMounted = true;
        getMedia(data.mediaId).then((m) => {
            if (isMounted) setMedia(m);
        });

        return () => {
            isMounted = false;
        };
    }, [data.mediaId]);

    const handleDownload = () => {
        if (media?.url) {
            window.open(media.url, "_blank");
        }
    };

    return (
        <ButtonClient
            {...props}
            onClick={handleDownload}
            className={!media?.url ? "opacity-50 pointer-events-none" : ""}
        />
    );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
export function DocumentsButtonPreview() {
    return (
        <div className="p-3 text-center text-sm text-gray-600 border rounded-md dashed">
            Documents Button
        </div>
    );
}
