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
