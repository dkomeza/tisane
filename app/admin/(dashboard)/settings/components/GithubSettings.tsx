"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateGithubSettings } from "../actions";

export function GithubSettings({ initialToken }: { initialToken: string }) {
  const [isPending, startTransition] = useTransition();

  const handleSave = (formData: FormData) => {
    const token = formData.get("github_token") as string;
    
    startTransition(async () => {
      try {
        await updateGithubSettings(token);
        toast.success("GitHub Token saved successfully.");
      } catch {
        toast.error("Failed to save GitHub Token.");
      }
    });
  };

  return (
    <form action={handleSave} className="flex flex-col gap-4">
      {!initialToken && (
        <div className="bg-primary/10 text-foreground p-4 rounded-md text-sm border border-primary/20">
          <strong className="font-semibold block mb-2">How to get a GitHub Token:</strong>
          <ol className="list-decimal ml-4 space-y-1 text-muted-foreground">
            <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub Developer Settings &gt; Tokens (classic)</a>.</li>
            <li>Click <strong>Generate new token</strong> and choose <strong>Generate new token (classic)</strong>.</li>
            <li>Give your token a descriptive note, like &quot;CMS Feedback&quot;.</li>
            <li>Under <strong>Select scopes</strong>, check the <strong>public_repo</strong> box (or <strong>repo</strong> if the target repository is private).</li>
            <li>Scroll down, click <strong>Generate token</strong>, and paste it below.</li>
          </ol>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="github_token">Personal Access Token</Label>
        <Input 
          id="github_token" 
          name="github_token" 
          type="password" 
          defaultValue={initialToken} 
          placeholder="ghp_xxxxxxxxxxxx" 
        />
        <p className="text-xs text-muted-foreground">
          This token is used to create bug reports and feature requests on the dkomeza/tisane repository.
        </p>
      </div>
      <div className="flex justify-end">
        <Button disabled={isPending} type="submit">
          {isPending ? "Saving..." : "Save Token"}
        </Button>
      </div>
    </form>
  );
}
