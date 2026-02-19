import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Type,
    Palette,
    MousePointer2,
    BoxSelect,
    Trash2,
    Smile,
} from "lucide-react";
import { iconMap, IconName } from "@/components/registry/items/icon";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ButtonProps } from "./index";

interface ButtonAdminProps {
    id: string;
    data: ButtonProps;
    updateBlock: (id: string, data: Partial<ButtonProps>) => void;
    removeBlock?: (id: string) => void;
}

export function ButtonAdmin({ id, data, updateBlock, removeBlock }: ButtonAdminProps) {
    const colorOptions: { value: ButtonProps["color"]; bgClass: string; label: string }[] = [
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
            {removeBlock && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10 absolute top-2 right-2"
                    onClick={() => removeBlock(id)}
                    type="button"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            )}

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                    <Type className="w-3 h-3" />
                    Label Text
                </label>
                <textarea
                    rows={2}
                    className="w-full p-3 text-sm text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9061F5]/50 focus:border-[#9061F5] outline-none transition-all resize-none bg-transparent"
                    value={data.content}
                    onChange={(e) => updateBlock(id, { content: e.target.value })}
                    placeholder="e.g. Get Started"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                        <Smile className="w-3 h-3" />
                        Left Icon
                    </label>
                    <Select
                        value={data.iconLeft || "none"}
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
                        value={data.iconRight || "none"}
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
                                data.color === option.value
                                    ? "ring-2 scale-110"
                                    : "hover:scale-105 hover:opacity-90"
                            )}
                            title={option.label}
                            aria-label={`Select ${option.label} color`}
                        >
                            {data.color === option.value && (
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
                                    data.variant === variant
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {variant}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
