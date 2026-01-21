├── app
│   ├── [[...slug]]
│   │   ├── page.tsx
│   │   └── PageContentRenderer.tsx
│   ├── actions
│   │   ├── media
│   │   │   ├── media.ts
│   │   │   └── view-action.ts
│   │   ├── menus
│   │   │   ├── create-menu.ts
│   │   │   ├── delete-menu.ts
│   │   │   ├── get-menu-by-slug.ts
│   │   │   ├── get-menu.ts
│   │   │   ├── get-menus.ts
│   │   │   └── update-menu.ts
│   │   └── pages
│   │       ├── create-page.ts
│   │       ├── delete-page.ts
│   │       ├── get-page.ts
│   │       ├── get-pages.ts
│   │       └── update-page.ts
│   ├── admin
│   │   ├── (auth)
│   │   │   ├── forgot-password
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password
│   │   │   │   ├── components
│   │   │   │   │   └── ResetPasswordForm.tsx
│   │   │   │   └── page.tsx
│   │   │   └── signup
│   │   │       ├── actions
│   │   │       │   └── signup-user.ts
│   │   │       ├── components
│   │   │       │   ├── PasswordChecklist.tsx
│   │   │       │   └── SignupForm.tsx
│   │   │       └── page.tsx
│   │   ├── (dashboard)
│   │   │   ├── components
│   │   │   │   ├── [id]
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── preview-wrapper.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── media
│   │   │   │   └── page.tsx
│   │   │   ├── menus
│   │   │   │   ├── [id]
│   │   │   │   │   └── edit
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── components
│   │   │   │   │   ├── DeleteMenuDialog.tsx
│   │   │   │   │   ├── MenuForm.tsx
│   │   │   │   │   └── MenuTable.tsx
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── pages
│   │   │   │   ├── [id]
│   │   │   │   │   └── edit
│   │   │   │   │       ├── EditPageClient.tsx
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── components
│   │   │   │   │   ├── ContentPreview.tsx
│   │   │   │   │   ├── DeletePageDialog.tsx
│   │   │   │   │   ├── PageForm.tsx
│   │   │   │   │   └── PageTable.tsx
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── users
│   │   │       ├── components
│   │   │       │   ├── AddUserDialog.tsx
│   │   │       │   ├── Checkbox.tsx
│   │   │       │   ├── DeleteUserDialog.tsx
│   │   │       │   ├── EditUserDialog.tsx
│   │   │       │   └── UserTable.tsx
│   │   │       ├── functions
│   │   │       │   ├── delete-user.ts
│   │   │       │   ├── edit-user.ts
│   │   │       │   ├── invite-user.ts
│   │   │       │   ├── resend-invite.ts
│   │   │       │   └── utils.ts
│   │   │       └── page.tsx
│   │   └── onboarding
│   │       ├── actions
│   │       │   └── complete-onboarding.ts
│   │       ├── components
│   │       │   └── OnboardingWizard.tsx
│   │       └── page.tsx
│   ├── api
│   │   └── auth
│   │       └── [...all]
│   │           └── route.ts
│   ├── components
│   │   ├── ModeToggle.tsx
│   │   ├── Navbar.tsx
│   │   ├── Signet.tsx
│   │   └── ThemeProvider.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── preview
│   │   └── [[...slug]]
│   │       ├── page.tsx
│   │       └── Preview.tsx
│   └── sections
│       ├── About.tsx
│       ├── Competition.tsx
│       ├── Contact.tsx
│       ├── Hero.tsx
│       ├── Highlights.tsx
│       ├── index.ts
│       ├── Organizers.tsx
│       ├── TargetAudience.tsx
│       ├── Topics.tsx
│       └── WhyParticipate.tsx
├── components
│   ├── emails
│   │   └── InviteUserEmail.tsx
│   ├── media
│   │   └── UploadZone.tsx
│   ├── Menu.tsx
│   ├── registry
│   │   ├── CMSStore.ts
│   │   ├── elements
│   │   │   ├── button
│   │   │   │   └── index.tsx
│   │   │   ├── cms-link
│   │   │   │   ├── CmsLinkAdmin.tsx
│   │   │   │   └── index.tsx
│   │   │   └── underlined-card
│   │   │       ├── index.tsx
│   │   │       ├── UnderlinedCardAdmin.tsx
│   │   │       └── UnderlinedCardClient.tsx
│   │   ├── index.ts
│   │   ├── items
│   │   │   ├── icon
│   │   │   │   └── index.tsx
│   │   │   └── image
│   │   │       ├── ImageAdmin.tsx
│   │   │       ├── ImageClient.tsx
│   │   │       ├── index.tsx
│   │   │       └── MediaSelector.tsx
│   │   ├── layout
│   │   │   ├── column
│   │   │   │   ├── AdminComponent.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── menu
│   │   │   │   ├── AdminComponent.tsx
│   │   │   │   └── index.tsx
│   │   │   └── row
│   │   │       ├── AdminComponent.tsx
│   │   │       └── index.tsx
│   │   ├── sections
│   │   │   ├── agenda
│   │   │   │   ├── AgendaAdmin.tsx
│   │   │   │   ├── AgendaClient.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── bordered-container
│   │   │   │   ├── BorderedContainerAdmin.tsx
│   │   │   │   └── index.tsx
│   │   │   └── Hero.tsx
│   │   ├── types.ts
│   │   └── typography
│   │       ├── heading
│   │       │   └── index.tsx
│   │       ├── paragraph
│   │       │   └── index.tsx
│   │       ├── span
│   │       │   └── index.tsx
│   │       └── typography
│   │           ├── index.tsx
│   │           └── TypographyAdmin.tsx
│   └── ui
│       ├── alert-dialog.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button-group.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── field.tsx
│       ├── form.tsx
│       ├── input-group.tsx
│       ├── input.tsx
│       ├── item.tsx
│       ├── label.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── spinner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
├── components.json
├── content.md
├── docker-compose.prod.yml
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── hooks
│   ├── use-media-query.ts
│   ├── use-mobile.ts
│   └── use-preview-sync.ts
├── lib
│   ├── auth
│   │   ├── authorize.ts
│   │   ├── client.ts
│   │   └── server.ts
│   ├── is-setup.ts
│   ├── pages
│   │   └── lookup-service.ts
│   ├── permissions.ts
│   ├── prisma.ts
│   ├── resend.ts
│   ├── schemas
│   │   ├── MenusSchema.ts
│   │   ├── OnboardingSchema.ts
│   │   ├── PagesSchema.ts
│   │   └── SignupSchema.ts
│   ├── storage.ts
│   ├── types
│   │   └── Result.ts
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── plopfile.cjs
├── plugins
├── postcss.config.mjs
├── prisma
│   ├── migrations
│   │   ├── 20251215191600_initial_prisma
│   │   │   └── migration.sql
│   │   ├── 20251216190724_add_pages_and_users
│   │   │   └── migration.sql
│   │   ├── 20260102192209_change_content_type_to_json
│   │   │   └── migration.sql
│   │   ├── 20260103202337
│   │   │   └── migration.sql
│   │   ├── 20260104184349_media
│   │   │   └── migration.sql
│   │   ├── 20260107210505_what
│   │   │   └── migration.sql
│   │   ├── 20260108211950_menus
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── models
│   │   ├── auth.prisma
│   │   ├── menus.prisma
│   │   └── pages.prisma
│   └── schema.prisma
├── prisma.config.ts
├── proxy.ts
├── public
│   ├── hero.png
│   ├── Logo_CSS.png
│   ├── Logo_TryIt.png
│   ├── Logo_WI_AGH.png
│   ├── Logo_WRSS_WI.png
│   ├── logo-white.png
│   └── signet.svg
├── README.md
├── roadmap.md
├── scripts
│   └── addUser.ts
├── seed
│   ├── factories
│   │   ├── page.ts
│   │   ├── pages.ts
│   │   └── tag.ts
│   ├── pages.ts
│   └── seed.ts
├── src
│   ├── components
│   │   └── column
│   └── generated
│       └── prisma
│           ├── browser.ts
│           ├── client.ts
│           ├── commonInputTypes.ts
│           ├── enums.ts
│           ├── internal
│           │   ├── class.ts
│           │   ├── prismaNamespace.ts
│           │   └── prismaNamespaceBrowser.ts
│           ├── models
│           │   ├── Account.ts
│           │   ├── Media.ts
│           │   ├── Menu.ts
│           │   ├── Page.ts
│           │   ├── Session.ts
│           │   ├── Setting.ts
│           │   ├── Tag.ts
│           │   ├── User.ts
│           │   └── Verification.ts
│           └── models.ts
├── styles
│   ├── globals.css
│   └── hero.css
├── SUMMARY.md
├── templates
│   └── CMSComponent.hbs
├── tsconfig.json
└── tsconfig.tsbuildinfo

