import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import { useMySubscription } from "@/modules/packages/packages/hooks";
import { CorporateSupportCard } from "../CorporateSupportCard";

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

export function PurchaseDetailPage() {
  const { data: sub, isLoading, error, refetch } = useMySubscription();

  if (isLoading) {
    return (
      <>
        <Skeleton className="mb-4 h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between gap-3">
          <span>No se pudo cargar la suscripción.</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-5">
      <AppPageHeader
        title="Detalle de suscripción"
        description="Información de vigencia, créditos y estado de tu compra"
        primaryAction={{
          label: "Volver al historial",
          icon: <ArrowLeft className="h-4 w-4" aria-hidden="true" />,
          onClick: () => window.history.back(),
        }}
      />

      {sub && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge variant={sub.status === "active" ? "default" : "secondary"} className="capitalize">
            {sub.status === "active" ? "Activa" : sub.status}
          </Badge>
        </div>
      )}

      {/* Aviso: detalle por ID no disponible */}
      <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        El detalle por ID de compra no está disponible en esta versión.
        A continuación se muestra tu suscripción activa.
      </div>

      {!sub ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No tienes ninguna suscripción activa actualmente.{" "}
            <Link to="/wallet/checkout" className="underline underline-offset-2">
              Adquiere un paquete
            </Link>{" "}
            para comenzar.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <CardContent className="space-y-3 p-5">
                <h2 className="text-base font-semibold">Resumen de suscripción</h2>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  <Field label="Plan" value={sub.package_name} />
                  <Field label="Código" value={sub.template_code} />
                  <Field label="Créditos disponibles" value={`${sub.credits_available}`} />
                  <Field label="Créditos totales" value={`${sub.credits_total}`} />
                  <Field label="Licencias usadas" value={`${sub.licenses_used_this_period}`} />
                  <Field label="Estado" value={sub.status === "active" ? "Activa" : sub.status} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-2 p-5">
                <h2 className="text-base font-semibold">Período de facturación</h2>
                <Field label="Inicio" value={fmtDate(sub.current_period_starts_at)} />
                <Field label="Fin" value={fmtDate(sub.current_period_ends_at)} />
                {sub.cancel_at_period_end ? (
                  <div className="pt-2 text-sm text-warning">
                    Esta suscripción se cancelará al fin del período actual.
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <aside className="lg:col-span-1">
            <CorporateSupportCard />
          </aside>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
