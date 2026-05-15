/**
 * Exports API — download reports as PDF or CSV from the backend.
 *
 * Each function:
 *  1. Calls the backend endpoint with the Bearer token.
 *  2. Reads the binary response as a Blob.
 *  3. Triggers a browser download automatically.
 */

import { useAuthStore } from "@/stores/authStore";

const BASE_URL =
  (import.meta.env.VITE_API_URL ?? "http://localhost:8000") + "/api/v2";

function getAuthHeaders(): Record<string, string> {
  let token = useAuthStore.getState().accessToken;
  if (!token) {
    try {
      const raw =
        localStorage.getItem("licenciame-auth") ??
        localStorage.getItem("auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        token = parsed?.state?.accessToken ?? null;
      }
    } catch {
      // ignore
    }
  }
  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function downloadBlob(url: string, filename: string): Promise<void> {
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body?.detail ?? body?.message ?? detail;
    } catch {
      // ignore
    }
    throw new Error(`Error al exportar: ${detail}`);
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

function buildParams(
  extra: Record<string, string | undefined> = {},
): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(extra)) {
    if (v !== undefined && v !== null && v !== "") params.set(k, v);
  }
  const q = params.toString();
  return q ? `?${q}` : "";
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const exportsApi = {
  /**
   * Download all licenses as PDF.
   */
  async exportLicensesPdf(opts: {
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<void> {
    const q = buildParams({ date_from: opts.dateFrom, date_to: opts.dateTo });
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    await downloadBlob(
      `${BASE_URL}/exports/licenses/pdf${q}`,
      `licencias_${today}.pdf`,
    );
  },

  /**
   * Download all licenses as CSV.
   */
  async exportLicensesCsv(opts: {
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<void> {
    const q = buildParams({ date_from: opts.dateFrom, date_to: opts.dateTo });
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    await downloadBlob(
      `${BASE_URL}/exports/licenses/csv${q}`,
      `licencias_${today}.csv`,
    );
  },

  /**
   * Download purchase history as CSV.
   */
  async exportPurchasesCsv(): Promise<void> {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    await downloadBlob(
      `${BASE_URL}/exports/purchases/csv`,
      `compras_${today}.csv`,
    );
  },

  /**
   * Download executive usage report as PDF.
   */
  async exportUsageReportPdf(opts: {
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<void> {
    const q = buildParams({ date_from: opts.dateFrom, date_to: opts.dateTo });
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    await downloadBlob(
      `${BASE_URL}/exports/usage-report/pdf${q}`,
      `reporte_uso_${today}.pdf`,
    );
  },
};
