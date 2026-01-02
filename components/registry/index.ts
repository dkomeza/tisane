import { StoreApi, UseBoundStore } from "zustand";
import { Button } from "./elements/Button";
import z from "zod";
import { CMSStore } from "./store";
import { Heading } from "./typography/Heading";

type ZustandStore = UseBoundStore<StoreApi<CMSStore>>;

export type BlockProps<P> = {
  id: string;
  data: P;
};

export type AdminBlockProps<P> = BlockProps<P> & {
  useStore: ZustandStore;
};

/**
 * A CMSComponent defines the structure of a component in the registry.
 * It includes the component's unique ID, label, client-side rendering component,
 * admin editing component, preview component, and the schema for its data.
 */
export type CMSComponent<Id extends string, Props> = {
  readonly id: Id;
  readonly label: string;

  ClientComponent: React.FC<BlockProps<Props>>;
  AdminComponent: React.FC<AdminBlockProps<Props>>;
  PreviewComponent: React.FC;

  Schema: z.ZodType<Props>;
};

/**
 * A DBComponent represents an instance of a component stored in the database.
 * It includes the component's type (ID), data adhering to the component's schema,
 * and optionally an array of child components for nested structures.
 */
export interface DBComponent<T extends ComponentType = ComponentType> {
  type: T;
  data: z.infer<ComponentRegistry[T]["Schema"]>;
  children?: DBComponent[];
}

/**
 * The DBComponentSchema is a recursive Zod schema that validates
 * DBComponent structures, including nested children.
 */
export const DBComponentSchema: z.ZodType<DBComponent> = z.lazy(() => {
  const options = Object.entries(COMPONENT_REGISTRY).map(([key, value]) => {
    return z.object({
      type: z.literal(key),
      data: value.Schema,
      children: z.array(DBComponentSchema).optional(),
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return z.discriminatedUnion("type", options as any);
});

export const DBComponentsArraySchema = z.array(DBComponentSchema);

/**
 * A Block represents an instance of a component in the Zustand store.
 * Each block has a unique ID, a type corresponding to a component in the registry,
 * and data that adheres to the schema defined by that component.
 */
export interface Block<
  T extends ComponentType = ComponentType,
> extends DBComponent<T> {
  id: string;
  children?: Block[];
}

/**
 * The COMPONENT_REGISTRY is a centralized registry of all available CMS components.
 * Each component is defined with its unique ID, label, rendering components, and data schema.
 */
export const COMPONENT_REGISTRY = {
  // Elements
  [Button.id]: Button,

  // Typography
  [Heading.id]: Heading,
} as const;

export type ComponentRegistry = typeof COMPONENT_REGISTRY;
export type ComponentType = keyof ComponentRegistry;
