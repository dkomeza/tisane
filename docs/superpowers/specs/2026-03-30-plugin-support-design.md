# Plugin Support Design

**Date:** 2026-03-30
**Status:** Approved

## Context

Tisane CMS currently has a static component registry — all 25 components are hard-coded in `components/registry/index.ts`. There is no way to extend the CMS with new components or admin UI without modifying the core codebase.

The goal is to add a plugin system that lets a small trusted team author and ship new CMS components and admin settings UI as standalone packages, managed from the admin dashboard, without requiring core changes.

---

## Scope

Plugins can contribute:
- **Custom CMS components** — new `ClientComponent` / `AdminComponent` / `PreviewComponent` blocks that appear in the editor
- **Custom settings UI** — a settings panel rendered in the plugin detail page for admin configuration

Plugins cannot (in this iteration) contribute server actions, database schema changes, or new admin dashboard sections.

---

## Architecture Overview

Four moving parts:

1. **`packages/tisane/`** — a small npm package plugin authors depend on. Exports `definePlugin()` and all necessary types.
2. **`prisma/models/plugins.prisma`** — tracks every plugin's repo URL, status, enabled state, and config.
3. **`scripts/install-plugins.ts`** — build orchestrator that runs as a `prebuild`/`predev` hook. Discovers, clones, validates, and generates `plugins/index.ts`.
4. **`/admin/plugins`** — admin dashboard section for installing, enabling, disabling, and configuring plugins.

At runtime, `components/registry/index.ts` imports `plugins/index.ts` and merges plugin components alongside the builtin registry.

---

## Database Model

```prisma
// prisma/models/plugins.prisma

enum PluginStatus {
  pending    // Added to DB, not yet processed by orchestrator
  installed  // Successfully cloned, built, and validated
  broken     // Validation failed at one of the stages
  disabled   // Manually disabled by admin
}

model Plugin {
  id               String       @id @default(cuid())
  slug             String       @unique  // e.g. "my-gallery", derived from dir or repo name
  displayName      String
  repoUrl          String?      @unique  // null = built-in plugin (lives in plugins/ in git)
  branch           String       @default("main")

  status           PluginStatus @default(pending)
  enabled          Boolean      @default(false)

  installedCommit  String?      // git SHA at last successful install
  lastSyncAt       DateTime?

  errorStage       String?      // "clone" | "npm_install" | "syntax" | "shape"
  errorMessage     String?

  config           Json?        // per-plugin admin configuration blob

  installedAt      DateTime?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  @@map("plugins")
}
```

`status` and `enabled` are intentionally separate: a plugin can be `installed` but `disabled` (temporarily off without losing its config). Only plugins with `enabled: true` and `status: installed` are active at build time.

`repoUrl: null` identifies a built-in plugin (source committed to git). External plugins have a GitHub HTTPS URL.

---

## `tisane` npm Package

**Location:** `packages/tisane/` (npm workspaces monorepo)

**Structure:**
```
packages/tisane/
  package.json     (name: "tisane", peerDeps: react, zod)
  src/
    index.ts       (re-exports everything)
    types.ts       (all shared types)
    define-plugin.ts
```

**`definePlugin`** is a typed identity function — zero runtime cost, full type inference:

```ts
export function definePlugin<TConfig = unknown>(
  plugin: TisanePlugin<TConfig>
): TisanePlugin<TConfig> {
  return plugin
}
```

**Key types:**

```ts
export type TisanePlugin<TConfig = unknown> = {
  id: string
  displayName: string
  version: string
  components: CMSComponent<string, unknown>[]
  categories?: PluginCategory[]
  configSchema?: z.ZodType<TConfig>
  SettingsComponent?: React.FC<PluginSettingsProps<TConfig>>
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

// Structural shim — decouples tisane from Zustand
export interface CMSStoreShim {
  getBlock: (id: string) => unknown
  updateBlock: (id: string, data: Record<string, unknown>) => void
  addBlock: (block: unknown, parentId?: string, prop?: string) => void
  removeBlock: (id: string) => void
}

export type AdminBlockProps<P> = BlockProps<P> & {
  useStore: CMSStoreShim
}
```

**Example plugin:**

```ts
// my-plugin/src/index.ts
import { definePlugin } from 'tisane'
import { z } from 'zod'

export default definePlugin({
  id: 'my-gallery',
  displayName: 'My Gallery',
  version: '1.0.0',
  components: [GalleryGrid, GalleryItem],
  categories: [{ id: 'gallery', label: 'Gallery', componentIds: ['gallery-grid', 'gallery-item'] }],
  configSchema: z.object({ maxImages: z.number().default(12) }),
  SettingsComponent: GallerySettings,
})
```

---

## Registry Changes

