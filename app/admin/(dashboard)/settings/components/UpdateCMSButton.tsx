"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  Download,
  Info,
  CheckCircle2,
  ArrowUpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GitHubRelease {
  tag_name: string;
  body: string;
  name: string;
}

export function UpdateCMSButton() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpToDate, setIsUpToDate] = useState(false);
  const [release, setRelease] = useState<GitHubRelease | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  const checkForUpdates = async (silent = false) => {
    setIsChecking(true);
    setIsUpToDate(false);
    setRelease(null);
    try {
      const res = await fetch(
        "https://api.github.com/repos/dkomeza/tisane/releases/latest",
      );
      if (!res.ok) throw new Error("Could not fetch latest release");

      const data: GitHubRelease = await res.json();

      if (!currentVersion || data.tag_name !== currentVersion) {
        // Show plaque — don't auto-open the modal
        setRelease(data);
      } else {
        setIsUpToDate(true);
        if (!silent) {
          toast.info(
            `You are already running the latest version (${currentVersion}).`,
          );
        }
      }
    } catch (e) {
      console.error(e);
      if (!silent) {
        toast.error("Failed to check for updates");
      }
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check for updates on mount
  useEffect(() => {
    checkForUpdates(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setShowModal(false);
    const toastId = toast.loading("Triggering system update...");

    try {
      const response = await fetch("/api/admin/update", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to trigger update");
      }

      toast.success("Update triggered! The system will restart shortly.", {
        id: toastId,
      });

      const updateToast = toast.loading("Updating system... ");

      // Snapshot the version that's running right now. As soon as the
      // healthcheck returns a different version we know the new container is up.
      const versionBeforeUpdate = process.env.NEXT_PUBLIC_APP_VERSION ?? null;

      const interval = setInterval(async () => {
        try {
          const res = await fetch("/api/admin/healthcheck");
          if (!res.ok) return; // container still restarting — keep polling
          const data: { ok: boolean; version: string | null } =
            await res.json();
          if (data.version !== versionBeforeUpdate) {
            clearInterval(interval);
            toast.success("Update complete! Reloading…", { id: updateToast });
            setTimeout(() => window.location.reload(), 1500);
          }
        } catch {
          // Network error → container is restarting, keep polling
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "An error occurred",
        { id: toastId },
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Current Version: {currentVersion || "Development / Unversioned"}
        </p>

        {isChecking ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Checking for updates…
          </div>
        ) : release ? (
          <>
            {/* Update available plaque */}
            <div className="flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-sm">
              <ArrowUpCircle className="mt-0.5 w-5 h-5 shrink-0 text-blue-500" />
              <div className="flex flex-col gap-1">
                <p className="font-medium text-blue-700 dark:text-blue-300">
                  Update available: {release.name || release.tag_name}
                </p>
                <p className="text-muted-foreground">
                  A new version of Tisane is ready to install.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowModal(true)}
                disabled={isUpdating}
                className="w-fit"
              >
                <Download className="w-4 h-4 mr-2" />
                View Release Notes &amp; Update
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => checkForUpdates(false)}
                disabled={isUpdating}
                className="text-muted-foreground"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Re-check
              </Button>
            </div>
          </>
        ) : isUpToDate ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              You&apos;re running the latest version.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => checkForUpdates(false)}
              disabled={isUpdating}
              className="w-fit"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Re-check
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => checkForUpdates(false)}
            disabled={isChecking || isUpdating}
            className="w-fit"
          >
            <Download className="w-4 h-4 mr-2" />
            Check for Updates
          </Button>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-xl mx-12">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Update Available: {release?.name || release?.tag_name}
            </DialogTitle>
            <DialogDescription>
              A new version of the CMS is available. Please review the release
              notes below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <ScrollArea className="h-[40vh] w-full rounded-md border p-4 bg-muted/30">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {release?.body || "No release notes provided."}
              </pre>
            </ScrollArea>
            <p className="text-sm text-muted-foreground">
              Clicking &quot;Apply Update&quot; will immediately restart the
              system. This process takes approximately 10-30 seconds, during
              which the CMS will be unavailable.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isUpdating ? "animate-spin" : ""}`}
              />
              {isUpdating ? "Updating..." : "Apply Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
