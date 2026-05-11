# Auditoría DS Licénciame · 02 — Cruce App ↔ Design System

**Fecha**: 2026-04-24  
**Alcance**: páginas reales de la app (todo `src/pages/**` + features que componen) cruzadas contra el inventario `audit-ds-01-inventario.md`.  
**Modo**: read-only.

---

## 0. Mapa de rutas reales

Origen: `src/App.tsx`. Las páginas de `src/pages/**` son thin (delegan en features). El layout de app (`AppLayout`) envuelve todas las rutas autenticadas y monta sidebar + drawer móvil + reproductor persistente.

| Ruta | Page | Feature contenedora |
|---|---|---|
| `/` | `Landing` | inline (`Button`) |
| `/register` | `Register` | `auth/RegisterForm` |
| `/verify-email` | `VerifyEmail` | `auth/VerifyEmail` |
| `/onboarding` | `Onboarding` | `onboarding/OnboardingWizard` |
| `/dashboard03` | `Dashboard03` | `dashboard-v2/DashboardLayoutV2` |
| `/catalog` + `/catalog/track/:id` | `Catalog`, `TrackDetail` | `catalog/CatalogPage`, `catalog/TrackDetailPage` |
| `/licensing/new` | `LicensingNew` | `licensing/LicensingWizard` |
| `/licenses` + `/licenses/:id` | `Licenses`, `LicenseDetail` | `licensing/LicensesListPage`, `licensing/LicenseDetailPage` |
| `/monitoring` | `Monitoring` | `tracking/MonitoringPage` |
| `/packages` + `/packages/history` + `/packages/history/:id` | `Packages`, `PurchaseHistory`, `PurchaseDetail` | `packages/PackagesPage`, `PurchaseHistoryPage`, `PurchaseDetailPage` |
| `/social` | `Social` | `social/SocialAccountsPage` |
| `/design-system` | DS interno | n/a |

⚠️ No hay rutas `/login`, `/admin`, `/metrics` aunque se referencian en el sidebar (`href: "#"` para Proyectos, Shortlists, Configuración; `/metrics` aparece como CTA route en KPIs pero no existe).

---

## 1. Componentes por página

Leyenda · **[DS]** primitiva de `src/components/ui/**` o `src/components/{cards,tables,layout,sidebar}/**` documentada · **[FEATURE]** componente publicado por una feature (re-utilizable en teoría) · **[INLINE]** definido directo en la page sin abstraer · **[AD-HOC]** componente de una feature que **debería** ser primitiva del DS.

### 1.1 `Landing`
- [DS] `Button` × 2
- [INLINE] section + h1 + p (estructura ad-hoc)

### 1.2 `Register`
- [DS] —
- [FEATURE] `RegisterForm` (auth)
- [INLINE] header con `brandLogotipo`, grid de 4 features con iconos lucide

### 1.3 `VerifyEmail`
- [DS] `Card`, `CardContent`
- [FEATURE] `VerifyEmail` (auth)

### 1.4 `Onboarding`
- [FEATURE] `OnboardingWizard` (5 steps internos)
- [DS interno wizard] usa `Button`, `Input`, `Label`, `RadioGroup`, `Select`, `Checkbox`, `Form`

### 1.5 `Dashboard03` → `DashboardLayoutV2`
- [DS] `Alert` (error state), `Button`, `Card`, `Skeleton`
- [FEATURE] `DashboardHeader`, `AlertsSection`, `KpiRow`, `CreditUsageChart`, `WalletSection`, `TopTracks`, `PlatformBreakdown`, `RecentActivity`, `DashboardEmptyStateV2`, `OnboardingResumeBanner`
- [AD-HOC] **Sticky header wrapper con gradiente translúcido + `backdrop-filter: blur(12px)`** definido inline en `DashboardLayoutV2` con `style={{ background: "linear-gradient(...)" }}` — receta de "frosted overlay" no encapsulada

### 1.6 `Catalog` → `CatalogPage`
- [DS] —
- [FEATURE] `CatalogHeader`, `FilterPanel`, `FilterPanelMobileSheet`, `ThemedCards`, `TrackList` (`TrackGrid`/`TrackTable`), `CatalogPagination`, `CatalogEmptyState`, `NoResultsEmptyState`, `FilteredEmptyState`, `CatalogErrorState`, `TrackListSkeleton`
- [AD-HOC] `ThemedCard` (image card con gradient overlay + título/desc) — duplica conceptualmente `CategoryCard`/`MoodCard` del DS pero usa otros tokens

