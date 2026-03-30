"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { TisanePlugin } from "tisane";
import type { Plugin } from "@/lib/schemas/PluginsSchema";
import { updatePluginConfig } from "@/app/actions/plugins/update-plugin-config";

type Props = {
  plugin: Plugin;
  activePlugin: TisanePlugin;
};

export function PluginSettingsRenderer({ plugin, activePlugin }: Props) {
  const { SettingsComponent } = activePlugin;
  const [isSaving, startTransition] = useTransition();

  if (!SettingsComponent) {
    return (
      <p className="text-sm text-muted-foreground">
        This plugin has no settings.
      </p>
    );
  }

  const currentConfig = (plugin.config ?? {}) as Record<string, unknown>;

  async function handleSave(newConfig: unknown) {
    startTransition(async () => {
      const result = await updatePluginConfig({
        pluginId: plugin.id,
        config: newConfig as Record<string, unknown>,
      });

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Settings saved");
      }
    });
  }

  return (
    <SettingsComponent
      config={currentConfig}
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}
