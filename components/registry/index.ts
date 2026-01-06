import { ButtonComponent } from "./elements/Button";
import z from "zod";

import { Heading } from "./typography/Typography";
import { Hero } from "./sections/Hero";
import { FlexContainer } from "./layout/FlexContainer";
// -- PLOP IMPORTS HERE --

import { Block, CMSComponent, DBComponent, RegistryCategory } from "./types";
export * from "./types";

/**
 * Utility function to create a CMS component configuration.
 * @param config - The configuration object for the CMS component.
 * @returns The correctly typed CMS component configuration.
 */
export function CreateComponent<T extends string, D>(
  config: CMSComponent<T, D>
) {
  return config;
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
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return z.discriminatedUnion("type", options as any);
});

export const DBComponentsArraySchema = z.array(DBComponentSchema);

export const BlockSchema: z.ZodType<Block> = z.lazy(() => {
  const options = Object.entries(COMPONENT_REGISTRY).map(([key, value]) =>
    z.object({
      id: z.string(),
      type: z.literal(key),
      data: value.Schema,
      children: z.array(BlockSchema).optional(),
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return z.discriminatedUnion("type", options as any);
});

export const BlocksArraySchema = z.array(BlockSchema);

/**
 * The COMPONENT_REGISTRY is a centralized registry of all available CMS components.
 * Each component is defined with its unique ID, label, rendering components, and data schema.
 */
export const COMPONENT_REGISTRY = {
  [ButtonComponent.id]: ButtonComponent,
  [Heading.id]: Heading,
  [FlexContainer.id]: FlexContainer,
  [Hero.id]: Hero,
  // -- PLOP REGISTRY HERE --
} as const;

export const REGISTRY_CATEGORIES: RegistryCategory[] = [
  {
    id: "elements",
    label: "Elements",
    componentIds: [ButtonComponent.id],
  },
  {
    id: "layout",
    label: "Layout",
    componentIds: [Hero.id],
    isRootLevel: true,
  },
  {
    id: "sections",
    label: "Sections",
    componentIds: [FlexContainer.id],
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
