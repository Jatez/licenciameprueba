import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { WalletV2 } from "@/api/types.dashboard";
import { dashboardV2Strings, fmt } from "../../strings";
import { useFormatCredits, useFormatDate } from "../../hooks";
import { WalletProgressRing } from "./WalletProgressRing";

interface WalletSectionProps {
  wallet: WalletV2;
  isLoading?: boolean;
}

/**
 * Hero wallet card — único elemento "sólido de color" del dashboard.
 * Usa bg-primary (lime DS) + text-primary-foreground (negro DS).
 * DS-GAP: si en el futuro se añade <Card variant="hero">, este componente lo adopta.
 */
export function WalletSection({ wallet, isLoading }: WalletSectionProps) {
  const navigate = useNavigate();
  const formatCredits = useFormatCredits();
  const { long } = useFormatDate();
  const t = dashboardV2Strings.wallet;

  if (isLoading) {
    return (
      <Card className="flex h-full flex-col items-center justify-center gap-4 p-6">
        <Skeleton className="h-[180px] w-[180px] rounded-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-11 w-full" />
      </Card>
    );
  }

  return (
    <Card className="relative flex h-full flex-col items-center gap-5 overflow-hidden border-transparent bg-primary p-6 text-primary-foreground shadow-sm">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-base font-semibold">{t.title}</h2>
        {wallet.daysUntilExpiry != null && (
          <span className="inline-flex items-center rounded-full bg-primary-foreground/10 px-2.5 py-1 text-xs font-medium font-tnum text-primary-foreground">
            {wallet.daysUntilExpiry} días restantes
          </span>
        )}
      </div>

      <div className="relative flex items-center justify-center">
        <WalletProgressRing
          value={wallet.balance}
          total={wallet.totalPurchased}
          activeColor="hsl(var(--color-black))"
          trackColor="hsl(var(--color-black) / 0.15)"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-semibold leading-none font-tnum text-primary-foreground">
            {formatCredits(wallet.balance)}
          </span>
          <span className="mt-1 text-xs text-primary-foreground/75">
            de {formatCredits(wallet.totalPurchased)} créditos
          </span>
        </div>
      </div>

      {wallet.expiresAt ? (
        <p className="text-sm text-primary-foreground/80">
          {fmt(t.expiresOn, { date: long(wallet.expiresAt) })}
        </p>
      ) : (
        <p className="text-sm text-primary-foreground/80">{t.noBag}</p>
      )}

      <div className="mt-auto flex w-full flex-col items-center gap-2">
        <Button
          className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          onClick={() => navigate("/packages#packages")}
        >
          <span className="inline-flex items-center gap-1.5">
            {t.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </Button>
        <button
          type="button"
          onClick={() => navigate("/packages/history")}
          className="text-xs text-primary-foreground/75 underline-offset-4 hover:underline"
        >
          {t.history} →
        </button>
      </div>
    </Card>
  );
}
