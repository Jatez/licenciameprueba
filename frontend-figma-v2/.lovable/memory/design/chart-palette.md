---
name: chart-palette
description: Paleta de 6 series para charts (no semántica) — tokens, mapping y reglas
type: design
---

# Chart Palette

Paleta coordinada de 6 colores para visualización de datos. **NO semántica** — orden estable pero sin jerarquía intrínseca.

## Receta cromática
5 colores con `S 80% / L 66%` distribuidos en el círculo cromático + 1 olive desaturado (`S 14% / L 52%`) que rompe la armonía para máxima diferenciación visual.

## Tokens

| Slot | CSS var      | Tailwind     | HSL              | HEX       | Nombre |
|------|--------------|--------------|------------------|-----------|--------|
| 1    | `--chart-1`  | `bg-chart-1` | `66 80% 66%`     | `#DDED64` | Lime   |
| 2    | `--chart-2`  | `bg-chart-2` | `179 80% 66%`    | `#64EDEB` | Cyan   |
| 3    | `--chart-3`  | `bg-chart-3` | `66 14% 52%`     | `#949873` | Olive  |
| 4    | `--chart-4`  | `bg-chart-4` | `21 80% 66%`     | `#ED9564` | Coral  |
| 5    | `--chart-5`  | `bg-chart-5` | `273 80% 66%`    | `#B464ED` | Violet |
| 6    | `--chart-6`  | `bg-chart-6` | `230 80% 66%`    | `#6478ED` | Blue   |

## Helper

```ts
import { chartColor, CHART_PALETTE } from "@/design-system/tokens/chartPalette";
chartColor(2); // "hsl(var(--chart-2))"
```

## Mapping actual (CreditUsageChart)
1 single-use · 2 stories-pack · 3 monthly-extended · 4 long-video · 5 paid-post · 6 collaborative-post

## Reglas
- Solo para datos NO semánticos.
- No usar para feedback (success/error/warning).
- Nunca hex/hsl inline en componentes — siempre `bg-chart-N` o `chartColor(slot)`.
- Orden 1→6 estable entre renders.
- Funciona en light y dark sin override.

## Callsites
- `src/features/dashboard-v2/components/CreditUsageChart/CreditUsageLegend.tsx` (USAGE_TYPE_COLORS)
- `src/features/design-system/sections/components/KPICardSection.tsx` (sparkline demo)
- `src/features/design-system/sections/foundations/ChartPaletteSection.tsx` (documentación)
