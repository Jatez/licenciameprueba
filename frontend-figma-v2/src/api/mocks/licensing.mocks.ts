/**
 * Mock data + in-memory state for the licensing flow (F-05).
 *
 * Dev scenario overrides via URL query: `?mock=insufficient|not-licensable|wallet-expired|concurrent`.
 */
import type {
  CancellationPolicy,
  License,
  LicenseStatusFull,
  LicensingTermsResponse,
  LicenseUsageType,
  UsageTypeCatalog,
} from "@/api/types";

// ─── Usage type catalog (credit costs confirmed by client) ───────────────────

export const USAGE_TYPE_CATALOG: UsageTypeCatalog = [
  {
    id: "single-use",
    creditCost: 2,
    titleKey: "single-use.title",
    descriptionKey: "single-use.description",
    exampleKey: "single-use.example",
    iconName: "Image",
  },
  {
    id: "stories-pack",
    creditCost: 1,
    titleKey: "stories-pack.title",
    descriptionKey: "stories-pack.description",
    exampleKey: "stories-pack.example",
    iconName: "Layers",
  },
  {
    id: "monthly-extended",
    creditCost: 13,
    titleKey: "monthly-extended.title",
    descriptionKey: "monthly-extended.description",
    exampleKey: "monthly-extended.example",
    iconName: "Calendar",
  },
  {
    id: "long-video",
    creditCost: 5,
    titleKey: "long-video.title",
    descriptionKey: "long-video.description",
    exampleKey: "long-video.example",
    iconName: "Film",
  },
  {
    id: "paid-post",
    creditCost: 8,
    titleKey: "paid-post.title",
    descriptionKey: "paid-post.description",
    exampleKey: "paid-post.example",
    iconName: "Target",
  },
  {
    id: "collaborative-post",
    creditCost: 9,
    titleKey: "collaborative-post.title",
    descriptionKey: "collaborative-post.description",
    exampleKey: "collaborative-post.example",
    iconName: "Users",
  },
];

// ─── Cancellation policy (placeholder — backend will replace copy) ───────────

export const MOCK_CANCELLATION_POLICY: CancellationPolicy = {
  cancellableWindowHours: 48,
  requiresEvidence: false,
  requiresAdminApproval: false,
  policyText:
    "Puedes anular esta licencia dentro de las 48 horas posteriores a su emisión sin penalización, siempre que no haya sido asociada a una publicación. Después de ese plazo, la anulación requiere aprobación del administrador de la plataforma y puede estar sujeta a condiciones adicionales.",
  policyVersion: "v1.0.0-placeholder",
  lastUpdatedAt: new Date().toISOString(),
};

// ─── Licensing terms (markdown body + bullets for fast display) ──────────────

export const MOCK_LICENSING_TERMS: LicensingTermsResponse = {
  version: "2026.01.15",
  summaryBullets: [
    "Esta licencia autoriza el uso del track seleccionado exclusivamente para el tipo de uso elegido.",
    "La licencia es intransferible y aplica únicamente a la empresa que la emite.",
    "Cualquier uso fuera de las condiciones especificadas puede derivar en claims de copyright.",
    "El track no puede ser remezclado, alterado o modificado sin autorización adicional.",
    "Los créditos consumidos no son reembolsables, excepto durante la ventana de anulación de 48 horas.",
  ],
  bodyMarkdown: `## Licencia otorgada
Se concede a la empresa licenciataria un permiso no exclusivo, intransferible y limitado para utilizar la obra musical seleccionada únicamente bajo el tipo de uso elegido en este flujo.

## Restricciones
La obra no podrá ser remezclada, sampleada, modificada ni utilizada para fines distintos al especificado. Está prohibido sublicenciar o ceder los derechos a terceros.

## Vigencia
La vigencia de esta licencia depende del tipo de uso seleccionado. Para usos únicos, la licencia se considera consumida al detectarse la primera publicación. Para uso extendido mensual, la vigencia es de 30 días desde la emisión.

## Anulación
Aplica la política de anulación vigente en el momento de la emisión. Consulta el resumen mostrado durante el flujo de licenciamiento.

## Limitación de responsabilidad
Licénciame no responde por usos fuera de las condiciones aquí descritas. Cualquier reclamación de copyright derivada de un uso no autorizado es responsabilidad exclusiva del licenciatario.`,
  cancellationPolicy: MOCK_CANCELLATION_POLICY,
  lastUpdatedAt: new Date().toISOString(),
};

// ─── Mock wallet balance (matches dashboard default fixture) ────────────────

export const MOCK_WALLET_BALANCE = 180;
export const MOCK_WALLET_INSUFFICIENT_BALANCE = 3;

/**
 * Session-mutable wallet balance so issue/cancel updates feel realistic.
 * Tests that depend on `MOCK_WALLET_BALANCE` still get the constant.
 */
