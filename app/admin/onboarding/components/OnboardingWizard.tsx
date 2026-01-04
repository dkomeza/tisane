"use client";

import { useActionState, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Loader2,
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
  Mail,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { completeOnboarding } from "../actions/complete-onboarding";
import {
  OnboardingRequest,
  OnboardingSchema,
} from "@/lib/schemas/OnboardingSchema";
import { UserData } from "../../(auth)/signup/components/SignupForm";

export default function OnboardingWizard() {
  const [state, action, loading] = useActionState(completeOnboarding, {
    error: "",
  });
  const [activeTab, setActiveTab] = useState("account");

  const form = useForm<OnboardingRequest>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: "d",
      surname: "a",
      email: "d@k.com",
      password: "zaq1@WSX",
      passwordConfirm: "zaq1@WSX",
      siteUrl: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    form.setValue("siteUrl", new URL(window.location.href).origin);
  }, [form]);

  const nextStep = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const fieldsToValidate: (keyof OnboardingRequest)[] = [
      "name",
      "surname",
      "email",
      "password",
      "passwordConfirm",
    ];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setActiveTab("settings");
    }
  };

  const prevStep = () => {
    setActiveTab("account");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome to Tisane</CardTitle>
        <CardDescription>
          {activeTab === "account"
            ? "Let's create your admin account"
            : "Configure your site settings"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="onboarding-form"
          action={action}
          className="flex flex-col gap-4"
        >
          {state?.error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {state.error}
            </div>
          )}

          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="account" disabled>
                Account
              </TabsTrigger>
              <TabsTrigger value="settings" disabled>
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="flex flex-col gap-4">
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel htmlFor="email" className="text-xs pl-1">
                        Email
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="email"
                          placeholder="Email"
                          type="email"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon>
                          <Mail />
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              {/* @ts-expect-error - UserData form type mismatch needs a cleaner fix but functional for now */}
              <UserData form={form} />
            </TabsContent>

            <TabsContent value="settings">
              <Controller
                name="siteUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="siteUrl" className="text-xs pl-1">
                      Site URL
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="siteUrl"
                        placeholder="https://example.com"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon>
                        <Globe />
                      </InputGroupAddon>
                    </InputGroup>
                    <p className="text-xs text-muted-foreground mt-1">
                      Used for generating absolute URLs (e.g. for SEO and
                      emails).
                    </p>
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              {/* Hidden inputs to pass data to server action from Step 1 */}
              <input type="hidden" name="name" value={form.getValues("name")} />
              <input
                type="hidden"
                name="surname"
                value={form.getValues("surname")}
              />
              <input
                type="hidden"
                name="email"
                value={form.getValues("email")}
              />
              <input
                type="hidden"
                name="password"
                value={form.getValues("password")}
              />
              <input
                type="hidden"
                name="passwordConfirm"
                value={form.getValues("passwordConfirm")}
              />
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {activeTab === "account" ? (
          <Button type="button" variant="ghost" disabled>
            Back
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={loading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}

        {activeTab === "account" ? (
          <Button type="button" onClick={nextStep}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" form="onboarding-form" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Complete Setup
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
