import Link from "next/link";
import { Plugin } from "@/lib/schemas/PluginsSchema";
import { PluginStatusBadge } from "./PluginStatusBadge";
import { PluginToggle } from "./PluginToggle";

export function PluginCard({ plugin }: { plugin: Plugin }) {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/admin/plugins/${plugin.id}`}
            className="font-medium hover:underline truncate"
          >
            {plugin.displayName}
          </Link>
          <PluginStatusBadge status={plugin.status} />
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {plugin.repoUrl ?? "Built-in plugin"}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">
          {plugin.slug}
        </p>
      </div>
      <PluginToggle pluginId={plugin.id} enabled={plugin.enabled} />
    </div>
  );
}
