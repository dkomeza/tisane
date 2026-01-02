import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
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
