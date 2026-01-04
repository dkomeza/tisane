import { StoreApi, UseBoundStore } from "zustand";
import z from "zod";
import { ComponentRegistry, ComponentType } from ".";

export type CMSStore = {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  updateBlock: <T extends ComponentType>(
    id: string,
    data: Partial<z.infer<ComponentRegistry[T]["Schema"]>>
  ) => void;
  addBlock?: (block: Block) => void;
  removeBlock?: (id: string) => void;
};

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
 * RegistryCategory defines a category of components in the registry.
 */
export type RegistryCategory = {
  id: string;
  label: string;
  componentIds: ComponentType[];
};

export type ReactClientComponent<T extends Block["data"]> = React.FC<
  BlockProps<T>
>;
export type ReactAdminComponent<T extends Block["data"]> = React.FC<
  AdminBlockProps<T>
>;
