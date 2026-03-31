import { authorize } from "@/lib/auth/authorize";
import { redirect } from "next/navigation";
import { getPlugins } from "@/app/actions/plugins/get-plugins";
import { PluginCard } from "./components/PluginCard";
import { InstallPluginForm } from "./components/InstallPluginForm";
import { PluginStatus } from "@/lib/schemas/PluginsSchema";
import { RebuildButton } from "./components/RebuildButton";

async function PluginsPage() {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  const result = await getPlugins();
  const plugins = result.success ? result.data.plugins : [];

  const hasPendingChanges = plugins.some(
    (p) => p.status === PluginStatus.pending
  );

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Plugins</h1>
        <p className="text-lg font-light text-secondary-foreground/70">
          Extend the CMS with custom components and settings.
        </p>
      </div>

      {hasPendingChanges && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-900 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400 mb-2">
            A rebuild is required to apply pending plugin changes.
          </p>
          <RebuildButton />
        </div>
      )}

      <div className="mb-6">
        <InstallPluginForm />
      </div>

      {!result.success && (
        <p className="text-destructive text-sm">
          Failed to load plugins: {result.error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {plugins.map((plugin) => (
          <PluginCard key={plugin.id} plugin={plugin} />
        ))}
        {plugins.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No plugins installed. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}

export default PluginsPage;
