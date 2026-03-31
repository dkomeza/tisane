# Plugin Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a plugin system to Tisane CMS that lets a trusted team author custom CMS components and admin settings UI as GitHub-repo plugins, managed from the admin dashboard.

**Architecture:** A build-time orchestrator (`scripts/install-plugins.ts`) runs before `next build`, clones/validates plugins from GitHub or local `plugins/` directories, marks broken ones in the DB, and generates `plugins/index.ts`. The registry merges plugin components at module init alongside the static builtin registry. A `packages/tisane` npm package provides types and `definePlugin()` for plugin authors.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Prisma 7 (PostgreSQL), Zod v4, Zustand, Radix UI, TailwindCSS v4, esbuild, tsx

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `packages/tisane/package.json` | Create | Tisane npm package manifest |
| `packages/tisane/tsconfig.json` | Create | Tisane package TypeScript config |
| `packages/tisane/src/types.ts` | Create | All shared plugin types (CMSComponent, BlockProps, TisanePlugin, etc.) |
| `packages/tisane/src/define-plugin.ts` | Create | `definePlugin()` typed identity factory |
| `packages/tisane/src/index.ts` | Create | Re-exports from types and define-plugin |
| `prisma/models/plugins.prisma` | Create | Plugin model + PluginStatus enum |
| `plugins/index.ts` | Create | Generated manifest; committed as empty-array fallback |
| `scripts/install-plugins.ts` | Create | Build orchestrator: discover, clone, validate, generate |
| `lib/schemas/PluginsSchema.ts` | Create | Zod schemas + types for all plugin actions |
| `app/actions/plugins/get-plugins.ts` | Create | List all plugin records |
| `app/actions/plugins/get-plugin.ts` | Create | Fetch single plugin record by id |
| `app/actions/plugins/install-plugin.ts` | Create | Create Plugin DB record (pending) |
| `app/actions/plugins/enable-plugin.ts` | Create | Set enabled: true |
| `app/actions/plugins/disable-plugin.ts` | Create | Set enabled: false |
| `app/actions/plugins/delete-plugin.ts` | Create | Delete record (built-ins protected) |
| `app/actions/plugins/update-plugin-config.ts` | Create | Validate + save plugin config JSON |
| `app/admin/(dashboard)/plugins/components/PluginStatusBadge.tsx` | Create | Color-coded status badge |
| `app/admin/(dashboard)/plugins/components/PluginCard.tsx` | Create | Plugin list card with enable toggle |
| `app/admin/(dashboard)/plugins/components/InstallPluginForm.tsx` | Create | Client form to add a new plugin by GitHub URL |
| `app/admin/(dashboard)/plugins/components/PluginSettingsRenderer.tsx` | Create | Dynamically renders a plugin's SettingsComponent |
| `app/admin/(dashboard)/plugins/page.tsx` | Create | Plugins list page (Server Component) |
| `app/admin/(dashboard)/plugins/[id]/page.tsx` | Create | Plugin detail page (Server Component) |
| `package.json` | Modify | Add workspaces, prebuild/predev hooks, esbuild devdep |
| `tsconfig.json` | Modify | Add tisane path alias, exclude plugins/*/node_modules |
| `components/registry/types.ts` | Modify | Change `componentIds: ComponentType[]` → `string[]` |
| `components/registry/index.ts` | Modify | Import plugins/index.ts, add PLUGIN_REGISTRY, update DBComponentSchema + REGISTRY_CATEGORIES |
| `app/admin/(dashboard)/components/Sidebar.tsx` | Modify | Add Plugins nav item (admin-only) |

---

## Task 1: `tisane` package + monorepo setup

**Files:**
- Create: `packages/tisane/package.json`
- Create: `packages/tisane/tsconfig.json`
- Create: `packages/tisane/src/types.ts`
- Create: `packages/tisane/src/define-plugin.ts`
- Create: `packages/tisane/src/index.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`

- [ ] **Step 1: Add npm workspaces to root package.json**

In `/Users/dkomeza/Github/tisane/package.json`, add the `"workspaces"` field and `"tisane"` dependency. The full `scripts` section stays the same (add to existing, don't replace):

```json
{
  "name": "tisane",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "next dev",
    "dev:pre": "docker compose -f docker-compose.dev.yml --env-file .env.development up -d && next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx seed/seed.ts",
    "db:deploy": "prisma migrate deploy",
    "generate": "plop"
  }
}
```

(The `prebuild`/`predev` hooks and `esbuild` devdep are added in Task 8 to keep things separate.)

- [ ] **Step 2: Create `packages/tisane/package.json`**

```json
{
  "name": "tisane",
  "version": "0.1.0",
  "description": "Type definitions and utilities for Tisane CMS plugins",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc"
  },
  "peerDependencies": {
    "react": ">=18",
    "zod": ">=3"
  },
  "devDependencies": {
    "@types/react": "^19",
    "typescript": "^5"
  }
}
```

- [ ] **Step 3: Create `packages/tisane/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Create `packages/tisane/src/types.ts`**

```ts
import type { FC, ReactNode } from "react"
import type z from "zod"

/**
 * Minimal Zustand store interface for plugin AdminComponents.
 * The real CMS store satisfies this structurally.
 */
export interface CMSStoreShim {
  getBlock: (id: string) => unknown
  updateBlock: (id: string, data: Record<string, unknown>) => void
  addBlock: (block: unknown, parentId?: string, prop?: string) => void
  removeBlock: (id: string) => void
}

export type BlockProps<P> = {
  id: string
  data: P
  children?: ReactNode
}

export type AdminBlockProps<P> = BlockProps<P> & {
  useStore: CMSStoreShim
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
  components: CMSComponent<string, unknown>[]
  categories?: PluginCategory[]
  configSchema?: z.ZodType<TConfig>
  SettingsComponent?: FC<PluginSettingsProps<TConfig>>
}
```

- [ ] **Step 5: Create `packages/tisane/src/define-plugin.ts`**

```ts
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
```

- [ ] **Step 6: Create `packages/tisane/src/index.ts`**

```ts
export type {
  CMSComponent,
  BlockProps,
  AdminBlockProps,
  CMSStoreShim,
  PluginCategory,
  PluginSettingsProps,
  TisanePlugin,
} from "./types"

