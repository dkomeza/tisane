import { COMPONENT_REGISTRY } from "@/components/registry";
import { DBComponent, ReactClientComponent } from "@/components/registry/types";
import { nanoid } from "nanoid";

export function PageContentRenderer({ blocks }: { blocks?: DBComponent[] }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((content, index) => {
        const CMSComponent =
          COMPONENT_REGISTRY[content.type as keyof typeof COMPONENT_REGISTRY];

        if (!CMSComponent) {
          return null;
        }

        const ClientComponent =
          CMSComponent.ClientComponent as ReactClientComponent<
            typeof content.data
          >;

        return (
          <ClientComponent key={index} data={content.data} id={nanoid()} />
        );
      })}
    </>
  );
}
