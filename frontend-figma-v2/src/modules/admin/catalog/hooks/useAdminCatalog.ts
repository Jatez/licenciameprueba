import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminApi } from "@/api/endpoints/admin";
import { adminCatalogTracks } from "../mocks";
import { DEFAULT_CATALOG_FILTERS, type AdminTrack, type CatalogFiltersState } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

function matchesUpdatedWithin(track: AdminTrack, range: CatalogFiltersState["updatedWithin"]) {
  if (range === "all") return true;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const updated = new Date(track.updatedAt).getTime();
  if (Number.isNaN(updated)) return true;
  return Date.now() - updated <= days * DAY_MS;
}

export function useAdminCatalog() {
  const [tracks, setTracks] = useState<AdminTrack[]>(adminCatalogTracks);
  const [filters, setFilters] = useState<CatalogFiltersState>(DEFAULT_CATALOG_FILTERS);

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return tracks.filter((t) => {
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.genre !== "all" && t.genre !== filters.genre) return false;
      if (filters.onlyWithActiveLicenses && t.activeLicenses <= 0) return false;
      if (filters.onlyMissingMetadata && t.hasCompleteMetadata) return false;
      if (!matchesUpdatedWithin(t, filters.updatedWithin)) return false;
      if (term) {
        const haystack = `${t.title} ${t.artist} ${t.id} ${t.isrc}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [tracks, filters]);

  const resetFilters = () => setFilters(DEFAULT_CATALOG_FILTERS);

  const hideTrack = (id: string) => {
    // Optimistic update
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "hidden" } : t)));
    // Sync to backend (toggle = hidden)
    adminApi.toggleTrack(id).catch(() => {
      toast.error("No se pudo ocultar el track");
      // Revert
      setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "active" } : t)));
    });
  };

  const restoreTrack = (id: string) => {
    // Optimistic update
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "active" } : t)));
    // Sync to backend (toggle = back to active)
    adminApi.toggleTrack(id).catch(() => {
      toast.error("No se pudo restaurar el track");
      // Revert
      setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "hidden" } : t)));
    });
  };

  const upsertTrack = (track: AdminTrack) =>
    setTracks((prev) => {
      const i = prev.findIndex((t) => t.id === track.id);
      if (i === -1) return [track, ...prev];
      const next = [...prev];
      next[i] = track;
      return next;
    });

  return { tracks, filtered, filters, setFilters, resetFilters, hideTrack, restoreTrack, upsertTrack };
}