### 1.7 `TrackDetail` → `TrackDetailPage`
- [FEATURE] `TrackDetailPage` (player inline, metadata, `LicensabilityMatrix`, `SimilarTracks`)
- [DS] usa `Badge`, `Button`, `Card`, `Tooltip`, `PlatformBadge`

### 1.8 `LicensingNew` → `LicensingWizard`
- [FEATURE] wizard con steps (selección, configuración, confirmación)
- [DS] `Button`, `Card`, `Input`, `Select`, `RadioGroup`, `Checkbox`, `Progress`, `Form`

### 1.9 `Licenses` / `LicenseDetail`
- [FEATURE] `LicensesListPage`, `LicenseDetailPage`, `LicenseStatusBadge`, `MonthlyExtendedSummary`, `LicenseAssociatedContent`, `CancellationDialog`
- [DS] `Table`, `Badge`, `Button`, `Card`, `Skeleton`, `AlertDialog`, `DropdownMenu`

### 1.10 `Monitoring` → `MonitoringPage`
- [FEATURE] `DetectedPostsFeed`, `FeedAggregates`, `FeedToolbar`, `ManualLinkDialog`, `UnlinkDialog`, `SnapshotViewer`, `SyncStatusBanner`, `DevTrackingPanel`
- [DS] `Tabs` (única ocurrencia en toda la app), `Dialog`, `Button`, `Badge`, `Skeleton`, `Tooltip`, `Sheet`

### 1.11 `Packages` / `PurchaseHistory` / `PurchaseDetail`
- [FEATURE] `PackagesPage`, `PackageCardsGrid`, `BuyCreditsCTA`, `LowBalanceAlert`, `WalletHubHeader`, `WalletKpiGrid`, `ActiveBagsList`, `RecentPurchasesPreview`, `FifoExplainerCard`, `CorporateSupportCard`, `PurchaseDialog`, `CheckoutWizard`, `ProvisionalDocumentBadge`, `PurchaseTimeline`, `PurchaseDetailDrawer`, `PurchaseHistoryPage`, `PurchaseDetailPage`
- [DS] `Card`, `Button`, `Dialog`, `Sheet`, `Alert`, `Badge`, `Progress`, `Tooltip`, `DropdownMenu`
- [AD-HOC] `ProvisionalDocumentBadge` (badge tematizado con icono — encajaría como variante de `Badge`)

### 1.12 `Social` → `SocialAccountsPage`
- [FEATURE] `SocialAccountCard`, `ConnectFlow`, `ManageAccounts`, `DebugPanel`
- [DS] `Card`, `Button`, `Badge`, `Switch`, `Dialog`, `Alert`

### 1.13 `AppLayout` (envuelve todo)
- [DS layout] `PageShell`, `BodyCard`, `AppSidebar` (`SidebarShell`+`SidebarLogo`+`SidebarNav`+`SidebarUser`), `AppMobileDrawer`
- [FEATURE] `PersistentPlayer`, `DetectionToastsContainer`, `DevTrackingTrigger`
- [INLINE] botón hamburguesa hardcoded con `bg-sidebar-bg text-ink-900` y `style={{ width: 40, height: 40 }}`

---

## 2. LISTA A — Componentes documentados y usados (sanos)

Cruce contra `audit-ds-01-inventario.md` y conteo real de imports:

| Componente DS | Usos en app | Estado |
|---|---|---|
| `Button` | **141** | ✅ |
| `Card` | **43** | ✅ |
| `Skeleton` | **36** | ✅ |
| `Alert` | **26** | ✅ |
| `Tooltip` | **20** | ✅ |
| `Badge` | **19** | ✅ |
| `Dialog` | **18** | ✅ |
| `Label` | **12** | ✅ |
| `DropdownMenu` | **11** | ✅ |
| `Input` | **10** | ✅ |
| `RadioGroup`, `Checkbox` | **8** c/u | ✅ |
| `Select` | **7** | ✅ |
| `Sheet`, `Separator`, `PlatformBadge` | **6** c/u | ✅ |
| `Table`, `Progress` | **5** c/u | ✅ |
| `Switch`, `Slider` | **4** c/u | ✅ |
| `Textarea`, `Form`, `AlertDialog` | **3** c/u | ✅ |
| `Toggle`, `Toast`, `ScrollArea`, `KPICard`, `EmptyStateCard`, `Accordion` | **2** c/u | ✅ |
| `Toaster`, `Tabs`, `Sonner`, `SectionToc`, `Pagination`, `Collapsible`, `AspectRatio` | **1** c/u | ✅ |
| `CategoryCard`, `MoodCard`, `TrackTable` (cards/tables) | usados en DS demo + features cards | ✅ |
| Layout: `PageShell`, `BodyCard`, `AppSidebar`, `AppMobileDrawer` | usados en `AppLayout` | ✅ |
| Sidebar primitives: `SidebarShell`, `SidebarLogo`, `SidebarNav`, `SidebarNavItem`, `SidebarUser` | usados en `AppSidebar` | ✅ |

