import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck, UserCog, PauseCircle, PlayCircle } from "lucide-react";
import { accessStrings } from "../strings";
import type { AccessUser } from "../types";

interface Props {
  user: AccessUser;
  onChangeRole: (u: AccessUser) => void;
  onSuspend: (u: AccessUser) => void;
  onReactivate: (u: AccessUser) => void;
  onResetMfa: (u: AccessUser) => void;
}

export function AccessUserRowActions({
  user,
  onChangeRole,
  onSuspend,
  onReactivate,
  onResetMfa,
}: Props) {
  const t = accessStrings.rowActions;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Acciones">
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => onChangeRole(user)}>
          <UserCog className="h-4 w-4" aria-hidden="true" />
          {t.changeRole}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onResetMfa(user)}>
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          {t.resetMfa}
        </DropdownMenuItem>
        {user.status === "suspended" ? (
          <DropdownMenuItem onSelect={() => onReactivate(user)}>
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            {t.reactivate}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => onSuspend(user)}>
            <PauseCircle className="h-4 w-4" aria-hidden="true" />
            {t.suspend}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
