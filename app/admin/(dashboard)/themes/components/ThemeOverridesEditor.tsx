"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateThemeOverrides } from "@/app/actions/themes/update-theme-overrides";

type Props = {
  pluginId: string;
  currentOverrides: Record<string, unknown>;
};

export function ThemeOverridesEditor({ pluginId, currentOverrides }: Props) {
  const [value, setValue] = useState(
    JSON.stringify(currentOverrides, null, 2)
  );
  const [isSaving, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setError(null);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(value);
    } catch {
      setError("Invalid JSON");
      return;
    }

    startTransition(async () => {
      const result = await updateThemeOverrides(pluginId, parsed);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Theme overrides saved");
      }
    });
  }

  function handleReset() {
    setValue("{}");
    setError(null);

    startTransition(async () => {
      const result = await updateThemeOverrides(pluginId, {});
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Theme overrides reset to defaults");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="font-mono text-sm min-h-[200px]"
        placeholder='{"light": {"primary": "oklch(0.5 0.2 260)"}, "dark": {"primary": "oklch(0.7 0.2 260)"}}'
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={isSaving} size="sm">
          {isSaving ? "Saving..." : "Save overrides"}
        </Button>
        <Button
          onClick={handleReset}
          disabled={isSaving}
          variant="outline"
          size="sm"
        >
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
