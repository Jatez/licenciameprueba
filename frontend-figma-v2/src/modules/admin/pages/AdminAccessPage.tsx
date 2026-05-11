import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/modules/admin";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InviteUserDialog,
  AccessStats,
  AccessUsersTable,
  AccessInvitationsTable,
  ChangeRoleDialog,
  ResetMfaDialog,
  useAdminAccess,
  accessStrings,
  type AccessUser,
} from "@/modules/admin/access";

export default function AdminAccess() {
  const t = accessStrings.page;
  const {
    companyUsers,
    superAdmins,
    invitations,
    setStatus,
    setRole,
    resetMfa,
    resendInvitation,
    revokeInvitation,
    stats,
  } = useAdminAccess();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState<AccessUser | null>(null);
  const [mfaTarget, setMfaTarget] = useState<AccessUser | null>(null);

  const handleSuspend = (u: AccessUser) => {
    setStatus(u.id, "suspended");
    toast.success(accessStrings.toasts.suspend);
  };
  const handleReactivate = (u: AccessUser) => {
    setStatus(u.id, "active");
    toast.success(accessStrings.toasts.reactivate);
  };
  const handleResend = (id: string) => {
    resendInvitation(id);
    toast.success(accessStrings.toasts.invitationResent);
  };
  const handleRevoke = (id: string) => {
    revokeInvitation(id);
    toast.success(accessStrings.toasts.invitationRevoked);
  };

  return (
    <>
      <AdminPageTitle
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button onClick={() => setInviteOpen(true)} aria-label={t.inviteCta}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            {t.inviteCta}
          </Button>
        }
      />

      <div className="space-y-6">
        <AccessStats stats={stats} />

        <Tabs defaultValue="company" className="space-y-4">
          <TabsList>
            <TabsTrigger value="company">{accessStrings.tabs.companyUsers}</TabsTrigger>
            <TabsTrigger value="super">{accessStrings.tabs.superAdmins}</TabsTrigger>
            <TabsTrigger value="invitations">
              {accessStrings.tabs.invitations}
              {invitations.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {invitations.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <AccessUsersTable
              rows={companyUsers}
              onChangeRole={setRoleTarget}
              onSuspend={handleSuspend}
              onReactivate={handleReactivate}
              onResetMfa={setMfaTarget}
            />
          </TabsContent>

          <TabsContent value="super">
            <AccessUsersTable
              rows={superAdmins}
              showCompany={false}
              onChangeRole={setRoleTarget}
              onSuspend={handleSuspend}
              onReactivate={handleReactivate}
              onResetMfa={setMfaTarget}
            />
          </TabsContent>

          <TabsContent value="invitations">
            <AccessInvitationsTable
              rows={invitations}
              onResend={handleResend}
              onRevoke={handleRevoke}
            />
          </TabsContent>
        </Tabs>
      </div>

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <ChangeRoleDialog
        user={roleTarget}
        open={!!roleTarget}
        onOpenChange={(o) => !o && setRoleTarget(null)}
        onConfirm={setRole}
      />
      <ResetMfaDialog
        user={mfaTarget}
        open={!!mfaTarget}
        onOpenChange={(o) => !o && setMfaTarget(null)}
        onConfirm={resetMfa}
      />
    </>
  );
}
