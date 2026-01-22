"use client";

import { useEffect, useState } from "react";
import { AdminBlockProps, Block } from "@/components/registry";
import { getPages } from "@/app/actions/pages/get-pages";
import { PageWithoutContent } from "@/lib/schemas/PagesSchema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Type,
  Link as LinkIcon,
  ExternalLink,
  FileText,
  MousePointer2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CmsLinkClient, CmsLinkProps } from "./index";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
export function CmsLinkAdmin({ id, useStore }: AdminBlockProps<CmsLinkProps>) {
  const { getBlock, updateBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"cms-link">;
  const [pages, setPages] = useState<PageWithoutContent[]>([]);

  useEffect(() => {
    getPages({ returnAll: true }).then((res) => {
      if (res.success) {
        setPages(res.data.pages);
      }
    });
  }, []);

  if (!block) return null;

  const handlePageChange = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      updateBlock(id, {
        pageId: page.id,
        url: `/${page.slug}`,
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="px-2 py-2 border-transparent border-2 border-dashed rounded-lg cursor-pointer hover:border-muted-foreground/50 hover:bg-muted-foreground/5 transition-colors">
          <div className="pointer-events-none">
            <CmsLinkClient id={id} data={block.data} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent>
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
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
              <Type className="w-3 h-3" />
              Link Text
            </label>
            <Input
              value={block.data.text}
              onChange={(e) => updateBlock(id, { text: e.target.value })}
              placeholder="e.g. Learn More"
              className="bg-transparent text-white border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
              <LinkIcon className="w-3 h-3" />
              Link Type
            </label>
            <div className="flex p-1 bg-gray-100/10 rounded-lg">
              {(["internal", "external"] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => updateBlock(id, { linkType: type })}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                    block.data.linkType === type
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {block.data.linkType === "external" ? (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                <ExternalLink className="w-3 h-3" />
                URL
              </label>
              <Input
                value={block.data.url || ""}
                onChange={(e) => updateBlock(id, { url: e.target.value })}
                placeholder="https://example.com"
                className="bg-transparent text-white border-gray-300"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                <FileText className="w-3 h-3" />
                Select Page
              </label>
              <Select
                value={block.data.pageId || ""}
                onValueChange={handlePageChange}
              >
                <SelectTrigger className="w-full bg-transparent text-white border-gray-300">
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

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
              <MousePointer2 className="w-3 h-3" />
              Options
            </label>
            <div className="flex items-center h-[38px]">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={block.data.newTab}
                    onChange={(e) =>
                      updateBlock(id, { newTab: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9061F5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9061F5]"></div>
                </div>
                <span className="text-sm text-white group-hover:text-gray-100">
                  Open in new tab
                </span>
              </label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
