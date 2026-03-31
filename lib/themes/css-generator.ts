import type { ThemeTokens } from "tisane";

/**
 * Converts a flat token map (e.g. { "primary": "oklch(...)" }) into CSS declarations.
 * Keys are prefixed with `--` to form valid CSS custom property names.
 */
function tokensToCSSDeclarations(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
}

/**
 * Generates a CSS string from merged theme tokens.
 * Produces :root { ... } and .dark { ... } blocks.
 */
export function generateThemeCSS(tokens: ThemeTokens): string {
  const parts: string[] = [];

  // Collect :root (light mode) tokens
  const rootTokens: Record<string, string> = {};

  if (tokens.light) {
    Object.assign(rootTokens, tokens.light);
  }
  if (tokens.radius) {
    rootTokens["radius"] = tokens.radius;
  }
  if (tokens.typography) {
    Object.assign(rootTokens, tokens.typography);
  }
  if (tokens.containers) {
    Object.assign(rootTokens, tokens.containers);
  }

  if (Object.keys(rootTokens).length > 0) {
    parts.push(`:root {\n${tokensToCSSDeclarations(rootTokens)}\n}`);
  }

  // Collect .dark tokens
  if (tokens.dark && Object.keys(tokens.dark).length > 0) {
    parts.push(`.dark {\n${tokensToCSSDeclarations(tokens.dark)}\n}`);
  }

  return parts.join("\n");
}
