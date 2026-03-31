import { authorize } from "@/lib/auth/authorize";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PluginStatusBadge } from "../../plugins/components/PluginStatusBadge";
import { ThemeOverridesEditor } from "../components/ThemeOverridesEditor";
import { getActiveThemeSlug } from "@/app/actions/themes/get-active-theme-slug";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ThemeTokens } from "tisane";
import type { PluginStatus } from "@/lib/schemas/PluginsSchema";

type Props = { params: Promise<{ id: string }> };

async function ThemeDetailPage({ params }: Props) {
  const { id } = await params;
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  const theme = await prisma.plugin.findUnique({
    where: { id },
  });

  if (!theme || theme.type !== "theme") {
    notFound();
  }

  const activeSlug = await getActiveThemeSlug();
  const isActive = theme.slug === activeSlug;
  const baseTokens = (theme.config ?? {}) as ThemeTokens;
  const overrides = (theme.themeOverrides ?? {}) as Record<string, unknown>;

  return (
    <div className="h-full w-full max-w-3xl flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/admin/themes"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-semibold">{theme.displayName}</h1>
        <PluginStatusBadge status={theme.status as PluginStatus} />
        {isActive && (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Active
          </span>
        )}
      </div>

      {/* Theme info */}
      <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Repository</dt>
          <dd className="font-mono text-xs truncate">
            {theme.repoUrl ?? "Built-in"}
          </dd>
          <dt className="text-muted-foreground">Branch</dt>
          <dd>{theme.branch}</dd>
          <dt className="text-muted-foreground">Installed commit</dt>
          <dd className="font-mono text-xs">
            {theme.installedCommit?.slice(0, 7) ?? "\u2014"}
          </dd>
          <dt className="text-muted-foreground">Status</dt>
          <dd>{isActive ? "Active" : "Inactive"}</dd>
        </dl>
      </div>

      {/* Base tokens (read-only) */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-medium mb-3">Base Tokens</h2>
        <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-64 font-mono text-muted-foreground bg-muted/50 rounded-md p-3">
          {JSON.stringify(baseTokens, null, 2)}
        </pre>
      </div>

      {/* Override editor */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-medium mb-1">Theme Overrides</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Override specific tokens for this theme. Uses the same structure as
          base tokens (light, dark, radius, typography, containers).
        </p>
        <ThemeOverridesEditor
          pluginId={theme.id}
          currentOverrides={overrides}
        />
      </div>
    </div>
  );
}

export default ThemeDetailPage;
