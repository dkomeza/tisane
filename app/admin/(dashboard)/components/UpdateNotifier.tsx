"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowUpCircle, X } from "lucide-react";

const STORAGE_KEY = "update_toast_last_shown";

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

interface UpdateToastProps {
  toastId: string | number;
  versionName: string;
  onGoToSettings: () => void;
}

function UpdateToast({
  toastId,
  versionName,
  onGoToSettings,
}: UpdateToastProps) {
  return (
    <div className="flex items-start gap-3 w-full rounded-lg bg-blue-500/10 px-4 py-3 border border-blue-500/30">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
        <ArrowUpCircle className="h-4 w-4 text-blue-500" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-foreground leading-snug">
          Update available — {versionName}
        </p>
        <p className="text-xs text-muted-foreground leading-snug">
          A new version of Tisane is ready to install.
        </p>
        <button
          onClick={() => {
            toast.dismiss(toastId);
            onGoToSettings();
          }}
          className="mt-2 w-fit rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          View release notes &amp; update →
        </button>
      </div>

      <button
        onClick={() => toast.dismiss(toastId)}
        className="mt-0.5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function UpdateNotifier() {
  const router = useRouter();
  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  useEffect(() => {
    // Skip if already shown today
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown === getTodayDateString()) return;

    const checkForUpdate = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/dkomeza/tisane/releases/latest",
          { cache: "no-store" },
        );
        if (!res.ok) return;

        const data: { tag_name: string; name: string } = await res.json();

        if (data.tag_name !== currentVersion) {
          // localStorage.setItem(STORAGE_KEY, getTodayDateString());
          const versionName = data.name || data.tag_name;
          toast.custom(
            (t) => (
              <UpdateToast
                toastId={t}
                versionName={versionName}
                onGoToSettings={() => router.push("/admin/settings")}
              />
            ),
            {
              duration: 12_000,
              className: "!w-[360px]",
            },
          );
        }
      } catch {
        // Silently ignore network errors — this is a background notification
      }
    };

    checkForUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
