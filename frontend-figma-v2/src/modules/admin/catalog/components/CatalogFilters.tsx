import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { catalogStrings } from "../strings";
import { adminCatalogGenres } from "../mocks";
import type { AdminTrackStatus, CatalogFiltersState } from "../types";

interface CatalogFiltersProps {
  value: CatalogFiltersState;
  onChange: (next: CatalogFiltersState) => void;
  onReset: () => void;
  shown: number;
  total: number;
}

const STATUS_OPTIONS: AdminTrackStatus[] = [
  "active",
  "hidden",
  "legal_review",
  "unavailable",
  "pending_metadata",
];

export function CatalogFilters({
  value,
  onChange,
  onReset,
  shown,
  total,
}: CatalogFiltersProps) {
  const t = catalogStrings.filters;
  const set = <K extends keyof CatalogFiltersState>(k: K, v: CatalogFiltersState[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
        <div className="md:col-span-4 relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={value.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder={t.searchPlaceholder}
            className="pl-9"
            aria-label={t.searchPlaceholder}
          />
        </div>

        <div className="md:col-span-2">
          <Select value={value.status} onValueChange={(v) => set("status", v as CatalogFiltersState["status"])}>
            <SelectTrigger aria-label={t.status}>
              <SelectValue placeholder={t.allStatuses} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {catalogStrings.status[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Select value={value.genre} onValueChange={(v) => set("genre", v)}>
            <SelectTrigger aria-label={t.genre}>
              <SelectValue placeholder={t.allGenres} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allGenres}</SelectItem>
              {adminCatalogGenres.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3">
          <Select
            value={value.updatedWithin}
            onValueChange={(v) => set("updatedWithin", v as CatalogFiltersState["updatedWithin"])}
          >
            <SelectTrigger aria-label={t.updatedWithin}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.updated.all}</SelectItem>
              <SelectItem value="7d">{t.updated["7d"]}</SelectItem>
              <SelectItem value="30d">{t.updated["30d"]}</SelectItem>
              <SelectItem value="90d">{t.updated["90d"]}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox
              checked={value.onlyWithActiveLicenses}
              onCheckedChange={(c) => set("onlyWithActiveLicenses", Boolean(c))}
            />
            {t.onlyWithLicenses}
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox
              checked={value.onlyMissingMetadata}
              onCheckedChange={(c) => set("onlyMissingMetadata", Boolean(c))}
            />
            {t.onlyMissingMetadata}
          </label>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">{t.counter(shown, total)}</p>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            {t.clear}
          </Button>
        </div>
      </div>
    </div>
  );
}