export { definePlugin } from "./define-plugin"
```

- [ ] **Step 7: Add `tisane` path alias and plugin exclusions to `tsconfig.json`**

Replace the existing `tsconfig.json` content:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "tisane": ["./packages/tisane/src/index.ts"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts",
    ".next/dev/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "plugins/*/node_modules",
    "plugins/*/dist",
    "packages/*/node_modules",
    "packages/*/dist"
  ]
}
```

- [ ] **Step 8: Install workspace dependencies**

```bash
npm install
```

Expected: npm links `packages/tisane` into root `node_modules/tisane`.

- [ ] **Step 9: Verify TypeScript resolves the tisane package**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: No errors related to `tisane` module resolution. (There may be unrelated errors at this point since plugins/index.ts doesn't exist yet — that's fine.)

- [ ] **Step 10: Commit**

```bash
git add packages/ tsconfig.json package.json package-lock.json
git commit -m "feat: add tisane npm package and monorepo workspace setup"
```

---

## Task 2: Plugin database model

**Files:**
- Create: `prisma/models/plugins.prisma`

- [ ] **Step 1: Create `prisma/models/plugins.prisma`**

```prisma
enum PluginStatus {
  pending
  installed
  broken
  disabled

  @@map("plugin_status")
}

model Plugin {
  id               String       @id @default(cuid())
  slug             String       @unique
  displayName      String
  repoUrl          String?      @unique
  branch           String       @default("main")

  status           PluginStatus @default(pending)
  enabled          Boolean      @default(false)

  installedCommit  String?
  lastSyncAt       DateTime?

  errorStage       String?
  errorMessage     String?

  config           Json?

  installedAt      DateTime?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  @@map("plugins")
}
```

- [ ] **Step 2: Run migration**

```bash
npm run db:migrate
```

When prompted for a migration name, enter: `add_plugins`

Expected: Migration created and applied. Prisma client regenerated with `Plugin` model and `PluginStatus` enum at `src/generated/prisma`.

- [ ] **Step 3: Verify generated types exist**

```bash
grep -r "PluginStatus" src/generated/prisma/ | head -5
```

Expected: Lines showing `PluginStatus` enum in generated Prisma files.

- [ ] **Step 4: Commit**

```bash
git add prisma/models/plugins.prisma prisma/migrations/ src/generated/prisma/
git commit -m "feat: add Plugin model and PluginStatus enum"
```

---

## Task 3: Registry changes + plugins/index.ts fallback

**Files:**
- Modify: `components/registry/types.ts`
- Create: `plugins/index.ts`
- Modify: `components/registry/index.ts`

- [ ] **Step 1: Change `componentIds` type in `components/registry/types.ts`**

In `components/registry/types.ts`, change line 90:

```ts
// Before:
  componentIds: ComponentType[];

// After:
  componentIds: string[];
```

This is backward-compatible: all `ComponentType` values are strings.

- [ ] **Step 2: Create `plugins/index.ts` (empty-array fallback)**

This file is committed to git. The orchestrator overwrites it on each build. The `// @ts-nocheck` at the top is intentional — the generated version imports untyped `.mjs` files.

```ts
// AUTO-GENERATED by scripts/install-plugins.ts — DO NOT EDIT
// This empty fallback is committed so the build works on a fresh checkout.
// @ts-nocheck
import type { TisanePlugin } from "tisane"

export const pluginComponents: TisanePlugin["components"] = []
export const pluginCategories: NonNullable<TisanePlugin["categories"]> = []
export const pluginMap: Record<string, TisanePlugin> = {}
```

- [ ] **Step 3: Update `components/registry/index.ts` to merge plugins**

Add the following imports at the top of `components/registry/index.ts`, after the existing imports and before the `DBComponentSchema` declaration:

```ts
import { pluginComponents, pluginCategories } from "@/plugins/index"
```

Then replace the `DBComponentSchema` definition and add `PLUGIN_REGISTRY` after it. The section currently reads:

```ts
export const DBComponentSchema: z.ZodType<DBComponent> = z.lazy(() => {
  const options = Object.entries(COMPONENT_REGISTRY).map(([key, value]) => {
    return z.object({
      type: z.literal(key),
      data: value.Schema,
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return z.discriminatedUnion("type", options as any);
});
```

Replace it with:

```ts
// Plugin registry — populated at module init from generated plugins/index.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PLUGIN_REGISTRY: Record<string, CMSComponent<string, any>> = {}
for (const comp of pluginComponents) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PLUGIN_REGISTRY[comp.id] = comp as any
}

export const DBComponentSchema: z.ZodType<DBComponent> = z.lazy(() => {
  const all = { ...COMPONENT_REGISTRY, ...PLUGIN_REGISTRY }
  const options = Object.entries(all).map(([key, value]) => {
    return z.object({
      type: z.literal(key),
      data: value.Schema,
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return z.discriminatedUnion("type", options as any);
});
```

Then replace the `REGISTRY_CATEGORIES` export at the bottom of the file. Currently:

```ts
export const REGISTRY_CATEGORIES: RegistryCategory[] = [
  {
    id: "elements",
    ...
  },
  ...
];
```

Change it so plugin categories are appended. Replace the closing `];` with:

```ts
  // -- PLOP CATEGORIES HERE --
  ...pluginCategories,
];
```

Wait — the existing array already ends with `];`. Instead, change the closing bracket to spread plugin categories. The full `REGISTRY_CATEGORIES` export should end with:

```ts
  {
    id: "typography",
    label: "Typography",
    componentIds: [
      Typography.id,
      Heading.id,
      Paragraph.id,
      Span.id,
      BulletList.id,
      OrderedList.id,
      ListItem.id,
      // -- PLOP TYPOGRAPHY HERE --
    ],
  },
  ...pluginCategories,
];
```

