# Token decisions — Prompt 6 cleanup

**Fecha:** 2026-04-24
**Scope:** limpieza completa del sistema de tokens del DS de Licénciame.

---

## A · HEX literales migrados a HSL

Todos los tokens de superficie ahora se declaran en `src/index.css` como
canales HSL (`H S% L%`) y se exponen en `tailwind.config.ts` vía
`hsl(var(--token))`.

| Token | Antes (hex) | Ahora (HSL var) | Tailwind |
|---|---|---|---|
| page-bg | #F2F4F7 | `--page-bg: 220 16% 96%` | `bg-page-bg` |
| bodycard-bg | #F3F4F6 | `--bodycard-bg: 220 14% 96%` | `bg-bodycard-bg` |
| sidebar-bg | #EAEAEB | `--sidebar-bg: 240 2% 92%` | `bg-sidebar-bg` |
| ink-900 | #050505 | `--ink-900: 0 0% 2%` | `bg-ink-900` |
| ink-700 | #616161 | `--ink-700: 0 0% 38%` | `bg-ink-700` |

**Recipes CSS actualizadas para consumir las vars:**
- `.sticky-frosted-header` → `hsl(var(--bodycard-bg) / 1|0.6|0)` (TODO de Prompt 6 resuelto)
- `.sidebar-frosted` → `hsl(var(--sidebar-bg) / 0.6)`
- `.navbar-frosted` → `hsl(var(--ink-900) / 0.6)`
- `.card-blur-content` → `hsl(var(--color-surface) / 0.6)`
- `.btn-glow`, `.shadow-glow` → `hsl(var(--color-primary) / 0.3)`

**Componentes migrados:**
- `src/components/sidebar/SidebarShell.tsx` — quitado el `style` inline con
  `rgba(234,234,235,0.6)`, ahora usa `className="sidebar-frosted"`.
- `src/components/layout/PageShell.tsx` — quitado `bg-[#EAEAEB]`, ahora
  `bg-sidebar-bg`.

---

## B · Tokens eliminados (huérfanos / duplicados)

| Token / Utility | Decisión | Razón | Callsites migrados |
|---|---|---|---|
| `lime-accent` (color) | **Eliminado** | Hex (#DBEC62) duplicado de `bg-primary` | LayoutMocks.tsx (2× → `bg-primary`) |
| `noise-overlay` (CSS) | **Eliminado** | 0 callsites en producción | Demo en ShadowsSection eliminado |
| `text-gradient-primary` (CSS) | **Eliminado** | 0 callsites en producción (solo demo del propio DS) | Demo en MaterialsSection eliminado |
| `font-editorial` (Tailwind family) | **Eliminado** | Sin decisión firme; alias inútil de `font-serif` | Ningún callsite — `font-serif` sigue disponible |
| `--radius-button` (CSS var) | **Eliminado** | Idéntico a `--radius-md`, sin uso | — |

**Validación:** `grep -rE "lime-accent\|noise-overlay\|text-gradient-primary\|font-editorial\|radius-button" src/ tailwind.config.ts` → 0 matches reales (solo el comentario de cleanup en ShadowsSection).

---

## C · Tokens MANTENIDOS (auditoría re-confirmada)

| Token | Razón para mantener |
|---|---|
| `navbar-frosted` (CSS) | Documentado en FrostedHeader como recipe alterna (dark-mode navbars). |
| `sidebar-frosted` (CSS) | Pasa de "huérfano" a "en uso" tras migrar SidebarShell. |
| `card-blur-content` (CSS) | Lo consume `ImageOverlayCard` variant `blur-panel`. |
| `btn-glass` (CSS) | Recipe estándar para glass buttons sobre fondo oscuro. |
| `font-serif` (Tailwind family) | Usado por `LayoutMocks` (DS internal). Pendiente: marcar como internal-only si no aparecen callsites de producto. |

---

## D · Tokens NUEVAMENTE DOCUMENTADOS en el DS

Antes existían en código pero no en la sección de Foundations.

- **Surfaces** — `ColorsSection` ahora tiene una tabla dedicada con preview
  por cada superficie (`page-bg`, `bodycard-bg`, `sidebar-bg`, `ink-900`,
  `ink-700`).
- **Metric tokens** — Par `bg-metric-subtle` + `text-metric` con preview de
  Badge `variant="metric"`.
- **Semantic tokens reescritos** — La tabla de "Semantic tokens" antes
  listaba nombres ficticios (`text-lm-black`, `border-lm-gray-200`). Ahora
  refleja los reales que la app consume (`bg-background`, `bg-card`,
  `bg-muted`, `bg-primary`, `bg-primary-subtle`, `text-foreground`,
  `text-muted-foreground`, `text-primary-foreground`, `border-border`,
  `border-input`, `ring-ring`) con mini-swatch por fila.
- **Radius `card` (20px)** — Marcado como **DEFAULT** para cards de
  producto (badge visible en la tabla).
- **Radius `pill`** — Alias semántico para badges/chips (antes solo
  `--radius-pill` en CSS sin documentar).
- **`.font-tnum`** — Sección Utilities en TypographySection con preview de
  cifras tabulares y nota de uso obligatorio (KPIs, charts, tablas).

---

## E · Cards consolidation — decisión

**No se crea un `<Card />` monolítico** que reemplace KPICard /
ImageOverlayCard / BodyCard. Cada uno tiene contratos muy distintos.

`CardsSection` se reescribió como **mapa de decisión**:

| Caso de uso | Componente |
|---|---|
| KPI con cifra grande | `<KPICard />` |
| Tarjeta con imagen + overlay | `<ImageOverlayCard />` |
| Track del catálogo | `<TrackCard />` (adapter) |
| Categoría / Mood | `<CategoryCard />` / `<MoodCard />` (adapters) |
| Card genérica de contenido | `<Card />` (shadcn) |
| Container flotante de página | `<BodyCard />` |
| Empty state | `<EmptyStateCard />` |

Cada fila enlaza a su sección correspondiente del DS.

---

## F · Cross-reference banners

Nuevo componente `<DSCrossRefBanner />` añadido al tope de las secciones
Responsive que documentaban tokens base sin diferenciarse de Foundations:

- `responsive-typography` → `Foundations / Typography`
- `responsive-spacing` → `Foundations / Spacing`
- `responsive-navigation` → `Components / Sidebar`

Las páginas Responsive ahora se enfocan **solo** en cómo escalan/cambian
por breakpoint.

---

## G · Validaciones automáticas pasadas

```sh
# 0 hex literales en tailwind.config (excepto refs HSL)
grep -E "#[0-9A-Fa-f]{3,6}" tailwind.config.ts → ∅

# 0 referencias a tokens eliminados (excepto comments de cleanup)
grep -rE "lime-accent|noise-overlay|text-gradient-primary|font-editorial|radius-button" src/ → solo 1 comment

# TypeScript compila limpio
tsc --noEmit → exit 0
```

---

## H · TODOs para próximos prompts

- `font-serif`: confirmar si solo el DS lo usa → marcar como internal-only
  o eliminar.
- `bg-lm-gray-*` (alias de `gray-*`): revisar si simplificar.
- `--color-success-subtle` y familia: considerar sistema de opacidad
  unificado en lugar de tokens "burnt" separados.
- `src/lib/styleguide-exports.ts` — contiene un dump CSS desfasado que
  todavía declara `--radius-button` y `--radius-card: 12px`. Sincronizar
  con la fuente de verdad de `index.css` o eliminar el archivo si no se
  consume.
