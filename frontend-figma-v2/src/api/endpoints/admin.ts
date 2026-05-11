/**
 * Admin endpoints — wired to the real backend.
 *
 * All endpoints require admin or super_admin role.
 *
 * Mapping:
 *   getStats()              → GET  /admin/stats
 *   getCompanies()          → GET  /admin/companies
 *   updateCompany()         → PATCH /admin/companies/:company_id
 *   getUsers()              → GET  /admin/users
 *   changeUserRole()        → PATCH /admin/users/:user_id/role?role=string
 *   toggleTrack()           → PATCH /admin/tracks/:track_id/toggle
 *   getAuditLogs()          → GET  /admin/audit-logs?limit=50
 */

import { http } from "@/api/http";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  total_companies: number;
  total_users: number;
  connected_accounts: number;
  active_packages: number;
  active_tracks: number;
}

export interface AdminCompanyRaw {
  id: string;
  name: string;
  status: "active" | "suspended" | "overdue";
  plan?: string;
  created_at?: string;
  contact_email?: string;
  contact_name?: string;
  credits_available?: number;
  credits_total?: number;
  active_licenses?: number;
  [key: string]: unknown;
}

export interface AdminUserRaw {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  status?: string;
  company?: string;
  mfa_enabled?: boolean;
  last_sign_in_at?: string | null;
  [key: string]: unknown;
}

export interface AdminAuditLogRaw {
  id: string;
  timestamp?: string;
  created_at?: string;
  action: string;
  actor_email?: string;
  actor_name?: string;
  actor_type?: string;
  resource_type?: string;
  resource_id?: string;
  resource_label?: string;
  severity?: string;
  module?: string;
  ip?: string;
  user_agent?: string;
  session_id?: string;
  reviewed?: boolean;
  is_critical?: boolean;
  diff?: unknown[];
  notes?: string;
  [key: string]: unknown;
}

export interface AdminTrackToggleResult {
  id: string;
  status: "active" | "hidden";
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const adminApi = {
  /** GET /admin/stats — global platform statistics */
  async getStats(): Promise<AdminStats> {
    try {
      const res = await http.get("/admin/stats");
      return res.data as AdminStats;
    } catch {
      return {
        total_companies: 0,
        total_users: 0,
        connected_accounts: 0,
        active_packages: 0,
        active_tracks: 0,
      };
    }
  },

  /** GET /admin/companies — list all companies */
  async getCompanies(): Promise<AdminCompanyRaw[]> {
    try {
      const res = await http.get("/admin/companies");
      const data = res.data;
      return Array.isArray(data)
        ? (data as AdminCompanyRaw[])
        : Array.isArray((data as Record<string, unknown>)?.results)
          ? ((data as Record<string, unknown>).results as AdminCompanyRaw[])
          : [];
    } catch {
      return [];
    }
  },

  /** PATCH /admin/companies/:company_id — update company name or status */
  async updateCompany(
    companyId: string,
    patch: { name?: string; status?: "active" | "suspended" | "overdue" },
  ): Promise<AdminCompanyRaw> {
    const res = await http.patch(`/admin/companies/${companyId}`, patch);
    return res.data as AdminCompanyRaw;
  },

  /** GET /admin/users — list all users */
  async getUsers(): Promise<AdminUserRaw[]> {
    try {
      const res = await http.get("/admin/users");
      const data = res.data;
      return Array.isArray(data)
        ? (data as AdminUserRaw[])
        : Array.isArray((data as Record<string, unknown>)?.results)
          ? ((data as Record<string, unknown>).results as AdminUserRaw[])
          : [];
    } catch {
      return [];
    }
  },

  /** PATCH /admin/users/:user_id/role?role=string — change user role */
  async changeUserRole(userId: string, role: string): Promise<AdminUserRaw> {
    const res = await http.patch(`/admin/users/${userId}/role`, null, {
      params: { role },
    });
    return res.data as AdminUserRaw;
  },

  /** PATCH /admin/tracks/:track_id/toggle — toggle track active/hidden */
  async toggleTrack(trackId: string): Promise<AdminTrackToggleResult> {
    const res = await http.patch(`/admin/tracks/${trackId}/toggle`);
    return res.data as AdminTrackToggleResult;
  },

  /** GET /admin/audit-logs?limit=50 — audit log entries */
  async getAuditLogs(limit: number = 50): Promise<AdminAuditLogRaw[]> {
    try {
      const res = await http.get("/admin/audit-logs", { params: { limit } });
      const data = res.data;
      return Array.isArray(data)
        ? (data as AdminAuditLogRaw[])
        : Array.isArray((data as Record<string, unknown>)?.results)
          ? ((data as Record<string, unknown>).results as AdminAuditLogRaw[])
          : Array.isArray((data as Record<string, unknown>)?.items)
            ? ((data as Record<string, unknown>).items as AdminAuditLogRaw[])
            : [];
    } catch {
      return [];
    }
  },
};
