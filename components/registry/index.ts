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
 * A Block represents an instance of a component in the Zustand store.
 * Each block has a unique ID, a type corresponding to a component in the registry,
 * and data that adheres to the schema defined by that component.
 */
export type Block<T extends ComponentType = ComponentType> = {
  id: string;
  type: string;
  data: z.infer<ComponentRegistry[T]["Schema"]>;
  children?: Block[];
};

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
