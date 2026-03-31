/**
 * Validates that a value conforms to the ThemeTokens shape.
 * Throws on invalid structure.
 */
export function validateThemeTokens(tokens: unknown): void {
  if (!tokens || typeof tokens !== "object") {
    throw new Error("Theme tokens must be an object");
  }
  const t = tokens as Record<string, unknown>;

  // light and dark must be Record<string, string> if present
  for (const mode of ["light", "dark"] as const) {
    if (t[mode] !== undefined) {
      if (typeof t[mode] !== "object" || t[mode] === null) {
        throw new Error(`tokens.${mode} must be an object`);
      }
      for (const [key, val] of Object.entries(
        t[mode] as Record<string, unknown>
      )) {
        if (typeof val !== "string") {
          throw new Error(`tokens.${mode}.${key} must be a string`);
        }
      }
    }
  }

  // radius must be a string if present
  if (t.radius !== undefined && typeof t.radius !== "string") {
    throw new Error("tokens.radius must be a string");
  }

  // typography and containers must be Record<string, string> if present
  for (const key of ["typography", "containers"] as const) {
    if (t[key] !== undefined) {
      if (typeof t[key] !== "object" || t[key] === null) {
        throw new Error(`tokens.${key} must be an object`);
      }
      for (const [k, v] of Object.entries(t[key] as Record<string, unknown>)) {
        if (typeof v !== "string") {
          throw new Error(`tokens.${key}.${k} must be a string`);
        }
      }
    }
  }
}