let __sessionBalance = MOCK_WALLET_BALANCE;

export function getSessionBalance(): number {
  return __sessionBalance;
}

export function setSessionBalance(value: number): void {
  __sessionBalance = Math.max(0, value);
}

export function resetSessionBalance(): void {
  __sessionBalance = MOCK_WALLET_BALANCE;
}

// ─── Scenario flags read from URL ────────────────────────────────────────────

export type LicensingMockScenario =
  | "default"
  | "insufficient"
  | "not-licensable"
  | "wallet-expired"
  | "concurrent";

export function readMockScenario(): LicensingMockScenario {
  if (typeof window === "undefined") return "default";
  const param = new URLSearchParams(window.location.search).get("mock");
  switch (param) {
    case "insufficient":
    case "not-licensable":
    case "wallet-expired":
    case "concurrent":
      return param;
    default:
      return "default";
  }
}

// ─── Token id generator ──────────────────────────────────────────────────────

const TOKEN_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateLicenseTokenId(): string {
  const block = (n: number) =>
    Array.from({ length: n }, () =>
      TOKEN_ALPHABET[Math.floor(Math.random() * TOKEN_ALPHABET.length)],
    ).join("");
  const year = new Date().getFullYear();
  return `LIC-${block(4)}-${year}`;
}

// ─── In-memory store of licenses issued during the session ───────────────────

const __issuedLicenses: License[] = [];

export function addIssuedLicense(license: License): void {
  __issuedLicenses.unshift(license);
}

export function getIssuedLicenses(): License[] {
  return __issuedLicenses.slice();
}

export function findIssuedLicense(licenseId: string): License | undefined {
  return __issuedLicenses.find((l) => l.id === licenseId);
}

export function updateIssuedLicense(
  licenseId: string,
  patch: Partial<License>,
): License | undefined {
  const idx = __issuedLicenses.findIndex((l) => l.id === licenseId);
  if (idx === -1) return undefined;
  __issuedLicenses[idx] = { ...__issuedLicenses[idx], ...patch };
  return __issuedLicenses[idx];
}

// ─── Pre-populated demo licenses ────────────────────────────────────────────
// Lets the user land on /licenses with realistic data even before issuing
// anything in-session. Distributed across the last 90 days, mixing statuses.

interface SeedSpec {
  trackId: string;
  trackTitle: string;
  trackArtist: string;
  trackAlbum: string | null;
  trackDurationSec: number;
  trackIsrc: string | null;
  usageType: LicenseUsageType;
  creditsConsumed: number;
  daysAgo: number;
  status: LicenseStatusFull;
  consumedDaysAgo?: number;
  cancellationReason?: string;
}

const SEED_SPECS: SeedSpec[] = [
  { trackId: "t1", trackTitle: "Verano en la ciudad", trackArtist: "Lúa Moreno", trackAlbum: "Mareas", trackDurationSec: 198, trackIsrc: "CO-X12-25-00001", usageType: "stories-pack", creditsConsumed: 1, daysAgo: 0, status: "active" },
  { trackId: "t2", trackTitle: "Latido eléctrico", trackArtist: "Nodo Sur", trackAlbum: "Sintética", trackDurationSec: 224, trackIsrc: "CO-X12-25-00002", usageType: "monthly-extended", creditsConsumed: 13, daysAgo: 1, status: "active" },
  { trackId: "t3", trackTitle: "Costa norte", trackArtist: "Mariana Vélez", trackAlbum: null, trackDurationSec: 176, trackIsrc: "CO-X12-25-00003", usageType: "single-use", creditsConsumed: 2, daysAgo: 3, status: "consumed", consumedDaysAgo: 2 },
  { trackId: "t4", trackTitle: "Cumbia sintética", trackArtist: "Los Picos", trackAlbum: "Trópico", trackDurationSec: 252, trackIsrc: "CO-X12-25-00004", usageType: "paid-post", creditsConsumed: 8, daysAgo: 5, status: "consumed", consumedDaysAgo: 3 },
  { trackId: "t5", trackTitle: "Madrugada limpia", trackArtist: "Aire Quieto", trackAlbum: "Aire", trackDurationSec: 188, trackIsrc: "CO-X12-25-00005", usageType: "stories-pack", creditsConsumed: 1, daysAgo: 8, status: "consumed", consumedDaysAgo: 7 },
  { trackId: "t6", trackTitle: "Ruta 70", trackArtist: "Brava", trackAlbum: "Ruta", trackDurationSec: 213, trackIsrc: "CO-X12-25-00006", usageType: "long-video", creditsConsumed: 5, daysAgo: 14, status: "consumed", consumedDaysAgo: 12 },
  { trackId: "t7", trackTitle: "Mar adentro", trackArtist: "Selva Roja", trackAlbum: null, trackDurationSec: 268, trackIsrc: "CO-X12-25-00007", usageType: "collaborative-post", creditsConsumed: 9, daysAgo: 21, status: "consumed", consumedDaysAgo: 19 },
  { trackId: "t8", trackTitle: "Vientos del este", trackArtist: "Andina Beats", trackAlbum: "Sierra", trackDurationSec: 207, trackIsrc: "CO-X12-25-00008", usageType: "single-use", creditsConsumed: 2, daysAgo: 30, status: "cancelled", cancellationReason: "Elegí el tipo de uso equivocado" },
  { trackId: "t9", trackTitle: "Noches azules", trackArtist: "Karma Bass", trackAlbum: "Azul", trackDurationSec: 232, trackIsrc: "CO-X12-25-00009", usageType: "stories-pack", creditsConsumed: 1, daysAgo: 38, status: "expired" },
  { trackId: "t10", trackTitle: "Corazón análogo", trackArtist: "Vinilo & Eco", trackAlbum: "Cassettes", trackDurationSec: 245, trackIsrc: "CO-X12-25-00010", usageType: "monthly-extended", creditsConsumed: 13, daysAgo: 45, status: "consumed", consumedDaysAgo: 30 },
  { trackId: "t11", trackTitle: "Lunes brillante", trackArtist: "Sol y Cobre", trackAlbum: null, trackDurationSec: 192, trackIsrc: "CO-X12-25-00011", usageType: "paid-post", creditsConsumed: 8, daysAgo: 60, status: "consumed", consumedDaysAgo: 55 },
  { trackId: "t12", trackTitle: "Eco profundo", trackArtist: "Subtonal", trackAlbum: "Profundo", trackDurationSec: 281, trackIsrc: "CO-X12-25-00012", usageType: "long-video", creditsConsumed: 5, daysAgo: 85, status: "expired" },
];

