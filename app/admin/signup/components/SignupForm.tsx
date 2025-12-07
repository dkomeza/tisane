"use client";
import { useActionState, useState } from "react";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Loader2, EyeClosed, Eye } from "lucide-react";
import { signupUser } from "../actions/signup-user";

function SignupForm({ token }: { token: string }) {
  const [state, action, loading] = useActionState(signupUser, { error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const togglePasswordVisibility = (type: string) => {
    if (type === "password") {
      setShowPassword(!showPassword);
    }
    if (type === "passwordConfirm") {
      setShowPasswordConfirm(!showPasswordConfirm);
    }
  };

  return (
    <>
      <CardContent>
        <form id="signup-form" action={action} className="flex flex-col gap-6">
          {state?.error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {state.error}
            </div>
          )}
          <input name="token" value={token} className="hidden" readOnly />

          <InputGroup>
            <InputGroupInput
              name="name"
              id="firstName"
              placeholder="First Name"
              required
            />
            <InputGroupInput
              name="surname"
              id="surname"
              placeholder="Surname"
              required
            />
          </InputGroup>

          <InputGroup>
            <InputGroupInput
              name="password"
              id="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              required
            />

            <InputGroupButton
              onClick={() => togglePasswordVisibility("password")}
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </InputGroupButton>
          </InputGroup>

          <InputGroup>
            <InputGroupInput
              name="passwordConfirm"
              id="passwordConfirm"
              placeholder="Confirm Password"
              type={showPasswordConfirm ? "text" : "password"}
              required
            />

            <InputGroupButton
              onClick={() => togglePasswordVisibility("passwordConfirm")}
            >
              {showPasswordConfirm ? <Eye /> : <EyeClosed />}
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