- [ ] **Step 4: Update `getComponentByType` to check both registries**

The existing `getComponentByType` only checks `COMPONENT_REGISTRY`. Replace it:

```ts
export function getComponentByType<T extends ComponentType>(
  type: T,
): ComponentRegistry[T] {
  const component =
    (COMPONENT_REGISTRY as Record<string, CMSComponent<string, unknown>>)[type] ??
    PLUGIN_REGISTRY[type]
  if (!component) {
    throw new Error(`Component with type "${type}" not found in registry.`);
  }
  return component as ComponentRegistry[T];
}
```

- [ ] **Step 5: Verify TypeScript is happy**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -30
```

Expected: No new errors from the registry or plugins/index.ts changes.

- [ ] **Step 6: Commit**

```bash
git add components/registry/types.ts components/registry/index.ts plugins/index.ts
git commit -m "feat: extend registry to support plugin components"
```

---

## Task 4: Plugin action schemas

**Files:**
- Create: `lib/schemas/PluginsSchema.ts`

- [ ] **Step 1: Create `lib/schemas/PluginsSchema.ts`**

```ts
import z from "zod"
import { Result } from "../types/Result"
import { Plugin as RawPlugin } from "@/lib/prisma"
import { PluginStatus } from "@/src/generated/prisma/enums"

export const InstallPluginSchema = z.object({
  repoUrl: z.string().url("Must be a valid URL"),
  branch: z.string().min(1).default("main"),
  displayName: z.string().min(1).optional(),
})

export const GetPluginSchema = z.object({
  pluginId: z.string().min(1),
})

export const UpdatePluginConfigSchema = z.object({
  pluginId: z.string().min(1),
  config: z.record(z.unknown()),
})

export type Plugin = RawPlugin

export type InstallPluginRequest = z.infer<typeof InstallPluginSchema>
export type InstallPluginResponse = Result<{ plugin: Plugin }, string>

export type GetPluginRequest = z.infer<typeof GetPluginSchema>
export type GetPluginResponse = Result<{ plugin: Plugin }, string>

export type GetPluginsResponse = Result<{ plugins: Plugin[] }, string>

export type EnablePluginResponse = Result<{ plugin: Plugin }, string>
export type DisablePluginResponse = Result<{ plugin: Plugin }, string>
export type DeletePluginResponse = Result<{ success: true }, string>

export type UpdatePluginConfigRequest = z.infer<typeof UpdatePluginConfigSchema>
export type UpdatePluginConfigResponse = Result<{ plugin: Plugin }, string>

export { PluginStatus }
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

Expected: No errors from the new schema file.

- [ ] **Step 3: Commit**

```bash
git add lib/schemas/PluginsSchema.ts
git commit -m "feat: add plugin action schemas and types"
```

---

## Task 5: Read actions

**Files:**
- Create: `app/actions/plugins/get-plugins.ts`
- Create: `app/actions/plugins/get-plugin.ts`

- [ ] **Step 1: Create `app/actions/plugins/get-plugins.ts`**

```ts
"use server"

import { authorize } from "@/lib/auth/authorize"
import prisma from "@/lib/prisma"
import { GetPluginsResponse } from "@/lib/schemas/PluginsSchema"

export async function getPlugins(): Promise<GetPluginsResponse> {
  const { session } = await authorize()

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const plugins = await prisma.plugin.findMany({
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: { plugins } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
```

- [ ] **Step 2: Create `app/actions/plugins/get-plugin.ts`**

```ts
"use server"

import { authorize } from "@/lib/auth/authorize"
import prisma from "@/lib/prisma"
import {
  GetPluginSchema,
  GetPluginRequest,
  GetPluginResponse,
} from "@/lib/schemas/PluginsSchema"

export async function getPlugin(
  request: GetPluginRequest
): Promise<GetPluginResponse> {
  const { session } = await authorize()

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const parse = GetPluginSchema.safeParse(request)

    if (!parse.success) {
      throw new Error("Invalid request parameters")
    }

    const plugin = await prisma.plugin.findUnique({
      where: { id: parse.data.pluginId },
    })

    if (!plugin) {
      throw new Error("Plugin not found")
    }

    return { success: true, data: { plugin } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add app/actions/plugins/
git commit -m "feat: add getPlugins and getPlugin server actions"
```

---

## Task 6: Write actions (install, enable, disable, delete)

**Files:**
- Create: `app/actions/plugins/install-plugin.ts`
- Create: `app/actions/plugins/enable-plugin.ts`
- Create: `app/actions/plugins/disable-plugin.ts`
- Create: `app/actions/plugins/delete-plugin.ts`

- [ ] **Step 1: Create `app/actions/plugins/install-plugin.ts`**

Derives a slug from the repo URL (last path segment, lowercased, non-alphanumeric replaced with hyphens).

```ts
"use server"

import { authorize } from "@/lib/auth/authorize"
import prisma from "@/lib/prisma"
import { refresh } from "next/cache"
import {
  InstallPluginSchema,
  InstallPluginRequest,
  InstallPluginResponse,
} from "@/lib/schemas/PluginsSchema"

function slugFromRepoUrl(repoUrl: string): string {
  const parts = repoUrl.replace(/\.git$/, "").split("/")
  const repoName = parts[parts.length - 1] ?? "plugin"
  return repoName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function installPlugin(
  request: InstallPluginRequest
): Promise<InstallPluginResponse> {
  const { session } = await authorize()

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const parse = InstallPluginSchema.safeParse(request)

    if (!parse.success) {
      throw new Error("Invalid request parameters")
    }

    const { repoUrl, branch, displayName } = parse.data
    const slug = slugFromRepoUrl(repoUrl)

    const existing = await prisma.plugin.findFirst({
      where: { OR: [{ repoUrl }, { slug }] },
    })

    if (existing) {
      throw new Error(
        existing.repoUrl === repoUrl
          ? "A plugin with this repository URL is already installed"
          : `A plugin with the slug "${slug}" already exists`
      )
    }

    const plugin = await prisma.plugin.create({
      data: {
        slug,
        displayName: displayName ?? slug,
        repoUrl,
        branch,
        status: "pending",
        enabled: false,
      },
    })

    return { success: true, data: { plugin } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  } finally {
    refresh()
  }
}
```

