import { ButtonComponent } from "./elements/button";
import z from "zod";

import { Hero } from "./sections/Hero";
import { Row } from "@/components/registry/layout/row";
import { Typography } from "@/components/registry/typography/typography";
import { Column } from "@/components/registry/layout/column";
import { ImageComponent } from "@/components/registry/items/image";
import { UnderlinedCard } from "@/components/registry/elements/underlined-card";
import { Heading } from "@/components/registry/typography/heading";
import { Paragraph } from "@/components/registry/typography/paragraph";
import { Span } from "@/components/registry/typography/span";
import { BulletList } from "@/components/registry/typography/bullet-list";
import { OrderedList } from "@/components/registry/typography/ordered-list";
import { ListItem } from "@/components/registry/typography/list-item";
import { Icon } from "@/components/registry/items/icon";
import { Agenda } from "@/components/registry/sections/agenda";
import { BorderedContainer } from "@/components/registry/sections/bordered-container";
import { CmsLink } from "@/components/registry/elements/cms-link";
import { Menu } from "@/components/registry/layout/menu";
import { Container } from "@/components/registry/layout/container";
import { Grid } from "@/components/registry/layout/grid";
import { GridItem } from "@/components/registry/layout/grid-item";
import { UnderlinedTable } from "@/components/registry/sections/underlined-table";
import { UnderlinedTableColumn } from "@/components/registry/sections/underlined-table/column";
import { Prelegenci } from "@/components/registry/sections/prelegenci";
import { PrelegenciSpeakerComponent } from "@/components/registry/sections/prelegenci/speaker";
// -- PLOP IMPORTS HERE --

import { Block, RegistryCategory } from "./types";
import { nanoid } from "nanoid";
export * from "./types";

/**
 * The BlockSchema is a recursive Zod schema that validates
 * Block structures, including nested children.
 */
export const BlockSchema: z.ZodType<Block> = z.lazy(() => {
  const options = Object.entries(COMPONENT_REGISTRY).map(([key, value]) => {
    return z.object({
      id: z.string(),
      type: z.literal(key),
      data: value.Schema,
    });
  });

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
  [Hero.id]: Hero,
  [Typography.id]: Typography,
  [Row.id]: Row,
  [Column.id]: Column,
  [ImageComponent.id]: ImageComponent,
  [UnderlinedCard.id]: UnderlinedCard,
  [Heading.id]: Heading,
  [Paragraph.id]: Paragraph,
  [Span.id]: Span,
  [BulletList.id]: BulletList,
  [OrderedList.id]: OrderedList,
  [ListItem.id]: ListItem,
  [Icon.id]: Icon,
  [Agenda.id]: Agenda,
  [BorderedContainer.id]: BorderedContainer,
  [CmsLink.id]: CmsLink,
  [Menu.id]: Menu,
  [Container.id]: Container,
  [Grid.id]: Grid,
  [GridItem.id]: GridItem,
  [UnderlinedTable.id]: UnderlinedTable,
  [UnderlinedTableColumn.id]: UnderlinedTableColumn,
  [Prelegenci.id]: Prelegenci,
  [PrelegenciSpeakerComponent.id]: PrelegenciSpeakerComponent,
  // -- PLOP REGISTRY HERE --
} as const;

export const REGISTRY_CATEGORIES: RegistryCategory[] = [
  {
    id: "elements",
    label: "Elements",
    componentIds: [
      ButtonComponent.id,
      UnderlinedCard.id,
      CmsLink.id,
      // -- PLOP ELEMENTS HERE --
    ],
  },
  {
    id: "imageComponent",
    label: "Items",
    componentIds: [
      ImageComponent.id,
      Icon.id,
      // -- PLOP ITEMS HERE --
    ],
  },
  {
    id: "layout",
    label: "Layout",
    componentIds: [
      Row.id,
      Column.id,
      Menu.id,
      Container.id,
      Grid.id,
      // -- PLOP LAYOUT HERE --
    ],
    isRootLevel: true,
  },
  {
    id: "sections",
    label: "Sections",
    componentIds: [
      Hero.id,
      Agenda.id,
      BorderedContainer.id,
      UnderlinedTable.id,
      Prelegenci.id,
      // -- PLOP SECTIONS HERE --
    ],
    isRootLevel: true,
  },
  {
    id: "typography",
    label: "Typography",
    componentIds: [
      Typography.id,
      Heading.id,
      Paragraph.id,
      // -- PLOP TYPOGRAPHY HERE --
    ],
  },
];

export type ComponentRegistry = typeof COMPONENT_REGISTRY;
export type ComponentType = keyof ComponentRegistry;

export function createBlock<T extends ComponentType>(type: T): Block<T> {
  return {
    type,
    data: COMPONENT_REGISTRY[type].Schema.parse({}) as never,
    id: nanoid(),
  };
}

export function getComponentByType<T extends ComponentType>(
  type: T,
): ComponentRegistry[T] {
  const component = COMPONENT_REGISTRY[type];
  if (!component) {
    throw new Error(`Component with type "${type}" not found in registry.`);
  }
  return component;
}

export function preprocess(data: unknown): Block[] {
  if (data == null) {
    return [];
  }

  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return BlocksArraySchema.parse(parsed);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error processing page content",
      );
    }
  }

  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return BlocksArraySchema.parse(data);
    } else {
      return BlocksArraySchema.parse([data]);
    }
  }

  console.error("Invalid data format for page content:", data);
  throw new Error("Invalid data format for page content");
}
