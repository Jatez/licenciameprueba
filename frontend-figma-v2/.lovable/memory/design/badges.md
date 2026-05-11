---
name: Badge variants
description: Badge variants and their token mappings (Vigente, Consumida, Expirada, Pendiente, Info, Primary, Secondary, Outline, Metric)
type: design
---

Badge variants live in `src/components/ui/badge.tsx`. All consume semantic tokens — never hardcode hex.

| Variant | Background | Text | Notes |
|---|---|---|---|
| `default` (primary) | `bg-primary` (#DBEC62) | `text-foreground` (#050505) | Lime CTA-style |
| `secondary` | `bg-secondary` + `border-lm-gray-300` | `text-foreground` | Neutral |
| `outline` | transparent + `border-border` | `text-foreground` | Minimal |
| `vigente` | `bg-success-subtle` (#BAC374) | `text-foreground` | Active license |
| `consumida` | `bg-consumida-subtle` (#8185CA) | `text-foreground` | Used license — token `--color-consumida-subtle: 236 41% 65%` |
| `expirada` | `bg-error-subtle` (#C37474) | `text-foreground` | Expired |
| `pendiente` | `bg-warning-subtle` (#E0AE74) | `text-foreground` | Pending |
| `info` | `bg-info-subtle` (#7478C3) | `text-foreground` | Informational |
| `metric` | `bg-metric-subtle/[0.63]` | `text-primary-foreground` | KPI accent |
| `destructive` | `bg-destructive` | `text-foreground` | Errors |

Tokens defined in `src/index.css` (HSL CSS vars) and mapped in `tailwind.config.ts`.
