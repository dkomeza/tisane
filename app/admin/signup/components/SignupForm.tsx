"use client";
import { useActionState, useState } from "react";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Loader2, EyeClosed, Eye, KeyRound, UserRound } from "lucide-react";
import { signupUser } from "../actions/signup-user";

function SignupForm({ token }: { token: string }) {
  const [state, action, loading] = useActionState(signupUser, { error: "" });
  const [showPassword, setShowPassword] = useState(false);

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

          <div className="grid grid-cols-2 gap-2">
            <InputGroup>
              <InputGroupInput
                name="name"
                id="firstName"
                placeholder="First Name"
                required
              />
              <InputGroupAddon>
                <UserRound />
              </InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <InputGroupInput
                name="surname"
                id="surname"
                placeholder="Surname"
                required
              />
              <InputGroupAddon>
                <UserRound />
              </InputGroupAddon>
            </InputGroup>
          </div>

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