- [ ] **Step 2: Create `app/actions/plugins/enable-plugin.ts`**

```ts
"use server"

import { authorize } from "@/lib/auth/authorize"
import prisma from "@/lib/prisma"
import { refresh } from "next/cache"
import { EnablePluginResponse } from "@/lib/schemas/PluginsSchema"

export async function enablePlugin(
  pluginId: string
): Promise<EnablePluginResponse> {
  const { session } = await authorize()

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const plugin = await prisma.plugin.update({
      where: { id: pluginId },
      data: { enabled: true },
    })

    return { success: true, data: { plugin } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  } finally {
    refresh()
  }
}
```

- [ ] **Step 3: Create `app/actions/plugins/disable-plugin.ts`**

```ts
"use server"

import { authorize } from "@/lib/auth/authorize"
import prisma from "@/lib/prisma"
import { refresh } from "next/cache"
import { DisablePluginResponse } from "@/lib/schemas/PluginsSchema"

export async function disablePlugin(
  pluginId: string
): Promise<DisablePluginResponse> {
  const { session } = await authorize()

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const plugin = await prisma.plugin.update({
      where: { id: pluginId },
      data: { enabled: false },
    })

    return { success: true, data: { plugin } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  } finally {
    refresh()
  }
}
```

- [ ] **Step 4: Create `app/actions/plugins/delete-plugin.ts`**

Built-in plugins (`repoUrl === null`) cannot be deleted — only disabled.

```ts
"use server"

import { authorize } from "@/lib/auth/authorize"
import prisma from "@/lib/prisma"
import { refresh } from "next/cache"
import { DeletePluginResponse } from "@/lib/schemas/PluginsSchema"

export async function deletePlugin(
  pluginId: string
): Promise<DeletePluginResponse> {
  const { session } = await authorize()

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const plugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    })

    if (!plugin) {
      throw new Error("Plugin not found")
    }

    if (plugin.repoUrl === null) {
      throw new Error("Built-in plugins cannot be deleted. Disable them instead.")
    }

    await prisma.plugin.delete({ where: { id: pluginId } })

    return { success: true, data: { success: true } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  } finally {
    refresh()
  }
}
```

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

- [ ] **Step 6: Commit**

```bash
git add app/actions/plugins/
git commit -m "feat: add install, enable, disable, delete plugin actions"
```

---

## Task 7: Config action

**Files:**
- Create: `app/actions/plugins/update-plugin-config.ts`

- [ ] **Step 1: Create `app/actions/plugins/update-plugin-config.ts`**

The config is validated against the plugin's Zod `configSchema` if one is defined in `pluginMap` (the active registered plugins). If the plugin is not currently active (pending/broken/disabled), config is saved without runtime validation.

```ts
"use server"

import { authorize } from "@/lib/auth/authorize"
import prisma from "@/lib/prisma"
import { refresh } from "next/cache"
import {
  UpdatePluginConfigSchema,
  UpdatePluginConfigRequest,
  UpdatePluginConfigResponse,
} from "@/lib/schemas/PluginsSchema"
import { pluginMap } from "@/plugins/index"

export async function updatePluginConfig(
  request: UpdatePluginConfigRequest
): Promise<UpdatePluginConfigResponse> {
  const { session } = await authorize()

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const parse = UpdatePluginConfigSchema.safeParse(request)

    if (!parse.success) {
      throw new Error("Invalid request parameters")
    }

    const { pluginId, config } = parse.data

    const dbPlugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    })

    if (!dbPlugin) {
      throw new Error("Plugin not found")
    }

    // If the plugin is active and has a configSchema, validate the config
    const activePlugin = pluginMap[dbPlugin.slug]
    if (activePlugin?.configSchema) {
      const configParse = activePlugin.configSchema.safeParse(config)
      if (!configParse.success) {
        throw new Error(
          `Invalid config: ${configParse.error.issues.map((i) => i.message).join(", ")}`
        )
      }
    }

    const plugin = await prisma.plugin.update({
      where: { id: pluginId },
      data: { config },
    })

    return { success: true, data: { plugin } }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  } finally {
    refresh()
  }
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add app/actions/plugins/update-plugin-config.ts
git commit -m "feat: add updatePluginConfig server action"
```

---

## Task 8: Build orchestrator

**Files:**
- Modify: `package.json` (add esbuild, prebuild/predev)
- Create: `scripts/install-plugins.ts`

- [ ] **Step 1: Install esbuild**

```bash
npm install --save-dev esbuild
```

- [ ] **Step 2: Add `prebuild` and `predev` scripts to `package.json`**

Add to the `scripts` section:

```json
"prebuild": "tsx scripts/install-plugins.ts",
"predev": "tsx scripts/install-plugins.ts",
```

- [ ] **Step 3: Create `scripts/install-plugins.ts`**

```ts
import "dotenv/config"
import path from "path"
import fs from "fs"
import { execSync } from "child_process"
import * as esbuild from "esbuild"
import prisma from "@/lib/prisma"
import { PluginStatus } from "@/src/generated/prisma/enums"

const PLUGINS_DIR = path.resolve("plugins")

// ── Helpers ─────────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(`[plugins] ${msg}`)
}

function exec(cmd: string, cwd?: string): string {
  return execSync(cmd, {
    cwd,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  })
}

async function markBroken(id: string, stage: string, message: string) {
  await prisma.plugin.update({
    where: { id },
    data: { status: "broken", errorStage: stage, errorMessage: message },
  })
}

async function markInstalled(id: string, commit: string | null) {
  await prisma.plugin.update({
    where: { id },
    data: {
      status: "installed",
      installedCommit: commit,
      installedAt: new Date(),
      lastSyncAt: new Date(),
      errorStage: null,
      errorMessage: null,
    },
  })
}

function getGithubToken(): string | null {
  // Try to read from DB setting; fall back to env var
  return process.env.GITHUB_TOKEN ?? null
}

function buildRepoUrl(repoUrl: string, token: string | null): string {
  if (!token) return repoUrl
  return repoUrl.replace("https://", `https://${token}@`)
}

