import z from "zod";
import { ComponentRegistry, ComponentType } from ".";

export type Block<T extends ComponentType = ComponentType> = {
  id: string;
  type: string;
  data: z.infer<ComponentRegistry[T]["Schema"]>;
  children?: Block[];
};

export type CMSStore = {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  updateBlock: <T extends ComponentType>(
    id: string,
    data: Partial<z.infer<ComponentRegistry[T]["Schema"]>>
  ) => void;
};
