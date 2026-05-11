export * from "./useWalletKpis";
export * from "./useBillingProfile";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type { PackageTemplate, ActiveSubscription, PurchasePackageRealRequest } from "@/api/types";

const QK = {
  templates: ["packages", "templates"] as const,
  subscription: ["packages", "my-subscription"] as const,
  packages: ["packages", "list"] as const,
  // Legacy query keys mantenidos para no invalidar queries existentes
  wallet: ["packages", "wallet"] as const,
  purchases: (page: number, pageSize: number) =>
    ["packages", "purchases", page, pageSize] as const,
  purchase: (id: string) => ["packages", "purchase", id] as const,
  quote: (id: string) => ["packages", "quote", id] as const,
};

/** Obtiene los templates disponibles para comprar (GET /packages/templates) */
export function usePackageTemplates() {
  return useQuery<PackageTemplate[]>({
    queryKey: QK.templates,
    queryFn: () => api.packages.listTemplates(),
    staleTime: 60_000,
  });
}

/** Obtiene la suscripción activa de la empresa (GET /packages/my-subscription) */
export function useMySubscription() {
  return useQuery<ActiveSubscription | null>({
    queryKey: QK.subscription,
    queryFn: () => api.packages.getMySubscription(),
    staleTime: 30_000,
  });
}

function useInvalidateAfterPurchase() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["packages"] });
    qc.invalidateQueries({ queryKey: ["dashboard-v2"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
    qc.invalidateQueries({ queryKey: ["licenses"] });
  };
}

/** Compra un paquete (POST /packages/purchase) */
export function usePurchasePackage() {
  const invalidate = useInvalidateAfterPurchase();
  return useMutation<ActiveSubscription, Error, PurchasePackageRealRequest>({
    mutationFn: (req) => api.packages.purchasePackage(req),
    onSuccess: invalidate,
  });
}

// ─── Legacy hooks mantenidos para no romper componentes no migrados ──────────
// Adaptan los métodos reales a las interfaces anteriores.

/** @deprecated Usa usePackageTemplates() — devuelve templates como CreditPackage[] */
export function useCreditPackages() {
  return useQuery({
    queryKey: QK.packages,
    queryFn: async () => {
      const templates = await api.packages.listTemplates();
      // Adapta PackageTemplate → CreditPackage (shape legacy)
      return templates.map((t) => ({
        id: t.id as import("@/api/types").CreditPackageId,
        name: t.name,
        credits: t.credits_total ?? t.credits,
        priceCop: t.price_cop,
        validityMonths: Math.round(t.duration_days / 30),
        recommended: t.code === "pro",
        pricePerCreditCop: t.price_per_credit_cop,
        // Extra campos reales accesibles
        _template: t,
      }));
    },
    staleTime: 60_000,
  });
}

/** @deprecated Usa useMySubscription() — devuelve datos de suscripción en formato WalletAggregate */
export function useWalletAggregate() {
  return useQuery({
    queryKey: QK.wallet,
    queryFn: async () => {
      const sub = await api.packages.getMySubscription();
      return {
        balance: sub?.credits_available ?? 0,
        totalPurchased: sub?.credits_total ?? 0,
        bags: [] as never[],
        earliestExpiry: sub?.current_period_ends_at ?? null,
        daysUntilEarliestExpiry: sub
          ? Math.ceil(
              (new Date(sub.current_period_ends_at).getTime() - Date.now()) /
                86_400_000,
            )
          : null,
        // Datos reales de suscripción
        subscription: sub,
      };
    },
    staleTime: 30_000,
  });
}

/** @deprecated No hay quotes reales en el backend */
export function usePurchaseQuote(_quoteId: string | undefined) {
  return useQuery({
    queryKey: QK.quote(_quoteId ?? ""),
    queryFn: () => Promise.resolve(null),
    enabled: false,
    staleTime: 30_000,
  });
}

/** @deprecated No hay quotes reales en el backend */
export function useCreateQuote() {
  return useMutation({
    mutationFn: (_req: unknown) => Promise.resolve(null),
  });
}

/** @deprecated No hay endpoint de card purchase — usa usePurchasePackage() */
export function useConfirmCardPurchase() {
  const invalidate = useInvalidateAfterPurchase();
  return useMutation({
    mutationFn: (_req: unknown): Promise<never> =>
      Promise.reject(
        new Error("Usa usePurchasePackage() para realizar compras"),
      ),
    onSuccess: invalidate,
  });
}

/** @deprecated No hay endpoint de bank transfer — usa usePurchasePackage() */
export function useConfirmBankTransferIntent() {
  const invalidate = useInvalidateAfterPurchase();
  return useMutation({
    mutationFn: (_req: unknown): Promise<never> =>
      Promise.reject(
        new Error("Usa usePurchasePackage() para realizar compras"),
      ),
    onSuccess: invalidate,
  });
}

/** @deprecated No disponible en el backend real */
export function useDevConfirmBankTransfer() {
  const invalidate = useInvalidateAfterPurchase();
  return useMutation({
    mutationFn: (_purchaseId: string): Promise<never> =>
      Promise.reject(new Error("devConfirmBankTransfer no disponible")),
    onSuccess: invalidate,
  });
}

/** @deprecated No hay historial de compras en el backend */
export function useListPurchases(_req: { page: number; pageSize: number }) {
  return useQuery({
    queryKey: QK.purchases(_req.page, _req.pageSize),
    queryFn: () =>
      Promise.resolve({
        purchases: [] as never[],
        page: 1,
        pageSize: 10,
        totalPurchases: 0,
        totalPages: 0,
      }),
    staleTime: 30_000,
  });
}

/** @deprecated No hay historial de compras en el backend */
export function usePurchase(_purchaseId: string | undefined) {
  return useQuery({
    queryKey: QK.purchase(_purchaseId ?? ""),
    queryFn: (): Promise<never> =>
      Promise.reject(
        new Error("El backend no expone detalle de compras individuales"),
      ),
    enabled: false,
    staleTime: 30_000,
  });
}
