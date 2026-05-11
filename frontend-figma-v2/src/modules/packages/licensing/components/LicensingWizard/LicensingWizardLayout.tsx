import type { ReactNode } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import { useHeadroom } from "@/shared/hooks";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { LicensingWizardStepper } from "./LicensingWizardStepper";
import { LicensingWizardBreadcrumb } from "./LicensingWizardBreadcrumb";
import type { WizardStep } from "@/stores/licensingWizardStore";

interface Props {
  currentStep: WizardStep;
  trackId: string;
  trackTitle?: string;
  onCancelClick: () => void;
  body: ReactNode;
  footer: ReactNode;
}

/**
 * Wizard shell — breadcrumb "Volver al track" + header (Cancel · Title · Help)
 * + stepper, todo apilado en un único contenedor sticky con headroom unificado.
 * Footer sticky abajo (siempre visible — sin headroom).
 *
 * Ambas barras van **edge-to-edge del BodyCard** (los negative margins
 * `-mx-4 -mt-14 / -mx-10 -mt-12` cancelan exactamente el padding del
 * BodyCard `px-4 pt-14 / md:px-10 md:py-12`). El contenido interno se
 * mantiene en `max-w-3xl` para preservar la silueta legible del wizard.
 */
export function LicensingWizardLayout({
  currentStep,
  trackId,
  trackTitle,
  onCancelClick,
  body,
  footer,
}: Props) {
  const { isVisible: isHeaderVisible } = useHeadroom();

  return (
    <section
      role="region"
      aria-label={`${licensingStrings.wizard.title} — ${licensingStrings.wizard.steps[currentStep]}`}
      className="flex w-full flex-col"
    >
      {/* Sticky stack: breadcrumb + frosted header (headroom unificado). */}
      <div
        className="sticky top-0 z-20 -mx-4 -mt-14 md:-mx-10 md:-mt-12 transition-transform duration-300 ease-in-out will-change-transform"
        style={{ transform: `translateY(${isHeaderVisible ? "0" : "-100%"})` }}
      >
        <FrostedHeader
          sticky={false}
          position="top"
          intensity="default"
          className="pt-14 md:pt-12"
        >
          <LicensingWizardBreadcrumb trackId={trackId} trackTitle={trackTitle} />
        </FrostedHeader>
        <FrostedHeader
          sticky={false}
          position="top"
          intensity="default"
          className="px-4 pb-4 md:px-10 md:pb-6"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            <header className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelClick}
                aria-label={licensingStrings.wizard.cancel}
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">{licensingStrings.wizard.cancel}</span>
              </Button>
              <h1 className="text-base font-semibold text-foreground sm:text-lg">
                {licensingStrings.wizard.title}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                aria-label={licensingStrings.wizard.help}
                onClick={() => undefined}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">{licensingStrings.wizard.help}</span>
              </Button>
            </header>
            <LicensingWizardStepper currentStep={currentStep} />
          </div>
        </FrostedHeader>
      </div>

      {/* Body: ancho legible + padding-bottom para que el footer sticky no tape el último item. */}
      <div className="mx-auto w-full max-w-3xl px-0 py-6 pb-24">{body}</div>

      {/* Frosted bottom: footer de acciones siempre visible. */}
      <FrostedHeader
        position="bottom"
        intensity="default"
        className="-mx-4 -mb-6 px-4 pt-4 pb-4 md:-mx-10 md:-mb-12 md:px-10 md:pt-6 md:pb-8"
      >
        <div className="mx-auto w-full max-w-3xl">{footer}</div>
      </FrostedHeader>
    </section>
  );
}
