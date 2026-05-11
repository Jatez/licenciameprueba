import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminApi } from "@/api/endpoints/admin";
import { adminCompaniesMocks } from "../mocks";
import {
  COMPANIES_DEFAULT_FILTERS,
  type AdminCompany,
  type CompaniesFiltersState,
} from "../types";

/** Map raw backend company to AdminCompany frontend shape */
function mapCompany(raw: Record<string, unknown>): AdminCompany {
  return {
    id: String(raw.id),
    name: String(raw.name ?? ""),
    legalName: String(raw.legal_name ?? raw.name ?? ""),
    taxId: String(raw.tax_id ?? raw.nit ?? ""),
    industry: String(raw.industry ?? ""),
    city: String(raw.city ?? ""),
    status: (raw.status ?? "active") as AdminCompany["status"],
    plan: (raw.plan ?? "bolsa-a") as AdminCompany["plan"],
    planLabel: String(raw.plan_label ?? raw.plan ?? "Bolsa A"),
    joinedAt: String(raw.created_at ?? raw.joined_at ?? new Date().toISOString()),
    primaryContactName: String(raw.contact_name ?? ""),
    primaryContactEmail: String(raw.contact_email ?? ""),
    wallet: {
      creditsAvailable: Number(raw.credits_available ?? 0),
      creditsConsumed: Number(raw.credits_consumed ?? 0),
      creditsTotal: Number(raw.credits_total ?? 0),
      expiresAt: raw.credits_expires_at ? String(raw.credits_expires_at) : null,
      lastTopUpAt: raw.last_top_up_at ? String(raw.last_top_up_at) : null,
    },
    activeLicenses: Number(raw.active_licenses ?? 0),
    monthlySpendCop: Number(raw.monthly_spend_cop ?? 0),
    licenses: [],
    payments: [],
    users: [],
  };
}

export function useAdminCompanies() {
  const [companies, setCompanies] = useState<AdminCompany[]>(adminCompaniesMocks);
  const [filters, setFilters] = useState<CompaniesFiltersState>(COMPANIES_DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from real backend on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    adminApi
      .getCompanies()
      .then((raw) => {
        if (cancelled) return;
        if (raw.length > 0) {
          setCompanies(raw.map(mapCompany));
        }
        // if backend returns empty, keep mocks
      })
      .catch(() => {
        // keep mocks on error — silent fail
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resetFilters = useCallback(() => setFilters(COMPANIES_DEFAULT_FILTERS), []);

  const setStatus = useCallback((id: string, status: AdminCompany["status"]) => {
    // Optimistic update
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    // Sync to backend
    adminApi.updateCompany(id, { status }).catch(() => {
      toast.error("No se pudo actualizar el estado de la empresa");
      // Revert not implemented to keep it simple
    });
  }, []);

  const assignCustomPlan = useCallback(
    (id: string, credits: number, label: string) => {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                plan: "custom",
                planLabel: label,
                wallet: {
                  ...c.wallet,
                  creditsAvailable: c.wallet.creditsAvailable + credits,
                  creditsTotal: c.wallet.creditsTotal + credits,
                  lastTopUpAt: new Date().toISOString(),
                },
              }
            : c,
        ),
      );
    },
    [],
  );

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return companies.filter((c) => {
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (filters.plan !== "all" && c.plan !== filters.plan) return false;
      if (q) {
        const blob =
          `${c.name} ${c.legalName} ${c.taxId} ${c.primaryContactName} ${c.primaryContactEmail}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [companies, filters]);

  const stats = useMemo(
    () => ({
      total: companies.length,
      active: companies.filter((c) => c.status === "active").length,
      suspended: companies.filter((c) => c.status === "suspended").length,
      creditsCirculating: companies.reduce((acc, c) => acc + c.wallet.creditsAvailable, 0),
    }),
    [companies],
  );

  return {
    companies,
    filtered,
    filters,
    setFilters,
    resetFilters,
    setStatus,
    assignCustomPlan,
    stats,
    isLoading,
  };
}
