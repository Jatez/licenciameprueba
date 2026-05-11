import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PlatformIcon } from "@/modules/monitoring/tracking/components/shared/PlatformIcon";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { socialStrings } from "@/modules/social/strings";
import { useSocialAccounts } from "@/modules/social/hooks";
import type { SocialPlatformF06 } from "@/api/types";
import { ConnectFlowDialog } from "../ConnectFlow";
import { ManageAccountsList } from "./ManageAccountsList";
import { filterByPlatform } from "./ManageAccounts.utils";
import { AccountFeedPreview } from "../AccountFeedPreview/AccountFeedPreview";

interface ManageAccountsDrawerProps {
  /** When non-null, the drawer is open for that platform. */
  platform: SocialPlatformF06 | null;
  onClose: () => void;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function ManageAccountsDrawer({ platform, onClose }: ManageAccountsDrawerProps) {
  const open = platform !== null;
  const { data, isLoading } = useSocialAccounts();
  const [addingFor, setAddingFor] = useState<SocialPlatformF06 | null>(null);

  const platformLabel = platform
    ? trackingStrings.syncStatus.platformLabels[platform]
    : "";
  const accounts = platform ? filterByPlatform(data, platform) : [];

  return (
    <>
      <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
        <SheetContent className="w-full sm:max-w-md flex flex-col gap-5">
          <SheetHeader className="space-y-3">
            <div className="flex items-center gap-3">
              {platform && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lm-gray-100">
                  <PlatformIcon platform={platform} size={24} aria-hidden="true" />
                </div>
              )}
              <div className="flex flex-col gap-1 text-left">
                <SheetTitle>
                  {interpolate(socialStrings.manage.title, { platform: platformLabel })}
                </SheetTitle>
                <SheetDescription>
                  {interpolate(socialStrings.manage.subtitle, { platform: platformLabel })}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-4">
            {platform && (
              <ManageAccountsList
                platform={platform}
                accounts={accounts}
                isLoading={isLoading}
              />
            )}
            {accounts[0] && (
              <AccountFeedPreview account={accounts[0]} />
            )}
          </div>

          {platform && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setAddingFor(platform)}
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              {interpolate(socialStrings.manage.addAnother, { platform: platformLabel })}
            </Button>
          )}
        </SheetContent>
      </Sheet>

      <ConnectFlowDialog platform={addingFor} onClose={() => setAddingFor(null)} />
    </>
  );
}
