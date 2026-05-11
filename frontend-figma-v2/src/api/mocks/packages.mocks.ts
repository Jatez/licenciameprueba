/**
 * Mock data + in-memory state for the credit packages flow (F-04).
 *
 * Acts as the single source of truth for the wallet balance — licensing
 * mocks delegate `getCurrentWalletBalance()` here to keep the demo loop
 * (purchase → balance up → license → balance down) consistent.
 *
 * Dev scenario overrides via URL query: `?purchase=card-decline|processing-slow|quote-expired`.
 */
import type {
  CreditBag,
  CreditPackage,
  CreditPackageId,
  Purchase,
  PurchaseEvent,
  PurchaseEventType,
  PurchaseQuote,
  WalletAggregate,
} from "@/api/types";

// ─── Catalog ────────────────────────────────────────────────────────────────

const buildPackage = (
  id: CreditPackageId,
  name: string,
  credits: number,
  priceCop: number,
  validityMonths: number,
  recommended = false,
): CreditPackage => ({
  id,
  name,
  credits,
  priceCop,
  validityMonths,
  recommended,
  pricePerCreditCop: Math.round(priceCop / credits),
});

export const CREDIT_PACKAGES: CreditPackage[] = [
  buildPackage("bag-a", "Bolsa A", 300, 90_000_000, 14),
  buildPackage("bag-b", "Bolsa B", 600, 166_000_000, 14, true),
  buildPackage("bag-c", "Bolsa C", 1000, 266_000_000, 18),
];

export function findPackage(id: CreditPackageId): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((p) => p.id === id);
}

// ─── Scenario flags (extends licensing's ?mock= system) ─────────────────────

export type PurchaseMockScenario =
  | "default"
  | "card-decline"
  | "processing-slow"
  | "quote-expired";

export function readPurchaseScenario(): PurchaseMockScenario {
  if (typeof window === "undefined") return "default";
  const param = new URLSearchParams(window.location.search).get("purchase");
  switch (param) {
    case "card-decline":
    case "processing-slow":
    case "quote-expired":
      return param;
    default:
      return "default";
  }
}

// ─── Token / id generators ─────────────────────────────────────────────────

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomBlock(n: number): string {
  return Array.from({ length: n }, () =>
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
  ).join("");
}

export function generateQuoteId(): string {
  return `QUO-${randomBlock(4)}-${new Date().getFullYear()}`;
}

export function generatePurchaseId(): string {
  return `PUR-${randomBlock(6)}`;
}

export function generateBagId(): string {
  return `BAG-${randomBlock(6)}`;
}

