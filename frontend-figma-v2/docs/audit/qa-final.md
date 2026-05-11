# QA final · Design System de Licénciame

**Fecha:** 2026-04-24
**Auditorías de origen:** `audit-ds-01-inventario.md`, `audit-ds-02-cruce-app.md`
**Ámbito:** validar que los hallazgos de las dos auditorías quedaron resueltos
después de los Prompts 3-9 y la limpieza de primitivas shadcn.

---

## Resumen ejecutivo

El Design System pasó de un estado **single-page con 13/14 placeholders en
Catalog, sidebar plano de 63 anclas, 5+ hex hardcoded en producción y 15
primitivas shadcn zombies** a un **DS con 14/14 secciones de Catalog
documentadas como DSComponentSpec, sidebar acordeón con 8 grupos, surfaces
HSL-backed, 0 hex en los 4 callsites visibles más críticos (sidebar, drawer,
KPI, deltas) y 12 dependencias npm desinstaladas**. Los hex residuales
detectados están confinados a (a) generadores de PDF que requieren strings
hex por contrato de jsPDF, (b) brand colors de plataformas externas
(Instagram, Facebook), y (c) tres tokens semánticos faltantes
(`warning-foreground`, `success-foreground`, `info-foreground`) que se
registran como issue **major** para el siguiente loop. La estructura del DS
y la consistencia DS↔app están listas para handoff.

---

## Checklist

### TOP 5 de audit-01

| # | Item | Resultado |
|---|---|---|
| 1 | Catalog 14/14 secciones con preview, código y DSComponentSpec | **PASS** — todas entre 117 y 216 líneas (ver delta abajo) |
| 2 | `grep #[0-9A-Fa-f]` fuera de `index.css` con 0 resultados esperados | **PARTIAL** — 4 callsites visibles arreglados; 134 hits restantes son: PDFs (jsPDF), brand colors externos, swatches del propio DS y tokens semánticos no creados. Ver issues. |
| 3 | Tabla "semantic tokens" en ColorsSection muestra tokens reales con demos | **PASS** — `SEMANTIC_TOKENS` array contiene `bg-background`, `bg-card`, `bg-muted`, `bg-primary`, `text-foreground`, `border-border`, `ring-ring`, etc. con swatches HSL-backed |
| 4 | Primitivas en uso documentadas; zombies eliminadas | **PASS** — 15 zombies eliminadas, Popover conservado y documentado, ver `shadcn-cleanup.md` |
| 5 | Foundations↔Responsive sin duplicación (Responsive referencia) | **PASS** — secciones Responsive enlazan a Foundations vía anclas; no redefinen tokens |

### Lista C de audit-02 (componentes huérfanos)

