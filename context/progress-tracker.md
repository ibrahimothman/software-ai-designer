# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 06: (next planned feature).

## Current Goal

- Define and implement the next feature unit.

## Completed

- **01-design-system**: shadcn/ui initialized (v4.7.0, Tailwind v4 mode), components installed (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, `lib/utils.ts` with `cn()` helper created, `globals.css` configured with full dark-only theme palette and project token aliases mapped via `@theme inline`. Build passes with no errors.
- **02-editor**: `EditorNavbar` and `ProjectSidebar` shell components built. Navbar is a fixed top bar with sidebar toggle (`PanelLeftOpen`/`PanelLeftClose`) wired via props. Sidebar floats above canvas (fixed, z-40), slides in from the left with CSS transform, shows shadcn Tabs ("My Projects" / "Shared") with empty placeholder states, and a full-width "New Project" button at the bottom. Both components are `"use client"` and TypeScript-strict. Dialog pattern is available via the existing `components/ui/dialog.tsx` (inherits dark tokens from `:root` CSS variables).
- **03-auth**: Clerk wired into the app. `proxy.ts` at project root uses `clerkMiddleware` to protect all routes except `/sign-in` and `/sign-up` (defined via env vars). `ClerkProvider` wraps the root layout with the bundled `@clerk/ui` dark theme overridden by project CSS custom property tokens. Two-panel auth layout at `app/(auth)/layout.tsx` (branding panel on large screens, form-only on small). Sign-in (`app/(auth)/sign-in/[[...sign-in]]`) and sign-up (`app/(auth)/sign-up/[[...sign-up]]`) pages use Clerk components. Root `/` redirects authenticated users to `/editor` and unauthenticated users to `/sign-in`. `UserButton` added to `EditorNavbar` right section. Minimal editor page at `app/editor/page.tsx` renders the existing shell components. Build passes.
- **04-project-dialogs**: Editor home screen with centered heading/description/CTA. Create dialog with live slug preview. Rename dialog (auto-focus, Enter submits). Delete dialog (destructive confirm). Sidebar project items with hover rename/delete actions for owned projects only. Mobile backdrop scrim. `useProjectDialogs` hook manages all dialog/form/loading state. Build passes with no errors.
- **05-prisma**: `Project` and `ProjectCollaborator` models in `prisma/models/project.prisma` (status enum, cascade delete, composite PK, all required indexes). `lib/prisma.ts` singleton: branches on `DATABASE_URL` — `prisma+postgres://` uses `accelerateUrl` + `withAccelerate()`, otherwise uses `PrismaPg` adapter; dev instance cached on `globalThis`. First migration applied (`20260506145405_add_project_models`). `prisma migrate status` confirms database is up to date. `npm run build` passes.

## In Progress

- Nothing in progress yet.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Dark-only: shadcn/ui semantic variables (`--background`, `--foreground`, etc.) are set directly on `:root` to the dark theme values. No `.dark` class toggle is used — the app is always dark.
- Project token aliases (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.) are mapped in `@theme inline` pointing to the CSS custom properties defined in `:root`.
- Auth: `proxy.ts` (not `middleware.ts`) is used per Next.js 16 convention. Public routes are derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars.
- Clerk UI: bundled via `@clerk/ui` (`ui` prop on `ClerkProvider`) using the `dark` base theme. Appearance variables reference CSS custom properties — no hardcoded colors.

## Session Notes

- `components/ui/*` files must not be modified (per ai-workflow-rules.md).
- All project styling must use token classes (`bg-base`, `text-copy-primary`, etc.), never raw Tailwind color classes or hardcoded hex values.
