import { AdminBlockProps, Block } from "@/components/registry";
import { DocumentsButtonProps } from "./index";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Type,
    Palette,
    MousePointer2,
    BoxSelect,
    Trash2,
    Smile,
    FileText,
} from "lucide-react";
import { iconMap, IconName } from "@/components/registry/items/icon";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MediaSelector } from "@/components/registry/items/image/MediaSelector";

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

    const colorOptions: {
        value: DocumentsButtonProps["color"];
        bgClass: string;
        label: string;
    }[] = [
            { value: "primary", bgClass: "bg-brand-purple-200", label: "Primary" },
            { value: "dark", bgClass: "bg-brand-pink-400", label: "Dark" },
            {
                value: "white",
                bgClass: "border-4 border-brand-gray-100",
                label: "White",
            },
            {
                value: "violet",
                bgClass: "border-4 border-brand-purple-200",
                label: "Violet",
            },
            {
                value: "pink",
                bgClass: " border-4 border-brand-pink-400",
                label: "Pink",
            },
        ];

    return (
        <div className="flex flex-col gap-5 p-4 rounded-xl relative">
            <Button
                variant="ghost"
                size="icon"
                className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10 absolute top-2 right-2"
                onClick={() => removeBlock(id)}
                type="button"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </Button>

            <div className="space-y-4 border-b border-gray-100 pb-4">
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

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                    <Type className="w-3 h-3" />
                    Button Text
                </label>
                <textarea
                    rows={2}
                    className="w-full p-3 text-sm text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9061F5]/50 focus:border-[#9061F5] outline-none transition-all resize-none bg-transparent"
                    value={block.data.content}
                    onChange={(e) => updateBlock(id, { content: e.target.value })}
                    placeholder="e.g. Download Catalog"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                        <Smile className="w-3 h-3" />
                        Left Icon
                    </label>
                    <Select
                        value={block.data.iconLeft || "none"}
                        onValueChange={(value) =>
                            updateBlock(id, {
                                iconLeft: value === "none" ? undefined : (value as IconName),
                            })
                        }
                    >
                        <SelectTrigger className="w-full bg-transparent text-white border-gray-300">
                            <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {Object.keys(iconMap).map((iconName) => {
                                const Icon = iconMap[iconName as IconName];
                                return (
                                    <SelectItem key={iconName} value={iconName}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            <span>{iconName}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                        <Smile className="w-3 h-3" />
                        Right Icon
                    </label>
                    <Select
                        value={block.data.iconRight || "none"}
                        onValueChange={(value) =>
                            updateBlock(id, {
                                iconRight: value === "none" ? undefined : (value as IconName),
                            })
                        }
                    >
                        <SelectTrigger className="w-full bg-transparent text-white border-gray-300">
                            <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {Object.keys(iconMap).map((iconName) => {
                                const Icon = iconMap[iconName as IconName];
                                return (
                                    <SelectItem key={iconName} value={iconName}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            <span>{iconName}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                    <Palette className="w-3 h-3" />
                    Color Theme
                </label>
                <div className="flex flex-wrap gap-3">
                    {colorOptions.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            onClick={() => updateBlock(id, { color: option.value })}
                            className={cn(
                                "group relative size-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1",
                                option.bgClass,
                                block.data.color === option.value
                                    ? "ring-2 scale-110"
                                    : "hover:scale-105 hover:opacity-90"
                            )}
                            title={option.label}
                            aria-label={`Select ${option.label} color`}
                        >
                            {block.data.color === option.value && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <div className="size-2.5 bg-white rounded-full" />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                        <BoxSelect className="w-3 h-3" />
                        Size
                    </label>
                    <div className="flex p-1 bg-gray-100 rounded-lg">
                        {(["small", "large"] as const).map((variant) => (
                            <button
                                type="button"
                                key={variant}
                                onClick={() => updateBlock(id, { variant })}
                                className={cn(
                                    "flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all",
                                    block.data.variant === variant
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {variant}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                        <MousePointer2 className="w-3 h-3" />
                        Interaction
                    </label>
                    <div className="flex items-center h-[38px]">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={block.data.isDisabled}
                                    onChange={(e) =>
                                        updateBlock(id, { isDisabled: e.target.checked })
                                    }
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9061F5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9061F5]"></div>
                            </div>
                            <span className="text-sm text-white group-hover:text-gray-100">
                                Disabled
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
