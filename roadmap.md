# Roadmap: Custom CMS for AGH IT Future Day

This roadmap outlines the steps to build a custom Content Management System (CMS) for the `tisane` project. The goal is to replace hardcoded content with dynamic data managed via a secure admin dashboard.

## Phase 1: Core Foundation & Architecture

**Goal:** Establish the base infrastructure for a secure and scalable CMS.

- [ ] **Database & ORM Setup** ([#41](https://github.com/dkomeza/tisane/issues/41))
      Establish the persistence layer for the CMS. We will use PostgreSQL as the relational database due to its robustness and support for JSONB, which is crucial for storing dynamic block content. Drizzle ORM will be used for type-safe database interactions and schema management.

  - [ ] Initialize PostgreSQL (Supabase/Neon).
  - [ ] Install and configure Drizzle ORM.
  - [ ] Design `Users` schema (Admin, Editor, Viewer roles).
  - [ ] Design `Sites` schema (for multi-tenancy support).
  - [ ] Design `Settings` schema (Global key-value store).

- [ ] **Authentication System** ([#42](https://github.com/dkomeza/tisane/issues/42))
      Secure the admin dashboard with a robust authentication system. This involves setting up a secure login flow, managing sessions, and implementing Role-Based Access Control (RBAC) to ensure that only authorized users can access sensitive configuration and content management features.
  - [ ] Install NextAuth.js or Better Auth.
  - [ ] Create Admin Login page.
  - [ ] Implement Role-Based Access Control (RBAC) middleware.
  - [ ] Protect `/admin` routes.

## Phase 2: The Content Engine

**Goal:** Enable dynamic creation of pages and navigation structures.

- [ ] **Dynamic Page Management** ([#43](https://github.com/dkomeza/tisane/issues/43))
      Develop the core CRUD (Create, Read, Update, Delete) interface for managing website pages. This includes defining the data model for a page, which will store metadata (slug, title, SEO tags) and the actual content structure (JSON blocks). The admin interface should allow for easy creation and editing of these pages.

  - [ ] Create `Pages` schema (title, slug, content_json, status, seo_metadata).
  - [ ] Build Admin List View for pages.
  - [ ] Build Admin Edit/Create View for pages.
  - [ ] Implement soft delete/archive functionality.

- [ ] **Dynamic Routing** ([#44](https://github.com/dkomeza/tisane/issues/44))
      Implement the frontend routing logic to render pages dynamically based on their slug. This involves using Next.js dynamic routes (`[...slug]`) to catch all incoming requests, look up the corresponding page in the database, and render the appropriate content. This system must also handle 404 errors and generate correct metadata for SEO.

  - [ ] Create catch-all route `app/[...slug]/page.tsx`.
  - [ ] Implement `generateMetadata` for SEO.
  - [ ] Fetch page data from DB based on slug.
  - [ ] Handle 404s for non-existent pages.

- [ ] **Navigation System** ([#45](https://github.com/dkomeza/tisane/issues/45))
      Create a flexible system for managing site navigation menus. Admins should be able to create multiple menus (e.g., Main Header, Footer, Sidebar) and manage their structure using a drag-and-drop interface. The system needs to support nested items and linking to internal pages or external URLs.
  - [ ] Create `Menus` and `MenuItems` schemas.
  - [ ] Build a Menu Builder UI (drag-and-drop nesting).
  - [ ] Expose API to fetch menus by location (e.g., header, footer).

## Phase 3: Block-Based Editor (The "Builder")

**Goal:** Create a visual editing experience for constructing page layouts.

- [ ] **Block System Architecture** ([#46](https://github.com/dkomeza/tisane/issues/46))
      Design the underlying data structure for the block-based editor. The content of each page will be stored as a JSON array of "blocks". We need to define a standard interface for these blocks and create a registry that maps JSON block types (e.g., "hero", "text", "image") to their corresponding React components for rendering.

  - [ ] Define JSON structure for page content (list of blocks).
  - [ ] Create a **Component Registry** to map JSON types to React components.
  - [ ] Implement base "Block" interface/types.

- [ ] **Editor UI** ([#47](https://github.com/dkomeza/tisane/issues/47))
      Build the user interface for the page builder. This is the core "CMS" experience where users construct pages. It requires a visual picker to add new blocks, a property editor sidebar to configure block settings (text content, colors, alignment), and drag-and-drop functionality to reorder blocks on the page.

  - [ ] Implement a visual Block Picker (sidebar or modal).
  - [ ] Build Property Editors for blocks (text, color, alignment).
  - [ ] Implement drag-and-drop reordering of blocks.
  - [ ] _Stretch Goal:_ Live preview in the editor.

- [ ] **Media Library** ([#48](https://github.com/dkomeza/tisane/issues/48))
      Develop a centralized media library to manage assets like images, videos, and documents. This system will handle file uploads to an object storage provider (like Supabase Storage or AWS S3), provide a gallery view for browsing and searching assets, and integrate directly with the block editor for easy image selection.
  - [ ] Create `Media` schema for tracking uploads.
  - [ ] Implement file upload API (Supabase Storage / Uploadthing).
  - [ ] Build Media Gallery UI for selecting images.
  - [ ] Integrate Media Picker into the Block Editor.

## Phase 4: Customization & Theming

**Goal:** Allow users to control the look and feel without code changes.

- [ ] **Global Site Settings** ([#49](https://github.com/dkomeza/tisane/issues/49))
      Implement a settings management system for global site configuration. This includes basic identity settings (Site Title, Description, Logo, Favicon) as well as default SEO settings (Open Graph images, Twitter card types). These settings should be easily accessible via an API for use throughout the frontend.

  - [ ] Build Settings UI for Site Title, Favicon, Logo.
  - [ ] Implement SEO Defaults (OG Images, Twitter Cards).
  - [ ] Create API to fetch global settings.

- [ ] **Theme System** ([#50](https://github.com/dkomeza/tisane/issues/50))
      Create a theming engine that allows admins to customize the visual appearance of the site without writing code. This involves defining a set of "Design Tokens" (primary colors, font families, border radii) that are stored in the database and injected into the frontend as CSS variables or Tailwind configuration.
  - [ ] Create schema for Design Tokens (Colors, Fonts, Radius).
  - [ ] Build Theme Editor UI.
  - [ ] Implement dynamic CSS variable generation based on DB values.

## Phase 5: Advanced Features & Polish

**Goal:** Production readiness and developer experience.

- [ ] **Publishing Workflow** ([#51](https://github.com/dkomeza/tisane/issues/51))
      Implement a robust publishing workflow to give content editors control over when changes go live. This includes distinguishing between "Draft" and "Published" states for pages, allowing users to preview changes in a secure environment before they are visible to the public.

  - [ ] Implement Draft vs. Published states.
  - [ ] Build "Preview" mode for viewing drafts without publishing.
  - [ ] Add "Scheduled Publishing" (optional).

- [ ] **Performance** ([#52](https://github.com/dkomeza/tisane/issues/52))
      Optimize the CMS and the generated sites for maximum performance. This involves leveraging Next.js features like Incremental Static Regeneration (ISR) to cache pages at the edge, and implementing on-demand revalidation hooks to update the cache immediately when content is changed in the CMS.

  - [ ] Implement ISR (Incremental Static Regeneration).
  - [ ] Add on-demand revalidation hooks for the CMS.
  - [ ] Optimize images using Next.js Image component.
