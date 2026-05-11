
## Diagnóstico

En el refactor mobile-first introdujimos en cada página este patrón:

```text
<div className="md:hidden">       <- AppPageHeader (solo título + hamburger)
<FrostedHeader hidden md:block>  <- Header original con TODAS las acciones
```

El problema: `AppPageHeader` mobile solo recibe `title` + `description`. Todas las acciones (period selector, export, filtros, "Nueva licencia", refresh) viven dentro del header desktop, que está oculto en `<md`. Resultado: en mobile no hay forma de filtrar, exportar ni licenciar.

Además, en `RecentActivity` el `<TabsList className="flex-wrap">` envuelve los 6 tabs en 3 filas en 390px → se ven "explotados".

## Cambios

### 1. Dashboard (`DashboardLayoutV2.tsx`)
- Quitar el wrapper `hidden md:block` del `FrostedHeader` que envuelve `DashboardHeader`. Renderizar `DashboardHeader` siempre (ya es responsive: `flex-col` → `lg:flex-row`).
- Eliminar el `AppPageHeader` mobile-only redundante (el `DashboardHeader` ya tiene `<h1>` y subtítulo implícito vía freshness; mantenemos título consistente con el resto haciendo el `<h1>` responsivo: `text-xl md:text-3xl`, ya está).
- Mantener `FrostedHeader` solo como contenedor sticky en desktop, sin ocultar contenido.

### 2. Catálogo (`CatalogPage.tsx`)
- Misma estrategia: renderizar `CatalogHeader` en todos los breakpoints. Ya tiene chip-row mobile (filtros, sort, page-size, view) y desktop toolbar separados con `lg:hidden` / `hidden lg:flex`.
- Eliminar el `<div className="md:hidden"><AppPageHeader>` que tapa el título real y deja al usuario sin barra de filtros.
- `FrostedHeader` queda como wrapper de scroll-aware solo desktop, pero su contenido se renderiza siempre.

### 3. Mis licencias (`LicensesListPage.tsx`)
- Renderizar `LicensesHeader` (con CTA "Nueva licencia") en todos los breakpoints. `LicensesHeader` ya es responsive (`flex-col sm:flex-row`).
- Quitar el `AppPageHeader` mobile-only.

### 4. Métricas (`MetricsOverviewPage.tsx`)
- Renderizar `MetricsHeader` (export PDF/Excel + refresh) en todos los breakpoints. Ya es `flex-col md:flex-row`.
- Quitar el `AppPageHeader` mobile-only.
- `FrostedHeader` queda como sticky frosted solo en `md+`, pero sin ocultar el contenido en mobile (cambiar `hidden md:block` por algo que solo afecte el frosted styling, no la visibilidad).

### 5. RecentActivity tabs explotados
En `RecentActivity.tsx`, cambiar:
```tsx
<TabsList className="flex-wrap">
```
por una pista horizontal scrolleable en mobile:
```tsx
<TabsList className="w-full overflow-x-auto scrollbar-hide flex md:flex-wrap justify-start md:justify-end">
```
Resultado: en mobile los 6 chips quedan en una sola línea con scroll horizontal sutil (chip row pattern); en desktop conserva el wrap actual.

### 6. Limpieza menor
- El `AppPageHeader` sigue siendo útil para páginas que NO tienen header propio. No se elimina, solo se quita de las 4 páginas que ya tienen header dedicado.
- Validar que el hamburger del sidebar en mobile siga accesible. Como ahora no se renderiza `AppPageHeader` en estas páginas, hay que asegurar que el sidebar trigger esté en otro componente global (revisar `AppLayout` / `PageShell`). Si depende solo de `AppPageHeader`, agregaremos un trigger global mobile en `AppLayout`.

## Verificación

Mobile (390px):
- /dashboard03: chips de período y botón "Exportar" visibles arriba.
- /catalog: chip-row con "Filtros · Ordenar · 24" y CTA filtros funciona.
- /licenses: botón "Nueva licencia" visible arriba.
- /metricas: botón "Exportar" visible arriba.
- Actividad reciente: 6 tabs en 1 fila scrolleable, sin wrap.
- Sidebar hamburger sigue accesible.

Desktop (≥md): sin cambios visuales — los headers ya eran responsive y `FrostedHeader` mantiene el sticky/blur.
