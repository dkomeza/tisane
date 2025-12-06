import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import SignupForm from "./components/SignupForm";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AdminSignupPageProps = {
  params: Promise<{ token: string }>;
};

export default async function AdminSignupPage({
  params,
}: AdminSignupPageProps) {
  const { token } = await params;

  // const handleSignup = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   if (!token) {
  //     setError("Invalid or missing signup link.");
  //     setLoading(false);
  //     return;
  //   }

  //   const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

  //   if (password.length < 8) {
  //     setError("Password must be at least 8 characters long.");
  //     setLoading(false);
  //     return;
  //   }

  //   if (!strongRegex.test(password)) {
  //     setError("Password must contain upper/lowercase letters and numbers.");
  //     setLoading(false);
  //     return;
  //   }

  //   if (password !== passwordConfirm) {
  //     setError("Passwords do not match.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const resetResponse = await authClient.resetPassword({
  //       newPassword: password,
  //       token,
  //     });

  //     if (resetResponse.error) {
  //       setError(resetResponse.error.message || "Failed to set password");
  //       setLoading(false);
  //       return;
  //     }

  //     const updateResponse = await authClient.updateUser({
  //       name: `${firstName} ${surname}`,
  //     });

  //     if (updateResponse.error) {
  //       setError(updateResponse.error.message || "Failed to update profile");
  //       setLoading(false);
  //       return;
  //     }

  //     redirect("/admin/login");
  //   } catch (err) {
  //     setError(
  //       err instanceof Error ? err.message : "An unexpected error occurred"
  //     );
  //     setLoading(false);
  //   }
  // };

  return (
    <section className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm min-w-sm h-min">
        <CardHeader className="text-center">
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Set your name and password to activate your account
          </CardDescription>
        </CardHeader>
        <SignupForm />
      </Card>
    </section>
  );
}