The builtin `COMPONENT_REGISTRY` stays `as const` (all existing type safety preserved). Plugin components live in a separate mutable map:

```ts
// components/registry/index.ts (additions)

import { pluginComponents, pluginCategories } from "@/plugins/index"

// Unchanged builtin registry
export const COMPONENT_REGISTRY = { ...existing... } as const

// Plugin registry — populated at module init
export const PLUGIN_REGISTRY: Record<string, CMSComponent<string, unknown>> = {}
for (const comp of pluginComponents) {
  PLUGIN_REGISTRY[comp.id] = comp
}

// Unified lookup — builtins first, then plugins
export function getComponentByType(type: string) {
  return (COMPONENT_REGISTRY as Record<string, CMSComponent<string, unknown>>)[type]
    ?? PLUGIN_REGISTRY[type]
}

// DBComponentSchema already uses z.lazy — merges both registries at call time
export const DBComponentSchema: z.ZodType<DBComponent> = z.lazy(() => {
  const all = { ...COMPONENT_REGISTRY, ...PLUGIN_REGISTRY }
  const options = Object.entries(all).map(([key, val]) =>
    z.object({ type: z.literal(key), data: val.Schema })
  )
  return z.discriminatedUnion("type", options as any)
})

// REGISTRY_CATEGORIES extended with plugin categories
export const REGISTRY_CATEGORIES: RegistryCategory[] = [
  ...builtinCategories,
  ...pluginCategories,
]
```

`plugins/index.ts` is committed to git with empty-array exports as the default. The orchestrator overwrites it on each build.

---

## Build Orchestrator

**File:** `scripts/install-plugins.ts`
**Invoked via:** `prebuild` and `predev` hooks in `package.json`
**Exit code:** Always `0` — individual plugin failures never block the build.

### Discovery phase

1. Scan `plugins/*/` for directories containing a plugin entry point.
2. For each directory, check if a `Plugin` DB record exists with that `slug`.
   - **No record** → auto-register as built-in (`repoUrl: null`, `enabled: true`, `status: pending`)
   - **Record exists** → use existing DB state
3. Fetch all DB records with `enabled: true` to process.

### Validation pipeline (per plugin)

Each stage failure writes `{ status: "broken", errorStage, errorMessage }` to the DB and skips to the next plugin.

| Stage | Action | `errorStage` on failure |
|---|---|---|
| **clone/pull** | `git clone <repoUrl>` (skip for built-ins, already present) | `"clone"` |
| **npm install** | `npm install --ignore-scripts` in plugin dir | `"npm_install"` |
| **esbuild** | Bundle to `plugins/<slug>/dist/index.mjs`, external: react/zod/next/tisane | `"syntax"` |
| **shape check** | Dynamic import dist, verify `id`/`components`/`Schema`, check for ID collisions | `"shape"` |

`--ignore-scripts` on npm install prevents malicious `postinstall` execution.

For private repos, the existing GitHub token from the `Setting` table is used: `https://<token>@github.com/...`

### Generation phase

After all plugins are processed, writes `plugins/index.ts` containing only plugins with `status: installed` and `enabled: true`:

```ts
// AUTO-GENERATED by scripts/install-plugins.ts — DO NOT EDIT
// Last generated: <timestamp>

import plugin_my_gallery from "./my-gallery/dist/index.mjs"
import plugin_custom_form from "./custom-form/dist/index.mjs"

const plugins = [plugin_my_gallery, plugin_custom_form]

export const pluginComponents = plugins.flatMap(p => p.components)
export const pluginCategories = plugins.flatMap(p => p.categories ?? [])
export const pluginMap = Object.fromEntries(plugins.map(p => [p.id, p]))
```

Empty fallback (when no plugins active):
```ts
import type { CMSComponent } from "@/components/registry/types"
import type { RegistryCategory } from "@/components/registry/types"
import type { TisanePlugin } from "tisane"

export const pluginComponents: CMSComponent<string, unknown>[] = []
export const pluginCategories: RegistryCategory[] = []
export const pluginMap: Record<string, TisanePlugin> = {}
```

---

## Admin Dashboard — Plugins Section

### Routes

| Route | Type | Purpose |
|---|---|---|
| `/admin/plugins` | Server Component | List all plugins + inline install form |
| `/admin/plugins/[id]` | Server Component | Detail, README, settings, danger zone |

### Server actions (`/app/actions/plugins/`)

| Action | Description |
|---|---|
| `installPlugin(repoUrl, branch, displayName)` | Creates `Plugin` record with `status: pending` |
| `enablePlugin(id)` | Sets `enabled: true`, warns rebuild required |
| `disablePlugin(id)` | Sets `enabled: false`, warns rebuild required |
| `deletePlugin(id)` | Deletes record; built-ins (`repoUrl: null`) cannot be deleted |
| `updatePluginConfig(id, config)` | Validates against `configSchema`, saves to `Plugin.config` (no rebuild needed) |
| `getPlugins()` | Returns all plugin records |
| `getPlugin(id)` | Returns single plugin record |

