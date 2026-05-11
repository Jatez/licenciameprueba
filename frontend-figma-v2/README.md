# Licénciame · Frontend

UI-first React + TypeScript app for the Licénciame music licensing product.
Backend is mocked: the types in `src/api/` are the contract that the future
backend will implement.

## Tech stack

- React 18 + TypeScript (strict)
- Vite 5
- Tailwind CSS 3 with HSL design tokens
- TanStack React Query 5 (data layer, ready for real endpoints)
- Zustand (UI state only)
- React Hook Form + Zod (forms)
- Lucide React (icons)

---

## Design System

The Design System lives at the in-app route **`/design-system`** and is the
single source of truth for tokens, primitives, components, layouts and
responsive rules.

### How to navigate

The DS is a single-page long-scroll site with a collapsible sidebar of
8 groups (`SidebarAccordion`):

1. **Get Started** — intro, principles, changelog, contributing
2. **Brand** — brand, voice & tone
3. **Foundations** — colors, chart palette, typography, radius, spacing,
   borders, animations, shadows, icons
4. **Components** — buttons, cards, KPI card, empty-state card, image-overlay
   card, top-item row, avatar, forms, badges, materials, frosted header,
   player, sidebar, popover
5. **Layouts** — PageShell, BodyCard, AppLayout, dashboard layout
6. **Responsive & Mobile** — breakpoints, layout patterns, touch targets,
   forms, tables, modals, build checklist
7. **Dashboard v2** — every section of the production dashboard documented
   1:1 with the real components
8. **Catalog** — every section of the catalog documented 1:1 with the real
   components

Each section follows the `DSComponentSpec` contract:
intro → anatomy → variants → states → tokens → a11y → usage → code.

### How to add a new component

1. Build the component in `src/components/ds/<Name>/` or `src/features/<f>/components/<Name>/`,
   keeping each file under 300 lines.
2. Use only existing tokens. If you need a new token, edit `src/index.css`
   first (HSL only) and surface it via `tailwind.config.ts`.
3. Create a section file at `src/features/design-system/sections/<group>/<Name>Section.tsx`
   following the pattern of `AvatarSection.tsx` (split layout, real component
   imported from production).
4. Register the section in `src/features/design-system/DesignSystem.tsx`
   (`SECTION_REGISTRY`) and add a sidebar entry in
   `src/features/design-system/config/navigation.ts`.

### How to add or edit a token

- All tokens live in `src/index.css` as HSL CSS variables (e.g.
  `--color-primary: 68 81% 65%;`). Surfaces are also HSL-backed since the
  Prompt 6 cleanup (`--page-bg`, `--bodycard-bg`, `--sidebar-bg`,
  `--ink-900`, `--ink-700`).
- Expose them in `tailwind.config.ts` so they become utility classes
  (`bg-page-bg`, `text-ink-900`, etc.).
- Document the change in `docs/audit/tokens-decisions.md` with date + reason.

### Audits and decisions log

The `docs/audit/` folder contains the design-system audits and cleanup
records that drove the recent refactors:

- `audit-ds-01-inventario.md` — full DS inventory + TOP 5 issues
- `audit-ds-02-cruce-app.md` — app↔DS cross-check, orphan components
- `tokens-decisions.md` — every token change (kept / removed / migrated)
- `shadcn-cleanup.md` — primitives removed from `src/components/ui/`
- `frosted-migration.md` — header migration to `FrostedHeader`
- `qa-final.md` — final QA run against the audit findings

---

## Project rules (TL;DR)

- **`/design-system` is the source of truth.** Reuse first, never re-create.
- **Code in English, UI strings in Spanish** grouped under `strings.ts` per
  feature.
- **Files ≤ 300 lines.** Split with `parts/` when needed.
- **Always render the 4 visual states**: loading, empty, error, success.
- **Types in `src/api/` are the backend contract.** When the real API lands,
  only `api/client.ts` and `api/endpoints/` change.
- **Tokens, not hex.** Hex literals outside `src/index.css` are forbidden in
  production code (mocks/docs that quote raw hex for reference are allowed,
  see `qa-final.md`).

---

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:8080` and open `/design-system` to explore the kit.
