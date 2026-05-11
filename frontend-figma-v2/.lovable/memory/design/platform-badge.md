---
name: Platform Badge
description: Logo unificado para Instagram/TikTok/Facebook — chip negro con icono blanco
type: design
---

# `<PlatformBadge />` — logo unificado de apps sociales

Primitiva del DS en `src/components/ui/platform-badge.tsx`.

## Recipe (no negociable)
- Contenedor: `inline-flex items-center justify-center rounded-full bg-foreground text-background`
- Icono interno (`Instagram | Music2 | Facebook` de lucide), `aria-hidden`
- `aria-label` con el nombre legible cuando no hay label visible
- Sin variantes de color por plataforma — la diferenciación viene del icono

## API
```ts
type PlatformId = "instagram" | "tiktok" | "facebook";
interface PlatformBadgeProps {
  platform: PlatformId;
  size?: "xs" | "sm" | "md" | "lg";  // 20 / 24 / 32 / 40 px
  withLabel?: boolean;
  className?: string;
}
```

## Tamaños
| size | container | icon |
|---|---|---|
| xs | h-5 w-5 | h-3 w-3 |
| sm | h-6 w-6 | h-3.5 w-3.5 |
| md | h-8 w-8 | h-4 w-4 |
| lg | h-10 w-10 | h-5 w-5 |

## Estados
- Disabled / no disponible: aplicar `opacity-30` vía `className` desde el consumidor.

## Callsites actuales
- `features/catalog/components/PlatformIcons` — trío con tooltip de licenciabilidad
- `features/catalog/components/LicensabilityMatrix` — header de columnas
- `features/catalog/components/FilterPanel/parts/FilterSectionPlatform` — checkbox de filtro
- `features/dashboard-v2/components/TopTracks/TopTrackRow` — chips de plataformas en lista
- `features/dashboard-v2/components/PlatformBreakdown/PlatformCard` — avatar de la card
- `features/tracking/components/shared/PlatformIcon` — wrapper de compatibilidad (size numérico)

## Excepción documentada
`features/connect-flow/parts/PlatformBrand.ts` mantiene los hex de marca (IG pink, TT negro, FB azul) porque simula el popup OAuth real. NO es un logo en nuestro producto, es réplica de UI externa.

## Reglas
- Prohibido instanciar `<Instagram />` / `<Music2 />` / `<Facebook />` de lucide directo en componentes de feature. Siempre `<PlatformBadge />`.
- Prohibido pintar el contenedor con colores de marca o tintes (`bg-error-subtle`, `bg-info-subtle`, etc.).
- `bg-foreground` + `text-background` son los tokens semánticos correctos (negro #050505 sobre blanco). No usar `bg-black`.