### List page (`/admin/plugins`)

- Matches existing pages/users list style
- Inline install form at top: GitHub URL, branch (optional, default `main`), display name (optional)
- Plugin cards/rows: display name, slug, status badge (color-coded), repo URL, enabled toggle
- Persistent banner when any plugin is `pending` or recently toggled: *"Rebuild required to apply changes."*

### Detail page (`/admin/plugins/[id]`)

Sections in order:

1. **Header** — display name, version (from installed plugin module), status badge
2. **Error card** — (only if `broken`) shows `errorStage` and full `errorMessage`
3. **Info** — repo URL, branch, installed commit SHA, last sync timestamp; enable/disable toggle with rebuild warning
4. **README** — reads `plugins/<slug>/README.md` from filesystem, rendered as markdown; collapsed by default if long; hidden if file absent
5. **Plugin settings** — (only if `status: installed` and plugin has `SettingsComponent`) renders plugin's own settings with `config` and `onSave` wired to `updatePluginConfig`
6. **Danger zone** — Delete button with confirmation dialog; disabled for built-ins

### Sidebar

"Plugins" added to the **Design** group in `Sidebar.tsx`:
```ts
{ label: "Plugins", href: "/admin/plugins", icon: Blocks, roles: ["admin"] }
```

---

## Files to Create

| File | Description |
|---|---|
| `prisma/models/plugins.prisma` | Plugin model and PluginStatus enum |
| `scripts/install-plugins.ts` | Build orchestrator |
| `plugins/index.ts` | Generated manifest (committed, empty-array default) |
| `packages/tisane/package.json` | tisane package config |
| `packages/tisane/src/index.ts` | Re-exports |
| `packages/tisane/src/types.ts` | All shared types |
| `packages/tisane/src/define-plugin.ts` | definePlugin factory |
| `lib/schemas/PluginsSchema.ts` | Zod schemas for plugin actions |
| `app/actions/plugins/install-plugin.ts` | |
| `app/actions/plugins/enable-plugin.ts` | |
| `app/actions/plugins/disable-plugin.ts` | |
| `app/actions/plugins/delete-plugin.ts` | |
| `app/actions/plugins/update-plugin-config.ts` | |
| `app/actions/plugins/get-plugins.ts` | |
| `app/actions/plugins/get-plugin.ts` | |
| `app/admin/(dashboard)/plugins/page.tsx` | List page |
| `app/admin/(dashboard)/plugins/[id]/page.tsx` | Detail page |
| `app/admin/(dashboard)/plugins/components/PluginCard.tsx` | |
| `app/admin/(dashboard)/plugins/components/PluginStatusBadge.tsx` | |
| `app/admin/(dashboard)/plugins/components/InstallPluginForm.tsx` | |
| `app/admin/(dashboard)/plugins/components/PluginSettingsRenderer.tsx` | Renders plugin's SettingsComponent |

## Files to Modify

| File | Change |
|---|---|
| `components/registry/index.ts` | Import plugins/index.ts, add PLUGIN_REGISTRY, update DBComponentSchema and REGISTRY_CATEGORIES |
| `app/admin/(dashboard)/components/Sidebar.tsx` | Add Plugins item to Design group |
| `package.json` | Add prebuild/predev scripts, add esbuild to devDependencies, configure workspaces |
| `tsconfig.json` | Add `plugins/*/node_modules` and `plugins/*/dist` to `exclude` |

---

## Key Risks

**Type safety regression** — `PLUGIN_REGISTRY` is `Record<string, CMSComponent<string, unknown>>`. Existing builtin code retains full type safety via `COMPONENT_REGISTRY as const`. Plugin component types are unnarrowed strings — acceptable for external code.

**`plugins/index.ts` must always exist** — committed with empty-array default. If someone runs `next build` directly without `npm run build`, the committed empty version is used (all plugins inactive but build succeeds).

**ID collisions** — shape validation stage checks plugin component IDs against builtins and previously loaded plugins. Collision fails the plugin with `errorStage: "shape"`.

**Rebuild required for enable/disable** — the admin dashboard communicates this clearly with a persistent banner. Config changes (`updatePluginConfig`) take effect immediately without a rebuild.

**Private repos** — uses the GitHub token from the `Setting` table (`key: "github_token"`). If no token is set, private repos fail at the clone stage with a clear error message.

**TypeScript compiler scope** — `plugins/*/node_modules` and plugin `tsconfig.json` files could confuse the root TypeScript compiler. Add `plugins/*/node_modules` and `plugins/*/dist` to the `exclude` array in the root `tsconfig.json`.
