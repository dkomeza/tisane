import { redirect } from "next/navigation";
import SignupForm from "./components/SignupForm";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AdminSignupPageProps = {
  searchParams: Promise<{ token: string }>;
};

export default async function AdminSignupPage({
  searchParams:params,
}: AdminSignupPageProps) {
  const { token } = await params;
  console.log(await params)
  if (!token) {
    redirect("/");
  }

  return (
    <section className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm min-w-sm h-min">
        <CardHeader className="text-center">
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Set your name and password to activate your account
          </CardDescription>
        </CardHeader>
        <SignupForm token={token} />
      </Card>
    </section>
  );
}
