/**
 * Centralized "last updated" dates for Design System sections.
 *
 * Each section.tsx historically declared its own `const TODAY = "..."`,
 * which made bulk updates painful. New sections SHOULD import their date
 * from here. Existing sections may continue to define a local `TODAY`
 * until migrated — keep the value in sync with the entry below.
 *
 * Keys match the section `id` in `navigation.ts`.
 */
export const DS_LAST_UPDATED: Record<string, string> = {
  // Foundations
  colors: "2026-04-23",
  typography: "2026-04-23",
  radius: "2026-04-24",
  spacing: "2026-04-24",
  borders: "2026-04-24",
  animations: "2026-04-23",
  shadows: "2026-04-24",
  icons: "2026-04-24",

  // Components
  buttons: "2026-04-23",
  cards: "2026-04-24",
  "kpi-card": "2026-04-24",
  "empty-state-card": "2026-04-24",
  "image-overlay-card": "2026-04-23",
  "top-item-row": "2026-04-23",
  avatar: "2026-04-23",
  forms: "2026-04-23",
  badges: "2026-04-17",
  materials: "2026-04-30",
  "frosted-header": "2026-04-30",
  player: "2026-04-23",
  sidebar: "2026-04-23",
  popover: "2026-04-23",

  // Layouts
  "page-shell": "2026-04-24",
  "body-card": "2026-04-24",
  "app-layout": "2026-04-24",
  "layout-dashboard-v2": "2026-04-23",

  // Catalog
  "catalog-header": "2026-04-24",
  "catalog-page": "2026-04-24",
  "track-detail-page": "2026-04-24",
};

/** Default fallback when a section has no explicit entry yet. */
export const DS_LAST_UPDATED_DEFAULT = "2026-04-24";

/** Helper: get last updated date for a section id, with safe fallback. */
export function getDSLastUpdated(sectionId: string): string {
  return DS_LAST_UPDATED[sectionId] ?? DS_LAST_UPDATED_DEFAULT;
}