import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Block, CMSStore } from "./types";
import { Draft } from "immer";

const findAndUpdate = (
  node: Draft<Block> | Draft<Block>[],
  targetId: string,
  updateData: Partial<Block["data"]>
): boolean => {
  if (!node || typeof node !== "object") return false;

  if (!Array.isArray(node) && node.id === targetId) {
    if (!node.data) node.data = {};
    Object.assign(node.data, updateData);
    return true;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      if (findAndUpdate(item, targetId, updateData)) return true;
    }
  } else {
    for (const key in node.data) {
      const property = node.data[key as keyof typeof node.data];

      if (typeof property === "object" && property["id"] !== undefined) {
        if (findAndUpdate(property, targetId, updateData)) return true;
      }
    }
  }

  return false;
};

export const useCMSStore = create<CMSStore>()(
  immer((set, get) => ({
    blocks: [] as Block[],

    setBlocks: (blocks) =>
      set((state) => {
        state.blocks = blocks;
      }),

    updateBlock: (id, data) =>
      set((state) => {
        findAndUpdate(state.blocks, id, data);
      }),

    removeBlock: (id) =>
      set((state) => {
        const findAndRemove = (current: Block | Block[]): boolean => {
          if (!current || typeof current !== "object") return false;

          if (Array.isArray(current)) {
            const index = current.findIndex((item) => item.id === id);
            if (index !== -1) {
              current.splice(index, 1);
              return true;
            }
            for (const item of current) {
              if (findAndRemove(item)) return true;
            }
          } else {
            for (const key in current.data) {
              const property = current.data[key as keyof typeof current.data];
              if (property && property["id"] === id) {
                delete current.data[key as keyof typeof current.data];
                return true;
              }
              if (findAndRemove(property)) return true;
            }
          }
          return false;
        };

        findAndRemove(state.blocks);
      }),

    addBlock: (block, parentId, propertyName = "children") =>
      set((state) => {
        if (!parentId) {
          state.blocks.push(block);
          return;
        }

        const findAndAdd = (node: Draft<Block>): boolean => {
          if (!node || typeof node !== "object") return false;

          if (node.id === parentId) {
            const key = propertyName as keyof typeof node.data;
            if (Array.isArray(node.data[key])) {
              // @ts-expect-error We can't be sure of the type here
              node.data[key].push(block);
            } else {
              // @ts-expect-error We can't be sure of the type here
              node.data[key] = block;
            }
            return true;
          }

          // Recurse
          for (const key in node.data) {
            const property = node.data[key as keyof typeof node.data];
            if (typeof property === "object") {
              if (findAndAdd(property)) return true;
            }
          }
          return false;
        };

        for (const stateBlock of state.blocks)
          if (findAndAdd(stateBlock)) break;
      }),

    getBlock: (id) => {
      const state = get();

      const findBlock = (
        node: Block | Block[],
        targetId: string
      ): Block | null => {
        if (!node || typeof node !== "object") return null;

        if (Array.isArray(node)) {
          for (const item of node) {
            const result = findBlock(item, targetId);
            if (result) return result;
          }
        } else {
          if (node.id === targetId) {
            return node;
          }

          for (const key in node.data) {
            const property = node.data[key as keyof typeof node.data];
            if (typeof property === "object") {
              const result = findBlock(property, targetId);
              if (result) return result;
            }
          }
        }

        return null;
      };

      return findBlock(state.blocks, id);
    },
  }))
);
