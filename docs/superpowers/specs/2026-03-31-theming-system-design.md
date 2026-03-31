# Theming System Design

## Context

Tisane CMS currently has hardcoded design tokens (colors, typography, spacing) in `globals.css` with only dark/light mode toggling via `next-themes`. There is no way for site administrators to customize the visual appearance of public-facing pages without editing code.

This design introduces a theming system that allows:
- **Theme developers** to create installable design token packages
- **CMS admins** to browse a theme gallery, activate themes, and fine-tune token values through the admin UI
- **Instant switching** without rebuilds — tokens are injected at runtime during SSR

## Approach: Runtime CSS Injection

Theme tokens are stored in the database, merged with admin overrides, and injected as a `<style>` tag during server-side rendering. This provides instant theme switching and override application with zero flash of unstyled content (FOUC).

## Theme Definition

Themes are a specialized subtype of the existing plugin system (`type: "theme"`). A theme exports a structured token object:

```ts
// tisane-theme-midnight/src/index.ts
import { defineTheme } from "tisane";

export default defineTheme({
  id: "midnight",
  displayName: "Midnight Blue",
  version: "1.0.0",
  tokens: {
    light: {
      background: "oklch(0.98 0.01 250)",
      foreground: "oklch(0.15 0.02 250)",
      primary: "oklch(0.45 0.2 260)",
      "primary-foreground": "oklch(0.98 0 0)",
      // ... partial — only override what you need
    },
    dark: {
      background: "oklch(0.08 0.02 250)",
      foreground: "oklch(0.98 0 0)",
      primary: "oklch(0.65 0.2 260)",
      // ...
    },
    radius: "0.5rem",
    typography: {
      "heading-1": "3.5rem",
      "heading-2": "2.625rem",
    },
  },
});
```

## Token Schema

### Semantic color tokens

Both `light` and `dark` maps can include any of these keys (all are optional — unspecified tokens fall through to `globals.css` defaults):

