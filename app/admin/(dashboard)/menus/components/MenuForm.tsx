"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMenuSchema, CreateMenuRequest } from "@/lib/schemas/MenusSchema";
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
import { COMPONENT_REGISTRY, REGISTRY_CATEGORIES } from "@/components/registry";
import {
  DBComponent,
  AdminBlockProps,
  Block,
} from "@/components/registry/types";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { nanoid } from "nanoid";
import { useCMSStore } from "@/components/registry/CMSStore";
import { toast } from "sonner";

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

function ContentForm() {
  const { blocks, addBlock } = useCMSStore();

  return (
    <ScrollArea className="flex-1 flex p-6 h-[500px] border rounded-md">
      <div className="flex-1 flex flex-col gap-4">
        {blocks.map((block) => {
          const component = COMPONENT_REGISTRY[block.type];
          if (!component) return null;

          const AdminComponent = component.AdminComponent as React.FC<
            AdminBlockProps<typeof block.data>
          >;

          return (
            <div
              key={block.id}
              className="bg-secondary/20 rounded-md p-4 flex justify-center-safe"
            >
              <AdminComponent
                id={block.id}
                data={block.data}
                useStore={useCMSStore}
              />
            </div>
          );
        })}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex-1 flex items-center justify-center p-6 border-2 border-dashed border-border/50 rounded-md w-full hover:bg-muted/50 transition-colors"
            >
              <h2 className="flex items-center text-xl gap-2 text-muted-foreground">
                <PlusCircle /> Add Menu Item
              </h2>
            </button>
          </PopoverTrigger>
          <PopoverContent asChild>
            <Card className="w-md overflow-hidden">
              <ScrollArea className="h-96">
                {REGISTRY_CATEGORIES.map((category) => (
                  <div key={category.id} className="mb-4">
                    <h3 className="mb-2 font-semibold px-2">
                      {category.label}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 px-2">
                      {category.componentIds.map((componentId) => {
                        const Preview =
                          COMPONENT_REGISTRY[componentId].PreviewComponent;
                        return (
                          <button
                            key={componentId}
                            className="border border-border/50 rounded-md p-2 hover:bg-muted transition-colors flex flex-col items-center gap-2"
                            onClick={() => {
                              const newBlock: Block = {
                                id: nanoid(8),
                                type: componentId,
                                data: {
                                  ...COMPONENT_REGISTRY[
                                    componentId
                                  ].Schema.parse({}),
                                },
                              };

                              if (!newBlock || !addBlock) return;
                              addBlock(newBlock);
                              toast.success(
                                `Added ${COMPONENT_REGISTRY[componentId].label}`
                              );
                            }}
                          >
                            <div className="pointer-events-none">
                              <Preview />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {COMPONENT_REGISTRY[componentId].label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </ScrollArea>
  );
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
      content: [] as DBComponent[],
      ...defaultValues,
    },
  });

  const { setValue } = form;
  const [slugChanged, setSlugChanged] = useState(!!defaultValues?.slug);

  useEffect(() => {
    if (defaultValues?.content) {
      build(defaultValues.content);
    } else {
      build([]);
    }
  }, [defaultValues, build]);

  useEffect(() => {
    setValue(
      "content",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      blocks.map(({ id, ...rest }) => rest)
    );
  }, [blocks, setValue]);

  return (
    <Card className="flex-1 border-muted/60 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-sm p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-6"
        >
          <div className="grid grid-cols-2 gap-6">
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
