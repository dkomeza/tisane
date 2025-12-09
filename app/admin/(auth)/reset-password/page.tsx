import { redirect } from "next/navigation";
import ResetPasswordForm from "./components/ResetPasswordForm";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authorize } from "@/lib/auth/authorize";

type AdminForgotPasswordPageProps = {
  searchParams: Promise<{ token: string }>;
};

export default async function AdminForgotPasswordPage({
  searchParams: params,
}: AdminForgotPasswordPageProps) {
  const { authorized } = await authorize();

  if (authorized) {
    redirect("/admin");
  }

  const { token } = await params;

  if (!token) {
    redirect("/admin/login");
  }

  return (
    <section className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm min-w-sm h-min">
        <CardHeader className="text-center">
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Set your password.
          </CardDescription>
        </CardHeader>
        <ResetPasswordForm token={token} />
      </Card>
    </section>
  );
}
