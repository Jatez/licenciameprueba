# Auditoría DS Licénciame · 01 — Inventario

**Fecha**: 2026-04-24  
**Alcance**: `src/features/design-system/**` (ruta `/design-system`), tokens en `src/index.css` + `tailwind.config.ts`, primitivas en `src/components/ui/**` y consumo real en `src/features/**`.  
**Modo**: read-only. No se modificó código.

---

## 1. Mapa de navegación (lo que sirve el sidebar)

El DS hoy expone **8 grupos** y **63 secciones** (renderizadas todas en una sola página long-scroll, no son rutas separadas). Origen: `src/features/design-system/config/navigation.ts`.

| # | Grupo | Secciones | Notas |
|---|-------|-----------|-------|
| 1 | Get Started | 4 | intro, principles, changelog, contributing |
| 2 | Brand | 2 | brand, voice-tone (beta) |
| 3 | Responsive & Mobile | 11 | overview, breakpoints, layouts, typography, spacing, touch, navigation, forms, tables, modals, checklist |
| 4 | Foundations | 9 | colors, chart-palette, typography, radius, spacing, borders, animations, shadows, icons |
| 5 | Components | 8 | buttons, cards, kpi-card, empty-state-card, forms, badges, materials, sidebar |
| 6 | Layouts | 1 | layout-dashboard-v2 |
| 7 | Dashboard v2 | 10 | layout, header, kpi-row, credit-usage-chart, top-tracks, platform-breakdown, recent-activity, wallet, alerts, empty-v2 |
| 8 | Catalog | 14 | catalog-page, header, filter-panel, track-card/row/list, themed-cards, platform-badge, pagination, empty-states, track-detail-page, licensability-matrix, similar-tracks, track-detail-empty |

⚠️ **Inconsistencia de orden**: `Responsive & Mobile` aparece antes que `Foundations` en el sidebar, pero conceptualmente Responsive es una sub-disciplina que **depende** de breakpoints / spacing / typography. Debería ir después.

---

## 2. Inventario sección por sección

Leyenda · **Visual**: Sí / No / Parcial · **Código**: Sí / No · **Prosa**: Sí / Insuficiente / No · **Densidad**: Alta · Media · Baja

### 2.1 Get Started

| Sección | Visual | Código | Prosa | Densidad | Observación |
|---|---|---|---|---|---|
| intro | No | No | Sí (3 párrafos) | Baja | Texto plano, OK como home |
| principles | Parcial (5 cards) | No | Sí | Media | Cards con título+desc+ejemplo. Falta CTA "ver token X" |
| changelog | No (tabla) | No | Insuficiente | Baja | 3 entries hardcoded, sin link a PR/commit |
| contributing | No | No | Sí (lista 5 pasos) | Baja | Sin enlaces a archivos del repo |

### 2.2 Brand

| Sección | Visual | Código | Prosa | Densidad | Observación |
|---|---|---|---|---|---|
| brand | Sí (4 cards isotipo/logotipo light+dark) | No | Insuficiente | Baja | No documenta clearspace, min-size, misuses |
| voice-tone | No (tabla 4 filas) | No | Sí | Media | Cubre onboarding/error/success/legal |

### 2.3 Foundations

