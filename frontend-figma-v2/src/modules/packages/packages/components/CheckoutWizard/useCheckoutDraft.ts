import { useCallback, useEffect, useState } from "react";
import type { CheckoutDraft } from "./checkoutDraft.types";
import { EMPTY_DRAFT } from "./checkoutDraft.types";

const STORAGE_KEY = "licenciame.checkout.draft";
const TTL_MS = 24 * 60 * 60 * 1000;

function sanitize(draft: CheckoutDraft): CheckoutDraft {
  // Never persist CVV.
  if (!draft.cardData) return draft;
  const { cvv: _omit, ...safe } = draft.cardData;
  void _omit;
  return { ...draft, cardData: safe };
}

function isValidDraft(value: unknown): value is CheckoutDraft {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<CheckoutDraft>;
  if (typeof v.step !== "number" || v.step < 1 || v.step > 5) return false;
  if (typeof v.updatedAt !== "string") return false;
  return true;
}

function loadDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidDraft(parsed)) return null;
    if (Date.now() - new Date(parsed.updatedAt).getTime() > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Wizard draft hook backed by localStorage.
 * - TTL 24h: stale drafts auto-discarded.
 * - CVV is sanitized before persistence (security).
 * - Validates shape on hydrate; corrupt → reset.
 */
export function useCheckoutDraft() {
  const [draft, setDraft] = useState<CheckoutDraft>(
    () => loadDraft() ?? EMPTY_DRAFT,
  );
  const [restored, setRestored] = useState<boolean>(() => loadDraft() !== null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitize(draft)));
    } catch {
      // Quota or private mode — silently ignore.
    }
  }, [draft]);

  const update = useCallback((partial: Partial<CheckoutDraft>) => {
    setDraft((prev) => ({
      ...prev,
      ...partial,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const clearDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setDraft(EMPTY_DRAFT);
    setRestored(false);
  }, []);

  const dismissRestoredBanner = useCallback(() => setRestored(false), []);

  return { draft, update, clearDraft, restored, dismissRestoredBanner };
}