---

## 3. LISTA B — Documentados pero NO usados en la app (zombies)

Detectados con `grep -rln "from \"@/components/ui/<x>\"" src --exclude-dir=design-system`:

| Componente | Doc en DS | Usos producción |
|---|---|---|
| `Sidebar` (shadcn `ui/sidebar.tsx`) | sí (sección `sidebar`) | **0** — la app usa el set propio en `src/components/sidebar/**`, no el shadcn Sidebar |
| `ToggleGroup` | en `materials` indirectamente | **0** |
| `Resizable` | implícito | **0** |
| `Popover` | parcial | **0** |
| `NavigationMenu` | implícito | **0** |
| `Menubar` | implícito | **0** |
| `InputOTP` | implícito | **0** |
| `HoverCard` | implícito | **0** |
| `Drawer` (vaul) | implícito | **0** — la app usa `Sheet` |
| `ContextMenu` | implícito | **0** |
| `Command` | implícito | **0** |
| `Chart` (shadcn chart wrapper) | en spec | **0** — `CreditUsageChart` usa Recharts directo |
| `Carousel` | implícito | **0** |
| `Calendar` | implícito | **0** |
| `Breadcrumb` | implícito | **0** |
| `Avatar` (shadcn) | implícito | **0** — `SidebarUser` y `RecentActivity` hacen el avatar inline con `div + initials` |
| Tokens `navbar-frosted`, `text-gradient-primary`, `noise-overlay`, `font-editorial`, `lime-accent` | sí (Foundations/Materials) | **0** en producción real |
| Sección DS "voice-tone", "principles", "contributing" | sí | **0** consumo (son docs, OK) |

---

## 4. LISTA C — Usados en la app pero NO documentados (huérfanos)

🚨 **Componentes que el equipo ya usa y que el DS ignora.** Son los más urgentes de incorporar.

### 4.1 Layout / shell
| Componente | Ubicación | Por qué importa |
|---|---|---|
| `PageShell` | `src/components/layout/PageShell.tsx` | Wrapper raíz de la app (define background `bg-page-bg`) |
| `BodyCard` | `src/components/layout/BodyCard.tsx` | Floating content card con margin 10 px y `rounded-card` — patrón visual estrella del producto, sin docs |
| `AppLayout` | `src/components/layout/AppLayout.tsx` | Orquesta sidebar + drawer + body + player |
| `AppSidebar`, `AppMobileDrawer`, `HorizontalScroller` | `src/components/layout/**` | Layout primitives sin sección DS |

### 4.2 Sidebar (set propio)
| Componente | Ubicación |
|---|---|
| `SidebarShell` | inline glass panel 13.1875rem, blur 60px, bg `rgba(234,234,235,0.6)` |
| `SidebarLogo`, `SidebarNav`, `SidebarNavItem`, `SidebarUser` | `src/components/sidebar/**` |

El DS sí tiene sección `sidebar` pero documenta un sidebar genérico, no el real de la app. **Hay dos sidebars en el repo** (shadcn `ui/sidebar.tsx` + custom `components/sidebar/**`) y el shadcn no se usa.

### 4.3 Reproductor persistente
| Componente | Ubicación |
|---|---|
| `PersistentPlayer` (+ `parts/PlayerTrackInfo`, `PlayerControls`, `PlayerProgress`, `PlayerVolumeControl`, `PlayerActions`, `PlayerErrorBanner`, `PlayerExpandedSheet`) | `src/features/player/components/PersistentPlayer/**` |

