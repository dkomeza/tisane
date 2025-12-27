"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pageSchema, PageFormValues } from "@/lib/schemas/EditCreateSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function PageForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<PageFormValues>;
  onSubmit: (data: PageFormValues) => void;
}) {
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      status: "draft",
      ...defaultValues,
    },
  });

  const { register, handleSubmit, watch } = form;

  const title = watch("title");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input placeholder="Title" {...register("title")} />

      <Input
        placeholder="Slug"
        {...register("slug")}
        onBlur={(e) => {
          if (!e.target.value && title) {
            form.setValue("slug", title.toLowerCase().replace(/\s+/g, "-"));
          }
        }}
      />

      <select {...register("status")} className="border rounded p-2">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <Input placeholder="SEO Title" {...register("seoTitle")} />
      <Textarea placeholder="SEO Description" {...register("seoDescription")} />

      <Textarea
        placeholder="DEBUG Content JSON"
        rows={8}
        {...register("content")}
      />

      <Button type="submit">Save</Button>
    </form>
  );
}
