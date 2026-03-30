"use client";

import { Switch } from "@/components/ui/switch";
import { enablePlugin } from "@/app/actions/plugins/enable-plugin";
import { disablePlugin } from "@/app/actions/plugins/disable-plugin";
import { useTransition } from "react";

export function PluginToggle({
  pluginId,
  enabled,
}: {
  pluginId: string;
  enabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      if (enabled) {
        await disablePlugin(pluginId);
      } else {
        await enablePlugin(pluginId);
      }
    });
  }

  return (
    <Switch
      checked={enabled}
      onCheckedChange={handleToggle}
      disabled={isPending}
      aria-label={enabled ? "Disable plugin" : "Enable plugin"}
    />
  );
}
