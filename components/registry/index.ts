import { Button } from "./elements/Button";
import z from "zod";

export type CMSComponent<Props> = {
  id: string;
  label: string;

  ClientComponent: React.FC<{ id: string; data: Props }>;
  AdminComponent: React.FC<{ id: string; data: Props }>;
  PreviewComponent: React.FC;

  Schema: z.ZodType<Props>;
};

export const COMPONENT_REGISTRY = {
  [Button.id]: Button,
} as const;

export type ComponentRegistry = typeof COMPONENT_REGISTRY;
export type ComponentType = keyof ComponentRegistry;

