# Project Memory

## Core
Licénciame: B2B music licensing platform. Primary #DBEC62 (lime-green), bg #F3F4F6, black #050505.
Inter for UI, PP Editorial New for landing only. Never purple.
Text on primary (#DBEC62) always #050505, never white.
Stack: React 18, TS strict, Vite, Tailwind 3, React Query, Zustand. No Redux/SASS/styled-components.
Logos de apps sociales (IG/TT/FB) siempre `<PlatformBadge />` — fondo `bg-foreground` + icono `text-background`. No usar lucide directo.
Charts: paleta de 6 series via `--chart-1..6` / `bg-chart-N`. Importar `chartColor(slot)` desde `@/design-system/tokens/chartPalette`. Nunca hex inline.

## Memories
- [Design tokens](mem://design/tokens) — Full color palette, radii, shadows, materials (frosted, glass, blur)
- [Badge variants](mem://design/badges) — Vigente, Consumida, Expirada, Pendiente, Info, Primary
- [Platform Badge](mem://design/platform-badge) — Logo unificado IG/TT/FB: recipe, sizes, callsites
- [Chart Palette](mem://design/chart-palette) — 6 series tokens, recipe S80 L66 + olive, mapping a tipos de uso
