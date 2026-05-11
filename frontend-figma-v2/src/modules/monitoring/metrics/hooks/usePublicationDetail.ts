/**
 * F-11 · Hook: lookup a single publication by id (across the active scenario).
 *
 * Backend mapping: `GET /api/metrics/publications/:id`.
 *
 * Returns notFound=true when the id doesn't exist; isLoading remains false
 * after the simulated lookup completes.
 */
import { useEffect, useMemo, useState } from "react";
import { getActiveScenario, getPublicationsForScenario } from "../mocks";
import type { PublicationMetric } from "../types";

interface UsePublicationDetailResult {
  data: PublicationMetric | null;
  isLoading: boolean;
  notFound: boolean;
  refetch: () => void;
}

export function usePublicationDetail(id: string | undefined): UsePublicationDetailResult {
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PublicationMetric | null>(null);
  const [notFound, setNotFound] = useState(false);

  const lookupId = useMemo(() => id ?? null, [id]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    const t = setTimeout(() => {
      if (cancelled) return;
      if (!lookupId) {
        setData(null);
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      const all = getPublicationsForScenario(getActiveScenario());
      const match = all.find((p) => p.id === lookupId) ?? null;
      setData(match);
      setNotFound(match === null);
      setIsLoading(false);
    }, 250 + Math.random() * 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [lookupId, version]);

  return {
    data,
    isLoading,
    notFound,
    refetch: () => setVersion((v) => v + 1),
  };
}