| Sección | Visual | Código | Prosa | Densidad | Observación |
|---|---|---|---|---|---|
| colors | Sí (swatches core + neutrals + semantic) | No (sin snippet copyable) | Parcial | Alta | **Tabla "semantic tokens" usa nombres ficticios** (`text-lm-black`, `border-lm-gray-200`) que no son los semantic-tokens reales del DS |
| chart-palette | Sí (6 swatches + ejemplo apilado) | Sí (helper `chartColor`) | Sí | Alta | Mejor sección de Foundations |
| typography | Parcial (tabla con specimen) | No | Sí | Media | No documenta line-height, ni la familia `editorial/serif` declarada en Tailwind |
| radius | Sí (tabla con demo) | No | Sí | Media | Documenta sm/md/lg/full pero **omite** `xl`, `pill`, `card`, `button` declarados en `tailwind.config.ts` |
| spacing | Parcial (tabla sin ruler visual) | No | Sí | Media | Salta `space-5`, `space-7`, `space-9` (escala de Tailwind real es continua) |
| borders | Sí (3 muestras) | No | Insuficiente | Baja | Solo divider + accent. Sin grosores 2/4, sin border dashed/dotted |
| animations | Sí (4 demos replay) | No | Sí | Media | Faltan curves de easing tokenizadas |
| shadows | Sí (4 swatches + tabla) | No | Sí | Media | OK |
| icons | Sí (grid 20 iconos) | No | Insuficiente | Baja | Solo subset de Lucide. No documenta tamaños/strokes oficiales |

### 2.4 Components

| Sección | Visual | Código | Prosa | Densidad | Observación |
|---|---|---|---|---|---|
| buttons | Sí (5 variants × 4 sizes + states) | Sí (DSCode i18n) | Sí (DSAnatomy/A11y/Usage) | Alta | Estructura modelo a seguir |
| cards | Sí (default + hover + CategoryCard + MoodCard + TrackTable) | Sí | Sí | Alta | OK |
| kpi-card | Sí | Sí | Sí | Alta | OK |
| empty-state-card | Sí | Sí | Sí | Media | OK |
| forms | Parcial | Sí | Sí | Media | Falta checkbox group, switch, file-upload visibles |
| badges | Sí | Sí | Sí | Media | OK |
| materials | Sí (frosted/glass/blur/gradient) | Sí | Sí | Alta | Usa `text-[white]` literal (anti-patrón del propio DS) |
| sidebar | Sí | Sí | Sí | Media | OK |

### 2.5 Responsive & Mobile

Las 11 secciones siguen el patrón `Subsection + CodeBlock + PreviewBox` desde `_shared.tsx`. Documentación **densa, consistente y con copy button**, pero:

| Sección | Visual | Código | Prosa | Densidad | Observación |
|---|---|---|---|---|---|
| responsive-overview | Parcial (TOC) | No | Sí | Baja | TOC duplica la nav del sidebar |
| responsive-breakpoints | Sí (bar chart 6 bp) | Sí | Sí | Alta | Excelente |
| responsive-layouts | Sí (grids reflow) | Sí | Sí | Alta | Excelente |
| responsive-typography | Sí (samples) | Sí | Sí | Alta | **Duplica** parte de Foundations/Typography |
| responsive-spacing | Sí | Sí | Sí | Alta | **Duplica** parte de Foundations/Spacing |
| responsive-touch | Sí (correct/incorrect) | Sí | Sí | Alta | Excelente |
| responsive-navigation | Parcial | Sí | Sí | Media | No linkea al `Sidebar` real del DS |
| responsive-forms | Sí (form vivo) | Sí | Sí | Alta | Mejor que Components/Forms |
| responsive-tables | Sí (scroll + stack) | Sí | Sí | Alta | Excelente |
| responsive-modals | Sí | Sí | Sí | Media | OK |
| responsive-checklist | Sí (checklist interactivo) | No | Sí | Media | Estado no persiste |

### 2.6 Layouts · Dashboard v2 · Catalog

| Sección | Visual | Código | Prosa | Densidad |
|---|---|---|---|---|
| **Layouts** layout-dashboard-v2 | Sí (mocks) | Sí | Sí | Alta |
| **Dashboard v2** (10 secs) | Sí + Sí + Sí | Sí (DSCode) | Sí (Anatomy/Tokens/A11y/Usage) | Alta — todas con ~170-220 líneas, formato uniforme |
| **Catalog** catalog-page, header, filter-panel, track-card, track-row, track-list, themed-cards, pagination, empty-states, track-detail-page, licensability-matrix, similar-tracks, track-detail-empty | **No** (solo registry items) | **No** | Insuficiente | **Baja** — 13 de 14 secciones tienen exactamente **21 líneas** y delegan en `<DSRegistrySection items={...} />` con texto i18n. **No hay preview, no hay snippet, no hay anatomy** |
| **Catalog** platform-badge | Sí | Sí | Sí | Media — única sección de Catalog completa |

