import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
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
import z from "zod";

const Schema = z.object({
  content: z.string().min(1).max(100).default("Click me"),
  variant: z.enum(["small", "large"]).default("large"),
  color: z
    .enum(["primary", "dark", "white", "violet", "pink"])
    .default("primary"),
  isDisabled: z.boolean().default(false),
  iconLeft: z.string().optional(),
  iconRight: z.string().optional(),
});

type ButtonProps = z.infer<typeof Schema>;
type Color = ButtonProps["color"];

export const ButtonComponent = {
  id: "button",
  label: "Button",

  ClientComponent: ButtonClientComponent,
  AdminComponent: ButtonAdminComponent,
  PreviewComponent: ButtonPreviewComponent,

  Schema,
} as CMSComponent<"button", ButtonProps>;

function ButtonClientComponent({ data }: BlockProps<ButtonProps>) {
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

  return (
    <button
      disabled={data.isDisabled}
      className={cn(
        "flex items-center justify-center gap-3 font-medium transition-colors duration-200 disabled:pointer-events-none",
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

function ButtonAdminComponent({ id, useStore }: AdminBlockProps<ButtonProps>) {
  const { getBlock, updateBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"button"> | null;

  if (!block) return null;

  const colorOptions: { value: Color; bgClass: string; label: string }[] = [
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
    <div className="flex flex-col gap-5 p-4 rounded-xl relative text-">
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
          Label Text
        </label>
        <textarea
          rows={2}
          className="w-full p-3 text-sm text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9061F5]/50 focus:border-[#9061F5] outline-none transition-all resize-none"
          value={block.data.content}
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

function ButtonPreviewComponent() {
  return <div>Button Preview</div>;
}
