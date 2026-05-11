import { useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accessStrings } from "../strings";
import type { AccessUser, InviteRole } from "../types";

interface Props {
  user: AccessUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, role: InviteRole) => void;
}

const ROLES: InviteRole[] = ["empresa_user", "empresa_admin", "super_admin"];

export function ChangeRoleDialog({ user, open, onOpenChange, onConfirm }: Props) {
  const t = accessStrings.changeRole;
  const [role, setRole] = useState<InviteRole>("empresa_user");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  if (user && role !== user.role && open === false) {
    // no-op: role state kept until user opens again
  }

  const handleClose = (next: boolean) => {
    if (!next) {
      setRole(user.role);
      setSubmitting(false);
    }
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    onConfirm(user.id, role);
    toast.success(accessStrings.toasts.roleChanged);
    handleClose(false);
  };

  const isDangerous = role === "super_admin" && user.role !== "super_admin";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) setRole(user.role);
        handleClose(o);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <p className="font-semibold text-foreground">{user.fullName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="space-y-1.5">
            <Label>Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v as InviteRole)}>
              <SelectTrigger aria-label="Rol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {accessStrings.roles[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isDangerous && (
            <div className="flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              <p className="text-xs text-foreground/80">{t.warning}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleClose(false)} disabled={submitting}>
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || role === user.role}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {t.submitting}
              </>
            ) : (
              t.submit
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
