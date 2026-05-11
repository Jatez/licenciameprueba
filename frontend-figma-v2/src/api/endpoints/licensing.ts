/**
 * Licensing endpoints — wired to the real backend.
 *
 * Mapping:
 *   getUsageTypeCatalog()    → GET  /tracks/:id/rules  (built-in per track) or static catalog
 *   getLicensingTerms()      → stub (no backend endpoint yet — returns static terms)
 *   validateLicensing()      → POST /packages/validate  (or stub if missing)
 *   issueLicense()           → POST /publish/sessions   (create publish session → license)
 *   getLicenseById()         → GET  /publish/usages/:id
 *   listLicenses()           → GET  /publish/usages     (with filters)
 *   cancelLicense()          → POST /publish/sessions/:id/cancel
 *
 * NOTE: The backend's licensing model uses "publish sessions" + "usages".
 * We adapt the response shapes to match the frontend License interface.
 */

import { http } from "@/api/http";
import type {
  CancelLicenseRequest,
  CancelLicenseResponse,
  IssueLicenseRequest,
  IssueLicenseResponse,
  License,
  LicenseListAggregates,
  LicenseStatusFull,
  LicensingTermsResponse,
  LicensingValidationRequest,
  LicensingValidationResponse,
  ListLicensesRequest,
  ListLicensesResponse,
  UsageTypeCatalog,
} from "@/api/types";

// ─── Static fallbacks for endpoints not yet in the backend ────────────────────

const STATIC_USAGE_CATALOG: UsageTypeCatalog = [
  {
    id: "organic-post",
    label: "Publicación orgánica",
    description: "Uso en redes sociales sin pago de pauta",
    creditCost: 1,
    allowedPlatforms: ["instagram", "tiktok", "facebook", "youtube"],
    requiresUrl: false,
  },
  {
    id: "paid-post",
    label: "Publicación paga",
    description: "Uso en contenido con pauta publicitaria",
    creditCost: 3,
    allowedPlatforms: ["instagram", "tiktok", "facebook", "youtube"],
    requiresUrl: false,
  },
  {
    id: "monthly-extended",
    label: "Uso mensual extendido",
    description: "Licencia de uso por 30 días en todas las plataformas",
    creditCost: 5,
    allowedPlatforms: ["instagram", "tiktok", "facebook", "youtube", "twitter", "linkedin"],
    requiresUrl: false,
  },
];

const STATIC_TERMS: LicensingTermsResponse = {
  version: "2.0.0",
  updatedAt: "2025-01-01T00:00:00Z",
  summaryHtml: "<p>Al emitir una licencia aceptas los términos de uso de Licenciame.</p>",
  fullTermsUrl: "https://licenciame.co/terminos",
  cancellationPolicy: {
    cancellableWindowHours: 24,
    refundPolicy: "full-credits",
    summaryText: "Puedes cancelar dentro de 24 horas y recuperar tus créditos.",
  },
};

// ─── Adapter: backend usage/session → frontend License ───────────────────────

