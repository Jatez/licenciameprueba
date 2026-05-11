import { Link } from "react-router-dom";
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

type SessionExpiredModalProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * MOCK ONLY — visual modal for the "session expired" edge case.
 * Mount it where a real session listener will eventually emit `expired`.
 */
export function SessionExpiredModal({ open, onClose }: SessionExpiredModalProps) {
  const t = authStrings.sessionExpired;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t.secondary}
          </Button>
          <Button asChild>
            <Link to="/login" onClick={onClose}>
              {t.primary}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
