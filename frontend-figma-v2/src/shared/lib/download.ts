/**
 * Simulated download helper.
 *
 * Backend handoff:
 *  Reemplazar el Blob stub por un fetch del fileUrl real (signed URL del API)
 *  y dejar el resto del flujo intacto. La firma de la función no debe cambiar.
 */

interface SimulateDownloadOptions {
  /** Mime type for the placeholder blob. Affects the file extension only. */
  mimeType?: string;
  /** Optional payload to embed in the placeholder file (debug). */
  payload?: Record<string, unknown> | string;
}

export function simulateDownload(filename: string, options: SimulateDownloadOptions = {}): void {
  const { mimeType = "application/octet-stream", payload } = options;

  const body =
    typeof payload === "string"
      ? payload
      : JSON.stringify(
          {
            __mock: true,
            generatedAt: new Date().toISOString(),
            filename,
            note: "Archivo simulado generado por Licénciame para QA. No es un reporte real.",
            payload: payload ?? null,
          },
          null,
          2,
        );

  const blob = new Blob([body], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Slight delay before revoking so Safari has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);

   
  console.info("[mock-download]", filename, { mimeType });
}

export function mimeTypeForReport(format: "pdf" | "excel"): string {
  return format === "pdf"
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}
