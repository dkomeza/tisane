import z from "zod";
import { Result } from "../types/Result";
import { Plugin as RawPlugin } from "@/lib/prisma";
import { PluginStatus } from "@/src/generated/prisma/enums";

export const InstallPluginSchema = z.object({
  repoUrl: z.string().url("Must be a valid URL"),
  branch: z.string().min(1).default("main"),
  displayName: z.string().min(1).optional(),
});

export const GetPluginSchema = z.object({
  pluginId: z.string().min(1),
});

export const UpdatePluginConfigSchema = z.object({
  pluginId: z.string().min(1),
  config: z.record(z.string(), z.unknown()),
});

export type Plugin = RawPlugin;

export type InstallPluginRequest = z.infer<typeof InstallPluginSchema>;
export type InstallPluginResponse = Result<{ plugin: Plugin }, string>;

export type GetPluginRequest = z.infer<typeof GetPluginSchema>;
export type GetPluginResponse = Result<{ plugin: Plugin }, string>;

export type GetPluginsResponse = Result<{ plugins: Plugin[] }, string>;

export type EnablePluginResponse = Result<{ plugin: Plugin }, string>;
export type DisablePluginResponse = Result<{ plugin: Plugin }, string>;
export type DeletePluginResponse = Result<{ success: true }, string>;

export type UpdatePluginConfigRequest = z.infer<
  typeof UpdatePluginConfigSchema
>;
export type UpdatePluginConfigResponse = Result<{ plugin: Plugin }, string>;

export { PluginStatus };