Componente global `fixed z-40` con backdrop-blur, modos desktop/mobile, sheet expandido. **Sin sección DS** y profundamente reusable.

### 4.4 Dashboard v2 — adaptadores feature
| Componente | Ubicación |
|---|---|
| `DashboardHeader`, `PeriodSelector`, `ExportMenu`, `FreshnessIndicator` | `dashboard-v2/components/DashboardHeader/**` |
| `KpiCard` (adapter sobre `KPICard`) | `dashboard-v2/components/KpiRow/KpiCard.tsx` |
| `CreditUsageChart`, `CreditUsageLegend`, `CreditUsageTooltip` | `dashboard-v2/components/CreditUsageChart/**` |
| `WalletSection`, `MiniRing` | `dashboard-v2/components/WalletSection/**` |
| `TopTrackRow` | `dashboard-v2/components/TopTracks/TopTrackRow.tsx` |
| `PlatformCard` (interno de `PlatformBreakdown`) | `dashboard-v2/components/PlatformBreakdown/**` |
| `ActivityItem`, `MomentHeader` | `dashboard-v2/components/RecentActivity/**` |
| `AlertBanner`, `IconBubble` | `dashboard-v2/components/AlertsSection/**` |

El grupo "Dashboard v2" del DS lo describe a nivel de feature (anatomy/tokens), pero **no expone los building blocks individuales**. Si una nueva pantalla quiere "row con cover + título + métrica destacada" tiene que copiar `TopTrackRow`.

### 4.5 Catalog (lo que el DS dejó como placeholder en `audit-01`)
| Componente | Ubicación |
|---|---|
| `CatalogHeader`, `ViewModeToggle`, `CatalogPagination`, `FilterPanel`, `FilterPanelMobileSheet` | `catalog/components/**` |
| `TrackCard`, `TrackCardFavorite`, `TrackRow`, `TrackGrid`, `TrackTable`, `TrackList`, `TrackListSkeleton` | `catalog/components/**` |
| `ThemedCard`, `ThemedCards` | `catalog/components/ThemedCards/**` |
| `LicensabilityMatrix`, `SimilarTracks`, `SimilarTrackCard` | `catalog/components/**` |
| `PlatformIcons` | `catalog/components/PlatformIcons` (¿duplica `PlatformBadge`?) |
| `CatalogEmptyState`, `NoResultsEmptyState`, `FilteredEmptyState`, `CatalogErrorState` | `catalog/components/empty-states/**` |

**13 secciones placeholder ↔ ~25 componentes huérfanos reales.**

### 4.6 Packages / Wallet
| Componente | Ubicación |
|---|---|
| `WalletHubHeader`, `WalletKpiGrid`, `BuyCreditsCTA`, `LowBalanceAlert` | `packages/components/**` |
| `PackageCardsGrid`, `ActiveBagsList`, `FifoExplainerCard`, `CorporateSupportCard` | `packages/components/**` |
| `CheckoutWizard` (5 steps) | `packages/components/CheckoutWizard/**` |
| `RecentPurchasesPreview`, `PurchaseTimeline`, `PurchaseTimelineItem`, `PurchaseDialog`, `PurchaseDetailDrawer`, `ProvisionalDocumentBadge`, `DemoNoticeBanner` | `packages/components/**` |

### 4.7 Licensing / Tracking / Social / Auth
- Licensing: `LicensingWizard`, `CancellationDialog`, `LicenseStatusBadge`, `MonthlyExtendedSummary`, `LicenseAssociatedContent`
- Tracking: `DetectedPostsFeed`, `FeedAggregates`, `FeedToolbar`, `ManualLinkDialog`, `UnlinkDialog`, `SnapshotViewer`, `SyncStatusBanner`, `DetectionToastsContainer`
- Social: `SocialAccountCard`, `ConnectFlow`, `ManageAccounts`
- Auth: `RegisterForm`, `VerifyEmail`, `PasswordInput`, `CountrySelect`, `RoleSelect`, `OnboardingGuard`
- Onboarding: `OnboardingWizard` (5 steps)

