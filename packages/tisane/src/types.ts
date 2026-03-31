import type { FC, ReactNode } from "react"
import type z from "zod"

/**
 * Minimal store state interface for plugin AdminComponents.
 * The real CMS Zustand store satisfies this structurally.
 */
export interface CMSStoreState {
  getBlock: (id: string) => unknown
  updateBlock: (id: string, data: Record<string, unknown>) => void
  addBlock: (block: unknown, parentId?: string, prop?: string) => void
  removeBlock: (id: string) => void
}

/**
 * Hook type matching Zustand's UseBoundStore pattern.
 * Plugins call useStore() to get state, or useStore(selector) for derived values.
 */
export type CMSStoreHook = {
  (): CMSStoreState
  <T>(selector: (state: CMSStoreState) => T): T
}

export type BlockProps<P> = {
  id: string
  data: P
  children?: ReactNode
}

export type AdminBlockProps<P> = BlockProps<P> & {
  useStore: CMSStoreHook
}

/**
 * A CMS component definition. Plugin authors use this to type their components.
 * Structurally compatible with the CMS's internal CMSComponent type.
 */
export type CMSComponent<Id extends string, Props> = {
  readonly id: Id
  readonly label: string
  ClientComponent: FC<BlockProps<Props>>
  AdminComponent: FC<AdminBlockProps<Props>>
  PreviewComponent: FC
  Schema: z.ZodType<Props>
}

export type PluginCategory = {
  id: string
  label: string
  componentIds: string[]
  isRootLevel?: boolean
}

export type PluginSettingsProps<TConfig> = {
  config: TConfig
  onSave: (config: TConfig) => Promise<void>
  isSaving: boolean
}

export type TisanePlugin<TConfig = unknown> = {
  id: string
  displayName: string
  version: string
  type?: "component"
  components: CMSComponent<string, unknown>[]
  categories?: PluginCategory[]
  configSchema?: z.ZodType<TConfig>
  SettingsComponent?: FC<PluginSettingsProps<TConfig>>
}

// ── Theme types ─────────────────────────────────────────────────────────────

export type ThemeTokens = {
  light?: Record<string, string>
  dark?: Record<string, string>
  radius?: string
  typography?: Record<string, string>
  containers?: Record<string, string>
}

export type TisaneTheme = {
  id: string
  displayName: string
  version: string
  type: "theme"
  tokens: ThemeTokens
  configSchema?: z.ZodType
  SettingsComponent?: FC<PluginSettingsProps<unknown>>
}
