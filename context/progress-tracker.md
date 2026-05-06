# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Design System & UI Primitives

## Current Goal

- Proceed to the next feature unit.

## Completed

- **01-design-system**: shadcn/ui initialized (v4.7.0, Tailwind v4 mode), components installed (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, `lib/utils.ts` with `cn()` helper created, `globals.css` configured with full dark-only theme palette and project token aliases mapped via `@theme inline`. Build passes with no errors.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Dark-only: shadcn/ui semantic variables (`--background`, `--foreground`, etc.) are set directly on `:root` to the dark theme values. No `.dark` class toggle is used — the app is always dark.
- Project token aliases (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.) are mapped in `@theme inline` pointing to the CSS custom properties defined in `:root`.

## Session Notes

- `components/ui/*` files must not be modified (per ai-workflow-rules.md).
- All project styling must use token classes (`bg-base`, `text-copy-primary`, etc.), never raw Tailwind color classes or hardcoded hex values.
