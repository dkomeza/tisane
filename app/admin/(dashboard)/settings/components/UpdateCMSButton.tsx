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
import { RefreshCw, Download, Info } from "lucide-react";
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
  const [release, setRelease] = useState<GitHubRelease | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);

  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  const checkForUpdates = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(
        "https://api.github.com/repos/dkomeza/tisane/releases/latest",
      );
      if (!res.ok) throw new Error("Could not fetch latest release");

      const data: GitHubRelease = await res.json();

      // If we're not running with a version (dev mode), or it's genuinely newer
      if (!currentVersion || data.tag_name !== currentVersion) {
        setRelease(data);
        setShowModal(true);
      } else {
        toast.info(
          `You are already running the latest version (${currentVersion}).`,
        );
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to check for updates");
    } finally {
      setIsChecking(false);
    }
  };

  const checkUpdateStatus = async (
    interval: NodeJS.Timeout,
    toastId: string | number,
  ) => {
    try {
      const res = await fetch("/");
      if (res.ok && hasErrored) {
        clearInterval(interval);
        toast.success("Update completed! The system will restart shortly.", {
          id: toastId,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Update failed");
      }
    } catch (_) {
      setHasErrored(true);
    }
  };

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
      const interval = setInterval(() => {
        checkUpdateStatus(interval, updateToast);
      }, 500);
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
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          Current Version: {currentVersion || "Development / Unversioned"}
        </p>
        <Button
          onClick={checkForUpdates}
          disabled={isChecking || isUpdating}
          className="w-fit"
        >
          {isChecking ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isChecking ? "Checking..." : "Check for Updates"}
        </Button>
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
