import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/modules/packages/dashboards/dashboard/components/EmptyState";
import type { LicenseUsageType, Track } from "@/api/types";
import { useUsageTypeCatalog } from "@/modules/packages/licensing/hooks/useUsageTypeCatalog";
import { useWalletBalance } from "@/modules/packages/licensing/hooks/useWalletBalance";
import { useValidateLicensing } from "@/modules/packages/licensing/hooks/useValidateLicensing";
import { isUsageTypeAllowed } from "@/modules/packages/licensing/utils";
import { licensingStrings, formatString } from "@/modules/packages/licensing/strings";
import type { UsageTypeCardViewModel } from "@/modules/packages/licensing/types";
import { UsageTypeList } from "./UsageTypeList";
import { WalletBalancePill } from "./WalletBalancePill";
import { InsufficientCreditsBanner } from "./InsufficientCreditsBanner";
import { ResultingBalanceIndicator } from "./ResultingBalanceIndicator";

interface Props {
  track: Track;
  selectedUsageType: LicenseUsageType | null;
  onSelectUsageType: (usage: LicenseUsageType) => void;
}

const PACKAGES_ROUTE = "/packages"; // Placeholder until F-04 ships.

function openBuyCredits() {
  if (typeof window !== "undefined") {
    window.open(PACKAGES_ROUTE, "_blank", "noopener,noreferrer");
  }
}

export function Step2UsageTypeSelection({
  track,
  selectedUsageType,
  onSelectUsageType,
}: Props) {
  const catalog = useUsageTypeCatalog();
  const wallet = useWalletBalance();
  const validation = useValidateLicensing(track.id, selectedUsageType);
  const t = licensingStrings.step2;

  const items = useMemo<UsageTypeCardViewModel[]>(() => {
    if (!catalog.data) return [];
    return catalog.data.map((def) => {
      const allowedByTrack = isUsageTypeAllowed(track.platformLicensability, def.id);
      const sufficient = wallet.balance >= def.creditCost;
      const isSelected = selectedUsageType === def.id;
      let state: UsageTypeCardViewModel["state"] = "available";
      let disabledReason: string | null = null;
      if (!allowedByTrack) {
        state = "disabled-licensability";
        disabledReason = licensingStrings.step2.notAvailableTooltip;
      } else if (isSelected) {
        state = "selected";
      } else if (!sufficient) {
        state = "disabled-credits";
      }
      const usageStrings = licensingStrings.usageTypes[def.id];
      return {
        id: def.id,
        title: usageStrings.title,
        description: usageStrings.description,
        example: usageStrings.example,
        iconName: def.iconName,
        creditCost: def.creditCost,
        state,
        disabledReason,
      };
    });
  }, [catalog.data, selectedUsageType, track.platformLicensability, wallet.balance]);

  if (catalog.isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="No pudimos cargar los tipos de uso"
        description="Inténtalo nuevamente en unos segundos."
        ctaLabel="Volver al catálogo"
        ctaHref="/catalog"
      />
    );
  }

  const isCatalogLoading = catalog.isLoading || !catalog.data;
  const selectedDef = catalog.data?.find((d) => d.id === selectedUsageType) ?? null;
  const selectedCost = selectedDef?.creditCost ?? 0;
  const insufficientForSelected =
    !!selectedDef && wallet.balance < selectedCost;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="space-y-0.5">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          {formatString(t.title, { trackTitle: track.title })}
        </h2>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card/88 px-3.5 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm">
        <WalletBalancePill
          balance={wallet.balance}
          daysUntilExpiry={wallet.daysUntilExpiry}
          isLoading={wallet.isLoading}
          isInsufficient={wallet.balance < 1}
          onBuyCredits={openBuyCredits}
        />
      </div>

      {isCatalogLoading ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <UsageTypeList
          items={items}
          value={selectedUsageType}
          onChange={onSelectUsageType}
        />
      )}

      {insufficientForSelected && (
        <InsufficientCreditsBanner
          needed={selectedCost}
          available={wallet.balance}
          onBuyCredits={openBuyCredits}
          onChooseOther={() => onSelectUsageType(selectedUsageType!)}
        />
      )}

      {selectedDef && validation.data?.allowed && (
        <ResultingBalanceIndicator
          current={validation.data.currentBalance}
          resulting={validation.data.resultingBalance}
        />
      )}
    </div>
  );
}
