import { authorize } from "@/lib/auth/authorize";
import { redirect, notFound } from "next/navigation";
import { getPlugin } from "@/app/actions/plugins/get-plugin";
import { deletePlugin } from "@/app/actions/plugins/delete-plugin";
import { PluginStatusBadge } from "../components/PluginStatusBadge";
import { PluginSettingsRenderer } from "../components/PluginSettingsRenderer";
import { PluginToggle } from "../components/PluginToggle";
import { pluginMap } from "@/plugins/index";
import { PluginStatus } from "@/lib/schemas/PluginsSchema";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { readFile } from "fs/promises";
import path from "path";

type Props = { params: Promise<{ id: string }> };

async function PluginDetailPage({ params }: Props) {
  const { id } = await params;
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  const result = await getPlugin({ pluginId: id });

  if (!result.success) {
    notFound();
  }

  const plugin = result.data.plugin;
  const activePlugin = pluginMap[plugin.slug] ?? null;

  // Read README if it exists (guard against path traversal)
  const pluginsRoot = path.resolve(process.cwd(), "plugins");
  const readmePath = path.resolve(pluginsRoot, plugin.slug, "README.md");
  let readme: string | null = null;
  if (readmePath.startsWith(pluginsRoot + path.sep)) {
    readme = await readFile(readmePath, "utf-8").catch(() => null);
  }

  async function deleteAction() {
    "use server";
    const result = await deletePlugin(plugin.id);
    if (!result.success) {
      throw new Error(result.error);
    }
    redirect("/admin/plugins");
  }

  return (
    <div className="h-full w-full max-w-3xl flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/admin/plugins"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-semibold">{plugin.displayName}</h1>
        <PluginStatusBadge status={plugin.status} />
      </div>

      {/* Error card */}
      {plugin.status === PluginStatus.broken && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
          <div className="flex items-center gap-2 mb-2 text-red-800 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">
              Build failed at stage: {plugin.errorStage}
            </span>
          </div>
          <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap overflow-auto max-h-48 font-mono">
            {plugin.errorMessage}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Enabled</span>
          <PluginToggle pluginId={plugin.id} enabled={plugin.enabled} />
        </div>
        {plugin.enabled !== (plugin.status === PluginStatus.installed) && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            A rebuild is required to apply this change.
          </p>
        )}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Repository</dt>
          <dd className="font-mono text-xs truncate">
            {plugin.repoUrl ?? "Built-in"}
          </dd>
          <dt className="text-muted-foreground">Branch</dt>
          <dd>{plugin.branch}</dd>
          <dt className="text-muted-foreground">Installed commit</dt>
          <dd className="font-mono text-xs">
            {plugin.installedCommit?.slice(0, 7) ?? "\u2014"}
          </dd>
          <dt className="text-muted-foreground">Last sync</dt>
          <dd>
            {plugin.lastSyncAt
              ? new Date(plugin.lastSyncAt).toLocaleString()
              : "\u2014"}
          </dd>
          {activePlugin && (
            <>
              <dt className="text-muted-foreground">Version</dt>
              <dd>{activePlugin.version}</dd>
            </>
          )}
        </dl>
      </div>

      {/* README */}
      {readme && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-medium mb-3">README</h2>
          <details>
            <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
              Show README
            </summary>
            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96 font-mono">
              {readme}
            </pre>
          </details>
        </div>
      )}

      {/* Plugin settings */}
      {activePlugin && plugin.status === PluginStatus.installed && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-medium mb-3">Plugin Settings</h2>
          <PluginSettingsRenderer plugin={plugin} activePlugin={activePlugin} />
        </div>
      )}

      {/* Danger zone */}
      {plugin.repoUrl !== null && (
        <div className="rounded-lg border border-destructive/30 bg-card p-4">
          <h2 className="font-medium text-destructive mb-3">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete plugin</p>
              <p className="text-xs text-muted-foreground">
                Removes the plugin record. Built-in plugins cannot be deleted.
              </p>
            </div>
            <form action={deleteAction}>
              <Button type="submit" variant="destructive" size="sm">
                Delete
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PluginDetailPage;