const HOUR_MS = 3600_000;
const DAY_MS = 86_400_000;

function seededTokenId(daysAgo: number, idx: number): string {
  // Deterministic-ish for demo data; not security-sensitive.
  const block = TOKEN_ALPHABET[idx % TOKEN_ALPHABET.length] +
    TOKEN_ALPHABET[(idx * 7) % TOKEN_ALPHABET.length] +
    TOKEN_ALPHABET[(idx * 13) % TOKEN_ALPHABET.length] +
    TOKEN_ALPHABET[(daysAgo + idx) % TOKEN_ALPHABET.length];
  const year = new Date().getFullYear();
  return `LIC-${block}-${year}`;
}

function buildSeedLicense(spec: SeedSpec, idx: number): License {
  const now = Date.now();
  const issuedAt = new Date(now - spec.daysAgo * DAY_MS).toISOString();
  const cancellableUntilMs = now - spec.daysAgo * DAY_MS +
    MOCK_CANCELLATION_POLICY.cancellableWindowHours * HOUR_MS;
  const cancellableUntil = new Date(cancellableUntilMs).toISOString();
  return {
    id: `seed-${spec.trackId}-${idx}`,
    licenseTokenId: seededTokenId(spec.daysAgo, idx),
    companyId: "company-mock-001",
    companyName: "Marca Demo S.A.S.",
    trackId: spec.trackId,
    trackSnapshot: {
      title: spec.trackTitle,
      artist: spec.trackArtist,
      album: spec.trackAlbum,
      durationSec: spec.trackDurationSec,
      coverUrl: `https://picsum.photos/seed/${spec.trackId}/200/200`,
      isrc: spec.trackIsrc,
    },
    usageType: spec.usageType,
    creditsConsumed: spec.creditsConsumed,
    status: spec.status,
    issuedAt,
    expiresAt: spec.usageType === "monthly-extended"
      ? new Date(now - spec.daysAgo * DAY_MS + 30 * DAY_MS).toISOString()
      : null,
    consumedAt: spec.consumedDaysAgo != null
      ? new Date(now - spec.consumedDaysAgo * DAY_MS).toISOString()
      : null,
    cancelledAt: spec.status === "cancelled"
      ? new Date(now - (spec.daysAgo - 1) * DAY_MS).toISOString()
      : null,
    cancellationReason: spec.cancellationReason ?? null,
    cancellableUntil,
    issuedByUserId: "user-mock-001",
    issuedByUserName: "María González",
  };
}

let __seeded = false;

/** Idempotent — safe to call from every endpoint. */
export function ensureSeedLicenses(): void {
  if (__seeded) return;
  __seeded = true;
  // Insert oldest-first so unshift produces a most-recent-first list.
  [...SEED_SPECS].reverse().forEach((spec, i) => {
    addIssuedLicense(buildSeedLicense(spec, SEED_SPECS.length - 1 - i));
  });
}
