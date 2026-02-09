/**
 * Component: Icon
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";
import {
  LucideIcon,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LogIn,
  CircleChevronDown,
  CircleChevronUp,
  CircleArrowDown,
  Check,
  ArrowUpRight,
  ArrowDown,
  List,
  LayoutGrid,
  Download,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type IconName =
  | "menu"
  | "close"
  | "arrowLeft"
  | "arrowRight"
  | "chevronLeft"
  | "chevronRight"
  | "logIn"
  | "circleChevronDown"
  | "circleChevronUp"
  | "circleArrowDown"
  | "check"
  | "arrowUpRight"
  | "arrowDown"
  | "listAlt"
  | "cards"
  | "download";

export type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export const Icon: CMSComponent<"icon", IconProps> = {
  id: "icon" as const,
  label: "Icon",

  ClientComponent: IconClient,
  AdminComponent: IconAdmin,
  PreviewComponent: IconPreview,

  Schema: z.object({
    name: z
      .enum([
        "menu",
        "close",
        "arrowLeft",
        "arrowRight",
        "chevronLeft",
        "chevronRight",
        "logIn",
        "circleChevronDown",
        "circleChevronUp",
        "circleArrowDown",
        "check",
        "arrowUpRight",
        "arrowDown",
        "listAlt",
        "cards",
        "download",
      ])
      .default("arrowRight"),
    size: z.number().min(8).max(200).default(24),
  }),
};

export const iconMap: Record<IconName, LucideIcon> = {
  menu: Menu,
  close: X,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  logIn: LogIn,
  circleChevronDown: CircleChevronDown,
  circleChevronUp: CircleChevronUp,
  circleArrowDown: CircleArrowDown,
  check: Check,
  arrowUpRight: ArrowUpRight,
  arrowDown: ArrowDown,
  listAlt: List,
  cards: LayoutGrid,
  download: Download,
};

export function IconComponent({ name, size = 24, className }: IconProps) {
  const LucideIcon = iconMap[name] || ArrowRight;
  return <LucideIcon size={size} className={className} />;
}

/**
 * This is the client-side component that will be rendered in the application.
 */
function IconClient({ data }: BlockProps<IconProps>) {
  return (
    <IconComponent 
      name={data.name} 
      size={data.size} 
    />
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function IconAdmin({ id, useStore }: AdminBlockProps<IconProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"icon">;

  if (!block) return null;

  const { name, size } = block.data;
  const SelectedIcon = iconMap[name] || ArrowRight;

  return (
      <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Icon</Label>
        
        <details className="group w-full">
          <summary className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer list-none">
            <div className="flex items-center gap-2">
              <SelectedIcon className="h-4 w-4" />
              <span className="font-medium">{name}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          
          <div className="mt-2 w-full rounded-md border bg-popover p-2 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
            <div className="grid grid-cols-6 gap-2 justify-items-center">
              {(Object.keys(iconMap) as IconName[]).map((iconKey) => {
                const IconItem = iconMap[iconKey];
                const isSelected = name === iconKey;
                return (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => updateBlock(id, { name: iconKey })}
                    className={cn(
                      "flex items-center justify-center h-9 w-9 rounded-md transition-all hover:scale-110",
                      isSelected 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title={iconKey}
                  >
                    <IconItem className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </details>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <div className="relative">
            <Input
              type="number"
              className="h-8 pr-6"
              value={size}
              onChange={(e) => updateBlock(id, { size: Number(e.target.value) })}
              min={8}
            />
            <span className="absolute right-2 top-2 text-[10px] text-muted-foreground pointer-events-none">px</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function IconPreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 border rounded-md bg-muted/10 w-full text-muted-foreground">
      <LayoutGrid className="h-6 w-6" />
      <span className="text-xs font-medium">Icon Component</span>
    </div>
  );
}
