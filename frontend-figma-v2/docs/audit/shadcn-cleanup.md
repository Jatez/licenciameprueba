# shadcn/ui cleanup

> Bitácora de la limpieza de primitivas shadcn/ui no usadas en producción.
> Origen: `docs/audit/audit-ds-02-cruce-app.md` (Lista B — zombies).
> Fecha del barrido: **2026-04-24**.

## Criterio de decisión

- **ELIMINAR** si: 0 imports en `src/` fuera del propio archivo, sin plan
  cercano de uso, o si existe alternativa más simple ya en uso.
- **CONSERVAR Y DOCUMENTAR** si: utilidad fundamental que probablemente
  aparezca en el roadmap inmediato (ej. menús contextuales ligeros).

---

## ELIMINADAS

| Primitiva | Archivo | Razón | Dependencia desinstalada | Fecha |
|---|---|---|---|---|
| Sidebar | `src/components/ui/sidebar.tsx` | Zombie confuso — la app usa el sidebar propio en `components/sidebar/**` | — (solo Radix internos compartidos) | 2026-04-24 |
| Avatar | `src/components/ui/avatar.tsx` | Reemplazado por `src/components/ds/Avatar.tsx` (Prompt 5) | `@radix-ui/react-avatar` | 2026-04-24 |
| ToggleGroup | `src/components/ui/toggle-group.tsx` | Sin uso. `Tabs` cubre los casos actuales | `@radix-ui/react-toggle-group` | 2026-04-24 |
| Resizable | `src/components/ui/resizable.tsx` | Sin uso. Layout fijo en toda la app | `react-resizable-panels` | 2026-04-24 |
| NavigationMenu | `src/components/ui/navigation-menu.tsx` | Sin uso. Sidebar propio cubre navegación | `@radix-ui/react-navigation-menu` | 2026-04-24 |
| Menubar | `src/components/ui/menubar.tsx` | Sin uso. Producto no tiene menubar tipo desktop | `@radix-ui/react-menubar` | 2026-04-24 |
| InputOTP | `src/components/ui/input-otp.tsx` | Sin uso. Auth no usa OTP hoy | `input-otp` | 2026-04-24 |
| HoverCard | `src/components/ui/hover-card.tsx` | Sin uso. `Tooltip` cubre el patrón hover | `@radix-ui/react-hover-card` | 2026-04-24 |
| Drawer (vaul) | `src/components/ui/drawer.tsx` | `Sheet` cumple el rol de panel lateral/inferior | `vaul` | 2026-04-24 |
| ContextMenu | `src/components/ui/context-menu.tsx` | Sin uso. `DropdownMenu` cubre acciones por click | `@radix-ui/react-context-menu` | 2026-04-24 |
| Command | `src/components/ui/command.tsx` | Sin uso. No hay command palette planeado | `cmdk` | 2026-04-24 |
| Chart | `src/components/ui/chart.tsx` | Wrapper shadcn no usado. Los charts reales (`CreditUsageChart`, sparklines) consumen `recharts` directo | — (`recharts` se conserva: en uso real) | 2026-04-24 |
| Carousel | `src/components/ui/carousel.tsx` | Sin uso. Listas usan grid o `HorizontalScroller` propio | `embla-carousel-react` | 2026-04-24 |
| Calendar | `src/components/ui/calendar.tsx` | Sin uso. Date pickers no aparecen en flujos actuales | `react-day-picker` | 2026-04-24 |
| Breadcrumb | `src/components/ui/breadcrumb.tsx` | Sin uso. Breadcrumbs propios en headers (FrostedHeader) | — (solo Radix internos compartidos) | 2026-04-24 |

**Total:** 15 archivos · 12 dependencias npm desinstaladas.

---

## CONSERVADAS Y DOCUMENTADAS

| Primitiva | Sección DS | Propósito reservado |
|---|---|---|
| Popover | `Components/Popover` (`PopoverSection.tsx`) | Pickers ligeros, mini-formularios, vistas previas contextuales. Cuando aparezca el primer caso del producto, ya está el patrón documentado. |

---

## CONSERVADAS POR USO REAL (no son zombies)

Para referencia, primitivas presentes en `src/components/ui/` que **sí** se
usan en producción y por tanto no entran en este barrido:

- `accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `badge`,
  `button`, `card`, `checkbox`, `collapsible`, `dialog`, `dropdown-menu`,
  `empty-state-card`, `form`, `input`, `kpi-card`, `label`, `pagination`,
  `platform-badge`, `progress`, `radio-group`, `scroll-area`,
  `section-toc`, `select`, `separator`, `sheet`, `skeleton`, `slider`,
  `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`,
  `toggle`, `tooltip`, `use-toast`.

---

## Validación

- `npx tsc --noEmit` → 0 errores tras la limpieza.
- `grep` de imports rotos contra los 15 archivos eliminados → 0 hits.
- Lista B del audit-02 queda en **0** entradas no justificadas.

## Próximos pasos

- En el siguiente re-run de `audit-ds-02-cruce-app.md`, la sección 5.x
  "primitivas zombies" debería estar vacía.
- Si aparece un nuevo caso de uso para alguna primitiva eliminada,
  reinstalarla con `npx shadcn@latest add <name>` (no recuperar el archivo
  borrado — partir de la versión actual de shadcn).
