import { authorize } from "@/lib/auth/authorize";
import { redirect } from "next/navigation";
import { FeedbackForm } from "./components/FeedbackForm";

export default async function FeedbackPage() {
  const { authorized } = await authorize();

  if (!authorized) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Feedback & Support</h1>
        <p className="text-muted-foreground text-lg">
          Encountered a bug or have a suggestion for the CMS? Let us know! Your feedback will be directly sent to our GitHub repository.
        </p>
      </div>
      <FeedbackForm />
    </div>
  );
}
