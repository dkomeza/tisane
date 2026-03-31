import type { TisaneTheme } from "./types"

/**
 * Typed identity function for defining a Tisane theme.
 * Zero runtime cost — exists purely for type inference.
 */
export function defineTheme(theme: TisaneTheme): TisaneTheme {
  return theme
}
