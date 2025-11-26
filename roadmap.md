# Roadmap: Custom CMS for AGH IT Future Day

This roadmap outlines the steps to build a custom Content Management System (CMS) for the `tisane` project. The goal is to replace hardcoded content with dynamic data managed via a secure admin dashboard. 

## Phase 1: Core Foundation & Architecture

**Goal:** Establish the base infrastructure for a secure and scalable CMS.

- [ ] **Database & ORM Setup** ([#16](https://github.com/dkomeza/tisane/issues/16))
  - [ ] Initialize PostgreSQL (Supabase/Neon) with Drizzle ORM.
  - [ ] Design Core Schemas:
    - [ ] `Users` (Admin, Editor, Viewer roles).
    - [ ] `Sites` (Optional: for multi-tenancy support).
    - [ ] `Settings` (Global key-value store for site config).
- [ ] **Authentication System** ([#17](https://github.com/dkomeza/tisane/issues/17))
  - [ ] Implement secure Admin Login (NextAuth/Better Auth).
  - [ ] Role-Based Access Control (RBAC) middleware.

## Phase 2: The Content Engine

**Goal:** Enable dynamic creation of pages and navigation structures.

- [ ] **Dynamic Page Management** ([#18](https://github.com/dkomeza/tisane/issues/18))
  - [ ] Create `Pages` schema (title, slug, content_json, status, seo_metadata).
  - [ ] Implement Admin CRUD for Pages.
  - [ ] **Dynamic Routing** ([#19](https://github.com/dkomeza/tisane/issues/19))
- [ ] **Navigation System** ([#20](https://github.com/dkomeza/tisane/issues/20))
  - [ ] Create `Menus` and `MenuItems` schemas.
  - [ ] Build a Menu Builder UI (drag-and-drop nesting).

## Phase 3: Block-Based Editor (The "Builder")

**Goal:** Create a visual editing experience for constructing page layouts.

- [ ] **Block System Architecture** ([#21](https://github.com/dkomeza/tisane/issues/21))
  - [ ] Define a JSON structure for storing page content (e.g., list of blocks).
  - [ ] Create a **Component Registry**: Map JSON block types (e.g., `hero`, `text`, `gallery`) to React components.
- [ ] **Editor UI** ([#22](https://github.com/dkomeza/tisane/issues/22))
  - [ ] Implement a visual block picker.
  - [ ] Build property editors for blocks (e.g., changing text color, alignment, background).
  - [ ] _Stretch Goal:_ Live preview in the editor.
- [ ] **Media Library** ([#23](https://github.com/dkomeza/tisane/issues/23))
  - [ ] `Media` schema for tracking uploads.
  - [ ] UI for uploading, searching, and selecting images/files.

## Phase 4: Customization & Theming

**Goal:** Allow users to control the look and feel without code changes.

- [ ] **Global Site Settings** ([#24](https://github.com/dkomeza/tisane/issues/24))
  - [ ] UI to manage Site Title, Favicon, Logo.
  - [ ] SEO Defaults (OG Images, Twitter Cards).
- [ ] **Theme System** ([#25](https://github.com/dkomeza/tisane/issues/25))
  - [ ] Configurable Design Tokens (Colors, Fonts, Radius) stored in DB.
  - [ ] Dynamic CSS variable generation based on settings.

## Phase 5: Advanced Features & Polish

**Goal:** Production readiness and developer experience.

- [ ] **Publishing Workflow** ([#26](https://github.com/dkomeza/tisane/issues/26))
  - [ ] Draft vs. Published states.
  - [ ] Preview mode for drafts.
- [ ] **Performance** ([#27](https://github.com/dkomeza/tisane/issues/27))
  - [ ] ISR (Incremental Static Regeneration) for high performance.
  - [ ] On-demand revalidation hooks.
- [ ] **Plugin/Module API (Future)** ([#28](https://github.com/dkomeza/tisane/issues/28))
  - [ ] Structure for adding custom content types (e.g., "Portfolio Projects", "Products") without altering core code.