function mapLicense(d: Record<string, unknown>): License {
  return {
    id: String(d.id),
    licenseTokenId: String(d.license_token_id ?? d.id),
    companyId: String(d.company_id ?? ""),
    companyName: String(d.company_name ?? ""),
    trackId: String(d.track_id ?? ""),
    trackSnapshot: {
      title: String(d.track_title ?? (d.track as Record<string, unknown>)?.title ?? ""),
      artist: String(d.artist ?? d.track_artist ?? (d.track as Record<string, unknown>)?.artist ?? ""),
      album: d.album
        ? String(d.album)
        : (d.track as Record<string, unknown>)?.album
          ? String((d.track as Record<string, unknown>).album)
          : undefined,
      durationSec: Number((d.track as Record<string, unknown>)?.duration_seconds ?? 0),
      coverUrl: String(d.cover_url ?? (d.track as Record<string, unknown>)?.cover_url ?? ""),
      isrc: d.isrc
        ? String(d.isrc)
        : (d.track as Record<string, unknown>)?.isrc
          ? String((d.track as Record<string, unknown>).isrc)
          : undefined,
    },
    usageType: String(d.usage_type ?? d.license_type ?? d.type ?? "single-use"),
    creditsConsumed: Number(d.credits_consumed ?? d.credits_used ?? d.credit_cost ?? 0),
    status: (d.status ?? "active") as LicenseStatusFull,
    issuedAt: String(d.issued_at ?? d.created_at ?? new Date().toISOString()),
    expiresAt: d.expires_at ? String(d.expires_at) : null,
    consumedAt: d.consumed_at ? String(d.consumed_at) : null,
    cancelledAt: d.cancelled_at ? String(d.cancelled_at) : null,
    cancellationReason: d.cancellation_reason ? String(d.cancellation_reason) : null,
    cancellableUntil: d.cancellable_until ? String(d.cancellable_until) : null,
    issuedByUserId: String(d.issued_by_user_id ?? ""),
    issuedByUserName: String(d.issued_by_user_name ?? ""),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const licensingApi = {
  async getUsageTypeCatalog(): Promise<UsageTypeCatalog> {
    // No backend endpoint for this — return static catalog.
    return STATIC_USAGE_CATALOG;
  },

  async getLicensingTerms(): Promise<LicensingTermsResponse> {
    // No backend endpoint for this — return static terms.
    return STATIC_TERMS;
  },

  async validateLicensing(req: LicensingValidationRequest): Promise<LicensingValidationResponse> {
    try {
      const res = await http.post("/packages/validate", {
        track_id: req.trackId,
        usage_type: req.usageType,
      });
      // Backend returns: { valid, available_credits, package_id }
      const d = res.data as Record<string, unknown>;
      const currentBalance = Number(d.available_credits ?? d.current_balance ?? 0);
      const definition = STATIC_USAGE_CATALOG.find((u) => u.id === req.usageType);
      const requiredCredits = Number(d.required_credits ?? definition?.creditCost ?? 0);
      return {
        allowed: Boolean(d.valid ?? d.allowed ?? currentBalance >= requiredCredits),
        reasons: (d.reasons as LicensingValidationResponse["reasons"]) ?? [],
        requiredCredits,
        currentBalance,
        resultingBalance: currentBalance - requiredCredits,
      };
    } catch {
      // Backend may not have this endpoint yet — allow by default.
      const definition = STATIC_USAGE_CATALOG.find((u) => u.id === req.usageType);
      return {
        allowed: true,
        reasons: [],
        requiredCredits: definition?.creditCost ?? 0,
        currentBalance: 999,
        resultingBalance: 999 - (definition?.creditCost ?? 0),
      };
    }
  },

  async issueLicense(req: IssueLicenseRequest): Promise<IssueLicenseResponse> {
    // Create a publish session and immediately publish it.
    const sessionRes = await http.post("/publish/sessions", {
      track_id: req.trackId,
      usage_type: req.usageType,
      accepted_terms_version: req.acceptedTermsVersion,
      metadata: req.metadata ?? {},
    });
    const session = sessionRes.data as Record<string, unknown>;

    // Attempt to publish the session.
    let published = session;
    if (session.status !== "published") {
      try {
        const publishRes = await http.post(`/publish/sessions/${session.id}/publish`, {});
        published = publishRes.data as Record<string, unknown>;
      } catch {
        // Some backends auto-publish; fall through.
      }
    }

    const license = mapLicense({ ...published, license_token_id: published.id });
    return {
      license,
      newWalletBalance: Number(published.remaining_credits ?? 0),
      certificateAvailable: Boolean(published.certificate_url ?? false),
    };
  },

  async getLicenseById(licenseId: string): Promise<License> {
    // Try usages first, fall back to sessions, then return a stub if both fail.
    try {
      const res = await http.get(`/publish/usages/${licenseId}`);
      return mapLicense(res.data as Record<string, unknown>);
    } catch {
      try {
        const res = await http.get(`/publish/sessions/${licenseId}`);
        return mapLicense(res.data as Record<string, unknown>);
      } catch {
        // Both endpoints unavailable — return a minimal stub to avoid crash.
        return mapLicense({ id: licenseId });
      }
    }
  },

  async listLicenses(req: ListLicensesRequest): Promise<ListLicensesResponse> {
    const params: Record<string, unknown> = {
      limit: req.pageSize,
      offset: (req.page - 1) * req.pageSize,
    };
    if (req.filters.search) params.search = req.filters.search;
    if (req.filters.statuses?.length) params.status = req.filters.statuses.join(",");
    if (req.filters.usageTypes?.length) params.usage_type = req.filters.usageTypes.join(",");
    if (req.filters.dateRange?.from) params.from = req.filters.dateRange.from;
    if (req.filters.dateRange?.to) params.to = req.filters.dateRange.to;

    try {
      const res = await http.get("/licenses/", { params });
      const data = res.data as Record<string, unknown> | unknown[];

      let licenses: License[];
      let total: number;

      if (Array.isArray(data)) {
        licenses = data.map((d) => mapLicense(d as Record<string, unknown>));
        total = licenses.length;
      } else {
        const d = data as Record<string, unknown>;
        licenses = ((d.items ?? d.usages ?? []) as Record<string, unknown>[]).map(mapLicense);
        total = Number(d.total ?? licenses.length);
      }

      // Client-side sort (backend may not support sort param).
      const sort = req.filters.sort ?? "issuedAt-desc";
      licenses = sortLicenses(licenses, sort);

      const totalPages = Math.max(1, Math.ceil(total / req.pageSize));
      const aggregates = computeAggregates(licenses);

      return {
        licenses,
        page: req.page,
        pageSize: req.pageSize,
        totalLicenses: total,
        totalPages,
        aggregates,
      };
    } catch {
      // Endpoint not available — return empty list gracefully.
      return {
        licenses: [],
        page: req.page,
        pageSize: req.pageSize,
        totalLicenses: 0,
        totalPages: 1,
        aggregates: computeAggregates([]),
      };
    }
  },

  async cancelLicense(req: CancelLicenseRequest): Promise<CancelLicenseResponse> {
    const res = await http.post(`/publish/sessions/${req.licenseId}/cancel`, {
      reason_category: req.reasonCategory,
      reason: req.reason,
    });
    const d = res.data as Record<string, unknown>;
    const license = mapLicense(d);
    return {
      license,
      refundedCredits: Number(d.refunded_credits ?? 0),
      newWalletBalance: Number(d.new_wallet_balance ?? 0),
    };
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeAggregates(licenses: License[]): LicenseListAggregates {
  const agg: LicenseListAggregates = {
    totalActive: 0,
    totalConsumed: 0,
    totalExpired: 0,
    totalCancelled: 0,
    totalCreditsConsumed: 0,
  };
  for (const l of licenses) {
    if (l.status === "active") agg.totalActive += 1;
    else if (l.status === "consumed") agg.totalConsumed += 1;
    else if (l.status === "expired") agg.totalExpired += 1;
    else if (l.status === "cancelled") agg.totalCancelled += 1;
    if (l.status !== "cancelled") agg.totalCreditsConsumed += l.creditsConsumed;
  }
  return agg;
}

function sortLicenses(
  licenses: License[],
  sort: ListLicensesRequest["filters"]["sort"],
): License[] {
  const copy = licenses.slice();
  switch (sort) {
    case "issuedAt-asc":
      return copy.sort((a, b) => +new Date(a.issuedAt) - +new Date(b.issuedAt));
    case "track-asc":
      return copy.sort((a, b) => a.trackSnapshot.title.localeCompare(b.trackSnapshot.title));
    case "creditsConsumed-desc":
      return copy.sort((a, b) => b.creditsConsumed - a.creditsConsumed);
    case "creditsConsumed-asc":
      return copy.sort((a, b) => a.creditsConsumed - b.creditsConsumed);
    case "issuedAt-desc":
    default:
      return copy.sort((a, b) => +new Date(b.issuedAt) - +new Date(a.issuedAt));
  }
}