// ── Discovery ────────────────────────────────────────────────────────────────

async function discoverBuiltins() {
  if (!fs.existsSync(PLUGINS_DIR)) return

  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
  const dirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)

  for (const slug of dirs) {
    const existing = await prisma.plugin.findUnique({ where: { slug } })
    if (!existing) {
      log(`Auto-registering built-in plugin: ${slug}`)
      await prisma.plugin.create({
        data: {
          slug,
          displayName: slug,
          repoUrl: null,
          enabled: true,
          status: "pending",
        },
      })
    }
  }
}

// ── Validation pipeline ──────────────────────────────────────────────────────

async function cloneOrPull(
  slug: string,
  repoUrl: string,
  branch: string,
  token: string | null
): Promise<string> {
  const dir = path.join(PLUGINS_DIR, slug)
  const authedUrl = buildRepoUrl(repoUrl, token)

  if (fs.existsSync(dir)) {
    exec(`git -C ${dir} pull origin ${branch}`)
  } else {
    exec(`git clone ${authedUrl} -b ${branch} ${dir}`)
  }

  return exec(`git -C ${dir} rev-parse HEAD`).trim()
}

async function npmInstall(slug: string) {
  const dir = path.join(PLUGINS_DIR, slug)
  exec(`npm install --ignore-scripts --prefix ${dir}`)
}

async function buildPlugin(slug: string) {
  const dir = path.join(PLUGINS_DIR, slug)

  const possibleEntries = [
    path.join(dir, "src", "index.ts"),
    path.join(dir, "src", "index.tsx"),
    path.join(dir, "index.ts"),
    path.join(dir, "index.tsx"),
  ]
  const entry = possibleEntries.find((p) => fs.existsSync(p))

  if (!entry) {
    throw new Error(
      "No entry point found. Expected src/index.ts, src/index.tsx, index.ts, or index.tsx"
    )
  }

  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    outfile: path.join(dir, "dist", "index.mjs"),
    external: ["react", "react-dom", "react/jsx-runtime", "zod", "next", "tisane"],
    platform: "browser",
    target: "es2020",
    logLevel: "silent",
    jsx: "automatic",
  })
}

