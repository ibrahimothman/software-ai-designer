# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 08: (next feature).

## Current Goal

- Define and implement the next planned feature.

## Completed

- **01-design-system**: shadcn/ui initialized (v4.7.0, Tailwind v4 mode), components installed (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, `lib/utils.ts` with `cn()` helper created, `globals.css` configured with full dark-only theme palette and project token aliases mapped via `@theme inline`. Build passes with no errors.
- **02-editor**: `EditorNavbar` and `ProjectSidebar` shell components built. Navbar is a fixed top bar with sidebar toggle (`PanelLeftOpen`/`PanelLeftClose`) wired via props. Sidebar floats above canvas (fixed, z-40), slides in from the left with CSS transform, shows shadcn Tabs ("My Projects" / "Shared") with empty placeholder states, and a full-width "New Project" button at the bottom. Both components are `"use client"` and TypeScript-strict. Dialog pattern is available via the existing `components/ui/dialog.tsx` (inherits dark tokens from `:root` CSS variables).
- **03-auth**: Clerk wired into the app. `proxy.ts` at project root uses `clerkMiddleware` to protect all routes except `/sign-in` and `/sign-up` (defined via env vars). `ClerkProvider` wraps the root layout with the bundled `@clerk/ui` dark theme overridden by project CSS custom property tokens. Two-panel auth layout at `app/(auth)/layout.tsx` (branding panel on large screens, form-only on small). Sign-in (`app/(auth)/sign-in/[[...sign-in]]`) and sign-up (`app/(auth)/sign-up/[[...sign-up]]`) pages use Clerk components. Root `/` redirects authenticated users to `/editor` and unauthenticated users to `/sign-in`. `UserButton` added to `EditorNavbar` right section. Minimal editor page at `app/editor/page.tsx` renders the existing shell components. Build passes.
- **04-project-dialogs**: Editor home screen with centered heading/description/CTA. Create dialog with live slug preview. Rename dialog (auto-focus, Enter submits). Delete dialog (destructive confirm). Sidebar project items with hover rename/delete actions for owned projects only. Mobile backdrop scrim. `useProjectDialogs` hook manages all dialog/form/loading state. Build passes with no errors.
- **05-prisma**: `Project` and `ProjectCollaborator` models in `prisma/models/project.prisma` (status enum, cascade delete, composite PK, all required indexes). `lib/prisma.ts` singleton: branches on `DATABASE_URL` — `prisma+postgres://` uses `accelerateUrl` + `withAccelerate()`, otherwise uses `PrismaPg` adapter; dev instance cached on `globalThis`. First migration applied (`20260506145405_add_project_models`). `prisma migrate status` confirms database is up to date. `npm run build` passes.
- **06-project-apis**: `GET /api/projects` lists authenticated user's projects. `POST /api/projects` creates a project (defaults name to `Untitled Project`). `PATCH /api/projects/[projectId]` renames a project. `DELETE /api/projects/[projectId]` deletes a project. All routes enforce `401` for unauthenticated requests; PATCH and DELETE enforce `403` for non-owners. `lib/prisma.ts` typed as `PrismaClient` to resolve union type incompatibility from Accelerate extension. `npm run build` passes.
- **07-wire-editor-home**: `app/editor/page.tsx` converted to async server component — fetches owned and shared projects via `lib/projects.ts` helpers (`getOwnedProjects`, `getSharedProjects`) using Clerk `auth()` + `currentUser()`. `EditorHomeClient` client shell receives pre-fetched lists. `useProjectActions` hook replaces `useProjectDialogs` — wires create/rename/delete to REST API, generates a slug+suffix room ID preview, navigates to new workspace on create, refreshes on rename, redirects to `/editor` on delete if active workspace. All dialog components updated to accept `onSubmit`/`onConfirm` and `isLoading`. `ProjectSidebar` updated to take separate `ownedProjects`/`sharedProjects` props. `npm run build` passes.

## In Progress

- Nothing yet — awaiting next feature spec.

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