### 4.8 Utilidades visuales no documentadas pero usadas
- Receta **"frosted sticky header con gradiente"** del `DashboardLayoutV2` (gradient + `backdrop-filter`) — repetida pero inline.
- `font-tnum` (utilidad para cifras tabulares en KPIs y charts).
- `text-ink-900`, `text-ink-700`, `bg-sidebar-bg`, `bg-page-bg`, `bg-bodycard-bg` — aparecen en múltiples features.
- `card-blur-content` consumido por `CardImageOverlay` (reusado por `CategoryCard`, `MoodCard`).
- `bg-foreground/10` para skeletons sobre tema oscuro (TopTracks loading).
- Avatar circular con iniciales (en `SidebarUser` y `ActivityItem`) — implementado dos veces, sin primitiva.

---

## 5. Dashboard en detalle

### 5.1 Cards "Explora por categoría"

> Nota: el dashboard real (`/dashboard03`) **no tiene** una sección "Explora por categoría". Las cards que coinciden con esa descripción viven en **`/catalog`** dentro de `ThemedCards` (presets que aplican filtros). El DS además tiene `CategoryCard` y `MoodCard` (en `src/components/cards/**`) que son la versión "shelf horizontal" usada en demos, **no en el dashboard real**.

#### 5.1.1 `ThemedCard` (catálogo, real)
- **Estructura**: `<button>` con `aspect-ratio: 8/5`, fondo `background-image` con `bg-cover bg-center`, hover `scale-[1.04]`, gradient overlay `from-[hsl(var(--ink-900)/0.85)] via-25% to-transparent`, contenido al pie: `h3` (`text-sm font-semibold`) + `p` (`text-xs opacity-90`) en blanco.
- **Variantes visibles**: 4 presets (`THEMED_PRESETS`) que aplican filtros distintos.
- **Estados**: hover (zoom imagen), focus (`ring-2 ring-ring`).
- **Props si fuera DS**:
  ```ts
  interface ThemedCardProps {
    title: string;
    description: string;
    image: string;
    aspectRatio?: "8/5" | "1/1" | "16/9";
    overlayIntensity?: "subtle" | "default" | "strong";
    onClick: () => void;
    href?: string; // alternativa a onClick
    'aria-label'?: string;
  }
  ```

#### 5.1.2 `CategoryCard` (DS demo, no en dashboard real)
- 280×280 (1:1), `rounded-[1.13rem]`, fondo `bg-white`, área superior con imagen + zona inferior reservada `4.44rem` con `card-blur-content` (white 60% + blur 100px), título h2 bold + descripción + `ArrowUpRight` 20 px.
- **Inconsistencia**: el dashboard real no usa este componente; vive solo en demos del DS.

### 5.2 KPIs del header