97 directories, 229 files


# Sections

## One pager
 - Basic Next.js app setup with TypeScript, ESLint, Prettier, TailwindCSS ~ 24 hours (Dawid + Madzia)

## Media (Madzia)

## Users & Authentication
 - Provider setup (Resend, BetterAuth, Prisma) ~ 8 hours (Dawid)
 - Auth related pages (Login, Signup, Forgot Password) ~ 18 hours (Madzia)
 - Admin user management (List + Filter users, Invite, Edit and Remove user) ~ 12 hours (Dawid)

## Onboarding (Dawid)
 - Onboarding wizzar (multi-step form to set up basic CMS settings) ~ 2 hours
 - Set up check (redirect to onboarding if not set up) ~ 1 hour

## Admin Pages Management
 - Set up Prisma models and actions ~ 8 hours (Dawid)
 - Admin dashboard pages list (with pagination, search and filter) ~ 8 hours (Dawid)
 - Page metadata create/edit form ~ _ hours (Madzia)
 - Page content editor ~ 12 hours (Dawid)

## Admin menu management
 - Set up Prisma models and actions ~ 4 hours (Dawid)
 - Admin dashboard menu list (with pagination, search and filter) ~ 4 hours (Dawid)
 - Menu create/edit form ~ 6 hours (Dawid)
 - Customizable menu component ~ 8 hours (Dawid)

## CMS Component Registry
 - Set up CMS component registry ~ 16 hours (Dawid)
 - Typography components (Typography, Heading, Paragraph, Span) ~ 12 hours (Dawid)
 - CMS Link component ~ 4 hours (Dawid)
 - Hero section ~ 2 hours (Dawid)

## CI&CD (Dawid)
 - Set up docker environment ~ 4 hours

## Utilities
 - PlopJS templates and generators for CMS components ~ 2 hours (Dawid)
