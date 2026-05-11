import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authStrings } from "@/modules/auth/strings";

type AutoLogoutWarningModalProps = {
  open: boolean;
  onKeep: () => void;
  onLogout: () => void;
};

/**
 * MOCK ONLY — inactivity warning. Wire `useIdleLogoutWarning` to drive `open`
 * once a real auth shell exists.
 */
export function AutoLogoutWarningModal({
  open,
  onKeep,
  onLogout,
}: AutoLogoutWarningModalProps) {
  const t = authStrings.autoLogout;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onKeep()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onLogout}>
            {t.close}
          </Button>
          <Button onClick={onKeep}>{t.keep}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
