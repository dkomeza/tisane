"use client";

import { cn } from "@/lib/utils";
import { Type, Palette, BoxSelect, Trash2, Smile, Pencil } from "lucide-react";
import { iconMap, IconName } from "@/components/registry/items/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ButtonProps } from "./index";
import { ButtonClient } from "./ButtonClient";

interface ButtonAdminProps {
  id: string;
  data: ButtonProps;
  updateBlock: (id: string, data: Partial<ButtonProps>) => void;
  removeBlock?: (id: string) => void;
}

export function ButtonAdmin({
  id,
  data,
  updateBlock,
  removeBlock,
}: ButtonAdminProps) {
  const colorOptions: {
    value: ButtonProps["color"];
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
      bgClass: "border-4 border-brand-pink-400",
      label: "Pink",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative group/button cursor-pointer inline-block">
          {/* Hover outline */}
          <div className="transition-all duration-200 pointer-events-none opacity-100 group-hover/button:opacity-50">
            <ButtonClient id={id} data={data} />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-4" side="top" align="center">
        {/* Label text */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Type className="size-3" />
            Label
          </label>
          <textarea
            rows={1}
            className="w-full p-2 text-sm border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none bg-transparent"
            value={data.content}
            onChange={(e) => updateBlock(id, { content: e.target.value })}
            placeholder="e.g. Get Started"
          />
        </div>

        {/* Icons row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Smile className="size-3" />
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
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {Object.keys(iconMap).map((iconName) => {
                  const Icon = iconMap[iconName as IconName];
                  return (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center gap-2">
                        <Icon className="size-4" />
                        <span>{iconName}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Smile className="size-3" />
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
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {Object.keys(iconMap).map((iconName) => {
                  const Icon = iconMap[iconName as IconName];
                  return (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center gap-2">
                        <Icon className="size-4" />
                        <span>{iconName}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Color theme */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Palette className="size-3" />
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => updateBlock(id, { color: option.value })}
                className={cn(
                  "group/color relative size-8 rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1",
                  option.bgClass,
                  data.color === option.value
                    ? "ring-2 scale-110"
                    : "hover:scale-105 hover:opacity-90",
                )}
                title={option.label}
                aria-label={`Select ${option.label} color`}
              >
                {data.color === option.value && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <div className="size-2 bg-white rounded-full" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size toggle */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <BoxSelect className="size-3" />
            Size
          </label>
          <div className="flex p-1 bg-muted rounded-lg">
            {(["small", "large"] as const).map((variant) => (
              <button
                type="button"
                key={variant}
                onClick={() => updateBlock(id, { variant })}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all",
                  data.variant === variant
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>

        {/* Delete */}
        {removeBlock && (
          <button
            type="button"
            onClick={() => removeBlock(id)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <Trash2 className="size-3.5" />
            Delete Button
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
