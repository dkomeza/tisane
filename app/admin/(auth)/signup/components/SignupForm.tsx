"use client";
import { useActionState, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, EyeClosed, Eye, KeyRound, UserRound } from "lucide-react";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
  InputGroupAddon,
} from "@/components/ui/input-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { signupUser } from "../actions/signup-user";
import { SignupRequest, SignupSchema } from "@/lib/schemas/SignupSchema";
import PasswordChecklist from "./PasswordChecklist";

function SignupForm({ token }: { token: string }) {
  const [state, action, loading] = useActionState(signupUser, { error: "" });
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupRequest>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      surname: "",
      password: "",
      passwordConfirm: "",
      token: token,
    },
    mode: "onTouched", // Validates as user interacts
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = form.watch("password");

  return (
    <>
      <CardContent>
        <form id="signup-form" action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {state.error}
            </div>
          )}
          <input name="token" value={token} className="hidden" readOnly />

          <FieldGroup className="grid grid-cols-2 gap-3">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel
                    htmlFor="form-signup-name"
                    className="text-xs pl-1 w-max! font-light"
                  >
                    Name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-signup-name"
                      placeholder="Name"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    <InputGroupAddon>
                      <UserRound />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="surname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel
                    htmlFor="form-signup-surname"
                    className="text-xs pl-1 w-max! font-light"
                  >
                    Surname
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-signup-surname"
                      placeholder="Surname"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    <InputGroupAddon>
                      <UserRound />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

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
              Creating account...
            </>
          ) : (
            "Activate Account"
          )}
        </Button>
      </CardFooter>
    </>
  );
}

export default SignupForm;