async function validateShape(
  slug: string,
  knownIds: Set<string>
): Promise<void> {
  const distPath = path.resolve(path.join(PLUGINS_DIR, slug, "dist", "index.mjs"))
  // Dynamic import of ESM file
  const mod = await import(`file://${distPath}`)
  const plugin = mod.default

  if (!plugin || typeof plugin !== "object") {
    throw new Error("Plugin must have a default export")
  }
  if (typeof plugin.id !== "string" || !plugin.id) {
    throw new Error("Plugin must have a non-empty string `id`")
  }
  if (!Array.isArray(plugin.components)) {
    throw new Error("Plugin must have a `components` array")
  }

  for (const comp of plugin.components) {
    if (!comp.id || !comp.Schema || !comp.ClientComponent) {
      throw new Error(
        `Component "${comp.id ?? "unknown"}" is missing required fields (id, Schema, ClientComponent)`
      )
    }
    if (knownIds.has(comp.id)) {
      throw new Error(
        `Component ID collision: "${comp.id}" is already registered by a builtin or another plugin`
      )
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log("Starting plugin installation...")

  // Step 1: Auto-register built-in plugins
  await discoverBuiltins()

  // Step 2: Fetch enabled plugins
  const plugins = await prisma.plugin.findMany({
    where: { enabled: true },
  })

  if (plugins.length === 0) {
    log("No enabled plugins — writing empty fallback.")
    writeGeneratedIndex([])
    await prisma.$disconnect()
    return
  }

  log(`Processing ${plugins.length} enabled plugin(s)...`)

  const token = getGithubToken()
  const validSlugs: string[] = []
  const knownComponentIds = new Set<string>()

  for (const plugin of plugins) {
    log(`Processing: ${plugin.slug}`)

    try {
      // Stage 1: Clone/pull (skip for built-ins)
      let commitHash: string | null = null
      if (plugin.repoUrl !== null) {
        try {
          commitHash = await cloneOrPull(plugin.slug, plugin.repoUrl, plugin.branch, token)
        } catch (err) {
          await markBroken(plugin.id, "clone", String(err))
          log(`  ✗ clone failed: ${String(err).split("\n")[0]}`)
          continue
        }
      }

      // Stage 2: npm install
      try {
        await npmInstall(plugin.slug)
      } catch (err) {
        await markBroken(plugin.id, "npm_install", String(err))
        log(`  ✗ npm install failed`)
        continue
      }

      // Stage 3: esbuild
      try {
        await buildPlugin(plugin.slug)
      } catch (err) {
        await markBroken(plugin.id, "syntax", String(err))
        log(`  ✗ build failed: ${String(err).split("\n")[0]}`)
        continue
      }

      // Stage 4: Shape validation
      try {
        await validateShape(plugin.slug, knownComponentIds)
      } catch (err) {
        await markBroken(plugin.id, "shape", String(err))
        log(`  ✗ shape validation failed: ${String(err)}`)
        continue
      }

      // Success
      await markInstalled(plugin.id, commitHash)
      validSlugs.push(plugin.slug)
      log(`  ✓ installed`)

      // Track component IDs to detect future collisions
      const distPath = path.resolve(path.join(PLUGINS_DIR, plugin.slug, "dist", "index.mjs"))
      const mod = await import(`file://${distPath}`)
      for (const comp of mod.default.components ?? []) {
        knownComponentIds.add(comp.id)
      }
    } catch (err) {
      log(`  ✗ unexpected error: ${String(err)}`)
      await markBroken(plugin.id, "shape", String(err))
    }
  }

  log(`Writing plugins/index.ts (${validSlugs.length} active plugin(s))`)
  writeGeneratedIndex(validSlugs)

  await prisma.$disconnect()
  log(`Done. ${validSlugs.length}/${plugins.length} plugin(s) active.`)
}

function writeGeneratedIndex(validSlugs: string[]) {
  const timestamp = new Date().toISOString()

  if (validSlugs.length === 0) {
    fs.writeFileSync(
      path.join("plugins", "index.ts"),
      `// AUTO-GENERATED by scripts/install-plugins.ts — DO NOT EDIT
// Last generated: ${timestamp}
// @ts-nocheck
import type { TisanePlugin } from "tisane"

export const pluginComponents: TisanePlugin["components"] = []
export const pluginCategories: NonNullable<TisanePlugin["categories"]> = []
export const pluginMap: Record<string, TisanePlugin> = {}
`
    )
    return
  }

  const imports = validSlugs
    .map((slug) => {
      const varName = `plugin_${slug.replace(/-/g, "_")}`
      return `import ${varName} from "./${slug}/dist/index.mjs"`
    })
    .join("\n")

  const pluginsArray = validSlugs
    .map((slug) => `plugin_${slug.replace(/-/g, "_")}`)
    .join(", ")

  fs.writeFileSync(
    path.join("plugins", "index.ts"),
    `// AUTO-GENERATED by scripts/install-plugins.ts — DO NOT EDIT
// Last generated: ${timestamp}
// @ts-nocheck
${imports}

const plugins = [${pluginsArray}]

export const pluginComponents = plugins.flatMap((p) => p.components ?? [])
export const pluginCategories = plugins.flatMap((p) => p.categories ?? [])
export const pluginMap = Object.fromEntries(plugins.map((p) => [p.id, p]))
`
  )
}

main().catch((err) => {
  console.error("[plugins] Fatal error:", err)
  process.exit(0) // always exit 0 — don't block the build
})
```

- [ ] **Step 4: Test run the orchestrator**

```bash
tsx scripts/install-plugins.ts
```

Expected output (with no plugins in DB):
```
[plugins] Starting plugin installation...
[plugins] No enabled plugins — writing empty fallback.
[plugins] Done. 0/0 plugin(s) active.
```

- [ ] **Step 5: Verify `plugins/index.ts` was regenerated correctly**

The file should contain the empty fallback with a fresh timestamp.

- [ ] **Step 6: Commit**

```bash
git add scripts/install-plugins.ts package.json package-lock.json plugins/index.ts
git commit -m "feat: add plugin build orchestrator with per-plugin fault isolation"
```

---

## Task 9: PluginStatusBadge + PluginCard components

**Files:**
- Create: `app/admin/(dashboard)/plugins/components/PluginStatusBadge.tsx`
- Create: `app/admin/(dashboard)/plugins/components/PluginCard.tsx`

- [ ] **Step 1: Create `app/admin/(dashboard)/plugins/components/PluginStatusBadge.tsx`**

```tsx
import { PluginStatus } from "@/lib/schemas/PluginsSchema"
import { cn } from "@/lib/utils"

const statusConfig: Record<
  PluginStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  installed: {
    label: "Installed",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  broken: {
    label: "Broken",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  disabled: {
    label: "Disabled",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
}

export function PluginStatusBadge({ status }: { status: PluginStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
```

- [ ] **Step 2: Create `app/admin/(dashboard)/plugins/components/PluginCard.tsx`**

This is a server component — the enable/disable toggle is a form with server action.

```tsx
import Link from "next/link"
import { Plugin } from "@/lib/schemas/PluginsSchema"
import { PluginStatusBadge } from "./PluginStatusBadge"
import { enablePlugin } from "@/app/actions/plugins/enable-plugin"
import { disablePlugin } from "@/app/actions/plugins/disable-plugin"
import { Switch } from "@/components/ui/switch"

export function PluginCard({ plugin }: { plugin: Plugin }) {
  const toggleAction = plugin.enabled
    ? disablePlugin.bind(null, plugin.id)
    : enablePlugin.bind(null, plugin.id)

  return (
    <div className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/admin/plugins/${plugin.id}`}
            className="font-medium hover:underline truncate"
          >
            {plugin.displayName}
          </Link>
          <PluginStatusBadge status={plugin.status} />
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {plugin.repoUrl ?? "Built-in plugin"}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">
          {plugin.slug}
        </p>
      </div>
      <form action={toggleAction}>
        <Switch
          type="submit"
          checked={plugin.enabled}
          aria-label={plugin.enabled ? "Disable plugin" : "Enable plugin"}
        />
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/(dashboard)/plugins/
git commit -m "feat: add PluginStatusBadge and PluginCard components"
```

---

## Task 10: InstallPluginForm

**Files:**
- Create: `app/admin/(dashboard)/plugins/components/InstallPluginForm.tsx`

- [ ] **Step 1: Create `app/admin/(dashboard)/plugins/components/InstallPluginForm.tsx`**

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { installPlugin } from "@/app/actions/plugins/install-plugin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function InstallPluginForm() {
  const router = useRouter()
  const [repoUrl, setRepoUrl] = useState("")
  const [branch, setBranch] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!repoUrl.trim()) return

    setIsPending(true)
    const result = await installPlugin({
      repoUrl: repoUrl.trim(),
      branch: branch.trim() || "main",
      displayName: displayName.trim() || undefined,
    })
    setIsPending(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success("Plugin queued. Run a build to activate it.")
    router.push(`/admin/plugins/${result.data.plugin.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
      <h2 className="font-medium">Install Plugin</h2>
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48">
          <Label htmlFor="repoUrl" className="text-sm mb-1 block">
            GitHub URL
          </Label>
          <Input
            id="repoUrl"
            type="url"
            placeholder="https://github.com/org/my-plugin"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
        </div>
        <div className="w-32">
          <Label htmlFor="branch" className="text-sm mb-1 block">
            Branch
          </Label>
          <Input
            id="branch"
            placeholder="main"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-40">
          <Label htmlFor="displayName" className="text-sm mb-1 block">
            Display name
          </Label>
          <Input
            id="displayName"
            placeholder="Optional"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !repoUrl.trim()}>
          <Plus className="mr-2 h-4 w-4" />
          {isPending ? "Adding..." : "Add Plugin"}
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/(dashboard)/plugins/components/InstallPluginForm.tsx
git commit -m "feat: add InstallPluginForm client component"
```

---

## Task 11: Plugins list page

**Files:**
- Create: `app/admin/(dashboard)/plugins/page.tsx`

- [ ] **Step 1: Create `app/admin/(dashboard)/plugins/page.tsx`**

```tsx
import { authorize } from "@/lib/auth/authorize"
import { redirect } from "next/navigation"
import { getPlugins } from "@/app/actions/plugins/get-plugins"
import { PluginCard } from "./components/PluginCard"
import { InstallPluginForm } from "./components/InstallPluginForm"
import { PluginStatus } from "@/lib/schemas/PluginsSchema"

async function PluginsPage() {
  const { session } = await authorize()

  if (!session || session.user.role !== "admin") {
    redirect("/admin")
  }

  const result = await getPlugins()
  const plugins = result.success ? result.data.plugins : []

  const hasPendingChanges = plugins.some(
    (p) => p.status === PluginStatus.pending
  )

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Plugins</h1>
        <p className="text-lg font-light text-secondary-foreground/70">
          Extend the CMS with custom components and settings.
        </p>
      </div>

      {hasPendingChanges && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400">
          A rebuild is required to apply pending plugin changes.
        </div>
      )}

      <div className="mb-6">
        <InstallPluginForm />
      </div>

      {!result.success && (
        <p className="text-destructive text-sm">
          Failed to load plugins: {result.error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {plugins.map((plugin) => (
          <PluginCard key={plugin.id} plugin={plugin} />
        ))}
        {plugins.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No plugins installed. Add one above.
          </p>
        )}
      </div>
    </div>
  )
}

export default PluginsPage
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/(dashboard)/plugins/page.tsx
git commit -m "feat: add plugins list admin page"
```

---

## Task 12: PluginSettingsRenderer + detail page

**Files:**
- Create: `app/admin/(dashboard)/plugins/components/PluginSettingsRenderer.tsx`
- Create: `app/admin/(dashboard)/plugins/[id]/page.tsx`

- [ ] **Step 1: Create `app/admin/(dashboard)/plugins/components/PluginSettingsRenderer.tsx`**

This is a client component that wraps the plugin's own `SettingsComponent`.

```tsx
"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { TisanePlugin } from "tisane"
import type { Plugin } from "@/lib/schemas/PluginsSchema"
import { updatePluginConfig } from "@/app/actions/plugins/update-plugin-config"

type Props = {
  plugin: Plugin
  activePlugin: TisanePlugin
}

export function PluginSettingsRenderer({ plugin, activePlugin }: Props) {
  const { SettingsComponent } = activePlugin
  const [isSaving, setIsSaving] = useState(false)

  if (!SettingsComponent) {
    return (
      <p className="text-sm text-muted-foreground">
        This plugin has no settings.
      </p>
    )
  }

  const currentConfig = (plugin.config ?? {}) as Record<string, unknown>

  async function handleSave(newConfig: unknown) {
    setIsSaving(true)
    const result = await updatePluginConfig({
      pluginId: plugin.id,
      config: newConfig as Record<string, unknown>,
    })
    setIsSaving(false)

    if (!result.success) {
      toast.error(result.error)
    } else {
      toast.success("Settings saved")
    }
  }

  return (
    <SettingsComponent
      config={currentConfig}
      onSave={handleSave}
      isSaving={isSaving}
    />
  )
}
```

- [ ] **Step 2: Create `app/admin/(dashboard)/plugins/[id]/page.tsx`**

```tsx
import { authorize } from "@/lib/auth/authorize"
import { redirect, notFound } from "next/navigation"
import { getPlugin } from "@/app/actions/plugins/get-plugin"
import { deletePlugin } from "@/app/actions/plugins/delete-plugin"
import { enablePlugin } from "@/app/actions/plugins/enable-plugin"
import { disablePlugin } from "@/app/actions/plugins/disable-plugin"
import { PluginStatusBadge } from "../components/PluginStatusBadge"
import { PluginSettingsRenderer } from "../components/PluginSettingsRenderer"
import { pluginMap } from "@/plugins/index"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import fs from "fs"
import path from "path"

type Props = { params: Promise<{ id: string }> }

async function PluginDetailPage({ params }: Props) {
  const { id } = await params
  const { session } = await authorize()

  if (!session || session.user.role !== "admin") {
    redirect("/admin")
  }

  const result = await getPlugin({ pluginId: id })

  if (!result.success) {
    notFound()
  }

  const plugin = result.data.plugin
  const activePlugin = pluginMap[plugin.slug] ?? null

  // Read README if it exists
  const readmePath = path.join(process.cwd(), "plugins", plugin.slug, "README.md")
  const readme = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, "utf-8")
    : null

  const toggleAction = plugin.enabled
    ? disablePlugin.bind(null, plugin.id)
    : enablePlugin.bind(null, plugin.id)

  const deleteAction = deletePlugin.bind(null, plugin.id)

  return (
    <div className="h-full w-full max-w-3xl flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/plugins" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-semibold">{plugin.displayName}</h1>
        <PluginStatusBadge status={plugin.status} />
      </div>

      {/* Error card */}
      {plugin.status === "broken" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
          <div className="flex items-center gap-2 mb-2 text-red-800 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Build failed at stage: {plugin.errorStage}</span>
          </div>
          <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap overflow-auto max-h-48 font-mono">
            {plugin.errorMessage}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border bg-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Enabled</span>
          <form action={toggleAction}>
            <Switch
              type="submit"
              checked={plugin.enabled}
              aria-label={plugin.enabled ? "Disable plugin" : "Enable plugin"}
            />
          </form>
        </div>
        {plugin.enabled !== (plugin.status === "installed") && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            A rebuild is required to apply this change.
          </p>
        )}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Repository</dt>
          <dd className="font-mono text-xs truncate">{plugin.repoUrl ?? "Built-in"}</dd>
          <dt className="text-muted-foreground">Branch</dt>
          <dd>{plugin.branch}</dd>
          <dt className="text-muted-foreground">Installed commit</dt>
          <dd className="font-mono text-xs">{plugin.installedCommit?.slice(0, 7) ?? "—"}</dd>
          <dt className="text-muted-foreground">Last sync</dt>
          <dd>{plugin.lastSyncAt ? new Date(plugin.lastSyncAt).toLocaleString() : "—"}</dd>
          {activePlugin && (
            <>
              <dt className="text-muted-foreground">Version</dt>
              <dd>{activePlugin.version}</dd>
            </>
          )}
        </dl>
      </div>

      {/* README */}
      {readme && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-medium mb-3">README</h2>
          <details>
            <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
              Show README
            </summary>
            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96 font-mono">
              {readme}
            </pre>
          </details>
        </div>
      )}

      {/* Plugin settings */}
      {activePlugin && plugin.status === "installed" && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-medium mb-3">Plugin Settings</h2>
          <PluginSettingsRenderer plugin={plugin} activePlugin={activePlugin} />
        </div>
      )}

      {/* Danger zone */}
      {plugin.repoUrl !== null && (
        <div className="rounded-lg border border-destructive/30 bg-card p-4">
          <h2 className="font-medium text-destructive mb-3">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete plugin</p>
              <p className="text-xs text-muted-foreground">
                Removes the plugin record. Built-in plugins cannot be deleted.
              </p>
            </div>
            <form action={deleteAction}>
              <Button type="submit" variant="destructive" size="sm">
                Delete
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PluginDetailPage
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/(dashboard)/plugins/components/PluginSettingsRenderer.tsx app/admin/(dashboard)/plugins/[id]/
git commit -m "feat: add plugin detail page with settings renderer"
```

---

## Task 13: Sidebar update + commit spec doc

**Files:**
- Modify: `app/admin/(dashboard)/components/Sidebar.tsx`

- [ ] **Step 1: Add `Blocks` icon import to `Sidebar.tsx`**

In the existing lucide-react import at the top of `Sidebar.tsx`, add `Blocks`:

```ts
import {
  Activity,
  Blocks,         // ← add this
  FileText,
  Image,
  LayoutDashboard,
  Menu,
  Settings2,
  UserCircle2,
  Box,
  type LucideIcon,
  ChevronsUpDown,
  LogOut,
  Bug,
} from "lucide-react"
```

- [ ] **Step 2: Add Plugins to the Design group in `groups`**

Find the `Design` group in the `groups` array (currently contains Menus and Components). Add Plugins after Menus:

```ts
{
  label: "Design",
  items: [
    { label: "Menus", href: "/admin/menus", icon: Menu },
    { label: "Plugins", href: "/admin/plugins", icon: Blocks, roles: ["admin"] },
    { label: "Components", href: "/admin/components", icon: Box },
  ],
},
```

- [ ] **Step 3: Commit spec doc and sidebar**

```bash
git add app/admin/(dashboard)/components/Sidebar.tsx \
        docs/superpowers/specs/2026-03-30-plugin-support-design.md \
        docs/superpowers/plans/2026-03-30-plugin-support.md
git commit -m "feat: add Plugins to admin sidebar + commit spec and plan docs"
```

---

## Task 14: Final build verification

- [ ] **Step 1: Run the full build**

```bash
npm run build
```

Expected: Build completes successfully. The `prebuild` hook runs the orchestrator first (no plugins, clean output), then `next build` compiles without errors.

- [ ] **Step 2: Check for TypeScript errors independently**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules"
```

Expected: No errors.

- [ ] **Step 3: Verify the plugins admin route exists**

```bash
ls app/admin/\(dashboard\)/plugins/
```

Expected: `page.tsx`, `components/`, `[id]/`

- [ ] **Step 4: If build errors exist, fix them before proceeding**

Common issues:
- `Switch` component used as a form submit button — if `@radix-ui/react-switch` doesn't accept `type="submit"`, wrap with a `<button type="submit">` instead
- `pluginMap` import in `update-plugin-config.ts` may cause circular dependency warnings — verify it's fine at runtime
- README rendering uses `<pre>` for raw text; if the project has a markdown renderer installed, prefer it

---

## Self-Review Notes

**Spec coverage check:**

| Spec requirement | Covered in |
|---|---|
| `packages/tisane` with `definePlugin` | Task 1 |
| `Plugin` DB model + PluginStatus enum | Task 2 |
| Registry extensibility with PLUGIN_REGISTRY | Task 3 |
| Build orchestrator with per-plugin fault isolation | Task 8 |
| Auto-discovery of built-in plugins | Task 8 (discoverBuiltins) |
| DB marks broken plugins with errorStage/errorMessage | Task 8 |
| Admin list page + install form | Tasks 9–11 |
| Admin detail page with error card, info, README, settings, danger zone | Task 12 |
| Sidebar Plugins entry (admin-only) | Task 13 |
| `updatePluginConfig` validates against configSchema | Task 7 |
| Built-ins cannot be deleted | Task 6 (deletePlugin) |
| Rebuild warning banner | Task 11 (list page) |
| tsconfig excludes plugins/*/node_modules | Task 1 |

**Known limitations of this plan:**
- README is rendered as `<pre>` (raw text). If `react-markdown` or similar is added later, swap it in `[id]/page.tsx`.
- The `Switch` component is used as a form submit — if Radix Switch doesn't support `type="submit"`, replace the form+switch pattern with a client component that calls the action directly.
- Plugin components that need `"use client"` must include that directive in their source. This is a plugin authoring concern, not a build-time issue.
