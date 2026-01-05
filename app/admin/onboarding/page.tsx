import { isSetupComplete } from "@/lib/is-setup";
import { redirect } from "next/navigation";
import OnboardingWizard from "./components/OnboardingWizard";

export default async function OnboardingPage() {
  const isSetup = await isSetupComplete();

  if (isSetup) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 dark:bg-gray-900/50">
      <div className="w-full max-w-md space-y-4">
        <OnboardingWizard />
      </div>
    </div>
  );
}
