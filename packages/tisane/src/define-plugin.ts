import type { TisanePlugin } from "./types"

/**
 * Typed identity function for defining a Tisane plugin.
 * Zero runtime cost — exists purely for type inference.
 */
export function definePlugin<TConfig = unknown>(
  plugin: TisanePlugin<TConfig>
): TisanePlugin<TConfig> {
  return plugin
}
