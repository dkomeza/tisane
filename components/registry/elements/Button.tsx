import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Type,
  Palette,
  MousePointer2,
  BoxSelect,
} from "lucide-react";
import z from "zod";

type Color = "primary" | "dark" | "white" | "violet" | "pink";

type ButtonProps = {
  content: string;
  variant: "small" | "large";
  color: Color;
  isDisabled: boolean;
};

export const Button: CMSComponent<"button", ButtonProps> = {
  id: "button" as const,
  label: "Button",

  ClientComponent: ButtonClientComponent,
  AdminComponent: ButtonAdminComponent,
  PreviewComponent: ButtonPreviewComponent,

  Schema: z.object({
    content: z.string().min(1).max(100).default("Click me"),
    variant: z.enum(["small", "large"]).default("large"),
    color: z
      .enum(["primary", "dark", "white", "violet", "pink"])
      .default("primary"),
    isDisabled: z.boolean().default(false),
  }),
};

function ButtonClientComponent({ data }: BlockProps<ButtonProps>) {
  const colorStyles = {
    primary:
      "bg-[#9061F5] text-white hover:bg-[#6B2AF6] disabled:bg-[#A7A49F] disabled:text-[#F1EFEC]",
    dark: "bg-[#FF2B97] text-white hover:bg-[#8C1858] disabled:bg-[#64635F] disabled:text-[#D2CFCB]",
    white:
      "bg-transparent text-[#F8F8F8] border border-[#F8F8F8] disabled:bg-[#D2CFCB] disabled:border-none",
    violet:
      "bg-transparent text-[#B499F5] border border-[#B499F5] hover:text-[#6B2AF6] hover:border-[#6B2AF6] disabled:text-[#A7A49F] disabled:border-[#A7A49F]",
    pink: "text-[#F2599F] border border-[#F2599F] hover:text-[#8C1858] hover:border-[#8C1858] disabled:text-[#D2CFCB] disabled:border-[#D2CFCB]",
  };

  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-lg",
  };

  return (
    <button
      disabled={data.isDisabled}
      className={cn(
        "flex items-center justify-center gap-3 font-medium transition-colors duration-200 disabled:pointer-events-none",
        colorStyles[data.color],
        sizeStyles[data.variant]
      )}
    >
      <ArrowRight className="size-7" />
      <span className="flex-1 text-center">{data.content}</span>
      <ArrowRight className="size-7" />
    </button>
  );
}

function ButtonAdminComponent({ id, useStore }: AdminBlockProps<ButtonProps>) {
  const { blocks, updateBlock } = useStore();
  const block = blocks.find((b) => b.id === id) as Block<"button">;

  if (!block) return null;

  const colorOptions: { value: Color; bgClass: string; label: string }[] = [
    { value: "primary", bgClass: "bg-[#9061F5]", label: "Primary" },
    { value: "dark", bgClass: "bg-[#FF2B97]", label: "Dark" },
    {
      value: "white",
      bgClass: "bg-gray-100 border border-gray-300",
      label: "White",
    },
    { value: "violet", bgClass: "bg-[#B499F5]", label: "Violet" },
    { value: "pink", bgClass: "bg-[#F2599F]", label: "Pink" },
  ];

  return (
    <div className="flex flex-col gap-5 p-4 rounded-xl shadow-sm border border-gray-200">
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

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
          <Palette className="w-3 h-3" />
          Color Theme
        </label>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateBlock(id, { color: option.value })}
              className={cn(
                "group relative w-10 h-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
                option.bgClass,
                block.data.color === option.value
                  ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                  : "hover:scale-105 hover:opacity-90"
              )}
              title={option.label}
              aria-label={`Select ${option.label} color`}
            >
              {block.data.color === option.value && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
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
  return <button disabled>Button Preview</button>;
}
