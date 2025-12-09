"use client";
import { authClient } from "@/lib/auth/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Loader2, EyeClosed, Eye, KeyRound } from "lucide-react";

function ResetPasswordForm({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const action = async (formData: FormData) => {
    setLoading(true);
    setError("");
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      if (error) {
        throw new Error(error.message);
      }

      router.push("/admin/login");
    } catch (e) {
      setError(
        "Failed to change password. Please try again. " +
          (e instanceof Error ? e.message : "")
      );
      setLoading(false);
    }
  };

  return (
    <>
      <CardContent>
        <form id="signup-form" action={action} className="flex flex-col gap-6">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <input name="token" value={token} className="hidden" readOnly />

          <InputGroup>
            <InputGroupInput
              name="password"
              id="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              required
            />
            <InputGroupAddon>
              <KeyRound />
            </InputGroupAddon>
            <InputGroupButton
              type="button"
              onClick={() => setShowPassword((showPassword) => !showPassword)}
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </InputGroupButton>
          </InputGroup>

          <InputGroup>
            <InputGroupInput
              name="passwordConfirm"
              id="passwordConfirm"
              placeholder="Confirm Password"
              type={showPassword ? "text" : "password"}
              required
            />
            <InputGroupAddon>
              <KeyRound />
            </InputGroupAddon>
            <InputGroupButton
              type="button"
              onClick={() => setShowPassword((showPassword) => !showPassword)}
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </InputGroupButton>
          </InputGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          form="signup-form"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </CardFooter>
    </>
  );
}

export default ResetPasswordForm;
