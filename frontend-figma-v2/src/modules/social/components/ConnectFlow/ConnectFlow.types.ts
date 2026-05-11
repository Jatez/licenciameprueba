import type { SocialPlatformF06 } from "@/api/types";

/**
 * State machine for the simulated OAuth flow.
 *
 * Happy path:
 *   consent → oauth → oauth-loading → success-syncing → success-done
 *
 * Reconnect path skips consent:
 *   reconnect-intro → oauth → oauth-loading → success-syncing → success-done
 *
 * Edge-case branches (terminal, free to close):
 *   consent → popup-blocked
 *   oauth → permissions-denied
 *   oauth-loading → account-taken
 */
export type FlowStep =
  | "consent"
  | "reconnect-intro"
  | "oauth"
  | "oauth-loading"
  | "success-syncing"
  | "success-done"
  | "permissions-denied"
  | "popup-blocked"
  | "account-taken";

export type FlowMode = "connect" | "reconnect";

export interface MockConnectionResult {
  username: string;
  displayName: string;
  avatarInitial: string;
  postsFound: number;
  connectedAt: string;
}

import type { SocialAccount } from "@/api/types";

export interface ConnectFlowDialogProps {
  /** When set, the dialog opens for that platform. Null closes the dialog. */
  platform: SocialPlatformF06 | null;
  /** Called when the dialog should close (cancel, ESC, or after "Listo"). */
  onClose: () => void;
  /** Defaults to "connect". When "reconnect", `existingAccount` is required. */
  mode?: FlowMode;
  existingAccount?: SocialAccount | null;
}
