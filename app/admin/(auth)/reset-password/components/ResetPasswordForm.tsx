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
import { Controller, useForm } from "react-hook-form";
import {
  ResetPasswordRequest,
  ResetPasswordSchema,
} from "@/lib/schemas/SignupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import PasswordChecklist from "@/app/admin/(auth)/signup/components/PasswordChecklist";

function ResetPasswordForm({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
      token: token,
    },
    mode: "onTouched",
  });
  const passwordValue = form.watch("password");

  const router = useRouter();

  const action = async (data: ResetPasswordRequest) => {
    setLoading(true);
    setError("");

    const { password, passwordConfirm } = data;

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
        <form
          id="signup-form"
          onSubmit={form.handleSubmit(action)}
          className="flex flex-col gap-6"
        >
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <input name="token" value={token} className="hidden" readOnly />

          <FieldGroup className="gap-4">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel
                    htmlFor="signup-form-password"
                    className="text-xs pl-1 w-max! font-light"
                  >
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="signup-form-password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    <InputGroupAddon>
                      <KeyRound />
                    </InputGroupAddon>
                    <InputGroupButton
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye /> : <EyeClosed />}
                    </InputGroupButton>
                  </InputGroup>

                  <PasswordChecklist password={passwordValue} />
                </Field>
              )}
            />

            <Controller
              name="passwordConfirm"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel
                    htmlFor="signup-form-password-confirm"
                    className="text-xs pl-1 w-max! font-light"
                  >
                    Confirm Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="signup-form-password-confirm"
                      placeholder="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    <InputGroupAddon>
                      <KeyRound />
                    </InputGroupAddon>
                    <InputGroupButton
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye /> : <EyeClosed />}
                    </InputGroupButton>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
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
