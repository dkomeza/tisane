import {
  AdminBlockProps,
  Block,
  CMSStore,
  ComponentType,
} from "@/components/registry";
import { BorderedContainerProps } from ".";
import { Heading } from "@/components/registry/typography/heading";
import { Typography } from "@/components/registry/typography/typography";
import { ButtonComponent } from "@/components/registry/elements/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
export function BorderedContainerAdmin({
  id,
  useStore,
}: AdminBlockProps<BorderedContainerProps>) {
  const store = useStore();
  const { getBlock, removeBlock } = store;
  const block = getBlock(id) as Block<"bordered-container">;

  if (!block) return null;

  return (
    <Card className="flex flex-col gap-4 p-4 relative group">
      <Button
        variant="destructive"
        type="button"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeBlock(id)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
      <Tabs defaultValue="heading" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-dark-200">
          <TabsTrigger value="heading">Heading</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="button">Button</TabsTrigger>
        </TabsList>

        <TabsContent value="heading" className="space-y-4 pt-4">
          <div className="p-4 border border-brand-white/10 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-brand-gray-100">
              Heading Settings
            </h3>
            <Heading.AdminComponent
              id={(block.data.heading as Block).id}
              data={block.data.heading.data}
              useStore={useStore}
            />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="p-4 border border-brand-white/10 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-brand-gray-100">
              Content Body
            </h3>
            <Typography.AdminComponent
              id={(block.data.typography as Block).id}
              data={block.data.typography.data}
              useStore={useStore}
            />
          </div>
        </TabsContent>

        <TabsContent value="button" className="space-y-4 pt-4">
          <div className="p-4 border border-brand-white/10 rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-brand-gray-100">
              Action Button
            </h3>
            <ButtonComponent.AdminComponent
              id={(block.data.button as Block).id}
              data={block.data.button.data}
              useStore={useStore}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
