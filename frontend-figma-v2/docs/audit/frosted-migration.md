# Frosted-header migration audit

> Created in the P1-8 documentation pass. Tracks remaining sticky-header
> recipes that should migrate to `<FrostedHeader />` (or the
> `.sticky-frosted-header` utility) in a follow-up loop.

## Migrated ✅

- `src/features/dashboard-v2/components/DashboardLayoutV2.tsx`
  - Was: inline `style={{ background: "linear-gradient(180deg, rgba(243,244,246,...))", backdropFilter: "blur(12px)" }}`
  - Now: `<FrostedHeader intensity="default" translateY={isHeaderVisible ? "0" : "-100%"}>`

- `src/features/catalog/components/CatalogPage/CatalogPage.tsx`
  - Was: `<CatalogHeader />` plano (sin sticky ni blur).
  - Now: envuelto en `<FrostedHeader intensity="default" translateY={isHeaderVisible ? "0" : "-100%"}>` con la misma receta de className que Dashboard v2 (consistencia visual exacta de page headers).

- `src/features/licensing/components/LicensingWizard/LicensingWizardLayout.tsx` — **header + footer migrados** (introduce la nueva variante `position="bottom"` del componente).
  - Was: header (Cancel · Title · Help) + stepper en bloques separados con `border-b`, body con `overflow-y-auto`, footer con `border-t bg-background`.
  - Now: breadcrumb "Volver al track" + header + stepper apilados en un único contenedor `sticky top-0` con `useHeadroom` unificado (los tres bloques se mueven como una unidad). Footer en `<FrostedHeader position="bottom">` SIN `useHeadroom` (acciones siempre visibles). Todo edge-to-edge del BodyCard vía negative margins. Cubre todo el flujo de Licensing.

- `src/features/catalog/components/TrackDetailPage/TrackDetailPage.tsx` — **breadcrumb migrado**.
  - Was: `<BackButton />` plano dentro de un `<div className="space-y-* p-4 sm:p-6 lg:p-8">`.
  - Now: nuevo sub-componente `parts/TrackDetailFrostedNav.tsx` que envuelve `BackButton` en `<FrostedHeader position="top" intensity="default" translateY={isVisible ? "0" : "-100%"}>` con `useHeadroom`, edge-to-edge del BodyCard. Aplicado en los 4 estados (loading, not-found, removed, error, success) para consistencia.

- `src/features/admin/components/AdminPageTitle.tsx` + `AdminLayout.tsx` — **panel Super Admin migrado en bloque** (1 breadcrumb global + 8 page-titles: Overview, Catálogo, Empresas, Paquetes/Precios, Licencias, Facturación, Auditoría, Accesos).
  - Was: `<AdminHeader />` plano renderizado por `AdminLayout` antes del `<Outlet />` (sin sticky, sin blur), seguido de un `<AdminPageTitle />` plano por página (`pb-8`).
  - Now: nuevo wrapper `AdminFrostedHeader` que apila `<AdminHeader />` (breadcrumb) + `children` (page-title) dentro de un único `<FrostedHeader position="top" intensity="default" translateY={isVisible ? "0" : "-100%"}>` con `useHeadroom` compartido — breadcrumb y título se mueven como una unidad. Misma className edge-to-edge que Dashboard v2. `AdminPageTitle` se auto-envuelve en `AdminFrostedHeader`, así que las 8 páginas y `CatalogHeader` (que delega en `AdminPageTitle`) no requirieron cambios. `<AdminHeader />` se eliminó de `AdminLayout`.

## Pending — manual decision required

### `src/features/licensing/components/LicensingWizard/steps/Step2UsageTypeSelection/Step2UsageTypeSelection.tsx` (line ~98)

```tsx
<div className="sticky top-0 z-10 -mx-6 bg-background/95 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70">
  <WalletBalancePill ... />
</div>
```

- Uses `bg-background/95` (token-aware) rather than the `rgba(243,244,246,...)`
  literal. Migrating to `<FrostedHeader intensity="subtle">` would force the
  bodycard base color, which may not match the wizard's parent surface.
- **Decision needed**: do we extend `FrostedHeader` to accept a token-driven
  base (e.g. `baseToken="background"`) before migrating, or accept the
  bodycard base?

### `src/components/ui/section-toc.tsx` (line ~42)

```tsx
"sticky top-[60px] z-20 -mx-4 mb-2 ... bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60"
```

- Mobile-only sticky strip used by section TOCs. Same caveat as Step2: uses
  `--background` rather than the bodycard literal.
- Probably worth its own variant of `FrostedHeader` (`intensity="subtle"` +
  optional border) once the token migration in Prompt 6 lands.

## Out of scope

- `src/components/sidebar/SidebarShell.tsx` — uses the `sidebar-frosted` /
  `--sidebar-bg` recipe, which is a different material (60px blur, no
  gradient). Stays as-is.
- `src/features/design-system/components/DSTopBar.tsx` — solid `bg-card`,
  no transparency. Not a candidate.
- Landing / Auth pages — no sticky navbar today.

## Next steps (Prompt 6 or later)

1. Migrate `--page-bg`, `--bodycard-bg`, `--sidebar-bg` from hex to HSL
   tokens.
2. Add `baseToken` prop to `<FrostedHeader />` so it can consume any HSL
   surface (`background`, `card`, `bodycard-bg`).
3. Migrate the two pending callsites above.
4. Decide whether `sticky-frosted-header` utility stays or gets folded into
   the component-only API.
