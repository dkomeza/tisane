import { StoreApi, UseBoundStore } from "zustand";
import { Button } from "./elements/Button";
import z from "zod";
import { CMSStore } from "./store";

type ZustandStore = UseBoundStore<StoreApi<CMSStore>>;

export type BlockProps<P> = {
  id: string;
  data: P;
};

export type AdminBlockProps<P> = BlockProps<P> & {
  useStore: ZustandStore;
};

export type CMSComponent<Id extends string, Props> = {
  readonly id: Id;
  readonly label: string;

  ClientComponent: React.FC<BlockProps<Props>>;
  AdminComponent: React.FC<AdminBlockProps<Props>>;
  PreviewComponent: React.FC;

  Schema: z.ZodType<Props>;
};

export const COMPONENT_REGISTRY = {
  [Button.id]: Button,
} as const;

export type ComponentRegistry = typeof COMPONENT_REGISTRY;
export type ComponentType = keyof ComponentRegistry;
