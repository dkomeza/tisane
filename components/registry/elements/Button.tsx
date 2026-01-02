import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import { ArrowRight } from "lucide-react";
import z from "zod";

type ButtonProps = {
  content: string;
  variant: "small" | "large";
  color: "primary" | "dark" | "white" | "violet" | "pink" | "clear";
  textColor: "black" | "white" | "pink" | "violet";
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
    textColor: z.enum(["black", "white", "pink", "violet"]).default("white"),
    isDisabled: z.boolean().default(false),
  }),
};

function ButtonClientComponent({ data }: BlockProps<ButtonProps>) {
  const colorStyles = {
    primary: "bg-[#6B2AF6] text-white hover:bg-[#4f46e5]",
    dark: "bg-[#8C1858] text-white hover:bg-black",
    white: "bg-[#F8F8F8] text-black border border-gray-100 hover:bg-gray-50",
    violet: "bg-[#9061F5] text-white hover:bg-[#7c3aed]",
    pink: "bg-[#FF2B97] text-white hover:bg-[#db2777]",
    clear: "bg-transparent text-black hover:bg-gray-100",
  };

  const textColorStyles = {
    black: "text-black",
    white: "text-white",
    pink: "text-pink-500",
    violet: "text-violet-500",
  };

  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-lg",
  };

  const disabledStyle =
    "bg-[#a1a1aa] text-white/70 cursor-not-allowed opacity-50 pointer-events-none";

  const finalClass = data.isDisabled
    ? disabledStyle
    : colorStyles[data.color] +
      " " +
      textColorStyles[data.textColor] +
      " " +
      sizeStyles[data.variant];

  return (
    <button
      disabled={data.isDisabled}
      className={`
        flex items-center justify-center gap-3 px-8 py-3 
        font-medium transition-colors duration-200 
        ${finalClass}
      `}
    >
      <span>
        <ArrowRight className="w-4 h-4" /> 
        {data.content}
        <ArrowRight className="w-4 h-4" />
      </span>
    </button>
  );
}

function ButtonAdminComponent({ id, useStore }: AdminBlockProps<ButtonProps>) {
  const { blocks, updateBlock } = useStore();

  const block = blocks.find((b) => b.id === id) as Block<"button">;

  if (!block) return null;

  return (
    <textarea
      value={block.data.content}
      onChange={(e) => updateBlock(id, { content: e.target.value })}
    ></textarea>
  );
}

function ButtonPreviewComponent() {
  return <button disabled>Button Preview</button>;
}