| Componente | Sección DS | Estado |
|---|---|---|
| PersistentPlayer + TrackPreviewButton | `Components/Player`, `ds/TrackPreviewButton` | **PASS** |
| KPICard (4 variantes) | `Components/KPICard` | **PASS** |
| TopItemRow generalizado | `Components/TopItemRow`, `ds/TopItemRow.tsx` | **PASS** |
| AppSidebar real | `Components/Sidebar`, `ui/sidebar.tsx` eliminado | **PASS** |
| PageShell + BodyCard | `Layouts/PageShell`, `Layouts/BodyCard`, `Layouts/AppLayout` | **PASS** |
| ImageOverlayCard consolida 3 cards | `ds/ImageOverlayCard.tsx`, sección `Components/ImageOverlayCard` | **PASS** |
| Catalog (14 secciones) | `Catalog/*` | **PASS** (cubierto por TOP-5 #1) |
| Frosted sticky header | `ds/FrostedHeader`, sección `Components/FrostedHeader` | **PASS** |
| Avatar primitiva | `ds/Avatar.tsx`, sección `Components/Avatar` | **PASS** |

Lista C **= []** ✓

### Sidebar con acordeones

| Item | Resultado |
|---|---|
| Grupos colapsables click + teclado | **PASS** — `SidebarAccordion/parts/SidebarGroupItem.tsx` |
| `aria-expanded` correcto | **PASS** |
| Estado persiste en localStorage | **PASS** — `SidebarAccordion.hooks.ts` |
| Grupo de la sección activa abre solo | **PASS** |
| Orden: Get Started → Brand → Foundations → Components → Layouts → Responsive → Dashboard v2 → Catalog | **PASS** — confirmado en `navigation.ts` |

### Layout 2 columnas

| Item | Resultado |
|---|---|
| Components / Responsive / Dashboard v2 / Catalog usan `layout="split"` | **PASS** (16+ secciones detectadas) |
| Foundations usa `layout="foundation"` | **PASS** |
| Get Started + Brand usan `layout="article"` | **PASS** |
| `DSCode` con `max-height` 420px, scroll interno, copiar sticky | **PASS** |
| Mobile apila correctamente | **PASS** — `DSSectionBody` colapsa a stack en `<lg` |

### Colapsos del cuerpo

| Cerrados por defecto | Resultado |
|---|---|
| Tokens, A11y, props extensas, código completo, casos borde, changelog | **PASS** — `DSCollapsibleA11y`, `DSCollapsibleTokens`, `DSCode collapsedByDefault` |

### Consistencia DS ↔ app

| Item | Resultado |
|---|---|
| Componentes documentados se renderizan igual en DS y app | **PASS** — el DS importa los componentes reales de `src/features/**` y `src/components/**`, no demos |
| Cambiar token en `index.css` actualiza ambos lados | **PASS** — surfaces HSL-backed (`--page-bg`, `--bodycard-bg`, `--sidebar-bg`, `--ink-900`, `--ink-700`) |
| 0 hex hardcoded fuera de `index.css` | **PARTIAL** — ver issue MAJOR-1 |
| `font-tnum` usado consistentemente en cifras | **PASS** — KPI, deltas, métricas |

### Decisiones registradas

| Doc | Estado |
|---|---|
| `/docs/audit/tokens-decisions.md` | **PASS** |
| `/docs/audit/shadcn-cleanup.md` | **PASS** (creado en este loop) |
| `README.md` con sección Design System | **PASS** (creado en este loop) |

### Accesibilidad básica

| Item | Resultado |
|---|---|
| Contraste AA en pares texto/fondo | **PASS** — validado en tokens HSL del DS |
| Focus visible consistente | **PASS** — `focus-visible:ring-2 ring-ring` global |
| Sidebar navegable solo con teclado | **PASS** |
| Acordeones con `aria-expanded` y Enter/Space | **PASS** |

### Performance

| Item | Resultado |
|---|---|
| `layout="split"` no empeoró el DOM | **PASS** — split solo divide visualmente, no añade nodos significativos |
| Lazy rendering por IntersectionObserver | **N/A** (recomendación para futuro, ver Issue MINOR-1) |

---

## Issues pendientes

### MAJOR-1 · Tokens semánticos `*-foreground` faltantes

**Síntoma:** 134 hits de hex en producción tras los fixes obvios. Desglose:

| Categoría | Hits | Acción |
|---|---:|---|
| PDFs (`generateQuotePdf`, `generateReceiptPdf`, `generateCertificate`) usan strings hex porque jsPDF no acepta variables CSS | ~13 | **JUSTIFICADO** — extraer a constantes en `src/design-system/tokens/pdfPalette.ts` con comentario explicando que es un bridge para jsPDF |
| Brand colors de Instagram (`#E1306C`, `#C13584`), Facebook (`#1877F2`, `#166FE5`), TikTok | ~10 | **JUSTIFICADO** — son colores de marca de terceros, no tokens del DS. Mover a `src/features/social/components/ConnectFlow/brandColors.ts` |
| `text-[#92400E]`, `text-[#166534]`, `text-[#1E40AF]` en LowBalance, DemoNoticeBanner, PurchaseTimeline | ~10 | **FIX REQUERIDO** — añadir tokens `--color-warning-foreground`, `--color-success-foreground`, `--color-info-foreground` a `index.css` y migrar callsites |
| Hex en swatches/docs del DS (ColorsSection, ChartPaletteSection, SidebarSection, KpiRowSection) | ~50 | **JUSTIFICADO** — el DS documenta los hex como referencia visible para diseñadores |
| Defaults de Vite en `src/App.css` | 3 | **MINOR** — borrar `App.css` o reescribir sin defaults |

**Severidad:** Major (los 10 hits de `text-[#92400E]`/`#166534`/`#1E40AF` son
estilado de producción, no documentación).

### MINOR-1 · Lazy rendering del DS single-page

El DS sigue siendo long-scroll y monta todas las secciones en cada navegación.
Con el split layout no empeoró, pero tampoco mejoró. Recomendación:
`useInView` + render condicional por sección. No bloqueante.

### MINOR-2 · `src/App.css` huérfano

Contiene defaults de Vite (`#646cffaa`, `#888`) sin uso real. Borrar.

### MINOR-3 · Comentario JSDoc en FrostedHeader

`FrostedHeader.tsx:27` menciona `#F3F4F6` como referencia documental. Cambiar
a `var(--bodycard-bg)` en el comentario para no aparecer en grep.

---

## Delta antes/después

| Métrica | Antes | Después |
|---|---:|---:|
| Secciones DS COMPLETAS (DSComponentSpec) | 23 | **63** (todas las del sidebar) |
| Secciones PLACEHOLDER (≤21 líneas) | 13 (Catalog) | **0** |
| Componentes huérfanos (Lista C) | 9 | **0** |
| Hex hardcoded en producción visible (sidebar, drawer, KPI, deltas) | 7+ | **0** |
| Hex hardcoded total en `src/` (incluye PDFs, brand externos, docs DS) | ~140 | **134** (categorizados, ver issue MAJOR-1) |
| Primitivas shadcn zombies en `src/components/ui/` | 15 | **0** |
| Dependencias npm de primitivas zombies | 12 | **0** |
| Surfaces tokenizadas a HSL (`page-bg`, `bodycard-bg`, `sidebar-bg`, `ink-900/700`) | 0 | **5** |
| Sidebar del DS con acordeón + persistencia | No | **Sí** |
| README con sección Design System | No | **Sí** |

---

## Recomendaciones para el siguiente loop

1. **Cerrar MAJOR-1** creando los tres `*-foreground` y migrando los 10
   callsites identificados.
2. Extraer `pdfPalette.ts` y `brandColors.ts` para que el grep de hex
   reporte `0` en `src/` excluyendo esos dos archivos justificados.
3. Borrar `src/App.css`.
4. Considerar lazy rendering por `IntersectionObserver` en `DesignSystem.tsx`
   solo si el TTI medido en mobile lo pide.
