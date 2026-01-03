"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePageSchema,
  CreatePageRequest,
  PageStatus,
} from "@/lib/schemas/PagesSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DBComponent } from "@/components/registry";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

function MatadataForm({
  form,
}: {
  form: ReturnType<typeof useForm<CreatePageRequest>>;
}) {
  const { setValue } = form;

  const [slugChanged, setSlugChanged] = useState(false);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Page Title"
                {...field}
                onChange={(e) => {
                  if (!slugChanged) {
                    setValue("slug", slugify(e.currentTarget.value));
                  }
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input
                placeholder="page-slug"
                {...field}
                onChange={(e) => {
                  setSlugChanged(true);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormDescription>
              The URL-friendly name of the page.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(PageStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-6 pt-4 border-t">
        <h3 className="text-lg font-medium">SEO</h3>
        <FormField
          control={form.control}
          name="seo_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Meta Title"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seo_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Meta Description"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function PageForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues?: Partial<CreatePageRequest>;
  onSubmit: (data: CreatePageRequest) => void;
  isSubmitting?: boolean;
}) {
  const form = useForm<CreatePageRequest>({
    resolver: zodResolver(CreatePageSchema) as Resolver<CreatePageRequest>,
    defaultValues: {
      title: "",
      slug: "",
      status: "draft",
      seo_title: "",
      seo_description: "",
      content: [] as DBComponent[],
      ...defaultValues,
    },
  });

  return (
    <Tabs defaultValue="metadata">
      <Card className="flex-1 border-muted/60 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-sm p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border-b border-border/50 bg-muted/20 py-3 px-6 flex items-center justify-between">
              <TabsList className="flex p-1 bg-muted rounded-lg w-fit">
                <TabsTrigger
                  value="metadata"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    "data-[state=active]:bg-background! [data-state=active]:shadow-sm! data-[state=active]:text-primary!",
                    "data-[state=inactive]:text-muted-foreground! data-[state=inactive]:hover:text-foreground!"
                  )}
                >
                  Metadata
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    "data-[state=active]:bg-background! [data-state=active]:shadow-sm! data-[state=active]:text-primary!",
                    "data-[state=inactive]:text-muted-foreground! data-[state=inactive]:hover:text-foreground!"
                  )}
                >
                  Content
                </TabsTrigger>
              </TabsList>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Page"}
              </Button>
            </div>
            <div className="p-6">
              <TabsContent value="metadata">
                <MatadataForm form={form} />
              </TabsContent>
            </div>
          </form>
        </Form>
      </Card>
    </Tabs>
  );
}
