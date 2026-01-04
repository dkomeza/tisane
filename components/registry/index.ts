import { Button } from "./elements/Button";
import z from "zod";

import { Heading } from "./typography/Typography";
import { Hero } from "./layout/Hero";
import { DBComponent, RegistryCategory } from "./types";

export * from "./types";

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
 * The COMPONENT_REGISTRY is a centralized registry of all available CMS components.
 * Each component is defined with its unique ID, label, rendering components, and data schema.
 */
export const COMPONENT_REGISTRY = {
  // Elements
  [Button.id]: Button,

  // Typography
  [Heading.id]: Heading,

  // Layout
  [Hero.id]: Hero,
} as const;

export const REGISTRY_CATEGORIES: RegistryCategory[] = [
  {
    id: "elements",
    label: "Elements",
    componentIds: [Button.id],
  },
  {
    id: "layout",
    label: "Layout",
    componentIds: [Hero.id],
    isRootLevel: true,
  },
];

export type ComponentRegistry = typeof COMPONENT_REGISTRY;
export type ComponentType = keyof ComponentRegistry;

export function preprocess(data: unknown): DBComponent[] {
  if (data == null) {
    return [];
  }

  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return DBComponentsArraySchema.parse(parsed);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error processing page content"
      );
    }
  }

  if (typeof data === "object" && Array.isArray(data)) {
    return DBComponentsArraySchema.parse(data);
  }

  throw new Error("Invalid data format for page content");
}
