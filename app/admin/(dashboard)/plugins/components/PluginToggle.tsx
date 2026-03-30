"use client";

import { Switch } from "@/components/ui/switch";
import { enablePlugin } from "@/app/actions/plugins/enable-plugin";
import { disablePlugin } from "@/app/actions/plugins/disable-plugin";
import { useTransition } from "react";
import { toast } from "sonner";

export function PluginToggle({
  pluginId,
  enabled,
}: {
  pluginId: string;
  enabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(newChecked: boolean) {
    startTransition(async () => {
      const result = newChecked
        ? await enablePlugin(pluginId)
        : await disablePlugin(pluginId);
      if (!result.success) {
        toast.error(result.error);
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
