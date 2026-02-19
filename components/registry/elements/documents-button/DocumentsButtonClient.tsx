"use client";

import { useEffect, useState } from "react";
import { BlockProps } from "@/components/registry";
import { DocumentsButtonProps } from "./index";
import { getMedia } from "@/app/actions/media/view-action";
import { Media } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { iconMap, IconName } from "@/components/registry/items/icon";

/**
 * This is the client-side component that will be rendered in the application.
 */
export function DocumentsButtonClient({ data }: BlockProps<DocumentsButtonProps>) {
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

    const colorStyles = {
        primary:
            "bg-brand-purple-300 text-brand-grey-100 hover:bg-brand-purple-400 focus:bg-brand-purple-300 pressed:bg-brand-purple-400 disabled:bg-brand-gray-400 disabled:text-brand-gray-200",
        dark: "bg-brand-pink-400 text-brand-grey-100 hover:bg-brand-pink-500 focus:bg-brand-pink-400 pressed:bg-brand-pink-500 disabled:bg-brand-gray-200 disabled:text-brand-gray-400",
        white:
            "bg-transparent text-brand-grey-100 border border-b border-brand-gray-100 hover:border-b-2 focus:border-2 pressed:border-none pressed:bg-brand-gray-100 pressed:text-brand-grey-100 disabled:text-brand-gray-300 disabled:border-none",
        violet:
            "bg-transparent text-brand-purple-200 border border-brand-purple-200 hover:text-brand-purple-400 hover:border-brand-purple-400 focus:border-2 focus:border-brand-purple-400 focus:text-brand-purple-200 pressed:bg-brand-purple-400 pressed:border-none pressed:text-brand-grey-100 disabled:text-brand-gray-400 disabled:border-brand-gray-400",
        pink: "text-brand-pink-300 border border-brand-pink-300 hover:text-brand-pink-500 hover:border-brand-pink-500 focus:border-2 focus:border-brand-pink-500 focus:text-brand-pink-300 pressed:bg-brand-pink-400 pressed:border-none pressed:text-brand-grey-100 disabled:text-brand-gray-300 disabled:border-brand-gray-300",
    };

    const sizeStyles = {
        small: "px-4 py-2 text-sm",
        large: "px-6 py-3 text-lg",
    };

    const IconLeft = data.iconLeft ? iconMap[data.iconLeft as IconName] : null;
    const IconRight = data.iconRight ? iconMap[data.iconRight as IconName] : null;

    const handleDownload = () => {
        if (media?.url) {
            window.open(media.url, "_blank");
        }
    };

    return (
        <button
            type="button"
            disabled={data.isDisabled || !media?.url}
            onClick={handleDownload}
            className={cn(
                "flex items-center justify-center gap-3 font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
                colorStyles[data.color],
                sizeStyles[data.variant]
            )}
        >
            {IconLeft && <IconLeft className="size-5" />}
            <span className="flex-1 text-center">{data.content}</span>
            {IconRight && <IconRight className="size-5" />}
        </button>
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
