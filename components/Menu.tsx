import { getMenuBySlug } from "@/app/actions/menus/get-menu-by-slug";
import {
  COMPONENT_REGISTRY,
  ReactClientComponent,
} from "@/components/registry";
import { cn } from "@/lib/utils";

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
  const Component = COMPONENT_REGISTRY[menu.content.type]
    .ClientComponent as ReactClientComponent<typeof menu.content.data>;

  return (
    <nav className={cn("fixed top-0 left-0 w-full z-50", className)}>
      <Component id={menu.id} data={menu.content.data} />
    </nav>
  );
}
