"use client";
import { useState } from "react";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { signupUser } from "../actions/signup-user";

function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <CardContent>
        <form id="signup-form" action={signupUser}>
          <div className="flex flex-col gap-6">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input id="firstName" placeholder="First Name" required />
              <Input id="surname" placeholder="Surname" required />
            </div>

            <Input
              id="password"
              type="password"
              placeholder="Password"
              required
            />

            <Input
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
