import z from "zod";
import { Block, ComponentRegistry, ComponentType } from ".";

export type CMSStore = {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  updateBlock: <T extends ComponentType>(
    id: string,
    data: Partial<z.infer<ComponentRegistry[T]["Schema"]>>
  ) => void;
};
