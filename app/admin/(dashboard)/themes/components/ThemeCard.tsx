"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plugin } from "@/lib/schemas/PluginsSchema";
import { PluginStatusBadge } from "../../plugins/components/PluginStatusBadge";
import { Button } from "@/components/ui/button";
import { activateTheme } from "@/app/actions/themes/activate-theme";
import { deactivateTheme } from "@/app/actions/themes/deactivate-theme";
import type { ThemeTokens } from "tisane";

function ColorSwatch({ color }: { color: string }) {
  return (
    <div
      className="h-6 w-6 rounded-md border border-border"
      style={{ backgroundColor: color }}
    />
  );
}

type Props = {
  theme: Plugin;
  isActive: boolean;
};

export function ThemeCard({ theme, isActive }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const tokens = (theme.config ?? {}) as ThemeTokens;
  const darkTokens = tokens.dark ?? {};
  const lightTokens = tokens.light ?? {};

  // Show a few color swatches from the theme's dark tokens (since default is dark mode)
  const previewColors = [
    darkTokens.primary ?? lightTokens.primary,
    darkTokens.secondary ?? lightTokens.secondary,
    darkTokens.accent ?? lightTokens.accent,
    darkTokens.background ?? lightTokens.background,
  ].filter(Boolean) as string[];

  function handleToggle() {
    startTransition(async () => {
      const result = isActive
        ? await deactivateTheme()
        : await activateTheme(theme.slug);

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(isActive ? "Theme deactivated" : "Theme activated");
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/admin/themes/${theme.id}`}
            className="font-medium hover:underline truncate"
          >
            {theme.displayName}
          </Link>
          <PluginStatusBadge status={theme.status} />
          {isActive && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              Active
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {theme.repoUrl ?? "Built-in theme"}
        </p>
        {previewColors.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {previewColors.map((color, i) => (
              <ColorSwatch key={i} color={color} />
            ))}
          </div>
        )}
      </div>
      <Button
        variant={isActive ? "outline" : "default"}
        size="sm"
        onClick={handleToggle}
        disabled={isPending || theme.status !== "installed"}
      >
        {isActive ? "Deactivate" : "Activate"}
      </Button>
    </div>
  );
}