#### Estructura real (`KpiRow` → `KpiCard` → `KPICard` primitive)
- Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`.
- `KPICard` primitive (`src/components/ui/kpi-card.tsx`) con: label uppercase pequeño, **valor numérico hero (`text-3xl/4xl font-semibold font-tnum`)**, opcional `delta` pill (sentiment positive/negative/neutral, flecha + porcentaje), opcional sparkline (`recharts` Area), opcional `CountdownProgress`.
- **Variantes detectadas**: 4 KPIs reales — `balance` (con sparkline), `active-licenses` (con delta), `tracked-posts` (con delta + sparkline), `bag-validity` (con `CountdownProgress` color dinámico verde/amarillo/rojo).
- **Estados**: default, loading (skeletons), low-balance (warning), bag-expiring-soon (warning).
- **Props si fuera DS** (ya tiene primitiva, falta documentar variantes):
  ```ts
  interface KPICardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    delta?: { value: number; sentiment: "positive" | "negative" | "neutral"; label?: string };
    sparkline?: { data: number[]; pattern?: "gradient" | "stripes" | "solid" };
    countdown?: { remaining: number; total: number; warningThreshold?: number };
    sentiment?: "default" | "warning" | "danger";
    cta?: { label: string; href: string };
    onClick?: () => void;
    isLoading?: boolean;
  }
  ```

### 5.3 Tabla "Selecciones recomendadas"

> El nombre real es **`TopTracks`** (`/dashboard03`, panel "Top tracks"). El equivalente con waveform + BPM + acciones inline existe pero vive en **`/catalog` (`TrackTable`)**, no en el dashboard.

#### 5.3.1 `TopTrackRow` (dashboard real)
- Fila clickable con: número de posición (`w-6 font-tnum`), cover 48×48 (`rounded-md`), título + artista (truncate), `PlatformBadge` por plataforma, `Badge variant="metric"` con la métrica destacada, sub-métrica en `text-[11px] text-muted-foreground font-tnum`.
- Header con `<Select>` para cambiar criterio (licenses / impressions / credits).
- **Estados**: default, hover (`bg-accent`), focus, loading (skeletons), empty (`EmptyStateCard`).
- **Props DS**:
  ```ts
  interface TopItemRowProps<TMetric extends string> {
    position: number;
    cover?: { src: string; alt: string };
    title: string;
    subtitle?: string;
    rightBadges?: ReactNode; // ej. <PlatformBadge />
    primaryMetric: { label: string; value: string };
    secondaryMetric?: string;
    onClick?: () => void;
    href?: string;
  }
  ```

#### 5.3.2 `TrackTable` (catálogo, "real" tabla con waveform)
- Shell `bg-white border border-lm-gray-200 rounded-lg`, header row + N rows.
- **Columnas**: cover · play button · título+artista · BPM · duration · waveform (visible en `lg+`) · acciones (favorite, more) · CTA (Licenciar).
- **Variantes**: row default, row playing (ring + estado), row favorite-on.
- **Props DS**:
  ```ts
  interface TrackTableRowProps {
    track: TrackSummary;
    onPlay?: (track) => void;
    onLicense?: (track) => void;
    onFavorite?: (track) => void;
    onDownload?: (track) => void;
    onMore?: (track) => void;
    showWaveform?: boolean; // controla columna lg+
  }
  ```

### 5.4 Reproductor inline de preview

#### 5.4.1 `PersistentPlayer` (global, fijo)
- `fixed z-40 bg-surface/95 backdrop-blur-xl border border-lm-gray-200 rounded-card shadow-lg`.
- **Variantes**: desktop (1 fila, respeta gutter del sidebar) vs mobile (2 filas, `PlayerExpandedSheet` para vista completa).
- **Partes**: `PlayerTrackInfo` (cover + título + artista) · `PlayerControls` (prev/play/next) · `PlayerProgress` (slider + tiempo) · `PlayerVolumeControl` · `PlayerActions` (favorite, license CTA, more) · `PlayerErrorBanner`.
- **Estados**: hidden (no track), playing, paused, loading, error, expanded (mobile sheet), keyboard-navigated (`role="region"` + live region).
- **Props DS**:
  ```ts
  interface PersistentPlayerProps {
    track: PlayerTrack | null;
    isPlaying: boolean;
    progress: number; duration: number; volume: number;
    error?: string | null;
    onPlayPause: () => void;
    onSeek: (t: number) => void;
    onVolumeChange: (v: number) => void;
    onNext?: () => void; onPrev?: () => void;
    onClose?: () => void;
    actions?: ReactNode; // license / favorite / more
    variant?: "desktop" | "mobile" | "auto";
  }
  ```

#### 5.4.2 Botón inline de preview en `TrackRow`
- Botón redondeado superpuesto al cover, conmuta `Play`/`Pause` lucide, integrado con `usePlayer().loadAndPlay`. Repetido en `TopTrackRow`, `TrackTableRow`, `TrackCard`, `SimilarTrackCard`, `TrackDetailPage`.
- Candidato a `<TrackPreviewButton track={...} />` en DS (5+ callsites idénticos).

### 5.5 Sidebar del dashboard

#### `AppSidebar` (real)
- `SidebarShell variant="fixed"`: panel de **211 px** (`13.1875rem`), `position: fixed`, `h-screen`, `z-50`, fondo `rgba(234,234,235,0.6)` + `backdrop-filter: blur(60px)`, sin border (`border-black/0`). Solo `md:block` (oculto en mobile, sustituido por `AppMobileDrawer`).
- `SidebarLogo`: `pt-6 px-5 pb-6`, `<img src="isotipo.svg" h-7>`.
- `SidebarNav` → `SidebarNavItem` (icono lucide + label + opcional `badgeCount`).
- `SidebarUser` al pie: avatar circular `h-9 w-9 bg-primary text-primary-foreground` con iniciales + nombre + role + `DropdownMenu` (Settings, Sign out).
- **10 items actuales**: Dashboard, Explorar música, Proyectos, Licencias, Monitoreo (con badge), Shortlists, Créditos, Redes sociales, Configuración, Design System. **Tres usan `href: "#"`** (Proyectos, Shortlists, Configuración) — links rotos de cara al usuario.
- **Props DS**:
  ```ts
  interface AppSidebarProps {
    items: SidebarNavEntry[];
    user: { initials: string; name: string; role: string; avatarUrl?: string };
    activePath: string;
    onLogout: () => void;
    variant?: "fixed" | "static";
  }
  ```

---

## 6. Sistema visual del dashboard (radiografía)

### 6.1 Color accent (lima `#DBEC62` / `bg-primary`)
- **CTAs primarios**: `<Button>` default heredando `bg-primary text-primary-foreground` (`#050505` sobre `#DBEC62`, no blanco) + utilidad `btn-glow` opcional con `box-shadow: 0 0 20px rgba(219,236,98,0.3)`.
- **Selección activa de tracks**: `ring-2 ring-primary` sobre el `<article>` cuando `currentTrack.id === track.id`.
- **Sidebar item activo**: fondo `bg-sidebar-accent` (mismo lima `68 81% 65%`).
- **Avatar de usuario en sidebar**: circle `bg-primary text-primary-foreground` con iniciales.
- **Charts**: el lima es solo `--chart-1` dentro de la paleta de 6 series (no domina el chart).
- **Lo que NO debe usarse en lima**: badges (usan `metric`/`success`/`warning`/`error` subtle), texto sobre fondo claro (no hay `text-primary` en producción salvo focus rings), backgrounds extensos.

