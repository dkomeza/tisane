import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import z from "zod";

type Color = "primary" | "dark" | "white" | "violet" | "pink" | "clear";

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
      .enum(["primary", "dark", "white", "violet", "pink", "clear"])
      .default("primary"),
    isDisabled: z.boolean().default(false),
  }),
};

function ButtonClientComponent({ data }: BlockProps<ButtonProps>) {
  const colorStyles = {
    primary: "bg-[#6B2AF6] text-white hover:bg-[#4f46e5] disabled:bg-[#a1a1aa]",
    dark: "bg-[#8C1858] text-white hover:bg-black disabled:bg-[#a1a1aa]",
    white:
      "bg-[#F8F8F8] text-black border border-gray-100 hover:bg-gray-50 disabled:bg-gray-200",
    violet: "bg-[#9061F5] text-white hover:bg-[#7c3aed] disabled:bg-[#a1a1aa]",
    pink: "bg-[#FF2B97] text-white hover:bg-[#db2777] disabled:bg-[#a1a1aa]",
    clear: "bg-transparent text-black hover:bg-gray-100 disabled:bg-gray-200",
  };

  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-lg",
  };

  const disabledStyle =
    "bg-[#a1a1aa] text-white/70 cursor-not-allowed opacity-50 pointer-events-none";

  const finalClass = colorStyles[data.color] + " " + sizeStyles[data.variant];

  return (
    <button
      disabled={data.isDisabled}
      className={cn(
        "flex items-center justify-center gap-3 font-medium transition-colors duration-200 disabled:pointer-events-none",
        colorStyles[data.color],
        sizeStyles[data.variant]
      )}
    >
      <ArrowRight className="" />
      <span className="flex-1 text-center">{data.content}</span>
      <ArrowRight className="w-10 h-10" />
    </button>
  );
}

function ButtonAdminComponent({ id, useStore }: AdminBlockProps<ButtonProps>) {
  const { blocks, updateBlock } = useStore();

  const block = blocks.find((b) => b.id === id) as Block<"button">;

  if (!block) return null;

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={block.data.content}
        onChange={(e) => updateBlock(id, { content: e.target.value })}
      ></textarea>
      <select
        name="color"
        id="color"
        value={block.data.color}
        onChange={(e) => updateBlock(id, { color: e.target.value as Color })}
      >
        <option value="primary">Primary</option>
        <option value="dark">Dark</option>
        <option value="white">White</option>
        <option value="violet">Violet</option>
        <option value="pink">Pink</option>
        <option value="clear">Clear</option>
      </select>

      <input
        type="checkbox"
        checked={block.data.isDisabled}
        onChange={(e) => updateBlock(id, { isDisabled: e.target.checked })}
      />
      <label htmlFor="isDisabled">Is Disabled</label>

      <select
        name="variant"
        id="variant"
        value={block.data.variant}
        onChange={(e) =>
          updateBlock(id, { variant: e.target.value as "small" | "large" })
        }
      >
        <option value="small">Small</option>
        <option value="large">Large</option>
      </select>
    </div>
  );
}

function ButtonPreviewComponent() {
  return <button disabled>Button Preview</button>;
}
