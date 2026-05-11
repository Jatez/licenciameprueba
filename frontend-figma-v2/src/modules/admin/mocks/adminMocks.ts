/**
 * MOCK ONLY — F-09 Admin Plataforma fixtures.
 * Replace with real endpoints when backend lands. No business logic here.
 */

export type AdminMetricKey =
  | "activeCompanies"
  | "creditsSold"
  | "licensesIssued"
  | "revenue"
  | "catalogTracks"
  | "hiddenTracks"
  | "pendingPayments"
  | "legalAlerts";

export interface AdminMetricMock {
  key: AdminMetricKey;
  value: string;
  unit?: string;
  trend: number[];
  delta: { value: number; percent: number; sentiment: "positive" | "negative" | "neutral" };
  highlighted?: boolean;
}

export const adminMetricsMock: AdminMetricMock[] = [
  {
    key: "activeCompanies",
    value: "42",
    unit: "organizaciones",
    trend: [34, 36, 35, 38, 39, 40, 41, 42],
    delta: { value: 4, percent: 10, sentiment: "positive" },
  },
  {
    key: "creditsSold",
    value: "18.4K",
    unit: "créditos",
    trend: [12, 13, 14, 15, 16, 17, 17.5, 18.4],
    delta: { value: 2400, percent: 15, sentiment: "positive" },
  },
  {
    key: "licensesIssued",
    value: "3.920",
    unit: "licencias",
    trend: [2800, 3000, 3100, 3300, 3500, 3700, 3850, 3920],
    delta: { value: 320, percent: 9, sentiment: "positive" },
  },
  {
    key: "revenue",
    value: "$1.240M",
    unit: "COP acumulado",
    trend: [800, 880, 940, 1000, 1080, 1150, 1200, 1240],
    delta: { value: 180, percent: 17, sentiment: "positive" },
  },
  {
    key: "catalogTracks",
    value: "15.000",
    unit: "tracks",
    trend: [14200, 14400, 14600, 14700, 14800, 14900, 14950, 15000],
    delta: { value: 320, percent: 2, sentiment: "neutral" },
  },
  {
    key: "hiddenTracks",
    value: "128",
    unit: "tracks",
    trend: [90, 100, 105, 110, 115, 120, 124, 128],
    delta: { value: 8, percent: 7, sentiment: "negative" },
    highlighted: true,
  },
  {
    key: "pendingPayments",
    value: "7",
    unit: "facturas",
    trend: [3, 4, 5, 6, 6, 6, 7, 7],
    delta: { value: 2, percent: 40, sentiment: "negative" },
    highlighted: true,
  },
  {
    key: "legalAlerts",
    value: "3",
    unit: "casos",
    trend: [1, 1, 2, 2, 2, 3, 3, 3],
    delta: { value: 1, percent: 50, sentiment: "negative" },
    highlighted: true,
  },
];

export type AdminAlertSeverity = "legal" | "ops" | "finance" | "catalog";

export interface AdminAlertMock {
  id: string;
  severity: AdminAlertSeverity;
  titleKey: "trackWithLicenses" | "companySuspension" | "catalogStale" | "pendingReconciliation";
  meta: string;
  href: string;
}

export const adminAlertsMock: AdminAlertMock[] = [
  {
    id: "alert-001",
    severity: "legal",
    titleKey: "trackWithLicenses",
    meta: "Track · “Atardecer en Cartagena”",
    href: "/admin/catalog",
  },
  {
    id: "alert-002",
    severity: "ops",
    titleKey: "companySuspension",
    meta: "Empresa · Postobón S.A.",
    href: "/admin/companies",
  },
  {
    id: "alert-003",
    severity: "catalog",
    titleKey: "catalogStale",
    meta: "Última carga · hace 18 días",
    href: "/admin/catalog",
  },
  {
    id: "alert-004",
    severity: "finance",
    titleKey: "pendingReconciliation",
    meta: "7 facturas · $42.5M COP",
    href: "/admin/billing",
  },
];

export type AdminQuickActionKey =
  | "addTrack"
  | "importCsv"
  | "createPackage"
  | "viewCompanies"
  | "reviewLicenses"
  | "auditActivity";

export interface AdminQuickActionMock {
  key: AdminQuickActionKey;
  href: string;
}

export const adminQuickActionsMock: AdminQuickActionMock[] = [
  { key: "addTrack", href: "/admin/catalog" },
  { key: "importCsv", href: "/admin/catalog" },
  { key: "createPackage", href: "/admin/pricing" },
  { key: "viewCompanies", href: "/admin/companies" },
  { key: "reviewLicenses", href: "/admin/licenses" },
  { key: "auditActivity", href: "/admin/audit" },
];
