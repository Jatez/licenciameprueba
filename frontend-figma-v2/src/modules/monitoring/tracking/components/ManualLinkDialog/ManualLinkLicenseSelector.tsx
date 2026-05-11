import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useListLicenses } from "@/modules/packages/licensing/hooks";
import type { License } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { formatRelativeFromNow } from "@/modules/monitoring/tracking/utils/relativeTime";

interface ManualLinkLicenseSelectorProps {
  selectedLicenseId: string | null;
  onSelect: (license: License) => void;
}

export function ManualLinkLicenseSelector({
  selectedLicenseId,
  onSelect,
}: ManualLinkLicenseSelectorProps) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const t = trackingStrings.manualLink.selectLicense;

  const { data, isLoading } = useListLicenses({
    filters: {
      search: "",
      statuses: ["active"],
      usageTypes: [],
      dateRange: { from: null, to: null },
      sort: "issuedAt-desc",
    },
    page: 1,
    pageSize: 100,
  });

  const filtered = useMemo(() => {
    const all = data?.licenses ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (l) =>
        l.licenseTokenId.toLowerCase().includes(q) ||
        l.trackSnapshot.title.toLowerCase().includes(q) ||
        l.trackSnapshot.artist.toLowerCase().includes(q),
    );
  }, [data, search]);

  if (!isLoading && (data?.licenses.length ?? 0) === 0) {
    return (
      <div className="rounded-md border border-border bg-foreground/[0.02] p-6 text-center">
        <h3 className="text-sm font-semibold text-foreground">{t.noLicenses.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{t.noLicenses.description}</p>
        <Button
          className="mt-3"
          size="sm"
          onClick={() => navigate("/catalog")}
        >
          {t.noLicenses.cta}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="ml-search">{t.title}</Label>
      <Input
        id="ml-search"
        type="search"
        placeholder={t.searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ScrollArea className="h-64 rounded-md border border-border">
        <div className="p-2">
          {filtered.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              {t.noResults}
            </p>
          ) : (
            <RadioGroup
              value={selectedLicenseId ?? ""}
              onValueChange={(id) => {
                const lic = filtered.find((l) => l.id === id);
                if (lic) onSelect(lic);
              }}
              className="space-y-1"
            >
              {filtered.map((lic) => (
                <label
                  key={lic.id}
                  htmlFor={`lic-${lic.id}`}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-md p-2 text-sm transition-colors ${
                    selectedLicenseId === lic.id
                      ? "bg-foreground/[0.05]"
                      : "hover:bg-foreground/[0.02]"
                  }`}
                >
                  <RadioGroupItem id={`lic-${lic.id}`} value={lic.id} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {lic.licenseTokenId} · "{lic.trackSnapshot.title}" — {lic.trackSnapshot.artist}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lic.usageType} · {t.issuedAgo.replace(
                        "{duration}",
                        formatRelativeFromNow(lic.issuedAt),
                      )}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
