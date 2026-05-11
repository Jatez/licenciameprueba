/**
 * @deprecated Chart Palette ahora vive como subsección dentro de Colors.
 * Se accede vía /design-system#chart-palette (mismo id, anclado en ColorsSection).
 *
 * Este re-export se mantiene únicamente para no romper imports antiguos.
 * No registrar como sección hermana en DesignSystem.tsx ni en navigation.ts.
 */
export { ColorsSection as ChartPaletteSection } from "./ColorsSection";
