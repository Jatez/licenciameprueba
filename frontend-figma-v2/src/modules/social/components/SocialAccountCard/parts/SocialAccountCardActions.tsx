import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socialStrings } from "@/modules/social/strings";
import type { AccountUIState } from "../SocialAccountCard.utils";

export type AccountMenuAction = "view_details" | "sync_now" | "disconnect";

interface SocialAccountCardActionsProps {
  state: AccountUIState;
  onPrimary: () => void;
  onMenu: (action: AccountMenuAction) => void;
}

const PRIMARY_LABEL: Record<AccountUIState, string> = {
  not_connected: socialStrings.card.actions.connect,
  connected: socialStrings.card.actions.manage,
  token_expired: socialStrings.card.actions.reconnect,
  error: socialStrings.card.actions.retry,
  permissions_revoked: socialStrings.card.actions.reAuthorize,
  duplicate_account: socialStrings.card.actions.contactSupport,
};

const PRIMARY_VARIANT: Record<AccountUIState, "default" | "outline"> = {
  not_connected: "default",
  connected: "outline",
  token_expired: "default",
  error: "default",
  permissions_revoked: "default",
  duplicate_account: "outline",
};

export function SocialAccountCardActions({ state, onPrimary, onMenu }: SocialAccountCardActionsProps) {
  const showMenu = state !== "not_connected";

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={PRIMARY_VARIANT[state]}
        onClick={onPrimary}
        className="min-h-[44px] px-5"
      >
        {PRIMARY_LABEL[state]}
      </Button>

      {showMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              aria-label={socialStrings.card.actions.moreOptions}
              className="min-h-[44px] min-w-[44px]"
            >
              <MoreHorizontal aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onMenu("view_details")}>
              {socialStrings.card.menu.viewDetails}
            </DropdownMenuItem>
            {state === "connected" && (
              <DropdownMenuItem onClick={() => onMenu("sync_now")}>
                {socialStrings.card.menu.syncNow}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onMenu("disconnect")}
              className="text-destructive focus:text-destructive"
            >
              {socialStrings.card.menu.disconnect}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