- `background`, `foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `destructive`
- `border`, `input`, `ring`

### Optional brand color tokens

- `brand-orange-100` through `brand-orange-500`
- `brand-pink-100` through `brand-pink-500`
- `brand-purple-100` through `brand-purple-500`
- `brand-grey-100` through `brand-grey-600`

### Optional chart color tokens

- `chart-1` through `chart-5`

### Typography tokens

- `heading-1` through `heading-6`
- `body-l`, `body-m`, `body-s`, `body-micro`

### Spacing tokens

- `radius` — base border radius (sm/md/lg/xl are derived)
- `container-sm`, `container-md`, `container-lg`, `container-xl`, `container-2xl`

### Validation rules

- Color values must be valid CSS color strings (OKLCh encouraged)
- Typography/spacing values must be valid CSS length strings
- All token maps are partial — themes override only what they want
- Validated with Zod at install time

## Data Model

### Plugin model extensions

```prisma
model Plugin {
  // ... existing fields
  type            String  @default("component")  // "component" | "theme"
  themeOverrides  Json?                           // per-theme admin overrides
}
```

### Settings

- `active_theme` — slug of the currently active theme plugin (stored in the `Setting` key-value table)

### Token storage

- **Base tokens**: Extracted from the theme's export and stored in `Plugin.config` during installation
- **Admin overrides**: Stored in `Plugin.themeOverrides` (separate from config, per-theme)

## CSS Injection Pipeline

### `getActiveThemeCSS()` server function

1. Read `active_theme` setting from DB
2. Fetch the theme plugin's base tokens from `Plugin.config`
3. Fetch admin overrides from `Plugin.themeOverrides`
4. Deep-merge: `globals.css defaults → base tokens → admin overrides`
5. Generate CSS string with `:root { ... }` and `.dark { ... }` blocks
6. Cached with Next.js `"use cache"` and tagged `"active-theme"`

### Root layout injection

```tsx
// app/layout.tsx
export default async function RootLayout({ children }) {
  const themeCSS = await getActiveThemeCSS();
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        {themeCSS && (
          <style id="tisane-theme" dangerouslySetInnerHTML={{ __html: themeCSS }} />
        )}
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Suspense>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Cascade order

`globals.css` (defaults) → `<style id="tisane-theme">` (overrides). CSS custom properties naturally cascade — theme tokens win.

### Default state

When no theme is active, the `<style>` tag is not rendered. The site uses `globals.css` defaults — zero-config baseline.

## `@theme static` Migration

Current `@theme static` blocks in `globals.css` define brand colors and typography as literal values. These must be converted to `@theme inline` with CSS variable indirection for runtime overrideability:

```css
/* Before */
@theme static {
  --text-heading-1: 3.5rem;
  --color-brand-orange-100: #efbfc2;
}

/* After */
@theme inline {
  --text-heading-1: var(--heading-1);
  --color-brand-orange-100: var(--brand-orange-100);
}
:root {
  --heading-1: 3.5rem;
  --brand-orange-100: #efbfc2;
}
```

This is a one-time migration. After this, all tokens are runtime-overridable.

## Plugin System Integration

### Type definitions

```ts
// packages/tisane/src/types.ts

export type ThemeTokens = {
  light?: Record<string, string>;
  dark?: Record<string, string>;
  radius?: string;
  typography?: Record<string, string>;
  containers?: Record<string, string>;
};

export type TisaneTheme = {
  id: string;
  displayName: string;
  version: string;
  type: "theme";
  tokens: ThemeTokens;
  configSchema?: z.ZodType;
  SettingsComponent?: FC<PluginSettingsProps>;
};
```

A `defineTheme()` helper validates and returns the typed object.

### Install pipeline changes (`scripts/install-plugins.ts`)

- Shape validation branches on `plugin.type`:
  - `"theme"` → validate `tokens` shape (must have valid token keys/values)
  - `"component"` (default) → existing validation (requires `components[]`)
- Theme tokens stored in `Plugin.config` after validation
- Generated `plugins/index.ts` exports `themeMap` alongside `pluginMap`

### Backward compatibility

Existing component plugins have `type: "component"` by default. No changes needed.

## Theme Switching

1. Admin opens theme gallery → clicks "Activate"
2. Server action updates `active_theme` setting
3. Calls `revalidateTag("active-theme")` to bust cache
4. Next page load picks up new theme tokens via SSR

## Dark/Light Mode

- Each theme provides both `light` and `dark` token maps
- Injected `<style>` contains both `:root { ... }` and `.dark { ... }` blocks
- `next-themes` continues to toggle `.dark` class independently
- If a theme only provides `light` tokens, dark mode falls back to `globals.css` defaults

## Admin UI (v1)

### Theme gallery page (`/admin/themes`)

- Lists all installed theme-type plugins as cards
- Shows: theme name, version, color swatch preview from primary/secondary/accent tokens
- "Active" badge on the current theme
- Activate/deactivate buttons

### Theme detail page (`/admin/themes/[id]`)

- JSON editor for token overrides (reuses the pattern from plugin config settings)
- "Reset to defaults" button
- Save persists to `Plugin.themeOverrides` and revalidates cache

### Sidebar

- New "Themes" entry with palette icon, below Plugins

### Future iterations

- Color pickers with OKLCh support
- Typography dropdowns
- Spacing/radius sliders
- Live preview panel

## Key Files to Modify

- `styles/globals.css` — migrate `@theme static` to `@theme inline` with variable indirection
- `packages/tisane/src/types.ts` — add `TisaneTheme`, `ThemeTokens`, `defineTheme()`
- `scripts/install-plugins.ts` — add theme validation branch, token extraction, `themeMap` export
- `plugins/index.ts` — (auto-generated) add `themeMap` export
- `prisma/models/plugins.prisma` — add `type` and `themeOverrides` fields
- `app/layout.tsx` — add `getActiveThemeCSS()` call and `<style>` injection
- `lib/themes/` — new directory for `getActiveThemeCSS()`, token merging, CSS generation
- `app/admin/(dashboard)/themes/` — new gallery and detail pages
- `app/admin/(dashboard)/components/Sidebar.tsx` — add Themes entry
- `app/actions/themes/` — server actions for activate, update overrides

## Verification

1. **Install a test theme**: Create a minimal theme plugin with a few color overrides, install it via the plugin system
2. **Activate via admin UI**: Open the theme gallery, activate the test theme
3. **Check public pages**: Verify the site renders with the new tokens (inspect `<style id="tisane-theme">` in the HTML source)
4. **Dark/light mode**: Toggle dark mode — verify both modes use theme tokens
5. **Admin overrides**: Edit overrides via JSON editor, save, refresh the site — verify overrides apply on top of base theme
6. **Switch themes**: Activate a different theme, verify the site updates without rebuild
7. **No theme active**: Deactivate all themes, verify the site falls back to `globals.css` defaults
8. **SSR check**: View page source — verify the `<style>` tag is present in the initial HTML (no FOUC)
