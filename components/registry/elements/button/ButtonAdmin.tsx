"use client";

import { cn } from "@/lib/utils";
import {
  Type,
  Palette,
  BoxSelect,
  Trash2,
  Smile,
  MousePointer2,
  ExternalLink,
  FileText,
  ScanSearch,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { ButtonAction, ButtonProps } from "./index";
import { ButtonClient } from "./ButtonClient";
import { useEffect, useState } from "react";
import { getPages } from "@/app/actions/pages/get-pages";
import { PageWithoutContent } from "@/lib/schemas/PagesSchema";
import { DocumentAdminItem } from "../documents-button/DocumentAdminItem";

interface ButtonAdminProps {
  id: string;
  data: ButtonProps;
  updateBlock: (id: string, data: Partial<ButtonProps>) => void;
  removeBlock?: (id: string) => void;
}

const ACTION_TYPES = [
  { value: "none", label: "None" },
  { value: "link", label: "Link" },
  { value: "download", label: "Download" },
  { value: "scroll", label: "Scroll" },
] as const;

export function ButtonAdmin({
  id,
  data,
  updateBlock,
  removeBlock,
}: ButtonAdminProps) {
  const [pages, setPages] = useState<PageWithoutContent[]>([]);

  const action = data.action ?? { type: "none" };

  useEffect(() => {
    getPages({ returnAll: true }).then((res) => {
      if (res.success) setPages(res.data.pages);
    });
  }, []);

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

  const setActionType = (type: ButtonAction["type"]) => {
    const defaults: Record<string, ButtonAction> = {
      none: { type: "none" },
      link: {
        type: "link",
        linkType: "external",
        url: "",
        pageId: undefined,
        newTab: false,
      },
      download: { type: "download", mediaId: "" },
      scroll: { type: "scroll", targetId: "" },
    };
    updateBlock(id, { action: defaults[type] });
  };

  const updateAction = (patch: Partial<ButtonAction>) => {
    updateBlock(id, { action: { ...action, ...patch } as ButtonAction });
  };

  const handlePageChange = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      updateAction({ pageId: page.id, url: `/${page.slug}` });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative group/button cursor-pointer inline-block">
          {/* Hover outline */}
          <div className="transition-all duration-200 pointer-events-none opacity-100 group-hover/button:opacity-50 flex flex-col">
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

        {/* ── Action ── */}
        <div className="space-y-3">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MousePointer2 className="size-3" />
            Action
          </label>

          {/* Action type tabs */}
          <div className="flex p-1 bg-muted rounded-lg">
            {ACTION_TYPES.map(({ value, label }) => (
              <button
                type="button"
                key={value}
                onClick={() => setActionType(value)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                  action.type === value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Link sub-fields */}
          {action.type === "link" && (
            <div className="space-y-3">
              {/* internal / external toggle */}
              <div className="flex p-1 bg-muted rounded-lg">
                {(["external", "internal"] as const).map((lt) => (
                  <button
                    type="button"
                    key={lt}
                    onClick={() => updateAction({ linkType: lt })}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                      action.linkType === lt
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {lt}
                  </button>
                ))}
              </div>

              {action.linkType === "external" ? (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <ExternalLink className="size-3" />
                    URL
                  </label>
                  <Input
                    value={action.url ?? ""}
                    onChange={(e) => updateAction({ url: e.target.value })}
                    placeholder="https://example.com"
                    className="text-sm"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="size-3" />
                    Page
                  </label>
                  <Select
                    value={action.pageId ?? ""}
                    onValueChange={handlePageChange}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map((page) => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.title} (/{page.slug})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* New tab toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={action.newTab ?? false}
                    onChange={(e) => updateAction({ newTab: e.target.checked })}
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Open in new tab
                </span>
              </label>
            </div>
          )}

          {/* Download sub-fields */}
          {action.type === "download" && (
            <DocumentAdminItem
              mediaId={action.mediaId}
              onSelect={(media) => updateAction({ mediaId: media.id })}
              onRemove={() => updateAction({ mediaId: "" })}
            />
          )}

          {/* Scroll sub-fields */}
          {action.type === "scroll" && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <ScanSearch className="size-3" />
                Target block ID
              </label>
              <Input
                value={action.targetId ?? ""}
                onChange={(e) => updateAction({ targetId: e.target.value })}
                placeholder="e.g. hero-section"
                className="text-sm font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                The block must have a matching{" "}
                <code className="font-mono">data-tisane-id</code> attribute.
              </p>
            </div>
          )}
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
