"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { installPlugin } from "@/app/actions/plugins/install-plugin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function InstallPluginForm() {
  const router = useRouter()
  const [repoUrl, setRepoUrl] = useState("")
  const [branch, setBranch] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!repoUrl.trim()) return

    setIsPending(true)
    const result = await installPlugin({
      repoUrl: repoUrl.trim(),
      branch: branch.trim() || "main",
      displayName: displayName.trim() || undefined,
    })
    setIsPending(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success("Plugin queued. Run a build to activate it.")
    router.push(`/admin/plugins/${result.data.plugin.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
      <h2 className="font-medium">Install Plugin</h2>
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48">
          <Label htmlFor="repoUrl" className="text-sm mb-1 block">
            GitHub URL
          </Label>
          <Input
            id="repoUrl"
            type="url"
            placeholder="https://github.com/org/my-plugin"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
        </div>
        <div className="w-32">
          <Label htmlFor="branch" className="text-sm mb-1 block">
            Branch
          </Label>
          <Input
            id="branch"
            placeholder="main"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-40">
          <Label htmlFor="displayName" className="text-sm mb-1 block">
            Display name
          </Label>
          <Input
            id="displayName"
            placeholder="Optional"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !repoUrl.trim()}>
          <Plus className="mr-2 h-4 w-4" />
          {isPending ? "Adding..." : "Add Plugin"}
        </Button>
      </div>
    </form>
  )
}
