import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Block, CMSStore } from "./types";
import { nanoid } from "nanoid";

/**
 * Type guard to safely identify a component node (DBComponent or Block).
 * A valid component node must have a `type` string and a `data` object.
 * This prevents treating generic configurations or styles as components.
 */
export const isValidComponentNode = (node: unknown): node is Block => {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    return false;
  }
  const n = node as Record<string, unknown>;
  return (
    typeof n.type === "string" &&
    typeof n.data === "object" &&
    n.data !== null &&
    !Array.isArray(n.data)
  );
};

/**
 * Robust tree traversal function that safely finds all component blocks.
 * It recurses into generic wrapper objects and arrays, but only triggers
 * the callback for actual component nodes.
 */
const visitBlocks = (
  node: unknown,
  callback: (block: Block, parent: unknown, keyInParent: string | number | null) => boolean | void,
  parent: unknown = null,
  keyInParent: string | number | null = null
): boolean => {
  if (!node || typeof node !== "object") return false;

  // Handle arrays
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      if (visitBlocks(node[i], callback, node, i)) return true;
    }
    return false;
  }

  // Handle actual component nodes
  if (isValidComponentNode(node)) {
    // 1. Trigger callback for this block
    if (callback(node, parent, keyInParent)) return true;

    // 2. Only traverse inside `data` for nested blocks, avoiding root properties like `id` or `type`
    const dataObj = node.data as Record<string, unknown>;
    for (const key in dataObj) {
      if (visitBlocks(dataObj[key], callback, dataObj, key)) {
        return true;
      }
    }
    return false;
  }

  // Handle generic wrapper objects (like the user asked about)
  // Recursively search inside their properties for nested blocks
  const genericObj = node as Record<string, unknown>;
  for (const key in genericObj) {
    if (visitBlocks(genericObj[key], callback, genericObj, key)) return true;
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

    build: (dbBlocks) =>
      set((state) => {
        const writableBlocks = structuredClone(dbBlocks) as Block[];

        visitBlocks(writableBlocks, (node) => {
          if (!node.id) {
            node.id = nanoid(12);
          }
        });

        state.blocks = writableBlocks;
      }),

    updateBlock: (id, data) =>
      set((state) => {
        visitBlocks(state.blocks, (node) => {
          if (node.id === id) {
            if (!node.data) (node as unknown as Record<string, unknown>).data = {};
            Object.assign(node.data, data);
            return true; // Stop searching
          }
        });
      }),

    removeBlock: (id) =>
      set((state) => {
        visitBlocks(state.blocks, (node, parent, keyInParent) => {
          if (node.id === id) {
            if (Array.isArray(parent) && typeof keyInParent === "number") {
              parent.splice(keyInParent, 1);
            } else if (parent && keyInParent !== null && typeof keyInParent === "string") {
              delete (parent as Record<string, unknown>)[keyInParent];
            }
            return true; // Stop searching
          }
        });
      }),

    addBlock: (block, parentId, propertyName = "children") =>
      set((state) => {
        if (!parentId) {
          state.blocks.push(block);
          return;
        }

        let added = false;
        added = visitBlocks(state.blocks, (node) => {
          if (node.id === parentId) {
            const dataObj = node.data as Record<string, unknown>;
            if (Array.isArray(dataObj[propertyName])) {
              (dataObj[propertyName] as unknown[]).push(block);
            } else {
              dataObj[propertyName] = block;
            }
            return true;
          }
        });

        if (!added) {
          console.warn("Failed to add block:", block);
        }
      }),

    insertBlock: (block, index, parentId, propertyName = "children") =>
      set((state) => {
        if (!parentId) {
          state.blocks.splice(index, 0, block);
          return;
        }

        let inserted = false;
        inserted = visitBlocks(state.blocks, (node) => {
          if (node.id === parentId) {
            const dataObj = node.data as Record<string, unknown>;
            if (Array.isArray(dataObj[propertyName])) {
              (dataObj[propertyName] as unknown[]).splice(index, 0, block);
            } else {
              dataObj[propertyName] = block;
            }
            return true;
          }
        });

        if (!inserted) {
          console.warn("Failed to insert block:", block);
        }
      }),

    moveBlock: (parentId, fromKey, toKey, itemId, overId) =>
      set((state) => {
        let parentBlock: Block | null = null;
        visitBlocks(state.blocks, (node) => {
          if (node.id === parentId) {
            parentBlock = node;
            return true;
          }
        });

        if (!parentBlock) return;

        const pBlock = parentBlock as unknown as Record<string, unknown>;
        const dataObj = pBlock.data as Record<string, unknown>;
        const sourceList = dataObj[fromKey];
        const destList = dataObj[toKey];

        if (!Array.isArray(sourceList) || !Array.isArray(destList)) return;

        const oldIndex = sourceList.findIndex((item: Block) => item?.id === itemId);
        if (oldIndex === -1) return;

        // Extract the item
        const [extractedItem] = sourceList.splice(oldIndex, 1);

        // Find the insertion point in the destination list
        const newIndex = overId
          ? destList.findIndex((item: Block) => item?.id === overId)
          : destList.length;

        if (newIndex !== -1) {
          destList.splice(newIndex, 0, extractedItem);
        } else {
          destList.push(extractedItem);
        }
      }),

    getBlock: (id) => {
      let found: Block | null = null;
      visitBlocks(get().blocks, (node) => {
        if (node.id === id) {
          found = node;
          return true; // Stop searching
        }
      });
      return found;
    },
  }))
);