🚨 Hallazgo: **Catalog está casi vacío** (1/14 documentadas en serio).

---

## 3. Inventario de tokens

Fuentes: `src/index.css` (vars HSL) + `tailwind.config.ts` (mapping a clases).

### 3.1 Colores

| Token | Origen | Documentado en | Usado en producción | Estado |
|---|---|---|---|---|
| `--color-primary` (#DBEC62) | css | colors | sí (button, badges, sidebar, KPI) | ✅ |
| `--color-primary-hover` | css | colors | sí | ✅ |
| `--color-primary-subtle` | css | — | sí (button hover bg) | ⚠️ no documentado |
| `--color-black` / `bg-lm-black` | css | colors | sí (dashboard hero, materials) | ✅ |
| `--color-bg-1` / `bg-bg-1` | css | colors | sí | ✅ |
| `--color-bg-2` / `bg-bg-2` | css | colors | sí (background) | ✅ |
| `--color-surface` | css | colors | sí | ✅ |
| `--color-gray-50..900` | css | colors (neutrals) | sí | ✅ |
| `--color-success` + `success-subtle` | css | colors | sí (badges, checkout) | ✅ |
| `--color-warning` + `warning-subtle` | css | colors | sí | ✅ |
| `--color-error` + `error-subtle` | css | colors | sí | ✅ |
| `--color-info` + `info-subtle` | css | colors | sí (recent activity) | ✅ |
| `--color-metric` + `metric-subtle` | css | — | sí (KPI, empty states, badges) | 🚨 **no documentado** en colors section |
| `--chart-1..6` | css | chart-palette | sí (CreditUsageLegend) | ✅ |
| `lime-accent` (#DBEC62) en tailwind | tailwind | — | solo en `LayoutMocks.tsx` (DS interno) | 🚨 **huérfano + duplica `primary`** |
| `page-bg` (#F2F4F7), `bodycard-bg`, `sidebar-bg` (hex hardcoded) | tailwind | — | `AppLayout.tsx`, `BodyCard.tsx` (sí, en producción) | 🚨 **no documentado + viola "todo HSL/token"** |
| `ink.900` / `ink.700` (hex hardcoded) | tailwind | — | sí (catalog cards, tracks) | 🚨 **no documentado + duplica `gray-900/700`** |

### 3.2 Tipografía

| Familia | Tailwind | Documentado | Usado | Estado |
|---|---|---|---|---|
| Inter | `font-sans` (default body) | typography (mencionada) | sí (todo) | ✅ |
| PP Editorial New | `font-serif`, `font-editorial` | **no documentada** en typography section | solo `LayoutMocks.tsx` | 🚨 **huérfana en producción** (la regla dice "landing only" pero no hay landing en este DS) |

Escala documentada: Display, H1, H2, H3, Body, Body-SM, Caption, Overline. **No** se documentan: line-height, letter-spacing tokens, ni la escala responsive (eso vive duplicado en `responsive-typography`).

### 3.3 Spacing

Tailwind default scale (4 px). El DS muestra solo: 1, 2, 3, 4, 6, 8, 10, 12, 16. Faltan: 5, 7, 9, 14, 20, 24+. **No hay tokens propios** — es la escala estándar de Tailwind.

### 3.4 Border radius

| Token | Tailwind class | Documentado en `radius` | Usado | Estado |
|---|---|---|---|---|
| `--radius-sm` 6px | `rounded-sm` | sí | sí | ✅ |
| `--radius-md` 8px | `rounded-md` | sí | sí | ✅ |
| `--radius-lg` 12px | `rounded-lg` | sí | sí | ✅ |
| `--radius-full` | `rounded-full` | sí | sí | ✅ |
| `--radius-button` 8px | (no expuesto en Tailwind como clase propia) | no | — | 🚨 huérfano |
| `--radius-card` 20px | `rounded-card` | **no** | sí (cards en todo el dashboard) | 🚨 **token estrella sin documentar** |
| `--radius-pill` | `rounded-pill` | **no** | parcialmente | 🚨 huérfano |
| `xl` mapeado a `--radius-lg` | `rounded-xl` | no | sí | ⚠️ alias confuso |

### 3.5 Borders / strokes

Solo se documenta `border-border` (1 px) y `border-t-2 border-primary` (acento). **No hay tokens** de stroke; la sección es prácticamente decorativa.

### 3.6 Sombras

| Token | Documentado | Usado | Estado |
|---|---|---|---|
| `shadow-sm` | sí | sí | ✅ |
| `shadow-md` | sí | sí | ✅ |
| `shadow-lg` | sí | poco | ✅ |
| `shadow-glow` (lime) | sí | sí (button) | ✅ |
| `btn-glow` (clase componente) | mencionada en buttons | sí | ✅ |

### 3.7 Materials / efectos

| Clase | Documentado en `materials` | Usado en producción | Estado |
|---|---|---|---|
| `navbar-frosted` | sí | **no** (solo en MaterialsSection) | 🚨 huérfano |
| `sidebar-frosted` | **no** | **no** (definido en index.css y olvidado) | 🚨 huérfano |
| `btn-glass` | sí | sí (`button.tsx` variant) | ✅ |
| `card-blur-content` | sí | sí (`CardImageOverlay`) | ✅ |
| `text-gradient-primary` | sí | **no** (solo MaterialsSection) | 🚨 huérfano |
| `noise-overlay` | **no** | **no** | 🚨 huérfano total |
| `font-tnum` | **no** | sí (KPIs, charts) | 🚨 utilidad clave sin documentar |

### 3.8 Animations

`animate-fade-in`, `animate-scale-in`, `animate-slide-in-right`, `animate-pulse` — todas documentadas y usadas. ✅

---

## 4. Inventario de componentes

| Componente | Sección DS | Variantes documentadas | Estados (default/hover/active/disabled/loading/error) | Estado doc |
|---|---|---|---|---|
| Button | components/buttons | default, secondary, ghost, danger, glass | default, hover, focus, active, disabled (loading **no**) | **COMPLETO** |
| Card / CategoryCard / MoodCard / TrackTable | components/cards | default, hover, themed | default, hover (loading/error **no**) | PARCIAL |
| KPICard | components/kpi-card | + dashboard-v2/kpi-row | sí | **COMPLETO** |
| EmptyStateCard | components/empty-state-card | sí | n/a | **COMPLETO** |
| Form (Input / Label) | components/forms | input, textarea, select | default, focus, error (disabled, loading **no**) | PARCIAL |
| Badge | components/badges | 6 variants (Vigente, Consumida, Expirada, Pendiente, Info, Primary) | default | PARCIAL (sin hover/disabled) |
| Materials (frosted/glass/blur/gradient) | components/materials | 4 efectos | n/a | **COMPLETO** (anti-patrón con `text-[white]`) |
| Sidebar | components/sidebar | colapsado/expandido | sí | **COMPLETO** |
| PlatformBadge | catalog/platform-badge | IG/TT/FB | default | **COMPLETO** |
| TrackCard, TrackRow, TrackList, ThemedCard, FilterPanel, CatalogPage, CatalogHeader, CatalogPagination, CatalogEmptyStates, TrackDetailPage, LicensabilityMatrix, SimilarTracks, TrackDetailEmptyStates | catalog/* | — | — | 🚨 **PLACEHOLDER** (solo lista de items, sin preview ni código) |
| Dashboard v2 (10 piezas) | dashboard-v2/* | sí | sí (anatomy + tokens + a11y + usage + code) | **COMPLETO** |
| Tabs, Dialog, DropdownMenu, Tooltip, Popover, Command, Sheet, Accordion, Toast, Skeleton, Progress, Slider, Switch, Calendar, etc. (de `src/components/ui/**`) | — | — | — | 🚨 **NO DOCUMENTADOS** (existen 30+ primitivas shadcn instaladas y solo se documentan ~8) |

---

## 5. Problemas detectados

### 5.1 Bloques de código sin ejemplo visual al lado
- Toda la sección **Catalog** (13 de 14): items registry sin preview ni snippet, solo descripción i18n.
- Foundations/`borders`: prosa + classnames sin demo amplia.
- Foundations/`icons`: grid de iconos sin código de uso ni reglas de stroke/size.
- Get-started/`changelog` y `contributing`: solo texto, sin link a archivos reales.

### 5.2 Secciones duplicadas / contradictorias
- **Typography duplicada** entre `foundations/typography` y `responsive/responsive-typography` (escalas distintas, sin canonical).
- **Spacing duplicada** entre `foundations/spacing` y `responsive/responsive-spacing`.
- **Navigation duplicada** entre `components/sidebar` y `responsive/responsive-navigation`.
- **Colors contradictoria**: la tabla "semantic tokens" en `ColorsSection` lista nombres ficticios (`text-lm-black`, `border-lm-gray-200`) que **no existen** como semantic tokens reales — confunde a quien lee.
- **Radius contradictoria**: `radius-card` (20 px, el más usado en cards) **no aparece** en la tabla pero sí en `tailwind.config.ts` y se usa en todo el dashboard.
- Tres tokens hex hardcoded en `tailwind.config.ts` (`page-bg`, `bodycard-bg`, `sidebar-bg`, `ink.900/700`, `lime-accent`) **violan la propia regla** del DS ("HSL siempre, nunca hex en tailwind"). Y se usan en producción.

### 5.3 Componentes mencionados pero no documentados formalmente
- `font-tnum` (utilidad citada en docs de KPI/Chart, no tiene sección).
- `sidebar-frosted` (definida y olvidada).
- `noise-overlay` (definida y nunca usada).
- `text-gradient-primary` (documentada pero solo se usa en el propio DS).
- 20+ primitivas shadcn (`Tabs`, `Dialog`, `DropdownMenu`, `Tooltip`, `Sheet`, `Toast`, `Skeleton`, `Progress`, etc.) instaladas y usadas en features pero **sin sección** en el DS.
- Familia tipográfica `PP Editorial New` (`font-serif`, `font-editorial`) declarada y solo usada en mocks internos — no aparece en `Typography`.

### 5.4 Inconsistencias DS vs aplicación real
- App usa `bg-page-bg`, `bg-bodycard-bg`, `bg-sidebar-bg` (hex en tailwind) → DS dice "todo HSL".
- App usa `text-ink-900` / `text-ink-700` en `TrackCard`, `TrackRow`, `ThemedCard` → DS no menciona `ink.*`, dice usar `text-foreground` / `text-muted-foreground`.
- `Badge` real (`src/components/ui/badge.tsx`) tiene una variante `metric` que consume `--color-metric` → ese token **no aparece** en `ColorsSection`.
- `MaterialsSection` (la doc) usa `text-[white]` literal — exactamente el anti-patrón que la regla 3 del proyecto prohíbe.
- Sidebar del DS no tiene buscador interno funcional para componentes (existe topbar search, pero los items de Catalog son placeholders → no se encuentran resultados útiles).

### 5.5 Estructurales
- Todo el DS es **una sola página long-scroll** con 63 secciones. A 167 px de altura promedio cada `DSSectionShell`, el DOM monta ~10k+ líneas en cada visita aunque solo se vea una. Performance degrada en mobile.
- Sidebar muestra `Responsive & Mobile` antes de `Foundations` (orden incorrecto pedagógicamente).
- `Get Started/changelog` con 3 entries hardcoded en `t()`, sin proceso para actualizar.
- No existe sección de **dark mode** aunque `index.css` define `.dark`.

---

## 6. TOP 5 problemas más urgentes

Ordenados por **impacto en el equipo que consume el DS** (alto = bloquea o lleva a errores reales en features).

### 🔴 1. Catálogo casi vacío (13/14 secciones son placeholders de 21 líneas)
**Impacto**: El equipo de catálogo no tiene referencia real para `TrackCard`, `TrackRow`, `FilterPanel`, `LicensabilityMatrix`, etc. Se copia código de features existentes y se desvía. Es el grupo más grande del sidebar y es donde hay menos contenido.  
**Acción**: Replicar el patrón `DSComponentSpec` (anatomy/variants/states/tokens/a11y/usage/code) que ya funciona en Dashboard v2.

### 🔴 2. Tokens hex hardcoded en `tailwind.config.ts` usados en producción y no documentados (`page-bg`, `bodycard-bg`, `sidebar-bg`, `ink.900/700`, `lime-accent`)
**Impacto**: Violan la regla nº1 del propio DS ("HSL siempre"), se usan en `AppLayout`, `BodyCard`, `TrackCard`, `TrackRow`, `ThemedCard`. Cualquier cambio de tema light/dark se rompe en esos puntos. `lime-accent` además duplica `primary` y solo confunde.  
**Acción**: Migrar a HSL vars en `index.css`, deprecar duplicados, documentar o eliminar.

### 🟠 3. Tabla de "Semantic tokens" en `ColorsSection` lista nombres que no existen como tokens reales
**Impacto**: La fila dice `border-lm-gray-200` → "border/default" pero el token real del DS es `border-border` (alias a `--border`). Quien lo copia rompe el theming. Es la primera sección a la que va un dev nuevo. Lo mismo con `text-lm-black` vs `text-foreground`.  
**Acción**: Sustituir la tabla por los semantic tokens reales (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, etc.).

### 🟠 4. 20+ primitivas shadcn (`Tabs`, `Dialog`, `Sheet`, `Toast`, `Skeleton`, `Progress`, `Tooltip`, etc.) usadas en features pero sin sección en el DS
**Impacto**: Cada feature implementa modal, toast, skeleton a su manera porque "no estaba en el DS". Inconsistencia visible en el dashboard. Modal/Sheet ya tiene contraparte en `responsive/responsive-modals` pero la primitiva nunca se documenta como tal.  
**Acción**: Añadir grupo `Components/Overlays`, `Components/Feedback`, `Components/Data Display` con las primitivas shadcn más usadas.

### 🟠 5. Duplicación Foundations vs Responsive (typography, spacing, navigation)
**Impacto**: Dos tablas de typography con escalas distintas, dos tablas de spacing → el equipo no sabe cuál es la canónica. Empeora cuando se actualiza solo una de las dos.  
**Acción**: Foundations = "qué tokens existen" (definición). Responsive = "cómo escalan en breakpoints" (uso). Hacer que Responsive **referencie** los tokens de Foundations en lugar de redefinirlos.

---

## Apéndice · Indicadores numéricos

- Total grupos: **8**
- Total secciones: **63**
- Secciones COMPLETAS: **23** (~36%)
- Secciones PARCIALES: **12** (~19%)
- Secciones PLACEHOLDER: **13** (~21%) — todas en Catalog
- Secciones con preview visual: **48 / 63**
- Secciones con snippet de código copyable: **~22 / 63**
- Tokens declarados: ~50
- Tokens huérfanos detectados: **6** (`lime-accent`, `sidebar-frosted`, `noise-overlay`, `radius-button`, `radius-pill` parcial, `font-editorial` en producción)
- Tokens sin documentar pero usados en producción: **5** (`metric`/`metric-subtle`, `radius-card`, `font-tnum`, `ink.*`, `page-bg`/`bodycard-bg`/`sidebar-bg`)
- Primitivas shadcn instaladas: **30+** · documentadas: **~8**
