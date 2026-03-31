"use server";

import { cacheTag } from "next/cache";
import prisma from "@/lib/prisma";
import type { ThemeTokens } from "tisane";
import { mergeTokens } from "./token-merger";
import { generateThemeCSS } from "./css-generator";

/**
 * Fetches the active theme's merged CSS string (base tokens + admin overrides).
 * Returns null if no theme is active.
 *
 * Cached with Next.js "use cache" and tagged "active-theme" for revalidation.
 */
export async function getActiveThemeCSS(): Promise<string | null> {
  "use cache";
  cacheTag("active-theme");

  const setting = await prisma.setting.findUnique({
    where: { key: "active_theme" },
  });

  if (!setting?.value) {
    return null;
  }

  const plugin = await prisma.plugin.findUnique({
    where: { slug: setting.value },
  });

  if (!plugin || plugin.type !== "theme" || !plugin.enabled) {
    return null;
  }

  const baseTokens = (plugin.config ?? {}) as ThemeTokens;
  const overrides = (plugin.themeOverrides ?? {}) as ThemeTokens;
  const merged = mergeTokens(baseTokens, overrides);

  const css = generateThemeCSS(merged);
  return css || null;
}
