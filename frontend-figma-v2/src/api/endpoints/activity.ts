/**
 * Activity feed endpoints — wired to the real backend.
 *
 * Mapping:
 *   listActivity()       → GET /metrics/recent-activity  (with cursor/filter params)
 *   listActivityActors() → derived from activity items (no dedicated backend endpoint)
 *
 * Note: The backend /metrics/recent-activity returns generic activity items.
 * We keep the same external interface that the frontend expects.
 */

import { http } from "@/api/http";
import type { UserActivity, UserActivityType } from "../types.dashboard";

export interface ActivityListParams {
  from?: string;
  to?: string;
  types?: UserActivityType[];
  actors?: string[];
  cursor?: string | null;
  pageSize?: number;
}

export interface ActivityListResponse {
  items: UserActivity[];
  next_cursor: string | null;
}

function mapItem(item: Record<string, unknown>): UserActivity {
  return {
    id: String(item.id),
    type: (item.type ?? "license_issued") as UserActivityType,
    created_at: String(item.created_at ?? item.timestamp ?? new Date().toISOString()),
    actor: {
      user_id: String((item.actor as Record<string, unknown>)?.user_id ?? item.user_id ?? ""),
      user_name: String((item.actor as Record<string, unknown>)?.user_name ?? item.user_name ?? ""),
      avatar_url: null,
    },
    payload: (item.payload ?? item.metadata ?? {}) as UserActivity["payload"],
  };
}

export async function listActivity(params: ActivityListParams): Promise<ActivityListResponse> {
  const { from, to, types, actors, cursor, pageSize = 25 } = params;

  try {
    const queryParams: Record<string, unknown> = { limit: pageSize };
    if (from) queryParams.from = from;
    if (to) queryParams.to = to;
    if (types?.length) queryParams.types = types.join(",");
    if (actors?.length) queryParams.actors = actors.join(",");
    if (cursor) queryParams.cursor = cursor;

    const res = await http.get("/metrics/recent-activity", { params: queryParams });

    // Backend may return { items, next_cursor } or a plain array.
    const data = res.data as Record<string, unknown> | unknown[];
    if (Array.isArray(data)) {
      const items = data.map(mapItem);
      const next_cursor =
        items.length >= pageSize ? String(Number(cursor ?? 0) + items.length) : null;
      return { items, next_cursor };
    }
    const d = data as Record<string, unknown>;
    return {
      items: ((d.items ?? []) as Record<string, unknown>[]).map(mapItem),
      next_cursor: d.next_cursor ? String(d.next_cursor) : null,
    };
  } catch {
    return { items: [], next_cursor: null };
  }
}

export async function listActivityActors(): Promise<{ user_id: string; user_name: string }[]> {
  try {
    const res = await http.get("/metrics/recent-activity", { params: { limit: 200 } });
    const data = res.data as unknown[];
    const items = (Array.isArray(data) ? data : (data as Record<string, unknown>)["items"] ?? []) as Record<string, unknown>[];
    const seen = new Map<string, string>();
    for (const item of items.map(mapItem)) {
      if (!seen.has(item.actor.user_id)) {
        seen.set(item.actor.user_id, item.actor.user_name);
      }
    }
    return [...seen.entries()].map(([user_id, user_name]) => ({ user_id, user_name }));
  } catch {
    return [];
  }
}
