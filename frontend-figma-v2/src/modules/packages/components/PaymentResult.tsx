import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadInvoice } from "@/api/endpoints/payments";

type PaymentStatus = "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING" | null;

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  const id = searchParams.get("id");
  const status = (searchParams.get("status") ?? null) as PaymentStatus;
  const reference = searchParams.get("reference");

  const isApproved = status === "APPROVED";
  const isFailed = status === "DECLINED" || status === "VOIDED" || status === "ERROR";
  const isPending = !status || status === "PENDING";

  const handleDownloadInvoice = async () => {
    if (!reference) return;
    setDownloading(true);
    try {
      await downloadInvoice(reference);
      toast.success("Factura descargada correctamente");
    } catch {
      toast.error("No se pudo descargar la factura. Intenta más tarde.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
          {isPending && (
            <>
              <Loader2 className="h-14 w-14 animate-spin text-muted-foreground" aria-hidden />
              <h1 className="text-xl font-semibold">Procesando pago…</h1>
              <p className="text-sm text-muted-foreground">
                Estamos verificando tu transacción. Esto puede tardar unos segundos.
              </p>
            </>
          )}

          {isApproved && (
            <>
              <CheckCircle2 className="h-14 w-14 text-green-500" aria-hidden />
              <h1 className="text-xl font-semibold text-green-700 dark:text-green-400">
                ¡Pago aprobado!
              </h1>
              <p className="text-sm text-muted-foreground">
                Tu paquete de licencias ha sido activado. Ya puedes comenzar a usarlo.
              </p>
              {reference && (
                <p className="text-xs text-muted-foreground">
                  Referencia: <span className="font-mono font-semibold">{reference}</span>
                </p>
              )}
              <div className="flex w-full flex-col gap-2 pt-2">
                <Button onClick={handleDownloadInvoice} disabled={downloading} variant="outline">
                  {downloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Download className="mr-2 h-4 w-4" aria-hidden />
                  )}
                  Descargar factura
                </Button>
                <Button onClick={() => navigate("/packages")}>
                  Ver mis paquetes
                </Button>
              </div>
            </>
          )}

          {isFailed && (
            <>
              <XCircle className="h-14 w-14 text-destructive" aria-hidden />
              <h1 className="text-xl font-semibold text-destructive">
                Pago no completado
              </h1>
              <p className="text-sm text-muted-foreground">
                {status === "DECLINED"
                  ? "Tu pago fue declinado. Verifica los datos de tu tarjeta o método de pago."
                  : "Ocurrió un error al procesar tu pago. Por favor intenta nuevamente."}
              </p>
              {id && (
                <p className="text-xs text-muted-foreground">
                  ID transacción: <span className="font-mono">{id}</span>
                </p>
              )}
              <div className="flex w-full flex-col gap-2 pt-2">
                <Button onClick={() => navigate("/packages")}>
                  Intentar de nuevo
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Ir al inicio
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
