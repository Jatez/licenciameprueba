/**
 * Shared component inventory.
 *
 * Domain-agnostic building blocks. Wraps shadcn primitives in
 * `@/components/ui/*` and adds canonical patterns (status badges,
 * data table, loading/empty/error states, page headers).
 */
export { Loader } from "./Loader";
export { ErrorState } from "./ErrorState";
export { ErrorBoundary } from "./ErrorBoundary";
export { QueryBoundary } from "./QueryBoundary";
export { SectionHeader } from "./SectionHeader";
export { StatusBadge } from "./StatusBadge";
export { DataTable } from "./DataTable";
export type { DataTableColumn, DataTableProps, DataTablePaginationProps } from "./DataTable";
export type { DataTableCardConfig } from "./DataTable";
export { RowCard } from "./ds/RowCard";
export type { RowCardProps, RowCardField } from "./ds/RowCard";
export { BottomSheet } from "./ds/BottomSheet";
export type { BottomSheetProps } from "./ds/BottomSheet";
export { ResponsiveDialog } from "./ds/ResponsiveDialog";
export type { ResponsiveDialogProps } from "./ds/ResponsiveDialog";
export { TouchTooltip } from "./ds/TouchTooltip";
export type { TouchTooltipProps } from "./ds/TouchTooltip";
export { IconButton } from "./ds/IconButton";
export type { IconButtonProps } from "./ds/IconButton";
export { StatCard } from "./StatCard";
export { NavLink } from "./NavLink";
export { ScrollRow } from "./ScrollRow";
export { Waveform } from "./Waveform";

// Re-export shadcn primitives via canonical names so callers don't import
// from two different paths.
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
export { Badge } from "@/components/ui/badge";
export { EmptyStateCard as EmptyState } from "@/components/ui/empty-state-card";