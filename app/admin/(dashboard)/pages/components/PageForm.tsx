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
import { useEffect, useState } from "react";
import { COMPONENT_REGISTRY, REGISTRY_CATEGORIES } from "@/components/registry";
import {
  DBComponent,
  AdminBlockProps,
  Block,
} from "@/components/registry/types";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { nanoid } from "nanoid";
import { usePreviewBroadcaster } from "@/hooks/use-preview-sync";
import { ContentPreview } from "./ContentPreview";
import { useCMSStore } from "@/components/registry/CMSStore";

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

function ContentForm() {
  const { blocks, addBlock } = useCMSStore();

  return (
    <ScrollArea className="flex-1 flex p-6">
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
              className="flex-1 flex items-center justify-center p-6 border-2 border-dashed border-border/50 rounded-md w-full"
            >
              <h2 className="flex items-center text-xl gap-2">
                <PlusCircle /> Add new component
              </h2>
            </button>
          </PopoverTrigger>
          <PopoverContent asChild>
            <Card className="w-md">
              <ScrollArea className="max-h-96">
                {Object.values(REGISTRY_CATEGORIES)
                  .filter((category) => category.isRootLevel)
                  .map((category) => (
                    <div key={category.id} className="mb-4">
                      <h3 className="mb-2">{category.label}</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {category.componentIds.map((componentId) => {
                          const Preview =
                            COMPONENT_REGISTRY[componentId].PreviewComponent;
                          return (
                            <button
                              key={componentId}
                              className="border border-border/50 rounded-md p-2"
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
                              }}
                            >
                              <Preview />
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

export function PageForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues?: Partial<CreatePageRequest>;
  onSubmit: (data: CreatePageRequest) => void;
  isSubmitting?: boolean;
}) {
  const { blocks, setBlocks, build } = useCMSStore();
  const { broadcast } = usePreviewBroadcaster(defaultValues?.slug);
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

  useEffect(() => {
    if (defaultValues?.content) {
      build(defaultValues.content);
    }
  }, [defaultValues, build]);

  useEffect(() => {
    form.setValue(
      "content",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      blocks.map(({ id, ...rest }) => rest)
    );
    broadcast(form.getValues("content") || []);
  }, [blocks, form, broadcast]);

  const TABS = ["metadata", "content", "preview"] as const;
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("metadata");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => {
        setActiveTab(val as (typeof TABS)[number]);

        if (val === "preview") {
          setTimeout(() => {
            broadcast(form.getValues("content") || []);
          }, 100);
        }
      }}
      className="flex-1 overflow-hidden"
    >
      <Card className="flex-1 border-muted/60 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-sm p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="border-b border-border/50 bg-muted/20 py-3 px-6 flex items-center justify-between">
              <TabsList className="flex p-1 bg-muted rounded-lg w-fit">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize",
                      "data-[state=active]:bg-background! [data-state=active]:shadow-sm! data-[state=active]:text-primary!",
                      "data-[state=inactive]:text-muted-foreground! data-[state=inactive]:hover:text-foreground!"
                    )}
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Page"}
              </Button>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <TabsContent value="metadata" className="p-6">
                <MatadataForm form={form} />
              </TabsContent>
              <TabsContent
                value="content"
                className="flex flex-1  overflow-hidden"
              >
                <ContentForm />
              </TabsContent>
              <div
                className={cn(
                  "p-6 flex-1 outline-none overflow-hidden",
                  activeTab === "preview" ? "flex" : "hidden"
                )}
              >
                <ContentPreview slug={defaultValues?.slug} />
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </Tabs>
  );
}
