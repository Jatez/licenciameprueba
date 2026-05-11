import type { ReactNode } from "react";

export interface LicensingWizardStepProps {
  /** Hint for the wizard footer about whether "Next" is allowed. */
  canAdvance?: boolean;
  /** Tooltip text shown on a disabled "Next" button. */
  nextDisabledReason?: string | null;
}

export interface StepConfig {
  step: 1 | 2 | 3 | 4;
  label: string;
  body: ReactNode;
  canAdvance: boolean;
  nextDisabledReason: string | null;
}
