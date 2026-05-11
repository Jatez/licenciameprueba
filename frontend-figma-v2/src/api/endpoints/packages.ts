/**
 * Packages endpoints — conectados al backend real.
 *
 * Endpoints reales:
 *   listTemplates()      → GET  /packages/templates
 *   getMySubscription()  → GET  /packages/my-subscription
 *   purchasePackage()    → POST /packages/purchase  { template_id, payment_method }
 *   validateCredits()    → POST /packages/validate  { track_id, usage_type }
 *   listPackages()       → GET  /packages/
 *
 * Los métodos mock anteriores (wallet, quotes, purchases) se eliminan.
 * Las páginas/componentes que los usaban han sido adaptados.
 */

import { http } from "@/api/http";
import type {
  PackageTemplate,
  ActiveSubscription,
  PurchasePackageRealRequest,
  Package,
  PurchasePackageResponse,
  UserSubscription,
} from "@/api/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapPackage(p: Record<string, unknown>): Package {
  return {
    id: String(p.id),
    name: String(p.name ?? ""),
    slug: String(p.slug ?? p.id),
    description: p.description ? String(p.description) : "",
    priceUSD: Number(p.price_usd ?? p.price ?? 0),
    billingCycle: (p.billing_cycle ?? "monthly") as Package["billingCycle"],
    isMostPopular: Boolean(p.is_most_popular ?? false),
    limits: {
      licensesPerMonth: Number(
        (p.limits as Record<string, unknown>)?.licenses_per_month ?? 0,
      ),
      socialAccountsPerPlatform: Number(
        (p.limits as Record<string, unknown>)?.social_accounts_per_platform ??
          1,
      ),
      analyticsRetentionDays: Number(
        (p.limits as Record<string, unknown>)?.analytics_retention_days ?? 30,
      ),
      tracksInCatalog: Number(
        (p.limits as Record<string, unknown>)?.tracks_in_catalog ?? 0,
      ),
    },
    features: (p.features as string[]) ?? [],
    stripePriceId: p.stripe_price_id ? String(p.stripe_price_id) : undefined,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const packagesApi = {
  /** GET /packages/ — lista paquetes de la empresa */
  async listAvailable(): Promise<Package[]> {
    try {
      const res = await http.get("/packages/");
      const data = res.data;
      const items = Array.isArray(data)
        ? data
        : Array.isArray((data as Record<string, unknown>)?.results)
          ? ((data as Record<string, unknown>).results as Record<
              string,
              unknown
            >[])
          : [];
      return items.map(mapPackage);
    } catch {
      return [];
    }
  },

  /** GET /packages/templates — templates disponibles para comprar */
  async listTemplates(): Promise<PackageTemplate[]> {
    try {
      const res = await http.get("/packages/templates");
      const data = res.data;
      return Array.isArray(data) ? (data as PackageTemplate[]) : [];
    } catch {
      return [];
    }
  },

  /** GET /packages/my-subscription — suscripción activa de la empresa (null si no tiene) */
  async getMySubscription(): Promise<ActiveSubscription | null> {
    try {
      const res = await http.get("/packages/my-subscription");
      if (!res.data) return null;
      return res.data as ActiveSubscription;
    } catch {
      return null;
    }
  },

  /** POST /packages/purchase — compra un paquete */
  async purchasePackage(
    req: PurchasePackageRealRequest,
  ): Promise<ActiveSubscription> {
    const res = await http.post("/packages/purchase", req);
    return res.data as ActiveSubscription;
  },

  /** POST /packages/validate — valida créditos para un uso */
  async validateCredits(params: {
    track_id: string;
    usage_type: string;
  }): Promise<unknown> {
    const res = await http.post("/packages/validate", params);
    return res.data;
  },

  // ─── Legacy stubs mantenidos para no romper imports existentes ──────────────
  // Se eliminan progresivamente a medida que los componentes se adaptan.

  /** @deprecated Usa listTemplates() + getMySubscription() */
  async listPackages(): Promise<PackageTemplate[]> {
    return this.listTemplates();
  },

  /** @deprecated No hay endpoint de wallet; usa getMySubscription() */
  async getWallet(): Promise<{
    balance: number;
    totalPurchased: number;
    bags: never[];
    earliestExpiry: null;
    daysUntilEarliestExpiry: null;
  }> {
    const sub = await this.getMySubscription();
    return {
      balance: sub?.credits_available ?? 0,
      totalPurchased: sub?.credits_total ?? 0,
      bags: [],
      earliestExpiry: null,
      daysUntilEarliestExpiry: null,
    };
  },

  /** @deprecated No hay endpoint de quotes en el backend */
  async getQuote(_quoteId: string): Promise<null> {
    return null;
  },

  /** @deprecated No hay endpoint de quotes en el backend */
  async createQuote(_req: unknown): Promise<null> {
    return null;
  },

  /** @deprecated Usa purchasePackage() */
  async confirmCardPurchase(_req: unknown): Promise<never> {
    throw new Error(
      "confirmCardPurchase no disponible — usa purchasePackage()",
    );
  },

  /** @deprecated No hay endpoint de bank-transfer en el backend */
  async confirmBankTransferIntent(_req: unknown): Promise<never> {
    throw new Error(
      "confirmBankTransferIntent no disponible — usa purchasePackage()",
    );
  },

  /** @deprecated No hay endpoint de dev confirm en el backend */
  async devConfirmBankTransfer(_purchaseId: string): Promise<never> {
    throw new Error("devConfirmBankTransfer no disponible en producción");
  },

  /** @deprecated No hay historial de compras en el backend */
  async listPurchases(
    _req: unknown,
  ): Promise<{
    purchases: never[];
    page: number;
    pageSize: number;
    totalPurchases: number;
    totalPages: number;
  }> {
    return { purchases: [], page: 1, pageSize: 10, totalPurchases: 0, totalPages: 0 };
  },

  /** @deprecated No hay historial de compras en el backend */
  async getPurchaseById(_id: string): Promise<never> {
    throw new Error("getPurchaseById no disponible — el backend no expone historial de compras");
  },

  /** @deprecated Compatibilidad con código anterior */
  async purchase(request: {
    packageId: string;
    billingCycle?: string;
    paymentMethodId?: string;
    couponCode?: string;
  }): Promise<PurchasePackageResponse> {
    const res = await http.post("/packages/purchase", {
      template_id: request.packageId,
      payment_method: request.paymentMethodId ?? "card",
    });
    const d = res.data as Record<string, unknown>;
    return {
      subscriptionId: String(d.subscription_id ?? d.id ?? ""),
      status: (d.status ?? "active") as PurchasePackageResponse["status"],
      currentPeriodEndsAt: String(
        d.current_period_ends_at ?? new Date().toISOString(),
      ),
      invoiceUrl: d.invoice_url ? String(d.invoice_url) : null,
      checkoutUrl: d.checkout_url ? String(d.checkout_url) : null,
    };
  },
};