### 6.2 Tipografía
- **Familia única en producción**: `Inter` (400/500/600/700) cargada vía Google Fonts.
- **`PP Editorial New`** declarada (`font-serif`/`font-editorial`) pero **no se usa** en ninguna pantalla real (huérfana confirmada en audit-01).
- **Pesos predominantes**: `font-medium` (500) para items y body fuerte, `font-semibold` (600) para títulos de sección, `font-bold` (700) puntual en heroes.
- **Tamaños predominantes**:
  - h1 dashboard: `text-xl md:text-3xl lg:text-4xl font-semibold tracking-tight`
  - h2 panel: `text-base font-semibold`
  - body: `text-sm`
  - metadata/captions: `text-xs text-muted-foreground`
  - números KPI: `text-3xl/4xl font-semibold font-tnum`
- **`font-tnum`** (cifras tabulares + lining): clave en KPIs, charts, posiciones (`TopTrackRow`), métricas de plataforma. Sin documentar.

### 6.3 Border radius
- Cards de panel: **`rounded-card` (20 px)** — tamaño estrella, no documentado en `RadiusSection`.
- Body card / sidebar / modales: `rounded-card`.
- Buttons: `rounded-full` (la primitiva `Button` así lo declara).
- Inputs / pills internos: `rounded-md` (8 px) o `rounded-lg` (12 px).
- Covers de track: `rounded-md`.
- `CategoryCard`: `rounded-[1.13rem]` (≈18 px) — valor mágico fuera del token.
- Avatares circulares: `rounded-full`.

### 6.4 Spacing entre secciones
- Contenedor principal: `flex flex-col gap-6` entre bloques (KpiRow, splits, RecentActivity).
- Splits internos: `grid grid-cols-12 gap-6` desktop, `grid-cols-1 gap-6` mobile.
- Padding de panel-card: `p-6`.
- Padding de body card: `p-4 md:p-10` (variable).
- Margin top de heroes con sticky: `-mt-12 md:-mt-12` para extender bajo el header frosted.
- Items densos (filas de track): `py-2.5` con `gap-3` horizontal.

### 6.5 Tratamiento de imágenes
- **Covers de track**: cuadrados `h-12 w-12` o `h-14 w-14`, `rounded-md`, `object-cover`, `bg-muted` como placeholder, fallback `<Music />` lucide cuando no hay cover.
- **`ThemedCard`**: aspect `8/5`, full-bleed background-image, gradient overlay desde `--ink-900/0.85` al transparente, contenido pie en blanco. Hover `scale-[1.04] duration-300`.
- **`CategoryCard`**: aspect `1/1`, full-bleed con zona inferior reservada `4.44rem` para overlay blur (`card-blur-content` = white 60% + blur 100px), hover `scale-[1.03]`.
- **PlatformBadge**: cuadrado `bg-foreground` (negro) con icono `text-background` blanco — patrón unificado para logos de IG/TT/FB.
- **Avatares**: circle con iniciales sobre `bg-primary` (sidebar) o `bg-muted` (activity feed). Sin `<Avatar />` shadcn aunque está instalado.

