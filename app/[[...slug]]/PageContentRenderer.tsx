import { COMPONENT_REGISTRY } from "@/components/registry";
import { Block, ReactClientComponent } from "@/components/registry/types";

export function PageContentRenderer({ blocks }: { blocks?: Block[] }) {
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
          <ClientComponent key={index} data={content.data} id={content.id} />
        );
      })}
    </>
  );
}
