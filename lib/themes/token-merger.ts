import type { ThemeTokens } from "tisane";

/**
 * Deep-merges two ThemeTokens objects. Override values take precedence.
 * Only merges defined keys — undefined/null keys in overrides are skipped.
 */
export function mergeTokens(
  base: ThemeTokens,
  overrides: ThemeTokens
): ThemeTokens {
  const merged: ThemeTokens = { ...base };

  if (overrides.light) {
    merged.light = { ...base.light, ...overrides.light };
  }
  if (overrides.dark) {
    merged.dark = { ...base.dark, ...overrides.dark };
  }
  if (overrides.radius !== undefined) {
    merged.radius = overrides.radius;
  }
  if (overrides.typography) {
    merged.typography = { ...base.typography, ...overrides.typography };
  }
  if (overrides.containers) {
    merged.containers = { ...base.containers, ...overrides.containers };
  }

  return merged;
}