---

## 7. Recomendación priorizada · qué llevar al DS primero

Ordenado por **impacto × frecuencia de uso real × ahorro futuro**.

### 🔴 P0 — Estos componentes hoy se copian a mano y bloquean velocidad

1. **`PersistentPlayer` + `TrackPreviewButton`**  
   Vive en `features/player`, lo consume `AppLayout` y todos los catálogos. **Sin sección DS**. El botón de preview se duplica en 5 callsites. → Crear sección `Components/Player`.

2. **`KPICard` extendido (con `delta`, `sparkline`, `countdown`)**  
   Existe la primitiva pero solo se documenta el caso simple. La app usa 4 variantes ricas. → Documentar variantes y estados (low-balance, expiring) en `kpi-card`.

3. **`TopItemRow` (generalización de `TopTrackRow`)**  
   Patrón "número + cover + título/sub + badges + métrica destacada" que aparece también en activity, similar tracks y catálogos. → Sección DS nueva.

4. **`AppSidebar` + `SidebarUser` (avatar dropdown)**  
   El sidebar real no es el shadcn. La sección DS actual documenta otro componente. → Sustituir doc existente por la versión real (con `SidebarShell`/`SidebarLogo`/`SidebarNav`/`SidebarUser`) y deprecar `ui/sidebar.tsx` (huérfano).

### 🟠 P1 — Reduce inconsistencias visibles ya en producción

5. **`PageShell` + `BodyCard`** (layout primitives)  
   Definen el "floating card" característico del producto y los tokens `bg-page-bg`, `bg-bodycard-bg` no documentados. → Sección `Layouts/AppShell`.

6. **`ThemedCard` + reconciliación con `CategoryCard`/`MoodCard`**  
   Hoy hay tres "image card with overlay" con tokens distintos. → Unificar bajo una primitiva con prop `aspectRatio` y `overlayStyle`.

7. **`TrackCard` / `TrackRow` / `TrackTable` (catálogo)**  
   13 secciones DS placeholder ↔ 7+ componentes reusables. Es lo que catálogo está esperando. → Llenar el grupo Catalog del DS replicando el patrón Dashboard v2.

8. **Frosted sticky header recipe**  
   El `DashboardLayoutV2` aplica un gradiente translúcido + `backdrop-filter: blur(12px)` inline. Repetido conceptualmente en navbar/sidebar. → Documentar como utilidad en Materials (`sticky-frosted-header`).

### 🟡 P2 — Higiene y extensibilidad

9. **`Avatar` con iniciales** (primitiva)  
   `SidebarUser` y `ActivityItem` lo implementan inline. `ui/avatar.tsx` shadcn está sin usar. → Crear `<Avatar initials="MG" /> | <Avatar src=... />` con tamaños sm/md/lg.

10. **`EmptyState*` del catálogo** (4 variantes)  
    Existe `EmptyStateCard` primitiva, pero los 4 estados del catálogo no la consumen consistentemente. → Documentar `EmptyState` con variantes `noResults`, `filtered`, `error`, `firstVisit`.

11. **Wizard pattern** (`LicensingWizard`, `CheckoutWizard`, `OnboardingWizard`)  
    Tres wizards distintos con steppers propios. → Primitiva `<StepperWizard steps={...} />` + sección DS.

12. **`Badge variant="metric"`** + `ProvisionalDocumentBadge` + `LicenseStatusBadge`  
    Tres variantes "themed badge" sueltas. → Consolidar en sección DS de Badges (hoy parcial).

### 🧹 Limpieza paralela
- Eliminar primitivas shadcn instaladas y nunca usadas (`Carousel`, `Calendar`, `Breadcrumb`, `HoverCard`, `Menubar`, `NavigationMenu`, `Drawer`, `ContextMenu`, `Command`, `InputOTP`, `Resizable`, `ToggleGroup`, `Avatar` shadcn) **o** documentarlas. Hoy son ruido en `node_modules/UI surface`.
- Eliminar `ui/sidebar.tsx` (no se usa, confunde con `components/sidebar/**`).
- Decidir el destino de `font-editorial`/`PP Editorial New` (huérfana).
- Decidir el destino de `noise-overlay`, `text-gradient-primary`, `navbar-frosted` (huérfanos en producción).
