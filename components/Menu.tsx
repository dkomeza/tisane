import { getMenuBySlug } from "@/app/actions/menus/get-menu-by-slug";
import {
  COMPONENT_REGISTRY,
  ReactClientComponent,
} from "@/components/registry";
import { BlockProps } from "@/components/registry";

export async function Menu({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const res = await getMenuBySlug(slug);

  if (!res.success || !res.data) {
    console.error(`Menu with slug "${slug}" not found or failed to load.`);
    return null;
  }

  const { menu } = res.data;

  return (
    <nav className={className}>
      <ul className="flex gap-4 items-center">
        {menu.content.map((block, i) => {
          const ComponentConfig = COMPONENT_REGISTRY[block.type];
          if (!ComponentConfig) return null;

          const Component =
            ComponentConfig.ClientComponent as ReactClientComponent<
              typeof block.data
            >;

          return (
            <li key={i}>
              <Component id={`menu-${i}`} data={block.data} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
