import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { matchTracksStrings as s } from "../strings";
import type {
  UnifiedLicenseStatus,
  UnifiedSource,
} from "../types.unified";

export interface ResultsFiltersValue {
  source: UnifiedSource | "all";
  matchStatus: "all" | "matched" | "partial" | "not_available" | "legal_review";
  licenseStatus: UnifiedLicenseStatus | "all";
  minConfidence: number;
  maxCredits: number;
}

interface ResultsFiltersProps {
  value: ResultsFiltersValue;
  onChange: (next: ResultsFiltersValue) => void;
  onReset: () => void;
}

const SOURCES: { key: ResultsFiltersValue["source"]; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "spotify", label: s.results.filters.sources.spotify },
  { key: "tiktok", label: s.results.filters.sources.tiktok },
  { key: "meta", label: s.results.filters.sources.meta },
];

const MATCH_STATES: { key: ResultsFiltersValue["matchStatus"]; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "matched", label: s.results.filters.match.matched },
  { key: "partial", label: s.results.filters.match.partial },
  { key: "not_available", label: s.results.filters.match.not_available },
  { key: "legal_review", label: s.results.filters.match.legal_review },
];

const LICENSE_STATES: { key: ResultsFiltersValue["licenseStatus"]; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "licensed", label: s.results.filters.license.licensed },
  { key: "not_licensed", label: s.results.filters.license.not_licensed },
  { key: "pending", label: s.results.filters.license.pending },
];

function ChipGroup<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { key: T; label: string }[];
  value: T;
  onSelect: (k: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <Button
          key={o.key}
          size="sm"
          variant={value === o.key ? "default" : "outline"}
          onClick={() => onSelect(o.key)}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
}

export function ResultsFilters({ value, onChange, onReset }: ResultsFiltersProps) {
  const set = <K extends keyof ResultsFiltersValue>(k: K, v: ResultsFiltersValue[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-wrap items-end gap-6">
        <div className="space-y-1.5">
          <Label className="text-xs">{s.results.filters.sourceLabel}</Label>
          <ChipGroup options={SOURCES} value={value.source} onSelect={(v) => set("source", v)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{s.results.filters.matchLabel}</Label>
          <ChipGroup
            options={MATCH_STATES}
            value={value.matchStatus}
            onSelect={(v) => set("matchStatus", v)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{s.results.filters.licenseLabel}</Label>
          <ChipGroup
            options={LICENSE_STATES}
            value={value.licenseStatus}
            onSelect={(v) => set("licenseStatus", v)}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-6">
        <div className="space-y-1.5">
          <Label htmlFor="conf" className="text-xs">
            {s.results.filters.confidenceLabel}: {value.minConfidence}%
          </Label>
          <input
            id="conf"
            type="range"
            min={0}
            max={100}
            step={5}
            value={value.minConfidence}
            onChange={(e) => set("minConfidence", Number(e.target.value))}
            className="w-48 accent-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="credits" className="text-xs">
            {s.results.filters.creditsLabel}: {value.maxCredits}
          </Label>
          <input
            id="credits"
            type="range"
            min={0}
            max={10}
            step={1}
            value={value.maxCredits}
            onChange={(e) => set("maxCredits", Number(e.target.value))}
            className="w-48 accent-foreground"
          />
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          {s.results.filters.reset}
        </Button>
      </div>
    </Card>
  );
}

export const initialFilters: ResultsFiltersValue = {
  source: "all",
  matchStatus: "all",
  licenseStatus: "all",
  minConfidence: 0,
  maxCredits: 10,
};
