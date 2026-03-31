import "dotenv/config"
import path from "path"
import fs from "fs"
import { execSync } from "child_process"
import * as esbuild from "esbuild"
import prisma from "@/lib/prisma"
import { validateThemeTokens } from "@/lib/themes/validate-tokens"

const PLUGINS_DIR = path.resolve("plugins")

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

function cloneOrPull(slug: string, repoUrl: string, branch: string): string {
  const dir = path.join(PLUGINS_DIR, slug)

  if (fs.existsSync(dir)) {
    exec(`git -C "${dir}" pull origin ${branch}`)
  } else {
    exec(`git clone "${repoUrl}" -b "${branch}" "${dir}"`)
  }

  return exec(`git -C "${dir}" rev-parse HEAD`).trim()
}

function npmInstall(slug: string) {
  const dir = path.join(PLUGINS_DIR, slug)
  // Only run if package.json exists
  if (fs.existsSync(path.join(dir, "package.json"))) {
    exec(`npm install --ignore-scripts --prefix "${dir}"`)
  }
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

  const outfile = path.join(dir, "dist", "index.mjs")
  fs.mkdirSync(path.dirname(outfile), { recursive: true })

  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    outfile,
    external: ["react", "react-dom", "react/jsx-runtime", "zod", "next", "tisane"],
    platform: "browser",
    target: "es2020",
    logLevel: "silent",
    jsx: "automatic",
  })
}

async function validateShape(slug: string, knownIds: Set<string>): Promise<void> {
  const distPath = path.resolve(path.join(PLUGINS_DIR, slug, "dist", "index.mjs"))
  const mod = await import(`file://${distPath}`)
  const plugin = mod.default

  if (!plugin || typeof plugin !== "object") {
    throw new Error("Plugin must have a default export")
  }
  if (typeof plugin.id !== "string" || !plugin.id) {
    throw new Error("Plugin must have a non-empty string `id`")
  }

  // Theme plugins: validate tokens instead of components
  if (plugin.type === "theme") {
    validateThemeTokens(plugin.tokens)
    return
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

  await discoverBuiltins()

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

  const validSlugs: string[] = []
  const knownComponentIds = new Set<string>()

  for (const plugin of plugins) {
    log(`Processing: ${plugin.slug}`)

    try {
      // Stage 1: Clone/pull (skip for built-ins)
      let commitHash: string | null = null
      if (plugin.repoUrl !== null) {
        try {
          commitHash = cloneOrPull(plugin.slug, plugin.repoUrl, plugin.branch)
        } catch (err) {
          await markBroken(plugin.id, "clone", String(err))
          log(`  ✗ clone failed: ${String(err).split("\n")[0]}`)
          continue
        }
      }

      // Stage 2: npm install
      try {
        npmInstall(plugin.slug)
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
      const distPath = path.resolve(path.join(PLUGINS_DIR, plugin.slug, "dist", "index.mjs"))
      const mod = await import(`file://${distPath}`)
      const pluginType = mod.default.type === "theme" ? "theme" : "component"

      // Store theme tokens in config, update type
      const updateData: Record<string, unknown> = { type: pluginType }
      if (pluginType === "theme") {
        updateData.config = mod.default.tokens
      }
      await prisma.plugin.update({ where: { id: plugin.id }, data: updateData })

      await markInstalled(plugin.id, commitHash)
      validSlugs.push(plugin.slug)
      log(`  ✓ installed (${pluginType})`)

      // Track component IDs for collision detection (component plugins only)
      if (pluginType === "component") {
        for (const comp of mod.default.components ?? []) {
          knownComponentIds.add(comp.id)
        }
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
import type { TisanePlugin, TisaneTheme } from "tisane"

export const pluginComponents: TisanePlugin["components"] = []
export const pluginCategories: NonNullable<TisanePlugin["categories"]> = []
export const pluginMap: Record<string, TisanePlugin> = {}
export const themeMap: Record<string, TisaneTheme> = {}
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
import type { TisanePlugin, TisaneTheme } from "tisane"
${imports}

const all = [${pluginsArray}]

const plugins = all.filter((p) => p.type !== "theme")
const themes = all.filter((p) => p.type === "theme")

export const pluginComponents = plugins.flatMap((p) => p.components ?? [])
export const pluginCategories = plugins.flatMap((p) => p.categories ?? [])
export const pluginMap: Record<string, TisanePlugin> = Object.fromEntries(plugins.map((p) => [p.id, p]))
export const themeMap: Record<string, TisaneTheme> = Object.fromEntries(themes.map((t) => [t.id, t]))
`
  )
}

main().catch((err) => {
  console.error("[plugins] Fatal error:", err)
  process.exit(0) // always exit 0 — don't block the build
})
