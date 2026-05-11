export type InviteRole = "empresa_admin" | "empresa_user" | "super_admin";

export type AccessUserStatus = "active" | "suspended" | "pending_mfa";
export type InvitationStatus = "pending" | "expired" | "accepted";

export interface InviteUserPayload {
  email: string;
  fullName: string;
  company: string;
  role: InviteRole;
  language: "es" | "en";
  forceMfa: boolean;
}

export interface AccessUser {
  id: string;
  fullName: string;
  email: string;
  company: string;
  role: InviteRole;
  status: AccessUserStatus;
  mfaEnabled: boolean;
  lastSignInAt: string | null;
  invitedBy: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  fullName: string;
  company: string;
  role: InviteRole;
  invitedAt: string;
  invitedBy: string;
  forceMfa: boolean;
  status: InvitationStatus;
  expiresAt: string;
}

export const ACCESS_COMPANIES = [
  "Equipo Licénciame",
  "Rappi Colombia",
  "Banco Andino",
  "Postobón S.A.",
  "Tiendas D1",
  "Bavaria S.A.",
  "Grupo Éxito",
  "Tiendas Ara",
];
