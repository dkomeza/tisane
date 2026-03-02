import { authorize } from "@/lib/auth/authorize";
import { redirect } from "next/navigation";
import { UpdateCMSButton } from "./components/UpdateCMSButton";

export default async function SettingsPage() {
  const { authorized } = await authorize();

  if (!authorized) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="flex flex-col gap-4 bg-muted/30 p-6 rounded-lg border border-border">
        <div>
          <h2 className="text-xl font-semibold mb-1">System Updates</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Check for and apply the latest updates to the CMS. This will restart
            the system and cause a few moments of downtime.
          </p>
        </div>
        <UpdateCMSButton />
      </div>
    </div>
  );
}
