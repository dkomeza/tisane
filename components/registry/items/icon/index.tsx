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

export function IconComponent({ name, size, className }: IconProps) {
  const LucideIcon = iconMap[name] || ArrowRight;
  return <LucideIcon size={size} className={className} />;
}

/**
 * This is the client-side component that will be rendered in the application.
 */
function IconClient({ data }: BlockProps<IconProps>) {
  return <IconComponent name={data.name} className="h-6" />;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function IconAdmin({ id, useStore }: AdminBlockProps<IconProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"icon">;

  if (!block) return null;

  const { name } = block.data;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Icon Type</Label>
        <Select
          value={name}
          onValueChange={(value) =>
            updateBlock(id, { name: value as IconName })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arrowRight"> <ArrowRight /> Arrow Right </SelectItem>
            <SelectItem value="arrowLeft"> <ArrowLeft /> Arrow Left </SelectItem>
            <SelectItem value="chevronRight"> <ChevronRight /> Chevron Right </SelectItem>
            <SelectItem value="chevronLeft"> <ChevronLeft /> Chevron Left </SelectItem>
            <SelectItem value="logIn"> <LogIn /> Log In </SelectItem>
            <SelectItem value="circleChevronDown">
              <CircleChevronDown />  Circle Chevron Down
            </SelectItem>
            <SelectItem value="circleChevronUp"> <CircleChevronUp /> Circle Chevron Up </SelectItem>
            <SelectItem value="circleArrowDown"> <CircleArrowDown /> Circle Arrow Down </SelectItem>
            <SelectItem value="check"> <Check /> Check </SelectItem>
            <SelectItem value="arrowUpRight"> <ArrowUpRight /> Arrow Up Right </SelectItem>
            <SelectItem value="arrowDown"> <ArrowDown /> Arrow Down </SelectItem>
            <SelectItem value="listAlt"> <List /> List Alt </SelectItem>
            <SelectItem value="cards"> <LayoutGrid /> Cards </SelectItem>
            <SelectItem value="download"> <Download /> Download </SelectItem>
          </SelectContent>
        </Select>
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
    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 text-muted-foreground w-full justify-center">
      <span className="text-xs font-medium">Icon</span>
    </div>
  );
}
