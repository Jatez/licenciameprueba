import { PackagesPageHeader } from "../PackagesPage/PackagesPageHeader";
import { useMySubscription } from "@/modules/packages/packages/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { packagesStrings } from "@/modules/packages/packages/strings";

/** Formato de fecha simple */
function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function PurchaseHistoryPage() {
  const { data: sub, isLoading } = useMySubscription();
  const s = packagesStrings.history;

  return (
    <div className="space-y-6">
      <PackagesPageHeader showBack />
      <div>
        <h2 className="text-2xl font-semibold">{s.title}</h2>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </div>

      {/* Aviso: historial no disponible */}
      <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        El historial detallado de compras no está disponible en esta versión.
        A continuación se muestra tu suscripción activa.
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !sub ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No tienes ninguna suscripción activa actualmente.{" "}
            <a href="/wallet/checkout" className="underline underline-offset-2">
              Adquiere un paquete
            </a>{" "}
            para comenzar.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">{sub.package_name}</h3>
              <Badge
                variant={sub.status === "active" ? "default" : "secondary"}
                className="capitalize"
              >
                {sub.status === "active" ? "Activa" : sub.status}
              </Badge>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <Row label="Créditos disponibles" value={`${sub.credits_available} / ${sub.credits_total}`} />
              <Row label="Licencias usadas este período" value={String(sub.licenses_used_this_period)} />
              <Row label="Inicio del período" value={fmtDate(sub.current_period_starts_at)} />
              <Row label="Fin del período" value={fmtDate(sub.current_period_ends_at)} />
              <Row label="Código de plan" value={sub.template_code} />
              {sub.cancel_at_period_end ? (
                <Row label="Cancelación" value="Al fin del período" />
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
