import type { UserActivity, UserActivityType } from "../types.dashboard";

const ACTORS = [
  { user_id: "u-001", user_name: "Camila Restrepo" },
  { user_id: "u-002", user_name: "Andrés Pérez" },
  { user_id: "u-003", user_name: "María López" },
  { user_id: "u-004", user_name: "Diego Castaño" },
];

const TYPE_PAYLOADS: Record<UserActivityType, () => Record<string, string | number>> = {
  license_issued: () => ({
    license_code: `LIC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    track_title: pick(["Verano en la ciudad", "Latido eléctrico", "Costa norte", "Cumbia sintética"]),
  }),
  certificate_downloaded: () => ({ license_code: `LIC-${Math.random().toString(36).slice(2, 6).toUpperCase()}` }),
  license_url_linked: () => ({
    license_code: `LIC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    platform: pick(["Instagram", "TikTok", "Facebook"]),
  }),
  license_voided: () => ({
    license_code: `LIC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    reason: pick(["Cambio de campaña", "Error de selección", "Cliente canceló"]),
  }),
  credits_purchased: () => ({ credits: pick([100, 300, 500, 1000]) }),
  social_connected: () => ({ platform: pick(["Instagram", "TikTok", "Facebook"]), handle: "@marca.demo" }),
  social_disconnected: () => ({ platform: pick(["Instagram", "TikTok", "Facebook"]), handle: "@marca.demo" }),
  track_favorited: () => ({
    track_title: pick(["Madrugada limpia", "Aire Quieto", "Vitamin C"]),
    artist: pick(["Lúa Moreno", "Nodo Sur", "Mariana Vélez"]),
  }),
  playlist_imported: () => ({
    playlist_name: pick(["Brand sounds Q2", "Lanzamiento verano", "Stories diarias"]),
    tracks_count: pick([12, 24, 36]),
  }),
  report_exported: () => ({
    report_name: pick(["Resumen mensual", "Detalle de licencias", "Consumo de créditos"]),
    format: pick(["PDF", "Excel"]),
  }),
  company_updated: () => ({ field: pick(["Razón social", "NIT", "Logo", "Datos de facturación"]) }),
};

const TYPES = Object.keys(TYPE_PAYLOADS) as UserActivityType[];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isoOffset(daysAgo: number, hours: number, minutes: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

let counter = 0;

/** Builds a deterministic-ish 90-day mock feed with ~120 events. */
export function buildUserActivityFeedMock(): UserActivity[] {
  // Reset counter so multiple calls produce same ids order
  counter = 0;
  const items: UserActivity[] = [];

  // Seeded distribution: more activity in recent days, less in older ones.
  for (let day = 0; day < 60; day++) {
    const eventsToday = Math.max(0, Math.round(6 - day * 0.08 + Math.random() * 3));
    for (let e = 0; e < eventsToday; e++) {
      const type = TYPES[Math.floor(Math.random() * TYPES.length)];
      const actor = ACTORS[Math.floor(Math.random() * ACTORS.length)];
      const hours = 8 + Math.floor(Math.random() * 11);
      const minutes = Math.floor(Math.random() * 60);
      counter += 1;
      items.push({
        id: `ua-${counter}`,
        type,
        actor,
        payload: TYPE_PAYLOADS[type](),
        created_at: isoOffset(day, hours, minutes),
        detail_url: detailUrlFor(type),
      });
    }
  }

  // Ensure newest-first
  items.sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
  return items;
}

function detailUrlFor(type: UserActivityType): string | undefined {
  switch (type) {
    case "license_issued":
    case "certificate_downloaded":
    case "license_url_linked":
    case "license_voided":
      return "/licenses";
    case "credits_purchased":
      return "/packages/history";
    case "social_connected":
    case "social_disconnected":
      return "/social";
    case "track_favorited":
    case "playlist_imported":
      return "/catalog";
    default:
      return undefined;
  }
}