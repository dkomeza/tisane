import { ButtonComponent } from "./elements/Button";
import z from "zod";

import { Hero } from "./sections/Hero";
import { Row } from "@/components/registry/layout/row";
import { Typography } from "@/components/registry/typography/typography";
import { Column } from "@/components/registry/layout/column";
import { ImageComponent } from "@/components/registry/items/image";
import { UnderlinedCard } from "@/components/registry/elements/underlined-card";
// -- PLOP IMPORTS HERE --

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
  [ButtonComponent.id]: ButtonComponent,
  [Hero.id]: Hero,
  [Typography.id]: Typography,
  [Row.id]: Row,
  [Column.id]: Column,
  [ImageComponent.id]: ImageComponent,
  [UnderlinedCard.id]: UnderlinedCard,
  // -- PLOP REGISTRY HERE --
} as const;

export const REGISTRY_CATEGORIES: RegistryCategory[] = [
  {
    id: "elements",
    label: "Elements",
    componentIds: [
      ButtonComponent.id,
      UnderlinedCard.id,
      // -- PLOP ELEMENTS HERE --
    ],
  },
  {
    id: "imageComponent",
    label: "Items",
    componentIds: [
      ImageComponent.id,
      // -- PLOP ITEMS HERE --
    ],
  },
  {
    id: "layout",
    label: "Layout",
    componentIds: [
      Row.id,
      Column.id,
      // -- PLOP LAYOUT HERE --
    ],
    isRootLevel: true,
  },
  {
    id: "sections",
    label: "Sections",
    componentIds: [
      Hero.id,
      // -- PLOP SECTIONS HERE --
    ],
    isRootLevel: true,
  },
  {
    id: "typography",
    label: "Typography",
    componentIds: [
      Typography.id,
      // -- PLOP TYPOGRAPHY HERE --
    ],
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
