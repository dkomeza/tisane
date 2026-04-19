"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyIdButtonProps {
  id: string;
  className?: string;
}

/**
 * Toolbar button that copies a block's ID to the clipboard.
 * Shows a checkmark for 1.5 s after a successful copy.
 *
 * The copied value matches the `data-tisane-id` attribute used on
 * client-side blocks, making it easy to paste into scroll action targets.
 */
export function CopyIdButton({ id, className }: CopyIdButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors",
        className
      )}
      title={copied ? "Copied!" : `Copy block ID: ${id}`}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
}
