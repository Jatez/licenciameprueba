import { useEffect, useState } from "react";
import type { CatalogFilters, CatalogPageResponse } from "@/api/types";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/shared/components";
import { catalogStrings } from "@/modules/tracks/strings";
import { FilterPanel } from "./FilterPanel";

interface FilterPanelMobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: CatalogFilters;
  data: CatalogPageResponse | undefined;
  isLoading: boolean;
  hasActiveFilters: boolean;
  onPatch: (patch: Partial<CatalogFilters>) => void;
  onClearAll: () => void;
}

/**
 * Mobile filter UI. Edits live in local pending state and only commit
 * when the user taps "Aplicar". Closing without applying discards changes.
 */
export function FilterPanelMobileSheet({
  open,
  onOpenChange,
  filters,
  data,
  isLoading,
  hasActiveFilters,
  onPatch,
  onClearAll,
}: FilterPanelMobileSheetProps) {
  const [pending, setPending] = useState<CatalogFilters>(filters);

  // Sync pending with applied filters whenever the sheet opens.
  useEffect(() => {
    if (open) setPending(filters);
  }, [open, filters]);

  const handlePatchPending = (patch: Partial<CatalogFilters>) => {
    setPending((prev) => ({ ...prev, ...patch }));
  };

  const handleClearAllPending = () => {
    onClearAll();
    onOpenChange(false);
  };

  const handleApply = () => {
    onPatch(pending);
    onOpenChange(false);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={catalogStrings.filters.title}
      initialSnap="full"
      footer={
        <Button onClick={handleApply} className="w-full" size="lg">
          {catalogStrings.filters.applyAll}
        </Button>
      }
    >
      <FilterPanel
        filters={pending}
        data={data}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onPatch={handlePatchPending}
        onClearAll={handleClearAllPending}
      />
    </BottomSheet>
  );
}
