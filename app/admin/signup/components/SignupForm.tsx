"use client";
import { useActionState, useState } from "react";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { signupUser } from "../actions/signup-user";

function SignupForm({ token }: { token: string }) {
  const [state, action, loading] = useActionState(signupUser, { error: "" });

  return (
    <>
      <CardContent>
        <form id="signup-form" action={action}>
          <div className="flex flex-col gap-6">
            {state?.error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {state.error}
              </div>
            )}
            <input name="token" value={token} className="hidden" readOnly />

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="name"
                id="firstName"
                placeholder="First Name"
                required
              />
              <Input
                name="surname"
                id="surname"
                placeholder="Surname"
                required
              />
            </div>

            <Input
              name="password"
              id="password"
              type="password"
              placeholder="Password"
              required
            />

            <Input
              name="passwordConfirm"
              id="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              required
            />
          </div>
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
