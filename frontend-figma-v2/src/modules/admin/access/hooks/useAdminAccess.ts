import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { adminApi } from "@/api/endpoints/admin";
import type { AdminUserRaw } from "@/api/endpoints/admin";
import {
  adminCompanyUsersMocks,
  adminSuperAdminsMocks,
  adminInvitationsMocks,
} from "../mocks";
import type { AccessUser, InviteRole, PendingInvitation } from "../types";

function mapUser(raw: AdminUserRaw): AccessUser {
  return {
    id: String(raw.id),
    fullName: String(raw.full_name ?? raw.email ?? ""),
    email: String(raw.email),
    company: String(raw.company ?? ""),
    role: (raw.role ?? "empresa_user") as InviteRole,
    status: (raw.status ?? "active") as AccessUser["status"],
    mfaEnabled: Boolean(raw.mfa_enabled ?? false),
    lastSignInAt: raw.last_sign_in_at ? String(raw.last_sign_in_at) : null,
    invitedBy: String(raw.invited_by ?? ""),
  };
}

export function useAdminAccess() {
  const [companyUsers, setCompanyUsers] = useState<AccessUser[]>(adminCompanyUsersMocks);
  const [superAdmins, setSuperAdmins] = useState<AccessUser[]>(adminSuperAdminsMocks);
  const [invitations, setInvitations] = useState<PendingInvitation[]>(adminInvitationsMocks);
  const [isLoading, setIsLoading] = useState(true);

  // Load users from real backend on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    adminApi
      .getUsers()
      .then((raw) => {
        if (cancelled) return;
        if (raw.length > 0) {
          const mapped = raw.map(mapUser);
          const admins = mapped.filter(
            (u) => u.role === "super_admin" || u.role === "empresa_admin",
          );
          const company = mapped.filter(
            (u) => u.role !== "super_admin",
          );
          setSuperAdmins(admins.filter((u) => u.role === "super_admin"));
          setCompanyUsers(company);
        }
      })
      .catch(() => {
        // keep mocks on error
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateUser = useCallback((id: string, patch: Partial<AccessUser>) => {
    const apply = (prev: AccessUser[]) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u));
    setCompanyUsers(apply);
    setSuperAdmins(apply);
  }, []);

  const setStatus = useCallback(
    (id: string, status: AccessUser["status"]) => updateUser(id, { status }),
    [updateUser],
  );

  const setRole = useCallback(
    (id: string, role: InviteRole) => {
      // Optimistic update
      updateUser(id, { role });
      // Sync to backend
      adminApi.changeUserRole(id, role).catch(() => {
        toast.error("No se pudo cambiar el rol del usuario");
      });
    },
    [updateUser],
  );

  const resetMfa = useCallback(
    (id: string) => updateUser(id, { mfaEnabled: false, status: "pending_mfa" }),
    [updateUser],
  );

  const resendInvitation = useCallback((id: string) => {
    setInvitations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              invitedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),
              status: "pending",
            }
          : i,
      ),
    );
  }, []);

  const revokeInvitation = useCallback((id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const stats = {
    total: companyUsers.length + superAdmins.length,
    active:
      companyUsers.filter((u) => u.status === "active").length +
      superAdmins.filter((u) => u.status === "active").length,
    pending: invitations.filter((i) => i.status === "pending").length,
    superAdmins: superAdmins.length,
  };

  return {
    companyUsers,
    superAdmins,
    invitations,
    setStatus,
    setRole,
    resetMfa,
    resendInvitation,
    revokeInvitation,
    stats,
    isLoading,
  };
}