export function generateReceiptNumber(): string {
  return `FAC-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function generateTransferReference(): string {
  return `TRX-${randomBlock(6)}`;
}

let __evtCounter = 0;
export function makeEvent(
  type: PurchaseEventType,
  occurredAt: string,
  note: string | null = null,
  actor: PurchaseEvent["actor"] = "system",
  metadata?: Record<string, string>,
): PurchaseEvent {
  __evtCounter += 1;
  return {
    id: `EVT-${Date.now().toString(36)}-${__evtCounter}`,
    type,
    occurredAt,
    actor,
    note,
    metadata,
  };
}

// ─── In-memory stores ──────────────────────────────────────────────────────

const __bags: CreditBag[] = [];
const __purchases: Purchase[] = [];
const __quotes: PurchaseQuote[] = [];

const DAY_MS = 86_400_000;
const MONTH_MS = 30 * DAY_MS;

// ─── Seed data ─────────────────────────────────────────────────────────────

let __seeded = false;

function seedData(): void {
  if (__seeded) return;
  __seeded = true;

  const now = Date.now();
  const pkgA = findPackage("bag-a")!;
  const pkgB = findPackage("bag-b")!;
  const pkgC = findPackage("bag-c")!;

  // ── Confirmed purchase #1 — active bag B (8 months remaining) ─────────────
  const p1Created = new Date(now - 6 * MONTH_MS).toISOString();
  const p1Confirmed = new Date(now - 6 * MONTH_MS + DAY_MS).toISOString();
  const purchase1Id = "PUR-SEED01";
  const bag1Id = "BAG-SEED01";
  __purchases.push({
    id: purchase1Id,
    quoteId: "QUO-SEED01-2025",
    packageId: pkgB.id,
    packageSnapshot: pkgB,
    paymentMethod: "bank-transfer-simulated",
    status: "confirmed",
    subtotalCop: Math.round(pkgB.priceCop / 1.19),
    ivaCop: pkgB.priceCop - Math.round(pkgB.priceCop / 1.19),
    totalCop: pkgB.priceCop,
    createdAt: p1Created,
    confirmedAt: p1Confirmed,
    failureReason: null,
    receiptNumber: "FAC-DEMO-1042",
    bagId: bag1Id,
    cardLast4: null,
    transferReference: "TRX-SEED01",
    creditsCredited: pkgB.credits,
    manualReviewReason: null,
    isProvisionalDocument: true,
    events: [
      makeEvent("order_created", p1Created),
      makeEvent("quote_generated", p1Created),
      makeEvent("payment_initiated", p1Created, null, "user"),
      makeEvent("payment_pending", p1Created),
      makeEvent("payment_received", p1Confirmed, null, "ops"),
      makeEvent("credits_credited", p1Confirmed, null, "system", {
        amount: String(pkgB.credits),
      }),
      makeEvent("receipt_emitted", p1Confirmed),
      makeEvent("confirmation_email_sent", p1Confirmed, null, "system", {
        emailTo: "compras@marcademo.co",
      }),
    ],
  });
  __bags.push({
    id: bag1Id,
    packageId: pkgB.id,
    packageName: pkgB.name,
    creditsTotal: pkgB.credits,
    creditsRemaining: 247,
    purchasedAt: p1Confirmed,
    expiresAt: new Date(now + 8 * MONTH_MS).toISOString(),
    status: "active",
    purchaseId: purchase1Id,
  });

  // ── Confirmed purchase #2 — bag A consumed ────────────────────────────────
  const p2Created = new Date(now - 10 * MONTH_MS).toISOString();
  const p2Confirmed = new Date(now - 10 * MONTH_MS + DAY_MS).toISOString();
  const purchase2Id = "PUR-SEED02";
  const bag2Id = "BAG-SEED02";
  __purchases.push({
    id: purchase2Id,
    quoteId: "QUO-SEED02-2024",
    packageId: pkgA.id,
    packageSnapshot: pkgA,
    paymentMethod: "card-simulated",
    status: "confirmed",
    subtotalCop: Math.round(pkgA.priceCop / 1.19),
    ivaCop: pkgA.priceCop - Math.round(pkgA.priceCop / 1.19),
    totalCop: pkgA.priceCop,
    createdAt: p2Created,
    confirmedAt: p2Confirmed,
    failureReason: null,
    receiptNumber: "FAC-DEMO-0987",
    bagId: bag2Id,
    cardLast4: "1111",
    transferReference: null,
    creditsCredited: pkgA.credits,
    manualReviewReason: null,
    isProvisionalDocument: true,
    events: [
      makeEvent("order_created", p2Created),
      makeEvent("quote_generated", p2Created),
      makeEvent("payment_initiated", p2Created, null, "user"),
      makeEvent("payment_received", p2Confirmed),
      makeEvent("credits_credited", p2Confirmed),
      makeEvent("receipt_emitted", p2Confirmed),
      makeEvent("confirmation_email_sent", p2Confirmed),
    ],
  });
  __bags.push({
    id: bag2Id,
    packageId: pkgA.id,
    packageName: pkgA.name,
    creditsTotal: pkgA.credits,
    creditsRemaining: 0,
    purchasedAt: p2Confirmed,
    expiresAt: new Date(now + 4 * MONTH_MS).toISOString(),
    status: "exhausted",
    purchaseId: purchase2Id,
  });

  // ── Rejected purchase #3 (card declined) ──────────────────────────────────
  const p3Created = new Date(now - 2 * MONTH_MS).toISOString();
  const p3Rejected = new Date(now - 2 * MONTH_MS + 5 * 60_000).toISOString();
  __purchases.push({
    id: "PUR-SEED03",
    quoteId: "QUO-SEED03-2025",
    packageId: pkgA.id,
    packageSnapshot: pkgA,
    paymentMethod: "card-simulated",
    status: "rejected",
    subtotalCop: Math.round(pkgA.priceCop / 1.19),
    ivaCop: pkgA.priceCop - Math.round(pkgA.priceCop / 1.19),
    totalCop: pkgA.priceCop,
    createdAt: p3Created,
    confirmedAt: null,
    failureReason: "PAYMENT_DECLINED",
    receiptNumber: null,
    bagId: null,
    cardLast4: "4242",
    transferReference: null,
    creditsCredited: 0,
    manualReviewReason: null,
    rejectionReason: "Pago rechazado por el banco emisor.",
    isProvisionalDocument: true,
    events: [
      makeEvent("order_created", p3Created),
      makeEvent("quote_generated", p3Created),
      makeEvent("payment_initiated", p3Created, null, "user"),
      makeEvent(
        "payment_rejected",
        p3Rejected,
        "El banco emisor rechazó la transacción.",
      ),
    ],
  });

  // ── Pending confirmation #4 — transfer received, waiting reconciliation ───
  const p4Created = new Date(now - 3 * DAY_MS).toISOString();
  const p4Received = new Date(now - 2 * DAY_MS).toISOString();
  __purchases.push({
    id: "PUR-SEED04",
    quoteId: "QUO-SEED04-2025",
    packageId: pkgA.id,
    packageSnapshot: pkgA,
    paymentMethod: "bank-transfer-simulated",
    status: "pending_confirmation",
    subtotalCop: Math.round(pkgA.priceCop / 1.19),
    ivaCop: pkgA.priceCop - Math.round(pkgA.priceCop / 1.19),
    totalCop: pkgA.priceCop,
    createdAt: p4Created,
    confirmedAt: null,
    failureReason: null,
    receiptNumber: null,
    bagId: null,
    cardLast4: null,
    transferReference: "TRX-SEED04",
    creditsCredited: 0,
    manualReviewReason: null,
    reviewReason: "Estamos validando la conciliación bancaria. Te avisaremos por correo en cuanto se acrediten los créditos.",
    isProvisionalDocument: true,
    events: [
      makeEvent("order_created", p4Created),
      makeEvent("quote_generated", p4Created),
      makeEvent("payment_initiated", p4Created, null, "user"),
      makeEvent("payment_pending", p4Created),
      makeEvent(
        "payment_received",
        p4Received,
        "Transferencia detectada · pendiente de conciliación bancaria.",
      ),
    ],
  });

  // ── Manual review #5 — high-amount order flagged ──────────────────────────
  const p5Created = new Date(now - 5 * DAY_MS).toISOString();
  const p5Flagged = new Date(now - 5 * DAY_MS + 10 * 60_000).toISOString();
  __purchases.push({
    id: "PUR-SEED05",
    quoteId: "QUO-SEED05-2025",
    packageId: pkgC.id,
    packageSnapshot: pkgC,
    paymentMethod: "bank-transfer-simulated",
    status: "manual_review",
    subtotalCop: Math.round(pkgC.priceCop / 1.19),
    ivaCop: pkgC.priceCop - Math.round(pkgC.priceCop / 1.19),
    totalCop: pkgC.priceCop,
    createdAt: p5Created,
    confirmedAt: null,
    failureReason: null,
    receiptNumber: null,
    bagId: null,
    cardLast4: null,
    transferReference: "TRX-SEED05",
    creditsCredited: 0,
    manualReviewReason:
      "Monto superior a $200.000.000 COP · validación de cuentas corporativas en curso.",
    isProvisionalDocument: true,
    events: [
      makeEvent("order_created", p5Created),
      makeEvent("quote_generated", p5Created),
      makeEvent("payment_initiated", p5Created, null, "user"),
      makeEvent("payment_pending", p5Created),
      makeEvent(
        "manual_review_flagged",
        p5Flagged,
        "Orden marcada para revisión por monto elevado.",
        "ops",
      ),
    ],
  });
}

export function ensureSeedPackages(): void {
  seedData();
}

// ─── Bag helpers ────────────────────────────────────────────────────────────

export function addBag(bag: CreditBag): void {
  __bags.push(bag);
}

export function getActiveBags(): CreditBag[] {
  ensureSeedPackages();
  return __bags
    .filter((b) => b.status === "active" && b.creditsRemaining > 0)
    .slice()
    .sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
}

export function getAllBags(): CreditBag[] {
  ensureSeedPackages();
  return __bags.slice();
}

export function getCurrentWalletBalance(): number {
  return getActiveBags().reduce((sum, b) => sum + b.creditsRemaining, 0);
}

/** FIFO consumption: oldest-expiry first. Returns true when fully covered. */
export function consumeFromBags(amount: number): boolean {
  ensureSeedPackages();
  let remaining = amount;
  const ordered = getActiveBags();
  for (const bag of ordered) {
    if (remaining <= 0) break;
    const take = Math.min(bag.creditsRemaining, remaining);
    bag.creditsRemaining -= take;
    remaining -= take;
    if (bag.creditsRemaining <= 0) bag.status = "exhausted";
  }
  return remaining <= 0;
}

/** Refund credits back to the bag they originated from (best-effort). */
export function refundToBag(bagId: string | null, amount: number): void {
  if (!bagId) return;
  const bag = __bags.find((b) => b.id === bagId);
  if (!bag) return;
  bag.creditsRemaining = Math.min(
    bag.creditsTotal,
    bag.creditsRemaining + amount,
  );
  if (bag.creditsRemaining > 0 && bag.status === "exhausted") {
    bag.status = "active";
  }
}

export function getWalletAggregate(): WalletAggregate {
  ensureSeedPackages();
  const active = getActiveBags();
  const balance = active.reduce((s, b) => s + b.creditsRemaining, 0);
  const totalPurchased = __bags.reduce((s, b) => s + b.creditsTotal, 0);
  const earliest = active[0]?.expiresAt ?? null;
  const days = earliest
    ? Math.max(
        0,
        Math.ceil((new Date(earliest).getTime() - Date.now()) / DAY_MS),
      )
    : null;
  return {
    balance,
    totalPurchased,
    bags: active,
    earliestExpiry: earliest,
    daysUntilEarliestExpiry: days,
  };
}

// ─── Quotes ─────────────────────────────────────────────────────────────────

export function addQuote(quote: PurchaseQuote): void {
  __quotes.push(quote);
}

export function findQuote(quoteId: string): PurchaseQuote | undefined {
  return __quotes.find((q) => q.id === quoteId);
}

// ─── Purchases ─────────────────────────────────────────────────────────────

export function addPurchase(purchase: Purchase): void {
  __purchases.push(purchase);
}

export function findPurchase(purchaseId: string): Purchase | undefined {
  ensureSeedPackages();
  return __purchases.find((p) => p.id === purchaseId);
}

export function getAllPurchases(): Purchase[] {
  ensureSeedPackages();
  return __purchases
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updatePurchase(
  purchaseId: string,
  patch: Partial<Purchase>,
): Purchase | undefined {
  const idx = __purchases.findIndex((p) => p.id === purchaseId);
  if (idx === -1) return undefined;
  __purchases[idx] = { ...__purchases[idx], ...patch };
  return __purchases[idx];
}

export function appendPurchaseEvent(
  purchaseId: string,
  event: PurchaseEvent,
): Purchase | undefined {
  const p = findPurchase(purchaseId);
  if (!p) return undefined;
  p.events = [...p.events, event];
  return p;
}

export function markPurchaseConfirmed(
  purchaseId: string,
  bagId: string,
  receiptNumber: string,
): Purchase | undefined {
  const p = findPurchase(purchaseId);
  if (!p) return undefined;
  const at = new Date().toISOString();
  return updatePurchase(purchaseId, {
    status: "confirmed",
    confirmedAt: at,
    bagId,
    receiptNumber,
    creditsCredited: p.packageSnapshot.credits,
    events: [
      ...p.events,
      makeEvent("payment_received", at, null, "ops"),
      makeEvent("credits_credited", at, null, "system", {
        amount: String(p.packageSnapshot.credits),
      }),
      makeEvent("receipt_emitted", at),
      makeEvent("confirmation_email_sent", at),
    ],
  });
}

export function markPurchaseFailed(
  purchaseId: string,
  reason: string,
): Purchase | undefined {
  const p = findPurchase(purchaseId);
  if (!p) return undefined;
  const at = new Date().toISOString();
  return updatePurchase(purchaseId, {
    status: "rejected",
    failureReason: reason,
    creditsCredited: 0,
    events: [
      ...p.events,
      makeEvent("payment_rejected", at, reason, "system"),
    ],
  });
}

/** Dev-only: flag an order for manual review (used by detail page toggle). */
export function flagForManualReview(
  purchaseId: string,
  reason: string,
): Purchase | undefined {
  const p = findPurchase(purchaseId);
  if (!p) return undefined;
  const at = new Date().toISOString();
  return updatePurchase(purchaseId, {
    status: "manual_review",
    manualReviewReason: reason,
    events: [
      ...p.events,
      makeEvent("manual_review_flagged", at, reason, "ops"),
    ],
  });
}
