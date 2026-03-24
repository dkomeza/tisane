"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateMenuSchema,
  CreateMenuRequest,
} from "@/lib/schemas/MenusSchema";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";
import { COMPONENT_REGISTRY } from "@/components/registry";
import { ReactAdminComponent } from "@/components/registry/types";
import { Card } from "@/components/ui/card";
import { useCMSStore } from "@/components/registry/CMSStore";

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

function ContentForm() {
  const { blocks } = useCMSStore();

  if (blocks.length === 0) {
    return <div></div>;
  }

  const block = blocks[0];

  const Component = COMPONENT_REGISTRY[block.type]
    .AdminComponent as ReactAdminComponent<typeof block.data>;

  return <Component useStore={useCMSStore} id={block.id} data={block.data} />;
}

export function MenuForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues?: Partial<CreateMenuRequest>;
  onSubmit: (data: CreateMenuRequest) => void;
  isSubmitting?: boolean;
}) {
  const { blocks, build } = useCMSStore();

  const form = useForm<CreateMenuRequest>({
    resolver: zodResolver(CreateMenuSchema) as Resolver<CreateMenuRequest>,
    defaultValues: {
      title: "",
      slug: "",
      content: undefined,
      ...defaultValues,
    },
  });

  const { setValue } = form;
  const [slugChanged, setSlugChanged] = useState(!!defaultValues?.slug);

  useEffect(() => {
    if (defaultValues?.content) {
      build([defaultValues.content]);
    } else {
      build([
        {
          type: "menu",
          data: COMPONENT_REGISTRY["menu"].Schema.parse({}),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.slug, build]);

  useEffect(() => {
    if (blocks.length === 0) return;
    const menu = blocks[0];

    setValue("content", menu);
  }, [blocks, setValue]);

  return (
    <Card className="flex-1 border-muted/60 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-sm p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.error("Form errors:", errors),
          )}
          className="flex flex-1 flex-col gap-6"
        >
          <div className="grid grid-cols-2 gap-6 items-start">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Main Menu"
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
                      placeholder="main-menu"
                      {...field}
                      onChange={(e) => {
                        setSlugChanged(true);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Unique identifier for fetching this menu.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-medium mb-4">Menu Items</h3>
            <ContentForm />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Menu"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
